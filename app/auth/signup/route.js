// Purpose: POST /auth/signup
// Creates a new user account in Supabase Auth from an email + password.

import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request) {
  // Read the JSON body. If the body is not valid JSON, treat it as a bad request.
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

  // Ask Supabase to register the user.
  const { data, error } = await supabase.auth.signUp({ email, password });

  // Supabase rejected it (e.g. weak password, invalid email, user exists).
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  // Created: send back the user object Supabase gave us.
  return NextResponse.json(
    { message: 'User created successfully', user: data.user },
    { status: 201 }
  );
}
