/* Salt & Diesel service worker — offline play + faster repeat loads.
   Strategy: pre-cache the shell on install; runtime-cache everything else
   same-origin (music MP3s land here the first time they play, ~15 MB total).
   Bump VERSION whenever index.html changes so players get the new build. */
const VERSION = 'sd-v1';
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

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || !e.request.url.startsWith(self.location.origin)) return;
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
