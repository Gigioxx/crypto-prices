'use client';

import { Info, X } from 'lucide-react';
import { useState } from 'react';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

export function DemoBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <Alert className='mb-4 border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950'>
      <Info className='h-4 w-4 text-blue-600 dark:text-blue-400' />
      <AlertDescription className='flex items-center justify-between'>
        <span className='text-blue-800 dark:text-blue-200'>
          Demo mode: Showing sample cryptocurrency data. Real-time data may be limited due to API
          rate limits.
        </span>
        <Button
          className='h-auto p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200'
          size='sm'
          variant='ghost'
          onClick={() => setIsVisible(false)}
        >
          <X className='h-4 w-4' />
        </Button>
      </AlertDescription>
    </Alert>
  );
}
