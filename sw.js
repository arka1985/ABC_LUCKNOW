// Benign Canine - Progressive Web App Service Worker (v2.0.9)
const CACHE_NAME = 'benign-canine-cache-v9';
const ASSETS = [
  './index.html',
  './styles.css?v=2.0.9',
  './bhashini.js?v=2.0.9',
  './map.js?v=2.0.9',
  './app.js?v=2.0.9',
  './LUCKNOW/lucknow_ward_boundary.js?v=2.0.9',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// Install Event - Caching basic shell assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[PWA Service Worker] Caching static assets shell...');
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate Event - Cleaning old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            console.log('[PWA Service Worker] Clearing old cache:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event - Network first, falling back to cache
self.addEventListener('fetch', event => {
  // Only handle GET requests and local files/specified CDNs
  if (event.request.method !== 'GET' || !event.request.url.startsWith(self.location.origin) && !event.request.url.includes('unpkg.com') && !event.request.url.includes('cdnjs.cloudflare.com')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Cache the newly fetched resource if valid
        if (response && response.status === 200) {
          const responseCopy = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseCopy);
          });
        }
        return response;
      })
      .catch(() => {
        // Fallback to cache if network is unavailable
        return caches.match(event.request);
      })
  );
});
