'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const [formData, setFormData] = useState({
    username: '',
    full_name: '',
    bio: '',
  });

  useEffect(() => {
    async function fetchUserAndProfile() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.replace('/login');
          return;
        }

        setUser(user);

        // Fetch existing profile if it exists
        const res = await fetch(`/api/profiles/${user.id}`);
        if (res.ok) {
          const profile = await res.json();
          setFormData({
            username: profile.username || '',
            full_name: profile.full_name || '',
            bio: profile.bio || '',
          });
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching user:', error);
        setLoading(false);
      }
    }

    fetchUserAndProfile();
  }, [router]);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (successMessage) setSuccessMessage('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch('/api/profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          ...formData,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || 'Failed to save profile');
        return;
      }

      setSuccessMessage('Profile saved successfully!');
      setTimeout(() => {
        router.push('/user');
      }, 1000);
    } catch (error) {
      alert('Network error saving profile');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div>
      <h1 className="mt-25 font-bold text-3xl text-center mb-10">Profile Setup</h1>
      
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 max-w-xl mx-auto items-center"
      >
        <div className="w-full">
          <label className="label">
            <span className="label-text">Username *</span>
          </label>
          <input
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="your-username"
            className="input input-bordered w-full"
            required
            pattern="[a-z0-9-]+"
            title="Only lowercase letters, numbers, and hyphens allowed"
          />
          <label className="label">
            <span className="label-text-alt">This will be your blog URL: yoursite.com/{formData.username || 'username'}</span>
          </label>
        </div>

        <div className="w-full">
          <label className="label">
            <span className="label-text">Full Name</span>
          </label>
          <input
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            placeholder="Your full name"
            className="input input-bordered w-full"
          />
        </div>

        <div className="w-full">
          <label className="label">
            <span className="label-text">Bio</span>
          </label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Tell us about yourself..."
            rows={4}
            className="textarea textarea-bordered w-full"
          />
        </div>

        <button type="submit" className="btn btn-primary mt-5" disabled={saving}>
          {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </form>

      {successMessage && (
        <p className="text-center mt-4 text-green-600 font-semibold">{successMessage}</p>
      )}

      <div className="mt-8 text-center text-sm text-gray-600">
        <p>Your public blog will be available at:</p>
        <p className="font-mono text-primary">
          {typeof window !== 'undefined' ? window.location.origin : 'yoursite.com'}/{formData.username || 'username'}
        </p>
      </div>
    </div>
  );
} 