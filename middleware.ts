
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { User } from '@/types'

// 1. Specify protected and guest routes
const protectedRoutes = ['/admin', '/dashboard', '/appointments']
const guestRoutes = ['/login', '/register']
const adminRoutes = ['/admin']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const userCookie = request.cookies.get('user')
  const accessToken = request.cookies.get('accessToken')

  let user: User | null = null
  if (userCookie) {
    try {
      user = JSON.parse(userCookie.value)
    } catch (e) {
      console.error('Failed to parse user cookie:', e)
    }
  }

  // Check for admin routes
  if (adminRoutes.some(route => pathname.startsWith(route))) {
    if (!accessToken || !user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    if (user.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  // Check for other protected routes for authenticated users
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    if (!accessToken || !user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // If user is logged in, redirect from guest routes to home
  if (accessToken && user && guestRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  // Matcher to specify which routes the middleware should run on
  matcher: [
    '/admin/:path*',
    '/dashboard/:path*',
    '/appointments/:path*',
    '/login',
    '/register'
  ]
}
