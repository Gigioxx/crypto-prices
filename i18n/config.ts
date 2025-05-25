export type Locale = 'en' | 'es';

export const locales: Locale[] = ['en', 'es'];

export const defaultLocale: Locale = 'en';

export const currencies = {
  USD: { symbol: '$', code: 'USD' },
  EUR: { symbol: '€', code: 'EUR' },
  CLP: { symbol: '$', code: 'CLP' },
} as const;

export type Currency = keyof typeof currencies;
