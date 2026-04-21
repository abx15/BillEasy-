import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Public routes that don't require authentication
const publicRoutes = ['/login', '/register']
const protectedRoutes = ['/dashboard']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Get access token from cookie or header
  const accessToken = request.cookies.get('accessToken')?.value || 
                    request.headers.get('authorization')?.replace('Bearer ', '')

  // Check if the path is a protected route
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
    // Check if there's a redirect parameter
    const redirectUrl = request.nextUrl.searchParams.get('redirect')
    const destination = redirectUrl || '/dashboard/home'
    return NextResponse.redirect(new URL(destination, request.url))
  }

  // Handle root path redirect
  if (pathname === '/') {
    if (accessToken) {
      return NextResponse.redirect(new URL('/dashboard/home', request.url))
    } else {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Add security headers
  const response = NextResponse.next()
  
  // Add CORS headers for API routes
  if (pathname.startsWith('/api/')) {
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  }

  // Add security headers
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}
