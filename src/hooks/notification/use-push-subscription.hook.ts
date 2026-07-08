import { useMutation } from '@tanstack/react-query'
import { NotificationService } from '@/services'
import type { AxiosResponse } from 'axios'

/**
 * Récupère la clé publique VAPID depuis le backend (GET /notification/vapid-public-key)
 * puis s'abonne au PushManager. La clé est dynamique — plus besoin de variable d'env.
 */
async function subscribeUserToPush(): Promise<null | PushSubscription> {
  const registration = await navigator.serviceWorker.ready
  const existingSubscription = await registration.pushManager.getSubscription()
  if (existingSubscription) {
    return existingSubscription
  }

  // Récupère la clé publique VAPID auprès du backend
  const vapidRes = await NotificationService.get_vapid_public_key()
  const publicKey = (vapidRes.data as { publicKey?: string })?.publicKey
  if (!publicKey) {
    console.warn('[Push] Clé VAPID non configurée côté serveur')
    throw new Error('VAPID public key indisponible')
  }

  const convertedVapidKey = urlBase64ToUint8Array(publicKey)
  return registration.pushManager.subscribe({
    applicationServerKey: convertedVapidKey as BufferSource,
    userVisibleOnly: true,
  })
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replaceAll('-', '+').replaceAll('_', '/')
  const rawData = atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

export const usePushSubscriptionHook = (deviceId: string) => {
  return useMutation<AxiosResponse, Error, void>({
    mutationFn: async () => {
      if (!('serviceWorker' in navigator) || !('PushManager' in globalThis)) {
        console.warn('Push notifications non supportées sur ce navigateur')
        throw new Error('Push API non disponible')
      }

      const permission = await Notification.requestPermission()
      if (permission !== 'granted') {
        throw new Error('Permission de notification refusée')
      }

      const subscription = await subscribeUserToPush()
      if (!subscription) {
        throw new Error("Échec de l'abonnement push")
      }

      // Envoie le token au backend
      const pushToken = JSON.stringify(subscription.toJSON())
      return NotificationService.register_push_token(deviceId, pushToken)
    },
    mutationKey: ['push-subscribe', deviceId],
  })
}
