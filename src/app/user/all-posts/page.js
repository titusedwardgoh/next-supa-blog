import AllPosts from "./AllPosts";

export default async function PostsPage() {
  // Determine the base URL:
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||           // Use this if you've set it
    (process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`) || // Use Vercel's auto-set domain
    'http://localhost:3000';                      // Fallback for local dev

  const response = await fetch(`${baseUrl}/api/posts`, {
    cache: 'no-store', // Optional: avoids caching issues during development
  });

  if (!response.ok) {
    throw new Error('Failed to fetch posts');
  }

  const posts = await response.json();

  return <AllPosts initialPosts={posts} />;
}
