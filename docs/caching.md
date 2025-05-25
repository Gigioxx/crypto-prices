# Enhanced Caching System

This application implements a sophisticated caching system to provide a better user experience by showing the latest fetched data instead of fallback data during reloads or API failures.

## Features

### 🗄️ localStorage Persistence

- **Persistent Cache**: Data persists across browser sessions and page reloads
- **Currency-Specific**: Separate cache entries for different currencies (USD, EUR, CLP)
- **Automatic Expiration**: Cache expires after 5 minutes to ensure data freshness
- **Graceful Fallback**: Falls back to server data if cache is unavailable

### 🔄 SWR Integration

- **Enhanced Configuration**: Custom SWR setup optimized for crypto data
- **Smart Fallback**: Uses cached data when API calls fail
- **Background Updates**: Continues fetching fresh data while showing cached content
- **Error Recovery**: Automatically retries failed requests with exponential backoff

### 📊 Data Status Indicators

- **Visual Feedback**: Shows whether data is "Fresh" or "Cached"
- **Timestamp Display**: Shows when data was last updated
- **Internationalized**: Status indicators support multiple languages
- **Prominent Header**: Data status displayed above the table for visibility

## Implementation Details

### Cache Structure

```typescript
interface CachedData {
  data: CryptoCurrency[];
  timestamp: number;
  currency: string;
}
```

### Cache Duration

- **Default**: 5 minutes (300,000ms)
- **Configurable**: Can be adjusted in `lib/cache.ts`
- **Validation**: Automatic cleanup of stale data

### SWR Configuration

- **Refresh Interval**: 60 seconds for live updates
- **Deduplication**: 30 seconds to prevent duplicate requests
- **Error Retry**: 3 attempts with 5-second intervals
- **Keep Previous Data**: Shows cached data while fetching updates

## User Experience Benefits

1. **Faster Load Times**: Instant display of cached data on page load
2. **Offline Resilience**: Works with cached data when API is unavailable
3. **Reduced Fallback Data**: Users see real data instead of placeholder content
4. **Transparent Status**: Clear indication of data freshness
5. **Seamless Updates**: Background refresh without disrupting user experience

## Development Tools

### Browser Console Access

In development mode, cache debugging tools are available:

```javascript
// Check cache status
window.cryptoCache.status('USD');

// Get cached data
window.cryptoCache.get('USD');

// Check if data is stale
window.cryptoCache.isStale('USD');

// Clear cache
window.cryptoCache.clear();
```

### Console Logging

The system automatically logs cache operations in development:

- Cache hits and misses
- Data freshness status
- Cache age and expiration
- API fallback scenarios

## Configuration

### Cache Settings

Located in `lib/cache.ts`:

- `CACHE_DURATION`: How long data stays fresh (default: 5 minutes)
- `CACHE_KEY`: localStorage key for the cache

### SWR Settings

Located in `lib/swr-config.ts`:

- `refreshInterval`: How often to fetch fresh data (default: 60 seconds)
- `errorRetryCount`: Number of retry attempts (default: 3)
- `dedupingInterval`: Deduplication window (default: 30 seconds)

## Error Handling

The caching system gracefully handles various error scenarios:

1. **localStorage Unavailable**: Falls back to memory-only operation
2. **JSON Parse Errors**: Clears corrupted cache and starts fresh
3. **API Failures**: Uses cached data as fallback
4. **Network Issues**: Continues with cached data until connection restored

## Performance Impact

- **Minimal Overhead**: Efficient localStorage operations
- **Reduced API Calls**: Smart caching reduces server load
- **Faster Rendering**: Immediate display of cached content
- **Background Updates**: Non-blocking data refresh
