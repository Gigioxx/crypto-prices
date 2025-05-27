import type { Metadata, Viewport } from 'next';
import type React from 'react';

import { Analytics } from '@vercel/analytics/next';
import { Inter } from 'next/font/google';

import { LocaleLayout } from '@/components/locale-layout';
import { SettingsProvider } from '@/components/settings-provider';
import { ThemeProvider } from '@/components/theme-provider';
import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
};

export const metadata: Metadata = {
  title: 'Crypto Prices',
  description: 'Real-time cryptocurrency prices and market data',
  manifest: '/manifest.json',
  icons: {
    icon: [
      {
        url: '/favicon-light.svg',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/favicon-dark.svg',
        media: '(prefers-color-scheme: dark)',
      },
    ],
    shortcut: '/favicon.svg',
    apple: [{ url: '/icon-192x192.svg', sizes: '192x192', type: 'image/svg+xml' }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'CryptoPrices',
  },
  formatDetection: {
    telephone: false,
  },
  other: {
    'mobile-web-app-capable': 'yes',
  },
  generator: 'v0.dev',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning className='dark' lang='en'>
      <body className={inter.className}>
        <ThemeProvider defaultTheme='dark' storageKey='crypto-prices-theme'>
          <SettingsProvider defaultCurrency='USD' defaultLocale='en'>
            <LocaleLayout />
            {children}
          </SettingsProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
