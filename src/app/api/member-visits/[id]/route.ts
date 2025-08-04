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
    const { notes } = body

    // Check if visit exists
    const existingVisit = await prisma.memberVisit.findUnique({
      where: { id }
    })

    if (!existingVisit) {
      return NextResponse.json(
        { error: 'Visit not found' },
        { status: 404 }
      )
    }

    // Update visit (mainly notes, as other fields shouldn't change)
    const updatedVisit = await prisma.memberVisit.update({
      where: { id },
      data: {
        notes: notes || null
      },
      include: {
        member: true,
        membership: {
          include: {
            plan: true
          }
        }
      }
    })

    return NextResponse.json(updatedVisit)
  } catch (error) {
    console.error('Error updating visit:', error)
    return NextResponse.json(
      { error: 'Failed to update visit' },
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

    // Get visit details first to restore class count
    const visit = await prisma.memberVisit.findUnique({
      where: { id },
      include: {
        membership: true
      }
    })

    if (!visit) {
      return NextResponse.json(
        { error: 'Visit not found' },
        { status: 404 }
      )
    }

    // Use transaction to ensure consistency
    await prisma.$transaction(async (tx) => {
      // Delete the visit
      await tx.memberVisit.delete({
        where: { id }
      })

      // Restore class count to membership (add 1 back)
      if (visit.membership) {
        await tx.membership.update({
          where: { id: visit.membership.id },
          data: {
            classCount: {
              increment: 1
            }
          }
        })
      }
    })

    return NextResponse.json({ 
      message: 'Visit deleted successfully and class count restored'
    })
  } catch (error) {
    console.error('Error deleting visit:', error)
    return NextResponse.json(
      { error: 'Failed to delete visit' },
      { status: 500 }
    )
  }
}