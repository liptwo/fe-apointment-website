'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import {
  Heart,
  LogOut,
  Calendar,
  Clock,
  PlusCircle,
  Trash2,
  Pencil,
  AlertCircle,
  Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AvailabilityRuleForm } from '@/components/availability-rule-form'
import { TimeslotGenerateForm } from '@/components/timeslot-generate-form'
import { useAuth } from '@/providers/auth-provider'
import {
  getAvailabilityRules,
  deleteAvailabilityRule
} from '@/services/availability.service'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { useRouter } from 'next/navigation'

function DashboardHeader() {
  const { logout } = useAuth()
  const router = useRouter()
  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <header className='sticky top-0 z-50 w-full border-b border-border bg-card'>
      <div className='container mx-auto flex h-16 items-center justify-between px-4'>
        <div className='flex items-center gap-6'>
          <Link href='/dashboard' className='flex items-center gap-3'>
            <div className='flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground'>
              <Heart className='h-4 w-4' />
            </div>
            <span className='text-lg font-semibold text-foreground'>
              MediCare
            </span>
          </Link>
          <nav className='hidden sm:flex items-center gap-1'>
            <Button variant='ghost' size='sm' asChild>
              <Link href='/dashboard' className='text-foreground bg-secondary'>
                <Clock className='h-4 w-4 mr-2' />
                Availability
              </Link>
            </Button>
            <Button variant='ghost' size='sm' asChild>
              <Link
                href='/dashboard/appointments'
                className='text-muted-foreground hover:text-foreground'
              >
                <Calendar className='h-4 w-4 mr-2' />
                Appointments
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

export default function DashboardPage() {
  const { user } = useAuth()
  const [rules, setRules] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingRule, setEditingRule] = useState<any | null>(null)
  const [isFormVisible, setIsFormVisible] = useState(false)
  const [dialogState, setDialogState] = useState({
    isOpen: false,
    ruleId: null
  })

  const fetchRules = useCallback(async () => {
    if (!user) return
    setLoading(true)
    setError(null)
    try {
      const data = await getAvailabilityRules(user.id)
      setRules(data)
    } catch (err) {
      setError('Failed to fetch availability rules.')
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchRules()
  }, [fetchRules])

  const handleSuccess = () => {
    fetchRules()
    setEditingRule(null)
    setIsFormVisible(false)
  }

  const handleEdit = (rule: any) => {
    setEditingRule(rule)
    setIsFormVisible(true)
  }

  const handleAddNew = () => {
    setEditingRule(null)
    setIsFormVisible(true)
  }

  const handleDelete = async () => {
    if (!dialogState.ruleId) return
    try {
      await deleteAvailabilityRule(dialogState.ruleId)
      fetchRules()
    } catch (err) {
      setError('Failed to delete rule.')
    } finally {
      setDialogState({ isOpen: false, ruleId: null })
    }
  }

  const openDeleteDialog = (ruleId: any) => {
    setDialogState({ isOpen: true, ruleId })
  }

  return (
    <div className='min-h-screen bg-background'>
      <DashboardHeader />

      <main className='container mx-auto px-4 py-8'>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-foreground'>
            Provider Dashboard
          </h1>
          <p className='mt-2 text-muted-foreground'>
            Manage your availability and appointments
          </p>
        </div>

        <div className='grid gap-8 lg:grid-cols-3'>
          {/* Left Column: Forms */}
          <div className='lg:col-span-2 space-y-8'>
            {isFormVisible ? (
              <AvailabilityRuleForm
                onSuccess={handleSuccess}
                initialData={editingRule}
                onCancel={() => {
                  setIsFormVisible(false)
                  setEditingRule(null)
                }}
              />
            ) : (
              <Button onClick={handleAddNew} className='w-full'>
                <PlusCircle className='mr-2 h-4 w-4' /> Add New Rule
              </Button>
            )}
            <TimeslotGenerateForm />
          </div>

          {/* Right Column: Rules List */}
          <div className='lg:col-span-1'>
            <Card>
              <CardHeader>
                <CardTitle>Your Availability Rules</CardTitle>
              </CardHeader>
              <CardContent>
                {loading && <p>Loading rules...</p>}
                {error && <p className='text-destructive'>{error}</p>}
                {!loading && rules.length === 0 && (
                  <p>No availability rules set up yet.</p>
                )}
                <div className='space-y-4'>
                  {rules.map((rule) => (
                    <div
                      key={rule.id}
                      className='flex items-center justify-between rounded-lg border p-4'
                    >
                      <div>
                        <p className='font-semibold'>
                          {rule.days_of_week.split(',').join(', ')}
                        </p>
                        <p className='text-sm text-muted-foreground'>
                          {rule.start_hour}:00 - {rule.end_hour}:00
                        </p>
                      </div>
                      <div className='flex items-center gap-2'>
                        <Badge
                          variant={rule.is_active ? 'default' : 'secondary'}
                        >
                          {rule.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                        <Button
                          variant='ghost'
                          size='icon'
                          onClick={() => handleEdit(rule)}
                        >
                          <Pencil className='h-4 w-4' />
                        </Button>
                        <Button
                          variant='ghost'
                          size='icon'
                          onClick={() => openDeleteDialog(rule.id)}
                          className='text-destructive hover:text-destructive'
                        >
                          <Trash2 className='h-4 w-4' />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <AlertDialog
        open={dialogState.isOpen}
        onOpenChange={(open) =>
          !open && setDialogState({ isOpen: false, ruleId: null })
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              availability rule.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
