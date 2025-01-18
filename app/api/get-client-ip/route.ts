import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

export async function GET() {
  const headersList = await headers();
  
  // Try to get the client IP from various possible sources
  const forwardedFor = (headersList as Headers).get('x-forwarded-for');
  const realIp = (headersList as Headers).get('x-real-ip');
  const cfConnectingIp = (headersList as Headers).get('cf-connecting-ip');

  console.log(forwardedFor, realIp, cfConnectingIp);
  
  // Prioritize different IP sources
  const clientIp = 
    forwardedFor?.split(',')[0] ||
    realIp ||
    cfConnectingIp ||
    'anonymous';

  return NextResponse.json({ ip: clientIp });
}