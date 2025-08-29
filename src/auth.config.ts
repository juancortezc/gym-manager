import type { NextAuthConfig } from 'next-auth'
import Google from 'next-auth/providers/google'

export default {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    })
  ],
  pages: {
    signIn: '/login',
    error: '/login'
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard')
      const isOnProtectedRoute = !['/login', '/api/auth'].some(path => 
        nextUrl.pathname.startsWith(path)
      )

      if (isOnProtectedRoute && !isLoggedIn) {
        return false // Redirect to login page
      }

      if (isOnDashboard && !isLoggedIn) {
        return false
      }

      return true
    },
  },
} satisfies NextAuthConfig