// Purpose: GET /protected/dashboard
// A second protected route. It exists to prove the guard is reusable:
// this file has no token-checking code of its own, it just calls requireAuth.

import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';

export async function GET(request) {
  const { user, error } = await requireAuth(request);
  if (error) return error;

  return NextResponse.json(
    {
      message: `Welcome to your dashboard, ${user.email}!`,
      stats: {
        audits_run: 12,
        reports_ready: 3,
      },
    },
    { status: 200 }
  );
}
