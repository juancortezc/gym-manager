const CACHE_NAME = 'gym-manager-v2'
const urlsToCache = [
  '/',
  '/login',
  '/dashboard',
  '/members',
  '/operations',
  '/config',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png',
]

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache')
        // Add URLs with explicit redirect handling
        return Promise.all(
          urlsToCache.map((url) => {
            return fetch(url, { redirect: 'follow' })
              .then((response) => {
                if (!response || response.status !== 200 || response.type === 'opaque') {
                  console.log('Skipping cache for:', url)
                  return
                }
                return cache.put(url, response)
              })
              .catch((error) => {
                console.log('Failed to cache:', url, error)
              })
          })
        )
      })
  )
})

// Fetch event
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        if (response) {
          return response
        }
        
        // Clone the request because it can only be used once
        const fetchRequest = event.request.clone()
        
        return fetch(fetchRequest, { redirect: 'follow' })
          .then((response) => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response
            }

            // Clone the response because it can only be used once
            const responseToCache = response.clone()

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache)
              })

            return response
          })
          .catch((error) => {
            console.log('Fetch failed:', error)
            // You could return a custom offline page here
          })
      })
  )
})

// Activate event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
})