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

export async function POST(req: NextRequest) {
  try {
    const { studentId, role } = await req.json()
    
    if (!studentId || !role) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400, headers: corsHeaders as Record<string, string> })
    }

    if (role === 'student') {
      try {
        // Check if student is registered by chairman in database (SECURITY VALIDATION)
        const student = await prisma.studentEnrollment.findUnique({
          where: { studentId }
        })
        
        if (!student) {
          return NextResponse.json({ 
            error: 'Student is not registered. Please contact the chairman to register your account.',
            details: 'Only students registered by the chairman can access the system.'
          }, { status: 404, headers: corsHeaders as Record<string, string> })
        }
        
        const token = `token-${Math.random().toString(36).slice(2)}`
        
        return NextResponse.json({ 
          success: true, 
          token,
          role,
          studentId,
          userName: student.userName,
          section: student.section,
          companyName: student.companyName
        }, { headers: corsHeaders as Record<string, string> })
      } catch (error: any) {
        console.error('Database error:', error)
        return NextResponse.json({ 
          error: 'Database connection failed. Please try again later.',
          details: 'Unable to verify student registration.'
        }, { status: 500, headers: corsHeaders as Record<string, string> })
      }
    } else {
      // For coordinator and chairman, simple validation
      const token = `token-${Math.random().toString(36).slice(2)}`
      
      return NextResponse.json({ 
        success: true, 
        token,
        role,
        userName: role === 'coordinator' ? 'Coordinator User' : 'Chairman User'
      }, { headers: corsHeaders as Record<string, string> })
    }
    
  } catch (error: any) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Login failed' }, { status: 500, headers: corsHeaders as Record<string, string> })
  }
}
