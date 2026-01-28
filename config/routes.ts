/**
 * Route configuration for the application
 */

export const ROUTES = {
  // Public routes - no auth required
  PUBLIC: {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register'
  },

  // Protected routes - auth required
  PROTECTED: {
    DASHBOARD: '/dashboard',
    APPOINTMENTS: '/appointments',
    APPOINTMENTS_DETAIL: '/appointments/:id',
    HOSTS: '/hosts',
    HOST_DETAIL: '/hosts/:id'
  },

  // Admin routes - admin auth required
  ADMIN: {
    ADMIN_DASHBOARD: '/admin',
    USERS: '/admin/users',
    ADMIN_APPOINTMENTS: '/admin/appointments'
  }
}

// Define route access levels
export const ROUTE_ROLES = {
  PUBLIC: ['GUEST', 'HOST', 'ADMIN'],
  AUTHENTICATED: ['GUEST', 'HOST', 'ADMIN'],
  HOST_ONLY: ['HOST', 'ADMIN'],
  ADMIN_ONLY: ['ADMIN']
}

// Get user-friendly route name
export const getRouteName = (path: string): string => {
  const routeMap: Record<string, string> = {
    '/': 'Home',
    '/login': 'Login',
    '/register': 'Register',
    '/hosts': 'Providers',
    '/dashboard': 'Dashboard',
    '/appointments': 'My Appointments',
    '/admin': 'Admin Dashboard',
    '/admin/users': 'Manage Users'
  }
  return routeMap[path] || path
}
