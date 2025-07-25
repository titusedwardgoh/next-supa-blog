import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // Use service role only in server-side scripts
);

const jsonFilePath = 'src/lib/blogPosts.JSON'; // Change this if your file has a different name

async function uploadData() {
  const raw = fs.readFileSync(jsonFilePath, 'utf-8');
  const posts = JSON.parse(raw);

  for (const post of posts) {
    // 1. Insert into posts table
    const { data: insertedPost, error: postError } = await supabase
      .from('posts')
      .insert({
        slug: post.slug,
        title: post.title,
        description: post.description,
        date: new Date(post.date),
      })
      .select()
      .single();

    if (postError) {
      console.error(`❌ Error inserting post "${post.slug}":`, postError);
      continue;
    }

    const postId = insertedPost.id;

    // 2. Insert images
    if (post.images && post.images.length > 0) {
      const imageRows = post.images.map((img) => ({
        post_id: postId,
        url: img.url,
        width: img.width,
        height: img.height,
      }));

      const { error: imageError } = await supabase.from('images').insert(imageRows);
      if (imageError) {
        console.error(`❌ Error inserting images for "${post.slug}":`, imageError);
      }
    }

    // 3. Insert body paragraphs
    if (post.body && post.body.length > 0) {
      const bodyRows = post.body.map((paragraph, index) => ({
        post_id: postId,
        para_index: index,
        content: paragraph,
      }));

      const { error: bodyError } = await supabase.from('body').insert(bodyRows);
      if (bodyError) {
        console.error(`❌ Error inserting body for "${post.slug}":`, bodyError);
      }
    }

    console.log(`✅ Uploaded post: "${post.slug}"`);
  }

  console.log('🎉 Upload completed!');
}

uploadData();
