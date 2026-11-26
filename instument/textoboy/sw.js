const V = 'doceditor-v5';
const SHELL = ['./','./index.html','./styles.css','./app.js','./docx-export.js','./manifest.json','./icon.svg'];
const CDN = [
  'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js',
  'https://cdn.jsdelivr.net/npm/mammoth@1.6.0/mammoth.browser.min.js',
  'https://cdn.jsdelivr.net/npm/docx-preview@0.3.5/dist/docx-preview.min.js',
  'https://cdn.jsdelivr.net/npm/marked@12.0.2/marked.min.js',
  'https://cdn.jsdelivr.net/npm/turndown@7.1.3/dist/turndown.js',
  'https://cdn.jsdelivr.net/npm/turndown-plugin-gfm@1.0.2/dist/turndown-plugin-gfm.js',
  'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-light.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/ace/1.32.6/ace.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/ace/1.32.6/ext-language_tools.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/ace/1.32.6/ext-searchbox.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/ace/1.32.6/theme-tomorrow_night.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/ace/1.32.6/theme-chrome.min.js'
];

self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const c = await caches.open(V);
    await c.addAll(SHELL);
    await Promise.allSettled(CDN.map(u => c.add(new Request(u, { mode: 'no-cors' }))));
    self.skipWaiting();
  })());
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k !== V) await caches.delete(k);
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const sameOrigin = new URL(req.url).origin === location.origin;

  if (req.mode === 'navigate') {
    e.respondWith((async () => {
      try { const r = await fetch(req); (await caches.open(V)).put('./index.html', r.clone()); return r; }
      catch { return (await caches.match('./index.html')) || Response.error(); }
    })());
    return;
  }
  e.respondWith((async () => {
    const c = await caches.open(V), hit = await c.match(req);
    const net = fetch(req).then(r => { if (r && (r.ok || r.type === 'opaque')) c.put(req, r.clone()); return r; }).catch(() => null);
    if (hit) return hit;
    return (await net) || (sameOrigin ? Response.error() : new Response('', { status: 504 }));
  })());
});