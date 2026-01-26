"use client"

import React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Heart, LogOut, Calendar, Clock, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AvailabilityRuleForm } from "@/components/availability-rule-form"
import { TimeslotGenerateForm } from "@/components/timeslot-generate-form"

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
              <Link href="/dashboard" className="text-muted-foreground hover:text-foreground">
                <Clock className="h-4 w-4 mr-2" />
                Availability
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/appointments" className="text-muted-foreground hover:text-foreground">
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

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Provider Dashboard
          </h1>
          <p className="mt-2 text-muted-foreground">
            Manage your availability and appointments
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Today&apos;s Appointments</p>
                <p className="text-2xl font-bold text-foreground">5</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                <Users className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Patients</p>
                <p className="text-2xl font-bold text-foreground">128</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Rules</p>
                <p className="text-2xl font-bold text-foreground">3</p>
              </div>
            </div>
          </div>
        </div>

        {/* Forms Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          <AvailabilityRuleForm />
          <TimeslotGenerateForm />
        </div>
      </main>
    </div>
  )
}
