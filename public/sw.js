/*
 * Service worker for "The Flashes — A Companion".
 * Strategy: stale-while-revalidate for same-origin GET requests, with the
 * start page precached so the installed app opens offline. The base path is
 * derived from the worker's own location, so this keeps working if the site's
 * base ever changes.
 */
const VERSION = 'flashes-v1';
const BASE = new URL('./', self.location).pathname; // e.g. "/flashes/"
const START = BASE; // start_url / offline navigation fallback

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(VERSION)
      .then((cache) => cache.addAll([START]).catch(() => {}))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // only handle our own assets

  event.respondWith(
    caches.match(req).then((cached) => {
      const network = fetch(req)
        .then((res) => {
          // Cache good, same-origin responses for next time.
          if (res && res.ok && res.type === 'basic') {
            const copy = res.clone();
            caches.open(VERSION).then((cache) => cache.put(req, copy));
          }
          return res;
        })
        .catch(() => {
          // Offline: fall back to cache, then to the start page for navigations.
          if (cached) return cached;
          if (req.mode === 'navigate') return caches.match(START);
          return Response.error();
        });

      // Serve cache immediately if present; otherwise wait for the network.
      return cached || network;
    })
  );
});

// Allow the page to trigger an immediate update.
self.addEventListener('message', (event) => {
  if (event.data === 'skipWaiting') self.skipWaiting();
});
