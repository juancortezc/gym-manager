import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { calculateHours } from '@/lib/utils'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const month = searchParams.get('month')
    const year = searchParams.get('year')
    const staffId = searchParams.get('staffId')

    let whereCondition: any = {}

    if (staffId) {
      whereCondition.staffId = staffId
    }

    if (month && year) {
      const startDate = new Date(parseInt(year), parseInt(month) - 1, 1)
      const endDate = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59)
      
      whereCondition.date = {
        gte: startDate,
        lte: endDate,
      }
    }

    const sessions = await prisma.cleaningSession.findMany({
      where: whereCondition,
      include: {
        staff: true,
      },
      orderBy: { date: 'desc' },
    })

    return NextResponse.json(sessions)
  } catch (error) {
    console.error('Error fetching cleaning sessions:', error)
    return NextResponse.json(
      { error: 'Error al obtener sesiones' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { staffId, date, startTime, endTime, notes } = await request.json()

    if (!staffId || !date || !startTime) {
      return NextResponse.json(
        { error: 'Personal, fecha y hora de inicio son requeridos' },
        { status: 400 }
      )
    }

    const sessionDate = new Date(date)
    const start = new Date(`${date}T${startTime}`)
    const end = endTime ? new Date(`${date}T${endTime}`) : null

    const totalHours = end ? calculateHours(start, end) : null

    const session = await prisma.cleaningSession.create({
      data: {
        staffId,
        date: sessionDate,
        startTime: start,
        endTime: end,
        totalHours,
        notes: notes?.trim() || null,
      },
      include: { staff: true },
    })

    return NextResponse.json(session, { status: 201 })
  } catch (error) {
    console.error('Error creating cleaning session:', error)
    return NextResponse.json(
      { error: 'Error al crear sesión' },
      { status: 500 }
    )
  }
}