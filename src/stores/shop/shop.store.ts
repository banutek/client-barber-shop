import { create } from 'zustand'
import type { IBarberShopDtoOut } from '../../dto'

type ShopStore = {
  currentShop: IBarberShopDtoOut | null
  setCurrentShop: (shop: IBarberShopDtoOut | null) => void
}

export const useShopStore = create<ShopStore>()((set) => ({
  currentShop: null,

  setCurrentShop: (shop: IBarberShopDtoOut | null) => set(() => ({ currentShop: shop })),
}))
