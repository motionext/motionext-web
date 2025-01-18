import { NextResponse } from 'next/server';
// import { checkRateLimit } from '@/lib/rate-limit';

export async function POST(request: Request) {
  try {
    const { identifier } = await request.json();
    // const result = await checkRateLimit(identifier);
    const result = { success: true, identifier: identifier }
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 