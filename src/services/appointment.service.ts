// services/appointment.service.ts
import api from '../lib/axios'
import {
  Appointment,
  BookingPayload,
  DoctorDashboard,
  DoctorTodayAppointment
} from '@/src/types' // Assuming these types will be added to types/index.ts

export const createAppointment = async (
  payload: BookingPayload
): Promise<Appointment> => {
  const response = await api.post<Appointment>('/appointments', payload)
  return response.data
}

export const getAppointmentById = async (id: string): Promise<Appointment> => {
  const response = await api.get<Appointment>(`/appointments/${id}`)
  return response.data
}

export const getMyBookings = async (): Promise<Appointment[]> => {
  const response = await api.get<Appointment[]>('/appointments/my')
  return response.data
}

export const confirmAppointment = async (id: string): Promise<Appointment> => {
  const response = await api.patch<Appointment>(`/appointments/${id}/confirm`)
  return response.data
}

export const cancelAppointment = async (
  id: string,
  cancelReason: string
): Promise<Appointment> => {
  const response = await api.patch<Appointment>(`/appointments/${id}/cancel`, {
    cancelReason
  })
  return response.data
}

export const getDoctorDashboard = async (): Promise<DoctorDashboard> => {
  const response = await api.get<DoctorDashboard>(
    '/appointments/doctor/dashboard'
  )
  return response.data
}

export const getDoctorTodayAppointments = async (): Promise<
  DoctorTodayAppointment[]
> => {
  const response = await api.get<DoctorTodayAppointment[]>(
    '/appointments/doctor/today'
  )
  return response.data
}
