/**
 * Authorization utilities for checking user roles and permissions
 */

import { User } from '@/types'
import { ROUTE_ROLES } from '@/config/routes'

export type UserRole = 'GUEST' | 'HOST' | 'ADMIN'

/**
 * Check if user has a specific role
 */
export const hasRole = (user: User | null, role: UserRole): boolean => {
  if (!user) return false
  return user.role === role
}

/**
 * Check if user has any of the specified roles
 */
export const hasAnyRole = (user: User | null, roles: UserRole[]): boolean => {
  if (!user) return false
  return roles.includes(user.role as UserRole)
}

/**
 * Check if user is an admin
 */
export const isAdmin = (user: User | null): boolean => {
  return hasRole(user, 'ADMIN')
}

/**
 * Check if user is a host
 */
export const isHost = (user: User | null): boolean => {
  return hasRole(user, 'HOST')
}

/**
 * Check if user is a guest
 */
export const isGuest = (user: User | null): boolean => {
  return hasRole(user, 'GUEST')
}

/**
 * Check if user can access a route based on roles
 */
export const canAccessRoute = (
  user: User | null,
  requiredRoles: UserRole[]
): boolean => {
  if (requiredRoles.length === 0) return true // Public route
  if (!user) return false // User not authenticated
  return hasAnyRole(user, requiredRoles)
}

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (user: User | null): boolean => {
  return user !== null && user !== undefined
}

/**
 * Check if user account is active
 */
export const isActive = (user: User | null): boolean => {
  if (!user) return false
  return user.is_active !== false
}

/**
 * Check if user can perform admin actions
 */
export const canPerformAdminAction = (user: User | null): boolean => {
  return isAdmin(user) && isActive(user)
}

/**
 * Check if user can perform host actions
 */
export const canPerformHostAction = (user: User | null): boolean => {
  return (isHost(user) || isAdmin(user)) && isActive(user)
}

/**
 * Get list of roles allowed for a specific route
 */
export const getRouteAllowedRoles = (route: string): UserRole[] => {
  if (route.startsWith('/admin')) {
    return ['ADMIN']
  }
  if (route.startsWith('/dashboard') || route.startsWith('/appointments')) {
    return ['GUEST', 'HOST', 'ADMIN']
  }
  return ['GUEST', 'HOST', 'ADMIN'] // Public routes
}
