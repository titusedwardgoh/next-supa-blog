'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from "next/image"

export default function EditPostPage() {
  const router = useRouter();
  const { postslug } = useParams();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    body: '',
    customDate: '',
    visibility: '', // Add visibility to form state
  });
  const [originalDate, setOriginalDate] = useState('');
  const [dateChanged, setDateChanged] = useState(false);

  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [imageKey, setImageKey] = useState('');
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });

  // New state to track if user deleted the image
  const [imageDeleted, setImageDeleted] = useState(false);

  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');

  // Load post data on mount
  useEffect(() => {
    async function fetchPost() {
      try {
        const res = await fetch(`/api/posts/${postslug}`);
        if (!res.ok) throw new Error('Failed to load post');
        const post = await res.json();

        // Join paragraphs sorted by para_index to multiline string for editing
        let joinedBody = '';
        if (Array.isArray(post.body)) {
          joinedBody = post.body
            .sort((a, b) => a.para_index - b.para_index)
            .map(p => p.content)
            .join('\n\n');
        } else if (post.body?.content) {
          joinedBody = post.body.content;
        }

        setFormData({
          title: post.title || '',
          description: post.description || '',
          body: joinedBody,
          customDate: post.date ? new Date(post.date).toISOString().slice(0, 16) : '',
          visibility: post.visibility || '', // Set initial visibility
        });
        setOriginalDate(post.date || '');
        setDateChanged(false);

        if (post.images?.[0]) {
          setImageUrl(post.images[0].url);
          setImageKey(post.images[0].key || '');
          setImageDimensions({
            width: post.images[0].width || 0,
            height: post.images[0].height || 0,
          });
        }

        setLoading(false);
      } catch (error) {
        alert(error.message);
        setLoading(false);
      }
    }

    fetchPost();
  }, [postslug]);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === 'customDate') setDateChanged(true);
    if (successMessage) setSuccessMessage('');
  }

  
function handleImageChange(e) {
  const file = e.target.files[0];
  setImage(file);

  if (file) {
    const img = new window.Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      setImageDimensions({ width: img.naturalWidth, height: img.naturalHeight });
      URL.revokeObjectURL(img.src);
    };
    setImageDeleted(false);
  } else {
    setImageDimensions({ width: 0, height: 0 });
    setImageUrl('');
    setImageKey('');
    setImageDeleted(true);
  }
}

  // New handler for delete image button
  function handleDeleteImage() {
    setImageUrl('');
    setImageKey('');
    setImageDimensions({ width: 0, height: 0 });
    setImage(null);
    setImageDeleted(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    let uploadedImageUrl = imageUrl;
    let uploadedImageKey = imageKey;

    if (image) {
      const imageFormData = new FormData();
      imageFormData.append('image', image);

      setUploading(true);
      try {
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: imageFormData,
        });

        const uploadData = await uploadRes.json();

        if (!uploadRes.ok) {
          alert('Image upload failed: ' + (uploadData.error || 'Unknown error'));
          setUploading(false);
          return;
        }

        uploadedImageUrl = uploadData.imageUrl;
        uploadedImageKey = uploadData.key;
        setImageUrl(uploadedImageUrl);
        setImageKey(uploadedImageKey);
        setImageDeleted(false);
      } catch (err) {
        alert('Failed to upload image');
        setUploading(false);
        return;
      }
      setUploading(false);
    }

    // Generate slug from title
    const slug = formData.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');

    // Format date for storage
    let date = originalDate;
    if (dateChanged && formData.customDate) {
      date = new Date(formData.customDate).toISOString();
    }

    // Split body into paragraphs array for backend
    const bodyArray = formData.body
      .split(/\n\s*\n/)   // split on double newlines for paragraphs
      .map(line => line.trim())
      .filter(line => line.length > 0);

    // Prepare images array based on deletion state
    let imagesToSend = [];

    if (imageDeleted) {
      // User deleted image, send empty array to trigger backend deletion
      imagesToSend = [];
    } else if (uploadedImageUrl) {
      imagesToSend = [
        {
          url: uploadedImageUrl,
          key: uploadedImageKey,
          width: imageDimensions.width,
          height: imageDimensions.height,
        },
      ];
    }

    const postData = {
      slug,
      title: formData.title,
      description: formData.description,
      date,
      images: imagesToSend,
      body: bodyArray,
      visibility: formData.visibility, // Include visibility in update
    };

    try {
      const res = await fetch(`/api/posts/${postslug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert('Failed to update post: ' + (errorData.error || 'Unknown error'));
        return;
      }

      setSuccessMessage('Post updated successfully!');
      setTimeout(() => {
        router.push('/user/all-posts');
      }, 1000);
    } catch (error) {
      alert('Network error updating post');
    }
  }

  if (loading) return <p className="text-center mt-10">Loading post...</p>;

  return (
    <div>
      <h1 className="mt-25 font-bold text-3xl text-center mb-10">Edit Post</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 max-w-xl mx-auto items-center"
      >
        {/* IMAGE PREVIEW ON TOP */}
        {imageUrl && !imageDeleted && (
          <div className="text-center mb-4 w-full">
            <p className="text-green-600 mb-2">Current image:</p>
            <Image
              src={imageUrl}
              alt="Post image"
              width={imageDimensions.width}
              height={imageDimensions.height}
              className="mx-auto rounded shadow-md"
              style={{ maxWidth: '100%', height: 'auto' }}
            />

            <a
              href={imageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline mt-2 inline-block"
            >
              View full image
            </a>
            {imageDimensions.width > 0 && imageDimensions.height > 0 && (
              <p className="text-gray-600 mt-1">
                Image size: {imageDimensions.width} x {imageDimensions.height} px
              </p>
            )}
            <button
              type="button"
              onClick={handleDeleteImage}
              className="btn btn-error mt-2"
            >
              Delete Image
            </button>
          </div>
        )}

        {/* FORM INPUTS */}
        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Title"
          className="input input-bordered w-full"
          required
        />

        <input
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Short description"
          className="input input-bordered w-full"
          required
        />

        <input
          type="datetime-local"
          name="customDate"
          value={formData.customDate}
          onChange={handleChange}
          className="input input-bordered w-full"
        />

        <select
          name="visibility"
          value={formData.visibility}
          onChange={handleChange}
          required
          className="input input-bordered w-full"
        >
          <option value="">Select visibility...</option>
          <option value="public">Public</option>
          <option value="private">Private</option>
        </select>

        <textarea
          name="body"
          value={formData.body}
          onChange={handleChange}
          placeholder="Write your post..."
          rows={8}
          className="textarea textarea-bordered w-full"
          required
        />

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="file-input file-input-bordered w-full"
        />

        <button type="submit" className="btn btn-primary mt-5" disabled={uploading}>
          {uploading ? 'Uploading...' : 'Update Post'}
        </button>
      </form>

      {successMessage && (
        <p className="text-center mt-4 text-green-600 font-semibold">{successMessage}</p>
      )}
    </div>
  );
}
