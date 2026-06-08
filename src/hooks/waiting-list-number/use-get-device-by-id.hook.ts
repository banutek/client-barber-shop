import { useQuery } from "@tanstack/react-query"
import type { IDeviceDtoOut } from "../../dto"
import type { AxiosResponse } from "axios"
import { DeviceService } from "../../services"

export const useGetDeviceByIDHook = (deviceId: string) => {
    return useQuery<AxiosResponse<{ device: IDeviceDtoOut }>, Error>({
        queryKey: ['get-device-by-id', deviceId],
        queryFn: () => {
            return DeviceService.get_device_by_id(deviceId)
        },
        enabled: !!deviceId,
        retry: 0
    })
}