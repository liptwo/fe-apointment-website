'use client'

import React, { useState, useEffect } from 'react'
import { format, isValid, parseISO } from 'date-fns'
import {
  CalendarDays,
  Clock,
  Loader2,
  AlertCircle,
  X,
  User
} from 'lucide-react'
import { AppHeader } from '@/src/components/app-header'
import { Button } from '@/src/components/ui/button'
import { Badge } from '@/src/components/ui/badge'
import { Skeleton } from '@/src/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/src/components/ui/table'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/src/components/ui/alert-dialog'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/src/components/ui/card'
import {
  getMyBookings,
  cancelAppointment
} from '@/src/services/appointment.service'
import { Appointment } from '@/src/types'
import { Label } from '@/src/components/ui/label'
import { Textarea } from '@/src/components/ui/textarea'
import Link from 'next/link'

const STATUS_STYLES: Record<
  Appointment['status'],
  {
    variant: 'default' | 'secondary' | 'destructive' | 'outline'
    label: string
  }
> = {
  PENDING: { variant: 'secondary', label: 'Đang chờ' },
  CONFIRMED: { variant: 'default', label: 'Đã xác nhận' },
  CANCELLED: { variant: 'destructive', label: 'Đã hủy' },
  COMPLETED: { variant: 'outline', label: 'Đã hoàn thành' }
}

export default function MyAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [cancellingId, setCancellingId] = useState<string | null>(null)
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null)
  const [cancelReason, setCancelReason] = useState('')

  useEffect(() => {
    fetchAppointments()
  }, [])

  const fetchAppointments = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getMyBookings()
      setAppointments(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi')
    } finally {
      setLoading(false)
    }
  }

  const handleCancelClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment)
    setCancelReason('')
    setShowCancelDialog(true)
  }

  const handleCancelConfirm = async () => {
    if (!selectedAppointment) return

    setCancellingId(selectedAppointment.id)
    setShowCancelDialog(false)

    try {
      await cancelAppointment(selectedAppointment.id, cancelReason)
      // Refresh the list to show the updated status
      fetchAppointments()
    } catch (err) {
      setError('Lỗi hủy lịch hẹn. Vui lòng thử lại.')
    } finally {
      setCancellingId(null)
      setSelectedAppointment(null)
    }
  }

  const formatDate = (dateString: string | undefined) => {
    try {
      if (!dateString) return '---'
      const date = parseISO(dateString)
      if (!isValid(date)) return '---'
      return format(date, 'MMM dd, yyyy')
    } catch (error) {
      return '---'
    }
  }

  const formatTime = (dateString: string | undefined) => {
    try {
      if (!dateString) return '--:--'
      const date = parseISO(dateString)
      if (!isValid(date)) return '--:--'
      return format(date, 'hh:mm a')
    } catch (error) {
      return '--:--'
    }
  }
  return (
    <div className='min-h-screen bg-background'>
      <AppHeader />

      <main className='container mx-auto px-4 py-8'>
        <div className='mb-8'>
          <h1 className='text-3xl font-semibold text-foreground'>
            Lịch Hẹn Của Tôi
          </h1>
          <p className='mt-2 text-muted-foreground'>
            Xem và quản lý các lịch hẹn sắp tới và quá khứ.
          </p>
        </div>

        {error && (
          <div className='mb-4 rounded-lg bg-destructive/10 p-4 text-sm text-destructive'>
            {error}
          </div>
        )}

        {loading ? (
          <Card>
            <CardHeader>
              <Skeleton className='h-6 w-40' />
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className='h-12 w-full' />
                ))}
              </div>
            </CardContent>
          </Card>
        ) : appointments.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle className='text-lg font-medium flex items-center gap-2'>
                <CalendarDays className='h-5 w-5 text-primary' />
                Tất Cả Lịch Hẹn
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nhà Cung Cấp</TableHead>
                    <TableHead>Ngày</TableHead>
                    <TableHead>Thời Gian</TableHead>
                    <TableHead>Trạng Thái</TableHead>
                    <TableHead className='text-right'>Hành Động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {appointments.map((appointment) => {
                    const statusConfig = STATUS_STYLES[appointment.status] || {
                      variant: 'outline' as const,
                      label: appointment.status || 'Unknown'
                    }
                    const canCancel =
                      appointment.status === 'PENDING' ||
                      appointment.status === 'CONFIRMED'
                    const isCancelling = cancellingId === appointment.id

                    return (
                      <TableRow key={appointment.id}>
                        <TableCell>
                          <div className='flex items-center gap-2'>
                            <User className='h-4 w-4 text-muted-foreground' />
                            <span className='font-medium'>
                              {appointment.host?.name || 'N/A'}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className='flex items-center gap-2'>
                            <CalendarDays className='h-4 w-4 text-muted-foreground' />
                            <span className='font-medium'>
                              {formatDate(appointment.timeSlot.startTime)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className='flex items-center gap-2'>
                            <Clock className='h-4 w-4 text-muted-foreground' />
                            <span>
                              {formatTime(appointment.timeSlot.startTime)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={statusConfig.variant}>
                            {statusConfig.label}
                          </Badge>
                        </TableCell>
                        <TableCell className='text-right'>
                          {canCancel && (
                            <Button
                              variant='ghost'
                              size='sm'
                              onClick={() => handleCancelClick(appointment)}
                              disabled={isCancelling}
                              className='text-destructive hover:text-destructive hover:bg-destructive/10'
                            >
                              {isCancelling ? (
                                <Loader2 className='h-4 w-4 animate-spin' />
                              ) : (
                                <>
                                  <X className='h-4 w-4 mr-1' />
                                  Hủy
                                </>
                              )}
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className='flex flex-col items-center justify-center py-16 text-center'>
              <div className='flex h-16 w-16 items-center justify-center rounded-full bg-muted'>
                <CalendarDays className='h-8 w-8 text-muted-foreground' />
              </div>
              <h3 className='mt-4 text-lg font-medium text-foreground'>
                Chưa có lịch hẹn nào
              </h3>
              <p className='mt-2 text-sm text-muted-foreground max-w-sm'>
                Bạn chưa đặt lịch hẹn nào. Tìm một nhà cung cấp chăm sóc sức
                khóe để lập lịch lần đầu tiên của bạn.
              </p>
              <Button asChild className='mt-6'>
                <Link href='/hosts'>Tìm Nhà Cung Cấp</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className='flex items-center gap-2'>
                <AlertCircle className='h-5 w-5 text-destructive' />
                Hủy Lịch Hẹn
              </AlertDialogTitle>
              <AlertDialogDescription>
                Bạn có chắc chắn muốn hủy lịch hẹn được lập lịch cho{' '}
                <span className='font-medium'>
                  {selectedAppointment &&
                    format(
                      new Date(selectedAppointment.timeSlot.startTime),
                      "MMMM dd, yyyy 'at' hh:mm a"
                    )}
                </span>
                ? Hành động này không thể được hoàn tác.
              </AlertDialogDescription>
              <div className='pt-2 space-y-2'>
                <Label htmlFor='cancelReason'>Lý do hủy</Label>
                <Textarea
                  id='cancelReason'
                  placeholder='Vui lòng cung cấp lý do ngắn gọn...'
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                />
              </div>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Giữ Lịch Hẹn</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleCancelConfirm}
                disabled={!cancelReason.trim()}
                className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
              >
                Đóng ý, Hủy
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </div>
  )
}
