'use client'

import React from 'react'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/src/components/ui/button'
import { Input } from '@/src/components/ui/input'
import { Label } from '@/src/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/src/components/ui/card'
import { Loader2, Mail, Lock, AlertCircle } from 'lucide-react'
import { useAuth } from '@/src/providers/auth-provider'
// import { User } from '@/types'

export function LoginForm() {
  const router = useRouter()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const user = await login({ email, password })

      // Check if HOST has complete profile information
      // if (user.role === 'HOST') {
      //   const hasCompleteProfile = user.address

      //   if (!hasCompleteProfile) {
      //     // Redirect to profile completion page
      //     router.push('/dashboard/profile')
      //     return
      //   }
      // }

      // Role-based redirect
      switch (user.role) {
        case 'GUEST':
          router.push('/hosts') // Guest -> Host list page
          break
        case 'HOST':
          router.push('/dashboard') // Host -> Doctor dashboard
          break
        case 'ADMIN':
          router.push('/admin/users') // Admin -> User management
          break
        default:
          router.push('/')
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        'An unexpected error occurred'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className='w-full max-w-md border-0 shadow-lg'>
      <CardHeader className='space-y-1 pb-4'>
        <CardTitle className='text-2xl font-semibold tracking-tight text-center'>
          Chào mừng quay lại
        </CardTitle>
        <CardDescription className='text-center'>
          Đăng nhập để quản lý các lịch hẹn của bạn
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className='space-y-4'>
          {error && (
            <div className='flex items-center gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive'>
              <AlertCircle className='h-4 w-4 shrink-0' />
              <span>{error}</span>
            </div>
          )}

          <div className='space-y-2'>
            <Label htmlFor='email'>Email</Label>
            <div className='relative'>
              <Mail className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
              <Input
                id='email'
                type='email'
                placeholder='name@example.com'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='pl-10'
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='password'>Mật khẩu</Label>
            <div className='relative'>
              <Lock className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
              <Input
                id='password'
                type='password'
                placeholder='Nhập mật khẩu'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='pl-10'
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <Button
            type='submit'
            className='w-full'
            size='lg'
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className='h-4 w-4 animate-spin' />
                Đang đăng nhập...
              </>
            ) : (
              'Đăng nhập'
            )}
          </Button>

          <div className='text-center text-sm text-muted-foreground'>
            <a
              href='#'
              className='underline underline-offset-4 hover:text-primary transition-colors'
            >
              Quên mật khẩu?
            </a>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
