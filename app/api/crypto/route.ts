import { type NextRequest, NextResponse } from 'next/server';

import type { Currency } from '@/i18n/config';
import { fetchCryptoPrices } from '@/lib/coingecko';

// Add rate limiting
const requestCounts = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 10; // requests per minute
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const userRequests = requestCounts.get(ip);

  if (!userRequests || now > userRequests.resetTime) {
    requestCounts.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });

    return false;
  }

  if (userRequests.count >= RATE_LIMIT) {
    return true;
  }

  userRequests.count++;

  return false;
}

export async function GET(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 },
      );
    }

    const { searchParams } = new URL(request.url);
    const currency = (searchParams.get('currency') || 'USD') as Currency;

    const data = await fetchCryptoPrices(currency, 20);

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error) {
    console.error('API Error:', error);

    return NextResponse.json({ error: 'Failed to fetch cryptocurrency data' }, { status: 500 });
  }
}
