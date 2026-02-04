// types/index.ts

export interface RegisterPayload {
  name: string
  email: string
  password: string
  phone: string
  role: 'GUEST' | 'HOST'
}

export interface AvailabilityRulePayload {
  ruleType: 'WEEKLY' | 'DATE_RANGE'
  daysOfWeek: string // "MON,TUE,WED"
  startHour: number
  endHour: number
  specialty: string
  description: string
  address: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  user: User
}

export interface User {
  id: string
  email: string
  name: string
  role: 'GUEST' | 'HOST' | 'ADMIN'
  is_active?: boolean
  created_at?: string // from GET /users
  createdAt?: string // from register
  phone?: string
  specialty?: string // legacy
  description?: string
  address?: string
  // New doctor fields
  title?: string
  specialtyId?: string
  price?: number
  avatar?: string
}

export interface UpdateGuestProfilePayload {
  name?: string
  email?: string
  phone?: string
}

export interface UpdateHostProfilePayload {
  name?: string
  email?: string
  phone?: string
  specialty?: string // legacy
  description?: string
  address?: string
  // New doctor fields
  title?: string
  specialtyId?: string
  price?: number
  avatar?: string
}

export interface PaginationMeta {
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface PaginatedData<T> {
  data: T[]
  meta: PaginationMeta
}

export interface UpdateUserStatusResponse {
  id: string
  is_active: boolean
  updated_at: string
}

// --- Appointments ---

export interface BookingPayload {
  hostId: string
  timeslotId: string
  patientId?: string
  paymentMethod?: string
  paymentAmount?: number
  reason?: string
}

export interface Doctor {
  id: string
  name: string
  title?: string
  specialty: string
  specialtyId?: string
  description: string
  price?: number
  schedule?: string
  avatar?: string
}

export interface TimeSlot {
  id: string
  startTime: string
  endTime: string
  isAvailable: boolean
  date?: string
  startLabel?: string
  endLabel?: string
}

export interface Appointment {
  id: string
  status: 'PENDING' | 'CONFIRMED' | 'CANCELED' | 'COMPLETED'
  hostId?: string
  guestId?: string | null
  // Backend returns these as snake_case
  doctor_name?: string
  patient_name?: string
  phone?: string
  payment_status?: string
  payment_amount?: number
  cancel_reason?: string | null
  created_at?: string
  timeslots?: {
    start_time: string
    end_time: string
  }
  // Camel case aliases for compatibility
  reason?: string
  timeSlot?: {
    startTime: string
    endTime: string
    date?: string
  }
  host?: {
    name: string
    email: string
    phone: string
    specialty: string
    description: string
    address: string
    title: string
  }
  // doctor is alias for host (used in guest views)
  doctor?: {
    name: string
    email?: string
    phone?: string
    specialty: string
    description?: string
    address: string
    title: string
  }
  guest?: {
    name: string
    email: string
  }
  createdAt?: string
  cancelReason?: string | null
  // Additional fields
  time?: string
  patientName?: string
  patientId?: string
  doctorName?: string
  doctorAvatar?: string
  initials?: string
}

// --- Notifications ---

export type NotificationType =
  | 'CONFIRMED'
  | 'CANCELLED'
  | 'PENDING'
  | 'COMPLETED'
  | 'REMINDER'
  | 'NEW_BOOKING'
  | 'BOOKING_CANCELLED'

export interface Notification {
  id: string
  userId: string
  appointmentId?: string
  type: NotificationType
  message: string
  isRead: boolean
  createdAt: string
  data?: Record<string, unknown>
}

export interface SendNotificationPayload {
  appointmentId: string
  type: NotificationType
  message?: string
}

export interface Specialty {
  id: string
  name: string
  icon?: string
}

export interface Subject {
  id: string
  name: string
  icon: string
}

export interface CreateSubjectPayload {
  name: string
  description: string
}

export interface CreatePatientPayload {
  name: string
  email?: string
  phone?: string
  address?: string
  dob?: string
  gender?: 'MALE' | 'FEMALE' | 'OTHER'
}

export type UpdatePatientPayload = Partial<CreatePatientPayload>

export interface Patient {
  id: string
  ownerId: string
  name: string
  email: string
  phone: string
  address: string
  dob: string
  gender: 'MALE' | 'FEMALE' | 'OTHER'
  cccd?: string
  ethnic?: string
  country?: string
}

export type AppointmentStatus =
  | 'Scheduled'
  | 'Late'
  | 'Checked-in'
  | 'In-consultation'
  | 'Completed'
  | 'Cancelled'

// export interface Appointment {
//   id: string
//   time: string
//   patientName: string
//   patientId: string
//   phone: string
//   doctorName: string
//   doctorAvatar: string
//   // status: AppointmentStatus
//   initials: string
// }

export interface DoctorDashboard {
  total: number
  confirmed: number
  pending: number
  canceled: number
}

export interface DoctorTodayAppointment {
  id: string
  patient_name: string
  phone: string
  status: string
  payment_status: string
  created_at: string
  timeslots: {
    id: string
    start_time: string
    end_time: string
  }
}

