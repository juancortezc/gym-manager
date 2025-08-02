import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { calculateHours } from '@/lib/utils'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { endTime, notes } = await request.json()
    const { id } = await params

    const session = await prisma.cleaningSession.findUnique({
      where: { id },
    })

    if (!session) {
      return NextResponse.json(
        { error: 'Sesión no encontrada' },
        { status: 404 }
      )
    }

    let totalHours = session.totalHours
    let end = session.endTime

    if (endTime) {
      const dateStr = session.date.toISOString().split('T')[0]
      end = new Date(`${dateStr}T${endTime}`)
      totalHours = calculateHours(session.startTime, end)
    }

    const updatedSession = await prisma.cleaningSession.update({
      where: { id },
      data: {
        endTime: end,
        totalHours,
        notes: notes?.trim() || session.notes,
      },
      include: { staff: true },
    })

    return NextResponse.json(updatedSession)
  } catch (error) {
    console.error('Error updating cleaning session:', error)
    return NextResponse.json(
      { error: 'Error al actualizar sesión' },
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

    await prisma.cleaningSession.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting cleaning session:', error)
    return NextResponse.json(
      { error: 'Error al eliminar sesión' },
      { status: 500 }
    )
  }
}