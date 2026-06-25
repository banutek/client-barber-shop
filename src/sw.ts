// Service Worker custom — géré par vite-plugin-pwa (strategies: 'injectManifest')
// Combine le precaching Workbox + les notifications Push

import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching'

declare let self: ServiceWorkerGlobalScope & {
  __WB_MANIFEST: Array<{ revision: null | string; url: string }>
}

// Precaching des assets générés par Vite
cleanupOutdatedCaches()
precacheAndRoute(self.__WB_MANIFEST)

// ── Push Notifications ──────────────────────────────────────────────

self.addEventListener('push', (event: Event) => {
  const pushEvent = event as PushEvent
  const data: { body?: string; icon?: string; title?: string; url?: string } = {
    body: 'Nouvelle notification',
    title: 'Barber Shop',
  }

  try {
    if (pushEvent.data) {
      const payload = pushEvent.data.json()
      data.title = payload.title || data.title
      data.body = payload.body || data.body
      data.icon = payload.icon || '/pwa-192x192.png'
      data.url = payload.url || '/'
    }
  } catch {
    if (pushEvent.data) {
      data.body = pushEvent.data.text()
    }
  }

  const promiseChain = self.registration.showNotification(data.title!, {
    badge: '/pwa-192x192.png',
    body: data.body!,
    data: { url: data.url },
    icon: data.icon || '/pwa-192x192.png',
    vibrate: [200, 100, 200],
  })

  pushEvent.waitUntil(promiseChain)
})

self.addEventListener('notificationclick', (event: Event) => {
  const notificationEvent = event as NotificationEvent
  notificationEvent.notification.close()

  const urlToOpen: string = notificationEvent.notification.data?.url || '/'

  async function handleClick() {
    const windowClients = await self.clients.matchAll({
      includeUncontrolled: true,
      type: 'window',
    })
    for (const client of windowClients) {
      if (!(client.url.includes(self.location.origin) && 'focus' in client)) {
        continue
      }

      client.focus()
      client.postMessage({ type: 'NOTIFICATION_CLICK', url: urlToOpen })
      return
    }
    if (self.clients.openWindow) {
      return self.clients.openWindow(urlToOpen)
    }
  }

  notificationEvent.waitUntil(handleClick())
})

// Force le SW à s'activer immédiatement (skipWaiting)
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})
