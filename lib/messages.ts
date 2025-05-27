import type { Locale } from '@/i18n/config';

// Type for the message structure
export interface Messages {
  common: {
    loading: string;
    error: string;
    retry: string;
    darkMode: string;
    lightMode: string;
  };
  crypto: {
    title: string;
    description: string;
    rank: string;
    name: string;
    price: string;
    change24h: string;
    marketCap: string;
    volume: string;
    currency: string;
    language: string;
    fetchError: string;
    noData: string;
    rateLimitExceeded: string;
    rateLimitMessage: string;
    fallbackMessage: string;
    pleaseWait: string;
    lastUpdated: string;
    dataStatus: {
      fresh: string;
      cached: string;
    };
    demoMode: string;
  };
  coinDetail: {
    backToHome: string;
    coinNotFound: string;
    coinNotFoundDescription: string;
    notFoundReasons: string;
    reasonIncorrectId: string;
    reasonDelisted: string;
    reasonTempIssue: string;
    tryPopularCoins: string;
    viewAllCryptos: string;
    goToHomepage: string;
    currentPrice: string;
    marketCapRank: string;
    volume24h: string;
    circulatingSupply: string;
    totalSupply: string;
    maxSupply: string;
    allTimeHigh: string;
    allTimeLow: string;
    priceChart: string;
    volumeChart: string;
    marketCapChart: string;
    timeframes: {
      '1': string;
      '7': string;
      '30': string;
      '365': string;
    };
    changes: {
      '24h': string;
      '7d': string;
      '30d': string;
      '1y': string;
    };
    statistics: string;
    about: string;
    chartError: string;
    chartRetry: string;
    fallbackChartData: string;
    chartLabels: {
      price: string;
      volume: string;
      marketCap: string;
    };
  };
  navigation: {
    home: string;
    settings: string;
  };
}

/**
 * Dynamically loads messages for the specified locale
 * Falls back to English if the locale is not supported
 */
export async function getMessages(locale: Locale): Promise<Messages> {
  try {
    // Dynamic import based on locale
    const messages = await import(`@/messages/${locale}.json`);

    return messages.default;
  } catch {
    console.warn(`Failed to load messages for locale "${locale}", falling back to English`);
    // Fallback to English
    const fallbackMessages = await import('@/messages/en.json');

    return fallbackMessages.default;
  }
}

/**
 * Synchronously loads messages for the specified locale
 * Uses static imports for server-side compatibility
 */
export function getMessagesSync(locale: Locale): Messages {
  // Import messages directly for server-side rendering
  if (locale === 'es') {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require('@/messages/es.json');
  }

  // Default to English
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require('@/messages/en.json');
}
