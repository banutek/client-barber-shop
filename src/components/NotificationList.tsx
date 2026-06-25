import { Check } from 'lucide-react'
import { NotificationType } from '@/dto'
import type { INotificationDtoOut } from '@/dto'

export interface NotificationListProps {
  notifications: INotificationDtoOut[]
  onClose: () => void
  onMarkAsRead: (id: string) => void
}

const typeLabels: Record<NotificationType, string> = {
  [NotificationType.INFO]: 'Info',
  [NotificationType.REMINDER]: 'Rappel',
  [NotificationType.STATUS_CHANGE]: 'Statut',
}

const typeColors: Record<NotificationType, string> = {
  [NotificationType.INFO]: 'border-l-gray-400',
  [NotificationType.REMINDER]: 'border-l-blue-400',
  [NotificationType.STATUS_CHANGE]: 'border-l-amber-400',
}

export const NotificationList: React.FC<NotificationListProps> = ({
  notifications,
  onClose,
  onMarkAsRead,
}) => {
  if (notifications.length === 0) {
    return (
      <div className="absolute right-0 top-full mt-2 w-80 bg-dark-card border border-white/[0.08] rounded-xl shadow-2xl z-50 overflow-hidden">
        <div className="p-4 text-center text-white/40 text-sm">Aucune notification</div>
      </div>
    )
  }

  return (
    <div className="absolute right-0 top-full mt-2 w-80 max-h-[420px] bg-dark-card border border-white/[0.08] rounded-xl shadow-2xl z-50 overflow-hidden flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
        <span className="text-sm font-medium text-white/80">Notifications</span>
        <button
          className="text-xs text-white/40 hover:text-white/70 transition-colors"
          onClick={onClose}
          type="button"
        >
          Fermer
        </button>
      </div>
      <div className="overflow-y-auto flex-1">
        {notifications.map((n) => (
          <div
            className={`flex items-start gap-3 px-4 py-3 border-l-2 ${typeColors[n.type]} border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors ${n.status === 'PENDING' ? 'bg-white/[0.02]' : 'opacity-60'}`}
            key={n.id}
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[10px] font-medium text-white/30 uppercase tracking-wide">
                  {typeLabels[n.type]}
                </span>
              </div>
              <p className="text-[13px] text-white/80 leading-snug">{n.message}</p>
              <p className="text-[11px] text-white/25 mt-1">
                {new Date(n.createdAt).toLocaleTimeString('fr-FR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
            {n.status === 'PENDING' && (
              <button
                className="shrink-0 p-1.5 text-white/30 hover:text-white/70 hover:bg-white/[0.06] rounded-lg transition-colors"
                onClick={() => onMarkAsRead(n.id)}
                title="Marquer comme lu"
                type="button"
              >
                <Check className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
