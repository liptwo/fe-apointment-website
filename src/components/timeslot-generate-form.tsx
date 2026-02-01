'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/src/components/ui/button'
import { Label } from '@/src/components/ui/label'
import { Input } from '@/src/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/src/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/src/components/ui/select'
import { Loader2, AlertCircle, CheckCircle2, Zap, Calendar } from 'lucide-react'
import {
  generateTimeslots,
  getAvailabilityRules
} from '@/src/services/availability.service'
import { useAuth } from '@/src/providers/auth-provider'

interface AvailabilityRule {
  id: string
  days_of_week: string
  start_hour: number
  end_hour: number
  is_active: boolean
}

const SLOT_DURATIONS = [
  { value: '15', label: '15 phút' },
  { value: '30', label: '30 phút' },
  { value: '60', label: '60 phút' }
]

interface TimeslotGenerateFormProps {
  onSuccess?: () => void
}

export function TimeslotGenerateForm({ onSuccess }: TimeslotGenerateFormProps) {
  const { user } = useAuth()
  const [rules, setRules] = useState<AvailabilityRule[]>([])
  const [selectedRuleId, setSelectedRuleId] = useState<string>('')
  const [slotDuration, setSlotDuration] = useState<string>('')
  const [fromDate, setFromDate] = useState<string>('')
  const [toDate, setToDate] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [isFetchingRules, setIsFetchingRules] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [generatedCount, setGeneratedCount] = useState<number | null>(null)

  // Fetch available rules on mount
  useEffect(() => {
    const fetchRules = async () => {
      if (!user) return

      setIsFetchingRules(true)
      try {
        const data = await getAvailabilityRules(user.id)
        setRules(data)
      } catch (error) {
        setError('Không thể tải các quy tắc khả dụng.')
        setRules([]) // Clear any existing rules
      } finally {
        setIsFetchingRules(false)
      }
    }

    fetchRules()
  }, [user])

  // Set default dates (today to next week)
  useEffect(() => {
    const today = new Date()
    const nextWeek = new Date()
    nextWeek.setDate(today.getDate() + 7)

    setFromDate(today.toISOString().split('T')[0])
    setToDate(nextWeek.toISOString().split('T')[0])
  }, [])

  const selectedRule = rules.find((r) => r.id === selectedRuleId)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setGeneratedCount(null)

    if (!selectedRuleId) {
      setError('Vui lòng chọn quy tắc khả dụng')
      return
    }

    if (!slotDuration) {
      setError('Vui lòng chọn khoảng thời gian')
      return
    }

    if (!fromDate || !toDate) {
      setError('Vui lòng chọn khoảng ngày')
      return
    }

    if (new Date(fromDate) > new Date(toDate)) {
      setError('Ngày kết thúc phải sau ngày bắt đầu')
      return
    }

    setIsLoading(true)

    try {
      const response = await generateTimeslots({
        ruleId: selectedRuleId,
        slotDuration: Number(slotDuration),
        fromDate,
        toDate
      })
      setGeneratedCount(response.created)
      setSuccess(true)

      // Reset form after delay
      setTimeout(() => {
        setSelectedRuleId('')
        setSlotDuration('')
        setSuccess(false)
        setGeneratedCount(null)
        onSuccess?.()
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const formatRuleLabel = (rule: AvailabilityRule) => {
    const days = rule.days_of_week.split(',').join(', ')
    const start = rule.start_hour.toString().padStart(2, '0') + ':00'
    const end = rule.end_hour.toString().padStart(2, '0') + ':00'
    return `${days} (${start} - ${end})`
  }

  return (
    <Card className='w-full border shadow-sm'>
      <CardHeader className='pb-4'>
        <div className='flex items-center gap-3'>
          <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10'>
            <Zap className='h-5 w-5 text-accent' />
          </div>
          <div>
            <CardTitle className='text-xl font-semibold'>
              Tạo Khoảng Thời Gian
            </CardTitle>
            <CardDescription>
              Tạo các khoảng thời gian có thể đặt lịch từ các quy tắc khả dụng
              của bạn
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
              <span>
                {generatedCount !== null
                  ? `Tạo thành công ${generatedCount} khoảng thời gian!`
                  : 'Các khoảng thời gian đã được tạo thành công!'}
              </span>
            </div>
          )}

          {/* Select Rule */}
          <div className='space-y-2'>
            <Label htmlFor='rule'>Quy Tắc Khả Dụng</Label>
            <Select
              value={selectedRuleId}
              onValueChange={setSelectedRuleId}
              disabled={isLoading || success || isFetchingRules}
            >
              <SelectTrigger id='rule'>
                <SelectValue
                  placeholder={
                    isFetchingRules ? 'Đang tải quy tắc...' : 'Chọn một quy tắc'
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {rules
                  .filter((r) => r.is_active)
                  .map((rule) => (
                    <SelectItem key={rule.id} value={rule.id}>
                      {formatRuleLabel(rule)}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            {rules.filter((r) => r.is_active).length === 0 &&
              !isFetchingRules && (
                <p className='text-xs text-muted-foreground'>
                  Không tìm thấy quy tắc hoạt động. Tạo quy tắc khả dụng trước
                  tiên.
                </p>
              )}
          </div>

          {/* Selected Rule Preview */}
          {selectedRule && (
            <div className='rounded-lg bg-muted/50 p-3 space-y-1'>
              <p className='text-sm font-medium text-foreground'>
                Chi Tiết Quy Tắc
              </p>
              <p className='text-sm text-muted-foreground'>
                Ngày:{' '}
                <span className='font-medium text-foreground'>
                  {selectedRule.days_of_week.split(',').join(', ')}
                </span>
              </p>
              <p className='text-sm text-muted-foreground'>
                Giờ:{' '}
                <span className='font-medium text-foreground'>
                  {selectedRule.start_hour.toString().padStart(2, '0')}:00 -{' '}
                  {selectedRule.end_hour.toString().padStart(2, '0')}:00
                </span>
              </p>
            </div>
          )}

          {/* Slot Duration */}
          <div className='space-y-2'>
            <Label htmlFor='duration'>Khoảng Thời Gian</Label>
            <Select
              value={slotDuration}
              onValueChange={setSlotDuration}
              disabled={isLoading || success}
            >
              <SelectTrigger id='duration'>
                <SelectValue placeholder='Chọn khoảng thời gian' />
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
          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <Label htmlFor='fromDate'>Từ Ngày</Label>
              <div className='relative'>
                <Calendar className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none' />
                <Input
                  id='fromDate'
                  type='date'
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  disabled={isLoading || success}
                  className='pl-10'
                />
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='toDate'>Đến Ngày</Label>
              <div className='relative'>
                <Calendar className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none' />
                <Input
                  id='toDate'
                  type='date'
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  disabled={isLoading || success}
                  className='pl-10'
                />
              </div>
            </div>
          </div>

          {/* Estimated Slots Preview */}
          {selectedRule &&
            slotDuration &&
            fromDate &&
            toDate &&
            new Date(fromDate) <= new Date(toDate) && (
              <div className='rounded-lg border border-border bg-card p-4'>
                <p className='text-sm text-muted-foreground'>
                  Khoảng thời gian ước tính mỗi ngày:{' '}
                  <span className='font-semibold text-foreground'>
                    {Math.floor(
                      ((selectedRule.end_hour - selectedRule.start_hour) * 60) /
                        Number(slotDuration)
                    )}{' '}
                    khoảng
                  </span>
                </p>
                <p className='text-xs text-muted-foreground mt-1'>
                  Dựa trên các khoảng {Number(slotDuration)} phút từ{' '}
                  {selectedRule.start_hour.toString().padStart(2, '0')}:00 đến{' '}
                  {selectedRule.end_hour.toString().padStart(2, '0')}:00
                </p>
              </div>
            )}

          <Button
            type='submit'
            className='w-full'
            size='lg'
            disabled={isLoading || success || isFetchingRules}
          >
            {isLoading ? (
              <>
                <Loader2 className='h-4 w-4 animate-spin' />
                Đang tạo...
              </>
            ) : success ? (
              <>
                <CheckCircle2 className='h-4 w-4' />
                Đã tạo
              </>
            ) : (
              <>
                <Zap className='h-4 w-4' />
                Tạo Khoảng Thời Gian
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
