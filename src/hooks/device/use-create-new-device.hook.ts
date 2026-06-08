import { useMutation } from "@tanstack/react-query"
import type { IDeviceDtoOut, INewDeviceDtoIn } from "../../dto"
import type { AxiosResponse } from "axios"
import { DeviceService } from "../../services"

export const useCreateNewDeviceHook = () => {
    return useMutation<AxiosResponse<{ device: IDeviceDtoOut }>, Error, INewDeviceDtoIn>({
        mutationKey: ['create-new-device'],
        mutationFn: (body: INewDeviceDtoIn) => {
            return DeviceService.create_new_device(body)
        },
        retry: 0
    })
}