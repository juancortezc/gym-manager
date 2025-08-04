import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const trainers = await prisma.trainer.findMany({
      where: { active: true },
      orderBy: { name: 'asc' },
    })

    return NextResponse.json(trainers)
  } catch (error) {
    console.error('Error fetching trainers:', error)
    return NextResponse.json(
      { error: 'Error al obtener entrenadores' },
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

    const trainer = await prisma.trainer.create({
      data: {
        name: name.trim(),
        hourlyRate: parseFloat(hourlyRate),
        birthDate: birthDate ? new Date(birthDate) : null,
      },
    })

    return NextResponse.json(trainer, { status: 201 })
  } catch (error) {
    console.error('Error creating trainer:', error)
    return NextResponse.json(
      { error: 'Error al crear entrenador' },
      { status: 500 }
    )
  }
}