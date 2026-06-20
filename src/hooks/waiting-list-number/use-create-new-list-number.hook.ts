import { useMutation } from '@tanstack/react-query'
import { WaitingListNumberService } from '../../services'
import type { INewWaitingListNumberDtoIn, IWaitingListNumbersDtoOut } from '../../dto'
import type { AxiosResponse } from 'axios'

export const useCreateNewListNumberHook = () => {
  return useMutation<
    AxiosResponse<{ waitingListNumber: IWaitingListNumbersDtoOut }>,
    Error,
    INewWaitingListNumberDtoIn
  >({
    mutationFn: (body: INewWaitingListNumberDtoIn) => {
      return WaitingListNumberService.create_new_waiting_list_number(
        body.waitingListId,
        body.deviceId,
      )
    },
    mutationKey: ['create-new-waitin-list-number'],
    retry: 0,
  })
}
