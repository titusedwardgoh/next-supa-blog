'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function NewPosts() {
  const router = useRouter();

  const [formData, setFormData] = React.useState({
    title: '',
    description: '',
    body: '',
    customDate: '',
    visibility: '', // <-- add this
  });

  const [image, setImage] = React.useState(null);
  const [uploading, setUploading] = React.useState(false);
  const [imageUrl, setImageUrl] = React.useState('');
  const [imageDimensions, setImageDimensions] = React.useState({ width: 0, height: 0 });
  const [successMessage, setSuccessMessage] = React.useState('');

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (successMessage) {
      setSuccessMessage('');
    }
  }

  function handleImageChange(e) {
    const file = e.target.files[0];
    setImage(file);

    if (file) {
      const img = new Image();
      img.src = URL.createObjectURL(file);

      img.onload = () => {
        setImageDimensions({
          width: img.naturalWidth,
          height: img.naturalHeight,
        });
        URL.revokeObjectURL(img.src);
      };
    } else {
      setImageDimensions({ width: 0, height: 0 });
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert('You must be logged in to create a post.');
      return;
    }

    let uploadedImageUrl = '';

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
          console.error('Image upload failed:', uploadData.error);
          alert('Image upload failed');
          setUploading(false);
          return;
        }

        uploadedImageUrl = uploadData.imageUrl;
        setImageUrl(uploadedImageUrl);

        console.log('✅ Image uploaded:', uploadedImageUrl);
      } catch (err) {
        console.error('❌ Upload error:', err);
        alert('Failed to upload image');
        setUploading(false);
        return;
      }
      setUploading(false);
    }

    const slug = formData.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');

    const timestamp = formData.customDate
      ? (() => {
          const dt = new Date(formData.customDate);
          dt.setHours(12, 0, 0, 0);
          return dt.toISOString();
        })()
      : new Date().toISOString();

    const bodyArray = formData.body
      .split(/\n\s*\n|\n/g)
      .map(line => line.trim())
      .filter(line => line.length > 0);

    const postData = {
      slug,
      title: formData.title,
      description: formData.description,
      date: timestamp,
      images: uploadedImageUrl
        ? [
            {
              url: uploadedImageUrl,
              width: imageDimensions.width,
              height: imageDimensions.height,
            },
          ]
        : [],
      body: bodyArray,
      user_id: user.id, // Add user_id to postData
      visibility: formData.visibility,
    };

    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error('Failed to create post:', errorData.error);
        alert('Failed to create post');
        return;
      }

      const result = await res.json();
      console.log('✅ Post created successfully:', result);
      setSuccessMessage('Post created successfully!');

      // Reset form
      setFormData({ title: '', description: '', body: '', customDate: '', visibility: '' });
      setImage(null);
      setImageUrl('');
      setImageDimensions({ width: 0, height: 0 });

      // Redirect after short delay
      setTimeout(() => {
        router.push('/user/all-posts');
      }, 1000);
    } catch (error) {
      console.error('Network error:', error);
      alert('Network error creating post');
    }
  }

  return (
    <div>
      <h1 className="mt-25 font-bold text-3xl text-center mb-10">New Post</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 max-w-xl mx-auto items-center"
      >
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
          type="date"
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

        {imageDimensions.width > 0 && imageDimensions.height > 0 && (
          <p className="text-gray-600 mt-1">
            Image size: {imageDimensions.width} x {imageDimensions.height} px
          </p>
        )}

        <button
          type="submit"
          className="btn btn-primary mt-5"
          disabled={uploading}
        >
          {uploading ? 'Uploading...' : 'Submit Post'}
        </button>
      </form>

      {successMessage && (
        <p className="text-center mt-4 text-green-600 font-semibold">
          {successMessage}
        </p>
      )}

      {imageUrl && (
        <div className="text-center mt-4">
          <p className="text-green-600">Image uploaded successfully!</p>
          <a
            href={imageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            View image
          </a>
        </div>
      )}
    </div>
  );
}
