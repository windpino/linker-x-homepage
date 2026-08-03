const CACHE_NAME = 'linker-x-cache-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/logo192.png',
  '/logo512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Try to cache assets, ignore errors on dynamic/re-routed resources during build phase
      return cache.addAll(ASSETS_TO_CACHE).catch(err => console.log('Caching initial assets skipped:', err));
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Offline-first asset fallback resolution
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).catch((err) => {
        // Fallback resolution for document routing on reload
        if (event.request.mode === 'navigate') {
          return caches.match('/');
        }
        return Promise.reject(err);
      });
    })
  );
});
