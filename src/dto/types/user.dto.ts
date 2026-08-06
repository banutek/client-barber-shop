import type { IBarberShopDtoOut } from './barber-shop.dto'
import { RoleEnum } from '../enums'
import type { IDeviceDtoOut } from './device.dto'

type Role = (typeof RoleEnum)[keyof typeof RoleEnum]

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
  role: Role
  deviceId: string
}

export interface IUserDtoOut {
  id: string
  lastName: string
  firstName: string
  email: string
  phone?: string
  address?: string
  password: string
  role: Role
  createdAt: Date
  updatedAt: Date
  manager_barber_shop?: IBarberShopDtoOut
  client_device?: IDeviceDtoOut

  user_clients_profile?: string
}
