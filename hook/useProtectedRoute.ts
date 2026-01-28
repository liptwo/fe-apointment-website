/**
 * Hook to check if user has access to protected resources
 */

'use client'

import { useAuth } from '@/providers/auth-provider'
import {
  UserRole,
  canAccessRoute,
  isAdmin,
  isHost,
  isAuthenticated
} from '@/lib/auth'

export const useProtectedRoute = () => {
  const { user } = useAuth()

  return {
    user,
    isAuthenticated: isAuthenticated(user),
    isAdmin: isAdmin(user),
    isHost: isHost(user),
    canAccess: (requiredRoles: UserRole[]) =>
      canAccessRoute(user, requiredRoles)
  }
}

/**
 * Hook to require authentication
 * Optionally checks for specific roles
 */
export const useRequireAuth = (requiredRoles?: UserRole[]) => {
  const { user, isLoading } = useAuth()

  const isAuthorized = requiredRoles
    ? canAccessRoute(user, requiredRoles)
    : isAuthenticated(user)

  return {
    user,
    isLoading,
    isAuthorized
  }
}
