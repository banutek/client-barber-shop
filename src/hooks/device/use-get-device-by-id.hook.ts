import { useQuery } from '@tanstack/react-query'
import { DeviceService } from '../../services'
import type { IDeviceDtoOut } from '../../dto'
import type { AxiosResponse } from 'axios'

export const useGetDeviceByIDHook = (deviceId: string) => {
  return useQuery<AxiosResponse<{ device: IDeviceDtoOut }>, Error>({
    enabled: !!deviceId,
    queryFn: () => {
      return DeviceService.get_device_by_id(deviceId)
    },
    queryKey: ['get-device-by-id', deviceId],
    retry: 0,
  })
}
