import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

export type NotificationType =
  | "info"
  | "success"
  | "warning"
  | "error"
  | "prayer"
  | "achievement"

export interface NotificationItem {
  id: string
  type: NotificationType
  title: string
  message: string
  timestamp: Date
  read: boolean
  actionUrl?: string
  actionLabel?: string
}

interface NotificationState {
  notifications: NotificationItem[]
  addNotification: (
    notification: Omit<NotificationItem, "id" | "timestamp" | "read">
  ) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  clearAll: () => void
  getUnreadCount: () => number
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: [],

      addNotification: (notification) => {
        const newItem: NotificationItem = {
          ...notification,
          id: Math.random().toString(36).substring(2, 9),
          timestamp: new Date(),
          read: false,
        }
        set((state) => ({
          // Keep only the last 50 notifications to prevent storage bloat
          notifications: [newItem, ...state.notifications].slice(0, 50),
        }))
      },

      markAsRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        }))
      },

      markAllAsRead: () => {
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        }))
      },

      clearAll: () => {
        set({ notifications: [] })
      },

      getUnreadCount: () => {
        return get().notifications.filter((n) => !n.read).length
      },
    }),
    {
      name: "moon_notifications",
      storage: createJSONStorage(() =>
        typeof window !== "undefined"
          ? localStorage
          : {
              getItem: () => null,
              setItem: () => {},
              removeItem: () => {},
            }
      ),
      partialize: (state) => ({
        notifications: state.notifications,
      }),
      merge: (persistedState: any, currentState) => {
        return {
          ...currentState,
          notifications: (persistedState?.notifications || []).map(
            (n: any) => ({
              ...n,
              timestamp: new Date(n.timestamp),
            })
          ),
        }
      },
    }
  )
)
