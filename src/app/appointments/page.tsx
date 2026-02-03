'use client'

import React, { useState, useEffect } from 'react'
import { format, isValid, parseISO } from 'date-fns'
import {
  CalendarDays,
  Clock,
  Loader2,
  AlertCircle,
  X,
  User,
  MapPin
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
import { Appointment, Doctor } from '@/src/types'
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
  // const [doctor, setDoctor] = useState<Doctor | null>(null)
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
      return format(date, 'dd/MM/yyyy')
    } catch (error) {
      return '---'
    }
  }

  const formatTime = (dateString: string | undefined) => {
    try {
      if (!dateString) return '--:--'
      const date = parseISO(dateString)
      if (!isValid(date)) return '--:--'
      return format(date, 'HH:mm')
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
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
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
                <Card key={appointment.id} className='flex flex-col'>
                  <CardHeader>
                    <div className='flex items-start justify-between'>
                      <div>
                        <CardTitle className='text-lg font-semibold text-primary'>
                          {appointment?.doctor?.title}.{' '}
                          {appointment?.doctor?.name || 'N/A'}
                        </CardTitle>
                        <p className='text-sm text-muted-foreground'>
                          {appointment.doctor?.specialty || 'Chuyên khoa'}
                        </p>{' '}
                      </div>
                      <Badge variant={statusConfig.variant}>
                        {statusConfig.label}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className='flex flex-col space-y-3'>
                    <div className='flex items-center text-wrap gap-2 text-sm'>
                      {/* <MapPin className='h-4 w-4  text-muted-foreground' /> */}

                      <span className=''>
                        <span className='text-gray-600'>
                          Địa chỉ phòng khám:{' '}
                        </span>
                        {appointment?.doctor?.address}
                      </span>
                    </div>
                    <div className='flex items-center gap-2 text-sm'>
                      <CalendarDays className='h-4 w-4 text-muted-foreground' />
                      <span>
                        {formatDate(appointment.timeslots.start_time)}
                      </span>
                    </div>
                    <div className='flex items-center gap-2 text-sm'>
                      <Clock className='h-4 w-4 text-muted-foreground' />
                      <span>
                        {formatTime(appointment.timeslots.start_time)} -{' '}
                        {formatTime(appointment.timeslots.end_time)}
                      </span>
                    </div>
                    <div className='flex items-center gap-2 text-sm'>
                      <User className='h-4 w-4 text-muted-foreground' />
                      <span>
                        Bệnh nhân: {appointment?.patient_name || 'N/A'}
                      </span>
                    </div>
                  </CardContent>
                  <div className='border-t px-6 py-4'>
                    {canCancel && (
                      <>
                        <div className='pb-2'>
                          Ghi chú: Đến hẹn trước 15 phút để lấy số và làm thủ
                          tục để được khám nhanh nhất bạn nhé
                        </div>
                        <Button
                          variant='ghost'
                          size='sm'
                          onClick={() => handleCancelClick(appointment)}
                          disabled={isCancelling}
                          className='w-full justify-center text-destructive hover:bg-destructive/10 hover:text-destructive'
                        >
                          {isCancelling ? (
                            <Loader2 className='h-4 w-4 animate-spin' />
                          ) : (
                            <>
                              <X className='h-4 w-4 mr-2' />
                              Hủy Lịch Hẹn
                            </>
                          )}
                        </Button>
                      </>
                    )}
                    {!canCancel && (
                      <p className='text-sm text-center text-muted-foreground'>
                        Lí do hủy: {appointment.cancel_reason}
                      </p>
                    )}
                  </div>
                </Card>
              )
            })}
          </div>
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
                Bạn có chắc chắn muốn hủy lịch hẹn của{' '}
                <span className='font-medium'>
                  {selectedAppointment?.guest?.name}
                </span>{' '}
                vào lúc{' '}
                <span className='font-medium'>
                  {selectedAppointment &&
                    format(
                      new Date(selectedAppointment.timeSlot.startTime),
                      "dd/MM/yyyy 'lúc' HH:mm"
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
