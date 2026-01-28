'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Heart, ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { AppHeader } from '@/components/app-header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { useAuth } from '@/providers/auth-provider'
import { updateGuestProfile, updateHostProfile } from '@/services/user.service'

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
      setError('User information not available')
      return
    }

    if (!name.trim() || !email.trim()) {
      setError('Name and email are required')
      return
    }

    setLoading(true)

    try {
      let updatedUser

      if (user.role === 'HOST') {
        if (!specialty.trim() || !address.trim()) {
          setError('Specialty and address are required for hosts')
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
        <AppHeader />
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
      <AppHeader />

      <main className='container mx-auto px-4 py-8'>
        <Button
          variant='ghost'
          size='sm'
          asChild
          className='mb-6 -ml-2 text-muted-foreground hover:text-foreground'
        >
          <Link href='/dashboard'>
            <ArrowLeft className='mr-2 h-4 w-4' />
            Back to Dashboard
          </Link>
        </Button>

        <div className='mx-auto max-w-2xl'>
          <Card>
            <CardHeader>
              <CardTitle>Edit Profile</CardTitle>
              <CardDescription>
                Update your {user.role === 'HOST' ? 'professional' : 'personal'}{' '}
                information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className='space-y-6'>
                {/* Common Fields */}
                <div className='grid sm:grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='name'>Full Name *</Label>
                    <Input
                      id='name'
                      type='text'
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder='Your full name'
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
                      placeholder='your@email.com'
                      required
                    />
                  </div>
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='phone'>Phone Number</Label>
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
                      <Label htmlFor='specialty'>Specialty *</Label>
                      <Input
                        id='specialty'
                        type='text'
                        value={specialty}
                        onChange={(e) => setSpecialty(e.target.value)}
                        placeholder='e.g., General Practice, Cardiology'
                        required
                      />
                    </div>

                    <div className='space-y-2'>
                      <Label htmlFor='address'>Clinic Address *</Label>
                      <Input
                        id='address'
                        type='text'
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder='Your clinic address'
                        required
                      />
                    </div>

                    <div className='space-y-2'>
                      <Label htmlFor='description'>Professional Bio</Label>
                      <Textarea
                        id='description'
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder='Tell patients about your experience and qualifications...'
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
                    Profile updated successfully! Redirecting...
                  </div>
                )}

                {/* Actions */}
                <div className='flex gap-3 pt-4'>
                  <Button
                    type='button'
                    variant='outline'
                    className='flex-1 bg-transparent'
                    asChild
                  >
                    <Link href='/dashboard'>Cancel</Link>
                  </Button>
                  <Button type='submit' className='flex-1' disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
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
