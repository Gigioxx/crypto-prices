import type { Metadata } from 'next';
import type React from 'react';

import { Inter } from 'next/font/google';

import '@/styles/globals.css';
import { PerformanceMonitor } from '@/components/performance-monitor';
import { SettingsProvider } from '@/components/settings-provider';
import { ThemeProvider } from '@/components/theme-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Crypto Price Tracker',
  description: 'Real-time cryptocurrency prices and market data',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=5',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'CryptoTracker',
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
