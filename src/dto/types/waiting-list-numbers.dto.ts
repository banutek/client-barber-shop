import type { WaitingListNumberStatus } from '../enums'
import type { IWaitingListDtoOut } from './waiting-list.dto'

export interface INewWaitingListNumberDtoIn {
  deviceId: string
  waitingListId: string
}

export interface IWaitingListNumbersDtoOut {
  barcode: string
  createdAt: Date
  device: any
  deviceId: string
  id: string
  status: WaitingListNumberStatus
  updatedAt: Date
  value: string
  waiting_list_number_notification: any
  waiting_list_number_scan_event: any
  waitingList: IWaitingListDtoOut
  waitingListId: string
}
