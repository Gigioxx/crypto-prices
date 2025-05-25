'use client';

import { useEffect, useState } from 'react';

import { CryptoSkeleton } from '@/components/crypto-skeleton';
import { CryptoTable } from '@/components/crypto-table';
import type { CryptoCurrency } from '@/types/crypto';

interface ClientWrapperProps {
  initialData: CryptoCurrency[];
  messages: any;
}

export function ClientWrapper({ initialData, messages }: ClientWrapperProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <CryptoSkeleton />;
  }

  return <CryptoTable initialData={initialData} messages={messages} />;
}
