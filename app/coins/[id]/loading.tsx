import { ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * Loading page for coin detail that matches the actual layout
 */
export default function CoinDetailLoading() {
  return (
    <div className='min-h-screen bg-background flex flex-col'>
      {/* Header Skeleton */}
      <header className='border-b'>
        <div className='container mx-auto px-4 py-4'>
          <div className='flex items-center justify-between'>
            <Skeleton className='h-8 w-32' />
            <div className='flex items-center gap-4'>
              <Skeleton className='h-8 w-20' />
              <Skeleton className='h-8 w-20' />
            </div>
          </div>
        </div>
      </header>

      <main className='flex-1'>
        <div className='container mx-auto px-4 py-6 max-w-7xl'>
          {/* Header with back button */}
          <div className='mb-6'>
            <Button className='mb-4' variant='ghost'>
              <div className='flex items-center gap-2'>
                <ArrowLeft className='h-4 w-4' />
                <Skeleton className='h-4 w-24' />
              </div>
            </Button>
          </div>

          {/* Coin Header Skeleton */}
          <Card>
            <CardHeader>
              <div className='flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4'>
                <div className='flex items-center gap-4'>
                  <Skeleton className='rounded-full h-16 w-16' />
                  <div>
                    <Skeleton className='h-8 w-32 mb-2' />
                    <Skeleton className='h-6 w-16 mb-2' />
                    <Skeleton className='h-6 w-20' />
                  </div>
                </div>
                <div className='text-left sm:text-right'>
                  <Skeleton className='h-8 w-32 mb-2' />
                  <Skeleton className='h-4 w-20' />
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Statistics Skeleton */}
          <div className='mt-8'>
            <Skeleton className='h-8 w-32 mb-4' />
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
              {Array.from({ length: 6 }).map((_, index) => (
                <Card key={index}>
                  <CardContent className='p-4'>
                    <Skeleton className='h-4 w-24 mb-2' />
                    <Skeleton className='h-6 w-32' />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Chart Skeleton */}
          <div className='mt-8'>
            <Card>
              <CardHeader>
                <Skeleton className='h-6 w-32' />
                <div className='flex gap-2'>
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className='h-8 w-12' />
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <Skeleton className='h-80 w-full' />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer Skeleton */}
      <footer className='border-t mt-auto'>
        <div className='container mx-auto px-4 py-6'>
          <div className='flex flex-col md:flex-row justify-between items-center gap-4'>
            <Skeleton className='h-6 w-48' />
            <div className='flex gap-4'>
              <Skeleton className='h-6 w-16' />
              <Skeleton className='h-6 w-16' />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
