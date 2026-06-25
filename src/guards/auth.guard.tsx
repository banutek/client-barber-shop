import React, { useEffect } from 'react'
import { useCreateNewDeviceHook, useGetDeviceByIDHook } from '../hooks'
import { useDeviceStore } from '@/stores'
import type { IDeviceDtoOut, INewDeviceDtoIn } from '../dto'

export interface IAuthGuardProps {
  children: React.ReactNode
}

export const AuthGuard: React.FC<IAuthGuardProps> = ({ children }) => {
  const deviceInfoReference = React.useRef<IDeviceDtoOut | null>(
    (() => {
      try {
        const stored = localStorage.getItem('device_infos')
        return stored ? (JSON.parse(stored) as IDeviceDtoOut) : null
      } catch {
        localStorage.removeItem('device_infos')
        return null
      }
    })(),
  )
  const { currentDevice, setCurrentDevice } = useDeviceStore()
  const hasCreatedDevice = React.useRef(false)

  const { mutate: doCreateNewDevice } = useCreateNewDeviceHook()
  const { data, isLoading: isGettingDevice } = useGetDeviceByIDHook(currentDevice?.id as string)

  useEffect(() => {
    const deviceInfo = deviceInfoReference.current
    if (deviceInfo) {
      setCurrentDevice(deviceInfo)
    } else if (!hasCreatedDevice.current) {
      hasCreatedDevice.current = true
      const requestBody: INewDeviceDtoIn = {
        platform: 'web',
      }
      console.log({ requestBody })
      doCreateNewDevice(requestBody)
    }
  }, [setCurrentDevice, doCreateNewDevice])

  useEffect(() => {
    if (!data) {
      return
    }

    localStorage.setItem('device_infos', JSON.stringify(data?.data.device))
    setCurrentDevice(data?.data.device)
  }, [data, setCurrentDevice])

  console.log({ currentDevice })
  console.log({ isGettingDevice })

  if (isGettingDevice || !currentDevice) {
    return (
      <div className="min-h-screen w-full bg-dark-bg flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-gold/20 border-t-gold rounded-full animate-spin" />
      </div>
    )
  }

  return children
}
