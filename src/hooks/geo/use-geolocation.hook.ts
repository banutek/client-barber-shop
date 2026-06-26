import { useEffect, useState } from 'react'

export interface GeolocationState {
  /** Current latitude, or null if not available */
  lat: number | null
  /** Current longitude, or null if not available */
  lng: number | null
  /** Whether the geolocation API is supported */
  supported: boolean
  /** Error message if permission denied or unavailable */
  error: string | null
}

/**
 * Watches the device's geolocation and returns live coordinates.
 * Updates automatically as the device moves.
 */
export const useGeolocation = (): GeolocationState => {
  const [state, setState] = useState<GeolocationState>({
    lat: null,
    lng: null,
    supported: 'geolocation' in navigator,
    error: null,
  })

  useEffect(() => {
    if (!state.supported) {
      setState((prev) => ({ ...prev, error: 'Geolocation not supported' }))
      return
    }

    const onSuccess: PositionCallback = (position) => {
      setState({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        supported: true,
        error: null,
      })
    }

    const onError: PositionErrorCallback = (err) => {
      setState((prev) => ({
        ...prev,
        error: err.message,
      }))
    }

    // Start watching position
    const watchId = navigator.geolocation.watchPosition(onSuccess, onError, {
      enableHighAccuracy: true,
      maximumAge: 10_000, // accept cached position up to 10s old
      timeout: 15_000,
    })

    return () => {
      navigator.geolocation.clearWatch(watchId)
    }
  }, [state.supported])

  return state
}
