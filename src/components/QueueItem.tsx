import { WaitingListNumberStatus } from "@/dto"

export type QueueStatus = 'in-chair' | 'next' | 'waiting'

export interface QueueItemProps {
  ticketNumber: string
  status: WaitingListNumberStatus
  isLast?: boolean
}

const statusConfig: Record<WaitingListNumberStatus, { label: string; className: string }> = {
  [WaitingListNumberStatus.IN_PROGRESS]: {
    label: 'En chaise',
    className: 'text-success bg-success-bg',
  },
  [WaitingListNumberStatus.NEXT]: {
    label: 'Prochain',
    className: 'text-gold bg-gold/10',
  },
  [WaitingListNumberStatus.CREATED]: {
    label: 'En attente',
    className: 'text-white/30',
  },
  [WaitingListNumberStatus.PENDING]: {
    label: 'Présent',
    className: 'text-white/30',
  },
  [WaitingListNumberStatus.COMPLETED]: {
    label: 'Terminé',
    className: 'text-white/30',
  },
}

// const statusConfigOld: Record<string, { label: string; className: string }> = {
//   'in-chair': {
//     label: 'En chaise',
//     className: 'text-success bg-success-bg',
//   },
//   'next': {
//     label: 'Prochain',
//     className: 'text-gold bg-gold/10',
//   },
//   'waiting': {
//     label: 'En attente',
//     className: 'text-white/30',
//   },
// }

export const QueueItem: React.FC<QueueItemProps> = ({
  ticketNumber,
  status,
  isLast = false,
}) => {
  const config = statusConfig[status]

  return (
    <div
      className={`flex items-center justify-between py-1.5 ${
        !isLast ? 'border-b border-white/[0.05]' : ''
      }`}
    >
      <span className={`text-xs ${status === WaitingListNumberStatus.CREATED ? 'text-white/40' : 'text-white/60'}`}>
        {ticketNumber}
      </span>
      <span className={`text-[10px] px-2 py-0.5 rounded-full ${config.className}`}>
        {config.label}
      </span>
    </div>
  )
}
