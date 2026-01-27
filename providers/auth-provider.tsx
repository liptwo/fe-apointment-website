'use client'

import React, { createContext, useState, useEffect, useContext } from 'react'
import { User, LoginPayload } from '@/types'
import { login as loginService } from '@/services/auth.service'
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
        // Set token for all subsequent API requests
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`

        // Fetch user data from localStorage (simple approach)
        // A better approach would be to have a '/auth/me' endpoint
        const storedUser = localStorage.getItem('user')
        if (storedUser) {
          setUser(JSON.parse(storedUser))
        } else {
          // If user not in storage, clear token as it's a broken state
          localStorage.removeItem('accessToken')
        }
      }
      setIsLoading(false)
    }

    initializeAuth()
  }, [])

  const login = async (data: LoginPayload) => {
    const response = await loginService(data)
    const { accessToken, user } = response

    // Store token and user data
    // NOTE: In production, consider more secure storage like httpOnly cookies.
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('user', JSON.stringify(user))

    // Set token for all subsequent API requests
    api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`

    setUser(user)
    return user // Return the user object
  }

  const logout = () => {
    // Clear user data and tokens
    setUser(null)
    localStorage.removeItem('accessToken')
    localStorage.removeItem('user')
    delete api.defaults.headers.common['Authorization']
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
