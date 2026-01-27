// services/appointment.service.ts
import api from '../lib/axios'
import { Appointment, BookingPayload, PublicBookingPayload } from '@/types' // Assuming these types will be added to types/index.ts

export const createAppointment = async (
  payload: BookingPayload
): Promise<Appointment> => {
  const response = await api.post<Appointment>('/appointments', payload)
  return response.data
}

export const createPublicAppointment = async (
  payload: PublicBookingPayload
): Promise<Appointment> => {
  const response = await api.post<Appointment>('/appointments/public', payload)
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
