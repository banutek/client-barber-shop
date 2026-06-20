import type { IUserDtoOut } from './user.dto'
import type { IWaitingListDtoOut } from './waiting-list.dto'

export interface IBarberShopDtoOut {
  address: string
  barber_shop_scan_event: string
  barber_shop_subscription: string
  barber_shop_waiting_list: IWaitingListDtoOut[]
  createdAt: Date
  email: string
  id: string
  isActive: boolean
  latitude: number
  longitude: number
  manager: IUserDtoOut
  managerId: string
  name: string
  openStatus: string
  phone: string
  profileImage: string
  updatedAt: Date
}

export interface INewBarberShopDtoIn {
  address: string
  email?: string
  latitude?: number
  longitude?: number
  name: string
  phone: string
  profileImage?: File
}
