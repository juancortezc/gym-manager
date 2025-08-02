import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { name, hourlyRate, active } = await request.json()
    const { id } = await params

    if (!name || !hourlyRate || hourlyRate <= 0) {
      return NextResponse.json(
        { error: 'Nombre y tarifa por hora son requeridos' },
        { status: 400 }
      )
    }

    const staff = await prisma.cleaningStaff.update({
      where: { id },
      data: {
        name: name.trim(),
        hourlyRate: parseFloat(hourlyRate),
        active: active ?? true,
      },
    })

    return NextResponse.json(staff)
  } catch (error) {
    console.error('Error updating cleaning staff:', error)
    return NextResponse.json(
      { error: 'Error al actualizar personal de limpieza' },
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

    await prisma.cleaningStaff.update({
      where: { id },
      data: { active: false },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deactivating cleaning staff:', error)
    return NextResponse.json(
      { error: 'Error al desactivar personal de limpieza' },
      { status: 500 }
    )
  }
}