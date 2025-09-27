import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  // Do not expose the key; only report its presence
  const hasOpenAIKey = Boolean(process.env.OPENAI_API_KEY)
  // Try a lightweight DB query to validate Prisma wiring
  let dbOk = true
  try {
    await prisma.$queryRaw`SELECT 1`
  } catch {
    dbOk = false
  }
  return NextResponse.json({ ok: true, status: 'healthy', hasOpenAIKey, dbOk, timestamp: Date.now() })
}


