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

    // Get all active cleaning staff
    const cleaningStaff = await prisma.cleaningStaff.findMany({
      where: {
        active: true
      },
      include: {
        workSessions: {
          where: {
            date: {
              gte: startDate,
              lte: endDate
            },
            endTime: {
              not: null // Only completed sessions
            },
            totalHours: {
              not: null
            }
          },
          orderBy: {
            date: 'asc'
          }
        }
      }
    })

    // Process data for each cleaning staff member
    const cleaningReports = cleaningStaff.map(staff => {
      const sessions = staff.workSessions
      
      // Calculate totals
      const totalHours = sessions.reduce((sum, session) => sum + (session.totalHours || 0), 0)
      const totalPayment = totalHours * staff.hourlyRate

      // Group sessions by day for detail view
      const sessionsByDay = sessions.reduce((acc, session) => {
        const dateKey = session.date.toISOString().split('T')[0]
        if (!acc[dateKey]) {
          acc[dateKey] = []
        }
        acc[dateKey].push({
          id: session.id,
          startTime: session.startTime,
          endTime: session.endTime,
          totalHours: session.totalHours,
          notes: session.notes
        })
        return acc
      }, {} as Record<string, {
        id: string
        startTime: Date
        endTime: Date | null
        totalHours: number | null
        notes: string | null
      }[]>)

      // Convert to array and sort by date
      const dailySummary = Object.entries(sessionsByDay)
        .map(([date, sessions]) => ({
          date,
          sessions,
          dayTotalHours: sessions.reduce((sum, s) => sum + (s.totalHours || 0), 0)
        }))
        .sort((a, b) => a.date.localeCompare(b.date))

      return {
        id: staff.id,
        name: staff.name,
        hourlyRate: staff.hourlyRate,
        totalHours: Math.round(totalHours * 100) / 100, // Round to 2 decimal places
        totalPayment: Math.round(totalPayment * 100) / 100,
        sessionCount: sessions.length,
        daysWorked: Object.keys(sessionsByDay).length,
        dailySummary
      }
    })

    // Filter out staff with no sessions and sort by total payment descending
    const activeCleaningReports = cleaningReports
      .filter(report => report.sessionCount > 0)
      .sort((a, b) => b.totalPayment - a.totalPayment)

    // Calculate summary statistics
    const summary = {
      totalStaff: activeCleaningReports.length,
      totalHours: activeCleaningReports.reduce((sum, s) => sum + s.totalHours, 0),
      totalPayments: activeCleaningReports.reduce((sum, s) => sum + s.totalPayment, 0),
      totalSessions: activeCleaningReports.reduce((sum, s) => sum + s.sessionCount, 0)
    }

    return NextResponse.json({
      month,
      year,
      summary: {
        ...summary,
        totalHours: Math.round(summary.totalHours * 100) / 100,
        totalPayments: Math.round(summary.totalPayments * 100) / 100
      },
      staff: activeCleaningReports
    })
  } catch (error) {
    console.error('Error fetching cleaning reports:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}