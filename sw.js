// RapidAid — minimal service worker
// Caches the app shell so the site can install as a PWA and reload instantly.
// This does NOT cache booking data — bookings always go live to Firestore.

const CACHE_NAME = 'rapidaid-v1';
const APP_SHELL = [
  './',
  './index.html'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Network-first for everything — always try live data first,
  // fall back to cache only if the network is unavailable.
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
