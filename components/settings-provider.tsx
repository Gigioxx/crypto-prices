'use client';

import type React from 'react';

import { createContext, useContext, useEffect, useState } from 'react';

import type { Currency, Locale } from '@/i18n/config';

type SettingsProviderProps = {
  children: React.ReactNode;
  defaultCurrency?: Currency;
  defaultLocale?: Locale;
};

type SettingsProviderState = {
  currency: Currency;
  locale: Locale;
  setCurrency: (currency: Currency) => void;
  setLocale: (locale: Locale) => void;
};

const initialState: SettingsProviderState = {
  currency: 'USD',
  locale: 'en',
  setCurrency: () => null,
  setLocale: () => null,
};

const SettingsProviderContext = createContext<SettingsProviderState>(initialState);

export function SettingsProvider({
  children,
  defaultCurrency = 'USD',
  defaultLocale = 'en',
}: SettingsProviderProps) {
  const [currency, setCurrency] = useState<Currency>(defaultCurrency);
  const [locale, setLocale] = useState<Locale>(defaultLocale);

  useEffect(() => {
    // Helper function to get cookie value
    const getCookie = (name: string): string | null => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);

      if (parts.length === 2) return parts.pop()?.split(';').shift() || null;

      return null;
    };

    // Check localStorage first, then cookies as fallback
    const storedCurrency =
      localStorage.getItem('crypto-prices-currency') || getCookie('crypto-prices-currency');
    const storedLocale =
      localStorage.getItem('crypto-prices-locale') || getCookie('crypto-prices-locale');

    if (storedCurrency) {
      setCurrency(storedCurrency as Currency);
    }
    if (storedLocale) {
      setLocale(storedLocale as Locale);
    }
  }, []);

  const value = {
    currency,
    locale,
    setCurrency: (newCurrency: Currency) => {
      localStorage.setItem('crypto-prices-currency', newCurrency);
      // Also set cookie for server-side access
      document.cookie = `crypto-prices-currency=${newCurrency}; path=/; max-age=${60 * 60 * 24 * 365}`;
      setCurrency(newCurrency);
    },
    setLocale: (newLocale: Locale) => {
      localStorage.setItem('crypto-prices-locale', newLocale);
      // Also set cookie for server-side access
      document.cookie = `crypto-prices-locale=${newLocale}; path=/; max-age=${60 * 60 * 24 * 365}`;
      setLocale(newLocale);
    },
  };

  return (
    <SettingsProviderContext.Provider value={value}>{children}</SettingsProviderContext.Provider>
  );
}

export const useSettings = () => {
  const context = useContext(SettingsProviderContext);

  if (context === undefined) throw new Error('useSettings must be used within a SettingsProvider');

  return context;
};
