// Service Worker: proxies */api/yahoo/* → Yahoo Finance + CORS headers
// This is the "backend" — except it runs entirely in the browser.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  // Match /api/yahoo/... regardless of base path (e.g. /dca-backtest/api/yahoo/...)
  const idx = url.pathname.indexOf('/api/yahoo/');
  if (idx !== -1) {
    const yahooPath = url.pathname.slice(idx + '/api/yahoo'.length) + url.search;
    const yahooUrl = 'https://query2.finance.yahoo.com' + yahooPath;
    e.respondWith(
      fetch(yahooUrl).then(r => {
        const headers = new Headers(r.headers);
        headers.set('Access-Control-Allow-Origin', '*');
        headers.set('Cache-Control', 'public, max-age=300');
        return new Response(r.body, { status: r.status, headers });
      })
    );
  }
});
