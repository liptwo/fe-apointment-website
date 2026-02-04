// services/appointment.service.ts
import api from '@/src/lib/axios'
import { format } from 'date-fns'

export interface DayStats {
    total: number
    confirmed: number
    pending: number
    canceled: number
}

export interface DashboardResponse {
    date: string
    statistics: DayStats
}

export interface Appointment {
    id: string
    patient_name: string
    phone: string
    status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'
    payment_status: string
    created_at: string
    timeslots: {
        id: string
        start_time: string
        end_time: string
    }
}

// Get appointments by date range (for calendar)
export const getAppointmentsByRange = async (
    startDate: string,
    endDate: string
): Promise<Appointment[]> => {
    const response = await api.get<Appointment[]>(
        `/appointments/doctor/range?startDate=${startDate}&endDate=${endDate}`
    )
    return response.data
}

// Get dashboard stats for specific date
export const getDashboardStats = async (
    date: string
): Promise<DashboardResponse> => {
    const response = await api.get<DashboardResponse>(
        `/appointments/doctor/dashboard?date=${date}`
    )
    return response.data
}

// Get today's appointments  
export const getTodayAppointments = async (): Promise<Appointment[]> => {
    const response = await api.get<Appointment[]>('/appointments/doctor/today')
    return response.data
}
