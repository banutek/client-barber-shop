import { useEffect, type ReactNode } from 'react'
import { useGeoStore } from '@/stores/geo'

export interface GeolocationProviderProps {
  children: ReactNode
}

/**
 * Starts watching device geolocation as soon as the app mounts.
 * Populates the geo store so all components can access live coordinates.
 */
export const GeolocationProvider: React.FC<GeolocationProviderProps> = ({ children }) => {
  const supported = useGeoStore((s) => s.supported)
  const setPosition = useGeoStore((s) => s.setPosition)
  const setError = useGeoStore((s) => s.setError)

  useEffect(() => {
    if (!supported) {
      setError('Geolocation not supported')
      return
    }

    const onSuccess: PositionCallback = (position) => {
      setPosition(position.coords.latitude, position.coords.longitude)
    }

    const onError: PositionErrorCallback = (err) => {
      setError(err.message)
    }

    const watchId = navigator.geolocation.watchPosition(onSuccess, onError, {
      enableHighAccuracy: true,
      maximumAge: 10_000,
      timeout: 15_000,
    })

    return () => {
      navigator.geolocation.clearWatch(watchId)
    }
  }, [supported, setPosition, setError])

  return <>{children}</>
}
