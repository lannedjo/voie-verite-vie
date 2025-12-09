const CACHE_NAME = '3v-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/src/index.css',
  '/src/main.tsx'
];

// Installation du service worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache ouvert');
        return cache.addAll(urlsToCache);
      })
  );
});

// Activation et nettoyage des anciens caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Suppression ancien cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Stratégie de cache: Network First, fallback sur cache
self.addEventListener('fetch', (event) => {
  // Ne mettre en cache que les requêtes GET
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Vérifier que la réponse est valide avant de la mettre en cache
        if (!response || response.status !== 200 || response.type === 'error') {
          return response;
        }

        // Cloner la réponse car elle ne peut être consommée qu'une fois
        const responseToCache = response.clone();
        
        caches.open(CACHE_NAME)
          .then((cache) => {
            try {
              cache.put(event.request, responseToCache);
            } catch (e) {
              // Ignorer les erreurs de caching
              console.warn('Erreur caching:', e);
            }
          })
          .catch(() => {
            // Ignorer les erreurs d'ouverture du cache
          });
        
        return response;
      })
      .catch(() => {
        // En cas d'échec du réseau, utiliser le cache
        return caches.match(event.request)
          .catch(() => {
            // Retourner une réponse vide si rien ne correspond
            return new Response('', {
              status: 408,
              statusText: 'Request Timeout'
            });
          });
      })
  );
});
