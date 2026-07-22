export interface IServeByBarcodeDtoIn {
  barcode: string
}

export interface IServeByBarcodeDtoOut {
  success: boolean
  message: string
  data?: {
    waitingListNumber: {
      id: string
      value: string
      barcode: string
      status: string
      createdAt: string
      updatedAt: string
      inProgressAt: string | null
      completedAt: string | null
      waitingListId: string
      deviceId: string
    }
    waitingList: object
  }
}
