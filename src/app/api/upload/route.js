import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { v4 as uuidv4 } from 'uuid';

// Disable built-in body parser for file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('image');

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    const fileBuffer = await file.arrayBuffer();

    if (fileBuffer.byteLength > maxSize) {
      return NextResponse.json({ error: 'File size exceeds 5MB limit' }, { status: 400 });
    }

    const buffer = Buffer.from(fileBuffer);
    const ext = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${ext}`;

    const { data, error } = await supabaseAdmin.storage
      .from('blog-pictures')
      .upload(fileName, buffer, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('❌ Supabase Storage upload error:', error);
      return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }

    const imageUrl = supabaseAdmin.storage
      .from('blog-pictures')
      .getPublicUrl(fileName).data.publicUrl;

    return NextResponse.json({
      success: true,
      imageUrl,
      key: fileName,
    });
  } catch (err) {
    console.error('❌ Upload error:', err);
    return NextResponse.json(
      {
        error: 'File upload failed',
        details: process.env.NODE_ENV === 'development' ? err.message : undefined,
      },
      { status: 500 }
    );
  }
}
