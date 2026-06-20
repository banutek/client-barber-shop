import { useMutation } from '@tanstack/react-query'
import { DeviceService } from '../../services'
import { useDeviceStore } from '@/stores'
import type { IDeviceDtoOut, INewDeviceDtoIn } from '../../dto'
import type { AxiosResponse } from 'axios'

export const useCreateNewDeviceHook = () => {
  const { setCurrentDevice } = useDeviceStore()

  return useMutation<AxiosResponse<{ device: IDeviceDtoOut }>, Error, INewDeviceDtoIn>({
    mutationFn: async (body: INewDeviceDtoIn) => {
      const response = await DeviceService.create_new_device(body)
      console.log('Device created successfully:', response)
      return response
    },
    mutationKey: ['create-new-device'],
    onError: (error) => {
      console.error('GLOBAL ERROR CREATING DEVICE', error)
    },
    onSuccess: (data) => {
      console.log('GLOBAL SUCCESS', data)
      setCurrentDevice(data.data.device)
      localStorage.setItem('device_infos', JSON.stringify(data.data.device))
    },
    retry: 0,
  })
}
