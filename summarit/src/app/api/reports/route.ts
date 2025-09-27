import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders as Record<string, string> })
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const userName = url.searchParams.get('userName') || undefined
  const weekNumber = url.searchParams.get('weekNumber')
  const section = url.searchParams.get('section') || undefined
  const studentId = url.searchParams.get('studentId') || undefined
  const where: any = {}
  if (userName) where.userName = userName
  if (weekNumber) where.weekNumber = Number(weekNumber)
  if (section) where.section = section
  if (studentId) where.studentId = studentId
  const reports = await prisma.weeklyReport.findMany({ where, orderBy: { id: 'desc' } })
  return NextResponse.json(reports, { headers: corsHeaders as Record<string, string> })
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null) as any
  if (!body) return NextResponse.json({ error: 'Invalid JSON' }, { status: 400, headers: corsHeaders as Record<string, string> })
  
  // Check if a record already exists for this student, week, and date
  const existingRecord = await prisma.weeklyReport.findFirst({
    where: {
      studentId: body.studentId ? String(body.studentId) : null,
      weekNumber: Number(body.weekNumber ?? 1),
      date: String(body.date ?? ''),
      section: String(body.section ?? '')
    }
  })

  const reportData = {
    userName: String(body.userName ?? ''),
    role: String(body.role ?? 'student'),
    section: String(body.section ?? ''),
    studentId: body.studentId ? String(body.studentId) : null,
    weekNumber: Number(body.weekNumber ?? 1),
    date: String(body.date ?? ''),
    hours: Number(body.hours ?? 0),
    activities: String(body.activities ?? ''),
    score: Number(body.score ?? 0),
    learnings: String(body.learnings ?? ''),
  }

  let result
  if (existingRecord) {
    // Update existing record
    result = await prisma.weeklyReport.update({
      where: { id: existingRecord.id },
      data: reportData
    })
  } else {
    // Create new record
    result = await prisma.weeklyReport.create({ data: reportData })
  }
  
  return NextResponse.json(result, { status: existingRecord ? 200 : 201, headers: corsHeaders as Record<string, string> })
}

export async function DELETE(req: NextRequest) {
  const url = new URL(req.url)
  const id = url.searchParams.get('id')
  
  if (!id) {
    return NextResponse.json({ error: 'Report ID is required' }, { status: 400, headers: corsHeaders as Record<string, string> })
  }

  try {
    await prisma.weeklyReport.delete({
      where: { id: Number(id) }
    })
    return NextResponse.json({ message: 'Report deleted successfully' }, { headers: corsHeaders as Record<string, string> })
  } catch (error) {
    return NextResponse.json({ error: 'Report not found or could not be deleted' }, { status: 404, headers: corsHeaders as Record<string, string> })
  }
}


