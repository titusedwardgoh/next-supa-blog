'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function AllPosts({ initialPosts }) {
  const [posts, setPosts] = useState(initialPosts);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);

  const openDeleteModal = (slug) => {
    setPostToDelete(slug);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setPostToDelete(null);
  };

  async function deletePost() {
    if (!postToDelete) return;

    const res = await fetch(`/api/posts/${postToDelete}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      setPosts(posts.filter(post => post.slug !== postToDelete));
    } else {
      const error = await res.json();
      alert("Delete failed: " + (error.error || 'Unknown error'));
    }

    closeDeleteModal();
  }

  return (
    <div className="px-5">
      <h1 className="tracking-wide font-bold p-4 text-center">Your blog posts</h1>
      <div className="space-y-4">
        {posts.map((post, index) => {
          const image = post.images?.[0];

          return (
            <div key={post.slug}>
              <ul className="list bg-base-100 rounded-box shadow-md">
                <li className="list-row flex items-center gap-4 p-4">

                  <div className="flex items-center justify-center w-8 h-8 min-w-[32px] text-lg font-bold text-white bg-primary rounded-full shadow-md select-none mr-3">
                    {index + 1}
                  </div>

                  {image && (
                    <Image
                      className="size-10 rounded-box"
                      src={image.url}
                      width={image.width}
                      height={image.height}
                      alt={post.slug}
                      priority={false}
                    />
                  )}

                  <div className="flex flex-col flex-grow">
                    <div className="font-medium line-clamp-1">{post.title}</div>
                    <div className="text-xs uppercase font-semibold opacity-60">{post.description}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {new Date(post.date).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                  </div>
                  </div>

                  <div className="flex gap-2">
                  <Link href={`/user/${post.slug}/edit`}>
                    <button className="btn btn-square btn-ghost" title="Edit post">
                      <svg className="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                          d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z" />
                      </svg>
                    </button>
                  </Link>

                    <button
                      onClick={() => openDeleteModal(post.slug)}
                      className="btn btn-square btn-ghost"
                      title="Delete post"
                    >
                      <svg className="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M8 6V4h8v2m-1 0v14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V6h10Z" />
                      </svg>
                    </button>
                  </div>
                </li>
              </ul>
            </div>
          );
        })}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-black/10 backdrop-blur-sm"
            onClick={closeDeleteModal}
          />
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 relative z-10 max-w-xs mx-4">
            <h3 className="text-lg font-semibold mb-3">Delete post?</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              This will permanently remove the post and its image from the server.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={closeDeleteModal}
                className="px-3 py-1.5 text-sm rounded-md border border-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={deletePost}
                className="px-3 py-1.5 text-sm rounded-md bg-red-500 text-white hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
