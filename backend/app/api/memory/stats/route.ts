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
    const memoriesByProject = await prisma.memory.groupBy({
      by: ['project'],
      where: { userId: user.id },
      _count: {
        id: true,
      },
    })

    // Format project stats
    const projectStats = memoriesByProject.map((item) => ({
      project: item.project || 'default',
      count: item._count.id,
    }))

    // Get oldest and newest memory dates
    const oldestMemory = await prisma.memory.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: 'asc' },
      select: { createdAt: true },
    })

    const newestMemory = await prisma.memory.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      select: { createdAt: true },
    })

    // Calculate estimated storage (rough estimate)
    const memories = await prisma.memory.findMany({
      where: { userId: user.id },
      select: { content: true, metadata: true },
    })

    let estimatedStorageBytes = 0
    memories.forEach((memory) => {
      estimatedStorageBytes += new Blob([memory.content]).size
      if (memory.metadata) {
        estimatedStorageBytes += new Blob([JSON.stringify(memory.metadata)]).size
      }
      // Add approximate embedding size (384 floats * 4 bytes)
      estimatedStorageBytes += 384 * 4
    })

    const estimatedStorageMB = (estimatedStorageBytes / (1024 * 1024)).toFixed(2)

    // Return stats
    return NextResponse.json({
      success: true,
      stats: {
        totalMemories,
        projectStats,
        oldestMemoryDate: oldestMemory?.createdAt || null,
        newestMemoryDate: newestMemory?.createdAt || null,
        estimatedStorageMB: parseFloat(estimatedStorageMB),
        userId: user.id,
        userEmail: user.email,
        accountCreatedAt: user.createdAt,
      },
    })
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      )
    }

    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    )
  }
}
