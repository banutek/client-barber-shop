import { useQuery } from '@tanstack/react-query'
import { WaitingListNumberService } from '../../services'
import type { IWaitingListNumbersDtoOut } from '../../dto'
import type { AxiosResponse } from 'axios'

export const useGetListNumberByListIdHook = (listId: string) => {
  return useQuery<AxiosResponse<{ waitingListNumbers: IWaitingListNumbersDtoOut[] }>, Error>({
    enabled: !!listId,
    queryFn: () => {
      return WaitingListNumberService.get_waiting_list_number_by_list_id(listId)
    },
    queryKey: ['get-list-number-by-list-id', listId],
    retry: 0,
  })
}
