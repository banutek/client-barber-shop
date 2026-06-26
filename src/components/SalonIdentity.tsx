import { useMemo } from 'react'
import { MapPin, Scissors } from 'lucide-react'
import { useGeoStore } from '@/stores/geo'
import { haversineDistance, formatDistance } from '@/utils/geo'

export interface SalonIdentityProps {
  /** Fallback distance string (e.g. "322 m"). Ignored when shopLat & shopLng are provided */
  distance?: string
  location: string
  name: string
  /** Shop latitude — when provided with shopLng, real distance is computed live */
  shopLat?: number | null
  /** Shop longitude */
  shopLng?: number | null
}

const truncateAtNthComma = (str: string, n: number): string => {
  let count = 0
  for (let i = 0; i < str?.length; i++) {
    if (str[i] === ',') {
      count++
      if (count === n) {
        return str.slice(0, i)
      }
    }
  }
  return str
}

export const SalonIdentity: React.FC<SalonIdentityProps> = ({
  distance: fallbackDistance,
  location,
  name,
  shopLat,
  shopLng,
}) => {
  const shortLocation = useMemo(() => truncateAtNthComma(location, 2), [location])
  const geoLat = useGeoStore((s) => s.lat)
  const geoLng = useGeoStore((s) => s.lng)

  const displayDistance = useMemo(() => {
    if (shopLat != null && shopLng != null && geoLat != null && geoLng != null) {
      const meters = haversineDistance(geoLat, geoLng, shopLat, shopLng)
      return formatDistance(meters)
    }
    return fallbackDistance ?? ''
  }, [shopLat, shopLng, geoLat, geoLng, fallbackDistance])

  return (
    <div className="flex items-center gap-3 mb-3">
      <div className="w-[52px] h-[52px] rounded-[14px] bg-[#25221a] border border-gold-muted flex items-center justify-center flex-shrink-0">
        <Scissors className="w-6 h-6 text-gold" />
      </div>
      <div>
        <h2 className="text-xl font-medium text-text-primary m-0 mb-0.5">{name}</h2>
        <p className="text-[11px] text-white/40 m-0 flex items-center gap-1">
          <MapPin className="w-[11px] h-[11px]" />
          {shortLocation} · {displayDistance}
        </p>
      </div>
    </div>
  )
}
