'use client';

import { TrendingDown, TrendingUp } from 'lucide-react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import useSWR from 'swr';

import { useSettings } from '@/components/settings-provider';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { Currency } from '@/i18n/config';
import { fetchCoinDetail } from '@/lib/coingecko';
import { getMessagesSync, type Messages } from '@/lib/messages';
import { cn } from '@/lib/utils';
import type { CoinDetail } from '@/types/crypto';

interface CoinDetailClientProps {
  coinId: string;
  initialCoinDetail: CoinDetail;
  initialCurrency: Currency;
  messages: Messages;
}

/**
 * Client wrapper for coin detail components that react to currency changes
 */
export function CoinDetailClient({
  coinId,
  initialCoinDetail,
  initialCurrency,
  messages,
}: CoinDetailClientProps) {
  const { currency, locale } = useSettings();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentCurrency, setCurrentCurrency] = useState<Currency>(initialCurrency);
  const [currentMessages, setCurrentMessages] = useState<Messages>(messages);

  // Update currency when settings change
  useEffect(() => {
    setCurrentCurrency(currency);

    // Update URL when currency changes
    if (currency !== initialCurrency) {
      const params = new URLSearchParams(searchParams.toString());

      params.set('currency', currency);
      router.replace(`?${params.toString()}`, { scroll: false });
    }
  }, [currency, initialCurrency, router, searchParams]);

  // Handle locale changes client-side without page reload
  useEffect(() => {
    // Get current locale from URL or default to 'en'
    const currentUrlLocale = searchParams.get('locale') || 'en';

    // If locale changed, update messages and URL
    if (locale !== currentUrlLocale) {
      // Update messages immediately for instant UI update
      const newMessages = getMessagesSync(locale as 'en' | 'es');

      setCurrentMessages(newMessages);

      // Update URL to reflect the locale change
      const params = new URLSearchParams(searchParams.toString());

      if (locale !== 'en') {
        params.set('locale', locale);
      } else {
        params.delete('locale'); // Remove locale param for default English
      }

      router.replace(`?${params.toString()}`, { scroll: false });
    }
  }, [locale, searchParams, router]);

  // SWR for reactive data fetching when currency changes
  const { data: coinDetail, isLoading } = useSWR(
    currentCurrency !== initialCurrency ? `coin-detail-${coinId}-${currentCurrency}` : null,
    () => fetchCoinDetail(coinId, currentCurrency),
    {
      fallbackData: initialCoinDetail,
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    },
  );

  const activeCoinDetail = coinDetail || initialCoinDetail;
  const activeCurrency = currentCurrency;

  return (
    <>
      {/* Coin Header */}
      <CoinHeader
        coinDetail={activeCoinDetail}
        currency={activeCurrency}
        isLoading={isLoading && currentCurrency !== initialCurrency}
      />

      {/* Statistics Section */}
      <CoinStatistics
        coinDetail={activeCoinDetail}
        currency={activeCurrency}
        isLoading={isLoading && currentCurrency !== initialCurrency}
        messages={currentMessages}
      />
    </>
  );
}

/**
 * Coin header component with basic info
 */
function CoinHeader({
  coinDetail,
  currency,
  isLoading = false,
}: {
  coinDetail: CoinDetail;
  currency: Currency;
  isLoading?: boolean;
}) {
  const currentPrice = coinDetail.market_data.current_price[currency.toLowerCase()];
  const change24h = coinDetail.market_data.price_change_percentage_24h;
  const isPositive = change24h >= 0;

  return (
    <Card>
      <CardHeader>
        <div className='flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4'>
          <div className='flex items-center gap-4'>
            <Image
              alt={coinDetail.name}
              className='rounded-full'
              height={64}
              src={coinDetail.image.large}
              width={64}
            />
            <div>
              <CardTitle className='text-2xl font-bold'>{coinDetail.name}</CardTitle>
              <CardDescription className='text-lg'>
                {coinDetail.symbol.toUpperCase()}
              </CardDescription>
              {coinDetail.market_cap_rank && (
                <Badge className='mt-2' variant='secondary'>
                  Rank #{coinDetail.market_cap_rank}
                </Badge>
              )}
            </div>
          </div>

          <div className='text-left sm:text-right'>
            {isLoading ? (
              <div className='space-y-2'>
                <Skeleton className='h-8 w-32' />
                <Skeleton className='h-4 w-20' />
              </div>
            ) : (
              <>
                <div className='text-2xl sm:text-3xl font-bold'>
                  {currentPrice?.toLocaleString() ?? 'N/A'} {currency}
                </div>
                <div
                  className={cn(
                    'flex items-center gap-1 text-sm font-medium',
                    isPositive ? 'text-green-600' : 'text-red-600',
                  )}
                >
                  {isPositive ? (
                    <TrendingUp className='h-4 w-4' />
                  ) : (
                    <TrendingDown className='h-4 w-4' />
                  )}
                  {change24h?.toFixed(2)}%
                </div>
              </>
            )}
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}

/**
 * Coin statistics component
 */
function CoinStatistics({
  coinDetail,
  currency,
  messages,
  isLoading = false,
}: {
  coinDetail: CoinDetail;
  currency: Currency;
  messages: Messages;
  isLoading?: boolean;
}) {
  const marketData = coinDetail.market_data;
  const currencyKey = currency.toLowerCase();

  const stats = [
    {
      label: messages.crypto.marketCap,
      value: marketData.market_cap[currencyKey]?.toLocaleString(),
      suffix: currency,
    },
    {
      label: messages.coinDetail.volume24h,
      value: marketData.total_volume[currencyKey]?.toLocaleString(),
      suffix: currency,
    },
    {
      label: messages.coinDetail.circulatingSupply,
      value: marketData.circulating_supply?.toLocaleString(),
      suffix: coinDetail.symbol.toUpperCase(),
    },
    {
      label: messages.coinDetail.totalSupply,
      value: marketData.total_supply?.toLocaleString(),
      suffix: coinDetail.symbol.toUpperCase(),
    },
    {
      label: messages.coinDetail.maxSupply,
      value: marketData.max_supply?.toLocaleString() || 'N/A',
      suffix: marketData.max_supply ? coinDetail.symbol.toUpperCase() : '',
    },
    {
      label: messages.coinDetail.allTimeHigh,
      value: marketData.ath[currencyKey]?.toLocaleString(),
      suffix: currency,
    },
  ];

  return (
    <div className='mt-8'>
      <h2 className='text-2xl font-bold mb-4'>{messages.coinDetail.statistics}</h2>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className='p-4'>
              <div className='text-sm text-muted-foreground mb-1'>{stat.label}</div>
              {isLoading ? (
                <Skeleton className='h-6 w-24' />
              ) : (
                <div className='text-lg font-semibold'>
                  {stat.value} {stat.suffix}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
