import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { type, amount, description, document, responsible, date } = await request.json()
    const { id } = await params

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

    const transaction = await prisma.cashTransaction.update({
      where: { id },
      data: {
        type,
        amount: parseFloat(amount),
        description: description.trim(),
        document: document?.trim() || null,
        responsible: responsible.trim(),
        date: date ? new Date(date) : undefined,
      },
    })

    return NextResponse.json(transaction)
  } catch (error) {
    console.error('Error updating cash transaction:', error)
    return NextResponse.json(
      { error: 'Error al actualizar transacción' },
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

    await prisma.cashTransaction.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting cash transaction:', error)
    return NextResponse.json(
      { error: 'Error al eliminar transacción' },
      { status: 500 }
    )
  }
}