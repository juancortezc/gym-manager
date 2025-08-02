import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const member = await prisma.member.findUnique({
      where: { id },
      include: {
        memberships: {
          include: {
            plan: true,
          },
          orderBy: { createdAt: 'desc' },
        },
        visits: {
          orderBy: { visitDate: 'desc' },
          take: 20,
        },
        _count: {
          select: { visits: true },
        },
      },
    })

    if (!member) {
      return NextResponse.json(
        { error: 'Miembro no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(member)
  } catch (error) {
    console.error('Error fetching member:', error)
    return NextResponse.json(
      { error: 'Error al obtener miembro' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { firstName, lastName, gender, phone, email, active } = await request.json()
    const { id } = params

    if (!firstName || !lastName || !gender) {
      return NextResponse.json(
        { error: 'Nombre, apellido y género son requeridos' },
        { status: 400 }
      )
    }

    const member = await prisma.member.update({
      where: { id },
      data: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        gender,
        phone: phone?.trim() || null,
        email: email?.trim() || null,
        active: active ?? true,
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

    return NextResponse.json(member)
  } catch (error) {
    console.error('Error updating member:', error)
    return NextResponse.json(
      { error: 'Error al actualizar miembro' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    await prisma.member.update({
      where: { id },
      data: { active: false },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deactivating member:', error)
    return NextResponse.json(
      { error: 'Error al desactivar miembro' },
      { status: 500 }
    )
  }
}