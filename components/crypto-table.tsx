'use client';

import { Clock, RefreshCw, TrendingDown, TrendingUp } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState, useTransition } from 'react';
import useSWR from 'swr';

import { useSettings } from '@/components/settings-provider';
import { Button } from '@/components/ui/button';
import type { Currency } from '@/i18n/config';
import { CryptoCache } from '@/lib/cache';
import { CacheDebug } from '@/lib/cache-debug';
import { cryptoFetcher, cryptoSWRConfig, getInitialData } from '@/lib/swr-config';
import { debounce, formatCurrency, formatMarketCap, formatPercentage } from '@/lib/utils';
import type { CryptoCurrency } from '@/types/crypto';

interface CryptoTableProps {
  initialData: CryptoCurrency[];
  messages: {
    crypto: {
      title: string;
      fetchError: string;
      noData: string;
      rank: string;
      name: string;
      price: string;
      change24h: string;
      marketCap: string;
      rateLimitExceeded: string;
      rateLimitMessage: string;
      fallbackMessage: string;
      pleaseWait: string;
      lastUpdated: string;
      dataStatus: {
        fresh: string;
        cached: string;
      };
    };
    common: {
      retry: string;
      loading: string;
    };
  };
}

// Memoized crypto row component to prevent unnecessary re-renders
const CryptoRow = ({
  crypto,
  currency,
  locale,
  messages,
}: {
  crypto: CryptoCurrency;
  currency: string;
  locale: string;
  messages: {
    rank: string;
    marketCap: string;
  };
}) => {
  const priceChangeColor =
    crypto.price_change_percentage_24h >= 0
      ? 'text-green-600 dark:text-green-400'
      : 'text-red-600 dark:text-red-400';

  const TrendIcon = crypto.price_change_percentage_24h >= 0 ? TrendingUp : TrendingDown;

  return (
    <div
      className='bg-card border border-border rounded-lg p-4 space-y-3 focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer transition-colors hover:bg-muted/50'
      role='listitem'
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          // Future: Navigate to crypto detail page
        }
      }}
    >
      <div className='flex items-start justify-between'>
        <div className='flex items-center space-x-3'>
          <img
            alt={crypto.name}
            className='w-8 h-8 rounded-full'
            height={32}
            loading='lazy'
            src={crypto.image || '/placeholder.svg'}
            width={32}
          />
          <div>
            <h3 className='font-semibold text-sm'>{crypto.name}</h3>
            <p className='text-xs text-muted-foreground uppercase'>{crypto.symbol}</p>
            <div className='mt-1'>
              <p className='text-xs text-muted-foreground'>{messages.rank}</p>
              <p className='text-xs font-medium'>#{crypto.market_cap_rank}</p>
            </div>
          </div>
        </div>
        <div className='text-right space-y-1'>
          <p className='font-semibold'>
            {formatCurrency(crypto.current_price, currency as Currency, locale)}
          </p>
          <div className={`flex items-center justify-end space-x-1 ${priceChangeColor}`}>
            <TrendIcon className='w-3 h-3' />
            <span className='text-xs font-medium'>
              {formatPercentage(crypto.price_change_percentage_24h, locale)}
            </span>
          </div>
          <div className='mt-1'>
            <p className='text-xs text-muted-foreground'>{messages.marketCap}</p>
            <p className='text-xs font-medium'>{formatMarketCap(crypto.market_cap, locale)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Memoize the component to prevent unnecessary re-renders
const MemoizedCryptoRow = ({
  crypto,
  currency,
  locale,
  messages,
}: {
  crypto: CryptoCurrency;
  currency: string;
  locale: string;
  messages: {
    rank: string;
    marketCap: string;
  };
}) => {
  return useMemo(
    () => <CryptoRow crypto={crypto} currency={currency} locale={locale} messages={messages} />,
    [crypto, currency, locale, messages],
  );
};

export function CryptoTable({ initialData, messages }: CryptoTableProps) {
  const { currency, locale } = useSettings();
  const [debouncedCurrency, setDebouncedCurrency] = useState(currency);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Track hydration to prevent hydration mismatch
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Optimized debounced currency setter with transition
  const debouncedSetCurrency = useCallback(
    debounce((newCurrency: typeof currency) => {
      startTransition(() => {
        setDebouncedCurrency(newCurrency);
      });
    }, 800), // Reduced debounce time for better UX
    [startTransition],
  );

  useEffect(() => {
    debouncedSetCurrency(currency as typeof currency);
  }, [currency, debouncedSetCurrency]);

  // Memoize enhanced initial data
  const enhancedInitialData = useMemo(() => {
    return isHydrated ? getInitialData(debouncedCurrency, initialData) : initialData;
  }, [isHydrated, debouncedCurrency, initialData]);

  const { data, error, isLoading, mutate } = useSWR(
    `/api/crypto?currency=${debouncedCurrency}`,
    cryptoFetcher,
    {
      ...cryptoSWRConfig,
      fallbackData: enhancedInitialData,
      onSuccess: (data: CryptoCurrency[]) => {
        // Cache the data manually since we're overriding onSuccess
        CryptoCache.set(data, debouncedCurrency);
        // Update last updated timestamp
        setLastUpdated(new Date());
      },
    },
  );

  // Update last updated time when component mounts
  useEffect(() => {
    if (!isHydrated) return; // Don't access localStorage during SSR

    const cachedTime = CryptoCache.getLastUpdated(debouncedCurrency);

    if (cachedTime) {
      setLastUpdated(cachedTime);
    }

    // Enable cache debugging in development
    if (process.env.NODE_ENV === 'development') {
      CacheDebug.monitorCache();
      CacheDebug.logCacheStatus(debouncedCurrency);
    }
  }, [debouncedCurrency, isHydrated]);

  const handleRetry = useCallback(() => {
    mutate();
  }, [mutate]);

  // Memoize crypto data to prevent unnecessary re-renders
  const cryptoData = useMemo(() => data || initialData, [data, initialData]);

  // Memoize error state
  const errorState = useMemo(() => {
    if (!error) return null;

    const isRateLimit = error.message.includes('Rate limit');

    return { isRateLimit };
  }, [error]);

  // Memoize formatted last updated time
  const formattedLastUpdated = useMemo(() => {
    if (!isHydrated || !lastUpdated) return null;

    return lastUpdated.toLocaleString(locale, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  }, [isHydrated, lastUpdated, locale]);

  // Memoize cache status
  const isStale = useMemo(() => {
    return isHydrated ? CryptoCache.isStale(debouncedCurrency) : false;
  }, [isHydrated, debouncedCurrency]);

  if (errorState) {
    return (
      <div className='flex flex-col items-center justify-center p-8 text-center'>
        <p className='text-destructive mb-2'>
          {errorState.isRateLimit ? messages.crypto.rateLimitExceeded : messages.crypto.fetchError}
        </p>
        <p className='text-sm text-muted-foreground mb-4'>
          {errorState.isRateLimit
            ? messages.crypto.rateLimitMessage
            : messages.crypto.fallbackMessage}
        </p>
        <Button disabled={errorState.isRateLimit} variant='outline' onClick={handleRetry}>
          <RefreshCw className='w-4 h-4 mr-2' />
          {errorState.isRateLimit ? messages.crypto.pleaseWait : messages.common.retry}
        </Button>
      </div>
    );
  }

  if (!cryptoData || cryptoData.length === 0) {
    return (
      <div className='flex items-center justify-center p-8'>
        <p className='text-muted-foreground'>{messages.crypto.noData}</p>
      </div>
    );
  }

  return (
    <div className='w-full'>
      {/* Data status header - only show after hydration to prevent mismatch */}
      {isHydrated && formattedLastUpdated && (
        <div className='mb-4 p-3 bg-muted/30 rounded-lg border border-border/50'>
          <div className='flex items-center justify-between text-sm'>
            <div className='flex items-center space-x-2'>
              <Clock className='w-4 h-4 text-muted-foreground' />
              <span className='text-muted-foreground'>{messages.crypto.lastUpdated}:</span>
              <span className='font-medium'>{formattedLastUpdated}</span>
            </div>
            <div className='flex items-center space-x-2'>
              {isPending && (
                <span className='text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full'>
                  Updating...
                </span>
              )}
              {isStale ? (
                <span className='text-xs px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 rounded-full'>
                  {messages.crypto.dataStatus.cached}
                </span>
              ) : (
                <span className='text-xs px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-full'>
                  {messages.crypto.dataStatus.fresh}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mobile view */}
      <div aria-label={messages.crypto.title} className='block md:hidden space-y-4' role='list'>
        {cryptoData.map((crypto: CryptoCurrency) => (
          <MemoizedCryptoRow
            key={crypto.id}
            crypto={crypto}
            currency={currency}
            locale={locale}
            messages={{
              rank: messages.crypto.rank,
              marketCap: messages.crypto.marketCap,
            }}
          />
        ))}
      </div>

      {/* Desktop view */}
      <div className='hidden md:block'>
        <div className='overflow-x-auto'>
          <table aria-label={messages.crypto.title} className='w-full' role='table'>
            <thead role='rowgroup'>
              <tr className='border-b border-border' role='row'>
                <th
                  className='text-left py-3 px-4 font-medium text-muted-foreground'
                  role='columnheader'
                >
                  {messages.crypto.rank}
                </th>
                <th
                  className='text-left py-3 px-4 font-medium text-muted-foreground'
                  role='columnheader'
                >
                  {messages.crypto.name}
                </th>
                <th
                  className='text-right py-3 px-4 font-medium text-muted-foreground'
                  role='columnheader'
                >
                  {messages.crypto.price}
                </th>
                <th
                  className='text-right py-3 px-4 font-medium text-muted-foreground'
                  role='columnheader'
                >
                  {messages.crypto.change24h}
                </th>
                <th
                  className='text-right py-3 px-4 font-medium text-muted-foreground'
                  role='columnheader'
                >
                  {messages.crypto.marketCap}
                </th>
              </tr>
            </thead>
            <tbody>
              {cryptoData.map((crypto: CryptoCurrency) => (
                <tr
                  key={crypto.id}
                  className='border-b border-border hover:bg-muted/50 focus-within:bg-muted/50 transition-colors'
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      // Future: Navigate to crypto detail page
                    }
                  }}
                >
                  <td className='py-4 px-4'>
                    <span className='text-muted-foreground'>#{crypto.market_cap_rank}</span>
                  </td>
                  <td className='py-4 px-4'>
                    <div className='flex items-center space-x-3'>
                      <img
                        alt={crypto.name}
                        className='w-8 h-8 rounded-full'
                        height={32}
                        loading='lazy'
                        src={crypto.image || '/placeholder.svg'}
                        width={32}
                      />
                      <div>
                        <div className='font-semibold'>{crypto.name}</div>
                        <div className='text-sm text-muted-foreground uppercase'>
                          {crypto.symbol}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className='py-4 px-4 text-right font-semibold'>
                    {formatCurrency(crypto.current_price, currency as Currency, locale)}
                  </td>
                  <td className='py-4 px-4 text-right'>
                    <div
                      className={`flex items-center justify-end ${
                        crypto.price_change_percentage_24h >= 0
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-red-600 dark:text-red-400'
                      }`}
                    >
                      {crypto.price_change_percentage_24h >= 0 ? (
                        <TrendingUp className='w-4 h-4 mr-1' />
                      ) : (
                        <TrendingDown className='w-4 h-4 mr-1' />
                      )}
                      {formatPercentage(crypto.price_change_percentage_24h, locale)}
                    </div>
                  </td>
                  <td className='py-4 px-4 text-right'>
                    {formatMarketCap(crypto.market_cap, locale)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isLoading && (
        <div className='flex items-center justify-center py-4'>
          <RefreshCw className='w-4 h-4 animate-spin mr-2' />
          <span className='text-muted-foreground'>{messages.common.loading}</span>
        </div>
      )}
    </div>
  );
}
