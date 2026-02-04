'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { format, parse, isValid } from 'date-fns'
import {
  Plus,
  Edit,
  Trash2,
  Loader2,
  AlertCircle,
  MoreHorizontal
} from 'lucide-react'
import { AppHeader } from '@/src/components/app-header'
import { Button } from '@/src/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/src/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from '@/src/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/src/components/ui/alert-dialog'
import { Input } from '@/src/components/ui/input'
import { Label } from '@/src/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/src/components/ui/select'
import {
  getPatients,
  createPatient,
  updatePatient,
  deletePatient
} from '@/src/services/patient.service'
import { Patient, CreatePatientPayload } from '@/src/types'

const patientSchema = z.object({
  name: z.string().min(1, 'Họ và tên là bắt buộc'),
  dob: z.string().min(1, 'Ngày sinh là bắt buộc'),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER'], {
    required_error: 'Giới tính là bắt buộc'
  }),
  phone: z
    .string()
    .min(1, 'Số điện thoại là bắt buộc')
    .regex(/^[0-9]{10,11}$/, 'Số điện thoại không hợp lệ'),
  email: z
    .string()
    .min(1, 'Email là bắt buộc')
    .email('Địa chỉ email không hợp lệ'),
  address: z.string().min(1, 'Địa chỉ là bắt buộc')
})

type PatientFormData = z.infer<typeof patientSchema>

const GENDER_MAP = {
  MALE: 'Nam',
  FEMALE: 'Nữ',
  OTHER: 'Khác'
}

