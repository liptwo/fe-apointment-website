'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Loader2, AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import { DashboardHeader } from '@/src/components/dashboard-header'
import { Button } from '@/src/components/ui/button'
import { Input } from '@/src/components/ui/input'
import { Label } from '@/src/components/ui/label'
import { Textarea } from '@/src/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/src/components/ui/select'
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
import { getAllSpecialty } from '@/src/services/specialty.service'
import { Specialty } from '@/src/types'

export default function ProfilePage() {
  const router = useRouter()
  const { user, isLoading: isAuthLoading, updateUserInfo } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [specialties, setSpecialties] = useState<Specialty[]>([])

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    // Host fields
    title: '',
    specialtyId: '',
    price: '',
    address: '',
    description: '',
    avatar: ''
  })

  // This logic now checks for the new required field `specialtyId`
  const isHostWithIncompleteProfile = user?.role === 'HOST' && !user.address

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push('/login')
      return
    }
    // if (isHostWithIncompleteProfile) {
    //   router.push('/dashboard')
    //   router.refresh()
    //   return
    // }
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        title: user.title || '',
        specialtyId: user.specialty_id || '',
        price: user.price?.toString() || '',
        address: user.address || '',
        description: user.description || '',
        avatar: user.avatar || ''
      })
    }

    if (user?.role === 'HOST') {
      const fetchSpecialties = async () => {
        try {
          const data = await getAllSpecialty()
          setSpecialties(data)
        } catch (err) {
          console.error('Failed to fetch specialties:', err)
          setError(
            'Không thể tải danh sách chuyên khoa. Vui lòng thử tải lại trang.'
          )
        }
      }
      fetchSpecialties()
    }
  }, [user, isAuthLoading, router])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSpecialtyChange = (value: string) => {
    setFormData((prev) => ({ ...prev, specialtyId: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    if (!user) {
      setError('Thông tin người dùng không khả dụng')
      return
    }

    if (!formData.name.trim() || !formData.email.trim()) {
      setError('Tên và email là bắt buộc')
      return
    }

    setIsSubmitting(true)

    try {
      let updatedUser

      if (user.role === 'HOST') {
        if (!formData.specialtyId || !formData.address.trim()) {
          setError(
            'Chuyên khoa và địa chỉ là bắt buộc đối với các nhà cung cấp'
          )
          setIsSubmitting(false)
          return
        }

        const priceAsNumber = formData.price
          ? parseFloat(formData.price)
          : undefined
        if (formData.price && (isNaN(priceAsNumber) || priceAsNumber < 0)) {
          setError('Giá khám phải là một số dương.')
          setIsSubmitting(false)
          return
        }

        updatedUser = await updateHostProfile(user.id, {
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim() || undefined,
          address: formData.address.trim(),
          specialtyId: formData.specialtyId,
          title: formData.title.trim() || undefined,
          description: formData.description.trim() || undefined,
          avatar: formData.avatar.trim() || undefined,
          price: priceAsNumber
        })
      } else {
        updatedUser = await updateGuestProfile(user.id, {
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim() || undefined
        })
      }

      if (updateUserInfo) {
        updateUserInfo(updatedUser)
      }

      setSuccess(true)
      // Redirect after 2 seconds unless it's an incomplete profile being completed
      // if (!isHostWithIncompleteProfile) {
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)
      // } else {
      // If profile was completed, force a reload to clear the "incomplete" state
      router.refresh()
      // }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isAuthLoading) {
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
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='email'>Email *</Label>
                    <Input
                      id='email'
                      type='email'
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='phone'>Số điện thoại</Label>
                  <Input
                    id='phone'
                    type='tel'
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Host-only fields */}
                {user.role === 'HOST' && (
                  <>
                    <div className='space-y-2'>
                      <Label htmlFor='avatar'>Ảnh đại diện (URL)</Label>
                      <Input
                        id='avatar'
                        value={formData.avatar}
                        onChange={handleInputChange}
                        placeholder='https://example.com/your-photo.jpg'
                      />
                    </div>

                    <div className='grid sm:grid-cols-2 gap-4'>
                      <div className='space-y-2'>
                        <Label htmlFor='title'>Chức danh</Label>
                        <Input
                          id='title'
                          value={formData.title}
                          onChange={handleInputChange}
                          placeholder='VD: Bác sĩ, Thạc sĩ, Trưởng khoa'
                        />
                      </div>
                      <div className='space-y-2'>
                        <Label htmlFor='specialtyId'>Chuyên khoa *</Label>
                        <Select
                          value={formData.specialtyId}
                          onValueChange={handleSpecialtyChange}
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder='Chọn chuyên khoa của bạn' />
                          </SelectTrigger>
                          <SelectContent>
                            {specialties.map((spec) => (
                              <SelectItem key={spec.id} value={spec.id}>
                                {spec.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='price'>Giá khám (VND)</Label>
                      <Input
                        id='price'
                        type='number'
                        value={formData.price}
                        onChange={handleInputChange}
                        placeholder='VD: 300000'
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='address'>Địa chỉ phòng khám *</Label>
                      <Input
                        id='address'
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='description'>Tiểu sử chuyên nghiệp</Label>
                      <Textarea
                        id='description'
                        value={formData.description}
                        onChange={handleInputChange}
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
                    Hồ sơ đã được cập nhật thành công!
                    {isHostWithIncompleteProfile
                      ? ' Trang sẽ được làm mới...'
                      : ' Đang chuyển hướng...'}
                  </div>
                )}

                {/* Actions */}
                <div className='flex gap-3 pt-4'>
                  {!isHostWithIncompleteProfile && (
                    <Button type='button' variant='outline' asChild>
                      <Link href='/dashboard'>Hủy</Link>
                    </Button>
                  )}
                  <Button
                    type='submit'
                    className='flex-1'
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
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
