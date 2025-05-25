import type { Metadata, Viewport } from 'next';
import type React from 'react';

import { Inter } from 'next/font/google';

import { PerformanceMonitor } from '@/components/performance-monitor';
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
        <ThemeProvider defaultTheme='dark' storageKey='crypto-tracker-theme'>
          <SettingsProvider defaultCurrency='USD' defaultLocale='en'>
            {children}
            <PerformanceMonitor />
          </SettingsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