export default function UserPage() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] =
    useState(false)
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    handleSubmit,
    control,
    register,
    reset,
    formState: { errors }
  } = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      name: '',
      dob: '',
      gender: undefined,
      phone: '',
      email: '',
      address: ''
    }
  })

  useEffect(() => {
    fetchPatients()
  }, [])

  const fetchPatients = async () => {
    try {
      setLoading(true)
      const data = await getPatients()
      setPatients(data)
    } catch (err) {
      setError('Không thể tải danh sách hồ sơ. Vui lòng thử lại.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenForm = (patient?: Patient) => {
    setSelectedPatient(patient || null)
    if (patient) {
      const dob = new Date(patient.dob)
      reset({
        ...patient,
        dob: isValid(dob) ? format(dob, 'dd/MM/yyyy') : ''
      })
    } else {
      reset({
        name: '',
        dob: '',
        gender: undefined,
        phone: '',
        email: '',
        address: ''
      })
    }
    setIsFormOpen(true)
  }

  const handleCloseForm = () => {
    setIsFormOpen(false)
    setSelectedPatient(null)
    reset()
  }

  const onSubmit = async (data: PatientFormData) => {
    setIsSubmitting(true)
    setError(null)

    const parsedDate = parse(data.dob, 'dd/MM/yyyy', new Date())
    if (!isValid(parsedDate)) {
      setError('Ngày sinh không hợp lệ. Vui lòng sử dụng định dạng DD/MM/YYYY.')
      setIsSubmitting(false)
      return
    }

    const payload: CreatePatientPayload = {
      ...data,
      dob: format(parsedDate, 'yyyy-MM-dd')
    }

    try {
      if (selectedPatient) {
        // Update
        const updatedPatient = await updatePatient(selectedPatient.id, payload)
        setPatients(
          patients.map((p) => (p.id === updatedPatient.id ? updatedPatient : p))
        )
      } else {
        // Create
        if (patients.length >= 5) {
          setError('Bạn chỉ có thể tạo tối đa 5 hồ sơ bệnh nhân.')
          setIsSubmitting(false)
          return
        }
        const newPatient = await createPatient(payload)
        setPatients([...patients, newPatient])
      }
      handleCloseForm()
    } catch (err) {
      setError(
        selectedPatient ? 'Cập nhật hồ sơ thất bại.' : 'Tạo hồ sơ thất bại.'
      )
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteClick = (patient: Patient) => {
    setSelectedPatient(patient)
    setIsConfirmDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!selectedPatient) return

    setIsSubmitting(true)
    try {
      await deletePatient(selectedPatient.id)
      setPatients(patients.filter((p) => p.id !== selectedPatient.id))
      setIsConfirmDeleteDialogOpen(false)
      setSelectedPatient(null)
    } catch (err) {
      setError('Xóa hồ sơ thất bại.')
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const formTitle = useMemo(
    () => (selectedPatient ? 'Chỉnh sửa hồ sơ' : 'Thêm hồ sơ mới'),
    [selectedPatient]
  )

  return (
    <div className='min-h-screen bg-background'>

      <main className='container mx-auto px-4 py-8'>
        <div className='mb-8 flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-semibold text-foreground'>
              Quản lý hồ sơ bệnh nhân
            </h1>
            <p className='mt-2 text-muted-foreground'>
              Xem và quản lý các hồ sơ khám bệnh của bạn (tối đa 5 hồ sơ).
            </p>
          </div>
          <Button
            onClick={() => handleOpenForm()}
            disabled={patients.length >= 5}
          >
            <Plus className='mr-2 h-4 w-4' />
            Thêm hồ sơ
          </Button>
        </div>

        {error && (
          <div className='mb-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive flex items-center'>
            <AlertCircle className='mr-2 h-4 w-4' />
            {error}
          </div>
        )}

        <div className='rounded-lg border'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Họ và tên</TableHead>
                <TableHead>Ngày sinh</TableHead>
                <TableHead>Giới tính</TableHead>
                <TableHead>Số điện thoại</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className='text-right'>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={6}>
                      <Loader2 className='mx-auto h-8 w-8 animate-spin text-primary' />
                    </TableCell>
                  </TableRow>
                ))
              ) : patients.length > 0 ? (
                patients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell className='font-medium'>
                      {patient.name}
                    </TableCell>
                    <TableCell>
                      {format(new Date(patient.dob), 'dd/MM/yyyy')}
                    </TableCell>
                    <TableCell>{GENDER_MAP[patient.gender]}</TableCell>
                    <TableCell>{patient.phone}</TableCell>
                    <TableCell>{patient.email}</TableCell>
                    <TableCell className='text-right'>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => handleOpenForm(patient)}
                        className='mr-2'
                      >
                        <Edit className='h-4 w-4' />
                      </Button>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => handleDeleteClick(patient)}
                        className='text-destructive hover:text-destructive'
                      >
                        <Trash2 className='h-4 w-4' />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className='text-center'>
                    Chưa có hồ sơ bệnh nhân nào.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </main>

      {/* Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className='sm:max-w-[600px]'>
          <DialogHeader>
            <DialogTitle>{formTitle}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className='grid gap-4 py-4'>
              <div className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor='name' className='text-right'>
                  Họ và tên
                </Label>
                <div className='col-span-3'>
                  <Input id='name' {...register('name')} />
                  {errors.name && (
                    <p className='text-sm text-destructive mt-1'>
                      {errors.name.message}
                    </p>
                  )}
                </div>
              </div>
              <div className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor='dob' className='text-right'>
                  Ngày sinh
                </Label>
                <div className='col-span-3'>
                  <Input
                    id='dob'
                    placeholder='DD/MM/YYYY'
                    {...register('dob')}
                  />
                  {errors.dob && (
                    <p className='text-sm text-destructive mt-1'>
                      {errors.dob.message}
                    </p>
                  )}
                </div>
              </div>
              <div className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor='gender' className='text-right'>
                  Giới tính
                </Label>
                <div className='col-span-3'>
                  <Controller
                    name='gender'
                    control={control}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder='Chọn giới tính' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='MALE'>Nam</SelectItem>
                          <SelectItem value='FEMALE'>Nữ</SelectItem>
                          <SelectItem value='OTHER'>Khác</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.gender && (
                    <p className='text-sm text-destructive mt-1'>
                      {errors.gender.message}
                    </p>
                  )}
                </div>
              </div>
              <div className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor='phone' className='text-right'>
                  Điện thoại
                </Label>
                <div className='col-span-3'>
                  <Input id='phone' {...register('phone')} />
                  {errors.phone && (
                    <p className='text-sm text-destructive mt-1'>
                      {errors.phone.message}
                    </p>
                  )}
                </div>
              </div>
              <div className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor='email' className='text-right'>
                  Email
                </Label>
                <div className='col-span-3'>
                  <Input id='email' type='email' {...register('email')} />
                  {errors.email && (
                    <p className='text-sm text-destructive mt-1'>
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>
              <div className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor='address' className='text-right'>
                  Địa chỉ
                </Label>
                <div className='col-span-3'>
                  <Input id='address' {...register('address')} />
                  {errors.address && (
                    <p className='text-sm text-destructive mt-1'>
                      {errors.address.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type='button' variant='outline'>
                  Hủy
                </Button>
              </DialogClose>
              <Button type='submit' disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                )}
                {selectedPatient ? 'Lưu thay đổi' : 'Tạo hồ sơ'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <AlertDialog
        open={isConfirmDeleteDialogOpen}
        onOpenChange={setIsConfirmDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa hồ sơ?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể được hoàn tác. Thao tác này sẽ xóa vĩnh
              viễn hồ sơ bệnh nhân khỏi máy chủ của chúng tôi.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isSubmitting}
              className='bg-destructive hover:bg-destructive/90'
            >
              {isSubmitting && (
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              )}
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
