'use client';

import { useEffect, useState } from 'react';

import { useSettings } from '@/components/settings-provider';
import { getMessages, type Messages } from '@/lib/messages';

/**
 * Custom hook to get messages based on the current locale
 * Automatically updates when locale changes
 */
export function useMessages(): Messages | null {
  const { locale } = useSettings();
  const [messages, setMessages] = useState<Messages | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadMessages = async () => {
      try {
        const newMessages = await getMessages(locale);

        if (isMounted) {
          setMessages(newMessages);
        }
      } catch (error) {
        console.error('Failed to load messages:', error);
        // Fallback to English messages
        try {
          const fallbackMessages = await getMessages('en');

          if (isMounted) {
            setMessages(fallbackMessages);
          }
        } catch (fallbackError) {
          console.error('Failed to load fallback messages:', fallbackError);
        }
      }
    };

    loadMessages();

    return () => {
      isMounted = false;
    };
  }, [locale]);

  return messages;
}
