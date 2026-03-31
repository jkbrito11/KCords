const CACHE_NAME = 'kcords-v2'
const ASSETS_TO_CACHE = ['/', '/index.html', '/manifest.webmanifest', '/pwa-icon.svg', '/favicon.svg']

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE)
    }),
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))),
    ),
  )
  self.clients.claim()
})

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})

async function networkFirst(request, fallbackUrl) {
  try {
    const response = await fetch(request)
    if (response && response.status === 200 && response.type === 'basic') {
      const cache = await caches.open(CACHE_NAME)
      cache.put(request, response.clone())
    }
    return response
  } catch {
    const cached = await caches.match(request)
    if (cached) {
      return cached
    }
    return caches.match(fallbackUrl)
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME)
  const cached = await cache.match(request)
  const networkPromise = fetch(request)
    .then((response) => {
      if (response && response.status === 200 && response.type === 'basic') {
        cache.put(request, response.clone())
      }
      return response
    })
    .catch(() => null)

  return cached || networkPromise || caches.match('/index.html')
}

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    return
  }

  const url = new URL(event.request.url)

  // For SPA navigation, prefer network to get latest build quickly.
  if (event.request.mode === 'navigate') {
    event.respondWith(networkFirst(event.request, '/index.html'))
    return
  }

  if (url.origin === self.location.origin) {
    event.respondWith(staleWhileRevalidate(event.request))
    return
  }

  event.respondWith(fetch(event.request).catch(() => caches.match(event.request)))
})
