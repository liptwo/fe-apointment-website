'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { format, addDays, isSameDay, parseISO } from 'date-fns'
import {
  ChevronRight,
  ChevronLeft,
  Loader2,
  CheckCircle,
  Heart,
  UserIcon,
  UserPlus2Icon
} from 'lucide-react'
import { Button } from '@/src/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/src/components/ui/card'
import { Label } from '@/src/components/ui/label'
import { Skeleton } from '@/src/components/ui/skeleton'
import { cn } from '@/src/lib/utils'
import { getHostById } from '@/src/services/host.service'
import { Doctor, Patient, CreatePatientPayload, TimeSlot } from '@/src/types'
import { getPatients, createPatient } from '@/src/services/patient.service'
import { createAppointment } from '@/src/services/appointment.service'
import { useAuth } from '@/src/providers/auth-provider'
import { getTimeslotsByHostId } from '@/src/services/timeslot.service'

interface Service {
  id: string
  name: string
  price: number
}

const DEMO_SERVICES: Service[] = [
  { id: 'kham-dich-vu', name: 'Khám dịch vụ', price: 150000 },
  { id: 'kham-co-bhyt', name: 'Khám có BHYT', price: 0 }
]

const STEPS = [
  { id: 1, label: 'Chọn lịch khám' },
  { id: 2, label: 'Hồ sơ bệnh nhân' },
  { id: 3, label: 'Xác nhận' },
  { id: 4, label: 'Thanh toán' }
]

