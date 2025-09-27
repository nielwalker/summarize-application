import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders as Record<string, string> })
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null) as { userName?: string; role?: 'student' | 'coordinator' | 'chairman'; sections?: string[]; studentId?: string; section?: string }
  if (!body?.role) return NextResponse.json({ error: 'role required' }, { status: 400, headers: corsHeaders as Record<string, string> })

      if (body.role === 'student') {
    // For students, require studentId and validate against enrollment
    if (!body.studentId) return NextResponse.json({ error: 'studentId required for student login' }, { status: 400, headers: corsHeaders as Record<string, string> })
    
    // Check if student is registered in StudentEnrollment
    const enrollment = await prisma.studentEnrollment.findUnique({ where: { studentId: body.studentId } })
    if (!enrollment) return NextResponse.json({ error: 'Student is not registered. Ask chairman to register.' }, { status: 403, headers: corsHeaders as Record<string, string> })

    const token = `token-${Math.random().toString(36).slice(2)}`
    return NextResponse.json({ 
      token, 
          userName: enrollment.userName, 
          role: 'student', 
          sections: [enrollment.section], 
          studentId: enrollment.studentId,
      section: enrollment.section 
    }, { headers: corsHeaders as Record<string, string> })
  } else {
        // For coordinators and chairmen, require userName
    if (!body.userName) return NextResponse.json({ error: 'userName required for non-student roles' }, { status: 400, headers: corsHeaders as Record<string, string> })
        
        if (body.role === 'coordinator') {
          const coord = await prisma.coordinator.findUnique({ where: { userName: body.userName } })
          if (!coord) return NextResponse.json({ error: 'Coordinator not found' }, { status: 404, headers: corsHeaders as Record<string, string> })
          if (!coord.approved) return NextResponse.json({ error: 'Coordinator not approved by chairman' }, { status: 403, headers: corsHeaders as Record<string, string> })
          const token = `token-${Math.random().toString(36).slice(2)}`
          return NextResponse.json({ token, userName: coord.userName, role: 'coordinator', sections: coord.sections }, { headers: corsHeaders as Record<string, string> })
        }

        if (body.role === 'chairman') {
          const token = `token-${Math.random().toString(36).slice(2)}`
          return NextResponse.json({ token, userName: body.userName, role: 'chairman', sections: [] }, { headers: corsHeaders as Record<string, string> })
        }

        return NextResponse.json({ error: 'Unsupported role' }, { status: 400, headers: corsHeaders as Record<string, string> })
  }
}

export async function PUT(req: NextRequest) {
  // Create users by role with approval workflow
  const body = await req.json().catch(() => null) as { action: 'create'; userName: string; role: 'student' | 'coordinator' | 'chairman'; approved?: boolean; sections?: string[] }
  if (!body || body.action !== 'create') return NextResponse.json({ error: 'Invalid action' }, { status: 400, headers: corsHeaders as Record<string, string> })

  // Chairman can create any; Coordinator can create student pending approval; Student cannot create
  // For simplicity in this prototype, allow creation and set approved flag based on role
  const approved = body.role === 'chairman' ? true : body.role === 'coordinator' ? false : false
  const user = await prisma.user.upsert({
    where: { userName: body.userName },
    update: { role: body.role, sections: body.sections ?? [] },
    create: { userName: body.userName, role: body.role, approved, sections: body.sections ?? [] },
  })
  return NextResponse.json(user, { headers: corsHeaders as Record<string, string> })
}


