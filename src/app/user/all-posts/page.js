import AllPosts from "./AllPosts";

export default async function PostsPage() {
  
  const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/posts`);

  if (!response.ok) {
    throw new Error('Failed to fetch posts');
  }

  const posts = await response.json();
  return <AllPosts initialPosts={posts} />;
}