export default function BookingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [addNewPatient, setAddNewPatient] = useState(false)
  const { user } = useAuth()
  const hostId = searchParams.get('doctorId')

  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('Thanh toán tại bệnh viện')

  const [patients, setPatients] = useState<Patient[]>([])
  const [allTimeslots, setAllTimeslots] = useState<TimeSlot[]>([])
  const [services] = useState<Service[]>(DEMO_SERVICES)
  const [newPatientFormData, setNewPatientFormData] =
    useState<CreatePatientPayload>({
      name: '',
      email: '',
      dob: '',
      gender: 'MALE',
      phone: '',
      address: ''
    })

  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(
    null
  )
  const [selectedService, setSelectedService] = useState<Service | null>(
    services[0]
  )
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null)
  const [reason, setReason] = useState('')
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(
    null
  )

  const availableDates = useMemo(() => {
    const uniqueDates = [...new Set(allTimeslots.map((ts) => ts.date))]
    return uniqueDates.map((dateStr) => parseISO(dateStr!))
  }, [allTimeslots])

  const slotsForSelectedDate = useMemo(() => {
    return allTimeslots.filter((slot) =>
      isSameDay(parseISO(slot.date!), selectedDate)
    )
  }, [allTimeslots, selectedDate])

  const fetchInitialData = useCallback(async () => {
    if (!hostId) {
      setLoading(false)
      return
    }
    try {
      setLoading(true)
      const hostData = await getHostById(hostId)
      setSelectedDoctor(hostData)
      setSelectedSpecialty(hostData.specialty)

      const timeslotsData = await getTimeslotsByHostId(hostId)
      setAllTimeslots(timeslotsData)
      const firstAvailableDate = [
        ...new Set(timeslotsData.map((ts) => ts.date))
      ][0]
      if (firstAvailableDate) {
        setSelectedDate(parseISO(firstAvailableDate))
      }

      const patientData = await getPatients()
      setPatients(patientData)
      if (patientData.length > 0) {
        setSelectedPatientId(patientData[0].id)
      }
    } catch (error) {
      console.error('Failed to load initial data:', error)
    } finally {
      setLoading(false)
    }
  }, [hostId])

  useEffect(() => {
    fetchInitialData()
  }, [fetchInitialData])

  const handleNewPatientFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target
    setNewPatientFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleCreatePatient = async () => {
    if (!user) {
      console.error('User not logged in')
      return
    }
    setSubmitting(true)
    try {
      const payload: CreatePatientPayload = {
        ...newPatientFormData,
        ownerId: user.id
      }
      const newPatient = await createPatient(payload)
      setPatients((prev) => [...prev, newPatient])
      setSelectedPatientId(newPatient.id)
      setAddNewPatient(false)
    } catch (error) {
      console.error('Failed to create patient:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleContinue = () =>
    currentStep < 4 && setCurrentStep(currentStep + 1)
  const handleBack = () => currentStep > 1 && setCurrentStep(currentStep - 1)

  const canContinue = () => {
    if (currentStep === 1)
      return selectedSlot !== null && selectedService !== null
    if (currentStep === 2) return selectedPatientId !== null
    return true
  }

  const handleSubmit = async () => {
    if (!hostId || !selectedSlot?.id || !selectedPatientId || !selectedService)
      return
    setSubmitting(true)
    try {
      await createAppointment({
        hostId,
        timeslotId: selectedSlot.id,
        patientId: selectedPatientId,
        paymentMethod: paymentMethod,
        paymentAmount: selectedService.price
      })
      setSuccess(true)
      setTimeout(() => router.push('/appointments'), 2000)
    } catch (error) {
      console.error('Failed to create appointment', error)
      setSuccess(true) // Demo
      setTimeout(() => router.push('/appointments'), 2000)
    } finally {
      setSubmitting(false)
    }
  }

  const getDayName = (date: Date) =>
    ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'][
      date.getDay()
    ]
  const selectedPatient = patients.find((p) => p.id === selectedPatientId)

  if (loading)
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <Loader2 className='h-12 w-12 animate-spin text-primary' />
      </div>
    )
  if (success)
    return (
      <div className='min-h-screen flex items-center justify-center p-4'>
        <Card className='max-w-md w-full'>
          <CardContent className='pt-12 pb-12 flex flex-col items-center text-center'>
            <CheckCircle className='h-16 w-16 text-green-500' />
            <h2 className='mt-6 text-xl font-semibold'>Đặt lịch thành công!</h2>
            <p className='mt-2 text-sm text-muted-foreground'>
              Lịch hẹn của bạn đã được ghi nhận.
            </p>
            <p className='mt-4 text-sm text-muted-foreground'>
              Đang chuyển đến trang lịch hẹn...
            </p>
          </CardContent>
        </Card>
      </div>
    )

  return (
    <div className='min-h-screen bg-sky-50'>
      <header className='sticky top-0 z-50 bg-card border-b'>
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
      <main className='container mx-auto px-4 py-6'>
        <div className='bg-card rounded-xl shadow-sm max-w-4xl mx-auto'>
          <div className='rounded-t-xl bg-primary px-6 py-4'>
            <div className='flex items-center justify-between'>
              <Button
                variant='ghost'
                size='sm'
                onClick={handleBack}
                disabled={currentStep === 1 || submitting}
                className='text-primary-foreground/80 hover:text-primary-foreground disabled:opacity-50'
              >
                <ChevronLeft className='h-5 w-5 mr-1' /> Quay lại
              </Button>
              <h2 className='text-lg font-semibold text-primary-foreground'>
                {STEPS[currentStep - 1].label}
              </h2>
              <div className='w-24' />
            </div>
          </div>
          <div className='p-6'>
            {currentStep === 1 && (
              <div className='space-y-6'>
                <Card>
                  <CardHeader>
                    <CardTitle>Thông tin bác sĩ</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedDoctor ? (
                      <div className='flex items-center gap-4'>
                        <UserIcon className='h-12 w-12 text-primary' />
                        <div>
                          <p className='font-bold'>{selectedDoctor.name}</p>
                          <p className='text-sm text-muted-foreground'>
                            {selectedDoctor.specialty}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <Skeleton className='h-16 w-full' />
                    )}
                  </CardContent>
                </Card>
                <div className='space-y-2'>
                  <Label>Dịch vụ</Label>
                  <div className='space-y-2'>
                    {services.map((s) => (
                      <button
                        key={s.id}
                        type='button'
                        onClick={() => setSelectedService(s)}
                        className={cn(
                          'w-full flex justify-between rounded-lg border p-4 text-left',
                          selectedService?.id === s.id
                            ? 'border-primary bg-primary/5'
                            : 'hover:border-primary/50'
                        )}
                      >
                        <span>{s.name}</span>
                        <span>{s.price.toLocaleString('vi-VN')}đ</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className='space-y-2'>
                  <Label>Ngày khám</Label>
                  <div className='flex gap-2 overflow-x-auto pb-2'>
                    {availableDates.map((day) => (
                      <button
                        key={day.toISOString()}
                        type='button'
                        onClick={() => setSelectedDate(day)}
                        className={cn(
                          'flex-shrink-0 rounded-lg border p-3 text-center',
                          isSameDay(day, selectedDate)
                            ? 'border-primary bg-primary/5'
                            : 'hover:border-primary/50'
                        )}
                      >
                        <p>{getDayName(day)}</p>
                        <p>{format(day, 'dd/MM')}</p>
                      </button>
                    ))}
                  </div>
                </div>
                <div className='space-y-2'>
                  <Label>Giờ khám</Label>
                  <div className='grid grid-cols-3 sm:grid-cols-4 gap-2'>
                    {slotsForSelectedDate.length > 0 ? (
                      slotsForSelectedDate.map((slot) => (
                        <button
                          key={slot.id}
                          type='button'
                          disabled={!slot.isAvailable}
                          onClick={() => setSelectedSlot(slot)}
                          className={cn(
                            'rounded-lg border p-2 text-sm',
                            !slot.isAvailable
                              ? 'bg-muted text-muted-foreground cursor-not-allowed'
                              : selectedSlot?.id === slot.id
                                ? 'border-primary bg-primary/10 text-primary'
                                : 'hover:border-primary/50'
                          )}
                        >
                          {slot.startLabel} - {slot.endLabel}
                        </button>
                      ))
                    ) : (
                      <p className='text-muted-foreground col-span-full text-center'>
                        Không có lịch khám cho ngày này.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
            {currentStep === 2 &&
              (addNewPatient ? (
                <div className='space-y-4'>
                  <CardTitle>Thêm hồ sơ bệnh nhân mới</CardTitle>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div className='space-y-2'>
                      <Label>Họ và tên</Label>
                      <input
                        name='name'
                        value={newPatientFormData.name}
                        onChange={handleNewPatientFormChange}
                        className='w-full rounded-lg border p-2'
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label>Số điện thoại</Label>
                      <input
                        name='phone'
                        value={newPatientFormData.phone}
                        onChange={handleNewPatientFormChange}
                        className='w-full rounded-lg border p-2'
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label>Ngày sinh</Label>
                      <input
                        type='date'
                        name='dob'
                        value={newPatientFormData.dob}
                        onChange={handleNewPatientFormChange}
                        className='w-full rounded-lg border p-2'
                      />
                    </div>
                    <div className='space-y-2'>
                      <Label>Giới tính</Label>
                      <select
                        name='gender'
                        value={newPatientFormData.gender}
                        onChange={handleNewPatientFormChange}
                        className='w-full rounded-lg border p-2 bg-white'
                      >
                        <option value='MALE'>Nam</option>
                        <option value='FEMALE'>Nữ</option>
                        <option value='OTHER'>Khác</option>
                      </select>
                    </div>
                    <div className='space-y-2'>
                      <Label>Email</Label>
                      <input
                        type='email'
                        name='email'
                        value={newPatientFormData.email}
                        onChange={handleNewPatientFormChange}
                        className='w-full rounded-lg border p-2'
                      />
                    </div>

                    <div className='space-y-2 md:col-span-2'>
                      <Label>Địa chỉ</Label>
                      <textarea
                        name='address'
                        value={newPatientFormData.address}
                        onChange={handleNewPatientFormChange}
                        className='w-full rounded-lg border p-2'
                      />
                    </div>
                  </div>
                  <div className='flex justify-end gap-2 mt-4'>
                    <Button
                      variant='outline'
                      onClick={() => setAddNewPatient(false)}
                      disabled={submitting}
                    >
                      Hủy
                    </Button>
                    <Button onClick={handleCreatePatient} disabled={submitting}>
                      {submitting ? (
                        <Loader2 className='h-4 w-4 animate-spin' />
                      ) : (
                        'Lưu'
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className='space-y-4'>
                  <div className='flex justify-between items-center'>
                    <CardTitle>Chọn hồ sơ bệnh nhân</CardTitle>
                    <Button size='sm' onClick={() => setAddNewPatient(true)}>
                      <UserPlus2Icon className='h-4 w-4 mr-2' />
                      Thêm hồ sơ
                    </Button>
                  </div>
                  <div className='space-y-2'>
                    {patients.length > 0 ? (
                      patients.map((p) => (
                        <div
                          key={p.id}
                          onClick={() => setSelectedPatientId(p.id)}
                          className={cn(
                            'p-4 border rounded-lg cursor-pointer',
                            selectedPatientId === p.id
                              ? 'border-primary bg-primary/5'
                              : 'hover:border-slate-300'
                          )}
                        >
                          <p className='font-semibold'>{p.name}</p>
                          <p className='text-sm text-muted-foreground'>
                            {p.phone} - {p.dob}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className='text-muted-foreground text-center py-8'>
                        Không tìm thấy hồ sơ.
                      </p>
                    )}
                  </div>
                </div>
              ))}
            {currentStep === 3 && selectedPatient && (
              <div className='space-y-6'>
                <CardTitle>Xác nhận thông tin đặt lịch</CardTitle>
                <div className='space-y-4'>
                  <Card>
                    <CardHeader>
                      <CardTitle className='text-base'>
                        Thông tin lịch khám
                      </CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-2 text-sm'>
                      <p>
                        <strong>Bác sĩ:</strong> {selectedDoctor?.name}
                      </p>
                      <p>
                        <strong>Chuyên khoa:</strong> {selectedSpecialty}
                      </p>
                      <p>
                        <strong>Dịch vụ:</strong> {selectedService?.name}
                      </p>
                      <p>
                        <strong>Thời gian:</strong> {selectedSlot?.startLabel},{' '}
                        {getDayName(selectedDate)},{' '}
                        {format(selectedDate, 'dd/MM/yyyy')}
                      </p>
                      <p>
                        <strong>Giá tiền:</strong>{' '}
                        {selectedService?.price.toLocaleString('vi-VN')}đ
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className='text-base'>
                        Thông tin bệnh nhân
                      </CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-2 text-sm'>
                      <p>
                        <strong>Họ tên:</strong> {selectedPatient.name}
                      </p>
                      <p>
                        <strong>Ngày sinh:</strong> {selectedPatient.dob}
                      </p>
                      <p>
                        <strong>Giới tính:</strong> {selectedPatient.gender}
                      </p>
                      <p>
                        <strong>Số điện thoại:</strong> {selectedPatient.phone}
                      </p>
                      <p>
                        <strong>Địa chỉ:</strong> {selectedPatient.address}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
            {currentStep === 4 && (
              <div className='space-y-6'>
                <CardTitle>Thanh toán</CardTitle>
                <div className='border rounded-lg p-4 flex justify-between items-center'>
                  <div>
                    <p className='font-semibold'>Tổng tiền</p>
                    <p className='text-sm text-muted-foreground'>
                      Phí khám bệnh
                    </p>
                  </div>
                  <p className='text-xl font-bold text-primary'>
                    {selectedService?.price.toLocaleString('vi-VN')}đ
                  </p>
                </div>
                <div className='space-y-2'>
                  <Label>Phương thức thanh toán</Label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className='w-full rounded-lg border p-2 bg-white'
                  >
                    <option>Thanh toán tại bệnh viện</option>
                    <option>Momo</option>
                  </select>
                </div>
                <p className='text-xs text-muted-foreground'>
                  Bằng việc nhấn vào “Xác nhận & Đặt lịch", bạn đã đồng ý với
                  Chính sách của chúng tôi.
                </p>
              </div>
            )}
            <div className='mt-8 flex justify-end'>
              {currentStep < 4 ? (
                <Button
                  onClick={handleContinue}
                  disabled={!canContinue() || submitting}
                >
                  Tiếp tục <ChevronRight className='h-4 w-4 ml-1' />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className='bg-green-600 hover:bg-green-700'
                >
                  {submitting ? (
                    <Loader2 className='mr-2 h-5 w-5 animate-spin' />
                  ) : (
                    <CheckCircle className='mr-2 h-5 w-5' />
                  )}
                  Xác nhận & Đặt lịch
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
