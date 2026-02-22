const CACHE_NAME = 'neodb-data-v1';
const DATA_PATH_PREFIX = '/data/neodb/';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  if (!url.pathname.startsWith(DATA_PATH_PREFIX)) return;

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(event.request);

    const networkPromise = fetch(event.request)
      .then((response) => {
        if (response && response.ok) {
          cache.put(event.request, response.clone());
        }
        return response;
      })
      .catch(() => null);

    if (cached) {
      event.waitUntil(networkPromise);
      return cached;
    }

    const networkResponse = await networkPromise;
    if (networkResponse) return networkResponse;

    return new Response('[]', {
      headers: { 'Content-Type': 'application/json' }
    });
  })());
});
