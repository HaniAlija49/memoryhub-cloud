import { NextResponse } from 'next/server'
import { validateApiKey, AuthError } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Validate API key and get user
    const user = await validateApiKey()

    // Get total memory count for user
    const totalMemories = await prisma.memory.count({
      where: { userId: user.id },
    })

    // Get memory count by project
    const memoriesByProjectRaw = await prisma.memory.groupBy({
      by: ['project'],
      where: { userId: user.id },
      _count: {
        id: true,
      },
    })

    // Format as object for frontend
    const memoriesByProject: Record<string, number> = {}
    memoriesByProjectRaw.forEach((item) => {
      const projectName = item.project || 'Uncategorized'
      memoriesByProject[projectName] = item._count.id
    })

    // Get recent memories
    const recentMemories = await prisma.memory.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: {
        id: true,
        content: true,
        project: true,
        createdAt: true,
      },
    })

    // Return stats in the format expected by frontend
    return NextResponse.json({
      status: 'success',
      data: {
        totalMemories,
        memoriesByProject,
        recentMemories,
      },
    })
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json(
        { status: 'error', error: error.message },
        { status: error.statusCode }
      )
    }

    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { status: 'error', error: 'Failed to fetch statistics' },
      { status: 500 }
    )
  }
}
