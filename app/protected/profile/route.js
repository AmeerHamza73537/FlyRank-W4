// Purpose: GET /protected/profile
// A locked door. The client must send their JWT in the request header:
//   Authorization: Bearer <token>
// For now we only check that a token was sent. Verifying that the token is
// real happens in the next stage.

import { NextResponse } from 'next/server';

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

  return NextResponse.json(
    { message: 'Token received', token },
    { status: 200 }
  );
}
