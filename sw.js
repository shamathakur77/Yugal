/* =============================================================
   sw.js — minimal service worker for an installable PWA.

   Strategy
   --------
   - Pre-cache the app shell (HTML/CSS/JS) on install so the app opens
     offline. data.js (the large base64 gallery) is cached on first use
     rather than up-front to keep install fast.
   - Network-first for navigation + same-origin requests, falling back
     to cache when offline. The Supabase CDN + Google Fonts are left to
     the browser/network (app.js already degrades gracefully without
     them). Bump CACHE_VERSION whenever you change cached files.
   ============================================================= */

const CACHE_VERSION = 'yugal-wedding-v2';
const APP_SHELL = [
  './',
  './index.html',
  './css/styles.css',
  './js/lang.js',
  './js/supabase.js',
  './js/animations.js',
  './js/audio.js',
  './js/gallery.js',
  './js/app.js',
  './manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  // Only manage same-origin requests; let CDN/fonts/Supabase pass through.
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    fetch(req)
      .then((res) => {
        // Update cache in the background with a fresh copy.
        const copy = res.clone();
        caches.open(CACHE_VERSION).then((cache) => cache.put(req, copy)).catch(() => {});
        return res;
      })
      .catch(() =>
        caches.match(req).then((cached) => cached || caches.match('./index.html'))
      )
  );
});
