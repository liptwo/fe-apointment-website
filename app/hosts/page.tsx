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
      const params = new URLSearchParams()
      if (debouncedSearch) params.append("name", debouncedSearch)
      if (specialty && specialty !== "All Specialties") {
        params.append("specialty", specialty)
      }

      const queryString = params.toString()
      const url = `/hosts${queryString ? `?${queryString}` : ""}`

      const response = await fetch(`/api${url}`)

      if (!response.ok) {
        throw new Error("Failed to fetch hosts")
      }

      const data = await response.json()
      setHosts(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      // Mock data for demo purposes
      setHosts([
        {
          id: "1",
          name: "Dr. Sarah Johnson",
          specialty: "Cardiology",
          description:
            "Board-certified cardiologist with over 15 years of experience in treating heart conditions. Specializes in preventive cardiology and heart failure management.",
        },
        {
          id: "2",
          name: "Dr. Michael Chen",
          specialty: "Dermatology",
          description:
            "Expert dermatologist specializing in skin cancer detection, acne treatment, and cosmetic dermatology. Uses the latest technologies for accurate diagnosis.",
        },
        {
          id: "3",
          name: "Dr. Emily Rodriguez",
          specialty: "Pediatrics",
          description:
            "Caring pediatrician dedicated to children's health from infancy through adolescence. Focuses on developmental milestones and preventive care.",
        },
        {
          id: "4",
          name: "Dr. James Wilson",
          specialty: "Orthopedics",
          description:
            "Orthopedic surgeon specializing in sports medicine and joint replacement. Helps patients return to active lifestyles through minimally invasive procedures.",
        },
        {
          id: "5",
          name: "Dr. Lisa Park",
          specialty: "Neurology",
          description:
            "Neurologist with expertise in headache disorders, epilepsy, and neurodegenerative diseases. Committed to improving quality of life for patients.",
        },
        {
          id: "6",
          name: "Dr. Robert Taylor",
          specialty: "General Practice",
          description:
            "Family medicine physician providing comprehensive care for patients of all ages. Emphasizes preventive medicine and chronic disease management.",
        },
      ])
    } finally {
      setLoading(false)
    }
  }, [debouncedSearch, specialty])

  useEffect(() => {
    fetchHosts()
  }, [fetchHosts])

  // Filter hosts based on search and specialty (client-side filtering for demo)
  const filteredHosts = hosts.filter((host) => {
    const matchesName = host.name
      .toLowerCase()
      .includes(debouncedSearch.toLowerCase())
    const matchesSpecialty =
      specialty === "All Specialties" || host.specialty === specialty
    return matchesName && matchesSpecialty
  })

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
            Note: Using demo data. {error}
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
