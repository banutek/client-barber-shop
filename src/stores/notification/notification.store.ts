import { create } from 'zustand'
import type { INotificationDtoOut } from '@/dto'

type NotificationStore = {
  markAsRead: (id: string) => void
  notifications: INotificationDtoOut[]
  setNotifications: (notifications: INotificationDtoOut[]) => void
  unreadCount: number
}

export const useNotificationStore = create<NotificationStore>()((set) => ({
  markAsRead: (id: string) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, status: 'READ' as const } : n,
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    })),
  notifications: [],
  setNotifications: (notifications: INotificationDtoOut[]) =>
    set({
      notifications,
      unreadCount: notifications.filter((n) => n.status === 'PENDING').length,
    }),
  unreadCount: 0,
}))
