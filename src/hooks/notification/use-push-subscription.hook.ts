import { useMutation } from '@tanstack/react-query'
import { NotificationService } from '@/services'
import type { AxiosResponse } from 'axios'

/**
 * VAPID public key — issue de la variable d'environnement VITE_VAPID_PUBLIC_KEY.
 * Le backend utilise la clé privée correspondante (VAPID_PRIVATE_KEY) pour signer.
 *
 * Génération d'une paire de clés (côté backend) :
 *   npx web-push generate-vapid-keys
 */
const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY as string

async function subscribeUserToPush(): Promise<null | PushSubscription> {
  const registration = await navigator.serviceWorker.ready
  const existingSubscription = await registration.pushManager.getSubscription()
  if (existingSubscription) {
    return existingSubscription
  }

  const convertedVapidKey = urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
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
