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
    const storedCurrency = localStorage.getItem('crypto-tracker-currency') as Currency;
    const storedLocale = localStorage.getItem('crypto-tracker-locale') as Locale;

    if (storedCurrency) {
      setCurrency(storedCurrency);
    }
    if (storedLocale) {
      setLocale(storedLocale);
    }
  }, []);

  const value = {
    currency,
    locale,
    setCurrency: (currency: Currency) => {
      localStorage.setItem('crypto-tracker-currency', currency);
      setCurrency(currency);
    },
    setLocale: (locale: Locale) => {
      localStorage.setItem('crypto-tracker-locale', locale);
      setLocale(locale);
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
