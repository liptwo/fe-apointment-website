"use client"

import React, { useState, useEffect, useMemo } from "react"
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
  ChevronLeft,
  ChevronRight,
  UserCheck,
  BarChart,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { useAuth } from "@/providers/auth-provider"
import { getUsers, updateUserStatus } from "@/services/user.service"
import { User, PaginationMeta } from "@/types"

// Constants
const ROLE_STYLES: Record<
  User["role"],
  { variant: "default" | "secondary" | "outline"; label: string }
> = {
  GUEST: { variant: "secondary", label: "Guest" },
  HOST: { variant: "default", label: "Host" },
  ADMIN: { variant: "outline", label: "Admin" },
}

const PAGE_LIMIT = 10

// --- Components ---

function AdminHeader() {
  const { logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/admin/dashboard" className="flex items-center gap-3">
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
              <Link href="/admin/dashboard" className="text-muted-foreground hover:text-foreground">
                <BarChart className="h-4 w-4 mr-2" />
                Dashboard
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/users" className="text-foreground bg-secondary">
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

// --- Main Page Component ---

export default function AdminUsersPage() {
  const { user: currentUser } = useAuth()
  const router = useRouter()

  const [users, setUsers] = useState<User[]>([])
  const [meta, setMeta] = useState<PaginationMeta | null>(null)
  const [page, setPage] = useState(1)
  const [roleFilter, setRoleFilter] = useState<User["role"] | "ALL">("ALL")
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [dialogState, setDialogState] = useState<{
    open: boolean
    user: User | null
    action: "enable" | "disable"
  }>({
    open: false,
    user: null,
    action: "disable",
  })

  // --- Data Fetching ---
  useEffect(() => {
    if (currentUser?.role === "ADMIN") {
      fetchUsers()
    }
  }, [page, roleFilter, currentUser])

  const fetchUsers = async () => {
    setLoading(true)
    setError(null)
    try {
      const role = roleFilter === "ALL" ? undefined : roleFilter
      const response = await getUsers({ page, limit: PAGE_LIMIT, role })
      setUsers(response.data)
      setMeta(response.meta)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred fetching users.")
      setUsers([]) // Clear users on error
    } finally {
      setLoading(false)
    }
  }

  // --- UI Handlers ---
  const openDialog = (user: User, action: "enable" | "disable") => {
    setDialogState({ open: true, user, action })
  }

  const closeDialog = () => {
    setDialogState({ open: false, user: null, action: "disable" })
  }

  const handleStatusUpdate = async () => {
    if (!dialogState.user) return

    const { user, action } = dialogState
    const newStatus = action === "enable"
    
    setActionLoading(user.id)
    closeDialog()

    try {
      await updateUserStatus(user.id, newStatus)
      // Refresh data for consistency
      fetchUsers()
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to ${action} user.`)
    } finally {
      setActionLoading(null)
    }
  }

  const handleRoleFilterChange = (value: string) => {
    setRoleFilter(value as User["role"] | "ALL")
    setPage(1) // Reset to first page on filter change
  }

  // --- Memoized Stats ---
  const stats = useMemo(() => {
    if (!meta) return { total: 0, active: 0, byRole: "0 Hosts / 0 Guests" }
    // Note: These stats are for the current page. For accurate total stats,
    // a separate API endpoint would be needed. Using total from pagination for now.
    const activeCount = users.filter((u) => u.is_active).length
    const hostCount = users.filter((u) => u.role === "HOST").length
    const guestCount = users.filter((u) => u.role === "GUEST").length
    return {
      total: meta.total,
      active: activeCount,
      byRole: `${hostCount} Hosts / ${guestCount} Guests (on this page)`,
    }
  }, [users, meta])
  if (!currentUser) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Shield className="h-8 w-8 text-primary" />
            User Management
          </h1>
          <p className="mt-2 text-muted-foreground">
            Manage system users, view roles, and update account status.
          </p>
        </div>
        
        {/* Stats Cards */}
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10"><Users className="h-5 w-5 text-primary" /></div>
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-2xl font-semibold text-foreground">{meta?.total ?? "..."}</p>
              </div>
            </CardContent>
          </Card>
           <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/20"><CheckCircle className="h-5 w-5 text-accent" /></div>
              <div>
                <p className="text-sm text-muted-foreground">Active Users</p>
                <p className="text-2xl font-semibold text-foreground">{stats.active}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary"><Users className="h-5 w-5 text-muted-foreground" /></div>
              <div>
                <p className="text-sm text-muted-foreground">{stats.byRole}</p>
                <p className="text-2xl font-semibold text-foreground">By Role</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {error && <div className="mb-4 rounded-lg bg-destructive/10 p-4 text-sm text-destructive">{error}</div>}
        
        {/* Table Section */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-medium">All Users</CardTitle>
            <div className="w-48">
              <Select value={roleFilter} onValueChange={handleRoleFilterChange}>
                <SelectTrigger id="role-filter">
                  <SelectValue placeholder="Filter by role..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Roles</SelectItem>
                  <SelectItem value="GUEST">Guest</SelectItem>
                  <SelectItem value="HOST">Host</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[...Array(PAGE_LIMIT)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.length > 0 ? users.map((user) => {
                      const roleConfig = ROLE_STYLES[user.role]
                      const isLoadingAction = actionLoading === user.id
                      const canChangeStatus = user.role !== "ADMIN"

                      return (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div className="font-medium text-foreground">{user.name}</div>
                            <div className="text-sm text-muted-foreground flex items-center gap-2"><Mail className="h-3 w-3" /> {user.email}</div>
                          </TableCell>
                          <TableCell><Badge variant={roleConfig.variant}>{roleConfig.label}</Badge></TableCell>
                          <TableCell>
                            {user.is_active ? (
                              <div className="flex items-center gap-1.5 text-green-600"><CheckCircle className="h-4 w-4" /> Active</div>
                            ) : (
                              <div className="flex items-center gap-1.5 text-muted-foreground"><XCircle className="h-4 w-4" /> Disabled</div>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            {canChangeStatus && (
                              isLoadingAction ? (
                                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground ml-auto" />
                              ) : (
                                user.is_active ? (
                                  <Button variant="ghost" size="sm" onClick={() => openDialog(user, "disable")} className="text-destructive hover:text-destructive"><UserX className="h-4 w-4 mr-1" />Disable</Button>
                                ) : (
                                  <Button variant="ghost" size="sm" onClick={() => openDialog(user, "enable")} className="text-green-600 hover:text-green-600"><UserCheck className="h-4 w-4 mr-1" />Enable</Button>
                                )
                              )
                            )}
                          </TableCell>
                        </TableRow>
                      )
                    }) : (
                      <TableRow><TableCell colSpan={4} className="h-24 text-center">No users found for the selected filter.</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
                {/* Pagination Controls */}
                {meta && meta.totalPages > 1 && (
                  <div className="flex items-center justify-between pt-4">
                    <span className="text-sm text-muted-foreground">
                      Page {meta.page} of {meta.totalPages}
                    </span>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => setPage(p => p - 1)} disabled={page === 1}>
                        <ChevronLeft className="h-4 w-4" /> Previous
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setPage(p => p + 1)} disabled={page === meta.totalPages}>
                        Next <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Disable/Enable User Dialog */}
      <AlertDialog open={dialogState.open} onOpenChange={(open) => !open && closeDialog()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className={`flex items-center gap-2 ${dialogState.action === 'disable' ? 'text-destructive' : 'text-green-600'}`}>
              {dialogState.action === 'disable' ? <UserX className="h-5 w-5" /> : <UserCheck className="h-5 w-5" />}
              {dialogState.action === "disable" ? "Disable" : "Enable"} User Account
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to {dialogState.action} the account for{" "}
              <strong>{dialogState.user?.name}</strong> ({dialogState.user?.email})?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleStatusUpdate}
              className={dialogState.action === 'disable' ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : "bg-green-600 text-white hover:bg-green-700"}
            >
              {dialogState.action === "disable" ? "Confirm Disable" : "Confirm Enable"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
