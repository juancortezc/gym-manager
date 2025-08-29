// Temporarily disabled NextAuth API route due to import issues
// This will be re-enabled once environment variables are configured

import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  return NextResponse.json({ 
    error: 'NextAuth not configured. Please set up Google OAuth credentials in environment variables.' 
  }, { status: 501 })
}

export async function POST(request: NextRequest) {
  return NextResponse.json({ 
    error: 'NextAuth not configured. Please set up Google OAuth credentials in environment variables.' 
  }, { status: 501 })
}