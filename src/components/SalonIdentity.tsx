import { Scissors, MapPin } from 'lucide-react'

export interface SalonIdentityProps {
  name: string
  location: string
  distance: string
}

export const SalonIdentity: React.FC<SalonIdentityProps> = ({
  name,
  location,
  distance,
}) => {
  return (
    <div className="flex items-center gap-3 mb-3">
      <div className="w-[52px] h-[52px] rounded-[14px] bg-[#25221a] border border-gold-muted flex items-center justify-center flex-shrink-0">
        <Scissors className="w-6 h-6 text-gold" />
      </div>
      <div>
        <h2 className="text-xl font-medium text-text-primary m-0 mb-0.5">{name}</h2>
        <p className="text-[11px] text-white/40 m-0 flex items-center gap-1">
          <MapPin className="w-[11px] h-[11px]" />
          {location} · {distance}
        </p>
      </div>
    </div>
  )
}
