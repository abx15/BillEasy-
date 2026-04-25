import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Public routes that don't require authentication
const publicRoutes = ['/login', '/register']
const protectedRoutes = ['/dashboard']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Get access token from cookie/header (for demo, checking localStorage logic happens client side, 
  // but middleware checks cookies for server-side protection)
  const accessToken = request.cookies.get('accessToken')?.value || 
                    request.headers.get('authorization')?.replace('Bearer ', '')

  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))

  // If accessing protected route without token, redirect to login
  if (isProtectedRoute && !accessToken) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // If accessing public route with token, redirect to dashboard
  if (isPublicRoute && accessToken) {
    const redirectUrl = request.nextUrl.searchParams.get('redirect')
    const destination = redirectUrl || '/dashboard'
    return NextResponse.redirect(new URL(destination, request.url))
  }

  // Handle root path redirect
  if (pathname === '/') {
    if (accessToken) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    } else {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static, _next/image, favicon.ico, public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}
