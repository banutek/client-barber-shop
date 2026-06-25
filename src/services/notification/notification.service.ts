import BaseMethods from '../BaseMethods'
import { notificationUrls, pushTokenUrls } from '../url'
import type { INotificationStatusDtoIn } from '@/dto'

export const NotificationService = {
  get_notifications_by_device: (deviceId: string) =>
    BaseMethods.getRequest(notificationUrls.GET_NOTIFICATIONS_BY_DEVICE(deviceId), false),

  /**
   * Envoie le push_token au backend.
   * pushToken = JSON.stringify(PushSubscription.toJSON())
   * → le backend le stocke dans Device.push_token pour webpush.sendNotification().
   */
  register_push_token: (deviceId: string, pushToken: string) =>
    BaseMethods.postRequest(
      pushTokenUrls.REGISTER_PUSH_TOKEN(deviceId),
      { push_token: pushToken },
      false,
    ),

  update_status: (notificationId: string, datas: INotificationStatusDtoIn) =>
    BaseMethods.patchRequest(
      notificationUrls.UPDATE_NOTIFICATION_STATUS(notificationId),
      datas,
      false,
    ),
}
