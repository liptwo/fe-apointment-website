import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { User } from '@/types'

// Define protected routes with roles
const ADMIN_ROUTES = ['/admin']
const PROTECTED_ROUTES = ['/dashboard', '/appointments', '/hosts']
const GUEST_ROUTES = ['/login', '/register']
const PUBLIC_ROUTES = ['/', '/hosts']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const userCookie = request.cookies.get('user')
  const accessToken = request.cookies.get('accessToken')

  let user: User | null = null
  if (userCookie?.value) {
    try {
      user = JSON.parse(userCookie.value)
    } catch (e) {
      console.error('Failed to parse user cookie:', e)
      // Invalid cookie, remove it
      const response = NextResponse.next()
      response.cookies.delete('user')
      response.cookies.delete('accessToken')
      return response
    }
  }

  // Check if user has valid token and user object
  const isAuthenticated = !!accessToken?.value && !!user

  // Redirect unauthenticated users to login for protected routes
  if (!isAuthenticated) {
    if (
      pathname.startsWith('/admin') ||
      pathname.startsWith('/dashboard') ||
      pathname.startsWith('/appointments') ||
      pathname.startsWith('/hosts')
    ) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Check admin routes - only admins can access
  if (pathname.startsWith('/admin')) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    if (user?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  // Check protected routes - authenticated users only
  if (
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/appointments') ||
    pathname.startsWith('/hosts')
  ) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Check booking pages - authenticated users only
  if (pathname.startsWith('/hosts/') && pathname.includes('/book')) {
    if (!isAuthenticated) {
      const redirectUrl = new URL('/login', request.url)
      redirectUrl.searchParams.set(
        'redirect',
        pathname + '?' + request.nextUrl.search.substring(1)
      )
      return NextResponse.redirect(redirectUrl)
    }
  }

  // Redirect authenticated users away from guest routes
  if (isAuthenticated && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/dashboard/:path*',
    '/appointments/:path*',
    '/hosts/:path*',
    '/login',
    '/register'
  ]
}
