import { AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

import { DynamicHeader } from '@/components/dynamic-header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getMessagesSync } from '@/lib/messages';
import { getStaticLocale } from '@/lib/server-locale';

/**
 * Custom not found page for coin detail routes
 */
export default function CoinNotFound() {
  const locale = getStaticLocale();
  const messages = getMessagesSync(locale);

  return (
    <div className='min-h-screen bg-background flex flex-col'>
      <DynamicHeader fallbackMessages={messages} />

      <main className='flex-1'>
        <div className='container mx-auto px-4 py-6 max-w-2xl'>
          <div className='mb-6'>
            <Button asChild variant='ghost'>
              <Link className='flex items-center gap-2' href='/'>
                <ArrowLeft className='h-4 w-4' />
                {messages.coinDetail.backToHome}
              </Link>
            </Button>
          </div>

          <Card className='text-center'>
            <CardHeader className='pb-4'>
              <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10'>
                <AlertCircle className='h-8 w-8 text-destructive' />
              </div>
              <CardTitle className='text-2xl'>{messages.coinDetail.coinNotFound}</CardTitle>
              <CardDescription className='text-base'>
                {messages.coinDetail.coinNotFoundDescription}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                <p className='text-sm text-muted-foreground'>
                  {messages.coinDetail.notFoundReasons}
                </p>
                <ul className='text-sm text-muted-foreground space-y-1 text-left max-w-md mx-auto'>
                  <li>• {messages.coinDetail.reasonIncorrectId}</li>
                  <li>• {messages.coinDetail.reasonDelisted}</li>
                  <li>• {messages.coinDetail.reasonTempIssue}</li>
                </ul>

                <div className='bg-muted/50 rounded-lg p-4 mt-4'>
                  <h4 className='font-medium text-sm mb-3'>
                    {messages.coinDetail.tryPopularCoins}
                  </h4>
                  <div className='flex flex-wrap gap-2 justify-center'>
                    <Button asChild size='sm' variant='outline'>
                      <Link href='/coins/bitcoin'>Bitcoin</Link>
                    </Button>
                    <Button asChild size='sm' variant='outline'>
                      <Link href='/coins/ethereum'>Ethereum</Link>
                    </Button>
                    <Button asChild size='sm' variant='outline'>
                      <Link href='/coins/binancecoin'>BNB</Link>
                    </Button>
                    <Button asChild size='sm' variant='outline'>
                      <Link href='/coins/solana'>Solana</Link>
                    </Button>
                    <Button asChild size='sm' variant='outline'>
                      <Link href='/coins/cardano'>Cardano</Link>
                    </Button>
                  </div>
                </div>

                <div className='pt-4 flex flex-col sm:flex-row gap-3 justify-center'>
                  <Button asChild>
                    <Link href='/'>{messages.coinDetail.viewAllCryptos}</Link>
                  </Button>
                  <Button asChild variant='outline'>
                    <Link href='/'>{messages.coinDetail.goToHomepage}</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer messages={messages} />
    </div>
  );
}
