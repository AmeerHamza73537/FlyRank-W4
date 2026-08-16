// Purpose: GET /protected/profile
// Returns the logged-in user's private details.
// The requireAuth guard checks the token first, so the code below
// only runs when a real, valid user is behind the request.

import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';

export async function GET(request) {
  const { user, error } = await requireAuth(request);
  if (error) return error;

  return NextResponse.json(
    {
      message: 'This is your private profile.',
      profile: {
        id: user.id,
        email: user.email,
        created_at: user.created_at,
        last_sign_in_at: user.last_sign_in_at,
      },
    },
    { status: 200 }
  );
}
