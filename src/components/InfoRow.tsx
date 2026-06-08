import type { LucideIcon } from 'lucide-react'

export interface InfoRowProps {
  icon: LucideIcon
  label: string
  value: string
  isLast?: boolean
}

export const InfoRow: React.FC<InfoRowProps> = ({
  icon: Icon,
  label,
  value,
  isLast = false,
}) => {
  return (
    <div
      className={`flex items-center gap-2.5 py-1.5 ${
        !isLast ? 'border-b border-white/[0.05]' : ''
      }`}
    >
      <div className="w-[30px] h-[30px] rounded-lg bg-gold/10 flex items-center justify-center flex-shrink-0">
        <Icon className="w-[14px] h-[14px] text-gold" />
      </div>
      <div>
        <p className="text-[10px] text-white/30 m-0">{label}</p>
        <p className="text-xs text-text-primary m-0 font-medium">{value}</p>
      </div>
    </div>
  )
}
