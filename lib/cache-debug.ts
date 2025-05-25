import { CryptoCache } from './cache';

// Debug utilities for cache monitoring (development only)
export const CacheDebug = {
  // Log cache status to console
  logCacheStatus(currency: string): void {
    if (process.env.NODE_ENV !== 'development') return;

    const cachedData = CryptoCache.get(currency);
    const lastUpdated = CryptoCache.getLastUpdated(currency);
    const isStale = CryptoCache.isStale(currency);

    console.group(`🗄️ Cache Status for ${currency}`);
    console.log('Has cached data:', !!cachedData);
    console.log('Data count:', cachedData?.length || 0);
    console.log('Last updated:', lastUpdated?.toLocaleString() || 'Never');
    console.log('Is stale:', isStale);
    console.log(
      'Cache age:',
      lastUpdated ? `${Math.round((Date.now() - lastUpdated.getTime()) / 1000)}s` : 'N/A',
    );
    console.groupEnd();
  },

  // Clear cache and log action
  clearCache(): void {
    if (process.env.NODE_ENV !== 'development') return;

    CryptoCache.clear();
    console.log('🗑️ Cache cleared');
  },

  // Monitor cache operations
  monitorCache(): void {
    if (process.env.NODE_ENV !== 'development') return;

    // Add to window for browser console access
    if (typeof window !== 'undefined') {
      (window as any).cryptoCache = {
        status: (currency: string) => this.logCacheStatus(currency),
        clear: () => this.clearCache(),
        get: (currency: string) => CryptoCache.get(currency),
        isStale: (currency: string) => CryptoCache.isStale(currency),
      };

      console.log('🔧 Cache debug tools available at window.cryptoCache');
    }
  },
};
