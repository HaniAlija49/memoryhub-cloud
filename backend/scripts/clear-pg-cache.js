const { PrismaClient } = require('@prisma/client')

async function clearCache() {
  const prisma = new PrismaClient()

  try {
    console.log('Clearing PostgreSQL prepared statement cache...')
    await prisma.$executeRawUnsafe('DISCARD ALL')
    console.log('✅ Cache cleared successfully')
  } catch (error) {
    console.error('Error clearing cache:', error)
  } finally {
    await prisma.$disconnect()
  }
}

clearCache()
