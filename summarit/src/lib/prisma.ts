import { PrismaClient } from '@prisma/client'

// Global variable to store Prisma client
declare global {
  var prisma: PrismaClient | undefined
}

// Create Prisma client with serverless optimizations
const prisma = globalThis.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
})

// In development, store the client globally to prevent multiple instances
if (process.env.NODE_ENV === 'development') {
  globalThis.prisma = prisma
}

export { prisma }
