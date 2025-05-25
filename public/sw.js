const CACHE_NAME = 'crypto-tracker-v1';
const urlsToCache = ['/', '/api/crypto', 'https://api.coingecko.com/api/v3/coins/markets'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache)));
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached version or fetch from network
      return response || fetch(event.request);
    }),
  );
});
