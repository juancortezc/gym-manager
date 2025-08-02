import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const now = new Date()
    const threeDaysFromNow = new Date()
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3)

    // Get memberships expiring in the next 3 days
    const expiringMemberships = await prisma.membership.findMany({
      where: {
        active: true,
        endDate: {
          gte: now,
          lte: threeDaysFromNow,
        },
      },
      include: {
        member: true,
        plan: true,
      },
      orderBy: { endDate: 'asc' },
    })

    // Get members with low class count (1 or 0 remaining)
    const lowClassMemberships = await prisma.membership.findMany({
      where: {
        active: true,
        endDate: {
          gte: now,
        },
      },
      include: {
        member: true,
        plan: true,
      },
    })

    const lowClassNotifications = lowClassMemberships.filter(membership => {
      const remainingClasses = membership.plan.totalClasses - membership.classesUsed
      return remainingClasses <= 1
    })

    const notifications = [
      ...expiringMemberships.map(membership => ({
        id: `exp-${membership.id}`,
        type: 'expiring',
        title: 'Membresía próxima a vencer',
        message: `${membership.member.firstName} ${membership.member.lastName} - Vence el ${membership.endDate.toLocaleDateString()}`,
        priority: 'high',
        memberId: membership.memberId,
        membershipId: membership.id,
        daysUntilExpiry: Math.ceil((membership.endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
      })),
      ...lowClassNotifications.map(membership => ({
        id: `class-${membership.id}`,
        type: 'low_classes',
        title: 'Pocas clases restantes',
        message: `${membership.member.firstName} ${membership.member.lastName} - ${membership.plan.totalClasses - membership.classesUsed} clase(s) restante(s)`,
        priority: 'medium',
        memberId: membership.memberId,
        membershipId: membership.id,
        remainingClasses: membership.plan.totalClasses - membership.classesUsed,
      })),
    ]

    return NextResponse.json(notifications)
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json(
      { error: 'Error al obtener notificaciones' },
      { status: 500 }
    )
  }
}