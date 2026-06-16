import React from 'react'

interface StepItemComponentProps {
  icon: React.ReactNode
  title: string
  subtitle: string
  status: 'completed' | 'current' | 'pending'
  isLast?: boolean
}

export const StepItemComponent: React.FC<StepItemComponentProps> = ({
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