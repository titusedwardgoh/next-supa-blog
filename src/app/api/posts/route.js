import { supabaseAdmin } from '@/lib/supabaseAdmin'

// GET /api/posts - fetch latest 20 posts
export async function GET() {
  try {
    const { data: posts, error } = await supabaseAdmin
      .from('posts')
      .select(`
        *,
        images(*),
        body(*)
      `)
      // .eq('visibility', 'public') // Reverted: show all posts
      .order('date', { ascending: false })
      .limit(20)

    if (error) throw error

    return new Response(JSON.stringify(posts), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (e) {
    console.error('Failed to fetch posts:', e)
    return new Response(
      JSON.stringify({ error: 'Failed to fetch posts' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}

// POST /api/posts - create new post

export async function POST(request) {
  try {
    const payload = await request.json()
    let { slug, title, description, date, images = [], body = [] } = payload

    console.log('📥 Received payload:', payload)

    // Auto-unique slug logic
    const baseSlug = slug
    let uniqueSlug = baseSlug
    let counter = 1

    while (true) {
      const { data: existingPost, error } = await supabaseAdmin
        .from('posts')
        .select('id')
        .eq('slug', uniqueSlug)
        .maybeSingle()

      if (error) throw error

      if (!existingPost) {
        // slug is unique, break out of loop
        break
      }

      // slug exists, append counter and retry
      uniqueSlug = `${baseSlug}-${counter++}`
    }

    // Insert post with uniqueSlug
    const { data: postData, error: postError } = await supabaseAdmin
      .from('posts')
      .insert([{ slug: uniqueSlug, title, description, date, user_id: payload.user_id }])
      .select('*')
      .single()

    if (postError) {
      console.error('❌ Post insert error:', postError)
      throw postError
    }

    const postId = postData.id
    if (!postId) throw new Error('Post ID missing after insert')

    // Insert images if any
    if (images.length > 0) {
      const imagePayload = images.map(img => ({
        post_id: postId,
        url: img.url,
        width: img.width,
        height: img.height,
      }))

      console.log('🖼️ Image payload:', imagePayload)

      const { error: imageError } = await supabaseAdmin
        .from('images')
        .insert(imagePayload)
        .select('*')

      if (imageError) {
        console.error('❌ Image insert error:', imageError)
        throw imageError
      }
    }

    // Insert body paragraphs if any
    if (body.length > 0) {
      const bodyPayload = body.map((text, index) => ({
        post_id: postId,
        para_index: index,
        content: text,
      }))

      console.log('📄 Body payload:', bodyPayload)

      const { error: bodyError } = await supabaseAdmin
        .from('body')
        .insert(bodyPayload)
        .select('*')

      if (bodyError) {
        console.error('❌ Body insert error:', bodyError)
        throw bodyError
      }
    }

    return new Response(JSON.stringify({ success: true, postId, slug: uniqueSlug }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (e) {
    console.error('🔥 Failed to create post:', e)
    return new Response(
      JSON.stringify({ error: e.message || 'Failed to create post' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}
