
const CACHE_NAME = "offline-pwa-v1";
const ASSETS = [
    '/deutsch/',
    '/deutsch/index.html',
    '/deutsch/styles.css',
    '/deutsch/app.js',
    '/deutsch/manifest.json',
    '/deutsch/icons/icon-192x192.png',
    '/deutsch/icons/icon-512x512.png',
    '/deutsch/pages/gender.html',
    '/deutsch/utils/db.js',
];

// Install event - Cache all necessary files
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS);
        })
    );
});

// Fetch event - Serve cached files
self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        }).catch(() => caches.match("/index.html")) // Serve offline fallback
    );
});
