'use client';

import { useEffect, useState } from 'react';

import { CryptoSkeleton } from '@/components/crypto-skeleton';
import { CryptoTable } from '@/components/crypto-table';
import { useMessages } from '@/hooks/use-messages';
import type { CryptoCurrency } from '@/types/crypto';

interface ClientWrapperProps {
  initialData: CryptoCurrency[];
  fallbackMessages: any;
}

export function ClientWrapper({ initialData, fallbackMessages }: ClientWrapperProps) {
  const [isClient, setIsClient] = useState(false);
  const messages = useMessages();

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <CryptoSkeleton messages={fallbackMessages} />;
  }

  // Use dynamic messages if available, otherwise fallback to server messages
  const currentMessages = messages || fallbackMessages;

  return <CryptoTable initialData={initialData} messages={currentMessages} />;
}
