import type { CryptoCurrency } from '@/types/crypto';

interface CachedData {
  data: CryptoCurrency[];
  timestamp: number;
  currency: string;
  compressed?: boolean;
}

const CACHE_KEY_PREFIX = 'crypto-prices-cache';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds
const MAX_CACHE_SIZE = 10; // Maximum number of currency caches to keep

// Simple compression for localStorage
function compressData(data: CryptoCurrency[]): string {
  try {
    // Remove unnecessary fields and compress
    const compressed = data.map((crypto) => ({
      i: crypto.id,
      s: crypto.symbol,
      n: crypto.name,
      img: crypto.image,
      p: crypto.current_price,
      mc: crypto.market_cap,
      r: crypto.market_cap_rank,
      c: crypto.price_change_percentage_24h,
      v: crypto.total_volume,
      u: crypto.last_updated,
    }));

    return JSON.stringify(compressed);
  } catch {
    return JSON.stringify(data);
  }
}

function decompressData(compressed: string): CryptoCurrency[] {
  try {
    const data = JSON.parse(compressed);

    if (Array.isArray(data) && data[0]?.i) {
      // Decompress
      return data.map((crypto) => ({
        id: crypto.i,
        symbol: crypto.s,
        name: crypto.n,
        image: crypto.img,
        current_price: crypto.p,
        market_cap: crypto.mc,
        market_cap_rank: crypto.r,
        price_change_percentage_24h: crypto.c,
        total_volume: crypto.v,
        last_updated: crypto.u,
      }));
    }

    return data; // Fallback for uncompressed data
  } catch {
    return [];
  }
}

export class CryptoCache {
  private static getCacheKey(currency: string): string {
    return `${CACHE_KEY_PREFIX}-${currency.toLowerCase()}`;
  }

  static set(data: CryptoCurrency[], currency: string): void {
    if (typeof window === 'undefined') return;

    try {
      const cacheKey = this.getCacheKey(currency);
      const compressedData = compressData(data);

      const cachedData: CachedData = {
        data: [], // We store compressed data separately
        timestamp: Date.now(),
        currency: currency.toLowerCase(),
        compressed: true,
      };

      // Store metadata and compressed data separately for better performance
      localStorage.setItem(cacheKey, JSON.stringify(cachedData));
      localStorage.setItem(`${cacheKey}-data`, compressedData);

      // Clean up old caches
      this.cleanupOldCaches();
    } catch (error) {
      console.warn('Failed to cache crypto data:', error);
    }
  }

  static get(currency: string): CryptoCurrency[] | null {
    if (typeof window === 'undefined') return null;

    try {
      const cacheKey = this.getCacheKey(currency);
      const cached = localStorage.getItem(cacheKey);
      const cachedDataRaw = localStorage.getItem(`${cacheKey}-data`);

      if (!cached || !cachedDataRaw) return null;

      const cachedData: CachedData = JSON.parse(cached);

      // Check if cache is still valid (within cache duration)
      const isValid = Date.now() - cachedData.timestamp < CACHE_DURATION;

      if (!isValid) {
        this.clearCurrency(currency);

        return null;
      }

      return decompressData(cachedDataRaw);
    } catch (error) {
      console.warn('Failed to retrieve cached crypto data:', error);
      this.clearCurrency(currency);

      return null;
    }
  }

  static getLastUpdated(currency: string): Date | null {
    if (typeof window === 'undefined') return null;

    try {
      const cacheKey = this.getCacheKey(currency);
      const cached = localStorage.getItem(cacheKey);

      if (!cached) return null;

      const cachedData: CachedData = JSON.parse(cached);

      return new Date(cachedData.timestamp);
    } catch {
      return null;
    }
  }

  static clearCurrency(currency: string): void {
    if (typeof window === 'undefined') return;

    try {
      const cacheKey = this.getCacheKey(currency);

      localStorage.removeItem(cacheKey);
      localStorage.removeItem(`${cacheKey}-data`);
    } catch (error) {
      console.warn('Failed to clear crypto cache for currency:', currency, error);
    }
  }

  static clear(): void {
    if (typeof window === 'undefined') return;

    try {
      // Clear all crypto cache entries
      const keys = Object.keys(localStorage);

      keys.forEach((key) => {
        if (key.startsWith(CACHE_KEY_PREFIX)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.warn('Failed to clear crypto cache:', error);
    }
  }

  static isStale(currency: string): boolean {
    if (typeof window === 'undefined') return true;

    try {
      const cacheKey = this.getCacheKey(currency);
      const cached = localStorage.getItem(cacheKey);

      if (!cached) return true;

      const cachedData: CachedData = JSON.parse(cached);

      return Date.now() - cachedData.timestamp >= CACHE_DURATION;
    } catch {
      return true;
    }
  }

  private static cleanupOldCaches(): void {
    if (typeof window === 'undefined') return;

    try {
      const keys = Object.keys(localStorage);
      const cacheKeys = keys
        .filter((key) => key.startsWith(CACHE_KEY_PREFIX) && !key.endsWith('-data'))
        .map((key) => {
          try {
            const data = JSON.parse(localStorage.getItem(key) || '{}');

            return { key, timestamp: data.timestamp || 0 };
          } catch {
            return { key, timestamp: 0 };
          }
        })
        .sort((a, b) => b.timestamp - a.timestamp);

      // Remove oldest caches if we exceed the limit
      if (cacheKeys.length > MAX_CACHE_SIZE) {
        const toRemove = cacheKeys.slice(MAX_CACHE_SIZE);

        toRemove.forEach(({ key }) => {
          localStorage.removeItem(key);
          localStorage.removeItem(`${key}-data`);
        });
      }
    } catch (error) {
      console.warn('Failed to cleanup old caches:', error);
    }
  }

  static getCacheStats(): { size: number; currencies: string[]; totalSize: number } {
    if (typeof window === 'undefined') return { size: 0, currencies: [], totalSize: 0 };

    try {
      const keys = Object.keys(localStorage);
      const cacheKeys = keys.filter((key) => key.startsWith(CACHE_KEY_PREFIX));
      const currencies = cacheKeys
        .filter((key) => !key.endsWith('-data'))
        .map((key) => key.replace(`${CACHE_KEY_PREFIX}-`, ''));

      const totalSize = cacheKeys.reduce((size, key) => {
        const item = localStorage.getItem(key);

        return size + (item ? item.length : 0);
      }, 0);

      return {
        size: currencies.length,
        currencies,
        totalSize,
      };
    } catch {
      return { size: 0, currencies: [], totalSize: 0 };
    }
  }
}
