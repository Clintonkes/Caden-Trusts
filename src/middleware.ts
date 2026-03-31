import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const isAuthenticated = request.cookies.get('auth-token')

  const protectedRoutes = ['/dashboard', '/admin']
  const loginRoute = '/login'
  const otpRoute = '/otp'

  const { pathname } = request.nextUrl

  // Check if the user is trying to access a protected route
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))

  // Allow access to login and OTP pages
  if (pathname === loginRoute || pathname === otpRoute) {
    // If already authenticated, redirect to dashboard
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return NextResponse.next()
  }

  // If trying to access protected route without auth, redirect to login
  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/login', '/otp'],
}
