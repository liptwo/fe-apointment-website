'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Loader2, AlertCircle, CheckCircle2, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  createAvailabilityRule,
  updateAvailabilityRule
} from '@/services/availability.service'

const DAYS_OF_WEEK = [
  { value: 'MON', label: 'Mon' },
  { value: 'TUE', label: 'Tue' },
  { value: 'WED', label: 'Wed' },
  { value: 'THU', label: 'Thu' },
  { value: 'FRI', label: 'Fri' },
  { value: 'SAT', label: 'Sat' },
  { value: 'SUN', label: 'Sun' }
]

const HOURS = Array.from({ length: 24 }, (_, i) => ({
  value: i.toString(),
  label: i.toString().padStart(2, '0') + ':00'
}))

interface AvailabilityRuleFormProps {
  onSuccess: () => void
  onCancel: () => void
  initialData?: any | null
}

export function AvailabilityRuleForm({
  onSuccess,
  onCancel,
  initialData
}: AvailabilityRuleFormProps) {
  const [selectedDays, setSelectedDays] = useState<string[]>([])
  const [startHour, setStartHour] = useState<string>('')
  const [endHour, setEndHour] = useState<string>('')
  const [isActive, setIsActive] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const isEditMode = Boolean(initialData)

  useEffect(() => {
    if (initialData) {
      setSelectedDays(initialData.days_of_week?.split(',') || [])
      setStartHour(initialData.start_hour?.toString() || '')
      setEndHour(initialData.end_hour?.toString() || '')
      setIsActive(initialData.is_active)
    } else {
      // Reset form when switching to create mode
      setSelectedDays([])
      setStartHour('')
      setEndHour('')
      setIsActive(true)
    }
    // Clear status messages when form mode changes
    setError(null)
    setSuccess(false)
  }, [initialData])

  const toggleDay = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    if (selectedDays.length === 0) {
      setError('Please select at least one day')
      return
    }

    if (!startHour || !endHour) {
      setError('Please select start and end hours')
      return
    }

    if (Number(startHour) >= Number(endHour)) {
      setError('End hour must be after start hour')
      return
    }

    setIsLoading(true)
    const payload = {
      ruleType: 'WEEKLY',
      startHour: Number(startHour),
      endHour: Number(endHour),
      daysOfWeek: selectedDays.join(','),
      isActive
    }

    try {
      if (isEditMode) {
        await updateAvailabilityRule(initialData.id, payload)
      } else {
        await createAvailabilityRule(payload)
      }
      setSuccess(true)
      setTimeout(() => {
        onSuccess()
      }, 1000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className='w-full border shadow-sm'>
      <CardHeader className='pb-4'>
        <div className='flex items-center gap-3'>
          <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10'>
            <Clock className='h-5 w-5 text-primary' />
          </div>
          <div>
            <CardTitle className='text-xl font-semibold'>
              {isEditMode ? 'Edit Rule' : 'Create New Rule'}
            </CardTitle>
            <CardDescription>
              {isEditMode
                ? 'Update your availability schedule.'
                : 'Set your weekly availability schedule.'}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className='space-y-6'>
          {error && (
            <div className='flex items-center gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive'>
              <AlertCircle className='h-4 w-4 flex-shrink-0' />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className='flex items-center gap-2 rounded-md bg-accent/10 p-3 text-sm text-accent'>
              <CheckCircle2 className='h-4 w-4 flex-shrink-0' />
              <span>Rule saved successfully!</span>
            </div>
          )}

          <div className='space-y-3'>
            <Label>Days of Week</Label>
            <div className='flex flex-wrap gap-2'>
              {DAYS_OF_WEEK.map((day) => (
                <button
                  key={day.value}
                  type='button'
                  onClick={() => toggleDay(day.value)}
                  disabled={isLoading || success}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-all border',
                    selectedDays.includes(day.value)
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-card text-foreground border-border hover:border-primary/50 hover:bg-muted'
                  )}
                >
                  {day.label}
                </button>
              ))}
            </div>
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='startHour'>Start Hour</Label>
              <Select
                value={startHour}
                onValueChange={setStartHour}
                disabled={isLoading || success}
              >
                <SelectTrigger id='startHour'>
                  <SelectValue placeholder='Select start' />
                </SelectTrigger>
                <SelectContent>
                  {HOURS.map((hour) => (
                    <SelectItem key={hour.value} value={hour.value}>
                      {hour.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className='space-y-2'>
              <Label htmlFor='endHour'>End Hour</Label>
              <Select
                value={endHour}
                onValueChange={setEndHour}
                disabled={isLoading || success}
              >
                <SelectTrigger id='endHour'>
                  <SelectValue placeholder='Select end' />
                </SelectTrigger>
                <SelectContent>
                  {HOURS.map((hour) => (
                    <SelectItem key={hour.value} value={hour.value}>
                      {hour.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className='flex items-center justify-between rounded-lg border border-border p-4'>
            <div className='space-y-0.5'>
              <Label htmlFor='isActive' className='text-base font-medium'>
                Active
              </Label>
              <p className='text-sm text-muted-foreground'>
                Enable this availability rule
              </p>
            </div>
            <Switch
              id='isActive'
              checked={isActive}
              onCheckedChange={setIsActive}
              disabled={isLoading || success}
            />
          </div>

          <div className='flex flex-col sm:flex-row gap-2'>
            <Button
              type='button'
              variant='outline'
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type='submit'
              className='w-full flex-1 sm:w-auto'
              disabled={isLoading || success}
            >
              {isLoading ? (
                <>
                  <Loader2 className='h-4 w-4 animate-spin' /> Saving...
                </>
              ) : success ? (
                <>
                  <CheckCircle2 className='h-4 w-4' /> Saved
                </>
              ) : isEditMode ? (
                'Update Rule'
              ) : (
                'Create Rule'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
