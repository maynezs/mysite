const CACHE_NAME = 'archigpt-trainers-v1';
const PRECACHE_URLS = [
    "./trainers.html",
    "./manifest.webmanifest",
    "./css/trainers.css",
    "./js/trainers.js",
    "./js/app-shell.js",
    "./icons/icon.svg",
    "./icons/icon-192.png",
    "./icons/icon-512.png",
    "./trainers/trenertext.html",
    "./css/trenertext.css",
    "./js/trenertext.js",
    "./trainers/mathcheburashka.html",
    "./css/mathcheburashka.css",
    "./js/mathcheburashka.js",
    "./trainers/mathkvadrat.html",
    "./css/mathkvadrat.css",
    "./js/mathkvadrat.js",
    "./trainers/mathtrener8-8.html",
    "./css/mathtrener8-8.css",
    "./js/mathtrener8-8.js",
    "./trainers/kvadraturv.html",
    "./css/kvadraturv.css",
    "./js/kvadraturv.js",
    "./trainers/ogemathtouch.html",
    "./css/ogemathtouch.css",
    "./js/ogemathtouch.js"
];
const CACHEABLE_HOSTS = [self.location.host, 'fonts.googleapis.com', 'fonts.gstatic.com'];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(PRECACHE_URLS))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys()
            .then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
            .then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', event => {
    const request = event.request;
    if (request.method !== 'GET') return;
    if (!CACHEABLE_HOSTS.includes(new URL(request.url).host)) return;
    event.respondWith(staleWhileRevalidate(request));
});

async function staleWhileRevalidate(request) {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request, { ignoreSearch: true });
    const network = fetch(request)
        .then(response => {
            if (response && (response.ok || response.type === 'opaque')) cache.put(request, response.clone());
            return response;
        })
        .catch(() => cached);
    return cached || network;
}
