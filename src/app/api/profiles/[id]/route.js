import { supabaseAdmin } from '@/lib/supabaseAdmin';

// GET /api/profiles/[id] - get a specific profile
export async function GET(request, context) {
  try {
    const { id: userId } = context.params;

    const { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .select('id, username, full_name, bio, created_at')
      .eq('id', userId)
      .single();

    if (error || !profile) {
      return new Response(
        JSON.stringify({ error: 'Profile not found' }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(JSON.stringify(profile), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('Failed to fetch profile:', e);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch profile' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
} 