import Image from "next/image";
import Link from "next/link";

export default function PostCard({ title, description, date, images, body, slug }) {
  const isPriority = slug === "post1";
  const hasImage = images && images.length > 0 && images[0]?.url;

  return (
    <div className="bg-base-200 pb-5">
      {hasImage && (
        <Link href={`/posts/${slug}`}>
          <Image
            src={images[0].url}
            width={images[0].width}
            height={images[0].height}
            alt={slug}
            className="cursor-pointer"
            priority={isPriority}
          />
        </Link>
      )}
      <div className="flex flex-col items-center gap-5 mt-5 px-5">
        <h2 className="text-2xl font-bold text-center">{title}</h2>
        <div className="text-center px-10 text-lg line-clamp-2">
          {body && Array.isArray(body) && body.length > 0 ? (
            body.map((para, index) => (
              <p key={index} className="mb-3">
                {para.content}
              </p>
            ))
          ) : (
            <p>{description}</p> // fallback to description if no body
          )}
        </div>
        <Link href={`/posts/${slug}`}>
          <button className="btn btn-primary">Read More</button>
        </Link>
      </div>
    </div>
  );
}
