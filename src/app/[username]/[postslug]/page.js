import Image from "next/image";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export default async function UserPostPage({ params }) {
  const { username, postslug } = await params;

  try {
    // First fetch the user profile
    const { data: user, error: userError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('username', username)
      .single();

    if (userError || !user) {
      return (
        <div className="pt-20 text-center">
          <h1 className="text-2xl font-bold text-red-600">User not found</h1>
          <p className="mt-4">The user &quot;{username}&quot; doesn&apos;t exist.</p>
        </div>
      );
    }

    // Then fetch the specific post by this user
    const { data: post, error: postError } = await supabaseAdmin
      .from('posts')
      .select(`
        *,
        images(*),
        body(*)
      `)
      .eq('user_id', user.id)
      .eq('slug', postslug)
      .eq('visibility', 'public')
      .single();

    if (postError || !post) {
      return (
        <div className="pt-20 text-center">
          <h1 className="text-2xl font-bold text-red-600">Post not found</h1>
          <p className="mt-4">This post doesn&apos;t exist or isn&apos;t public.</p>
        </div>
      );
    }

    // Safely extract first image if exists
    const firstImage = post.images && post.images.length > 0 ? post.images[0] : null;

    return (
      <div className="pt-40 flex flex-col gap-5 items-center px-5">
        {/* Back to user's blog link */}
        <div className="w-full max-w-prose">
          <a 
            href={`/${username}`}
            className="text-primary hover:underline mb-5 inline-block"
          >
            ← Back to {user.full_name || username}&apos;s blog
          </a>
        </div>

        <h1 className="text-3xl text-center pt-10 font-black">{post.title}</h1>

        <h2 className="text-2xl uppercase text-center font-semibold text-error">
          {post.description}
        </h2>

        <h3>
          {typeof post.date === "string"
            ? new Date(post.date).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })
            : ""}
        </h3>

        {firstImage ? (
          <Image
            src={firstImage.url}
            width={firstImage.width}
            height={firstImage.height}
            alt={post.slug}
            className=""
            priority
          />
        ) : (
          <p className="text-gray-500 italic">No image available</p>
        )}

        <div className="flex flex-col gap-10 max-w-prose">
          {post.body && Array.isArray(post.body) && post.body.length > 0 ? (
            post.body.map((line, index) => (
              <p key={line.id || index} className="text-lg">
                {line.content}
              </p>
            ))
          ) : (
            <p>No content available.</p>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error loading user post:', error);
    return (
      <div className="pt-20 text-center">
        <h1 className="text-2xl font-bold text-red-600">Error</h1>
        <p className="mt-4">Failed to load the post.</p>
      </div>
    );
  }
} 