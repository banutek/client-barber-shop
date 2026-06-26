import { type ClassValue, clsx } from 'clsx'
import { useMemo } from 'react'
import { MapPin, Scissors } from 'lucide-react'
import { twMerge } from 'tailwind-merge'
import { ShopOpenStatus } from '@/dto'
import { useGeoStore } from '@/stores/geo'
import { haversineDistance, formatDistance } from '@/utils/geo'
import { truncateAtNthComma } from '@/utils/string'

export interface SalonCardProps {
  /** Fallback distance string (e.g. "320 m"). Ignored when shopLat & shopLng are provided */
  distance?: string
  highlighted?: boolean
  location: string
  name: string
  onClick?: () => void
  /** Shop latitude for live distance */
  shopLat?: number | null
  /** Shop longitude for live distance */
  shopLng?: number | null
  status: ShopOpenStatus
  waitCount: number
  waitTime: string
}

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const statusConfig: Record<
  ShopOpenStatus,
  { badgeColor: string; dotColor: string; label: string }
> = {
  [ShopOpenStatus.BREAK]: {
    badgeColor: 'text-amber-400 bg-amber-500/10',
    dotColor: 'bg-amber-500',
    label: 'Pause',
  },
  [ShopOpenStatus.BUSY]: {
    badgeColor: 'text-gold bg-gold-bg',
    dotColor: 'bg-gold',
    label: 'Chargé',
  },
  [ShopOpenStatus.CLOSED]: {
    badgeColor: 'text-red-400 bg-red-500/10',
    dotColor: 'bg-red-500',
    label: 'Fermé',
  },
  [ShopOpenStatus.OPEN]: {
    badgeColor: 'text-success bg-success-bg',
    dotColor: 'bg-success',
    label: 'Ouvert',
  },
}

export const SalonCard: React.FC<SalonCardProps> = ({
  distance: fallbackDistance,
  highlighted = false,
  location,
  name,
  onClick,
  shopLat,
  shopLng,
  status,
  waitCount,
  waitTime,
}) => {
  const config = statusConfig[status]
  const geoLat = useGeoStore((s) => s.lat)
  const geoLng = useGeoStore((s) => s.lng)

  const shortLocation = useMemo(() => truncateAtNthComma(location, 2), [location])

  const displayDistance = useMemo(() => {
    if (shopLat != null && shopLng != null && geoLat != null && geoLng != null) {
      const meters = haversineDistance(geoLat, geoLng, shopLat, shopLng)
      return formatDistance(meters)
    }
    return fallbackDistance ?? ''
  }, [shopLat, shopLng, geoLat, geoLng, fallbackDistance])

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl p-3.5 cursor-pointer transition-all',
        highlighted
          ? 'bg-dark-card border border-gold-muted'
          : 'bg-dark-secondary border border-white/6 hover:bg-dark-secondary/80',
      )}
      onClick={onClick}
    >
      {/* Top gradient line for highlighted card */}
      {highlighted && (
        <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-gold/30 to-transparent" />
      )}

      {/* Main content row */}
      <div className="flex items-start gap-2.5 mb-2.5">
        {/* Icon */}
        <div
          className={cn(
            'w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border',
            highlighted ? 'bg-[#25221a] border-gold/20' : 'bg-dark-card border-white/6',
          )}
        >
          <Scissors className={cn('w-4.5 h-4.5', highlighted ? 'text-gold' : 'text-white/35')} />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-text-primary mb-0.5">{name}</p>
          <p className="text-[11px] text-white/40 flex items-center gap-1">
            <MapPin className="w-2.75 h-2.75" />
            {shortLocation}
          </p>
        </div>

        {/* Distance badge */}
        <span
          className={cn(
            'text-[10px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap',
            highlighted ? 'text-gold bg-gold-bg' : 'text-white/40 bg-white/6',
          )}
        >
          {displayDistance}
        </span>
      </div>

      {/* Bottom row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[11px] text-white/45">
          <span className={cn('w-1.5 h-1.5 rounded-full', config.dotColor)} />
          {waitCount} en attente · {waitTime}
        </div>
        <span className={cn('text-[10px] font-medium px-2 py-0.5 rounded-full', config.badgeColor)}>
          {config.label}
        </span>
      </div>
    </div>
  )
}
