'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { format, addDays, isSameDay } from 'date-fns'
import { vi } from 'date-fns/locale'
import {
  ChevronRight,
  ChevronLeft,
  Loader2,
  CheckCircle,
  MapPin,
  User,
  Stethoscope,
  FileText,
  Calendar,
  Clock,
  BadgeCheck,
  Heart,
  Building2,
  UserIcon,
  UserPlus2Icon,
  Phone,
  PhoneCall,
  CakeIcon,
  LocateIcon,
  Locate,
  PinIcon,
  HeartHandshake,
  StethoscopeIcon,
  Wallet
} from 'lucide-react'
import { Button } from '@/src/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/src/components/ui/card'
import { Label } from '@/src/components/ui/label'
import { Textarea } from '@/src/components/ui/textarea'
import { Skeleton } from '@/src/components/ui/skeleton'
import { cn } from '@/src/lib/utils'
import { DEMO_DOCTORS, HOST_SPECIALTIES } from '@/src/utils/constants'
import { DialogSpecialties } from '@/src/components/diaglog-specials'
import { Birthstone } from 'next/font/google'

// Types
interface Specialty {
  id: string
  name: string
  icon?: string
}

interface Service {
  id: string
  name: string
  price: number
  serviceType: string
}

interface Doctor {
  id: string
  name: string
  title?: string
  specialty: string
  imageUrl?: string
  description: string
  price: number
  schedule: string
  clinicName: string
  clinicAddress: string
}

interface TimeSlot {
  id: string
  startTime: string
  endTime: string
  isAvailable: boolean
}

interface Shift {
  id: string
  name: string
  slots: TimeSlot[]
}

interface Clinic {
  id: string
  name: string
  address: string
  verified: boolean
}

// Demo data
const DEMO_CLINIC: Clinic = {
  id: 'clinic-1',
  name: 'Phòng khám Đa khoa Thuận Mỹ Sài Gòn',
  address: '4A Hoàng Việt, Phường Tân Sơn Nhất, TP. HCM',
  verified: true
}

// const HOSTS_SPECIALTIES: Specialty[] = [
//   { id: 'noi-tiet', name: 'Nội Tiết' },
//   { id: 'co-xuong-khop', name: 'Cơ Xương Khớp' },
//   { id: 'tim-mach', name: 'Tim Mạch' },
//   { id: 'da-lieu', name: 'Da Liễu' },
//   { id: 'than-kinh', name: 'Thần Kinh' },
//   { id: 'nhi-khoa', name: 'Nhi Khoa' },
//   { id: 'san-phu-khoa', name: 'Sản Phụ Khoa' },
//   { id: 'mat', name: 'Mắt' }
// ]

const DEMO_SERVICES: Service[] = [
  {
    id: 'kham-co-bhyt',
    name: 'Khám có BHYT',
    price: 0,
    serviceType: 'standard'
  },
  {
    id: 'kham-dich-vu',
    name: 'Khám dịch vụ',
    price: 150000,
    serviceType: 'vip'
  }
]

const DEMO_SHIFTS: Shift[] = [
  {
    id: 'morning',
    name: 'Buổi sáng',
    slots: [
      { id: 's1', startTime: '07:00', endTime: '08:00', isAvailable: true },
      { id: 's2', startTime: '08:00', endTime: '09:00', isAvailable: true },
      { id: 's3', startTime: '09:00', endTime: '10:00', isAvailable: true },
      { id: 's4', startTime: '10:00', endTime: '11:00', isAvailable: false },
      { id: 's5', startTime: '11:00', endTime: '11:30', isAvailable: true }
    ]
  },
  {
    id: 'afternoon',
    name: 'Buổi chiều',
    slots: [
      { id: 's6', startTime: '12:30', endTime: '13:30', isAvailable: true },
      { id: 's7', startTime: '13:30', endTime: '14:30', isAvailable: true },
      { id: 's8', startTime: '14:30', endTime: '15:30', isAvailable: true },
      { id: 's9', startTime: '15:30', endTime: '16:00', isAvailable: false },
      { id: 's10', startTime: '16:00', endTime: '16:30', isAvailable: true },
      { id: 's11', startTime: '16:30', endTime: '17:00', isAvailable: true },
      { id: 's12', startTime: '17:00', endTime: '17:30', isAvailable: true },
      { id: 's13', startTime: '17:30', endTime: '18:00', isAvailable: true },
      { id: 's14', startTime: '18:00', endTime: '18:30', isAvailable: true },
      { id: 's15', startTime: '18:30', endTime: '19:00', isAvailable: true },
      { id: 's16', startTime: '19:00', endTime: '19:30', isAvailable: true }
    ]
  }
]

