// Purpose: GET /public/info
// An open door. Anyone can call this, no token needed.

import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(
    { message: 'Welcome stranger! This info is public.' },
    { status: 200 }
  );
}
