"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2, AlertCircle, CheckCircle2, Zap, Calendar } from "lucide-react"

interface AvailabilityRule {
  id: string
  daysOfWeek: string
  startHour: number
  endHour: number
  isActive: boolean
}

const SLOT_DURATIONS = [
  { value: "15", label: "15 minutes" },
  { value: "30", label: "30 minutes" },
  { value: "60", label: "60 minutes" },
]

// Demo rules for preview
const DEMO_RULES: AvailabilityRule[] = [
  { id: "rule-1", daysOfWeek: "MON,TUE,WED", startHour: 9, endHour: 17, isActive: true },
  { id: "rule-2", daysOfWeek: "THU,FRI", startHour: 10, endHour: 18, isActive: true },
  { id: "rule-3", daysOfWeek: "SAT", startHour: 9, endHour: 13, isActive: false },
]

interface TimeslotGenerateFormProps {
  onSuccess?: () => void
}

export function TimeslotGenerateForm({ onSuccess }: TimeslotGenerateFormProps) {
  const [rules, setRules] = useState<AvailabilityRule[]>([])
  const [selectedRuleId, setSelectedRuleId] = useState<string>("")
  const [slotDuration, setSlotDuration] = useState<string>("")
  const [fromDate, setFromDate] = useState<string>("")
  const [toDate, setToDate] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [isFetchingRules, setIsFetchingRules] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [generatedCount, setGeneratedCount] = useState<number | null>(null)

  // Fetch available rules on mount
  useEffect(() => {
    const fetchRules = async () => {
      setIsFetchingRules(true)
      try {
        const response = await fetch("/api/availability-rules", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          setRules(data)
        } else {
          // Use demo data for preview
          setRules(DEMO_RULES)
        }
      } catch {
        // Use demo data for preview
        setRules(DEMO_RULES)
      } finally {
        setIsFetchingRules(false)
      }
    }

    fetchRules()
  }, [])

  // Set default dates (today to next week)
  useEffect(() => {
    const today = new Date()
    const nextWeek = new Date()
    nextWeek.setDate(today.getDate() + 7)

    setFromDate(today.toISOString().split("T")[0])
    setToDate(nextWeek.toISOString().split("T")[0])
  }, [])

  const selectedRule = rules.find((r) => r.id === selectedRuleId)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setGeneratedCount(null)

    if (!selectedRuleId) {
      setError("Please select an availability rule")
      return
    }

    if (!slotDuration) {
      setError("Please select a slot duration")
      return
    }

    if (!fromDate || !toDate) {
      setError("Please select date range")
      return
    }

    if (new Date(fromDate) > new Date(toDate)) {
      setError("End date must be after start date")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/timeslots/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
          ruleId: selectedRuleId,
          slotDuration: Number(slotDuration),
          fromDate,
          toDate,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || "Failed to generate time slots")
      }

      const data = await response.json()
      setGeneratedCount(data.count || 0)
      setSuccess(true)

      // Reset form after delay
      setTimeout(() => {
        setSelectedRuleId("")
        setSlotDuration("")
        setSuccess(false)
        setGeneratedCount(null)
        onSuccess?.()
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const formatRuleLabel = (rule: AvailabilityRule) => {
    const days = rule.daysOfWeek.split(",").join(", ")
    const start = rule.startHour.toString().padStart(2, "0") + ":00"
    const end = rule.endHour.toString().padStart(2, "0") + ":00"
    return `${days} (${start} - ${end})`
  }

  return (
    <Card className="w-full border shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
            <Zap className="h-5 w-5 text-accent" />
          </div>
          <div>
            <CardTitle className="text-xl font-semibold">
              Generate Time Slots
            </CardTitle>
            <CardDescription>
              Create bookable time slots from your availability rules
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="flex items-center gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 rounded-md bg-accent/10 p-3 text-sm text-accent">
              <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
              <span>
                {generatedCount !== null
                  ? `Successfully generated ${generatedCount} time slots!`
                  : "Time slots generated successfully!"}
              </span>
            </div>
          )}

          {/* Select Rule */}
          <div className="space-y-2">
            <Label htmlFor="rule">Availability Rule</Label>
            <Select
              value={selectedRuleId}
              onValueChange={setSelectedRuleId}
              disabled={isLoading || success || isFetchingRules}
            >
              <SelectTrigger id="rule">
                <SelectValue placeholder={isFetchingRules ? "Loading rules..." : "Select a rule"} />
              </SelectTrigger>
              <SelectContent>
                {rules.filter((r) => r.isActive).map((rule) => (
                  <SelectItem key={rule.id} value={rule.id}>
                    {formatRuleLabel(rule)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {rules.filter((r) => r.isActive).length === 0 && !isFetchingRules && (
              <p className="text-xs text-muted-foreground">
                No active rules found. Create an availability rule first.
              </p>
            )}
          </div>

          {/* Selected Rule Preview */}
          {selectedRule && (
            <div className="rounded-lg bg-muted/50 p-3 space-y-1">
              <p className="text-sm font-medium text-foreground">Rule Details</p>
              <p className="text-sm text-muted-foreground">
                Days: <span className="font-medium text-foreground">{selectedRule.daysOfWeek.split(",").join(", ")}</span>
              </p>
              <p className="text-sm text-muted-foreground">
                Hours: <span className="font-medium text-foreground">
                  {selectedRule.startHour.toString().padStart(2, "0")}:00 - {selectedRule.endHour.toString().padStart(2, "0")}:00
                </span>
              </p>
            </div>
          )}

          {/* Slot Duration */}
          <div className="space-y-2">
            <Label htmlFor="duration">Slot Duration</Label>
            <Select
              value={slotDuration}
              onValueChange={setSlotDuration}
              disabled={isLoading || success}
            >
              <SelectTrigger id="duration">
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                {SLOT_DURATIONS.map((duration) => (
                  <SelectItem key={duration.value} value={duration.value}>
                    {duration.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fromDate">From Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="fromDate"
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  disabled={isLoading || success}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="toDate">To Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="toDate"
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  disabled={isLoading || success}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Estimated Slots Preview */}
          {selectedRule && slotDuration && fromDate && toDate && new Date(fromDate) <= new Date(toDate) && (
            <div className="rounded-lg border border-border bg-card p-4">
              <p className="text-sm text-muted-foreground">
                Estimated slots per day:{" "}
                <span className="font-semibold text-foreground">
                  {Math.floor((selectedRule.endHour - selectedRule.startHour) * 60 / Number(slotDuration))} slots
                </span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Based on {Number(slotDuration)}-minute intervals from {selectedRule.startHour.toString().padStart(2, "0")}:00 to {selectedRule.endHour.toString().padStart(2, "0")}:00
              </p>
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isLoading || success || isFetchingRules}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : success ? (
              <>
                <CheckCircle2 className="h-4 w-4" />
                Generated
              </>
            ) : (
              <>
                <Zap className="h-4 w-4" />
                Generate Time Slots
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
