'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import useSWR from 'swr';

import { useSettings } from '@/components/settings-provider';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Currency } from '@/i18n/config';
import { fetchMarketChart, transformChartData } from '@/lib/coingecko';
import type { Messages } from '@/lib/messages';
import type { ChartDataPoint, TimeFrame } from '@/types/crypto';

interface CoinChartProps {
  coinId: string;
  initialCurrency: Currency;
  initialTimeFrame: TimeFrame;
  messages: Messages;
}

/**
 * Client component for interactive coin charts
 */
export function CoinChart({ coinId, initialCurrency, initialTimeFrame, messages }: CoinChartProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { currency } = useSettings();
  const [selectedTimeFrame, setSelectedTimeFrame] = useState<TimeFrame>(initialTimeFrame);
  const [currentCurrency, setCurrentCurrency] = useState<Currency>(initialCurrency);

  // Update currency when settings change
  useEffect(() => {
    setCurrentCurrency(currency);
  }, [currency]);

  // SWR fetcher function with improved error handling
  const fetcher = async (key: string) => {
    try {
      const [, , , timeFrame] = key.split('-');
      const marketData = await fetchMarketChart(coinId, currentCurrency, timeFrame as TimeFrame);

      return transformChartData(marketData, timeFrame as TimeFrame);
    } catch (error) {
      console.error('Chart fetcher error:', error);
      // Re-throw the error so SWR can handle it properly
      throw error;
    }
  };

  // SWR hook for data fetching
  const { data, error, isLoading } = useSWR(
    `chart-${coinId}-${currentCurrency}-${selectedTimeFrame}`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      refreshInterval: 300000, // 5 minutes
      errorRetryCount: 2, // Retry failed requests up to 2 times
      errorRetryInterval: 5000, // Wait 5 seconds between retries
      onError: (error) => {
        console.error('SWR chart error:', error);
      },
      shouldRetryOnError: (error) => {
        // Don't retry on 404 errors (coin not found)
        if (error?.message?.includes('not found')) {
          return false;
        }

        // Retry on network errors and rate limits
        return true;
      },
    },
  );

  // Handle timeframe change
  const handleTimeFrameChange = (timeFrame: TimeFrame) => {
    setSelectedTimeFrame(timeFrame);

    // Update URL search params
    const params = new URLSearchParams(searchParams.toString());

    params.set('days', timeFrame);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  // Timeframe options
  const timeFrames: { value: TimeFrame; label: string }[] = [
    { value: '1', label: messages.coinDetail.timeframes['1'] },
    { value: '7', label: messages.coinDetail.timeframes['7'] },
    { value: '30', label: messages.coinDetail.timeframes['30'] },
    { value: '365', label: messages.coinDetail.timeframes['365'] },
  ];

  return (
    <Card>
      <CardHeader>
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
          <CardTitle>{messages.coinDetail.priceChart}</CardTitle>
          <div className='flex gap-1 flex-wrap'>
            {timeFrames.map((timeFrame) => (
              <Button
                key={timeFrame.value}
                disabled={isLoading}
                size='sm'
                variant={selectedTimeFrame === timeFrame.value ? 'default' : 'outline'}
                onClick={() => handleTimeFrameChange(timeFrame.value)}
              >
                {timeFrame.label}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert className='mb-4' variant='destructive'>
            <AlertDescription>
              {error.message.includes('not found')
                ? messages.coinDetail.coinNotFoundDescription
                : error.message.includes('Rate limit')
                  ? messages.crypto.rateLimitMessage
                  : error.message.includes('Failed to fetch')
                    ? 'Network error - using fallback data. Please check your connection.'
                    : messages.coinDetail.chartError}
            </AlertDescription>
          </Alert>
        )}

        {isLoading ? (
          <ChartLoadingSkeleton />
        ) : data ? (
          <Tabs className='w-full' defaultValue='price'>
            <TabsList className='grid w-full grid-cols-3 sm:flex sm:w-auto sm:h-auto'>
              <TabsTrigger className='text-xs sm:text-sm px-2 sm:px-3' value='price'>
                {messages.crypto.price}
              </TabsTrigger>
              <TabsTrigger className='text-xs sm:text-sm px-2 sm:px-3' value='volume'>
                {messages.crypto.volume}
              </TabsTrigger>
              <TabsTrigger className='text-xs sm:text-sm px-2 sm:px-3' value='market-cap'>
                {messages.crypto.marketCap}
              </TabsTrigger>
            </TabsList>

            <TabsContent className='mt-4' value='price'>
              <PriceChart currency={currentCurrency} data={data} messages={messages} />
            </TabsContent>

            <TabsContent className='mt-4' value='volume'>
              <VolumeChart currency={currentCurrency} data={data} messages={messages} />
            </TabsContent>

            <TabsContent className='mt-4' value='market-cap'>
              <MarketCapChart currency={currentCurrency} data={data} messages={messages} />
            </TabsContent>
          </Tabs>
        ) : null}
      </CardContent>
    </Card>
  );
}

/**
 * Price chart component
 */
function PriceChart({
  data,
  currency,
  messages,
}: {
  data: ChartDataPoint[];
  currency: Currency;
  messages: Messages;
}) {
  const formatPrice = (value: number) => {
    return `${value.toLocaleString()} ${currency}`;
  };

  return (
    <div className='h-80'>
      <ResponsiveContainer height='100%' width='100%'>
        <AreaChart data={data}>
          <defs>
            <linearGradient id='priceGradient' x1='0' x2='0' y1='0' y2='1'>
              <stop offset='5%' stopColor='hsl(var(--primary))' stopOpacity={0.3} />
              <stop offset='95%' stopColor='hsl(var(--primary))' stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid className='opacity-30' strokeDasharray='3 3' />
          <XAxis axisLine={false} className='text-xs' dataKey='date' tickLine={false} />
          <YAxis
            axisLine={false}
            className='text-xs'
            tickFormatter={formatPrice}
            tickLine={false}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length && payload[0]?.value != null) {
                return (
                  <div className='bg-background border rounded-lg p-3 shadow-lg'>
                    <p className='text-sm font-medium'>{label}</p>
                    <p className='text-sm text-primary'>
                      {messages.coinDetail.chartLabels.price}:{' '}
                      {formatPrice(payload[0].value as number)}
                    </p>
                  </div>
                );
              }

              return null;
            }}
          />
          <Area
            dataKey='price'
            fill='url(#priceGradient)'
            stroke='hsl(var(--primary))'
            strokeWidth={2}
            type='monotone'
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

