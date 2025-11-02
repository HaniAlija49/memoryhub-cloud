import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { loginSchema, validateRequest } from '@/lib/validation'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate request with Zod
    const validation = validateRequest(loginSchema, body)
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      )
    }

    const { email } = validation.data

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        apiKey: true,
        createdAt: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Return user data with API key
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        apiKey: user.apiKey,
        createdAt: user.createdAt,
      },
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
