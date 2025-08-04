import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        createdAt: true,
        updatedAt: true
        // Don't include PIN in response for security
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    const { username, currentPin, newPin } = body

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id }
    })

    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const updateData: any = {}

    // Update username if provided
    if (username) {
      // Check if new username is already taken by another user
      const usernameExists = await prisma.user.findFirst({
        where: {
          username,
          id: { not: id }
        }
      })

      if (usernameExists) {
        return NextResponse.json(
          { error: 'Username already exists' },
          { status: 400 }
        )
      }

      updateData.username = username
    }

    // Update PIN if provided
    if (newPin) {
      // Validate new PIN format
      if (!/^\d{4}$/.test(newPin)) {
        return NextResponse.json(
          { error: 'New PIN must be exactly 4 digits' },
          { status: 400 }
        )
      }

      // Verify current PIN if provided
      if (currentPin) {
        const isCurrentPinValid = await bcrypt.compare(currentPin, existingUser.pin)
        if (!isCurrentPinValid) {
          return NextResponse.json(
            { error: 'Current PIN is incorrect' },
            { status: 400 }
          )
        }
      }

      // Hash new PIN
      updateData.pin = await bcrypt.hash(newPin, 10)
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        username: true,
        createdAt: true,
        updatedAt: true
        // Don't include PIN in response
      }
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { error: 'Failed to update user' },
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

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id }
    })

    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if this is the last user (prevent deletion of last admin)
    const userCount = await prisma.user.count()
    if (userCount <= 1) {
      return NextResponse.json(
        { error: 'Cannot delete the last user' },
        { status: 400 }
      )
    }

    // Delete user
    await prisma.user.delete({
      where: { id }
    })

    return NextResponse.json({ 
      message: 'User deleted successfully' 
    })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    )
  }
}