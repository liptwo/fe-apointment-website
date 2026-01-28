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
import { AppHeader } from '@/components/app-header'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  getMyBookings,
  cancelAppointment
} from '@/services/appointment.service'
import { Appointment } from '@/types'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import Link from 'next/link'

const STATUS_STYLES: Record<
  Appointment['status'],
  {
    variant: 'default' | 'secondary' | 'destructive' | 'outline'
    label: string
  }
> = {
  PENDING: { variant: 'secondary', label: 'Pending' },
  CONFIRMED: { variant: 'default', label: 'Confirmed' },
  CANCELLED: { variant: 'destructive', label: 'Cancelled' },
  COMPLETED: { variant: 'outline', label: 'Completed' }
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
      setError(err instanceof Error ? err.message : 'An error occurred')
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
      setError('Failed to cancel appointment. Please try again.')
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
            My Appointments
          </h1>
          <p className='mt-2 text-muted-foreground'>
            View and manage your upcoming and past appointments.
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
                All Appointments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Provider</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className='text-right'>Action</TableHead>
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
                                  Cancel
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
                No appointments yet
              </h3>
              <p className='mt-2 text-sm text-muted-foreground max-w-sm'>
                You haven&apos;t booked any appointments. Find a healthcare
                provider to schedule your first visit.
              </p>
              <Button asChild className='mt-6'>
                <Link href='/hosts'>Find a Provider</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className='flex items-center gap-2'>
                <AlertCircle className='h-5 w-5 text-destructive' />
                Cancel Appointment
              </AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to cancel this appointment scheduled for{' '}
                <span className='font-medium'>
                  {selectedAppointment &&
                    format(
                      new Date(selectedAppointment.timeSlot.startTime),
                      "MMMM dd, yyyy 'at' hh:mm a"
                    )}
                </span>
                ? This action cannot be undone.
              </AlertDialogDescription>
              <div className='pt-2 space-y-2'>
                <Label htmlFor='cancelReason'>Reason for cancellation</Label>
                <Textarea
                  id='cancelReason'
                  placeholder='Please provide a brief reason for cancelling...'
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                />
              </div>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Keep Appointment</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleCancelConfirm}
                disabled={!cancelReason.trim()}
                className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
              >
                Yes, Cancel
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </div>
  )
}
