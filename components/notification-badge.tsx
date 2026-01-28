// components/notification-badge.tsx
'use client'

import { useNotifications } from '@/hook/useNotifications'
import { Bell } from 'lucide-react'
import { cn } from '@/lib/utils'

export const NotificationBadge = () => {
  const { unreadCount, isConnected } = useNotifications()

  return (
    <div className='relative'>
      <Bell
        className={cn(
          'w-5 h-5 transition-colors',
          isConnected ? 'text-gray-700' : 'text-gray-400'
        )}
      />
      {unreadCount > 0 && (
        <span className='absolute top-0 right-0 -mt-2 -mr-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full'>
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </div>
  )
}
