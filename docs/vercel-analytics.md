# Vercel Analytics Integration

This document describes the Vercel Analytics integration implemented in the crypto-prices application.

## Overview

Vercel Analytics has been integrated to track page views, user interactions, and performance metrics for the crypto-prices application.

## Implementation

### 1. Package Installation

The `@vercel/analytics` package (v1.5.0) has been added to the project dependencies:

```bash
bun add @vercel/analytics
```

### 2. Analytics Component Integration

The Analytics component has been added to the root layout (`app/layout.tsx`):

```tsx
import { Analytics } from '@vercel/analytics/next';

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
```

## Features

- **Automatic Page View Tracking**: Tracks all page visits and route changes
- **Performance Monitoring**: Monitors Core Web Vitals (LCP, CLS, FID/INP)
- **Next.js App Router Support**: Seamless integration with Next.js 15 App Router
- **Privacy Compliant**: Follows Vercel's privacy standards and data compliance

## Next Steps

To complete the setup:

1. **Enable Analytics in Vercel Dashboard**:

   - Go to your project in the Vercel dashboard
   - Navigate to the Analytics tab
   - Click "Enable" to activate Web Analytics

2. **Deploy to Vercel**:

   ```bash
   vercel deploy
   ```

3. **Verify Integration**:
   - After deployment, visit your site
   - Check browser Network tab for requests to `/_vercel/insights/view`
   - View analytics data in the Vercel dashboard

## Additional Configuration

For advanced usage, you can:

- Add custom events using `track()` function
- Configure custom properties
- Set up conversion tracking
- Filter and segment data in the dashboard

## References

- [Vercel Analytics Documentation](https://vercel.com/docs/analytics/quickstart)
- [Next.js Integration Guide](https://vercel.com/docs/analytics/quickstart#add-the-analytics-component-to-your-app)
