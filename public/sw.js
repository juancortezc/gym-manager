const CACHE_NAME = 'gym-manager-v4'
const urlsToCache = [
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png',
]

// Install event
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...')
  self.skipWaiting()
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache')
        return cache.addAll(urlsToCache)
      })
      .catch((error) => {
        console.error('Cache addAll failed:', error)
      })
  )
})

// Activate event
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...')
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('Deleting old cache:', cacheName)
              return caches.delete(cacheName)
            }
          })
        )
      })
      .then(() => {
        return self.clients.claim()
      })
  )
})

// Fetch event
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return
  }

  // Skip navigation requests (let the browser handle page loads)
  if (request.mode === 'navigate') {
    return
  }

  // Skip API calls and Next.js internal routes
  if (url.pathname.startsWith('/api/') || 
      url.pathname.startsWith('/_next/') ||
      url.pathname.includes('.json') && url.pathname !== '/manifest.json') {
    return
  }

  // Only handle static assets
  const isStaticAsset = 
    url.pathname.endsWith('.png') || 
    url.pathname.endsWith('.jpg') || 
    url.pathname.endsWith('.jpeg') ||
    url.pathname.endsWith('.gif') ||
    url.pathname.endsWith('.ico') ||
    url.pathname.endsWith('.svg') ||
    url.pathname === '/manifest.json'

  if (isStaticAsset) {
    event.respondWith(
      caches.match(request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse
          }

          return fetch(request)
            .then((response) => {
              // Only cache successful responses
              if (!response || response.status !== 200 || response.type !== 'basic') {
                return response
              }

              const responseToCache = response.clone()
              
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(request, responseToCache)
                })

              return response
            })
        })
        .catch((error) => {
          console.error('Fetch failed:', error)
        })
    )
  }
})