// Purpose: The reusable guard (our "middleware") for protected routes.
// Instead of repeating token-checking code in every protected endpoint,
// each one calls requireAuth() and gets back either an error to return
// or the verified user.

import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function requireAuth(request) {
  const authHeader = request.headers.get('authorization');

  // Header must exist and look exactly like "Bearer <token>".
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return {
      error: NextResponse.json(
        { error: 'Access token required' },
        { status: 401 }
      ),
    };
  }

  // Cut off the word "Bearer " to get the token itself.
  const token = authHeader.split(' ')[1];

  // "Bearer" with nothing after it is still a missing token.
  if (!token) {
    return {
      error: NextResponse.json(
        { error: 'Access token required' },
        { status: 401 }
      ),
    };
  }

  // Ask Supabase to check the token's signature and expiry.
  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    return {
      error: NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      ),
    };
  }

  // Token is good. Hand the route the user and the token.
  return { user: data.user, token };
}
