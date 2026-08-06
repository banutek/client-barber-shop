import { useEffect } from 'react'
import { useNotificationsHook, usePushSubscriptionHook } from '@/hooks'
import { useDeviceStore, useNotificationStore } from '@/stores'

export interface NotificationsProviderProps {
  children: React.ReactNode
}

/**
 * Fournisseur de notifications :
 * - Polling toutes les 15s via React Query
 * - Synchronise les données dans le store Zustand
 * - Déclenche l'abonnement Push (demande permission + POST token)
 */
export const NotificationsProvider: React.FC<NotificationsProviderProps> = ({ children }) => {
  const { currentDevice, setCurrentDevice } = useDeviceStore()
  const { setNotifications } = useNotificationStore()
  const { mutate: subscribeToPush } = usePushSubscriptionHook(currentDevice?.id ?? '')

  // Polling des notifications
  const { data: notificationsData } = useNotificationsHook(currentDevice?.id ?? '')

  // Sync vers le store Zustand
  useEffect(() => {
    if (notificationsData?.data?.notifications) {
      setNotifications(notificationsData.data.notifications)
    }
  }, [notificationsData, setNotifications])

  // Abonnement Push au montage (une fois le device connu)
  useEffect(() => {
    if (!currentDevice?.id) return

    // Vérifie si déjà abonné
    if (currentDevice.push_token) {
      console.warn('[Push] Device déjà abonné aux notifications push')
      return
    }

    // Tente l'abonnement push
    subscribeToPush(undefined, {
      onError: (err) => {
        console.warn('[Push] Abonnement push échoué:', err.message)
      },
      onSuccess: () => {
        console.warn('[Push] Abonnement push réussi')
        // Marque le device comme abonné pour éviter de relancer l'abonnement
        if (currentDevice) {
          setCurrentDevice({ ...currentDevice, push_token: 'subscribed' })
        }
      },
    })
  }, [currentDevice?.id, currentDevice?.push_token, subscribeToPush])

  // Écoute le message du Service Worker signalant une subscription expirée
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'PUSH_SUBSCRIPTION_EXPIRED' && currentDevice) {
        console.warn('[Push] Subscription expirée, reset du push_token pour réabonnement')
        setCurrentDevice({ ...currentDevice, push_token: undefined })
      }
    }
    navigator.serviceWorker?.addEventListener('message', handleMessage)
    return () => navigator.serviceWorker?.removeEventListener('message', handleMessage)
  }, [currentDevice, setCurrentDevice])

  return <>{children}</>
}
