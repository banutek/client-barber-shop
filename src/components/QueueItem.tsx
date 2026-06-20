import { WaitingListNumberStatus } from '@/dto'

export interface QueueItemProps {
  isLast?: boolean
  status: WaitingListNumberStatus
  ticketNumber: string
}

export type QueueStatus = 'in-chair' | 'next' | 'waiting'

const statusConfig: Record<WaitingListNumberStatus, { className: string; label: string }> = {
  [WaitingListNumberStatus.COMPLETED]: {
    className: 'text-white/50 bg-gold/10',
    label: 'Terminé',
  },
  [WaitingListNumberStatus.CREATED]: {
    className: 'text-white/30',
    label: 'En attente',
  },
  [WaitingListNumberStatus.IN_PROGRESS]: {
    className: 'text-success bg-success-bg',
    label: 'En chaise',
  },
  [WaitingListNumberStatus.JUMPED]: {
    className: 'text-white/30',
    label: 'Passé',
  },
  [WaitingListNumberStatus.NEXT]: {
    className: 'text-gold bg-gold/10',
    label: 'Prochain',
  },
  [WaitingListNumberStatus.PENDING]: {
    className: 'text-white/30',
    label: 'Présent',
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

export const QueueItem: React.FC<QueueItemProps> = ({ isLast = false, status, ticketNumber }) => {
  const config = statusConfig[status]

  return (
    <div
      className={`flex items-center justify-between py-1.5 ${
        isLast ? '' : 'border-b border-white/5'
      }`}
    >
      <span
        style={{
          color:
            status === WaitingListNumberStatus.CREATED
              ? 'rgba(255,255,255,0.4)'
              : 'rgba(255,255,255,0.6)',
          fontSize: '12px',
        }}
      >
        {ticketNumber}
      </span>
      <span className={`text-[10px] px-2 py-0.5 rounded-full ${config.className}`}>
        {config.label}
      </span>
    </div>
  )
}
