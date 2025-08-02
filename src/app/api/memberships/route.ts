import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const memberId = searchParams.get('memberId')
    const active = searchParams.get('active')

    let whereCondition: any = {}

    if (memberId) {
      whereCondition.memberId = memberId
    }

    if (active !== null) {
      whereCondition.active = active === 'true'
    }

    const memberships = await prisma.membership.findMany({
      where: whereCondition,
      include: {
        member: true,
        plan: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(memberships)
  } catch (error) {
    console.error('Error fetching memberships:', error)
    return NextResponse.json(
      { error: 'Error al obtener membresías' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { memberId, planId, startDate, paymentMethod, totalPaid } = await request.json()

    if (!memberId || !planId || !startDate || !paymentMethod || !totalPaid) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      )
    }

    if (totalPaid <= 0) {
      return NextResponse.json(
        { error: 'El monto pagado debe ser mayor a 0' },
        { status: 400 }
      )
    }

    const plan = await prisma.plan.findUnique({
      where: { id: planId },
    })

    if (!plan) {
      return NextResponse.json(
        { error: 'Plan no encontrado' },
        { status: 404 }
      )
    }

    // Deactivate previous active membership for this member
    await prisma.membership.updateMany({
      where: {
        memberId,
        active: true,
      },
      data: {
        active: false,
      },
    })

    const start = new Date(startDate)
    const end = new Date(start)
    end.setDate(end.getDate() + plan.durationInDays)

    const membership = await prisma.membership.create({
      data: {
        memberId,
        planId,
        startDate: start,
        endDate: end,
        paymentMethod,
        totalPaid: parseFloat(totalPaid),
      },
      include: {
        member: true,
        plan: true,
      },
    })

    return NextResponse.json(membership, { status: 201 })
  } catch (error) {
    console.error('Error creating membership:', error)
    return NextResponse.json(
      { error: 'Error al crear membresía' },
      { status: 500 }
    )
  }
}