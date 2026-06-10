import { useQuery } from "@tanstack/react-query"
import type { AxiosResponse } from "axios"
import { ShopService } from "../../services"
import type { IBarberShopDtoOut } from "../../dto"

export const useGetActiveShopsHook = (deviceConnected: string) => {
    return useQuery<AxiosResponse<{ shops: IBarberShopDtoOut[] }>, Error>({
        queryKey: ['get-active-shops'],
        queryFn: () => {
            return ShopService.get_all_active_shop()
        },
        enabled: !!deviceConnected,
        retry: 0
    })
}