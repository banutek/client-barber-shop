import { useQuery } from '@tanstack/react-query'
import { ShopService } from '../../services'
import type { IBarberShopDtoOut } from '../../dto'
import type { AxiosResponse } from 'axios'

export const useGetShopByIDHook = (shopId: string) => {
  return useQuery<AxiosResponse<{ shop: IBarberShopDtoOut }>, Error>({
    enabled: !!shopId,
    queryFn: () => {
      return ShopService.get_barber_shop_by_id(shopId)
    },
    queryKey: ['get-shop-by-id', shopId],
    retry: 0,
  })
}
