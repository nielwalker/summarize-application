import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders as Record<string, string> })
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const userName = url.searchParams.get('userName') || undefined
  const weekNumber = url.searchParams.get('weekNumber')
  const where: any = {}
  if (userName) where.userName = userName
  if (weekNumber) where.weekNumber = Number(weekNumber)
  const reports = await prisma.weeklyReport.findMany({ where, orderBy: { id: 'desc' } })
  return NextResponse.json(reports, { headers: corsHeaders as Record<string, string> })
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null) as any
  if (!body) return NextResponse.json({ error: 'Invalid JSON' }, { status: 400, headers: corsHeaders as Record<string, string> })
  const created = await prisma.weeklyReport.create({ data: {
    userName: String(body.userName ?? ''),
    role: String(body.role ?? 'student'),
    weekNumber: Number(body.weekNumber ?? 1),
    date: String(body.date ?? ''),
    hours: Number(body.hours ?? 0),
    activities: String(body.activities ?? ''),
    score: Number(body.score ?? 0),
    learnings: String(body.learnings ?? ''),
  }})
  return NextResponse.json(created, { status: 201, headers: corsHeaders as Record<string, string> })
}


