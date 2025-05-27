import { Suspense } from 'react';

import { ClientWrapper } from '@/components/client-wrapper';
import { CryptoSkeleton } from '@/components/crypto-skeleton';
import { DynamicDemoBanner } from '@/components/dynamic-demo-banner';
import { DynamicHeader } from '@/components/dynamic-header';
import { ErrorBoundary } from '@/components/error-boundary';
import { Footer } from '@/components/footer';
import { fetchCryptoPrices } from '@/lib/coingecko';
import { getMessagesSync } from '@/lib/messages';
import { getServerLocale, getStaticLocale } from '@/lib/server-locale';

export async function generateMetadata() {
  const locale = getStaticLocale();
  const messages = getMessagesSync(locale);

  return {
    title: `${messages.crypto.title} - ${locale === 'es' ? 'Precios de Criptomonedas en Tiempo Real' : 'Real-time Cryptocurrency Prices'}`,
    description: messages.crypto.description,
    keywords:
      locale === 'es'
        ? 'criptomonedas, precios crypto, bitcoin, ethereum, datos de mercado, tiempo real'
        : 'cryptocurrency, crypto prices, bitcoin, ethereum, market data, real-time',
    openGraph: {
      title: messages.crypto.title,
      description: messages.crypto.description,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: messages.crypto.title,
      description: messages.crypto.description,
    },
  };
}

async function CryptoData() {
  try {
    const locale = await getServerLocale();
    const messages = getMessagesSync(locale);
    const initialData = await fetchCryptoPrices('USD', 20);

    return <ClientWrapper fallbackMessages={messages} initialData={initialData} />;
  } catch (error) {
    console.error('Failed to fetch initial crypto data:', error);
    const locale = await getServerLocale();
    const messages = getMessagesSync(locale);

    return (
      <div className='flex items-center justify-center p-8'>
        <p className='text-destructive'>{messages.crypto.fetchError}</p>
      </div>
    );
  }
}

export default async function HomePage() {
  const locale = await getServerLocale();
  const messages = getMessagesSync(locale);

  return (
    <div className='min-h-screen bg-background flex flex-col'>
      <DynamicHeader fallbackMessages={messages} />

      <main className='container mx-auto px-4 py-6 flex-1'>
        <DynamicDemoBanner fallbackMessages={messages} />
        <ErrorBoundary>
          <Suspense fallback={<CryptoSkeleton messages={messages} />}>
            <CryptoData />
          </Suspense>
        </ErrorBoundary>
      </main>

      <Footer messages={messages} />
    </div>
  );
}
