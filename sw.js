/* Salt & Diesel service worker — offline play + faster repeat loads.
   Strategy (1F-COPACETIC fix):
   - The game shell (navigations / index.html / manifest) is NETWORK-FIRST:
     online players always get the newest deploy, the cache only serves it
     when the network fails (offline play). No release step to remember.
   - Everything else (music MP3s ~15 MB, icons) is cache-first: those files
     change rarely and are the whole point of caching.
   VERSION bumps flush old caches on activate; sd-v2 also evicts any
   sd-v1 caches from the brief cache-first era. */
const VERSION = 'sd-v2';
const SHELL = ['./', 'index.html', 'manifest.webmanifest'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

/* The shell must never be pinned: a stale index.html is a stale game. */
function isShell(req, url) {
  return req.mode === 'navigate' ||
    url.pathname.endsWith('/index.html') || url.pathname.endsWith('/') ||
    url.pathname.endsWith('/manifest.webmanifest');
}

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || !e.request.url.startsWith(self.location.origin)) return;
  const url = new URL(e.request.url);

  if (isShell(e.request, url)) {
    e.respondWith(
      fetch(e.request).then(res => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(VERSION).then(c => c.put(e.request, copy));
        }
        return res;
      }).catch(() =>
        caches.match(e.request, { ignoreSearch: true })
          .then(hit => hit || caches.match('index.html'))
      )
    );
    return;
  }

  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then(hit =>
      hit ||
      fetch(e.request).then(res => {
        if (res.ok && res.type === 'basic') {
          const copy = res.clone();
          caches.open(VERSION).then(c => c.put(e.request, copy));
        }
        return res;
      })
    ).catch(() => caches.match('index.html'))
  );
});
