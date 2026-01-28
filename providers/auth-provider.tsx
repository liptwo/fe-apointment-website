'use client'

import React, { createContext, useState, useEffect, useContext } from 'react'
import Cookies from 'js-cookie'
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
  updateUserInfo: (updatedUser: User) => void
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
      try {
        const token = Cookies.get('accessToken')
        const userCookie = Cookies.get('user')

        // If we have a token, verify it's still valid
        if (token) {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`
          try {
            // Fetch user data from the /auth/me endpoint
            const userData = await getMe()
            setUser(userData)
          } catch (error) {
            // If token is invalid, clear it
            console.error('Token validation failed:', error)
            setUser(null)
            delete api.defaults.headers.common['Authorization']
            Cookies.remove('accessToken')
            Cookies.remove('refreshToken')
            Cookies.remove('user')
          }
        } else if (userCookie) {
          // Clear stale user cookie if no token
          Cookies.remove('user')
          setUser(null)
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [])

  const login = async (data: LoginPayload) => {
    try {
      const response = await loginService(data)
      const { accessToken, refreshToken, user } = response

      // Store tokens in cookies with proper settings
      Cookies.set('accessToken', accessToken, {
        expires: 7,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      })

      if (refreshToken) {
        Cookies.set('refreshToken', refreshToken, {
          expires: 30,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax'
        })
      }

      Cookies.set('user', JSON.stringify(user), {
        expires: 7,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      })

      // Set default header for axios
      api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`

      setUser(user)
      return user
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  const logout = async () => {
    try {
      await logoutService()
    } catch (error) {
      console.error('Logout error (continuing with cleanup):', error)
      // Continue with cleanup even if logout API fails
    } finally {
      // Clear all auth-related data
      setUser(null)
      delete api.defaults.headers.common['Authorization']
      Cookies.remove('accessToken')
      Cookies.remove('refreshToken')
      Cookies.remove('user')
    }
  }

  const updateUserInfo = (updatedUser: User) => {
    setUser(updatedUser)
    Cookies.set('user', JSON.stringify(updatedUser), {
      expires: 7,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    })
  }

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isLoading, updateUserInfo }}
    >
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
