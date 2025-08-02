import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const month = searchParams.get('month')
    const year = searchParams.get('year')
    const type = searchParams.get('type')

    let whereCondition: any = {}

    if (type && type !== 'ALL') {
      whereCondition.type = type
    }

    if (month && year) {
      const startDate = new Date(parseInt(year), parseInt(month) - 1, 1)
      const endDate = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59)
      
      whereCondition.date = {
        gte: startDate,
        lte: endDate,
      }
    }

    const transactions = await prisma.cashTransaction.findMany({
      where: whereCondition,
      orderBy: { date: 'desc' },
    })

    return NextResponse.json(transactions)
  } catch (error) {
    console.error('Error fetching cash transactions:', error)
    return NextResponse.json(
      { error: 'Error al obtener transacciones' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { type, amount, description, document, responsible, date } = await request.json()

    if (!type || !amount || !description || !responsible) {
      return NextResponse.json(
        { error: 'Tipo, monto, descripción y responsable son requeridos' },
        { status: 400 }
      )
    }

    if (!['INCOME', 'EXPENSE'].includes(type)) {
      return NextResponse.json(
        { error: 'Tipo debe ser INCOME o EXPENSE' },
        { status: 400 }
      )
    }

    if (amount <= 0) {
      return NextResponse.json(
        { error: 'El monto debe ser mayor a 0' },
        { status: 400 }
      )
    }

    const transaction = await prisma.cashTransaction.create({
      data: {
        type,
        amount: parseFloat(amount),
        description: description.trim(),
        document: document?.trim() || null,
        responsible: responsible.trim(),
        date: date ? new Date(date) : new Date(),
      },
    })

    return NextResponse.json(transaction, { status: 201 })
  } catch (error) {
    console.error('Error creating cash transaction:', error)
    return NextResponse.json(
      { error: 'Error al crear transacción' },
      { status: 500 }
    )
  }
}