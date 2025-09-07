import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null) as { userName?: string; role?: string }
  const userName = body?.userName || 'user'
  const role = body?.role === 'student' || body?.role === 'coordinator' || body?.role === 'chairman' ? body.role : 'student'
  const token = `token-${Math.random().toString(36).slice(2)}`
  return NextResponse.json({ token, userName, role })
}


