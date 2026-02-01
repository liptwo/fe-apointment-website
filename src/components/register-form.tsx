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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/src/components/ui/select'
import {
  Loader2,
  Mail,
  Lock,
  User,
  AlertCircle,
  CheckCircle2,
  Phone
} from 'lucide-react'
import { register } from '@/src/services/auth.service'

type UserRole = 'GUEST' | 'HOST'

export function RegisterForm() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [role, setRole] = useState<UserRole | ''>('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    if (!role) {
      setError('Vui lòng chọn loại tài khoản')
      return
    }

    setIsLoading(true)

    try {
      await register({ name, email, password, phone, role })
      setSuccess(true)

      // Redirect to login page after short delay
      setTimeout(() => {
        router.push('/login')
      }, 1500)
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
          Tạo tài khoản
        </CardTitle>
        <CardDescription className='text-center'>
          Tham gia MediCare để quản lý lịch hẹn của bạn
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

          {success && (
            <div className='flex items-center gap-2 rounded-md bg-green-500/15 p-3 text-sm text-green-500'>
              <CheckCircle2 className='h-4 w-4 shrink-0' />
              <span>
                Đăng ký thành công! Đang chuyển hướng đến trang đăng nhập...
              </span>
            </div>
          )}

          <div className='space-y-2'>
            <Label htmlFor='name'>Họ và tên</Label>
            <div className='relative'>
              <User className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
              <Input
                id='name'
                type='text'
                placeholder='Nguyễn Văn A'
                value={name}
                onChange={(e) => setName(e.target.value)}
                className='pl-10'
                required
                disabled={isLoading || success}
              />
            </div>
          </div>

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
                disabled={isLoading || success}
              />
            </div>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='phone'>Số điện thoại</Label>
            <div className='relative'>
              <Phone className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
              <Input
                id='phone'
                type='tel'
                placeholder='0912345678'
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className='pl-10'
                required
                disabled={isLoading || success}
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
                placeholder='Tạo mật khẩu'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='pl-10'
                required
                minLength={6}
                disabled={isLoading || success}
              />
            </div>
            <p className='text-xs text-muted-foreground'>
              Phải có ít nhất 6 ký tự
            </p>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='role'>Tôi là</Label>
            <Select
              value={role}
              onValueChange={(value: UserRole) => setRole(value)}
              disabled={isLoading || success}
            >
              <SelectTrigger id='role' className='w-full'>
                <SelectValue placeholder='Chọn loại tài khoản' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='GUEST'>
                  <div className='flex flex-col items-start'>
                    <span>Đặt lịch hẹn (Khách)</span>
                  </div>
                </SelectItem>
                <SelectItem value='HOST'>
                  <div className='flex flex-col items-start'>
                    <span>Cung cấp dịch vụ (Nhà cung cấp/Bác sĩ)</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            type='submit'
            className='w-full'
            size='lg'
            disabled={isLoading || success}
          >
            {isLoading ? (
              <>
                <Loader2 className='h-4 w-4 animate-spin' />
                Đang tạo tài khoản...
              </>
            ) : success ? (
              <>
                <CheckCircle2 className='h-4 w-4' />
                Tài khoản đã tạo
              </>
            ) : (
              'Tạo tài khoản'
            )}
          </Button>

          <p className='text-center text-xs text-muted-foreground'>
            Bằng cách tạo tài khoản, bạn đồng ý với{' '}
            <a
              href='#'
              className='underline underline-offset-4 hover:text-primary transition-colors'
            >
              Điều khoản dịch vụ
            </a>{' '}
            của chúng tôi{' '}
            <a
              href='#'
              className='underline underline-offset-4 hover:text-primary transition-colors'
            >
              Chính sách bảo mật
            </a>
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
