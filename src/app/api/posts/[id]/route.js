import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

// Helper to extract path from Supabase public URL (without bucket name)
function getStoragePathFromUrl(url) {
  try {
    const parsedUrl = new URL(url)
    const parts = parsedUrl.pathname.split('/')
    const objectIndex = parts.findIndex(part => part === 'object')
    if (objectIndex !== -1) {
      const fullPath = parts.slice(objectIndex + 2).join('/') // e.g. blog-pictures/folder/file.png
      return fullPath.replace(/^blog-pictures\//, '') // remove bucket name
    }
    return null
  } catch {
    return null
  }
}

// GET: Retrieve a post by slug (unchanged)
export async function GET(request, context) {
  try {
    const { id: slug } = context.params

    const { data: post, error } = await supabaseAdmin
      .from('posts')
      .select(`*, images(*), body(*)`)
      .eq('slug', slug)
      .single()

    if (error || !post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    return NextResponse.json(post)
  } catch (e) {
    return NextResponse.json(
      { error: 'Failed to fetch post', details: e.message },
      { status: 500 }
    )
  }
}

// DELETE: Remove post, image files, image records, and body
export async function DELETE(request, context) {
  const { id: slug } = context.params

  const { data: post } = await supabaseAdmin
    .from('posts')
    .select('*, images(*), body(*)')
    .eq('slug', slug)
    .single()

  if (!post) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 })
  }

  const postId = post.id

  // Delete image files from Supabase Storage
  if (post.images?.length) {
    for (const image of post.images) {
      const path = getStoragePathFromUrl(image.url)
      if (path) {
        await supabaseAdmin.storage
          .from('blog-pictures')
          .remove([path])
      }
    }

    // Delete image rows from DB
    await supabaseAdmin
      .from('images')
      .delete()
      .eq('post_id', postId)
  }

  // Delete body if exists
  if (post.body) {
    await supabaseAdmin
      .from('body')
      .delete()
      .eq('post_id', postId)
  }

  // Delete post
  await supabaseAdmin
    .from('posts')
    .delete()
    .eq('id', postId)

  return NextResponse.json({ message: 'Post deleted' })
}

// PUT: Update post by slug and remove removed images
export async function PUT(request, context) {
  try {
    const { id: slug } = await context.params;
    const data = await request.json();

    // Fetch existing post and its images
    const { data: existingPost, error: fetchError } = await supabaseAdmin
      .from('posts')
      .select('*, images(*)')
      .eq('slug', slug)
      .single();

    if (fetchError || !existingPost) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const postId = existingPost.id;
    const oldImages = existingPost.images || [];
    const newImages = data.images || [];

    // Handle image deletion case: if newImages empty, delete all old images
    if (newImages.length === 0 && oldImages.length > 0) {
      for (const image of oldImages) {
        try {
          const path = getStoragePathFromUrl(image.url);
          if (path) {
            await supabaseAdmin.storage.from('blog-pictures').remove([path]);
          }
          await supabaseAdmin.from('images').delete().eq('id', image.id);
        } catch (err) {
          console.error('Failed to delete image:', image.url, err.message);
        }
      }
    } else {
      // Identify removed images compared to new
      const removedImages = oldImages.filter(
        oldImg => !newImages.some(newImg => newImg.url === oldImg.url)
      );

      // Delete removed image files and rows
      for (const image of removedImages) {
        try {
          const path = getStoragePathFromUrl(image.url);
          if (path) {
            await supabaseAdmin.storage.from('blog-pictures').remove([path]);
          }
          await supabaseAdmin.from('images').delete().eq('id', image.id);
        } catch (err) {
          console.error('Failed to delete image:', image.url, err.message);
        }
      }

      // Insert newly added images
      const addedImages = newImages.filter(
        newImg => !oldImages.some(oldImg => oldImg.url === newImg.url)
      );

      for (const image of addedImages) {
        try {
          await supabaseAdmin.from('images').insert({
              post_id: postId,
              url: image.url,
              width: image.width || null,
              height: image.height || null,
          });
        } catch (err) {
          console.error('Failed to insert image:', image.url, err.message);
        }
      }
    }

    // Replace old body paragraphs by deleting and inserting with para_index
    try {
      await supabaseAdmin.from('body').delete().eq('post_id', postId);

      if (Array.isArray(data.body)) {
        // data.body is expected to be an array of paragraph strings
        const insertData = data.body.map((content, index) => ({
          post_id: postId,
          content,
          para_index: index,
        }));

        const { error: insertError } = await supabaseAdmin.from('body').insert(insertData);

        if (insertError) {
          return NextResponse.json({ error: 'Failed to insert new body paragraphs', details: insertError.message }, { status: 500 });
        }
      } else if (data.body?.content) {
        // fallback single paragraph object support
        const { error: insertError } = await supabaseAdmin.from('body').insert({
          post_id: postId,
          content: data.body.content,
          para_index: 0,
        });

        if (insertError) {
          return NextResponse.json({ error: 'Failed to insert new body paragraph', details: insertError.message }, { status: 500 });
        }
      }
    } catch (err) {
      return NextResponse.json({ error: 'Failed to replace body paragraphs', details: err.message }, { status: 500 });
    }

    // Update post main fields ONLY if changed
    const fieldsToUpdate = {};
    if (data.title !== existingPost.title) fieldsToUpdate.title = data.title;
    if (data.description !== existingPost.description) fieldsToUpdate.description = data.description;
    if (data.visibility !== existingPost.visibility) fieldsToUpdate.visibility = data.visibility;
    if (data.date && data.date !== existingPost.date) fieldsToUpdate.date = data.date;

    if (Object.keys(fieldsToUpdate).length > 0) {
      const { error: updateError } = await supabaseAdmin
        .from('posts')
        .update(fieldsToUpdate)
        .eq('id', postId);

      if (updateError) {
        return NextResponse.json({ error: 'Failed to update post', details: updateError.message }, { status: 500 });
      }
    }

    return NextResponse.json({ message: 'Post updated successfully' });
  } catch (e) {
    return NextResponse.json(
      { error: 'Unexpected error during update', details: e.message },
      { status: 500 }
    );
  }
}
