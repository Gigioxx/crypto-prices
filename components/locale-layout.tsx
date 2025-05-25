'use client';

import { useEffect } from 'react';

import { useSettings } from '@/components/settings-provider';

export function LocaleLayout() {
  const { locale } = useSettings();

  useEffect(() => {
    // Update the html lang attribute when locale changes
    document.documentElement.lang = locale;
  }, [locale]);

  return null;
}
