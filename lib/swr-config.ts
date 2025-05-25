import type { SWRConfiguration } from 'swr';

import { CryptoCache } from './cache';

// Custom SWR configuration for crypto data
export const cryptoSWRConfig: SWRConfiguration = {
  // Refresh interval - 60 seconds for live data
  refreshInterval: 60000,

  // Revalidation settings
  revalidateOnFocus: false, // Don't refetch when window gains focus
  revalidateOnReconnect: true, // Refetch when connection is restored
  revalidateIfStale: true, // Revalidate if data is stale

  // Error handling
  errorRetryCount: 3,
  errorRetryInterval: 5000,

  // Deduplication
  dedupingInterval: 30000, // 30 seconds

  // Keep previous data while fetching new data
  keepPreviousData: true,

  // Custom fallback data provider that uses our cache
  fallback: {},

  // Success callback to cache data
  onSuccess: (data: any, key: string) => {
    // Extract currency from the key (e.g., "/api/crypto?currency=USD")
    const url = new URL(key, 'http://localhost');
    const currency = url.searchParams.get('currency') || 'USD';

    // Cache the successful response
    if (Array.isArray(data) && data.length > 0) {
      CryptoCache.set(data, currency);
    }
  },

  // Error callback
  onError: (error: any) => {
    console.warn('SWR Error:', error.message);
  },
};

// Custom fetcher with cache integration
export const cryptoFetcher = async (url: string) => {
  // Extract currency from URL for cache lookup
  const urlObj = new URL(url, window.location.origin);
  const currency = urlObj.searchParams.get('currency') || 'USD';

  try {
    const response = await fetch(url);

    if (!response.ok) {
      // If API fails, try to use cached data as fallback
      const cachedData = CryptoCache.get(currency);

      if (cachedData) {
        console.log('Using cached data due to API error');

        return cachedData;
      }

      if (response.status === 429) {
        throw new Error('Rate limit exceeded');
      }
      throw new Error('Failed to fetch');
    }

    const data = await response.json();

    return data;
  } catch (error) {
    // Try cached data as last resort
    const cachedData = CryptoCache.get(currency);

    if (cachedData) {
      console.log('Using cached data due to fetch error');

      return cachedData;
    }

    throw error;
  }
};

// Helper to get initial data with cache fallback
export const getInitialData = (currency: string, serverData?: any[]) => {
  // In browser environment, try cache first
  if (typeof window !== 'undefined') {
    const cachedData = CryptoCache.get(currency);

    if (cachedData) {
      return cachedData;
    }
  }

  // Fall back to server data
  return serverData || [];
};
