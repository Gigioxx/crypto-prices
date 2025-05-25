'use client';

import { Header } from '@/components/header';
import { useMessages } from '@/hooks/use-messages';
import type { Messages } from '@/lib/messages';

interface DynamicHeaderProps {
  fallbackMessages: Messages;
}

export function DynamicHeader({ fallbackMessages }: DynamicHeaderProps) {
  const messages = useMessages();

  // Use dynamic messages if available, otherwise fallback to server messages
  const currentMessages = messages || fallbackMessages;

  return <Header messages={currentMessages} />;
}
