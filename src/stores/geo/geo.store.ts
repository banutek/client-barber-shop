import { create } from 'zustand'

export interface GeoState {
  lat: number | null
  lng: number | null
  supported: boolean
  error: string | null
}

type GeoStore = GeoState & {
  setPosition: (lat: number, lng: number) => void
  setError: (error: string) => void
  setSupported: (supported: boolean) => void
}

export const useGeoStore = create<GeoStore>()((set) => ({
  lat: null,
  lng: null,
  supported: 'geolocation' in navigator,
  error: null,

  setPosition: (lat: number, lng: number) => set({ lat, lng, error: null }),
  setError: (error: string) => set({ error }),
  setSupported: (supported: boolean) => set({ supported }),
}))
