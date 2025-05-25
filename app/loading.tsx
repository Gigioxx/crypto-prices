import { CryptoSkeleton } from '@/components/crypto-skeleton';
import { DynamicHeader } from '@/components/dynamic-header';
import { getMessagesSync } from '@/lib/messages';
import { getServerLocale } from '@/lib/server-locale';

export default async function Loading() {
  const locale = await getServerLocale();
  const messages = getMessagesSync(locale);

  return (
    <div className='min-h-screen bg-background'>
      <DynamicHeader fallbackMessages={messages} />
      <main className='container mx-auto px-4 py-6'>
        <CryptoSkeleton />
      </main>
    </div>
  );
}
