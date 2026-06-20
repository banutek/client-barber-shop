import { type ClassValue, clsx } from 'clsx'
import { MapPin, Scissors } from 'lucide-react'
import { twMerge } from 'tailwind-merge'
import { ShopOpenStatus } from '@/dto'

export interface SalonCardProps {
  distance: string
  highlighted?: boolean
  location: string
  name: string
  onClick?: () => void
  status: string
  waitCount: number
  waitTime: string
}

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const statusConfig = {
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
  distance,
  highlighted = false,
  location,
  name,
  onClick,
  status,
  waitCount,
  waitTime,
}) => {
  const config = statusConfig[status]

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl p-3.5 cursor-pointer transition-all',
        highlighted
          ? 'bg-dark-card border border-gold-muted'
          : 'bg-dark-secondary border border-white/[0.06] hover:bg-dark-secondary/80',
      )}
      onClick={onClick}
    >
      {/* Top gradient line for highlighted card */}
      {highlighted && (
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      )}

      {/* Main content row */}
      <div className="flex items-start gap-2.5 mb-2.5">
        {/* Icon */}
        <div
          className={cn(
            'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border',
            highlighted ? 'bg-[#25221a] border-gold/20' : 'bg-dark-card border-white/[0.06]',
          )}
        >
          <Scissors
            className={cn('w-[18px] h-[18px]', highlighted ? 'text-gold' : 'text-white/35')}
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-text-primary mb-0.5">{name}</p>
          <p className="text-[11px] text-white/40 flex items-center gap-1">
            <MapPin className="w-[11px] h-[11px]" />
            {location}
          </p>
        </div>

        {/* Distance badge */}
        <span
          className={cn(
            'text-[10px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap',
            highlighted ? 'text-gold bg-gold-bg' : 'text-white/40 bg-white/[0.06]',
          )}
        >
          {distance}
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
