import type { WaitingListStatusEnum } from '../enums'
import type { IBarberShopDtoOut } from './barber-shop.dto'
import type { IWaitingListNumbersDtoOut } from './waiting-list-numbers.dto'

export interface INewWaitingListDtoIn {
  barberShopId: string
  current_number: number
  session_date: Date
  status: string
}

export interface IUpdateWaitingListStatusDtoIn {
  status: WaitingListStatusEnum
}

export interface IWaitingListDtoOut {
  barberShop: IBarberShopDtoOut
  barberShopId: string
  createdAt: Date
  current_number: number
  id: string
  session_date: Date
  status: string
  updatedAt: Date
  waiting_list_numbers: IWaitingListNumbersDtoOut[]
}
