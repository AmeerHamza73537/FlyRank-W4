// Purpose: POST /auth/login
// Checks the email + password with Supabase and returns the JWT (access token)
// that the client must send back on protected routes.

import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { email, password } = body;

  // Input validation: both fields are required.
  if (!email || !password) {
    return NextResponse.json(
      { error: 'Email and password are required' },
      { status: 400 }
    );
  }

  // Ask Supabase to verify the credentials.
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  // Wrong email or password -> 401 Unauthorized.
  if (error) {
    return NextResponse.json(
      { error: 'Invalid login credentials' },
      { status: 401 }
    );
  }

  // Success: hand over the tokens.
  return NextResponse.json(
    {
      message: 'Login successful',
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      user: data.user,
    },
    { status: 200 }
  );
}
