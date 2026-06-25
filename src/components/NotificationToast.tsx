import { X } from 'lucide-react'
import { useEffect } from 'react'
import type { INotificationDtoOut } from '@/dto'

export interface NotificationToastProps {
  notification: INotificationDtoOut
  onClose: () => void
}

export const NotificationToast: React.FC<NotificationToastProps> = ({ notification, onClose }) => {
  // Auto-fermeture après 5 secondes
  useEffect(() => {
    const timer = setTimeout(onClose, 5000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className="fixed top-4 right-4 z-[100] animate-slide-in">
      <div className="flex items-start gap-3 bg-dark-card border border-white/[0.1] rounded-xl shadow-2xl p-4 max-w-sm backdrop-blur-xl">
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-medium text-amber-400 uppercase tracking-wide mb-1">
            Notification
          </p>
          <p className="text-[13px] text-white/85 leading-snug">{notification.message}</p>
        </div>
        <button
          className="shrink-0 p-1 text-white/30 hover:text-white/70 transition-colors"
          onClick={onClose}
          type="button"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
