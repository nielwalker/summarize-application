import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null) as { userName?: string; role?: 'student' | 'coordinator' | 'chairman' }
  if (!body?.userName || !body?.role) return NextResponse.json({ error: 'userName and role required' }, { status: 400 })

  // Check user record
  const user = await prisma.user.findUnique({ where: { userName: body.userName } })
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })
  if (user.role !== body.role) return NextResponse.json({ error: 'Role mismatch' }, { status: 403 })
  if (user.role === 'coordinator' && !user.approved) return NextResponse.json({ error: 'Coordinator not approved by chairman' }, { status: 403 })
  if (user.role === 'student' && !user.approved) return NextResponse.json({ error: 'Student account not created/approved' }, { status: 403 })

  const token = `token-${Math.random().toString(36).slice(2)}`
  return NextResponse.json({ token, userName: user.userName, role: user.role })
}

export async function PUT(req: NextRequest) {
  // Create users by role with approval workflow
  const body = await req.json().catch(() => null) as { action: 'create'; userName: string; role: 'student' | 'coordinator' | 'chairman'; approved?: boolean }
  if (!body || body.action !== 'create') return NextResponse.json({ error: 'Invalid action' }, { status: 400 })

  // Chairman can create any; Coordinator can create student pending approval; Student cannot create
  // For simplicity in this prototype, allow creation and set approved flag based on role
  const approved = body.role === 'chairman' ? true : body.role === 'coordinator' ? false : false
  const user = await prisma.user.upsert({
    where: { userName: body.userName },
    update: { role: body.role },
    create: { userName: body.userName, role: body.role, approved },
  })
  return NextResponse.json(user)
}


