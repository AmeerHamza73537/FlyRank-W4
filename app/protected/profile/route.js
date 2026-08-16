// Purpose: GET /protected/profile
// A locked door with a guard. The client must send their JWT in the header:
//   Authorization: Bearer <token>
// We ask Supabase whether that token is real before returning any user data.

import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request) {
  const authHeader = request.headers.get('authorization');

  // Header must exist and look exactly like "Bearer <token>".
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json(
      { error: 'Access token required' },
      { status: 401 }
    );
  }

  // Cut off the word "Bearer " to get the token itself.
  const token = authHeader.split(' ')[1];

  // "Bearer" with nothing after it is still a missing token.
  if (!token) {
    return NextResponse.json(
      { error: 'Access token required' },
      { status: 401 }
    );
  }

  // The guard inspects the pass: Supabase checks the signature and expiry.
  const { data, error } = await supabase.auth.getUser(token);

  // Expired, tampered with, or simply not a real token.
  if (error || !data.user) {
    return NextResponse.json(
      { error: 'Invalid or expired token' },
      { status: 401 }
    );
  }

  // Token is valid, so it is safe to hand over this user's private details.
  return NextResponse.json(
    {
      message: 'This is your private profile.',
      profile: {
        id: data.user.id,
        email: data.user.email,
        created_at: data.user.created_at,
        last_sign_in_at: data.user.last_sign_in_at,
      },
    },
    { status: 200 }
  );
}
