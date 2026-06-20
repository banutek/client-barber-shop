import { useQuery } from '@tanstack/react-query'
import { ShopService } from '../../services'
import type { IBarberShopDtoOut } from '../../dto'
import type { AxiosResponse } from 'axios'

export const useGetActiveShopsHook = (deviceConnected: string) => {
  return useQuery<AxiosResponse<{ shops: IBarberShopDtoOut[] }>, Error>({
    enabled: !!deviceConnected,
    queryFn: () => {
      return ShopService.get_all_active_shop()
    },
    queryKey: ['get-active-shops'],
    retry: 0,
  })
}
