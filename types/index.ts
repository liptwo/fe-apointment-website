// types/index.ts

export interface RegisterPayload {
  name: string
  email: string
  password: string
  phone: string
  role: 'GUEST' | 'HOST'
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
  createdAt?: string // Optional because login response doesn't have it
}
