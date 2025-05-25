import { cookies } from 'next/headers';

import { defaultLocale, locales, type Locale } from '@/i18n/config';

/**
 * Gets the user's preferred locale on the server side
 * Returns default locale during static generation, reads cookies during runtime
 */
export async function getServerLocale(): Promise<Locale> {
  // During static generation or when cookies are not available, return default locale
  try {
    const cookieStore = await cookies();
    const storedLocale = cookieStore.get('crypto-prices-locale')?.value as Locale;

    // Validate that the stored locale is supported
    if (storedLocale && locales.includes(storedLocale)) {
      return storedLocale;
    }
  } catch (error) {
    // This will happen during static generation - that's expected
    // Only log in development to avoid noise in production builds
    if (process.env.NODE_ENV === 'development') {
      console.warn('Failed to read locale from cookies (likely during static generation):', error);
    }
  }

  // Fallback to default locale
  return defaultLocale;
}

/**
 * Gets the server locale without trying to read cookies
 * Always returns the default locale - use for static generation
 */
export function getStaticLocale(): Locale {
  return defaultLocale;
}
