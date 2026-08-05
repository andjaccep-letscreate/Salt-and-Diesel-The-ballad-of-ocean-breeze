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
/* No './' entry: the shell lives under exactly ONE cache key ('index.html')
   so there is never a second, stale copy under '/'. no-cache Requests keep a
   brand-new install from precaching an HTTP-cache-stale shell. */
const SHELL = ['index.html', 'manifest.webmanifest'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION)
    .then(c => c.addAll(SHELL.map(u => new Request(u, { cache: 'no-cache' }))))
    .then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

/* The shell must never be pinned: a stale index.html is a stale game.
   STRICT path match (1F review NEW-1): only the scope root and index.html
   are the shell. A navigation to any other in-scope file (README.md,
   PRIVACY.md, sw.js itself) must NEVER overwrite the canonical cached game
   — it falls through to the generic handler instead. */
function isShell(url) {
  const scope = new URL(self.registration.scope).pathname;
  return url.pathname === scope || url.pathname === scope + 'index.html';
}

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || !e.request.url.startsWith(self.location.origin)) return;
  const url = new URL(e.request.url);

  if (isShell(url)) {
    /* Network-first with the 1F hardenings:
       - cache:'no-cache' revalidates past the HTTP cache, so a deploy is
         picked up immediately, not after the CDN max-age.
       - The body is REBUILT into a plain 200 Response (review NEW-2): a
         followed redirect handed back to a navigation respondWith would be
         rejected by the browser; a rebuilt response never carries the
         redirected flag. Stored under ONE canonical key ('index.html') so
         '/', '/index.html' and '?v=N' variants can't pile up copies.
       - An HTTP error page (Pages hiccup, 404/5xx) falls back to the
         cached game instead of being shown to the player. */
    e.respondWith(
      fetch(e.request.url, { cache: 'no-cache', credentials: 'same-origin' }).then(res => {
        if (!res.ok) return caches.match('index.html').then(hit => hit || res);
        return res.blob().then(body => {
          const clean = new Response(body, { status: 200, headers: res.headers });
          return caches.open(VERSION).then(c => c.put('index.html', clean.clone()))
            .then(() => clean, () => clean);
        });
      }).catch(() => caches.match('index.html'))
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
