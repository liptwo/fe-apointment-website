"use client"

import React, { useState, useEffect, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  Stethoscope,
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react"
import { AppHeader } from "@/components/app-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface Host {
  id: string
  name: string
  specialty: string
  description: string
}

interface TimeSlot {
  id: string
  date: string
  startLabel: string
  endLabel: string
  isAvailable: boolean
}

// Generate dates for the next 14 days
function generateDates(startDate: Date, count: number) {
  const dates: Date[] = []
  for (let i = 0; i < count; i++) {
    const date = new Date(startDate)
    date.setDate(date.getDate() + i)
    dates.push(date)
  }
  return dates
}

function formatDate(date: Date) {
  return date.toISOString().split("T")[0]
}

function formatDayName(date: Date) {
  return date.toLocaleDateString("en-US", { weekday: "short" })
}

function formatDayNumber(date: Date) {
  return date.getDate()
}

function formatMonthYear(date: Date) {
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" })
}

export default function HostDetailPage() {
  const params = useParams()
  const router = useRouter()
  const hostId = params.id as string

  const [host, setHost] = useState<Host | null>(null)
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
  const [loadingHost, setLoadingHost] = useState(true)
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [dates] = useState(() => generateDates(new Date(), 14))
  const [selectedDate, setSelectedDate] = useState<Date>(dates[0])
  const [dateOffset, setDateOffset] = useState(0)
  const visibleDatesCount = 7

  // Fetch host info
  useEffect(() => {
    async function fetchHost() {
      setLoadingHost(true)
      try {
        const response = await fetch(`/api/hosts/${hostId}`)
        if (!response.ok) throw new Error("Failed to fetch host")
        const data = await response.json()
        setHost(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
        // Demo data
        setHost({
          id: hostId,
          name: "Dr. Sarah Johnson",
          specialty: "Cardiology",
          description:
            "Board-certified cardiologist with over 15 years of experience in treating heart conditions. Specializes in preventive cardiology, heart failure management, and cardiac rehabilitation. Dr. Johnson is dedicated to providing personalized care and helping patients maintain optimal heart health through comprehensive treatment plans.",
        })
      } finally {
        setLoadingHost(false)
      }
    }
    fetchHost()
  }, [hostId])

  // Fetch time slots for selected date
  const fetchTimeSlots = useCallback(async () => {
    setLoadingSlots(true)
    try {
      const dateStr = formatDate(selectedDate)
      const response = await fetch(
        `/api/hosts/${hostId}/timeslots?date=${dateStr}`
      )
      if (!response.ok) throw new Error("Failed to fetch time slots")
      const data = await response.json()
      // Only show available slots
      setTimeSlots(data.filter((slot: TimeSlot) => slot.isAvailable))
    } catch (err) {
      // Demo data
      const dateStr = formatDate(selectedDate)
      const demoSlots: TimeSlot[] = [
        { id: "1", date: dateStr, startLabel: "09:00", endLabel: "09:30", isAvailable: true },
        { id: "2", date: dateStr, startLabel: "09:30", endLabel: "10:00", isAvailable: true },
        { id: "3", date: dateStr, startLabel: "10:00", endLabel: "10:30", isAvailable: false },
        { id: "4", date: dateStr, startLabel: "10:30", endLabel: "11:00", isAvailable: true },
        { id: "5", date: dateStr, startLabel: "11:00", endLabel: "11:30", isAvailable: true },
        { id: "6", date: dateStr, startLabel: "14:00", endLabel: "14:30", isAvailable: true },
        { id: "7", date: dateStr, startLabel: "14:30", endLabel: "15:00", isAvailable: false },
        { id: "8", date: dateStr, startLabel: "15:00", endLabel: "15:30", isAvailable: true },
        { id: "9", date: dateStr, startLabel: "15:30", endLabel: "16:00", isAvailable: true },
        { id: "10", date: dateStr, startLabel: "16:00", endLabel: "16:30", isAvailable: true },
      ]
      setTimeSlots(demoSlots.filter((slot) => slot.isAvailable))
    } finally {
      setLoadingSlots(false)
    }
  }, [hostId, selectedDate])

  useEffect(() => {
    fetchTimeSlots()
  }, [fetchTimeSlots])

  const handlePrevDates = () => {
    if (dateOffset > 0) {
      setDateOffset((prev) => prev - 1)
    }
  }

  const handleNextDates = () => {
    if (dateOffset < dates.length - visibleDatesCount) {
      setDateOffset((prev) => prev + 1)
    }
  }

  const visibleDates = dates.slice(dateOffset, dateOffset + visibleDatesCount)

  const handleBook = (slotId: string) => {
    // Navigate to booking confirmation or perform booking action
    router.push(`/hosts/${hostId}/book?slot=${slotId}&date=${formatDate(selectedDate)}`)
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="mb-6 -ml-2 text-muted-foreground hover:text-foreground"
        >
          <Link href="/hosts">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Providers
          </Link>
        </Button>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Host Info Section */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="pt-6">
                {loadingHost ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-16 w-16 rounded-full" />
                      <div className="flex-1">
                        <Skeleton className="h-6 w-40" />
                        <Skeleton className="mt-2 h-5 w-24" />
                      </div>
                    </div>
                    <Skeleton className="h-32 w-full" />
                  </div>
                ) : host ? (
                  <div>
                    <div className="flex items-start gap-4">
                      <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Stethoscope className="h-8 w-8" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h1 className="text-xl font-semibold text-foreground">
                          {host.name}
                        </h1>
                        <Badge variant="secondary" className="mt-2">
                          {host.specialty}
                        </Badge>
                      </div>
                    </div>
                    <p className="mt-6 text-sm text-muted-foreground leading-relaxed">
                      {host.description}
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Provider not found
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Booking Section */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Select Date & Time
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Month/Year Display */}
                <p className="text-sm font-medium text-foreground">
                  {formatMonthYear(selectedDate)}
                </p>

                {/* Date Selector */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handlePrevDates}
                    disabled={dateOffset === 0}
                    className="flex-shrink-0 bg-transparent"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>

                  <div className="flex flex-1 gap-2 overflow-hidden">
                    {visibleDates.map((date) => {
                      const isSelected =
                        formatDate(date) === formatDate(selectedDate)
                      const isToday =
                        formatDate(date) === formatDate(new Date())

                      return (
                        <button
                          key={formatDate(date)}
                          onClick={() => setSelectedDate(date)}
                          className={`flex flex-1 flex-col items-center justify-center rounded-lg border p-3 transition-colors ${
                            isSelected
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border bg-card hover:border-primary/50 hover:bg-muted"
                          }`}
                        >
                          <span className="text-xs font-medium">
                            {formatDayName(date)}
                          </span>
                          <span className="text-lg font-semibold">
                            {formatDayNumber(date)}
                          </span>
                          {isToday && (
                            <span className="text-[10px] uppercase tracking-wide">
                              Today
                            </span>
                          )}
                        </button>
                      )
                    })}
                  </div>

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleNextDates}
                    disabled={dateOffset >= dates.length - visibleDatesCount}
                    className="flex-shrink-0"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>

                {/* Time Slots */}
                <div>
                  <h3 className="mb-4 flex items-center gap-2 text-sm font-medium text-foreground">
                    <Clock className="h-4 w-4 text-primary" />
                    Available Time Slots
                  </h3>

                  {loadingSlots ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {[...Array(8)].map((_, i) => (
                        <Skeleton key={i} className="h-16 w-full" />
                      ))}
                    </div>
                  ) : timeSlots.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {timeSlots.map((slot) => (
                        <div
                          key={slot.id}
                          className="flex flex-col items-center rounded-lg border border-border bg-card p-3 transition-colors hover:border-primary/50"
                        >
                          <span className="text-sm font-medium text-foreground">
                            {slot.startLabel} - {slot.endLabel}
                          </span>
                          <Button
                            size="sm"
                            className="mt-2 w-full"
                            onClick={() => handleBook(slot.id)}
                          >
                            Book
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                        <Calendar className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <p className="mt-4 text-sm text-muted-foreground">
                        No available time slots for this date.
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Please select a different date.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
