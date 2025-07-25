import PostCard from './Components/PostCard'

export default async function Home() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL

  if (!baseUrl) throw new Error('Missing NEXT_PUBLIC_SITE_URL')

  const response = await fetch(`${baseUrl}/api/posts`, { cache: 'no-store' })

  if (!response.ok) {
    throw new Error('Failed to fetch posts')
  }

  const posts = await response.json()

  return (
    <main className="mt-20">
      <h1 className="text-3xl text-center pt-10 font-black">This is a Blog</h1>
      <div className="my-10 px-5">
        <div className="flex flex-col gap-5">
          {posts.map((post) => (
            <div key={post.id || post.slug}>
              <PostCard {...post} />
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
