import { Bell } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { NotificationList } from './NotificationList'
import { NotificationToast } from './NotificationToast'
import { NotificationService } from '@/services'
import { useNotificationStore } from '@/stores'
import { NotificationStatus, type INotificationDtoOut } from '@/dto'

export const NotificationBell: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { markAsRead, notifications, unreadCount } = useNotificationStore()
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [toast, setToast] = useState<INotificationDtoOut | null>(null)

  // Ferme le dropdown au clic extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Détecte les nouvelles notifications pour le toast
  const prevCountRef = useRef(notifications.length)
  useEffect(() => {
    const prevCount = prevCountRef.current
    if (notifications.length > prevCount && notifications.length > 0) {
      const latest = notifications[0]
      if (latest.status === 'PENDING') {
        const timer = setTimeout(() => setToast(latest), 0)
        return () => clearTimeout(timer)
      }
    }
    prevCountRef.current = notifications.length
  }, [notifications])

  const handleMarkAsRead = async (id: string) => {
    try {
      await NotificationService.update_status(id, { status: NotificationStatus.READ })
      markAsRead(id)
    } catch {
      // Optimistic UI: on garde le markAsRead même en cas d'erreur
    }
  }

  const handleToggle = () => {
    setIsOpen((prev) => !prev)
  }

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        <button
          className="relative p-2 text-white/70 hover:text-white transition-colors"
          onClick={handleToggle}
          type="button"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[18px] h-[18px] text-[10px] font-bold text-white bg-red-500 rounded-full px-1">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>
        {isOpen && (
          <NotificationList
            notifications={notifications}
            onClose={() => setIsOpen(false)}
            onMarkAsRead={handleMarkAsRead}
          />
        )}
      </div>
      {toast && <NotificationToast notification={toast} onClose={() => setToast(null)} />}
    </>
  )
}
