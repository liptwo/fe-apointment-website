import {
  getMyAppointments,
  confirmAppointment,
  cancelAppointment,
} from "@/services/availability.service"
import "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import {
  Heart,
  LogOut,
  Calendar,
  Clock,
  Loader2,
  Check,
  X,
  User,
} from "lucide-react"
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
import { useState, useEffect } from "react"

interface Appointment {
  id: string
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED"
  patientName: string
  timeSlot: {
    startTime: string
  }
}

const STATUS_STYLES: Record<
  Appointment["status"],
  { variant: "default" | "secondary" | "destructive" | "outline"; label: string }
> = {
  PENDING: { variant: "secondary", label: "Pending" },
  CONFIRMED: { variant: "default", label: "Confirmed" },
  CANCELLED: { variant: "destructive", label: "Cancelled" },
  COMPLETED: { variant: "outline", label: "Completed" },
}

function DashboardHeader() {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("accessToken")
    router.push("/")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Heart className="h-4 w-4" />
            </div>
            <span className="text-lg font-semibold text-foreground">MediCare</span>
          </Link>

          <nav className="hidden sm:flex items-center gap-1">
            <Button variant="ghost" size="sm" asChild>
              <Link
                href="/dashboard"
                className="text-muted-foreground hover:text-foreground"
              >
                <Clock className="h-4 w-4 mr-2" />
                Availability
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link
                href="/dashboard/appointments"
                className="text-foreground bg-secondary"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Appointments
              </Link>
            </Button>
          </nav>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="text-muted-foreground hover:text-foreground"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign out
        </Button>
      </div>
    </header>
  )
}

export default function HostAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [dialogState, setDialogState] = useState<{
    open: boolean
    type: "confirm" | "cancel"
    appointment: Appointment | null
  }>({
    open: false,
    type: "confirm",
    appointment: null,
  })

  useEffect(() => {
    fetchAppointments()
  }, [])

  const fetchAppointments = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getMyAppointments()
      setAppointments(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      setAppointments([]) // Clear data on error
    } finally {
      setLoading(false)
    }
  }

  const openDialog = (type: "confirm" | "cancel", appointment: Appointment) => {
    setDialogState({ open: true, type, appointment })
  }

  const closeDialog = () => {
    setDialogState({ open: false, type: "confirm", appointment: null })
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
          apt.id === appointmentId ? { ...apt, status: "CONFIRMED" as const } : apt
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
    closeDialog()

    try {
      await cancelAppointment(appointmentId)
      setAppointments((prev) =>
        prev.map((apt) =>
          apt.id === appointmentId ? { ...apt, status: "CANCELLED" as const } : apt
        )
      )
    } catch (err) {
      // Handle error notification if needed
    } finally {
      setActionLoading(null)
    }
  }

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM dd, yyyy")
  }

  const formatTime = (dateString: string) => {
    return format(new Date(dateString), "hh:mm a")
  }

  const pendingCount = appointments.filter((a) => a.status === "PENDING").length

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Appointment Management
          </h1>
          <p className="mt-2 text-muted-foreground">
            Review and manage patient appointment requests.
          </p>
        </div>

        {/* Summary Card */}
        {!loading && (
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                <Calendar className="h-4 w-4 text-primary" />
              </div>
              <div>
                <span className="text-sm text-muted-foreground">
                  Pending Requests:{" "}
                </span>
                <span className="font-semibold text-foreground">
                  {pendingCount}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="mb-4 rounded-lg bg-destructive/10 p-4 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-5 w-28" />
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-9 w-32 ml-auto" />
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
                <Calendar className="h-5 w-5 text-primary" />
                All Appointments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {appointments.map((appointment) => {
                    const statusConfig = STATUS_STYLES[appointment.status]
                    const isPending = appointment.status === "PENDING"
                    const isLoading = actionLoading === appointment.id

                    return (
                      <TableRow key={appointment.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                              <User className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <span className="font-medium">
                              {appointment.patientName}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>
                              {formatDate(appointment.timeSlot.startTime)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
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
                        <TableCell className="text-right">
                          {isPending && (
                            <div className="flex items-center justify-end gap-2">
                              {isLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                              ) : (
                                <>
                                  <Button
                                    variant="default"
                                    size="sm"
                                    onClick={() =>
                                      openDialog("confirm", appointment)
                                    }
                                    className="bg-primary hover:bg-primary/90"
                                  >
                                    <Check className="h-4 w-4 mr-1" />
                                    Confirm
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      openDialog("cancel", appointment)
                                    }
                                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                  >
                                    <X className="h-4 w-4 mr-1" />
                                    Cancel
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
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <Calendar className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-foreground">
                No appointments yet
              </h3>
              <p className="mt-2 text-sm text-muted-foreground max-w-sm">
                You don&apos;t have any appointment requests. Make sure your
                availability rules and time slots are set up.
              </p>
              <Button
                className="mt-6"
                onClick={() => (window.location.href = "/dashboard")}
              >
                Set Up Availability
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Confirm Dialog */}
        <AlertDialog
          open={dialogState.open && dialogState.type === "confirm"}
          onOpenChange={(open) => !open && closeDialog()}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <Check className="h-5 w-5 text-primary" />
                Confirm Appointment
              </AlertDialogTitle>
              <AlertDialogDescription>
                Confirm the appointment with{" "}
                <span className="font-medium">
                  {dialogState.appointment?.patientName}
                </span>{" "}
                scheduled for{" "}
                <span className="font-medium">
                  {dialogState.appointment &&
                    format(
                      new Date(dialogState.appointment.timeSlot.startTime),
                      "MMMM dd, yyyy 'at' hh:mm a"
                    )}
                </span>
                ? The patient will be notified.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirm}>
                Confirm Appointment
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Cancel Dialog */}
        <AlertDialog
          open={dialogState.open && dialogState.type === "cancel"}
          onOpenChange={(open) => !open && closeDialog()}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <X className="h-5 w-5 text-destructive" />
                Cancel Appointment
              </AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to cancel the appointment with{" "}
                <span className="font-medium">
                  {dialogState.appointment?.patientName}
                </span>{" "}
                scheduled for{" "}
                <span className="font-medium">
                  {dialogState.appointment &&
                    format(
                      new Date(dialogState.appointment.timeSlot.startTime),
                      "MMMM dd, yyyy 'at' hh:mm a"
                    )}
                </span>
                ? The patient will be notified.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Keep Appointment</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleCancel}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
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
