// Purpose: POST /auth/logout
// Ends the user's session in Supabase. This is a protected route, so the
// caller must send a valid token before we log them out.

import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { requireAuth } from '@/lib/auth';

export async function POST(request) {
  const { token, error } = await requireAuth(request);
  if (error) return error;

  // Tell Supabase to end the session belonging to this token.
  const { error: signOutError } = await supabase.auth.admin.signOut(token);

  if (signOutError) {
    return NextResponse.json({ error: signOutError.message }, { status: 400 });
  }

  // 204 means "it worked, and there is nothing to send back".
  return new NextResponse(null, { status: 204 });
}
