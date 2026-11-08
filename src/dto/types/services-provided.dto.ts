import type { IBarberShopDtoOut } from './barber-shop.dto'
import type { IGalleryDtoOut } from './gallery.dto'

export interface IServicesProvidedDtoOut {
  id: string
  parentId?: string
  label: string
  description?: string
  price?: number
  durationMin?: number
  imageUrl?: string
  count: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  barberShops: IBarberShopDtoOut[]
  service_shop_gallery: IGalleryDtoOut[]
}
