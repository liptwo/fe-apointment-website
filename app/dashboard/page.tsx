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
                Khả Dụng
              </Link>
            </Button>
            <Button variant='ghost' size='sm' asChild>
              <Link
                href='/dashboard/appointments'
                className='text-muted-foreground hover:text-foreground'
              >
                <Calendar className='h-4 w-4 mr-2' />
                Lịch Hẹn
              </Link>
            </Button>
            <Button variant='ghost' size='sm' asChild>
              <Link
                href='/dashboard/profile'
                className='text-muted-foreground hover:text-foreground'
              >
                Sửa Hồ Sơ
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
          Đăng Xuất
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
      setError('Không thể tải quy tắc khả dụng.')
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
      setError('Không thể xóa quy tắc.')
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
            Bảng Điều Khiển
          </h1>
          <p className='mt-2 text-muted-foreground'>
            Quản lý khả dụng và lịch hẹn của bạn
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
                <PlusCircle className='mr-2 h-4 w-4' /> Thêm Quy Tắc Mới
              </Button>
            )}
            <TimeslotGenerateForm />
          </div>

          {/* Right Column: Rules List */}
          <div className='lg:col-span-1'>
            <Card>
              <CardHeader>
                <CardTitle>Quy Tắc Khả Dụng Của Bạn</CardTitle>
              </CardHeader>
              <CardContent>
                {loading && <p>Đang tải quy tắc...</p>}
                {error && <p className='text-destructive'>{error}</p>}
                {!loading && rules.length === 0 && (
                  <p>Không có quy tắc khả dụng nào được thiết lập.</p>
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
                          {rule.is_active ? 'Hoạt Động' : 'Không Hoạt Động'}
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
            <AlertDialogTitle>Bạn có chắc chắn không?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể được được hoàn tác. Điều này sẽ xóa vĩng
              vành quy tắc khả dụng.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Xóa</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
