import { Github, Globe, X } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface FooterProps {
  messages: any;
}

export function Footer({ messages }: FooterProps) {
  return (
    <footer className='border-t border-border bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/60'>
      <div className='container mx-auto px-4 py-6'>
        <div className='flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0'>
          <div className='text-center md:text-left'>
            <p className='text-sm text-muted-foreground'>
              © 2024 Crypto Price Tracker. Built with Next.js 15 & React 19.
            </p>
            <p className='text-xs text-muted-foreground mt-1'>Data provided by CoinGecko API</p>
          </div>

          <div className='flex items-center space-x-2'>
            <Button asChild size='sm' variant='ghost'>
              <a
                aria-label='Guillermo CasanovaGitHub'
                href='https://github.com/Gigioxx'
                rel='noopener noreferrer'
                target='_blank'
              >
                <Github className='w-4 h-4' />
              </a>
            </Button>
            <Button asChild size='sm' variant='ghost'>
              <a
                aria-label='X.com website'
                href='https://x.com/Gigiox15'
                rel='noopener noreferrer'
                target='_blank'
              >
                <X className='w-4 h-4' />
              </a>
            </Button>
            <Button asChild size='sm' variant='ghost'>
              <a
                aria-label='Guillermo Casanova Website'
                href='https://www.guillermocasanova.cl/'
                rel='noopener noreferrer'
                target='_blank'
              >
                <Globe className='w-4 h-4' />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}
