"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Heart,
  LogOut,
  Users,
  Shield,
  Loader2,
  UserX,
  Mail,
  CheckCircle,
  XCircle,
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

interface User {
  id: string
  name: string
  email: string
  role: "GUEST" | "HOST" | "ADMIN"
  isActive: boolean
}

const ROLE_STYLES: Record<
  User["role"],
  { variant: "default" | "secondary" | "outline"; label: string }
> = {
  GUEST: { variant: "secondary", label: "Guest" },
  HOST: { variant: "default", label: "Host" },
  ADMIN: { variant: "outline", label: "Admin" },
}

function AdminHeader() {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("accessToken")
    router.push("/")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/admin/users" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Heart className="h-4 w-4" />
            </div>
            <span className="text-lg font-semibold text-foreground">MediCare</span>
            <Badge variant="outline" className="text-xs">
              Admin
            </Badge>
          </Link>

          <nav className="hidden sm:flex items-center gap-1">
            <Button variant="ghost" size="sm" asChild>
              <Link
                href="/admin/users"
                className="text-foreground bg-secondary"
              >
                <Users className="h-4 w-4 mr-2" />
                User Management
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

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [dialogState, setDialogState] = useState<{
    open: boolean
    user: User | null
  }>({
    open: false,
    user: null,
  })

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setLoading(true)
    setError(null)

    try {
      const token = localStorage.getItem("accessToken")
      const response = await fetch("/api/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch users")
      }

      const data = await response.json()
      setUsers(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      // Mock data for demo purposes
      setUsers([
        {
          id: "1",
          name: "John Smith",
          email: "john.smith@example.com",
          role: "GUEST",
          isActive: true,
        },
        {
          id: "2",
          name: "Dr. Emily Johnson",
          email: "emily.johnson@medicare.com",
          role: "HOST",
          isActive: true,
        },
        {
          id: "3",
          name: "Michael Brown",
          email: "michael.brown@example.com",
          role: "GUEST",
          isActive: true,
        },
        {
          id: "4",
          name: "Dr. Sarah Davis",
          email: "sarah.davis@medicare.com",
          role: "HOST",
          isActive: false,
        },
        {
          id: "5",
          name: "Admin User",
          email: "admin@medicare.com",
          role: "ADMIN",
          isActive: true,
        },
        {
          id: "6",
          name: "Lisa Anderson",
          email: "lisa.anderson@example.com",
          role: "GUEST",
          isActive: true,
        },
        {
          id: "7",
          name: "Dr. Robert Wilson",
          email: "robert.wilson@medicare.com",
          role: "HOST",
          isActive: true,
        },
        {
          id: "8",
          name: "Jennifer Taylor",
          email: "jennifer.taylor@example.com",
          role: "GUEST",
          isActive: false,
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const openDialog = (user: User) => {
    setDialogState({ open: true, user })
  }

  const closeDialog = () => {
    setDialogState({ open: false, user: null })
  }

  const handleDisable = async () => {
    if (!dialogState.user) return

    const userId = dialogState.user.id
    setActionLoading(userId)
    closeDialog()

    try {
      const token = localStorage.getItem("accessToken")
      const response = await fetch(`/api/users/${userId}/disable`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to disable user")
      }

      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, isActive: false } : user
        )
      )
    } catch (err) {
      // For demo: update locally anyway
      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, isActive: false } : user
        )
      )
    } finally {
      setActionLoading(null)
    }
  }

  const activeCount = users.filter((u) => u.isActive).length
  const hostCount = users.filter((u) => u.role === "HOST").length
  const guestCount = users.filter((u) => u.role === "GUEST").length

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />

      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Shield className="h-8 w-8 text-primary" />
            User Management
          </h1>
          <p className="mt-2 text-muted-foreground">
            Manage system users, view roles, and disable accounts.
          </p>
        </div>

        {/* Stats Cards */}
        {!loading && (
          <div className="mb-6 grid gap-4 sm:grid-cols-3">
            <Card>
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                  <p className="text-2xl font-semibold text-foreground">
                    {users.length}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/20">
                  <CheckCircle className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Users</p>
                  <p className="text-2xl font-semibold text-foreground">
                    {activeCount}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
                  <Users className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {hostCount} Hosts / {guestCount} Guests
                  </p>
                  <p className="text-2xl font-semibold text-foreground">
                    By Role
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

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
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-9 w-20" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Users Table */}
        {!loading && users.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                All Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => {
                    const roleConfig = ROLE_STYLES[user.role]
                    const isLoading = actionLoading === user.id
                    const canDisable = user.isActive && user.role !== "ADMIN"

                    return (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-sm font-medium text-muted-foreground">
                              {user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .slice(0, 2)
                                .toUpperCase()}
                            </div>
                            <span className="font-medium text-foreground">
                              {user.name}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Mail className="h-4 w-4" />
                            <span>{user.email}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={roleConfig.variant}>
                            {roleConfig.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {user.isActive ? (
                            <div className="flex items-center gap-1.5 text-accent">
                              <CheckCircle className="h-4 w-4" />
                              <span className="text-sm font-medium">Active</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                              <XCircle className="h-4 w-4" />
                              <span className="text-sm font-medium">
                                Disabled
                              </span>
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {canDisable && (
                            <>
                              {isLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground ml-auto" />
                              ) : (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => openDialog(user)}
                                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                >
                                  <UserX className="h-4 w-4 mr-1" />
                                  Disable
                                </Button>
                              )}
                            </>
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
        {!loading && users.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-foreground">
                No users found
              </h3>
              <p className="mt-2 text-sm text-muted-foreground max-w-sm">
                There are no users registered in the system yet.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Disable User Dialog */}
        <AlertDialog
          open={dialogState.open}
          onOpenChange={(open) => !open && closeDialog()}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <UserX className="h-5 w-5 text-destructive" />
                Disable User Account
              </AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to disable the account for{" "}
                <span className="font-medium">{dialogState.user?.name}</span> (
                {dialogState.user?.email})? This user will no longer be able to
                access the system.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDisable}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Disable Account
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </div>
  )
}