// Stepper steps
const STEPS = [
  { id: 1, icon: Stethoscope, label: 'Chuyên khoa' },
  { id: 2, icon: User, label: 'Bác sĩ' },
  { id: 3, icon: Calendar, label: 'Thời gian' },
  { id: 4, icon: FileText, label: 'Xác nhận' }
]

export default function UnifiedBookingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [addNewPatient, setAddNewPatient] = useState(false)
  // Get params from URL (for booking by doctor flow)
  const doctorIdParam = searchParams.get('doctorId')
  const specialtyParam = searchParams.get('specialty')

  // State
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [dropDown, setDropDown] = useState(false)
  const [addForMe, setAddForMe] = useState(true)
  const [payment, setPayment] = useState('momo')
  // const [userName, setUserName] = useState('Thanh Phong')
  const [isSaved, setIsSaved] = useState(false)
  // const [selectedSpecialty, setSelectedSpecialty] = useState<Specialty | null>(
  //   null
  // )
  // Form data
  const [clinic] = useState<Clinic>(DEMO_CLINIC)
  const [specialties, setSpecialties] = useState<Specialty[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [shifts, setShifts] = useState<Shift[]>([])
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    dateOfBirth: '',
    gender: '',
    phone: '',
    cccd: '',
    ethnic: '',
    address: '',
    city: '',
    country: ''
  })
  // Selected values
  const [selectedSpecialty, setSelectedSpecialty] = useState<Specialty | null>(
    null
  )
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null)
  const [reason, setReason] = useState('')
  const [selectedPatient, setSelectedPatient] = useState<number | null>(null)

  // add new patient
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
    setIsSaved(false)
  }

  const handleSave = () => {
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 3000)
  }
  // Date selection
  const [weekStartDate, setWeekStartDate] = useState<Date>(new Date())
  const weekDays = [
    addDays(weekStartDate, 0),
    addDays(weekStartDate, 1),
    addDays(weekStartDate, 2)
  ]

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        // In real app, fetch from API
        // const response = await fetch('/api/specialties')
        setSpecialties(HOST_SPECIALTIES)
        setServices(DEMO_SERVICES)
        setDoctors(DEMO_DOCTORS as unknown as Doctor[])
        setShifts(DEMO_SHIFTS)

        // If coming from doctor booking flow
        if (doctorIdParam) {
          const doctor = DEMO_DOCTORS.find((d) => d.id === doctorIdParam)
          if (doctor) {
            setSelectedDoctor(doctor as unknown as Doctor)
            const specialty = HOST_SPECIALTIES.find(
              (s) => s.name === doctor.specialty
            )
            if (specialty) {
              setSelectedSpecialty(specialty)
            }
            // setCurrentStep(3) // Skip to time selection
          }
        }

        // If specialty is pre-selected
        if (specialtyParam) {
          const specialty = HOST_SPECIALTIES.find(
            (s) => s.id === specialtyParam
          )
          if (specialty) {
            setSelectedSpecialty(specialty)
            // setCurrentStep(2) // Go to service/doctor selection
          }
        }
      } catch (error) {
        console.error('Failed to load data:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [doctorIdParam, specialtyParam])

  // Load time slots when date changes
  const loadTimeSlots = useCallback(async () => {
    if (!selectedDate) return
    // In real app, fetch from API based on doctor/specialty and date
    // For demo, use mock data
    setShifts(DEMO_SHIFTS)
  }, [selectedDate])

  useEffect(() => {
    if (currentStep >= 3) {
      loadTimeSlots()
    }
  }, [currentStep, selectedDate, loadTimeSlots])

  const handleSelectSpecialty = (specialty: Specialty) => {
    setDropDown(false)
    setSelectedSpecialty(specialty)
    setSelectedService(null)
    setSelectedDoctor(null)
  }

  const handleSelectService = (service: Service) => {
    setSelectedService(service)
  }

  const handleSelectDoctor = (doctor: Doctor) => {
    setSelectedDoctor(doctor)
  }

  const handleSelectDate = (date: Date) => {
    setSelectedDate(date)
    setSelectedSlot(null)
  }

  const handleSelectSlot = (slot: TimeSlot) => {
    if (slot.isAvailable) {
      setSelectedSlot(slot)
    }
  }

  const handleContinue = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const canContinue = () => {
    switch (currentStep) {
      case 1:
        return selectedSpecialty !== null && selectedService !== null
      case 2:
        return true // Doctor is optional
      case 3:
        return selectedSlot !== null
      default:
        return false
    }
  }

  const handleSubmit = async () => {
    if (!selectedSpecialty || !selectedSlot) return

    setSubmitting(true)
    try {
      const token = localStorage.getItem('accessToken')
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          specialtyId: selectedSpecialty.id,
          serviceId: selectedService?.id,
          doctorId: selectedDoctor?.id,
          timeSlotId: selectedSlot.id,
          date: format(selectedDate, 'yyyy-MM-dd'),
          reason: reason.trim()
        })
      })

      if (response.ok) {
        setSuccess(true)
        setTimeout(() => router.push('/appointments'), 2000)
      } else {
        throw new Error('Failed to book')
      }
    } catch {
      // Demo: show success anyway
      setSuccess(true)
      setTimeout(() => router.push('/appointments'), 2000)
    } finally {
      setSubmitting(false)
    }
  }

  const getDayName = (date: Date) => {
    const dayIndex = date.getDay()
    const days = [
      'Chủ nhật',
      'Thứ 2',
      'Thứ 3',
      'Thứ 4',
      'Thứ 5',
      'Thứ 6',
      'Thứ 7'
    ]
    return days[dayIndex]
  }

  // Success state
  if (success) {
    return (
      <div className='min-h-screen bg-background flex items-center justify-center p-4'>
        <Card className='max-w-md w-full'>
          <CardContent className='pt-12 pb-12'>
            <div className='flex flex-col items-center text-center'>
              <div className='flex h-16 w-16 items-center justify-center rounded-full bg-accent/10'>
                <CheckCircle className='h-8 w-8 text-accent' />
              </div>
              <h2 className='mt-6 text-xl font-semibold text-foreground'>
                Đặt lịch thành công!
              </h2>
              <p className='mt-2 text-sm text-muted-foreground'>
                Lịch hẹn của bạn đã được ghi nhận. Chúng tôi sẽ liên hệ xác nhận
                sớm nhất.
              </p>
              <p className='mt-4 text-sm text-muted-foreground'>
                Đang chuyển đến trang lịch hẹn...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-sky-50'>
      {/* Header */}
      <DialogSpecialties
        open={dropDown}
        setOpen={setDropDown}
        handleSelectSpecialty={handleSelectSpecialty}
      />
      <header className='sticky top-0 z-50 bg-card border-b border-border'>
        <div className='container mx-auto flex h-16 items-center justify-between px-4'>
          <Link href='/' className='flex items-center gap-2'>
            <Heart className='h-6 w-6 text-primary' />
            <span className='text-xl font-bold text-primary'>MediCare</span>
          </Link>
          <div className='text-sm text-muted-foreground'>
            Hotline:{' '}
            <span className='text-primary font-semibold'>0333915023</span>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className='bg-card border-b border-border'>
        <div className='container mx-auto px-4 py-3'>
          <nav className='text-sm'>
            <ol className='flex items-center gap-2'>
              <li>
                <Link
                  href='/hosts'
                  className='text-muted-foreground hover:text-foreground'
                >
                  Trang chủ
                </Link>
              </li>
              <li className='text-muted-foreground'>&gt;</li>
              <li className='text-primary font-medium'>
                {doctorIdParam
                  ? 'Đặt khám theo bác sĩ'
                  : 'Đặt khám chuyên khoa'}
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <main className='container mx-auto px-4 py-6'>
        <div className='grid gap-6 lg:grid-cols-[280px_1fr]'>
          {/* Left Sidebar - Clinic Info */}
          <div className='hidden lg:block'>
            <div className='rounded-xl bg-primary p-5 text-primary-foreground'>
              <h3 className='text-sm font-medium uppercase tracking-wide opacity-90'>
                Thông tin cơ sở y tế
              </h3>
              <div className='mt-4'>
                <div className='flex items-start gap-2'>
                  <Building2 className='h-5 w-5 flex-shrink-0 mt-0.5' />
                  <div>
                    <p className='font-semibold leading-snug'>{clinic.name}</p>
                    {clinic.verified && (
                      <BadgeCheck className='h-4 w-4 text-sky-300 mt-1' />
                    )}
                  </div>
                </div>
                <div className='mt-3 flex items-start gap-2 text-sm opacity-90'>
                  <MapPin className='h-4 w-4 flex-shrink-0 mt-0.5' />
                  <p>{clinic.address}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className='bg-card rounded-xl shadow-sm'>
            {/* Stepper Header */}
            <div className='rounded-t-xl bg-primary px-6 py-4'>
              <div className='flex items-center justify-between'>
                <button
                  type='button'
                  onClick={handleBack}
                  disabled={currentStep === 1}
                  className='text-primary-foreground/80 hover:text-primary-foreground disabled:opacity-50'
                >
                  <ChevronLeft className='h-5 w-5' />
                </button>
                <h2 className='text-lg font-semibold text-primary-foreground'>
                  {currentStep === 1 && 'Chọn thông tin khám'}
                  {currentStep === 2 && 'Chọn hồ sơ'}
                  {currentStep === 3 && 'Xác nhận thông tin'}
                  {currentStep === 4 && 'Thanh toán'}
                </h2>
                <div className='w-5' />
              </div>

              {/* Progress Steps */}
              <div className='mt-4 flex items-center justify-between'>
                {STEPS.map((step, index) => {
                  const Icon = step.icon
                  const isActive = currentStep === step.id
                  const isCompleted = currentStep > step.id

                  return (
                    <React.Fragment key={step.id}>
                      <div className='flex flex-col items-center'>
                        <div
                          className={cn(
                            'flex h-10 w-10 items-center justify-center rounded-full transition-colors',
                            isActive
                              ? 'bg-primary-foreground text-primary'
                              : isCompleted
                                ? 'bg-sky-300 text-primary'
                                : 'bg-primary-foreground/20 text-primary-foreground/60'
                          )}
                        >
                          {isCompleted ? (
                            <CheckCircle className='h-5 w-5' />
                          ) : (
                            <Icon className='h-5 w-5' />
                          )}
                        </div>
                      </div>
                      {index < STEPS.length - 1 && (
                        <div
                          className={cn(
                            'flex-1 h-0.5 mx-2',
                            currentStep > step.id
                              ? 'bg-sky-300'
                              : 'bg-primary-foreground/20'
                          )}
                        />
                      )}
                    </React.Fragment>
                  )
                })}
              </div>
            </div>

            {/* Form Content */}
            <div className='p-6'>
              {loading ? (
                <div className='space-y-4'>
                  <Skeleton className='h-12 w-full' />
                  <Skeleton className='h-12 w-full' />
                  <Skeleton className='h-32 w-full' />
                </div>
              ) : (
                <>
                  {/* Step 1 & 2: Specialty, Service, Doctor Selection */}
                  {currentStep === 1 && (
                    <div className='space-y-6'>
                      {/* Doctor field (shown if booking by doctor) */}
                      {doctorIdParam && selectedDoctor && (
                        <div className='space-y-2'>
                          <Label className='text-sm font-medium text-foreground flex items-center gap-1'>
                            Bác sĩ <span className='text-destructive'>*</span>
                          </Label>
                          <button
                            type='button'
                            className='w-full flex items-center justify-between rounded-lg border border-border bg-muted/30 p-4 text-left'
                          >
                            <div className='flex items-center gap-3'>
                              <User className='h-5 w-5 text-primary' />
                              <span className='font-medium'>
                                {selectedDoctor.title} {selectedDoctor.name}
                              </span>
                            </div>
                            <ChevronRight className='h-5 w-5 text-muted-foreground' />
                          </button>
                        </div>
                      )}
                      {/* Specialty Selection */}
                      <div className='space-y-2'>
                        <Label className='text-sm font-medium text-foreground flex items-center gap-1'>
                          Chuyên khoa{' '}
                          <span className='text-destructive'>*</span>
                        </Label>
                        <div className='relative'>
                          <button
                            type='button'
                            onClick={() => {
                              if (!specialtyParam) {
                                setDropDown(!dropDown)
                              }
                            }}
                            className='w-full flex items-center justify-between rounded-lg border border-border bg-card p-4 text-left  hover:border-primary/50 transition-colors'
                          >
                            <div className='flex items-center gap-3'>
                              <Stethoscope className='h-5 w-5 text-primary' />
                              <span
                                className={
                                  selectedSpecialty
                                    ? 'font-medium'
                                    : 'text-muted-foreground'
                                }
                              >
                                {selectedSpecialty?.name || 'Chọn chuyên khoa'}
                              </span>
                            </div>
                            <ChevronRight className='h-5 w-5 text-muted-foreground' />
                          </button>
                        </div>
                      </div>
                      {/* Service Selection */}
                      <div className='space-y-2'>
                        <Label className='text-sm font-medium text-foreground flex items-center gap-1'>
                          Dịch vụ <span className='text-destructive'>*</span>
                        </Label>
                        <div className='space-y-2'>
                          {services.map((service) => (
                            <button
                              key={service.id}
                              type='button'
                              onClick={() => handleSelectService(service)}
                              className={cn(
                                'w-full flex items-center justify-between rounded-lg border p-4 text-left transition-colors',
                                selectedService?.id === service.id
                                  ? 'border-primary bg-primary/5'
                                  : 'border-border hover:border-primary/50'
                              )}
                            >
                              <div className='flex items-center gap-3'>
                                <FileText className='h-5 w-5 text-primary' />
                                <span className='font-medium'>
                                  {service.name}
                                </span>
                              </div>
                              <span className='text-sm text-muted-foreground'>
                                {service.price.toLocaleString('vi-VN')}đ
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                      {selectedService && (
                        <>
                          <div className='space-y-2'>
                            <Label className='text-sm font-medium text-foreground flex items-center gap-1'>
                              Ngày khám{' '}
                              <span className='text-destructive'>*</span>
                            </Label>
                            <div className='flex items-center gap-2'>
                              {weekDays.map((day) => {
                                const isSelected = isSameDay(day, selectedDate)
                                const isToday = isSameDay(day, new Date())

                                return (
                                  <button
                                    key={day.toISOString()}
                                    type='button'
                                    onClick={() => handleSelectDate(day)}
                                    className={cn(
                                      'flex-1 flex flex-col items-center rounded-lg border p-3 transition-colors',
                                      isSelected
                                        ? 'border-primary bg-primary/5 text-primary'
                                        : 'border-border hover:border-primary/50'
                                    )}
                                  >
                                    <span
                                      className={cn(
                                        'text-sm',
                                        isSelected
                                          ? 'text-primary font-semibold'
                                          : 'text-foreground'
                                      )}
                                    >
                                      ({format(day, 'dd/MM')})
                                    </span>
                                    <span className='text-xs text-muted-foreground mt-1'>
                                      {getDayName(day)}
                                    </span>
                                  </button>
                                )
                              })}
                              <button
                                type='button'
                                className='flex-1 flex flex-col items-center rounded-lg border border-border p-3 hover:border-primary/50 transition-colors'
                              >
                                <Calendar className='h-5 w-5 text-muted-foreground' />
                                <span className='text-xs text-muted-foreground mt-1'>
                                  Ngày khác
                                </span>
                              </button>
                            </div>
                          </div>
                          {/* Time Slots */}
                          <div className='space-y-4'>
                            <Label className='text-sm font-medium text-foreground flex items-center gap-1'>
                              Giờ khám{' '}
                              <span className='text-destructive'>*</span>
                            </Label>

                            {shifts.map((shift) => (
                              <div key={shift.id} className='space-y-2'>
                                <p className='text-sm font-medium text-muted-foreground'>
                                  {shift.name}
                                </p>
                                <div className='grid grid-cols-3 gap-2'>
                                  {shift.slots.map((slot) => (
                                    <button
                                      key={slot.id}
                                      type='button'
                                      disabled={!slot.isAvailable}
                                      onClick={() => handleSelectSlot(slot)}
                                      className={cn(
                                        'rounded-lg border p-3 text-sm transition-colors',
                                        !slot.isAvailable
                                          ? 'border-border bg-muted text-muted-foreground cursor-not-allowed opacity-50'
                                          : selectedSlot?.id === slot.id
                                            ? 'border-primary bg-primary/10 text-primary font-medium'
                                            : 'border-border hover:border-primary/50'
                                      )}
                                    >
                                      {slot.startTime} - {slot.endTime}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            ))}

                            <p className='text-xs text-primary'>
                              Tất cả thời gian theo múi giờ Việt Nam GMT +7
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                  {/* Step 2: patient info */}
                  {currentStep === 2 &&
                    (addNewPatient ? (
                      <div className='space-y-6'>
                        <div>Thông tin khám bệnh</div>
                        <div className='flex flex-col gap-2 pl-10 rounded-2xl bg-background p-2'>
                          <div className='flex flex-row gap-2 text-gray-500'>
                            <UserIcon size={15} />
                            <span className='text-black'>
                              Khám {selectedSpecialty?.name}
                            </span>
                          </div>
                          <div className='flex flex-row gap-2 text-gray-500'>
                            <HeartHandshake size={15} />

                            <span className='text-black'>
                              {selectedService?.name}
                            </span>
                          </div>
                          <div className='flex flex-row gap-2 text-gray-500'>
                            <Calendar size={15} />

                            <span className='text-black'>
                              {getDayName(selectedDate)}{' '}
                              {format(selectedDate, 'dd/MM/yyyy')}
                              {' ('}
                              {selectedSlot?.startTime} -{' '}
                              {selectedSlot?.endTime}
                              {')'}
                            </span>
                          </div>
                        </div>
                        <div>Thông tin người khám</div>
                        <div className='flex flex-row gap-5'>
                          <Button
                            className={
                              addForMe
                                ? 'bg-sky-600'
                                : 'bg-background text-black'
                            }
                            onClick={() => setAddForMe(true)}
                          >
                            Đặt cho mình
                          </Button>
                          <Button
                            className={
                              !addForMe
                                ? 'bg-sky-600'
                                : 'bg-background text-black'
                            }
                            onClick={() => setAddForMe(false)}
                          >
                            Đặt cho người thân
                          </Button>
                        </div>
                        <Card className='mb-6'>
                          {!addForMe && (
                            <CardHeader>
                              <CardTitle>Thông tin người khám</CardTitle>
                            </CardHeader>
                          )}
                          <CardContent className='space-y-4'>
                            <div className='grid gap-4 md:grid-cols-2'>
                              <div>
                                <label className='block text-sm font-medium mb-2'>
                                  Tên đầy đủ
                                </label>
                                <input
                                  type='text'
                                  placeholder='Tên của bạn'
                                  name='fullName'
                                  value={formData.fullName}
                                  onChange={handleChange}
                                  className='w-full rounded-lg border border-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500'
                                />
                              </div>
                              <div>
                                <label className='block text-sm font-medium mb-2'>
                                  Email
                                </label>
                                <input
                                  type='email'
                                  name='email'
                                  placeholder='Nhập email'
                                  value={formData.email}
                                  onChange={handleChange}
                                  className='w-full rounded-lg border border-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500'
                                />
                              </div>
                              <div>
                                <label className='block text-sm font-medium mb-2'>
                                  Mã định danh/CCCD
                                </label>
                                <input
                                  type='cccd'
                                  name='cccd'
                                  placeholder='Vui lòng nhập mã Mã định danh/CCCD'
                                  value={formData.cccd}
                                  onChange={handleChange}
                                  className='w-full rounded-lg border border-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500'
                                />
                              </div>
                              <div>
                                <label className='block text-sm font-medium mb-2'>
                                  Ngày sinh
                                </label>
                                <input
                                  type='date'
                                  name='dateOfBirth'
                                  value={formData.dateOfBirth}
                                  onChange={handleChange}
                                  className='w-full rounded-lg border border-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500'
                                />
                              </div>
                              <div>
                                <label className='block text-sm font-medium mb-2'>
                                  Giới tính
                                </label>
                                <select
                                  name='gender'
                                  value={formData.gender}
                                  onChange={handleChange}
                                  className='w-full rounded-lg border border-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500'
                                >
                                  <option>Nam</option>
                                  <option>Nữ</option>
                                </select>
                              </div>
                              <div>
                                <label className='block text-sm font-medium mb-2'>
                                  Dân tộc
                                </label>
                                <select
                                  name='ethnic'
                                  value={formData.ethnic}
                                  onChange={handleChange}
                                  className='w-full rounded-lg border border-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500'
                                >
                                  <option>Kinh</option>
                                  <option>Khác</option>
                                </select>
                              </div>
                              <div>
                                <label className='block text-sm font-medium mb-2'>
                                  Số điện thoại
                                </label>
                                <input
                                  type='tel'
                                  name='phone'
                                  value={formData.phone}
                                  onChange={handleChange}
                                  className='w-full rounded-lg border border-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500'
                                />
                              </div>
                              <div>
                                <label className='block text-sm font-medium mb-2'>
                                  Quốc tịch
                                </label>
                                <input
                                  type='text'
                                  name='country'
                                  value={formData.country}
                                  onChange={handleChange}
                                  className='w-full rounded-lg border border-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500'
                                />
                              </div>
                            </div>
                            <div>
                              <label className='block text-sm font-medium mb-2'>
                                Địa chỉ
                              </label>
                              <textarea
                                name='address'
                                value={formData.address}
                                onChange={handleChange}
                                rows={2}
                                className='w-full rounded-lg border border-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500'
                              />
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    ) : (
                      <div className='space-y-6'>
                        <div className='space-y-2'>
                          <div className='flex flex-row items-center justify-between'>
                            <span>Danh sách hồ sơ</span>
                            <Button
                              className=' h-10 text-base bg-sky-500 hover:bg-sky-600'
                              onClick={() => setAddNewPatient(true)}
                            >
                              <UserPlus2Icon size={'15'} />
                              Thêm hồ sơ mới
                            </Button>
                          </div>
                          {/* Hồ sơ */}
                          <div
                            key={12}
                            className='flex flex-col gap-2 pl-10 rounded-2xl bg-background p-2'
                            // onClick={() => setSelectedPatient()}
                          >
                            <div className='flex flex-row gap-2 text-gray-500'>
                              <UserIcon size={15} />
                              Họ và tên:
                              <span className='text-black'>Thanh phong</span>
                            </div>
                            <div className='flex flex-row gap-2 text-gray-500'>
                              <PhoneCall size={15} />
                              Số điện thoại:
                              <span className='text-black'>0333***9834</span>
                            </div>
                            <div className='flex flex-row gap-2 text-gray-500'>
                              <CakeIcon size={15} />
                              Ngày sinh:
                              <span className='text-black'>25/05/2005</span>
                            </div>
                            <div className='flex flex-row gap-2 text-gray-500'>
                              <MapPin size={15} />
                              Địa chỉ:
                              <span className='text-black'>
                                200/3, Phường Tân Uyên , Thành Phố Hồ Chí Minh
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  {/* Step 3: Confirmation */}
                  {currentStep === 3 && (
                    <div className='space-y-6'>
                      <div>Thông tin khám</div>
                      <div className='rounded-lg border border-border p-4 space-y-3'>
                        <div className='flex'>
                          <span className='font-medium flex flex-row gap-2'>
                            <StethoscopeIcon size={15} />
                            {selectedSpecialty?.name}
                          </span>
                        </div>
                        <div className='flex'>
                          <span className='font-medium flex flex-row gap-2'>
                            <HeartHandshake size={15} />
                            {selectedService?.name || 'Khám dịch vụ'}
                          </span>
                        </div>
                        {selectedDoctor && (
                          <div className='flex '>
                            <span className='font-medium flex flex-row gap-2'>
                              <User size={15} />
                              {selectedDoctor.name}
                            </span>
                          </div>
                        )}
                        <div className='flex'>
                          <span className='font-medium flex flex-row gap-2'>
                            <Calendar size={15} />
                            {format(selectedDate, 'dd/MM/yyyy')} (
                            {getDayName(selectedDate)}) {' ('}
                            {selectedSlot?.startTime} - {selectedSlot?.endTime}
                            {')'}
                          </span>
                        </div>
                        <div className='flex'>
                          <span className='font-medium flex flex-row gap-2'>
                            <Wallet size={15} />

                            {selectedService?.price
                              ? selectedService?.price.toLocaleString('vi-VN') +
                                'đ'
                              : '0 đ'}
                          </span>
                        </div>
                      </div>
                      {/* // Thông tin bệnh nhân */}
                      <div>Thông tin bệnh nhân</div>
                      <div className='rounded-lg border border-border p-4 space-y-3'>
                        <div className='flex'>
                          <span className='font-medium flex flex-row gap-2'>
                            <User size={15} />
                            Thanh Phong
                          </span>
                        </div>
                        <div className='flexd'>
                          <span className='text-black flex flex-row gap-2'>
                            <CakeIcon size={15} />
                            25/2/2005
                          </span>
                        </div>
                        <div className='flexd'>
                          <span className='text-black flex flex-row gap-2'>
                            <PhoneCall size={15} />
                            06353633434
                          </span>
                        </div>
                        <div className='flexd'>
                          <span className='text-black flex flex-row gap-2'>
                            <MapPin size={15} />
                            200/3, Phường Tân Uyên , Thành Phố Hồ Chí Minh
                          </span>
                        </div>
                      </div>
                      <div>
                        {' '}
                        Thanh toán tạm tính:{' '}
                        {selectedService?.price
                          ? selectedService?.price.toLocaleString('vi-VN') + 'đ'
                          : '0 đ'}
                      </div>
                    </div>
                  )}

                  {/* Step 4: Pay */}
                  {currentStep === 4 && (
                    <div className='space-y-6'>
                      <div>Thông tin khám</div>
                      <div className='rounded-lg border border-border p-4 space-y-3'>
                        <div className='flex'>
                          <span className='font-medium flex flex-row gap-2'>
                            <StethoscopeIcon size={15} />
                            {selectedSpecialty?.name}
                          </span>
                        </div>
                        <div className='flex'>
                          <span className='font-medium flex flex-row gap-2'>
                            <HeartHandshake size={15} />
                            {selectedService?.name || 'Khám dịch vụ'}
                          </span>
                        </div>
                        {selectedDoctor && (
                          <div className='flex '>
                            <span className='font-medium flex flex-row gap-2'>
                              <User size={15} />
                              {selectedDoctor.name}
                            </span>
                          </div>
                        )}
                        <div className='flex'>
                          <span className='font-medium flex flex-row gap-2'>
                            <Calendar size={15} />
                            {format(selectedDate, 'dd/MM/yyyy')} (
                            {getDayName(selectedDate)}) {' ('}
                            {selectedSlot?.startTime} - {selectedSlot?.endTime}
                            {')'}
                          </span>
                        </div>
                        <div className='flex'>
                          <span className='font-medium flex flex-row gap-2'>
                            <Wallet size={15} />

                            {selectedService?.price
                              ? selectedService?.price.toLocaleString('vi-VN') +
                                'đ'
                              : 'Thanh toán tại bệnh viện'}
                          </span>
                        </div>
                      </div>
                      {/* // Thông tin bệnh nhân */}
                      <div>Thông tin bệnh nhân</div>
                      <div className='rounded-lg border border-border p-4 space-y-3'>
                        <div className='flex'>
                          <span className='font-medium flex flex-row gap-2'>
                            <User size={15} />
                            Thanh Phong
                          </span>
                        </div>
                        <div className='flexd'>
                          <span className='text-black flex flex-row gap-2'>
                            <CakeIcon size={15} />
                            25/2/2005
                          </span>
                        </div>
                        <div className='flexd'>
                          <span className='text-black flex flex-row gap-2'>
                            <PhoneCall size={15} />
                            06353633434
                          </span>
                        </div>
                        <div className='flexd'>
                          <span className='text-black flex flex-row gap-2'>
                            <MapPin size={15} />
                            200/3, Phường Tân Uyên , Thành Phố Hồ Chí Minh
                          </span>
                        </div>
                      </div>
                      <div className='flex flex-col rounded-lg border border-border p-4 space-y-3'>
                        <div className='flex flex-row justify-between'>
                          Phí khám bệnh
                          <span>
                            <div>
                              {selectedService?.price
                                ? selectedService?.price.toLocaleString(
                                    'vi-VN'
                                  ) + 'đ'
                                : 'Thanh toán tại bệnh viện'}
                            </div>
                          </span>
                        </div>
                        <div className='flex flex-row justify-between'>
                          Phí đặt lịch (theo quy định)
                          <span>
                            <div>0 đ</div>
                          </span>
                        </div>
                      </div>
                      <div className='text-gray-500'>
                        Bằng việc nhấn vào “Thanh toán", bạn đã đồng ý với Chính
                        sách xử lý dữ liệu & quyền lợi MeđCare
                      </div>
                      <div>
                        <label className='block text-sm font-medium mb-2'>
                          Chọn phương thức thanh toán
                        </label>
                        <select
                          name='payment'
                          value={payment}
                          onChange={(e) => setPayment(e.target.value)}
                          className='w-full rounded-lg border border-border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500'
                        >
                          <option>Momo</option>
                          <option>Thanh toán tại bệnh viện</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {/* Continue Button */}
                  <div className='mt-8 flex flex-row gap-2'>
                    {addNewPatient ? (
                      <Button
                        className='flex-1 h-12 text-base bg-sky-500 hover:bg-sky-600'
                        onClick={() => setAddNewPatient(false)}
                      >
                        Quay lại
                      </Button>
                    ) : (
                      <></>
                    )}
                    {currentStep < 4 ? (
                      <Button
                        className='w-full flex-4 h-12 text-base bg-sky-500 hover:bg-sky-600'
                        onClick={handleContinue}
                        disabled={!canContinue()}
                      >
                        Tiếp tục
                      </Button>
                    ) : (
                      <Button
                        className='w-full h-12 text-base bg-sky-500 hover:bg-sky-600'
                        onClick={handleSubmit}
                        disabled={submitting}
                      >
                        {submitting ? (
                          <>
                            <Loader2 className='mr-2 h-5 w-5 animate-spin' />
                            Đang xử lý...
                          </>
                        ) : (
                          'Thanh toán'
                        )}
                      </Button>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
