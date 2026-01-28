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
  specialty?: string
  description?: string
  address?: string
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
  specialty?: string
  description?: string
  address?: string
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
  timeSlotId: string
  reason: string
}

export interface Appointment {
  id: string
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'
  hostId?: string
  guestId?: string | null
  reason: string
  timeSlot: {
    startTime: string
    endTime: string
    date?: string
  }
  host?: {
    name: string
    email: string
  }
  guest?: {
    name: string
    email: string
  }
  createdAt: string
  cancelReason?: string | null
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
