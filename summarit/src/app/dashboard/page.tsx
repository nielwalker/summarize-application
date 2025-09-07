"use client"
import { RequireAuth, useAuth } from '../auth/AuthProvider'
import Link from 'next/link'

export default function DashboardPage() {
  return (
    <RequireAuth>
      <Content />
    </RequireAuth>
  )
}

function Content() {
  const { role, userName, logout } = useAuth()
  return (
    <div style={{ padding: 24 }}>
      <h2>Dashboard</h2>
      <p>Welcome {userName ?? 'user'} ({role ?? 'unknown'})</p>
      <Link href="/" style={{ marginRight: 12 }}>Home</Link>
      <button onClick={logout}>Logout</button>
    </div>
  )
}


