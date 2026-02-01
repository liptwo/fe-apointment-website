// hook/useNotifications.ts
'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { Notification } from '@/src/types'

interface UseNotificationsOptions {
  autoConnect?: boolean
  retryDelay?: number
  maxRetries?: number
}

export const useNotifications = (options: UseNotificationsOptions = {}) => {
  const { autoConnect = true, retryDelay = 3000, maxRetries = 5 } = options

  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [unreadCount, setUnreadCount] = useState(0)

  const eventSourceRef = useRef<EventSource | null>(null)
  const retryCountRef = useRef(0)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const connect = useCallback(() => {
    if (eventSourceRef.current) {
      return
    }

    try {
      const token = localStorage.getItem('accessToken')
      if (!token) {
        setError('No authentication token found')
        return
      }

      const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL
      const url = new URL('/notifications/sse', baseURL)
      url.searchParams.append('token', token)

      const eventSource = new EventSource(url.toString())

      eventSource.addEventListener('notification', (event: MessageEvent) => {
        try {
          const notification = JSON.parse(event.data) as Notification
          setNotifications((prev) => [notification, ...prev])
          if (!notification.isRead) {
            setUnreadCount((prev) => prev + 1)
          }
        } catch (e) {
          console.error('Failed to parse notification:', e)
        }
      })

      eventSource.addEventListener('error', () => {
        console.error('SSE connection error')
        eventSource.close()
        eventSourceRef.current = null
        setIsConnected(false)

        if (retryCountRef.current < maxRetries) {
          retryCountRef.current++
          reconnectTimeoutRef.current = setTimeout(() => {
            connect()
          }, retryDelay * retryCountRef.current)
        } else {
          setError(
            'Failed to establish real-time connection after multiple attempts'
          )
        }
      })

      eventSource.addEventListener('open', () => {
        setIsConnected(true)
        setError(null)
        retryCountRef.current = 0
      })

      eventSourceRef.current = eventSource
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Unknown error'
      setError(errorMessage)
      console.error('Failed to connect to notifications:', e)
    }
  }, [retryDelay, maxRetries])

  const disconnect = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close()
      eventSourceRef.current = null
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
    }
    setIsConnected(false)
  }, [])

  const addNotification = useCallback((notification: Notification) => {
    setNotifications((prev) => [notification, ...prev])
    if (!notification.isRead) {
      setUnreadCount((prev) => prev + 1)
    }
  }, [])

  const markAsRead = useCallback((notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
    )
    setUnreadCount((prev) => Math.max(0, prev - 1))
  }, [])

  const removeNotification = useCallback((notificationId: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId))
  }, [])

  const clearAll = useCallback(() => {
    setNotifications([])
    setUnreadCount(0)
  }, [])

  useEffect(() => {
    if (autoConnect) {
      connect()
    }

    return () => {
      disconnect()
    }
  }, [autoConnect, connect, disconnect])

  return {
    notifications,
    isConnected,
    error,
    unreadCount,
    connect,
    disconnect,
    addNotification,
    markAsRead,
    removeNotification,
    clearAll
  }
}
