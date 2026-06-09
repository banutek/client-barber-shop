import { create } from 'zustand'
import type { IWaitingListNumbersDtoOut } from '../../dto'

type WaitingListNumberStore = {
  currentWaitingListNumber: IWaitingListNumbersDtoOut[]
  setCurrentWaitingListNumber: (shop: IWaitingListNumbersDtoOut[]) => void
}

export const useWaitingListNumberStore = create<WaitingListNumberStore>()((set) => ({
  currentWaitingListNumber: [],

  setCurrentWaitingListNumber: (listNumber: IWaitingListNumbersDtoOut[]) => set(() => ({ currentWaitingListNumber: listNumber })),
}))
