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
  if (!pushEvent.data) return

  let payload: { body?: string; data?: { notificationId?: string }; icon?: string; title?: string }
  try {
    payload = pushEvent.data.json()
  } catch {
    // Fallback : le corps texte brut
    payload = { body: pushEvent.data.text(), title: 'Barber Shop' }
  }

  const title = payload.title || 'Barber Shop'
  const body = payload.body || 'Nouvelle notification'
  const icon = payload.icon || '/pwa-192x192.png'
  const notificationData = payload.data || {}

  const promiseChain = self.registration.showNotification(title, {
    badge: '/pwa-192x192.png',
    body,
    data: notificationData,
    icon,
    requireInteraction: true,
    vibrate: [200, 100, 200],
  } as NotificationOptions & { vibrate?: number[] })

  pushEvent.waitUntil(promiseChain)
})

self.addEventListener('notificationclick', (event: Event) => {
  const notificationEvent = event as NotificationEvent
  notificationEvent.notification.close()

  const notificationId: string | undefined = notificationEvent.notification.data?.notificationId
  const urlToOpen = notificationId ? `/notification/${notificationId}` : '/'

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
      client.postMessage({ notificationId, type: 'NOTIFICATION_CLICK', url: urlToOpen })
      return
    }
    if (self.clients.openWindow) {
      return self.clients.openWindow(urlToOpen)
    }
  }

  notificationEvent.waitUntil(handleClick())
})

// ── Gestion expiration/changement de la push subscription ──────────
// Le navigateur peut révoquer la subscription ; on notifie le thread
// principal pour qu'il relance l'abonnement (usePushSubscriptionHook).
self.addEventListener('pushsubscriptionchange', (event: Event) => {
  const subEvent = event as PushSubscriptionChangeEvent
  const promiseChain = (async () => {
    try {
      // Tente de se réabonner avec l'ancienne subscription si encore valide
      const windowClients = await self.clients.matchAll({ type: 'window' })
      for (const client of windowClients) {
        client.postMessage({ type: 'PUSH_SUBSCRIPTION_EXPIRED' })
      }
    } catch {
      // Silencieux : le polling reste actif
    }
  })()
  subEvent.waitUntil(promiseChain)
})

// Force le SW à s'activer immédiatement (skipWaiting)
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})
