"use client"

import React, { useState, useEffect, useCallback } from "react"
import { Search, Filter, Loader2 } from "lucide-react"
import { AppHeader } from "@/components/app-header"
import { HostCard, type Host } from "@/components/host-card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"
import { getHosts } from "@/services/host.service"

const SPECIALTIES = [
  "All Specialties",
  "General Practice",
  "Cardiology",
  "Dermatology",
  "Neurology",
  "Orthopedics",
  "Pediatrics",
  "Psychiatry",
  "Radiology",
  "Dentist",
]

export default function HostsPage() {
  const [hosts, setHosts] = useState<Host[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchName, setSearchName] = useState("")
  const [specialty, setSpecialty] = useState("All Specialties")
  const [debouncedSearch, setDebouncedSearch] = useState("")

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchName)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchName])

  const fetchHosts = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      // Handle 'All Specialties' case
      const specialtyToFetch =
        specialty === "All Specialties" ? undefined : specialty
      const response = await getHosts(specialtyToFetch)
      setHosts(response.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      setHosts([]) // Clear hosts on error
    } finally {
      setLoading(false)
    }
  }, [specialty])

  useEffect(() => {
    fetchHosts()
  }, [fetchHosts])

  // Filter hosts by name on the client-side
  const filteredHosts = hosts.filter((host) =>
    host.name.toLowerCase().includes(debouncedSearch.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-foreground">
            Find a Healthcare Provider
          </h1>
          <p className="mt-2 text-muted-foreground">
            Browse our network of qualified medical professionals and book your
            appointment.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by name..."
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="relative sm:w-64">
            <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground z-10 pointer-events-none" />
            <Select value={specialty} onValueChange={setSpecialty}>
              <SelectTrigger className="pl-10">
                <SelectValue placeholder="Filter by specialty" />
              </SelectTrigger>
              <SelectContent>
                {SPECIALTIES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results Count */}
        {!loading && (
          <p className="mb-4 text-sm text-muted-foreground">
            {filteredHosts.length} provider{filteredHosts.length !== 1 ? "s" : ""}{" "}
            found
          </p>
        )}

        {/* Loading State */}
        {loading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="mt-2 h-5 w-20" />
                    </div>
                  </div>
                  <Skeleton className="mt-4 h-16 w-full" />
                </CardContent>
                <div className="p-6 pt-0">
                  <Skeleton className="h-10 w-full" />
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="mb-4 rounded-lg bg-destructive/10 p-4 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Host Cards Grid */}
        {!loading && filteredHosts.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredHosts.map((host) => (
              <HostCard key={host.id} host={host} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredHosts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-foreground">
              No providers found
            </h3>
            <p className="mt-2 text-sm text-muted-foreground max-w-sm">
              Try adjusting your search or filter criteria to find healthcare
              providers.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
