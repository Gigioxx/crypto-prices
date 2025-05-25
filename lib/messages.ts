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
