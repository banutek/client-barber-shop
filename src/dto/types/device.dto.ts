import type { IWaitingListNumbersDtoOut } from './waiting-list-numbers.dto'

export interface IDeviceDtoOut {
  client: string
  clientId: string
  createdAt: string
  device_notification: string[]
  device_scan_event: string[]
  device_waiting_list_number?: IWaitingListNumbersDtoOut[]
  id: string
  platform: string
  push_token?: string
  updatedAt: string
}

export interface INewDeviceDtoIn {
  platform: string
  push_token?: string
}
