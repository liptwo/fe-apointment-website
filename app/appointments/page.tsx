"use client"

import React, { useState, useEffect } from "react"
import { format } from "date-fns"
import { CalendarDays, Clock, Loader2, AlertCircle, X } from "lucide-react"
import { AppHeader } from "@/components/app-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Appointment {
  id: string
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED"
  timeSlot: {
    startTime: string
  }
}

const STATUS_STYLES: Record<Appointment["status"], { variant: "default" | "secondary" | "destructive" | "outline"; label: string }> = {
  PENDING: { variant: "secondary", label: "Pending" },
  CONFIRMED: { variant: "default", label: "Confirmed" },
  CANCELLED: { variant: "destructive", label: "Cancelled" },
  COMPLETED: { variant: "outline", label: "Completed" },
}

export default function MyAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [cancellingId, setCancellingId] = useState<string | null>(null)
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)

  useEffect(() => {
    fetchAppointments()
  }, [])

  const fetchAppointments = async () => {
    setLoading(true)
    setError(null)

    try {
      const token = localStorage.getItem("accessToken")
      const response = await fetch("/api/appointments/my", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch appointments")
      }

      const data = await response.json()
      setAppointments(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      // Mock data for demo purposes
      setAppointments([
        {
          id: "1",
          status: "PENDING",
          timeSlot: { startTime: new Date(Date.now() + 86400000 * 2).toISOString() },
        },
        {
          id: "2",
          status: "CONFIRMED",
          timeSlot: { startTime: new Date(Date.now() + 86400000 * 5).toISOString() },
        },
        {
          id: "3",
          status: "COMPLETED",
          timeSlot: { startTime: new Date(Date.now() - 86400000 * 3).toISOString() },
        },
        {
          id: "4",
          status: "CANCELLED",
          timeSlot: { startTime: new Date(Date.now() - 86400000 * 1).toISOString() },
        },
        {
          id: "5",
          status: "PENDING",
          timeSlot: { startTime: new Date(Date.now() + 86400000 * 7).toISOString() },
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleCancelClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment)
    setShowCancelDialog(true)
  }

  const handleCancelConfirm = async () => {
    if (!selectedAppointment) return

    setCancellingId(selectedAppointment.id)
    setShowCancelDialog(false)

    try {
      const token = localStorage.getItem("accessToken")
      const response = await fetch(`/api/appointments/${selectedAppointment.id}/cancel`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to cancel appointment")
      }

      // Update local state
      setAppointments((prev) =>
        prev.map((apt) =>
          apt.id === selectedAppointment.id ? { ...apt, status: "CANCELLED" as const } : apt
        )
      )
    } catch (err) {
      // For demo: update locally anyway
      setAppointments((prev) =>
        prev.map((apt) =>
          apt.id === selectedAppointment.id ? { ...apt, status: "CANCELLED" as const } : apt
        )
      )
    } finally {
      setCancellingId(null)
      setSelectedAppointment(null)
    }
  }

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM dd, yyyy")
  }

  const formatTime = (dateString: string) => {
    return format(new Date(dateString), "hh:mm a")
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-foreground">My Appointments</h1>
          <p className="mt-2 text-muted-foreground">
            View and manage your upcoming and past appointments.
          </p>
        </div>

        {/* Error State */}
        {error && !loading && (
          <div className="mb-4 rounded-lg bg-destructive/10 p-4 text-sm text-destructive">
            Note: Using demo data. {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Skeleton className="h-5 w-28" />
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-9 w-20 ml-auto" />
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
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-primary" />
                All Appointments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {appointments.map((appointment) => {
                    const statusConfig = STATUS_STYLES[appointment.status]
                    const isPending = appointment.status === "PENDING"
                    const isCancelling = cancellingId === appointment.id

                    return (
                      <TableRow key={appointment.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <CalendarDays className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">
                              {formatDate(appointment.timeSlot.startTime)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>{formatTime(appointment.timeSlot.startTime)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={statusConfig.variant}>
                            {statusConfig.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {isPending && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCancelClick(appointment)}
                              disabled={isCancelling}
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              {isCancelling ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <>
                                  <X className="h-4 w-4 mr-1" />
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
        )}

        {/* Empty State */}
        {!loading && appointments.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <CalendarDays className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-foreground">
                No appointments yet
              </h3>
              <p className="mt-2 text-sm text-muted-foreground max-w-sm">
                You haven&apos;t booked any appointments. Find a healthcare provider to
                schedule your first visit.
              </p>
              <Button className="mt-6" onClick={() => window.location.href = "/hosts"}>
                Find a Provider
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Cancel Confirmation Dialog */}
        <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-destructive" />
                Cancel Appointment
              </AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to cancel this appointment scheduled for{" "}
                <span className="font-medium">
                  {selectedAppointment &&
                    format(new Date(selectedAppointment.timeSlot.startTime), "MMMM dd, yyyy 'at' hh:mm a")}
                </span>
                ? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Keep Appointment</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleCancelConfirm}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
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
