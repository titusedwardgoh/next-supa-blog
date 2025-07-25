import Image from "next/image";

export default async function Page({ params }) {
  const { slug } = await params; 

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (!baseUrl) {
    throw new Error("Missing NEXT_PUBLIC_SITE_URL");
  }

  const res = await fetch(`${baseUrl}/api/posts/${slug}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Post not found");
  }

  const post = await res.json();

  // Safely extract first image if exists
  const firstImage = post.images && post.images.length > 0 ? post.images[0] : null;

  return (
    <div className="pt-20 flex flex-col gap-5 items-center px-5">
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
}
