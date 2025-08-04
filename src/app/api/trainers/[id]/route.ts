import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { name, hourlyRate, birthDate, active } = await request.json()
    const { id } = await params

    if (!name || !hourlyRate || hourlyRate <= 0) {
      return NextResponse.json(
        { error: 'Nombre y tarifa por hora son requeridos' },
        { status: 400 }
      )
    }

    const trainer = await prisma.trainer.update({
      where: { id },
      data: {
        name: name.trim(),
        hourlyRate: parseFloat(hourlyRate),
        birthDate: birthDate ? new Date(birthDate) : null,
        active: active ?? true,
      },
    })

    return NextResponse.json(trainer)
  } catch (error) {
    console.error('Error updating trainer:', error)
    return NextResponse.json(
      { error: 'Error al actualizar entrenador' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    await prisma.trainer.update({
      where: { id },
      data: { active: false },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deactivating trainer:', error)
    return NextResponse.json(
      { error: 'Error al desactivar entrenador' },
      { status: 500 }
    )
  }
}