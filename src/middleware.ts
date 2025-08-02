import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const authCookie = request.cookies.get('gym-auth')
  const isAuthPage = request.nextUrl.pathname === '/login'
  const isApiAuth = request.nextUrl.pathname.startsWith('/api/auth')
  
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