/**
 * Volume chart component
 */
function VolumeChart({
  data,
  currency,
  messages,
}: {
  data: ChartDataPoint[];
  currency: Currency;
  messages: Messages;
}) {
  const formatVolume = (value: number) => {
    if (value >= 1e9) {
      return `${(value / 1e9).toFixed(2)}B ${currency}`;
    }
    if (value >= 1e6) {
      return `${(value / 1e6).toFixed(2)}M ${currency}`;
    }

    return `${value.toLocaleString()} ${currency}`;
  };

  return (
    <div className='h-80'>
      <ResponsiveContainer height='100%' width='100%'>
        <AreaChart data={data}>
          <defs>
            <linearGradient id='volumeGradient' x1='0' x2='0' y1='0' y2='1'>
              <stop offset='5%' stopColor='hsl(var(--secondary))' stopOpacity={0.8} />
              <stop offset='95%' stopColor='hsl(var(--secondary))' stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid className='opacity-30' strokeDasharray='3 3' />
          <XAxis axisLine={false} className='text-xs' dataKey='date' tickLine={false} />
          <YAxis
            axisLine={false}
            className='text-xs'
            tickFormatter={formatVolume}
            tickLine={false}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length && payload[0]?.value != null) {
                return (
                  <div className='bg-background border rounded-lg p-3 shadow-lg'>
                    <p className='text-sm font-medium'>{label}</p>
                    <p className='text-sm text-secondary-foreground'>
                      {messages.coinDetail.chartLabels.volume}:{' '}
                      {formatVolume(payload[0].value as number)}
                    </p>
                  </div>
                );
              }

              return null;
            }}
          />
          <Area
            dataKey='volume'
            fill='url(#volumeGradient)'
            stroke='hsl(var(--secondary))'
            strokeWidth={2}
            type='monotone'
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

/**
 * Market cap chart component
 */
function MarketCapChart({
  data,
  currency,
  messages,
}: {
  data: ChartDataPoint[];
  currency: Currency;
  messages: Messages;
}) {
  const formatMarketCap = (value: number) => {
    if (value >= 1e12) {
      return `${(value / 1e12).toFixed(2)}T ${currency}`;
    }
    if (value >= 1e9) {
      return `${(value / 1e9).toFixed(2)}B ${currency}`;
    }
    if (value >= 1e6) {
      return `${(value / 1e6).toFixed(2)}M ${currency}`;
    }

    return `${value.toLocaleString()} ${currency}`;
  };

  return (
    <div className='h-80'>
      <ResponsiveContainer height='100%' width='100%'>
        <LineChart data={data}>
          <CartesianGrid className='opacity-30' strokeDasharray='3 3' />
          <XAxis axisLine={false} className='text-xs' dataKey='date' tickLine={false} />
          <YAxis
            axisLine={false}
            className='text-xs'
            tickFormatter={formatMarketCap}
            tickLine={false}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length && payload[0]?.value != null) {
                return (
                  <div className='bg-background border rounded-lg p-3 shadow-lg'>
                    <p className='text-sm font-medium'>{label}</p>
                    <p className='text-sm text-muted-foreground'>
                      {messages.coinDetail.chartLabels.marketCap}:{' '}
                      {formatMarketCap(payload[0].value as number)}
                    </p>
                  </div>
                );
              }

              return null;
            }}
          />
          <Line
            dataKey='market_cap'
            dot={false}
            stroke='hsl(var(--muted-foreground))'
            strokeWidth={2}
            type='monotone'
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

/**
 * Chart loading skeleton
 */
function ChartLoadingSkeleton() {
  return (
    <div className='space-y-4'>
      <div className='flex gap-2'>
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className='h-8 w-20' />
        ))}
      </div>
      <Skeleton className='h-80 w-full' />
    </div>
  );
}
