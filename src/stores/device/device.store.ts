import { create } from 'zustand'
import type { IDeviceDtoOut } from '../../dto'

type DeviceStore = {
  currentDevice: IDeviceDtoOut | null
  setCurrentDevice: (shop: IDeviceDtoOut | null) => void
}

export const useDeviceStore = create<DeviceStore>()((set) => ({
  currentDevice: null,
  currentWaitingList: null,

  setCurrentDevice: (shop: IDeviceDtoOut | null) => set(() => ({ currentDevice: shop })),
}))
