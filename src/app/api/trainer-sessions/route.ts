import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { calculateHours } from '@/lib/utils'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const month = searchParams.get('month')
    const year = searchParams.get('year')
    const trainerId = searchParams.get('trainerId')

    let whereCondition: any = {}

    if (trainerId) {
      whereCondition.trainerId = trainerId
    }

    if (month && year) {
      const startDate = new Date(parseInt(year), parseInt(month) - 1, 1)
      const endDate = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59)
      
      whereCondition.date = {
        gte: startDate,
        lte: endDate,
      }
    }

    const sessions = await prisma.trainerSession.findMany({
      where: whereCondition,
      include: {
        trainer: true,
      },
      orderBy: { date: 'desc' },
    })

    return NextResponse.json(sessions)
  } catch (error) {
    console.error('Error fetching trainer sessions:', error)
    return NextResponse.json(
      { error: 'Error al obtener sesiones' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { trainerId, date, startTime, endTime, notes } = await request.json()

    if (!trainerId || !date || !startTime) {
      return NextResponse.json(
        { error: 'Entrenador, fecha y hora de inicio son requeridos' },
        { status: 400 }
      )
    }

    const sessionDate = new Date(date)
    const start = new Date(`${date}T${startTime}`)
    const end = endTime ? new Date(`${date}T${endTime}`) : null

    const totalHours = end ? calculateHours(start, end) : null

    const session = await prisma.trainerSession.create({
      data: {
        trainerId,
        date: sessionDate,
        startTime: start,
        endTime: end,
        totalHours,
        notes: notes?.trim() || null,
      },
      include: { trainer: true },
    })

    return NextResponse.json(session, { status: 201 })
  } catch (error) {
    console.error('Error creating trainer session:', error)
    return NextResponse.json(
      { error: 'Error al crear sesión' },
      { status: 500 }
    )
  }
}