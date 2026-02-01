'use client'
import {
  getMyBookings,
  confirmAppointment,
  cancelAppointment
} from '@/src/services/appointment.service'
import 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { format, parseISO, isValid } from 'date-fns'
import {
  Heart,
  LogOut,
  Calendar,
  Clock,
  Loader2,
  Check,
  X,
  User
} from 'lucide-react'
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
import React, { useState, useEffect } from 'react'
import { Textarea } from '@/src/components/ui/textarea'
import { Label } from '@/src/components/ui/label'
import { Appointment } from '@/src/types'
import { useAuth } from '@/src/providers/auth-provider'
import { DashboardHeader } from '@/src/components/dashboard-header'

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

export default function HostAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [dialogState, setDialogState] = useState<{
    open: boolean
    type: 'confirm' | 'cancel'
    appointment: Appointment | null
    cancelReason: string
  }>({
    open: false,
    type: 'confirm',
    appointment: null,
    cancelReason: ''
  })

  useEffect(() => {
    fetchAppointments()
  }, [])

  const fetchAppointments = async () => {
    setLoading(true)
    setError(null)
    try {
      // This is the host's dashboard, so we get all their appointments
      const data = await getMyBookings()
      setAppointments(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setAppointments([]) // Clear data on error
    } finally {
      setLoading(false)
    }
  }

  const openDialog = (type: 'confirm' | 'cancel', appointment: Appointment) => {
    setDialogState({ open: true, type, appointment, cancelReason: '' })
  }

  const closeDialog = () => {
    setDialogState({
      open: false,
      type: 'confirm',
      appointment: null,
      cancelReason: ''
    })
  }

  const handleConfirm = async () => {
    if (!dialogState.appointment) return

    const appointmentId = dialogState.appointment.id
    setActionLoading(appointmentId)
    closeDialog()

    try {
      await confirmAppointment(appointmentId)
      setAppointments((prev) =>
        prev.map((apt) =>
          apt.id === appointmentId
            ? { ...apt, status: 'CONFIRMED' as const }
            : apt
        )
      )
    } catch (err) {
      // Handle error notification if needed
    } finally {
      setActionLoading(null)
    }
  }

  const handleCancel = async () => {
    if (!dialogState.appointment) return

    const appointmentId = dialogState.appointment.id
    setActionLoading(appointmentId)

    try {
      await cancelAppointment(appointmentId, dialogState.cancelReason)
      setAppointments((prev) =>
        prev.map((apt) =>
          apt.id === appointmentId
            ? {
                ...apt,
                status: 'CANCELLED' as const,
                cancelReason: dialogState.cancelReason
              }
            : apt
        )
      )
    } catch (err) {
      // Handle error notification if needed
    } finally {
      setActionLoading(null)
      closeDialog()
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

  const pendingCount = appointments.filter((a) => a.status === 'PENDING').length

  return (
    <div className='min-h-screen bg-background'>
      <DashboardHeader />

      <main className='container mx-auto px-4 py-8'>
        {/* Page Header */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-foreground'>
            Quản Lý Lịch Hẹn
          </h1>
          <p className='mt-2 text-muted-foreground'>
            Xem và quản lý tất cả các cuộc hẹn của bạn tại đây.
          </p>
        </div>

        {/* Summary Card */}
        {!loading && (
          <div className='mb-6'>
            <div className='inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-3'>
              <div className='flex h-8 w-8 items-center justify-center rounded-full bg-primary/10'>
                <Calendar className='h-4 w-4 text-primary' />
              </div>
              <div>
                <span className='text-sm text-muted-foreground'>
                  Cuộc hẹn đang chờ xác nhận:{' '}
                </span>
                <span className='font-semibold text-foreground'>
                  {pendingCount}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className='mb-4 rounded-lg bg-destructive/10 p-4 text-sm text-destructive'>
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <Card>
            <CardHeader>
              <Skeleton className='h-6 w-48' />
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {[...Array(5)].map((_, i) => (
                  <div key={i} className='flex items-center gap-4'>
                    <Skeleton className='h-5 w-32' />
                    <Skeleton className='h-5 w-28' />
                    <Skeleton className='h-5 w-20' />
                    <Skeleton className='h-6 w-20' />
                    <Skeleton className='h-9 w-32 ml-auto' />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Appointments Table */}
        {!loading && appointments.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className='text-lg font-medium flex items-center gap-2'>
                <Calendar className='h-5 w-5 text-primary' />
                Lịch Hẹn Của Bạn
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Bệnh nhân</TableHead>
                    <TableHead>Ngày</TableHead>
                    <TableHead>Giờ</TableHead>
                    <TableHead>Lý do</TableHead>
                    <TableHead>Tình trạng</TableHead>
                    <TableHead className='text-right'>Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {appointments.map((appointment) => {
                    const statusConfig = STATUS_STYLES[appointment.status] || {
                      variant: 'outline' as const,
                      label: appointment.status || 'Unknown'
                    }
                    const isPending = appointment.status === 'PENDING'
                    const isLoading = actionLoading === appointment.id

                    return (
                      <TableRow key={appointment.id}>
                        <TableCell>
                          <div className='flex items-center gap-2'>
                            <div className='flex h-8 w-8 items-center justify-center rounded-full bg-muted'>
                              <User className='h-4 w-4 text-muted-foreground' />
                            </div>
                            <span className='font-medium'>
                              {appointment.guest?.name || 'N/A'}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className='flex items-center gap-2'>
                            <Calendar className='h-4 w-4 text-muted-foreground' />
                            <span>
                              {formatDate(appointment?.timeSlot?.startTime)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className='flex items-center gap-2'>
                            <Clock className='h-4 w-4 text-muted-foreground' />
                            <span>
                              {formatTime(appointment?.timeSlot?.startTime)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className='flex items-center gap-2'>
                            <Clock className='h-4 w-4 text-muted-foreground' />
                            <span>{formatTime(appointment.reason)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={statusConfig.variant}>
                            {statusConfig.label}
                          </Badge>
                        </TableCell>
                        <TableCell className='text-right'>
                          {isPending && (
                            <div className='flex items-center justify-end gap-2'>
                              {isLoading ? (
                                <Loader2 className='h-4 w-4 animate-spin text-muted-foreground' />
                              ) : (
                                <>
                                  <Button
                                    variant='default'
                                    size='sm'
                                    onClick={() =>
                                      openDialog('confirm', appointment)
                                    }
                                    className='bg-primary hover:bg-primary/90'
                                  >
                                    <Check className='h-4 w-4 mr-1' />
                                    Xác nhận
                                  </Button>
                                  <Button
                                    variant='ghost'
                                    size='sm'
                                    onClick={() =>
                                      openDialog('cancel', appointment)
                                    }
                                    className='text-destructive hover:text-destructive hover:bg-destructive/10'
                                  >
                                    <X className='h-4 w-4 mr-1' />
                                    Hủy
                                  </Button>
                                </>
                              )}
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {!loading && appointments.length === 0 && (
          <Card>
            <CardContent className='flex flex-col items-center justify-center py-16 text-center'>
              <div className='flex h-16 w-16 items-center justify-center rounded-full bg-muted'>
                <Calendar className='h-8 w-8 text-muted-foreground' />
              </div>
              <h3 className='mt-4 text-lg font-medium text-foreground'>
                Không có cuộc hẹn nào
              </h3>
              <p className='mt-2 text-sm text-muted-foreground max-w-sm'>
                Bạn chưa có bất kỳ yêu cầu hẹn lịch nào.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Confirm Dialog */}
        <AlertDialog
          open={dialogState.open && dialogState.type === 'confirm'}
          onOpenChange={(open) => !open && closeDialog()}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className='flex items-center gap-2'>
                <Check className='h-5 w-5 text-primary' />
                Xác nhận cuộc hẹn
              </AlertDialogTitle>
              <AlertDialogDescription>
                Xác nhận cuộc hẹn với{' '}
                <span className='font-medium'>
                  {dialogState.appointment?.guest?.name || 'a guest'}
                </span>{' '}
                đã lên lịch cho ngày{' '}
                <span className='font-medium'>
                  {dialogState.appointment &&
                    format(
                      new Date(dialogState.appointment.timeSlot.startTime),
                      "MMMM dd, yyyy 'at' hh:mm a"
                    )}
                </span>
                ? Bệnh nhân sẽ được thông báo.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Hủy</AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirm}>
                Xác nhận cuộc hẹn
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Cancel Dialog */}
        <AlertDialog
          open={dialogState.open && dialogState.type === 'cancel'}
          onOpenChange={(open) => !open && closeDialog()}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className='flex items-center gap-2'>
                <X className='h-5 w-5 text-destructive' />
                Cancel Appointment
              </AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to cancel this appointment? Please provide
                a reason.
              </AlertDialogDescription>
              <div className='pt-2'>
                <Label htmlFor='cancelReason' className='sr-only'>
                  Cancellation Reason
                </Label>
                <Textarea
                  id='cancelReason'
                  placeholder='e.g., Doctor is unavailable.'
                  value={dialogState.cancelReason}
                  onChange={(e) =>
                    setDialogState((prev) => ({
                      ...prev,
                      cancelReason: e.target.value
                    }))
                  }
                />
              </div>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Keep Appointment</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleCancel}
                disabled={!dialogState.cancelReason}
                className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
              >
                Cancel Appointment
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </div>
  )
}
