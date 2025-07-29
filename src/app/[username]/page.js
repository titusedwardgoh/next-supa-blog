import Image from "next/image";
import Link from "next/link";
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export default async function UserBlogPage({ params }) {
  const { username } = params;

  try {
    // First, find the user by username
    const { data: user, error: userError } = await supabaseAdmin
      .from('profiles') // You'll need to create this table
      .select('id, username, full_name, bio')
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

    // Then fetch all public posts by this user
    const { data: posts, error: postsError } = await supabaseAdmin
      .from('posts')
      .select(`
        *,
        images(*),
        body(*)
      `)
      .eq('user_id', user.id)
      .eq('visibility', 'public')
      .order('date', { ascending: false });

    if (postsError) {
      throw new Error('Failed to fetch posts');
    }

    return (
      <div className="pt-20">
        {/* User Profile Header */}
        <div className="text-center mb-10 px-5">
          <h1 className="text-3xl font-bold mb-2">{user.full_name || username}</h1>
          {user.bio && (
            <p className="text-gray-600 max-w-2xl mx-auto">{user.bio}</p>
          )}
          <p className="text-sm text-gray-500 mt-2">
            {posts.length} public post{posts.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Posts Grid */}
        <div className="px-5 max-w-4xl mx-auto">
          {posts.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500">No public posts yet.</p>
            </div>
          ) : (
            <div className="grid gap-8">
              {posts.map((post) => {
                const image = post.images?.[0];
                return (
                  <article key={post.id} className="bg-base-200 rounded-lg overflow-hidden shadow-md">
                    {image && (
                      <Link href={`/posts/${post.slug}`}>
                        <Image
                          src={image.url}
                          width={image.width}
                          height={image.height}
                          alt={post.title}
                          className="w-full h-48 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                        />
                      </Link>
                    )}
                    
                    <div className="p-6">
                      <h2 className="text-2xl font-bold mb-2">
                        <Link 
                          href={`/posts/${post.slug}`}
                          className="hover:text-primary transition-colors"
                        >
                          {post.title}
                        </Link>
                      </h2>
                      
                      <p className="text-gray-600 mb-3">{post.description}</p>
                      
                      <div className="text-sm text-gray-500 mb-4">
                        {new Date(post.date).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </div>
                      
                      <div className="text-gray-700 line-clamp-3">
                        {post.body && Array.isArray(post.body) && post.body.length > 0 ? (
                          post.body.slice(0, 2).map((para, index) => (
                            <p key={para.id || index} className="mb-2">
                              {para.content}
                            </p>
                          ))
                        ) : (
                          <p>{post.description}</p>
                        )}
                      </div>
                      
                      <Link href={`/posts/${post.slug}`}>
                        <button className="btn btn-primary mt-4">Read More</button>
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error loading user blog:', error);
    return (
      <div className="pt-20 text-center">
        <h1 className="text-2xl font-bold text-red-600">Error</h1>
        <p className="mt-4">Failed to load the blog.</p>
      </div>
    );
  }
} 