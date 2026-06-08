import React from 'react'
import { StatusBar, SectionLabel } from '../../components'
import {
  Check,
  Clock,
  QrCode,
  Scissors,
  Home,
  Camera,
  Bell,
  User,
} from 'lucide-react'

export interface IWaitingListDetailsPageProps {
  default_props?: boolean
  default_method?: () => void
}

interface StepItemProps {
  icon: React.ReactNode
  title: string
  subtitle: string
  status: 'completed' | 'current' | 'pending'
  isLast?: boolean
}

const StepItem: React.FC<StepItemProps> = ({
  icon,
  title,
  subtitle,
  status,
  isLast = false,
}) => {
  const iconBgClass =
    status === 'completed'
      ? 'bg-success-bg'
      : status === 'current'
        ? 'bg-gold-bg'
        : 'bg-dark-card'

  const iconColorClass =
    status === 'completed'
      ? 'text-success'
      : status === 'current'
        ? 'text-gold'
        : 'text-white/20'

  const titleColorClass =
    status === 'pending' ? 'text-white/35' : 'text-text-primary'

  const subtitleColorClass =
    status === 'completed'
      ? 'text-white/35'
      : status === 'current'
        ? 'text-white/35'
        : 'text-white/20'

  return (
    <div className={`flex gap-3 relative ${isLast ? '' : 'pb-3'}`}>
      {!isLast && (
        <div
          className="absolute left-[15px] top-[30px] bottom-0 w-px bg-white/[0.07]"
          aria-hidden="true"
        />
      )}
      <div
        className={`w-[30px] h-[30px] rounded-full ${iconBgClass} flex items-center justify-center flex-shrink-0 z-[1]`}
      >
        <span className={iconColorClass}>{icon}</span>
      </div>
      <div>
        <p className={`text-[13px] font-medium ${titleColorClass} mb-px`}>
          {title}
        </p>
        <p className={`text-[11px] ${subtitleColorClass}`}>{subtitle}</p>
      </div>
    </div>
  )
}

interface QueueAvatarProps {
  number: string
  status: 'active' | 'waiting' | 'current'
  size?: 'sm' | 'md'
}

const QueueAvatar: React.FC<QueueAvatarProps> = ({
  number,
  status,
  size = 'sm',
}) => {
  const dimensions = size === 'md' ? 'w-7 h-7' : 'w-[26px] h-[26px]'
  const fontSize = size === 'md' ? 'text-[9px] font-medium' : 'text-[9px]'

  if (status === 'active') {
    return (
      <div
        className={`${dimensions} rounded-full bg-success border-2 border-dark-bg flex items-center justify-center ${fontSize} text-dark-bg z-[6]`}
      >
        {number}
      </div>
    )
  }

  if (status === 'current') {
    return (
      <div
        className={`${dimensions} rounded-full bg-gold-bg border-2 border-gold flex items-center justify-center ${fontSize} text-gold z-[1]`}
      >
        {number}
      </div>
    )
  }

  return (
    <div
      className={`${dimensions} rounded-full bg-dark-card border-2 border-dark-bg flex items-center justify-center ${fontSize} text-white/40 -ml-1`}
    >
      {number}
    </div>
  )
}

interface NavItemProps {
  icon: React.ReactNode
  label: string
  isActive?: boolean
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, isActive = false }) => {
  return (
    <div className="flex-1 flex flex-col items-center gap-[3px] py-1.5 px-1">
      {isActive ? (
        <div className="bg-gold-bg rounded-[10px] w-10 h-7 flex items-center justify-center">
          <span className="text-gold">{icon}</span>
        </div>
      ) : (
        <span className="text-white/25">{icon}</span>
      )}
      <span
        className={`text-[9px] ${isActive ? 'text-gold font-medium' : 'text-white/25'}`}
      >
        {label}
      </span>
    </div>
  )
}

export const WaitingListDetailsPage: React.FC<
  IWaitingListDetailsPageProps
