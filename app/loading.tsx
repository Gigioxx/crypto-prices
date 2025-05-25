import { CryptoSkeleton } from '@/components/crypto-skeleton';
import { Header } from '@/components/header';
import enMessages from '@/messages/en.json';

export default function Loading() {
  return (
    <div className='min-h-screen bg-background'>
      <Header messages={enMessages} />
      <main className='container mx-auto px-4 py-6'>
        <CryptoSkeleton />
      </main>
    </div>
  );
}
