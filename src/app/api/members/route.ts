import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateMembershipNumber } from '@/lib/utils'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const active = searchParams.get('active')

    let whereCondition: any = {}
    
    if (active !== null) {
      whereCondition.active = active === 'true'
    }

    const members = await prisma.member.findMany({
      where: whereCondition,
      include: {
        memberships: {
          include: {
            plan: true,
          },
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: { visits: true },
        },
      },
      orderBy: { firstName: 'asc' },
    })

    return NextResponse.json(members)
  } catch (error) {
    console.error('Error fetching members:', error)
    return NextResponse.json(
      { error: 'Error al obtener miembros' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { firstName, lastName, gender, phone, email } = await request.json()

    if (!firstName || !lastName || !gender) {
      return NextResponse.json(
        { error: 'Nombre, apellido y género son requeridos' },
        { status: 400 }
      )
    }

    const membershipNumber = generateMembershipNumber()

    const member = await prisma.member.create({
      data: {
        membershipNumber,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        gender,
        phone: phone?.trim() || null,
        email: email?.trim() || null,
      },
      include: {
        memberships: {
          include: {
            plan: true,
          },
        },
        _count: {
          select: { visits: true },
        },
      },
    })

    return NextResponse.json(member, { status: 201 })
  } catch (error) {
    console.error('Error creating member:', error)
    return NextResponse.json(
      { error: 'Error al crear miembro' },
      { status: 500 }
    )
  }
}