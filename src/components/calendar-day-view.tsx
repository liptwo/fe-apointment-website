'use client'

import React from 'react'
import { format, parseISO } from 'date-fns'
import { ArrowLeft, CalendarDays, Clock, User, Phone } from 'lucide-react'
import { Button } from '@/src/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Badge } from '@/src/components/ui/badge'
import { cn } from '@/src/lib/utils'

interface Appointment {
    id: string
    patient_name: string
    phone: string
    status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'
    timeslots: {
        start_time: string
        end_time: string
    }
}

interface DayStats {
    total: number
    confirmed: number
    pending: number
    canceled: number
}

interface CalendarDayViewProps {
    selectedDate: Date
    appointments: Appointment[]
    stats: DayStats
    availabilityHours: { start: number; end: number } // e.g., { start: 8, end: 18 }
    onBackClick: () => void
}

export function CalendarDayView({
    selectedDate,
    appointments,
    stats,
    availabilityHours,
    onBackClick
}: CalendarDayViewProps) {
    const hours = Array.from(
        { length: availabilityHours.end - availabilityHours.start + 1 },
        (_, i) => availabilityHours.start + i
    )

    const getAppointmentForHour = (hour: number) => {
        return appointments.find((apt) => {
            const startHour = new Date(apt.timeslots.start_time).getHours()
            return startHour === hour
        })
    }

    const getStatusColor = (status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED') => {
        switch (status) {
            case 'CONFIRMED':
                return 'bg-blue-100 border-blue-300 text-blue-900'
            case 'PENDING':
                return 'bg-yellow-100 border-yellow-300 text-yellow-900'
            case 'CANCELLED':
                return 'bg-red-100 border-red-300 text-red-900'
            case 'COMPLETED':
                return 'bg-gray-100 border-gray-300 text-gray-900'
            default:
                return 'bg-green-100 border-green-300 text-green-900'
        }
    }

    const getStatusBadgeVariant = (status: string) => {
        switch (status) {
            case 'CONFIRMED':
                return 'default'
            case 'PENDING':
                return 'secondary'
            case 'CANCELLED':
                return 'destructive'
            default:
                return 'outline'
        }
    }

    return (
        <div className='space-y-4'>
            {/* Header */}
            <div className='flex items-center justify-between'>
                <Button variant='ghost' onClick={onBackClick} className='gap-2'>
                    <ArrowLeft className='h-4 w-4' />
                    Back to Month
                </Button>
                <div className='flex items-center gap-2 text-lg font-medium'>
                    <CalendarDays className='h-5 w-5' />
                    {format(selectedDate, 'MMMM dd, yyyy')}
                </div>
            </div>

            {/* Statistics */}
            <Card>
                <CardContent className='pt-6'>
                    <div className='grid grid-cols-4 gap-4 text-center'>
                        <div>
                            <div className='text-2xl font-bold'>{stats.total}</div>
                            <div className='text-sm text-muted-foreground'>Total</div>
                        </div>
                        <div>
                            <div className='text-2xl font-bold text-blue-600'>
                                {stats.confirmed}
                            </div>
                            <div className='text-sm text-muted-foreground'>Confirmed</div>
                        </div>
                        <div>
                            <div className='text-2xl font-bold text-yellow-600'>
                                {stats.pending}
                            </div>
                            <div className='text-sm text-muted-foreground'>Pending</div>
                        </div>
                        <div>
                            <div className='text-2xl font-bold text-red-600'>
                                {stats.canceled}
                            </div>
                            <div className='text-sm text-muted-foreground'>Canceled</div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Timeline */}
            <Card>
                <CardHeader>
                    <CardTitle className='flex items-center gap-2'>
                        <Clock className='h-5 w-5' />
                        Daily Timeline
                    </CardTitle>
                </CardHeader>
                <CardContent className='space-y-2'>
                    {hours.map((hour) => {
                        const appointment = getAppointmentForHour(hour)
                        const timeLabel = `${hour.toString().padStart(2, '0')}:00`

                        return (
                            <div
                                key={hour}
                                className={cn(
                                    'flex items-center gap-4 p-3 rounded-lg border transition-all',
                                    appointment
                                        ? getStatusColor(appointment.status)
                                        : 'bg-green-50 border-green-200'
                                )}
                            >
                                <div className='flex items-center gap-2 min-w-[80px]'>
                                    <Clock className='h-4 w-4' />
                                    <span className='font-medium'>{timeLabel}</span>
                                </div>

                                {appointment ? (
                                    <div className='flex-1 flex items-center justify-between'>
                                        <div className='flex items-center gap-4'>
                                            <div className='flex items-center gap-2'>
                                                <User className='h-4 w-4' />
                                                <span className='font-medium'>
                                                    {appointment.patient_name}
                                                </span>
                                            </div>
                                            <div className='flex items-center gap-2 text-sm'>
                                                <Phone className='h-4 w-4' />
                                                <span>{appointment.phone}</span>
                                            </div>
                                        </div>
                                        <Badge variant={getStatusBadgeVariant(appointment.status) as any}>
                                            {appointment.status}
                                        </Badge>
                                    </div>
                                ) : (
                                    <div className='flex-1 flex items-center text-muted-foreground'>
                                        <span className='text-sm'>Available</span>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </CardContent>
            </Card>
        </div>
    )
}
