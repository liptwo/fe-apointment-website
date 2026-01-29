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
  BarChart,
  Check,
  X,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

import { useAuth } from "@/providers/auth-provider"
import { getAppointmentStats } from "@/services/report.service"

interface Stats {
  total: number
  confirmed: number
  canceled: number
}

function AdminDashboardHeader() {
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
              <Link href="/admin/dashboard" className="text-foreground bg-secondary">
                <BarChart className="h-4 w-4 mr-2" />
                Bảng Điều Khiển
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/users" className="text-muted-foreground hover:text-foreground">
                <Users className="h-4 w-4 mr-2" />
                Quản Lý Người Dùng
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
          Đăng Xuất
        </Button>
      </div>
    </header>
  )
}

export default function AdminDashboardPage() {
  const { user: currentUser } = useAuth()
  const router = useRouter()

  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Data Fetching
  useEffect(() => {
    if (currentUser?.role === "ADMIN") {
      getAppointmentStats()
        .then(setStats)
        .catch((err) =>
          setError(
            err instanceof Error
              ? err.message
              : "An error occurred fetching stats."
          )
        )
        .finally(() => setLoading(false))
    }
  }, [currentUser])

  if (!currentUser) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminDashboardHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Shield className="h-8 w-8 text-primary" />
            Bảng Điều Khiển Quản Trị
          </h1>
          <p className="mt-2 text-muted-foreground">
            Tổng quan về thống kê lịch hẹn.
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-destructive/10 p-4 text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loading || !stats ? (
            [...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-6 w-6 rounded-full" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16" />
                </CardContent>
              </Card>
            ))
          ) : (
            <>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Tổng Lịch Hẹn
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.total}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Đã Xác Nhận
                  </CardTitle>
                  <Check className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.confirmed}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Đã Hủy
                  </CardTitle>
                  <X className="h-4 w-4 text-destructive" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.canceled}</div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </main>
    </div>
  )
}

