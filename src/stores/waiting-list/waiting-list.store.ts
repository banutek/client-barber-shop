import { create } from 'zustand'
import type { IWaitingListDtoOut } from '@/dto'

type WaitingListStore = {
  currentWaitingList: IWaitingListDtoOut | null
  setCurrentWaitingList: (shop: IWaitingListDtoOut) => void
}

export const useWaitingListStore = create<WaitingListStore>()((set) => ({
  currentWaitingList: null,

  setCurrentWaitingList: (list: IWaitingListDtoOut) => set(() => ({ currentWaitingList: list })),
}))
