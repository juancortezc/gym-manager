import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const transactions = await prisma.cashTransaction.findMany()
    
    const totalIncome = transactions
      .filter(t => t.type === 'INCOME')
      .reduce((sum, t) => sum + t.amount, 0)
    
    const totalExpense = transactions
      .filter(t => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + t.amount, 0)
    
    const currentBalance = totalIncome - totalExpense

    // Get current month stats
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)

    const monthlyTransactions = transactions.filter(
      t => t.date >= startOfMonth && t.date <= endOfMonth
    )

    const monthlyIncome = monthlyTransactions
      .filter(t => t.type === 'INCOME')
      .reduce((sum, t) => sum + t.amount, 0)
    
    const monthlyExpense = monthlyTransactions
      .filter(t => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + t.amount, 0)

    return NextResponse.json({
      currentBalance,
      totalIncome,
      totalExpense,
      monthlyIncome,
      monthlyExpense,
      monthlyNet: monthlyIncome - monthlyExpense,
    })
  } catch (error) {
    console.error('Error calculating balance:', error)
    return NextResponse.json(
      { error: 'Error al calcular balance' },
      { status: 500 }
    )
  }
}