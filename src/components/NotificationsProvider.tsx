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
  const { currentDevice } = useDeviceStore()
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
      },
    })
  }, [currentDevice?.id, currentDevice?.push_token, subscribeToPush])

  return <>{children}</>
}
