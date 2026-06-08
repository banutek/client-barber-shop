import React, { useEffect } from 'react'
import type { IDeviceDtoOut, INewDeviceDtoIn } from '../dto'
import { useCreateNewDeviceHook, useGetDeviceByIDHook } from '../hooks'
import { useShopStore } from '@/stores'

export interface IAuthGuardProps {
  children: React.ReactNode
}

export const AuthGuard: React.FC<IAuthGuardProps> = ({ children }) => {
  const deviceInfoRef = React.useRef<IDeviceDtoOut | null>((() => {
    const stored = localStorage.getItem('device_infos')
    return stored ? JSON.parse(stored) : null
  })())
  const [currentDeviceId, setCurrentDeviceId] = React.useState<string | null>(() => {
    const stored = localStorage.getItem('device_infos')
    const parsed = stored ? JSON.parse(stored) : null
    return parsed?.id || null
  })
  const { setCurrentDevice } = useShopStore()
  const hasCreatedDevice = React.useRef(false)

  const { data, isLoading: isGettingDevice } = useGetDeviceByIDHook(currentDeviceId)
  const { mutate: doCreateNewDevice, isPending: isCreatingDevice } = useCreateNewDeviceHook()

  useEffect(() => {
    const deviceInfo = deviceInfoRef.current
    if (deviceInfo) {
      setCurrentDevice(deviceInfo)
    } else if (!hasCreatedDevice.current && !currentDeviceId) {
      hasCreatedDevice.current = true
      const requestBody: INewDeviceDtoIn = {
        platform: 'web'
      }
      doCreateNewDevice(requestBody, {
        onSuccess: (response) => {
          console.log('Device created successfully:', response)
          localStorage.setItem('device_infos', JSON.stringify(response.data.device))
          setCurrentDeviceId(response.data.device.id)
        },
        onError: (error) => {
          console.error('Error creating new device:', error)
          hasCreatedDevice.current = false
        }
      })
    }
  },[currentDeviceId, setCurrentDevice, doCreateNewDevice])
    
    useEffect(() => {
      if (data) {
        localStorage.setItem('device_infos', JSON.stringify(data?.data.device))
      }
    },[data])

  if(isGettingDevice || isCreatingDevice) {
    return (
      <div className="min-h-screen w-full bg-dark-bg flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-gold/20 border-t-gold rounded-full animate-spin" />
      </div>
    )
  }
  
  return children
}
