import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const authCookie = request.cookies.get('gym-auth')
  const isAuthPage = request.nextUrl.pathname === '/login'
  const isApiAuth = request.nextUrl.pathname.startsWith('/api/auth')
  const pathname = request.nextUrl.pathname
  
  // Skip auth check for PWA related files and service worker
  const isPWAResource = pathname === '/manifest.json' || 
                       pathname === '/sw.js' ||
                       pathname.startsWith('/icon-')
  
  if (isPWAResource) {
    return NextResponse.next()
  }
  
  // For root path, redirect to dashboard if authenticated, login if not
  if (pathname === '/') {
    if (authCookie) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    } else {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }
  
  if (!authCookie && !isAuthPage && !isApiAuth) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  if (authCookie && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public).*)'],
}