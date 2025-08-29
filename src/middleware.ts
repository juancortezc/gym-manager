import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  // Skip auth check for PWA related files and service worker
  const isPWAResource = pathname === '/manifest.json' || 
                       pathname === '/sw.js' ||
                       pathname.startsWith('/icon-') ||
                       pathname.startsWith('/_next')
  
  if (isPWAResource) {
    return NextResponse.next()
  }

  // Allow all API routes to pass through without authentication check for now
  if (pathname.startsWith('/api')) {
    return NextResponse.next()
  }

  const authCookie = request.cookies.get('gym-auth')
  const isAuthPage = pathname === '/login'
  
  // For root path, redirect to dashboard if authenticated, login if not
  if (pathname === '/') {
    if (authCookie) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    } else {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }
  
  if (!authCookie && !isAuthPage) {
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