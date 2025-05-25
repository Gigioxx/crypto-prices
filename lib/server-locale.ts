import { cookies } from 'next/headers';

import { defaultLocale, locales, type Locale } from '@/i18n/config';

/**
 * Gets the user's preferred locale on the server side
 * Checks cookies first, then falls back to default locale
 */
export async function getServerLocale(): Promise<Locale> {
  try {
    const cookieStore = await cookies();
    const storedLocale = cookieStore.get('crypto-prices-locale')?.value as Locale;

    // Validate that the stored locale is supported
    if (storedLocale && locales.includes(storedLocale)) {
      return storedLocale;
    }
  } catch (error) {
    console.warn('Failed to read locale from cookies:', error);
  }

  // Fallback to default locale
  return defaultLocale;
}
