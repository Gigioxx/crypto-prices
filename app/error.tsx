'use client';

import { AlertCircle, RefreshCw } from 'lucide-react';
import { useEffect } from 'react';

import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className='min-h-screen bg-background flex items-center justify-center'>
      <div className='text-center space-y-4 p-8'>
        <AlertCircle className='w-16 h-16 text-destructive mx-auto' />
        <h2 className='text-2xl font-bold'>Something went wrong!</h2>
        <p className='text-muted-foreground max-w-md'>
          We encountered an error while loading the cryptocurrency data. Please try again.
        </p>
        <Button className='mt-4' onClick={reset}>
          <RefreshCw className='w-4 h-4 mr-2' />
          Try again
        </Button>
      </div>
    </div>
  );
}
