import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { pin } = await request.json()

    if (!pin || pin.length !== 4) {
      return NextResponse.json(
        { error: 'PIN debe tener 4 dígitos' },
        { status: 400 }
      )
    }

    let user = await prisma.user.findFirst()
    
    if (!user) {
      const hashedPin = await bcrypt.hash(process.env.DEFAULT_PIN || '1234', 10)
      user = await prisma.user.create({
        data: {
          pin: hashedPin,
        },
      })
    }

    const isValidPin = await bcrypt.compare(pin, user.pin)

    if (!isValidPin) {
      return NextResponse.json(
        { error: 'PIN incorrecto' },
        { status: 401 }
      )
    }

    const response = NextResponse.json({ success: true })
    response.cookies.set('gym-auth', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return response
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}