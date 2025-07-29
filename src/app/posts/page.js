import PostCard from '../Components/PostCard';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic'; // ensures fetch runs on server at request time

export default async function PostsPage() {
  try {
    // Fetch all public posts
    const { data: posts, error } = await supabaseAdmin
      .from('posts')
      .select(`
        *,
        images(*),
        body(*)
      `)
      .eq('visibility', 'public')
      .order('date', { ascending: false });

    if (error) {
      throw new Error('Failed to fetch posts');
    }

    // Randomize the posts array
    const shuffledPosts = posts.sort(() => Math.random() - 0.5);

    return (
      <main className="mt-20">
        <h1 className="text-3xl text-center pt-10 font-black">Discover Posts</h1>
        <p className="text-center text-gray-600 mt-2 mb-10">Random selection of public posts from our community</p>
        
        <div className="my-10 px-5">
          <div className="flex flex-col gap-5">
            {shuffledPosts.length > 0 ? (
              shuffledPosts.map((post) => (
                <div key={post.id || post.slug}>
                  <PostCard {...post} />
                </div>
              ))
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-500">No public posts available yet.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    );
  } catch (error) {
    console.error('Error fetching posts:', error);
    return (
      <div className="mt-20 text-center">
        <h1 className="text-2xl font-bold text-red-600">Error</h1>
        <p className="mt-4">Sorry, failed to load posts.</p>
      </div>
    );
  }
} 