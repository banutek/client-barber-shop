import type { IWaitingListDtoOut } from '@/dto'
import { create } from 'zustand'

type WaitingListStore = {
  currentWaitingList: IWaitingListDtoOut | null
  setCurrentWaitingList: (shop: IWaitingListDtoOut) => void
}

export const useWaitingListStore = create<WaitingListStore>()((set) => ({
  currentWaitingList: null,

  setCurrentWaitingList: (list: IWaitingListDtoOut) => set(() => ({ currentWaitingList: list })),
}))
