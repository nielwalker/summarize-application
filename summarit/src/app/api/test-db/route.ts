import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '../../../lib/prisma'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  'Access-Control-Allow-Credentials': 'true',
  'Cache-Control': 'no-cache, no-store, must-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0'
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders as Record<string, string> })
}

export async function GET(req: NextRequest) {
  try {
    // Test database connection
    const students = await prisma.studentEnrollment.findMany({
      take: 5,
      select: {
        studentId: true,
        userName: true,
        section: true,
        companyName: true
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      students: students,
      count: students.length
    }, { headers: corsHeaders as Record<string, string> })

  } catch (error: any) {
    console.error('Database test error:', error)
    return NextResponse.json({
      success: false,
      error: 'Database connection failed',
      details: error.message || 'Unknown error'
    }, { status: 500, headers: corsHeaders as Record<string, string> })
  }
}
