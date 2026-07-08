import { useMutation, useQueryClient } from '@tanstack/react-query'
import { WaitingListNumberService } from '../../services'
import { WaitingListNumberStatus } from '../../dto/enums'
import type { IWaitingListNumbersDtoOut } from '../../dto'
import type { AxiosResponse } from 'axios'

export interface IUpdateStatusVars {
  numberId: string
  status: WaitingListNumberStatus
}

/**
 * Mutation pour mettre à jour le statut d'un waiting-list-number.
 * Invalide le cache React Query après succès pour rafraîchir les listes.
 */
export const useUpdateWaitingListNumberStatusHook = () => {
  const queryClient = useQueryClient()

  return useMutation<
    AxiosResponse<{ waitingListNumber: IWaitingListNumbersDtoOut }>,
    Error,
    IUpdateStatusVars
  >({
    mutationFn: ({ numberId, status }: IUpdateStatusVars) => {
      return WaitingListNumberService.update_waiting_list_number_status(numberId, status)
    },
    mutationKey: ['update-waiting-list-number-status'],
    onSuccess: (_data, _variables) => {
      // Invalider les queries concernées pour rafraîchir les données
      void queryClient.invalidateQueries({
        queryKey: ['get-list-number-by-list-id'],
      })
      void queryClient.invalidateQueries({
        queryKey: ['get-list-number-by-shop-id'],
      })
    },
    retry: 0,
  })
}
