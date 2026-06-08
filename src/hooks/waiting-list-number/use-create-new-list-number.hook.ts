import { useMutation } from "@tanstack/react-query"
import type { INewWaitingListNumberDtoIn, IWaitingListNumbersDtoOut } from "../../dto"
import type { AxiosResponse } from "axios"
import { WaitingListNumberService } from "../../services"

export const useCreateNewListNumberHook = () => {
    return useMutation<AxiosResponse<{ waitingNumber: IWaitingListNumbersDtoOut }>, Error, INewWaitingListNumberDtoIn>({
        mutationKey: ['create-new-waitin-list-number'],
        mutationFn: (body: INewWaitingListNumberDtoIn) => {
            return WaitingListNumberService.create_new_waiting_list_number(body.waitingListId, body.deviceId)
        },
        retry: 0
    })
}