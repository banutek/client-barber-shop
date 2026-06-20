import type { RoleEnum } from '../enums'
import type { IBarberShopDtoOut } from './barber-shop.dto'

export interface ILoginUserDtoIn {
  email: string
  password: string
}

export interface ILoginUserResponse {
  access_token: string
  user: IUserDtoOut
}

export interface INewUserDtoIn {
  access_token?: string
  address: string
  email: string
  firstName: string
  lastName: string
  password: string
  phone: string
  role: RoleEnum
}

export interface IUserDtoOut {
  address: string
  client_device?: string
  createdAt: Date
  email: string
  firstName: string
  id: string
  lastName: string
  manager_barber_shop?: IBarberShopDtoOut
  phone: string

  role: RoleEnum
  updatedAt: Date
  user_clients_profile?: string
}
