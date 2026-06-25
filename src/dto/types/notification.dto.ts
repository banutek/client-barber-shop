import type { NotificationStatus, NotificationType } from '../enums/notification.enum'
import type { IDeviceDtoOut } from './device.dto'
import type { IWaitingListNumbersDtoOut } from './waiting-list-numbers.dto'

export interface INotificationDtoOut {
  createdAt: string
  device: IDeviceDtoOut
  deviceId: string
  id: string
  message: string
  status: NotificationStatus
  type: NotificationType
  updatedAt: string
  waitingListNumber?: IWaitingListNumbersDtoOut
  waitingListNumberId?: string
}

export interface INotificationListDtoOut {
  notifications: INotificationDtoOut[]
}

export interface INotificationStatusDtoIn {
  status: NotificationStatus
}
