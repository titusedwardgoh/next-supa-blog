export default async function PostsPage() {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      (process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`) ||
      'http://localhost:3000';

    const response = await fetch(`${baseUrl}/api/posts`, { cache: 'no-store' });

    if (!response.ok) {
      throw new Error(`Failed to fetch posts: ${response.status}`);
    }

    const posts = await response.json();

    return <AllPosts initialPosts={posts} />;
  } catch (error) {
    console.error('PostsPage error:', error);
    return <div>Sorry, failed to load posts.</div>;
  }
}
