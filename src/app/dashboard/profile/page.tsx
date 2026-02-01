'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Heart, ArrowLeft, Loader2, AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import { AppHeader } from '@/src/components/app-header'
import { Button } from '@/src/components/ui/button'
import { Input } from '@/src/components/ui/input'
import { Label } from '@/src/components/ui/label'
import { Textarea } from '@/src/components/ui/textarea'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/src/components/ui/card'
import { useAuth } from '@/src/providers/auth-provider'
import {
  updateGuestProfile,
  updateHostProfile
} from '@/src/services/user.service'
import { DashboardHeader } from '@/src/components/dashboard-header'

export default function ProfilePage() {
  const router = useRouter()
  const { user, isLoading, updateUserInfo } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Guest fields
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')

  // Host-only fields
  const [specialty, setSpecialty] = useState('')
  const [description, setDescription] = useState('')
  const [address, setAddress] = useState('')

  // Check if host has incomplete profile
  const isHostWithIncompleteProfile =
    user?.role === 'HOST' && (!user?.specialty || !user?.address)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
      return
    }

    if (user) {
      setName(user.name || '')
      setEmail(user.email || '')
      setPhone(user.phone || '')
      setSpecialty(user.specialty || '')
      setDescription(user.description || '')
      setAddress(user.address || '')
    }
  }, [user, isLoading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    if (!user) {
      setError('Thông tin người dùng không khả dụng')
      return
    }

    if (!name.trim() || !email.trim()) {
      setError('Tên và email là bắt buộc')
      return
    }

    setLoading(true)

    try {
      let updatedUser

      if (user.role === 'HOST') {
        if (!specialty.trim() || !address.trim()) {
          setError(
            'Chuyên khoa và địa chỉ là bắt buộc đối với các nhà cung cấp'
          )
          setLoading(false)
          return
        }

        updatedUser = await updateHostProfile(user.id, {
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim() || undefined,
          specialty: specialty.trim(),
          description: description.trim() || undefined,
          address: address.trim()
        })
      } else {
        updatedUser = await updateGuestProfile(user.id, {
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim() || undefined
        })
      }

      // Update auth context with new user info
      if (updateUserInfo) {
        updateUserInfo(updatedUser)
      }

      setSuccess(true)
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className='min-h-screen bg-background'>
        <DashboardHeader />
        <main className='container mx-auto px-4 py-8'>
          <div className='mx-auto max-w-2xl'>
            <div className='h-96 w-full animate-pulse rounded-lg bg-muted' />
          </div>
        </main>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className='min-h-screen bg-background'>
      <DashboardHeader />
      <main className='container mx-auto px-4 py-8'>
        {isHostWithIncompleteProfile && (
          <div className='mb-6 rounded-lg bg-amber-50 border border-amber-200 p-4 flex items-start gap-3'>
            <AlertTriangle className='h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5' />
            <div>
              <h3 className='font-semibold text-amber-900'>
                Hoàn thành Hồ sơ của bạn
              </h3>
              <p className='text-sm text-amber-800 mt-1'>
                Vui lòng hoàn thành thông tin chuyên nghiệp của bạn (chuyên khoa
                và địa chỉ phòng khám) để bắt đầu nhận cuộc hẹn.
              </p>
            </div>
          </div>
        )}

        {!isHostWithIncompleteProfile && (
          <Button
            variant='ghost'
            size='sm'
            asChild
            className='mb-6 -ml-2 text-muted-foreground hover:text-foreground'
          >
            <Link href='/dashboard'>
              <ArrowLeft className='mr-2 h-4 w-4' />
              Quay lại Dashboard
            </Link>
          </Button>
        )}

        <div className='mx-auto max-w-2xl'>
          <Card>
            <CardHeader>
              <CardTitle>Chỉnh sửa Hồ sơ</CardTitle>
              <CardDescription>
                Cập nhật thông tin{' '}
                {user.role === 'HOST' ? 'chuyên nghiệp' : 'cá nhân'} của bạn
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className='space-y-6'>
                {/* Common Fields */}
                <div className='grid sm:grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='name'>Họ và tên *</Label>
                    <Input
                      id='name'
                      type='text'
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder='Họ và tên của bạn'
                      required
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='email'>Email *</Label>
                    <Input
                      id='email'
                      type='email'
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder='email@example.com'
                      required
                    />
                  </div>
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='phone'>Số điện thoại</Label>
                  <Input
                    id='phone'
                    type='tel'
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder='0912345678'
                  />
                </div>

                {/* Host-only fields */}
                {user.role === 'HOST' && (
                  <>
                    <div className='space-y-2'>
                      <Label htmlFor='specialty'>Chuyên khoa *</Label>
                      <Input
                        id='specialty'
                        type='text'
                        value={specialty}
                        onChange={(e) => setSpecialty(e.target.value)}
                        placeholder='VD: Chuyên khoa Nội, Tim mạch'
                        required
                      />
                    </div>

                    <div className='space-y-2'>
                      <Label htmlFor='address'>Địa chỉ phòng khám *</Label>
                      <Input
                        id='address'
                        type='text'
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder='Địa chỉ phòng khám của bạn'
                        required
                      />
                    </div>

                    <div className='space-y-2'>
                      <Label htmlFor='description'>Tiểu sử chuyên nghiệp</Label>
                      <Textarea
                        id='description'
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder='Kể cho bệnh nhân về kinh nghiệm và bằng cấp của bạn...'
                        className='min-h-24 resize-none'
                      />
                    </div>
                  </>
                )}

                {/* Messages */}
                {error && (
                  <div className='rounded-lg bg-destructive/10 p-4 text-sm text-destructive'>
                    {error}
                  </div>
                )}

                {success && (
                  <div className='rounded-lg bg-green-500/10 p-4 text-sm text-green-600'>
                    Hồ sơ đã được cập nhật thành công! Đang chuyển hướng...
                  </div>
                )}

                {/* Actions */}
                <div className='flex gap-3 pt-4'>
                  {!isHostWithIncompleteProfile && (
                    <Button
                      type='button'
                      variant='outline'
                      className='flex-1 bg-transparent'
                      asChild
                    >
                      <Link href='/dashboard'>Hủy</Link>
                    </Button>
                  )}
                  <Button
                    type='submit'
                    className={
                      isHostWithIncompleteProfile ? 'w-full' : 'flex-1'
                    }
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                        Đang lưu...
                      </>
                    ) : (
                      'Lưu thay đổi'
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
