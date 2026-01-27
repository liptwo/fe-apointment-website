'use client'

import React, { createContext, useState, useEffect, useContext } from 'react'
import { User, LoginPayload } from '@/types'
import {
  login as loginService,
  getMe,
  logout as logoutService
} from '@/services/auth.service'
import api from '@/lib/axios'

// 1. Define the shape of the context data
interface AuthContextType {
  user: User | null
  login: (data: LoginPayload) => Promise<User>
  logout: () => void
  isLoading: boolean
}

// 2. Create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// 3. Create the AuthProvider component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Effect to load user data on initial mount
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('accessToken')
      if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`
        try {
          // Fetch user data from the /auth/me endpoint
          const userData = await getMe()
          setUser(userData)
        } catch (error) {
          // If token is invalid, clear it
          setUser(null)
          delete api.defaults.headers.common['Authorization']
          localStorage.removeItem('accessToken')
          localStorage.removeItem('user')
        }
      }
      setIsLoading(false)
    }

    initializeAuth()
  }, [])

  const login = async (data: LoginPayload) => {
    const response = await loginService(data)
    const { accessToken, user } = response

    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('user', JSON.stringify(user)) // Store user data

    api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`

    setUser(user)
    return user
  }

  const logout = async () => {
    try {
      await logoutService()
    } catch (error) {
      console.error('Logout failed', error)
      // Still proceed with client-side cleanup
    } finally {
      setUser(null)
      delete api.defaults.headers.common['Authorization']
      localStorage.removeItem('accessToken')
      localStorage.removeItem('user')
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

// 4. Create a custom hook for easy access to the context
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
