'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Heart, LogOut, CalendarDays, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/providers/auth-provider'

export function AppHeader() {
  const router = useRouter()
  const { logout } = useAuth()
  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
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
                Providers
              </Link>
            </Button>
            <Button variant='ghost' size='sm' asChild>
              <Link
                href='/appointments'
                className='text-muted-foreground hover:text-foreground'
              >
                <CalendarDays className='h-4 w-4 mr-2' />
                My Appointments
              </Link>
            </Button>
          </nav>
        </div>

        <Button
          variant='ghost'
          size='sm'
          onClick={handleLogout}
          className='text-muted-foreground hover:text-foreground'
        >
          <LogOut className='h-4 w-4 mr-2' />
          Sign out
        </Button>
      </div>
    </header>
  )
}
