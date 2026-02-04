'use client'

import { useState, useEffect } from 'react'
import Calendar from '@/src/components/calendar/calendar'
import { CalendarEvent, Mode } from '@/src/components/calendar/calendar-types'
import { useAuth } from '@/src/providers/auth-provider'
import { getAppointmentsByRange, type Appointment } from '@/src/services/calendar.service'
import { getTimeslotsByHostId } from '@/src/services/timeslot.service'
import { Loader2 } from 'lucide-react'
import { startOfMonth, endOfMonth, format } from 'date-fns'
import { DashboardHeader } from '@/src/components/dashboard-header'
import { AppHeader } from '@/src/components/app-header'

// Convert appointment to CalendarEvent
function appointmentToEvent(appointment: Appointment): CalendarEvent {
    const colors = {
        CONFIRMED: 'green',
        PENDING: 'amber',
        CANCELED: 'red',
        COMPLETED: 'gray'
    }

    return {
        id: appointment.id,
        title: appointment.status === 'CANCELED'
            ? `❌ ${appointment.patient_name || 'Unknown'} - ${appointment.phone || 'No Phone'}`
            : `${appointment.patient_name || 'Unknown Patient'} - ${appointment.phone || 'No Phone'}`,
        color: colors[appointment.status as keyof typeof colors] || colors.PENDING,
        start: new Date(appointment.timeslots?.start_time || ''),
        end: new Date(appointment.timeslots?.end_time || '')
    }
}

// Convert timeslot to CalendarEvent  
function timeslotToEvent(timeslot: any): CalendarEvent {
    return {
        id: `slot-${timeslot.id}`,
        title: timeslot.isAvailable ? '🟢 Available' : '🔴 Booked',
        color: timeslot.isAvailable ? 'emerald' : 'rose',
        start: new Date(timeslot.startTime),
        end: new Date(timeslot.endTime)
    }
}

export default function SchedulePage() {
    const { user } = useAuth()
    const [events, setEvents] = useState<CalendarEvent[]>([])
    const [mode, setMode] = useState<Mode>('month')
    const [date, setDate] = useState<Date>(new Date())
    const [loading, setLoading] = useState(true)

    // Fetch both appointments and timeslots whenever date changes
    useEffect(() => {
        if (user?.id) {
            fetchCalendarData()
        }
    }, [date, mode, user])

    const fetchCalendarData = async () => {
        if (!user?.id) return

        setLoading(true)
        try {
            // Calculate date range based on current view mode
            let startDate: string
            let endDate: string

            if (mode === 'day') {
                startDate = format(date, 'yyyy-MM-dd')
                endDate = format(date, 'yyyy-MM-dd')
            } else if (mode === 'week') {
                const start = new Date(date)
                start.setDate(start.getDate() - start.getDay())
                const end = new Date(start)
                end.setDate(end.getDate() + 6)
                startDate = format(start, 'yyyy-MM-dd')
                endDate = format(end, 'yyyy-MM-dd')
            } else {
                const monthStart = startOfMonth(date)
                const monthEnd = endOfMonth(date)
                startDate = format(monthStart, 'yyyy-MM-dd')
                endDate = format(monthEnd, 'yyyy-MM-dd')
            }

            // Fetch both appointments and timeslots in parallel
            const [appointments, timeslots] = await Promise.all([
                getAppointmentsByRange(startDate, endDate).catch(() => []),
                getTimeslotsByHostId(user.id).catch(() => [])
            ])

            // Filter timeslots by date range and hide if appointment exists
            const filteredTimeslots = timeslots.filter((slot: any) => {
                const slotDate = new Date(slot.startTime).toISOString().split('T')[0]
                const inRange = slotDate >= startDate && slotDate <= endDate

                // Hide timeslot if there is any appointment associated with it to prevent overlapping
                const hasAppointment = appointments.some(appt => appt.timeslots?.id === slot.id)

                return inRange && !hasAppointment
            })

            // Convert to calendar events
            const appointmentEvents = appointments
                .filter(appt => appt.timeslots)
                .map(appointmentToEvent)
            const timeslotEvents = filteredTimeslots.map(timeslotToEvent)

            // Merge events (timeslots as background, appointments on top)
            setEvents([...timeslotEvents, ...appointmentEvents])
        } catch (error) {
            console.error('Failed to fetch calendar data:', error)
            setEvents([])
        } finally {
            setLoading(false)
        }
    }

    if (!user || user.role !== 'HOST') {
        return (
            <div className='min-h-screen flex items-center justify-center'>
                <div className='text-center'>
                    <h1 className='text-2xl font-semibold mb-2'>Access Denied</h1>
                    <p className='text-muted-foreground'>
                        This page is only accessible to HOST users.
                    </p>
                </div>
            </div>
        )
    }

    if (loading) {
        return (
            <div className='min-h-screen flex items-center justify-center'>
                <Loader2 className='h-8 w-8 animate-spin text-primary' />
            </div>
        )
    }

    return (
        <div className='min-h-screen bg-background'>
            {user.role === 'HOST' ? <DashboardHeader /> : <AppHeader />}
            <main className='container mx-auto px-4 py-8'>
                <div className='mb-6'>
                    <h1 className='text-3xl font-semibold'>My Schedule</h1>
                    <p className='text-muted-foreground mt-1'>
                        View your availability rules and appointments
                    </p>
                    <div className='flex gap-4 mt-3 text-sm'>
                        <div className='flex items-center gap-2'>
                            <div className='w-4 h-4 rounded' style={{ backgroundColor: '#d1fae520', border: '1px solid #10b981' }}></div>
                            <span>Available Slots</span>
                        </div>
                        <div className='flex items-center gap-2'>
                            <div className='w-4 h-4 rounded bg-green-500'></div>
                            <span>Confirmed</span>
                        </div>
                        <div className='flex items-center gap-2'>
                            <div className='w-4 h-4 rounded bg-amber-500'></div>
                            <span>Pending</span>
                        </div>
                        <div className='flex items-center gap-2'>
                            <div className='w-4 h-4 rounded bg-red-500'></div>
                            <span>Cancelled</span>
                        </div>
                    </div>
                </div>

                <Calendar
                    events={events}
                    setEvents={setEvents}
                    mode={mode}
                    setMode={setMode}
                    date={date}
                    setDate={setDate}
                />
            </main>
        </div>
    )
}
