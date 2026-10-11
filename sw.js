/* Santa Clara EC — service worker
   Estratégia: página = rede primeiro (cai para o cache offline); arquivos do próprio site = cache + atualização em segundo plano;
   imagens, fontes e bibliotecas externas = cache em execução. Ao publicar uma versão nova, troque o número em VERSION. */
const VERSION = 'scec-v3';
const CORE = ['./', 'index.html', 'manifest.webmanifest', 'css/base.css', 'css/polish.css', 'css/features.css',
  'js/boot.js', 'js/config.js', 'js/jogos.js', 'js/data.js', 'js/app.js', 'js/ui-base.js', 'js/fanzone.js', 'js/extras.js', 'js/meu-jogo.js',
  'js/polish.js', 'js/central.js', 'js/calendario.js', 'js/clube.js', 'js/institucional.js', 'js/desempenho.js', 'js/pwa.js', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/apple-touch-icon.png', '404.html'];
const EXTERNAL = /(fonts\.googleapis\.com|fonts\.gstatic\.com|cdn\.jsdelivr\.net|cdnjs\.cloudflare\.com)/;

self.addEventListener('install', e => { e.waitUntil(caches.open(VERSION).then(c => Promise.all(CORE.map(u => c.add(u).catch(() => {})))).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION && k !== VERSION + '-ext').map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const r = e.request; if (r.method !== 'GET') return;
  const u = new URL(r.url);
  if (r.mode === 'navigate') {
    e.respondWith(fetch(r).then(res => { const cp = res.clone(); if (res.ok && res.type === 'basic') caches.open(VERSION).then(c => c.put('index.html', cp)); return res; }).catch(() => caches.match('index.html').then(h => h || caches.match('404.html'))));
    return;
  }
  if (u.origin === location.origin) {
    e.respondWith(caches.match(r).then(hit => {
      const net = fetch(r).then(res => { if (res.ok) { const cp = res.clone(); caches.open(VERSION).then(c => c.put(r, cp)); } return res; }).catch(() => hit);
      return hit || net;
    }));
    return;
  }
  if (r.destination === 'image' || EXTERNAL.test(u.host)) {
    e.respondWith(caches.match(r).then(hit => hit || fetch(r).then(res => { const cp = res.clone(); caches.open(VERSION + '-ext').then(c => c.put(r, cp)); return res; }).catch(() => hit)));
  }
});
