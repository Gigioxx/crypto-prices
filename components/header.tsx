'use client';

import { Moon, Sun, Globe, DollarSign } from 'lucide-react';

import { useSettings } from '@/components/settings-provider';
import { useTheme } from '@/components/theme-provider';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { currencies, locales, type Currency } from '@/i18n/config';

interface HeaderProps {
  messages: any;
}

export function Header({ messages }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const { currency, locale, setCurrency, setLocale } = useSettings();

  return (
    <header className='sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/60'>
      <div className='container mx-auto px-4 py-4'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-xl font-bold'>{messages.crypto.title}</h1>
            <p className='text-sm text-muted-foreground hidden sm:block'>
              {messages.crypto.description}
            </p>
          </div>

          <div className='flex items-center space-x-2'>
            {/* Currency Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className='h-9' size='sm' variant='outline'>
                  <DollarSign className='w-4 h-4 mr-1' />
                  <span className='hidden sm:inline'>{currency}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                {Object.entries(currencies).map(([code, info]) => (
                  <DropdownMenuItem
                    key={code}
                    className={currency === code ? 'bg-accent' : ''}
                    onClick={() => setCurrency(code as Currency)}
                  >
                    {info.symbol} {code}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className='h-9' size='sm' variant='outline'>
                  <Globe className='w-4 h-4 mr-1' />
                  <span className='hidden sm:inline uppercase'>{locale}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                {locales.map((loc) => (
                  <DropdownMenuItem
                    key={loc}
                    className={locale === loc ? 'bg-accent' : ''}
                    onClick={() => setLocale(loc)}
                  >
                    {loc === 'en' ? 'English' : 'Español'}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Theme Toggle */}
            <Button
              className='h-9'
              size='sm'
              variant='outline'
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            >
              <Sun className='h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
              <Moon className='absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
              <span className='sr-only'>
                {theme === 'light' ? messages.common.darkMode : messages.common.lightMode}
              </span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