> = () => {
  // Ticket data (can be passed as props in a real implementation)
  const ticketNumber = '12'
  const drawTime = '10:45'
  const peopleAhead = 5
  const estimatedMinutes = 22
  const progressPercent = 58
  const salonName = 'Salon Baraka'

  // Queue data
  const queueNumbers = [
    { number: '07', status: 'active' as const },
    { number: '08', status: 'waiting' as const },
    { number: '09', status: 'waiting' as const },
    { number: '10', status: 'waiting' as const },
    { number: '11', status: 'waiting' as const },
    { number: '12', status: 'current' as const, size: 'md' as const },
  ]

  return (
    <div className="w-full min-h-screen bg-dark-bg flex flex-col items-center">
      {/* Mobile Container - mimics the phone frame from the design */}
      <div className="w-full max-w-[400px] lg:max-w-[480px] bg-dark-bg lg:rounded-[36px] lg:p-3 lg:border-[8px] lg:border-dark-secondary lg:shadow-[0_0_0_1px_rgba(255,255,255,0.06)]">
        {/* Status Bar */}
        <StatusBar />

        {/* Main Content */}
        <div className="px-4 pb-4">
          {/* Section Label */}
          <SectionLabel label={salonName} />

          {/* Hero - Ticket Number */}
          <div className="relative bg-[#141418] border border-gold/20 rounded-[20px] p-5 text-center mb-2.5 overflow-hidden">
            {/* Glow Effect */}
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140px] h-[140px] rounded-full pointer-events-none"
              style={{
                background:
                  'radial-gradient(circle, rgba(212,168,83,0.08) 0%, transparent 70%)',
              }}
            />
            <p className="text-[10px] text-white/30 uppercase tracking-widest mb-1">
              Votre numéro
            </p>
            <p className="text-[72px] font-medium text-gold leading-none">
              {ticketNumber}
            </p>
            <p className="text-[11px] text-white/35 mt-2">
              Tiré à {drawTime} · {peopleAhead} personnes avant vous
            </p>
          </div>

          {/* Progress Section */}
          <div className="bg-dark-secondary border border-dark-border rounded-2xl p-3.5 mb-2">
            <div className="flex justify-between items-center mb-2.5">
              <p className="text-xs font-medium text-text-primary">Progression</p>
              <span className="text-[11px] text-gold font-medium">
                ~{estimatedMinutes} min
              </span>
            </div>

            {/* Progress Bar */}
            <div className="h-[5px] bg-dark-card rounded-[3px] mb-3">
              <div
                className="h-full bg-gold rounded-[3px] transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Queue Avatars */}
            <div className="flex items-center gap-0 mb-1.5">
              {queueNumbers.map((item, index) => (
                <div
                  key={item.number}
                  style={{ zIndex: queueNumbers.length - index }}
                >
                  <QueueAvatar
                    number={item.number}
                    status={item.status}
                    size={item.size}
                  />
                </div>
              ))}
            </div>

            <p className="text-[11px] text-white/30">
              N°07 en chaise · vous êtes {peopleAhead + 1}ème
            </p>
          </div>

          {/* Steps Timeline */}
          <div className="bg-dark-secondary border border-dark-border rounded-2xl p-3.5">
            <StepItem
              icon={<Check className="w-3.5 h-3.5" />}
              title="Numéro tiré"
              subtitle={`N°${ticketNumber} enregistré · ${drawTime}`}
              status="completed"
            />
            <StepItem
              icon={<Clock className="w-3.5 h-3.5" />}
              title="En attente"
              subtitle="Vous serez notifié"
              status="current"
            />
            <StepItem
              icon={<QrCode className="w-3.5 h-3.5" />}
              title="Scanner le QR code"
              subtitle="Quand c'est votre tour"
              status="pending"
            />
            <StepItem
              icon={<Scissors className="w-3.5 h-3.5" />}
              title="Prise en charge"
              subtitle="Le coiffeur vous accueille"
              status="pending"
              isLast
            />
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="flex pt-2 pb-1 border-t border-white/[0.06] gap-0.5 mt-auto lg:rounded-b-[28px]">
          <NavItem
            icon={<Home className="w-5 h-5" />}
            label="Ma file"
            isActive
          />
          <NavItem icon={<Camera className="w-5 h-5" />} label="Scanner" />
          <NavItem icon={<Bell className="w-5 h-5" />} label="Alertes" />
          <NavItem icon={<User className="w-5 h-5" />} label="Profil" />
        </div>
      </div>
    </div>
  )
}
