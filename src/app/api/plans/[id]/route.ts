import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { name, durationInDays, classesPerWeek, totalClasses, price, active } = await request.json()
    const { id } = await params

    if (!name || !durationInDays || !classesPerWeek || !totalClasses || !price) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      )
    }

    if (durationInDays <= 0 || classesPerWeek <= 0 || totalClasses <= 0 || price <= 0) {
      return NextResponse.json(
        { error: 'Los valores numéricos deben ser mayores a 0' },
        { status: 400 }
      )
    }

    const plan = await prisma.plan.update({
      where: { id },
      data: {
        name: name.trim(),
        durationInDays: parseInt(durationInDays),
        classesPerWeek: parseInt(classesPerWeek),
        totalClasses: parseInt(totalClasses),
        price: parseFloat(price),
        active: active ?? true,
      },
    })

    return NextResponse.json(plan)
  } catch (error) {
    console.error('Error updating plan:', error)
    return NextResponse.json(
      { error: 'Error al actualizar plan' },
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

    await prisma.plan.update({
      where: { id },
      data: { active: false },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deactivating plan:', error)
    return NextResponse.json(
      { error: 'Error al desactivar plan' },
      { status: 500 }
    )
  }
}