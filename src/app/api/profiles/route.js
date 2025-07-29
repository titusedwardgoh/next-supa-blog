import { supabaseAdmin } from '@/lib/supabaseAdmin';

// GET /api/profiles - get all public profiles
export async function GET() {
  try {
    const { data: profiles, error } = await supabaseAdmin
      .from('profiles')
      .select('id, username, full_name, bio, created_at')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return new Response(JSON.stringify(profiles), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('Failed to fetch profiles:', e);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch profiles' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

// POST /api/profiles - create or update profile
export async function POST(request) {
  try {
    const payload = await request.json();
    const { user_id, username, full_name, bio } = payload;

    if (!user_id || !username) {
      return new Response(
        JSON.stringify({ error: 'User ID and username are required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Check if username is already taken
    const { data: existingProfile, error: checkError } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('username', username)
      .neq('id', user_id) // Exclude current user if updating
      .maybeSingle();

    if (checkError) throw checkError;

    if (existingProfile) {
      return new Response(
        JSON.stringify({ error: 'Username already taken' }),
        {
          status: 409,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Insert or update profile
    const { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .upsert(
        {
          id: user_id,
          username,
          full_name,
          bio,
        },
        { onConflict: 'id' }
      )
      .select()
      .single();

    if (error) throw error;

    return new Response(JSON.stringify(profile), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('Failed to create/update profile:', e);
    return new Response(
      JSON.stringify({ error: e.message || 'Failed to create/update profile' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
} 