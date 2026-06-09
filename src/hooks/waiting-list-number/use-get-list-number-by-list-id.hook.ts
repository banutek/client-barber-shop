import { useQuery } from "@tanstack/react-query"
import type { IWaitingListNumbersDtoOut } from "../../dto"
import type { AxiosResponse } from "axios"
import { WaitingListNumberService } from "../../services"

export const useGetListNumberByListIdHook = (listId: string) => {
    return useQuery<AxiosResponse<{ waitingListNumbers: IWaitingListNumbersDtoOut[] }>, Error>({
        queryKey: ['get-list-number-by-list-id', listId],
        queryFn: () => {
            return WaitingListNumberService.get_waiting_list_number_by_list_id(listId)
        },
        enabled: !!listId,
        retry: 0
    })
}