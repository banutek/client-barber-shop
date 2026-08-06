import React from 'react'
import {
  ChevronRight,
  Scissors,
  PaintBucket,
  Droplets,
  Sparkles,
  Wind,
  Brush,
  StretchHorizontal,
} from 'lucide-react'
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))

export interface IShopServicesComponentProps {
  default_method?: () => void
  default_props?: boolean
}

interface IServiceCategory {
  label: string
  count: number
  Icon: React.ComponentType<{ className?: string }>
}

const services: IServiceCategory[] = [
  { label: 'Coupe de cheveux', count: 44, Icon: Scissors },
  { label: 'Coloration', count: 12, Icon: PaintBucket },
  { label: 'Shampooing', count: 8, Icon: Droplets },
  { label: 'Rasage', count: 22, Icon: StretchHorizontal },
  { label: 'Soins de la peau', count: 12, Icon: Sparkles },
  { label: 'Brushing', count: 4, Icon: Wind },
  { label: 'Maquillage', count: 18, Icon: Brush },
]

export const ShopServicesComponent: React.FC<IShopServicesComponentProps> = () => {
  return (
    <div className="rounded-2xl bg-dark-card border border-white/6 overflow-hidden">
      {services.map(({ label, count, Icon }, i) => (
        <button
          key={label}
          type="button"
          className={cn(
            'flex items-center gap-3 w-full px-4 py-3.5 transition-colors hover:bg-white/3',
            i < services.length - 1 && 'border-b border-white/5',
          )}
        >
          {/* Icon container */}
          <div className="w-9 h-9 rounded-xl bg-gold/10 flex items-center justify-center shrink-0">
            <Icon className="w-3.75 h-3.75 text-gold" />
          </div>

          {/* Label */}
          <span className="flex-1 text-left text-sm text-text-primary font-medium">{label}</span>

          {/* Count badge */}
          <span className="text-xs text-white/40">{count} types</span>

          {/* Chevron */}
          <ChevronRight className="w-4 h-4 text-white/25 shrink-0" />
        </button>
      ))}
    </div>
  )
}
