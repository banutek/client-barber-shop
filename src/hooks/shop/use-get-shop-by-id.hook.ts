import { useQuery } from "@tanstack/react-query"
import type { IBarberShopDtoOut } from "../../dto"
import type { AxiosResponse } from "axios"
import { ShopService } from "../../services"

export const useGetShopByIDHook = (shopId: string) => {
    return useQuery<AxiosResponse<{ shop: IBarberShopDtoOut }>, Error>({
        queryKey: ['get-shop-by-id', shopId],
        queryFn: () => {
            return ShopService.get_barber_shop_by_id(shopId)
        },
        enabled: !!shopId,
        retry: 0
    })
}