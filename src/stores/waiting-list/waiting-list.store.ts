import { create } from 'zustand'
import type { IWaitingListDtoOut } from '@/dto'

type WaitingListStore = {
  currentWaitingList: IWaitingListDtoOut | null
  setCurrentWaitingList: (shop: IWaitingListDtoOut | null) => void
}

export const useWaitingListStore = create<WaitingListStore>()((set) => ({
  currentWaitingList: null,

  setCurrentWaitingList: (list: IWaitingListDtoOut | null) =>
    set(() => ({ currentWaitingList: list })),
}))
