// providers/notifications-provider.tsx
'use client'

import React, { createContext, useContext } from 'react'
import { useNotifications } from '@/hook/useNotifications'
import { Notification } from '@/types'

interface NotificationsContextType {
  notifications: Notification[]
  isConnected: boolean
  error: string | null
  unreadCount: number
  connect: () => void
  disconnect: () => void
  addNotification: (notification: Notification) => void
  markAsRead: (notificationId: string) => void
  removeNotification: (notificationId: string) => void
  clearAll: () => void
}

const NotificationsContext = createContext<
  NotificationsContextType | undefined
>(undefined)

interface NotificationsProviderProps {
  children: React.ReactNode
  autoConnect?: boolean
}

export const NotificationsProvider = ({
  children,
  autoConnect = true
}: NotificationsProviderProps) => {
  const notifications = useNotifications({ autoConnect })

  return (
    <NotificationsContext.Provider value={notifications}>
      {children}
    </NotificationsContext.Provider>
  )
}

export const useNotificationsContext = () => {
  const context = useContext(NotificationsContext)
  if (context === undefined) {
    throw new Error(
      'useNotificationsContext must be used within NotificationsProvider'
    )
  }
  return context
}
