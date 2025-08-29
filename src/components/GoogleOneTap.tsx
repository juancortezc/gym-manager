'use client'

import { useEffect } from 'react'
// import { signIn, useSession } from 'next-auth/react' // Disabled until OAuth is configured

interface GoogleOneTapProps {
  className?: string
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void
          prompt: (callback?: (notification: any) => void) => void
          renderButton: (parent: HTMLElement, options: any) => void
          disableAutoSelect: () => void
        }
      }
    }
  }
}

export default function GoogleOneTap({ className = '' }: GoogleOneTapProps) {
  // Google One Tap is temporarily disabled until OAuth credentials are configured
  // This prevents 501 errors during development
  
  return <div className={className} id="g_id_onload" />
}