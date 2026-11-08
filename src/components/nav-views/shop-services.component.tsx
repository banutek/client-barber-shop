import React, { useState } from 'react'
import {
  ChevronRight,
  Scissors,
  PaintBucket,
  Droplets,
  Sparkles,
  Wind,
  Brush,
  StretchHorizontal,
  Flower2,
  Eye,
  Hand,
  Sparkle,
  Glasses,
  Syringe,
  HeartPulse,
} from 'lucide-react'
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { IServicesProvidedDtoOut } from '@/dto'

const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))

export interface IShopServicesComponentProps {
  default_method?: () => void
  default_props?: boolean
  services: IServicesProvidedDtoOut[]
}

interface IServiceCategory {
  id: string
  label: string
  count: number
  Icon: React.ComponentType<{ className?: string }>
  children: IServicesProvidedDtoOut[]
}

const getServiceIcon = (label: string): IServiceCategory['Icon'] => {
  const normalizedLabel = label
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()

  const categoryIcons: Record<string, IServiceCategory['Icon']> = {
    coiffure: Scissors, // ciseaux, l'outil emblématique du coiffeur
    onglerie: Hand, // la main, là où se fait le travail
    'massage & spa': Flower2, // fleur de lotus, univers spa
    esthetique: Sparkle, // éclat, soin de la peau
    'cils & sourcils': Eye, // l'œil
    maquillage: Brush, // pinceau de maquillage
    'soins capillaires': Droplets, // soins, produits, hydratation
    'beaute du regard': Glasses, // regard (alternative : Eye déjà utilisé)
    'tatouage & piercing': Syringe, // aiguille (alternative : PenTool)
    'bien-etre': HeartPulse,
  }

  const categoryIcon = categoryIcons[normalizedLabel]
  if (categoryIcon) return categoryIcon

  if (normalizedLabel.includes('color')) return PaintBucket
  if (normalizedLabel.includes('shampoo')) return Droplets
  if (normalizedLabel.includes('rasage') || normalizedLabel.includes('barbe'))
    return StretchHorizontal
  if (normalizedLabel.includes('soin') || normalizedLabel.includes('peau')) return Sparkles
  if (normalizedLabel.includes('brushing') || normalizedLabel.includes('sechage')) return Wind
  if (normalizedLabel.includes('maquillage')) return Brush

  return Scissors
}

export const ShopServicesComponent: React.FC<IShopServicesComponentProps> = ({ services }) => {
  const [expandedServiceIds, setExpandedServiceIds] = useState<Set<string>>(new Set())
  const serviceIds = new Set(services.map((service) => service.id))
  const rootServices = services.filter(
    (service) => !service.parentId || !serviceIds.has(service.parentId),
  )
  const servicesFormated: IServiceCategory[] = services
    .map((service) => ({
      id: service.id,
      label: service.label,
      count: service.count,
      Icon: getServiceIcon(service.label),
      children: services.filter((child) => child.parentId === service.id),
    }))
    .filter((service) => rootServices.some((rootService) => rootService.id === service.id))

  const toggleService = (serviceId: string) => {
    setExpandedServiceIds((currentIds) => {
      const nextIds = new Set(currentIds)

      if (nextIds.has(serviceId)) nextIds.delete(serviceId)
      else nextIds.add(serviceId)

      return nextIds
    })
  }

  return (
    <div className="rounded-2xl bg-dark-card border border-white/6 overflow-hidden">
      {servicesFormated.map(({ id, label, count, Icon, children }, i) => (
        <div
          key={id}
          className={i < servicesFormated.length - 1 ? 'border-b border-white/5' : undefined}
          onClick={() => toggleService(id)}
        >
          <div className="flex items-center gap-3 w-full px-4 py-3.5 transition-colors hover:bg-white/3">
            <div className="w-9 h-9 rounded-xl bg-gold/10 flex items-center justify-center shrink-0">
              <Icon className="w-3.75 h-3.75 text-gold" />
            </div>

            <span className="flex-1 text-left text-sm text-text-primary font-medium">{label}</span>

            {children.length > 0 && (
              <span className="text-xs text-white/40">{children.length}</span>
            )}
            {children.length === 0 && count > 0 && (
              <span className="text-xs text-white/40">{count} types</span>
            )}

            {children.length > 0 && (
              <button
                type="button"
                aria-expanded={expandedServiceIds.has(id)}
                aria-label={`${expandedServiceIds.has(id) ? 'Masquer' : 'Afficher'} les services de ${label}`}
                className="p-1 text-white/25 hover:text-white/50 transition-colors"
              >
                <ChevronRight
                  className={cn(
                    'w-4 h-4 shrink-0 transition-transform',
                    expandedServiceIds.has(id) && 'rotate-90',
                  )}
                />
              </button>
            )}
          </div>

          {expandedServiceIds.has(id) &&
            children.map((child) => {
              return (
                <div
                  key={child.id}
                  className="flex items-center gap-3 w-full px-4 py-3 pl-10 border-t border-white/5"
                >
                  <div className="w-2 h-2 rounded-lg bg-gold/15 flex items-center justify-center shrink-0">
                    <div className="w-1 h-1 text-gold" />
                  </div>
                  <span className="flex-1 text-left text-xs text-gold">{child.label}</span>
                  {child.count > 0 && (
                    <span className="text-sm text-white/40">{child.count} types</span>
                  )}
                </div>
              )
            })}
        </div>
      ))}
    </div>
  )
}
