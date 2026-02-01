// components/notification-panel.tsx
'use client'

import { useNotifications } from '@/src/hook/useNotifications'
import {
  markNotificationAsRead,
  deleteNotification,
  markAllNotificationsAsRead
} from '@/src/services/notification.service'
import { NotificationItem } from './notification-item'
import { Button } from '@/src/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/src/components/ui/alert-dialog'
import { useState, useEffect } from 'react'
import { Loader } from 'lucide-react'

interface NotificationPanelProps {
  isOpen: boolean
  onClose: () => void
}

export const NotificationPanel = ({
  isOpen,
  onClose
}: NotificationPanelProps) => {
  const { notifications, unreadCount, markAsRead, removeNotification } =
    useNotifications()
  const [isLoading, setIsLoading] = useState(false)

  const handleMarkAsRead = async (id: string) => {
    try {
      await markNotificationAsRead(id)
      markAsRead(id)
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteNotification(id)
      removeNotification(id)
    } catch (error) {
      console.error('Failed to delete notification:', error)
    }
  }

  const handleMarkAllAsRead = async () => {
    if (unreadCount === 0) return

    setIsLoading(true)
    try {
      await markAllNotificationsAsRead()
      notifications.forEach((n) => {
        if (!n.isRead) {
          markAsRead(n.id)
        }
      })
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className='fixed inset-0 z-50 bg-black/50' onClick={onClose}>
      <div
        className='absolute right-0 top-0 h-full w-96 bg-white shadow-lg flex flex-col'
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className='border-b p-4 flex items-center justify-between'>
          <div>
            <h2 className='text-lg font-semibold'>Thông Báo</h2>
            {unreadCount > 0 && (
              <p className='text-sm text-gray-500'>{unreadCount} chưa đọc</p>
            )}
          </div>
          {unreadCount > 0 && (
            <Button
              variant='ghost'
              size='sm'
              onClick={handleMarkAllAsRead}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader className='w-4 h-4 animate-spin' />
              ) : (
                'Đánh dấu tất cả đã đọc'
              )}
            </Button>
          )}
        </div>

        {/* Notifications List */}
        <div className='flex-1 overflow-y-auto p-4 space-y-2'>
          {notifications.length === 0 ? (
            <div className='flex items-center justify-center h-full'>
              <p className='text-gray-500'>Không có thông báo</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onRead={handleMarkAsRead}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>

        {/* Close button */}
        <div className='border-t p-4'>
          <Button variant='outline' className='w-full' onClick={onClose}>
            Đóng
          </Button>
        </div>
      </div>
    </div>
  )
}
