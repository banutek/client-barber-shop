import { useQuery } from '@tanstack/react-query'
import { NotificationService } from '@/services'
import type { INotificationListDtoOut } from '@/dto'
import type { AxiosResponse } from 'axios'

export const useNotificationsHook = (deviceId: string) => {
  return useQuery<AxiosResponse<INotificationListDtoOut>, Error>({
    enabled: !!deviceId,
    queryFn: () => {
      return NotificationService.get_notifications_by_device(deviceId)
    },
    queryKey: ['get-notifications', deviceId],
    refetchInterval: 15_000,
    retry: 0,
  })
}
