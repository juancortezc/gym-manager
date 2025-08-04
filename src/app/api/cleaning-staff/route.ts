import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const staff = await prisma.cleaningStaff.findMany({
      where: { active: true },
      orderBy: { name: 'asc' },
    })

    return NextResponse.json(staff)
  } catch (error) {
    console.error('Error fetching cleaning staff:', error)
    return NextResponse.json(
      { error: 'Error al obtener personal de limpieza' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, hourlyRate, birthDate } = await request.json()

    if (!name || !hourlyRate || hourlyRate <= 0) {
      return NextResponse.json(
        { error: 'Nombre y tarifa por hora son requeridos' },
        { status: 400 }
      )
    }

    const staff = await prisma.cleaningStaff.create({
      data: {
        name: name.trim(),
        hourlyRate: parseFloat(hourlyRate),
        birthDate: birthDate ? new Date(birthDate) : null,
      },
    })

    return NextResponse.json(staff, { status: 201 })
  } catch (error) {
    console.error('Error creating cleaning staff:', error)
    return NextResponse.json(
      { error: 'Error al crear personal de limpieza' },
      { status: 500 }
    )
  }
}