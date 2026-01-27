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
  User as UserIcon,
  Mail,
  Phone,
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
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/providers/auth-provider"
import { getHostById } from "@/services/host.service"
import { getTimeslotsByHostId } from "@/services/timeslot.service"
import {
  createAppointment,
  createPublicAppointment,
} from "@/services/appointment.service"

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
  isAvailable: boolean
}

export default function BookingPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user } = useAuth()

  const hostId = params.id as string
  const timeSlotId = searchParams.get("timeslotId")

  const [host, setHost] = useState<Host | null>(null)
  const [timeSlot, setTimeSlot] = useState<TimeSlot | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [reason, setReason] = useState("")

  // State for anonymous booking
  const [guestName, setGuestName] = useState("")
  const [guestEmail, setGuestEmail] = useState("")
  const [guestPhone, setGuestPhone] = useState("")

  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Fetch host and time slot info
  useEffect(() => {
    async function fetchData() {
      if (!hostId || !timeSlotId) {
        setError("Host or Time Slot information is missing.")
        setLoading(false)
        return
      }
      setLoading(true)
      try {
        const hostData = await getHostById(hostId)
        setHost(hostData)

        const allSlots = await getTimeslotsByHostId(hostId)
        const selectedSlot = allSlots.find((s: TimeSlot) => s.id === timeSlotId)

        if (selectedSlot) {
          setTimeSlot(selectedSlot)
        } else {
          throw new Error("The selected time slot could not be found.")
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load booking details.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [hostId, timeSlotId])

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

    if (!timeSlotId || !reason.trim()) {
      setError("Please provide a reason for your visit")
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      if (user) {
        // Authenticated user booking
        await createAppointment({
          hostId,
          timeSlotId,
          reason: reason.trim(),
        })
      } else {
        // Anonymous user booking
        if (!guestName.trim() || !guestEmail.trim()) {
          throw new Error("Please provide your name and email.")
        }
        await createPublicAppointment({
          hostId,
          timeSlotId,
          reason: reason.trim(),
          guestName: guestName.trim(),
          guestEmail: guestEmail.trim(),
          guestPhone: guestPhone.trim(),
        })
      }

      setSuccess(true)
      // Redirect to My Appointments after short delay if logged in
      setTimeout(() => {
        router.push(user ? "/appointments" : "/")
      }, 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to book appointment.")
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
                    You will be redirected shortly.
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
                Review the details below and provide your information.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Doctor and Time Slot Info */}
                {loading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {host && (
                      <div className="space-y-2">
                        <Label>Provider</Label>
                        <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/50 p-3">
                          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <Stethoscope className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{host.name}</p>
                            <Badge variant="secondary" className="mt-1">{host.specialty}</Badge>
                          </div>
                        </div>
                      </div>
                    )}
                    {timeSlot && (
                      <div className="space-y-2">
                        <Label>Appointment Time</Label>
                        <div className="rounded-lg border border-border bg-muted/50 p-3">
                          <div className="flex items-center gap-2 text-foreground">
                            <Calendar className="h-4 w-4 text-primary" />
                            <span className="font-medium">{formatDateDisplay(timeSlot.date)}</span>
                          </div>
                          <div className="mt-1 flex items-center gap-2 text-muted-foreground">
                            <Clock className="h-4 w-4 text-primary" />
                            <span>{timeSlot.startLabel} - {timeSlot.endLabel}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Guest Info Form (for anonymous users) */}
                {!user && !loading && (
                  <div className="space-y-4 rounded-lg border border-border p-4">
                    <h3 className="text-sm font-medium">Your Information</h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="guestName">Full Name</Label>
                        <Input id="guestName" value={guestName} onChange={(e) => setGuestName(e.target.value)} placeholder="John Doe" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="guestEmail">Email</Label>
                        <Input id="guestEmail" type="email" value={guestEmail} onChange={(e) => setGuestEmail(e.target.value)} placeholder="john@example.com" required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="guestPhone">Phone Number (Optional)</Label>
                      <Input id="guestPhone" value={guestPhone} onChange={(e) => setGuestPhone(e.target.value)} placeholder="0912345678" />
                    </div>
                  </div>
                )}
                
                {/* Reason Textarea */}
                <div className="space-y-2">
                  <Label htmlFor="reason">Reason for Visit</Label>
                  <Textarea id="reason" placeholder="e.g., Annual check-up, specific symptom..." value={reason} onChange={(e) => setReason(e.target.value)} className="min-h-24 resize-none" required />
                </div>

                {error && <p className="text-sm text-destructive">{error}</p>}

                <div className="flex gap-3 pt-2">
                  <Button type="button" variant="outline" className="flex-1 bg-transparent" asChild>
                    <Link href={`/hosts/${hostId}`}>Cancel</Link>
                  </Button>
                  <Button type="submit" className="flex-1" disabled={submitting || loading || !reason.trim()}>
                    {submitting ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Booking...</>) : "Confirm Booking"}
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
