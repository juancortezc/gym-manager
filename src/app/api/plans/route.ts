import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const plans = await prisma.plan.findMany({
      where: { active: true },
      orderBy: { name: 'asc' },
    })

    return NextResponse.json(plans)
  } catch (error) {
    console.error('Error fetching plans:', error)
    return NextResponse.json(
      { error: 'Error al obtener planes' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, durationInDays, classesPerWeek, totalClasses, price } = await request.json()

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

    const plan = await prisma.plan.create({
      data: {
        name: name.trim(),
        durationInDays: parseInt(durationInDays),
        classesPerWeek: parseInt(classesPerWeek),
        totalClasses: parseInt(totalClasses),
        price: parseFloat(price),
      },
    })

    return NextResponse.json(plan, { status: 201 })
  } catch (error) {
    console.error('Error creating plan:', error)
    return NextResponse.json(
      { error: 'Error al crear plan' },
      { status: 500 }
    )
  }
}