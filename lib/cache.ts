import type { CryptoCurrency } from '@/types/crypto';

interface CachedData {
  data: CryptoCurrency[];
  timestamp: number;
  currency: string;
}

const CACHE_KEY = 'crypto-prices-cache';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

export class CryptoCache {
  static set(data: CryptoCurrency[], currency: string): void {
    try {
      const cachedData: CachedData = {
        data,
        timestamp: Date.now(),
        currency,
      };

      localStorage.setItem(CACHE_KEY, JSON.stringify(cachedData));
    } catch (error) {
      console.warn('Failed to cache crypto data:', error);
    }
  }

  static get(currency: string): CryptoCurrency[] | null {
    try {
      const cached = localStorage.getItem(CACHE_KEY);

      if (!cached) return null;

      const cachedData: CachedData = JSON.parse(cached);

      // Check if cache is for the same currency
      if (cachedData.currency !== currency) return null;

      // Check if cache is still valid (within cache duration)
      const isValid = Date.now() - cachedData.timestamp < CACHE_DURATION;

      if (!isValid) {
        this.clear();

        return null;
      }

      return cachedData.data;
    } catch (error) {
      console.warn('Failed to retrieve cached crypto data:', error);
      this.clear();

      return null;
    }
  }

  static getLastUpdated(currency: string): Date | null {
    try {
      const cached = localStorage.getItem(CACHE_KEY);

      if (!cached) return null;

      const cachedData: CachedData = JSON.parse(cached);

      if (cachedData.currency !== currency) return null;

      return new Date(cachedData.timestamp);
    } catch {
      return null;
    }
  }

  static clear(): void {
    try {
      localStorage.removeItem(CACHE_KEY);
    } catch (error) {
      console.warn('Failed to clear crypto cache:', error);
    }
  }

  static isStale(currency: string): boolean {
    try {
      const cached = localStorage.getItem(CACHE_KEY);

      if (!cached) return true;

      const cachedData: CachedData = JSON.parse(cached);

      if (cachedData.currency !== currency) return true;

      return Date.now() - cachedData.timestamp >= CACHE_DURATION;
    } catch {
      return true;
    }
  }
}
