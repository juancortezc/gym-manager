import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    const { planId, startDate, classCount, active } = body

    // Validate required fields
    if (!planId || !startDate) {
      return NextResponse.json(
        { error: 'Plan ID and start date are required' },
        { status: 400 }
      )
    }

    // Check if membership exists
    const existingMembership = await prisma.membership.findUnique({
      where: { id }
    })

    if (!existingMembership) {
      return NextResponse.json(
        { error: 'Membership not found' },
        { status: 404 }
      )
    }

    // Check if plan exists
    const plan = await prisma.plan.findUnique({
      where: { id: planId }
    })

    if (!plan) {
      return NextResponse.json(
        { error: 'Plan not found' },
        { status: 404 }
      )
    }

    // Update membership
    const updatedMembership = await prisma.membership.update({
      where: { id },
      data: {
        planId,
        startDate: new Date(startDate),
        classCount: classCount !== undefined ? classCount : undefined,
        active: active !== undefined ? active : undefined
      },
      include: {
        plan: true,
        member: true
      }
    })

    return NextResponse.json(updatedMembership)
  } catch (error) {
    console.error('Error updating membership:', error)
    return NextResponse.json(
      { error: 'Failed to update membership' },
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

    // Check if membership exists
    const existingMembership = await prisma.membership.findUnique({
      where: { id }
    })

    if (!existingMembership) {
      return NextResponse.json(
        { error: 'Membership not found' },
        { status: 404 }
      )
    }

    // Soft delete - deactivate membership
    const deactivatedMembership = await prisma.membership.update({
      where: { id },
      data: { active: false }
    })

    return NextResponse.json({ 
      message: 'Membership deactivated successfully',
      membership: deactivatedMembership 
    })
  } catch (error) {
    console.error('Error deactivating membership:', error)
    return NextResponse.json(
      { error: 'Failed to deactivate membership' },
      { status: 500 }
    )
  }
}