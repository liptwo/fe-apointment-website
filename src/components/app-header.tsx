'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Heart,
  LogOut,
  CalendarDays,
  Users,
  Bell,
  CalendarPlus
} from 'lucide-react'
import { Button } from '@/src/components/ui/button'
import { useAuth } from '@/src/providers/auth-provider'
import { NotificationBadge } from '@/src/components/notification-badge'
import { NotificationPanel } from '@/src/components/notification-panel'

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
      <header className='sticky top-0 z-50 w-full border-b border-border bg-card'>
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
                  Đặt khám theo bác sĩ
                </Link>
              </Button>
            </nav>
            <Button variant='ghost' size='sm' asChild>
              <Link
                href='/appointments'
                className='text-muted-foreground hover:text-foreground'
              >
                <CalendarDays className='h-4 w-4 mr-2' />
                Phiếu hẹn
              </Link>
            </Button>
            <Button variant='ghost' size='sm' asChild>
              <Link
                href='/user'
                className='text-muted-foreground hover:text-foreground'
              >
                <CalendarDays className='h-4 w-4 mr-2' />
                Hồ sơ khám bệnh
              </Link>
            </Button>
          </div>

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
      </header>

      <NotificationPanel
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
    </>
  )
}
