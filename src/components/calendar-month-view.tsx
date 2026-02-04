'use client'

import React from 'react'
import {
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    format,
    isSameMonth,
    isToday,
    startOfWeek,
    endOfWeek
} from 'date-fns'
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react'
import { Button } from '@/src/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/src/components/ui/card'
import { Badge } from '@/src/components/ui/badge'
import { cn } from '@/src/lib/utils'

interface DayStats {
    total: number
    confirmed: number
    pending: number
    canceled: number
}

interface CalendarMonthViewProps {
    currentDate: Date
    monthData: Record<string, DayStats> // { '2026-02-01': { total: 5, ... } }
    onDateClick: (date: Date) => void
    onMonthChange: (direction: 'prev' | 'next') => void
}

export function CalendarMonthView({
    currentDate,
    monthData,
    onDateClick,
    onMonthChange
}: CalendarMonthViewProps) {
    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(currentDate)
    const calendarStart = startOfWeek(monthStart)
    const calendarEnd = endOfWeek(monthEnd)

    const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

    const getColorByLoad = (total: number) => {
        if (total === 0) return 'bg-muted text-muted-foreground'
        if (total <= 2) return 'bg-green-50 text-green-700 hover:bg-green-100'
        if (total <= 5) return 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
        return 'bg-red-50 text-red-700 hover:bg-red-100'
    }

    return (
        <Card>
            <CardHeader>
                <div className='flex items-center justify-between'>
                    <CardTitle className='flex items-center gap-2'>
                        <Calendar className='h-5 w-5' />
                        {format(currentDate, 'MMMM yyyy')}
                    </CardTitle>
                    <div className='flex gap-2'>
                        <Button
                            variant='outline'
                            size='icon'
                            onClick={() => onMonthChange('prev')}
                        >
                            <ChevronLeft className='h-4 w-4' />
                        </Button>
                        <Button
                            variant='outline'
                            size='icon'
                            onClick={() => onMonthChange('next')}
                        >
                            <ChevronRight className='h-4 w-4' />
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {/* Weekday headers */}
                <div className='grid grid-cols-7 gap-2 mb-2'>
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                        <div
                            key={day}
                            className='text-center text-sm font-medium text-muted-foreground py-2'
                        >
                            {day}
                        </div>
                    ))}
                </div>

                {/* Calendar grid */}
                <div className='grid grid-cols-7 gap-2'>
                    {days.map((day) => {
                        const dateKey = format(day, 'yyyy-MM-dd')
                        const stats = monthData[dateKey] || {
                            total: 0,
                            confirmed: 0,
                            pending: 0,
                            canceled: 0
                        }
                        const isCurrentMonth = isSameMonth(day, currentDate)
                        const isCurrentDay = isToday(day)

                        return (
                            <button
                                key={day.toString()}
                                onClick={() => isCurrentMonth && onDateClick(day)}
                                disabled={!isCurrentMonth}
                                className={cn(
                                    'relative min-h-[80px] p-2 rounded-lg border transition-all',
                                    'flex flex-col items-center justify-start',
                                    isCurrentMonth
                                        ? getColorByLoad(stats.total)
                                        : 'bg-muted/30 text-muted-foreground cursor-not-allowed',
                                    isCurrentDay &&
                                    'ring-2 ring-primary ring-offset-2',
                                    isCurrentMonth && 'hover:shadow-md cursor-pointer'
                                )}
                            >
                                <span
                                    className={cn(
                                        'text-sm font-medium mb-1',
                                        isCurrentDay && 'font-bold'
                                    )}
                                >
                                    {format(day, 'd')}
                                </span>

                                {isCurrentMonth && stats.total > 0 && (
                                    <div className='flex flex-col gap-1 w-full'>
                                        <Badge
                                            variant='secondary'
                                            className='text-xs justify-center'
                                        >
                                            📝 {stats.total}
                                        </Badge>
                                        {stats.confirmed > 0 && (
                                            <span className='text-[10px] text-center text-green-600'>
                                                ✓ {stats.confirmed}
                                            </span>
                                        )}
                                        {stats.pending > 0 && (
                                            <span className='text-[10px] text-center text-yellow-600'>
                                                ⏳ {stats.pending}
                                            </span>
                                        )}
                                    </div>
                                )}
                            </button>
                        )
                    })}
                </div>

                {/* Legend */}
                <div className='mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground'>
                    <div className='flex items-center gap-2'>
                        <div className='w-4 h-4 rounded bg-green-50 border' />
                        <span>Light (0-2)</span>
                    </div>
                    <div className='flex items-center gap-2'>
                        <div className='w-4 h-4 rounded bg-yellow-50 border' />
                        <span>Moderate (3-5)</span>
                    </div>
                    <div className='flex items-center gap-2'>
                        <div className='w-4 h-4 rounded bg-red-50 border' />
                        <span>Busy (6+)</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
