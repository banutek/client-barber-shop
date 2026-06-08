import { create } from 'zustand'
import type { IDeviceDtoOut } from '../../dto'

type ShopStore = {
  currentDevice: IDeviceDtoOut | null
  setCurrentDevice: (shop: IDeviceDtoOut | null) => void
}

export const useShopStore = create<ShopStore>()((set) => ({
  currentDevice: null,
  currentWaitingList: null,

  setCurrentDevice: (shop: IDeviceDtoOut | null) => set(() => ({ currentDevice: shop })),
}))
