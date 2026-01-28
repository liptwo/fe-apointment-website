// components/notification-item.tsx
'use client'

import { Notification } from '@/types'
import { formatDistanceToNow } from 'date-fns'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface NotificationItemProps {
  notification: Notification
  onRead?: (id: string) => void
  onDelete?: (id: string) => void
}

export const NotificationItem = ({
  notification,
  onRead,
  onDelete
}: NotificationItemProps) => {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'CONFIRMED':
        return 'bg-green-50 border-green-200'
      case 'CANCELLED':
        return 'bg-red-50 border-red-200'
      case 'PENDING':
        return 'bg-yellow-50 border-yellow-200'
      case 'REMINDER':
        return 'bg-blue-50 border-blue-200'
      default:
        return 'bg-gray-50 border-gray-200'
    }
  }

  const handleRead = () => {
    if (!notification.isRead && onRead) {
      onRead(notification.id)
    }
  }

  return (
    <div
      onClick={handleRead}
      className={cn(
        'flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-colors',
        getTypeColor(notification.type),
        notification.isRead ? 'opacity-60' : 'font-medium'
      )}
    >
      <div className='flex-1'>
        <p className='text-sm text-gray-900'>{notification.message}</p>
        <p className='text-xs text-gray-500 mt-1'>
          {formatDistanceToNow(new Date(notification.createdAt), {
            addSuffix: true
          })}
        </p>
      </div>
      <Button
        variant='ghost'
        size='sm'
        className='h-auto p-1'
        onClick={(e) => {
          e.stopPropagation()
          onDelete?.(notification.id)
        }}
      >
        <X className='w-4 h-4 text-gray-500' />
      </Button>
    </div>
  )
}
