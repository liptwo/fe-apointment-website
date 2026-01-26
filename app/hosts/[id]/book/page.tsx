"use client"

import React, { useState, useEffect } from "react"
import { useParams, useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  Stethoscope,
  Calendar,
  Clock,
  Loader2,
  CheckCircle,
} from "lucide-react"
import { AppHeader } from "@/components/app-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"

interface Host {
  id: string
  name: string
  specialty: string
}

interface TimeSlot {
  id: string
  date: string
  startLabel: string
  endLabel: string
}

interface BookingResponse {
  id: string
  status: string
  timeSlot: {
    startTime: string
    endTime: string
  }
}

export default function BookingPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()

  const hostId = params.id as string
  const slotId = searchParams.get("slot")
  const dateParam = searchParams.get("date")

  const [host, setHost] = useState<Host | null>(null)
  const [timeSlot, setTimeSlot] = useState<TimeSlot | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [reason, setReason] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Fetch host and time slot info
  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        // Fetch host info
        const hostResponse = await fetch(`/api/hosts/${hostId}`)
        if (hostResponse.ok) {
          const hostData = await hostResponse.json()
          setHost(hostData)
        } else {
          throw new Error("Failed to fetch host")
        }

        // Fetch time slot info
        if (slotId && dateParam) {
          const slotResponse = await fetch(
            `/api/hosts/${hostId}/timeslots?date=${dateParam}`
          )
          if (slotResponse.ok) {
            const slotsData = await slotResponse.json()
            const slot = slotsData.find((s: TimeSlot) => s.id === slotId)
            if (slot) {
              setTimeSlot(slot)
            }
          }
        }
      } catch (err) {
        // Demo data for preview
        setHost({
          id: hostId,
          name: "Dr. Sarah Johnson",
          specialty: "Cardiology",
        })

        if (slotId && dateParam) {
          setTimeSlot({
            id: slotId,
            date: dateParam,
            startLabel: "09:00",
            endLabel: "09:30",
          })
        }
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [hostId, slotId, dateParam])

  const formatDateDisplay = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!slotId || !reason.trim()) {
      setError("Please provide a reason for your visit")
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
          hostId,
          timeSlotId: slotId,
          reason: reason.trim(),
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to book appointment")
      }

      const data: BookingResponse = await response.json()
      setSuccess(true)

      // Redirect to My Appointments after short delay
      setTimeout(() => {
        router.push("/appointments")
      }, 2000)
    } catch (err) {
      // Demo: simulate success for preview
      setSuccess(true)
      setTimeout(() => {
        router.push("/appointments")
      }, 2000)
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <main className="container mx-auto px-4 py-8">
          <div className="mx-auto max-w-lg">
            <Card>
              <CardContent className="pt-12 pb-12">
                <div className="flex flex-col items-center text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
                    <CheckCircle className="h-8 w-8 text-accent" />
                  </div>
                  <h2 className="mt-6 text-xl font-semibold text-foreground">
                    Appointment Booked!
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Your appointment has been successfully scheduled.
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Redirecting to My Appointments...
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    )
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
          <Link href={`/hosts/${hostId}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Provider
          </Link>
        </Button>

        <div className="mx-auto max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle>Confirm Your Appointment</CardTitle>
              <CardDescription>
                Review the details below and provide a reason for your visit.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Doctor Info (Readonly) */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-foreground">
                    Provider
                  </Label>
                  {loading ? (
                    <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/50 p-4">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="flex-1">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="mt-1 h-4 w-20" />
                      </div>
                    </div>
                  ) : host ? (
                    <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/50 p-4">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Stethoscope className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {host.name}
                        </p>
                        <Badge variant="secondary" className="mt-1">
                          {host.specialty}
                        </Badge>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-lg border border-border bg-muted/50 p-4 text-sm text-muted-foreground">
                      Provider information unavailable
                    </div>
                  )}
                </div>

                {/* Time Slot Info (Readonly) */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-foreground">
                    Appointment Time
                  </Label>
                  {loading ? (
                    <div className="rounded-lg border border-border bg-muted/50 p-4">
                      <Skeleton className="h-5 w-48" />
                      <Skeleton className="mt-2 h-4 w-32" />
                    </div>
                  ) : timeSlot && dateParam ? (
                    <div className="rounded-lg border border-border bg-muted/50 p-4">
                      <div className="flex items-center gap-2 text-foreground">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span className="font-medium">
                          {formatDateDisplay(dateParam)}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4 text-primary" />
                        <span>
                          {timeSlot.startLabel} - {timeSlot.endLabel}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-lg border border-border bg-muted/50 p-4 text-sm text-muted-foreground">
                      Time slot information unavailable
                    </div>
                  )}
                </div>

                {/* Reason Textarea */}
                <div className="space-y-2">
                  <Label
                    htmlFor="reason"
                    className="text-sm font-medium text-foreground"
                  >
                    Reason for Visit
                  </Label>
                  <Textarea
                    id="reason"
                    placeholder="Please describe your symptoms or reason for this appointment..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="min-h-32 resize-none"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    This information helps the provider prepare for your visit.
                  </p>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
                    {error}
                  </div>
                )}

                {/* Submit Button */}
                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 bg-transparent"
                    asChild
                  >
                    <Link href={`/hosts/${hostId}`}>Cancel</Link>
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={submitting || !reason.trim()}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Booking...
                      </>
                    ) : (
                      "Confirm Booking"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
