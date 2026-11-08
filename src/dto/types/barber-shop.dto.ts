import type { IServicesProvidedDtoOut } from './services-provided.dto'
import type { IUserDtoOut } from './user.dto'
import type { IWaitingListDtoOut } from './waiting-list.dto'

export interface IBarberShopDtoOut {
  id: string
  name: string
  email: string
  phone: string
  address: string
  openStatus: string
  profileImage: string
  hours: string
  closingTime: string
  isActive: boolean
  latitude: number
  longitude: number
  manager: IUserDtoOut
  managerId: string
  barber_shop_scan_event: string
  barber_shop_subscription: string
  barber_shop_waiting_list: IWaitingListDtoOut[]
  barber_shop_service: IServicesProvidedDtoOut[]
  createdAt: Date
  updatedAt: Date
}
