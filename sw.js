const CACHE_NAME = 'kampus-kedileri-v5';
const urlsToCache = [
  './index.html',
  './style.css',
  './main.js',
  './manifest.json'
];

self.addEventListener('install', event => {
  self.skipWaiting(); // Yeni versiyonu beklemeden hemen kur
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Eski Önbellekleri Temizle
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim(); // Kontrolü anında ele al
});

// NETWORK FIRST (Önce İnternet, Çalışmazsa Önbellek)
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Eğer ağ isteği başarılıysa, cevabın kopyasını önbelleğe atıp kaydet (Güncel kalsın)
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => {
        // Eğer internet yoksa veya ağ çöktüyse önbellekteki (cache) veriyi sun
        return caches.match(event.request);
      })
  );
});
