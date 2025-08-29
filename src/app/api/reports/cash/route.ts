import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const monthParam = searchParams.get('month')
    const yearParam = searchParams.get('year')

    if (!monthParam || !yearParam) {
      return NextResponse.json(
        { error: 'Month and year parameters are required' },
        { status: 400 }
      )
    }

    const month = parseInt(monthParam)
    const year = parseInt(yearParam)

    if (isNaN(month) || isNaN(year) || month < 1 || month > 12) {
      return NextResponse.json(
        { error: 'Invalid month or year parameters' },
        { status: 400 }
      )
    }

    // Calculate date range for the specified month
    const startDate = new Date(year, month - 1, 1) // month - 1 because Date months are 0-indexed
    const endDate = new Date(year, month, 0) // Last day of the month
    endDate.setHours(23, 59, 59, 999) // End of the day

    // Get all transactions for the specified month
    const transactions = await prisma.cashTransaction.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate
        }
      },
      orderBy: {
        date: 'desc'
      }
    })

    // Group transactions by type (INCOME vs EXPENSE)
    const incomeTransactions = transactions.filter(t => t.type === 'INCOME')
    const expenseTransactions = transactions.filter(t => t.type === 'EXPENSE')

    // Group transactions by day
    const transactionsByDay = transactions.reduce((acc, transaction) => {
      const dateKey = transaction.date.toISOString().split('T')[0]
      if (!acc[dateKey]) {
        acc[dateKey] = {
          date: dateKey,
          transactions: [],
          dailyIncome: 0,
          dailyExpense: 0,
          dailyBalance: 0
        }
      }
      acc[dateKey].transactions.push({
        id: transaction.id,
        type: transaction.type,
        amount: transaction.amount,
        description: transaction.description,
        document: transaction.document,
        responsible: transaction.responsible,
        time: transaction.date.toLocaleTimeString('es-CO', { 
          hour: '2-digit', 
          minute: '2-digit' 
        })
      })
      
      if (transaction.type === 'INCOME') {
        acc[dateKey].dailyIncome += transaction.amount
      } else {
        acc[dateKey].dailyExpense += transaction.amount
      }
      acc[dateKey].dailyBalance = acc[dateKey].dailyIncome - acc[dateKey].dailyExpense
      
      return acc
    }, {} as Record<string, any>)

    // Convert to array and sort by date
    const dailySummary = Object.values(transactionsByDay)
      .sort((a: any, b: any) => b.date.localeCompare(a.date))

    // Group transactions by responsible person
    const transactionsByResponsible = transactions.reduce((acc, transaction) => {
      const responsible = transaction.responsible
      if (!acc[responsible]) {
        acc[responsible] = {
          name: responsible,
          totalTransactions: 0,
          totalIncome: 0,
          totalExpense: 0,
          balance: 0,
          transactions: []
        }
      }
      
      acc[responsible].totalTransactions++
      acc[responsible].transactions.push({
        id: transaction.id,
        type: transaction.type,
        amount: transaction.amount,
        description: transaction.description,
        document: transaction.document,
        date: transaction.date.toISOString().split('T')[0],
        time: transaction.date.toLocaleTimeString('es-CO', { 
          hour: '2-digit', 
          minute: '2-digit' 
        })
      })
      
      if (transaction.type === 'INCOME') {
        acc[responsible].totalIncome += transaction.amount
      } else {
        acc[responsible].totalExpense += transaction.amount
      }
      acc[responsible].balance = acc[responsible].totalIncome - acc[responsible].totalExpense
      
      return acc
    }, {} as Record<string, any>)

    const responsibleSummary = Object.values(transactionsByResponsible)
      .sort((a: any, b: any) => b.totalTransactions - a.totalTransactions)

    // Calculate totals
    const totalIncome = incomeTransactions.reduce((sum, t) => sum + t.amount, 0)
    const totalExpense = expenseTransactions.reduce((sum, t) => sum + t.amount, 0)
    const netBalance = totalIncome - totalExpense

    // Calculate summary statistics
    const summary = {
      totalTransactions: transactions.length,
      totalIncome: Math.round(totalIncome * 100) / 100,
      totalExpense: Math.round(totalExpense * 100) / 100,
      netBalance: Math.round(netBalance * 100) / 100,
      incomeTransactions: incomeTransactions.length,
      expenseTransactions: expenseTransactions.length,
      activeDays: Object.keys(transactionsByDay).length,
      uniqueResponsibles: Object.keys(transactionsByResponsible).length
    }

    return NextResponse.json({
      month,
      year,
      summary,
      dailySummary,
      responsibleSummary,
      transactions: transactions.map(t => ({
        id: t.id,
        type: t.type,
        amount: t.amount,
        description: t.description,
        document: t.document,
        responsible: t.responsible,
        date: t.date.toISOString().split('T')[0],
        time: t.date.toLocaleTimeString('es-CO', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        fullDate: t.date
      }))
    })
  } catch (error) {
    console.error('Error fetching cash reports:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}