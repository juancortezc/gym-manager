import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const memberId = searchParams.get('memberId')
    const date = searchParams.get('date')

    let whereCondition: any = {}

    if (memberId) {
      whereCondition.memberId = memberId
    }

    if (date) {
      const startOfDay = new Date(date)
      const endOfDay = new Date(date)
      endOfDay.setHours(23, 59, 59, 999)

      whereCondition.visitDate = {
        gte: startOfDay,
        lte: endOfDay,
      }
    }

    const visits = await prisma.memberVisit.findMany({
      where: whereCondition,
      include: {
        member: true,
      },
      orderBy: { visitDate: 'desc' },
    })

    return NextResponse.json(visits)
  } catch (error) {
    console.error('Error fetching member visits:', error)
    return NextResponse.json(
      { error: 'Error al obtener visitas' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { memberId, visitDate, notes } = await request.json()

    if (!memberId) {
      return NextResponse.json(
        { error: 'ID del miembro es requerido' },
        { status: 400 }
      )
    }

    // Check if member has active membership
    const activeMembership = await prisma.membership.findFirst({
      where: {
        memberId,
        active: true,
        endDate: {
          gte: new Date(),
        },
      },
      include: {
        plan: true,
      },
    })

    if (!activeMembership) {
      return NextResponse.json(
        { error: 'El miembro no tiene una membresía activa o ha vencido' },
        { status: 400 }
      )
    }

    // Check if member has classes remaining
    if (activeMembership.classesUsed >= activeMembership.plan.totalClasses) {
      return NextResponse.json(
        { error: 'El miembro ha agotado sus clases disponibles' },
        { status: 400 }
      )
    }

    // Create visit
    const visit = await prisma.memberVisit.create({
      data: {
        memberId,
        visitDate: visitDate ? new Date(visitDate) : new Date(),
        notes: notes?.trim() || null,
      },
      include: {
        member: true,
      },
    })

    // Increment classes used
    await prisma.membership.update({
      where: { id: activeMembership.id },
      data: {
        classesUsed: activeMembership.classesUsed + 1,
      },
    })

    return NextResponse.json(visit, { status: 201 })
  } catch (error) {
    console.error('Error creating member visit:', error)
    return NextResponse.json(
      { error: 'Error al registrar visita' },
      { status: 500 }
    )
  }
}