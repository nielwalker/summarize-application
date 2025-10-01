import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

// Use global prisma client to avoid connection issues
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Cache-Control': 'no-cache, no-store, must-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0'
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders as Record<string, string> })
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const action = url.searchParams.get('action')
    const section = url.searchParams.get('section')
    const studentId = url.searchParams.get('studentId')

    if (action === 'listStudents' && section) {
      try {
        const students = await prisma.studentEnrollment.findMany({
          where: { section },
          select: {
            studentId: true,
            userName: true,
            section: true,
            companyName: true
          },
          orderBy: {
            studentId: 'asc'
          }
        })
        
        return NextResponse.json(students, { headers: corsHeaders as Record<string, string> })
      } catch (error: any) {
        console.error('Error fetching students:', error)
        return NextResponse.json({ error: 'Failed to fetch students' }, { status: 500, headers: corsHeaders as Record<string, string> })
      }
    }

    if (action === 'getStudentDetails' && studentId) {
      try {
        const student = await prisma.studentEnrollment.findUnique({
          where: { studentId }
        })
        
        if (!student) {
          return NextResponse.json({ error: 'Student not found' }, { status: 404, headers: corsHeaders as Record<string, string> })
        }

        // Get coordinator for the student's section
        const coordinator = await prisma.coordinator.findFirst({
          where: {
            sections: {
              has: student.section
            }
          }
        })

        return NextResponse.json({
          student: {
            studentId: student.studentId,
            userName: student.userName,
            section: student.section,
            companyName: student.companyName
          },
          coordinator: coordinator ? {
            userName: coordinator.userName,
            sections: coordinator.sections
          } : null
        }, { headers: corsHeaders as Record<string, string> })
      } catch (error: any) {
        console.error('Error fetching student details:', error)
        return NextResponse.json({ error: 'Failed to fetch student details' }, { status: 500, headers: corsHeaders as Record<string, string> })
      }
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400, headers: corsHeaders as Record<string, string> })
    
  } catch (error: any) {
    console.error('Admin API error:', error)
    return NextResponse.json({ error: 'Admin API failed' }, { status: 500, headers: corsHeaders as Record<string, string> })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null) as any
    if (!body) return NextResponse.json({ error: 'Invalid JSON' }, { status: 400, headers: corsHeaders as Record<string, string> })

    if (body.action === 'registerStudent') {
      const { studentId, userName, section, companyName } = body
      if (!studentId || !section) return NextResponse.json({ error: 'studentId and section required' }, { status: 400, headers: corsHeaders as Record<string, string> })
      const name = userName || studentId

      try {
        // Create company if provided
        let company = null
        if (companyName) {
          company = await prisma.company.upsert({
            where: { name: companyName },
            update: {},
            create: { name: companyName },
          })
        }

        // Register student in database
        const student = await prisma.studentEnrollment.upsert({
          where: { studentId },
          update: { 
            section, 
            userName: name, 
            companyName: companyName || null 
          },
          create: { 
            studentId, 
            section, 
            userName: name, 
            companyName: companyName || null 
          },
        })

        return NextResponse.json({ 
          success: true, 
          message: 'Student registered successfully',
          student: { 
            studentId: student.studentId, 
            userName: student.userName, 
            section: student.section, 
            companyName: student.companyName 
          }
        }, { headers: corsHeaders as Record<string, string> })
      } catch (error: any) {
        console.error('Registration error:', error)
        return NextResponse.json({ 
          error: 'Registration failed: ' + (error.message || 'Unknown error') 
        }, { status: 500, headers: corsHeaders as Record<string, string> })
      }
    }

    if (body.action === 'registerCoordinator') {
      const { userName, sections } = body
      if (!userName) return NextResponse.json({ error: 'userName required' }, { status: 400, headers: corsHeaders as Record<string, string> })
      
      try {
        const coordinator = await prisma.coordinator.upsert({
          where: { userName },
          update: { 
            sections: Array.isArray(sections) ? sections : [sections].filter(Boolean)
          },
          create: { 
            userName, 
            sections: Array.isArray(sections) ? sections : [sections].filter(Boolean),
            approved: true
          },
        })

        return NextResponse.json({ 
          success: true, 
          message: 'Coordinator registered successfully',
          coordinator: { 
            id: coordinator.id,
            userName: coordinator.userName, 
            sections: coordinator.sections,
            approved: coordinator.approved
          }
        }, { headers: corsHeaders as Record<string, string> })
      } catch (error: any) {
        console.error('Coordinator registration error:', error)
        return NextResponse.json({ 
          error: 'Coordinator registration failed: ' + (error.message || 'Unknown error') 
        }, { status: 500, headers: corsHeaders as Record<string, string> })
      }
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400, headers: corsHeaders as Record<string, string> })
  } catch (error: any) {
    console.error('Admin POST error:', error)
    return NextResponse.json({ error: 'Admin POST failed' }, { status: 500, headers: corsHeaders as Record<string, string> })
  }
}
