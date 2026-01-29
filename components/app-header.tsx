'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Heart, LogOut, CalendarDays, Users, Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/providers/auth-provider'
import { NotificationBadge } from '@/components/notification-badge'
import { NotificationPanel } from '@/components/notification-panel'

export function AppHeader() {
  const router = useRouter()
  const { logout } = useAuth()
  const [showNotifications, setShowNotifications] = useState(false)

  const handleLogout = () => {
    logout()
    router.replace('/login')
  }

  return (
    <>
      <header className='sticky top-0 z-40 w-full border-b border-border bg-card'>
        <div className='container mx-auto flex h-16 items-center justify-between px-4'>
          <div className='flex items-center gap-6'>
            <Link href='/hosts' className='flex items-center gap-3'>
              <div className='flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground'>
                <Heart className='h-4 w-4' />
              </div>
              <span className='text-lg font-semibold text-foreground'>
                MediCare
              </span>
            </Link>

            <nav className='hidden sm:flex items-center gap-1'>
              <Button variant='ghost' size='sm' asChild>
                <Link
                  href='/hosts'
                  className='text-muted-foreground hover:text-foreground'
                >
                  <Users className='h-4 w-4 mr-2' />
                  Nhà cung cấp
                </Link>
              </Button>
              <Button variant='ghost' size='sm' asChild>
                <Link
                  href='/appointments'
                  className='text-muted-foreground hover:text-foreground'
                >
                  <CalendarDays className='h-4 w-4 mr-2' />
                  Lịch hẹn của tôi
                </Link>
              </Button>
            </nav>
          </div>

          <div className='flex items-center gap-4'>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => setShowNotifications(true)}
              className='relative'
              title='Thông báo'
            >
              <NotificationBadge />
            </Button>

            <Button
              variant='ghost'
              size='sm'
              onClick={handleLogout}
              className='text-muted-foreground hover:text-foreground'
            >
              <LogOut className='h-4 w-4 mr-2' />
              Đăng xuất
            </Button>
          </div>
        </div>
      </header>

      <NotificationPanel
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
    </>
  )
}
