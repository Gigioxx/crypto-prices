import type { Metadata } from 'next';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import { DynamicHeader } from '@/components/dynamic-header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { Currency } from '@/i18n/config';
import { fetchCoinDetail } from '@/lib/coingecko';
import { getMessagesSync } from '@/lib/messages';
import { getServerLocale } from '@/lib/server-locale';
import type { CoinDetailPageProps, TimeFrame } from '@/types/crypto';

import { CoinChart } from './coin-chart';
import { CoinDetailClient } from './coin-detail-client';

/**
 * Generate metadata for the coin detail page
 */
export async function generateMetadata({
  params,
  searchParams,
}: CoinDetailPageProps): Promise<Metadata> {
  try {
    const { id } = await params;
    const resolvedSearchParams = await searchParams;
    const currency = (resolvedSearchParams.currency as Currency) || 'USD';

    const coinDetail = await fetchCoinDetail(id, currency);
    const currentPrice = coinDetail.market_data.current_price[currency.toLowerCase()];
    const change24h = coinDetail.market_data.price_change_percentage_24h;

    return {
      title: `${coinDetail.name} (${coinDetail.symbol.toUpperCase()}) Price | Crypto Prices`,
      description: `Current ${coinDetail.name} price: ${currentPrice.toLocaleString()} ${currency}. 24h change: ${change24h?.toFixed(2)}%. View detailed charts and statistics.`,
      openGraph: {
        title: `${coinDetail.name} Price`,
        description: `${coinDetail.name} (${coinDetail.symbol.toUpperCase()}) - ${currentPrice.toLocaleString()} ${currency}`,
        images: [coinDetail.image.large],
      },
      twitter: {
        card: 'summary',
        title: `${coinDetail.name} Price`,
        description: `${currentPrice.toLocaleString()} ${currency} (${change24h?.toFixed(2)}%)`,
        images: [coinDetail.image.large],
      },
    };
  } catch {
    return {
      title: 'Coin Not Found | Crypto Prices',
      description: 'The requested cryptocurrency could not be found.',
    };
  }
}

/**
 * Validate coin ID format and existence
 */
async function validateCoinId(id: string): Promise<boolean> {
  // Basic format validation
  if (!id || typeof id !== 'string') {
    return false;
  }

  // Check for invalid characters (coin IDs should be lowercase alphanumeric with hyphens)
  const validIdPattern = /^[a-z0-9-]+$/;

  if (!validIdPattern.test(id)) {
    return false;
  }

  // Check if ID is too long (most coin IDs are under 50 characters)
  if (id.length > 50) {
    return false;
  }

  // Check for common invalid patterns
  const invalidPatterns = [
    /^-+$/, // Only hyphens
    /^[0-9]+$/, // Only numbers
    /--+/, // Multiple consecutive hyphens
    /^-/, // Starting with hyphen
    /-$/, // Ending with hyphen
  ];

  if (invalidPatterns.some((pattern) => pattern.test(id))) {
    return false;
  }

  return true;
}

/**
 * Main coin detail page component
 */
export default async function CoinDetailPage({ params, searchParams }: CoinDetailPageProps) {
  const { id } = await params;
  const resolvedSearchParams = await searchParams;
  const currency = (resolvedSearchParams.currency as Currency) || 'USD';
  const timeFrame = (resolvedSearchParams.days as TimeFrame) || '7';

  // Get locale from URL params first, then fallback to server locale
  const urlLocale = resolvedSearchParams.locale as string;
  const serverLocale = await getServerLocale();
  const locale = (urlLocale && ['en', 'es'].includes(urlLocale) ? urlLocale : serverLocale) as
    | 'en'
    | 'es';
  const messages = getMessagesSync(locale);

  // Validate coin ID format first
  if (!(await validateCoinId(id))) {
    console.warn(`Invalid coin ID format: ${id}`);
    notFound();
  }

  try {
    const coinDetail = await fetchCoinDetail(id, currency);

    // Additional validation: check if the returned data is valid
    if (!coinDetail || !coinDetail.id || !coinDetail.name) {
      console.warn(`Invalid coin data received for ID: ${id}`);
      notFound();
    }

    return (
      <div className='min-h-screen bg-background flex flex-col'>
        <DynamicHeader fallbackMessages={messages} />

        <main className='flex-1'>
          <div className='container mx-auto px-4 py-6 max-w-7xl'>
            {/* Header with back button */}
            <div className='mb-6'>
              <Button asChild className='mb-4' variant='ghost'>
                <Link className='flex items-center gap-2' href='/'>
                  <ArrowLeft className='h-4 w-4' />
                  {messages.coinDetail.backToHome}
                </Link>
              </Button>
            </div>

            {/* Coin Header and Statistics - Client Components */}
            <CoinDetailClient
              coinId={id}
              initialCoinDetail={coinDetail}
              initialCurrency={currency}
              messages={messages}
            />

            {/* Charts Section */}
            <div className='mt-8'>
              <Suspense fallback={<ChartSkeleton />}>
                <CoinChart
                  coinId={id}
                  initialCurrency={currency}
                  initialTimeFrame={timeFrame}
                  messages={messages}
                />
              </Suspense>
            </div>
          </div>
        </main>

        <Footer messages={messages} />
      </div>
    );
  } catch (error) {
    console.error('Error loading coin detail:', error);

    // Check if it's a 404 error from the API
    if (error instanceof Error) {
      if (error.message.includes('404') || error.message.includes('not found')) {
        console.warn(`Coin not found: ${id}`);
        notFound();
      }
    }

    // For other errors, still show not found to avoid exposing error details
    notFound();
  }
}

/**
 * Chart loading skeleton
 */
function ChartSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className='h-6 w-32' />
        <div className='flex gap-2'>
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className='h-8 w-12' />
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <Skeleton className='h-80 w-full' />
      </CardContent>
    </Card>
  );
}
