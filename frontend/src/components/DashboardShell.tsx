import { Link, useLocation } from 'react-router-dom'
import type React from 'react'

type Props = { children: React.ReactNode }

export default function DashboardShell({ children }: Props) {
  const { pathname } = useLocation()
  const active = (path: string) => pathname === path ? '#1d4ed8' : 'transparent'
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside style={{ width: 180, background: '#3b82f6', color: '#fff', paddingTop: 24, flexShrink: 0 }}>
        <nav style={{ display: 'grid', gap: 8, padding: '0 12px' }}>
          <Link to="/student" style={{ background: active('/student'), color: '#fff', padding: '10px 12px', borderRadius: 6, textDecoration: 'none' }}>Student</Link>
          <Link to="/coordinator" style={{ background: active('/coordinator'), color: '#fff', padding: '10px 12px', borderRadius: 6, textDecoration: 'none' }}>Coordinator</Link>
          <Link to="/chairman" style={{ background: active('/chairman'), color: '#fff', padding: '10px 12px', borderRadius: 6, textDecoration: 'none' }}>Chairman</Link>
        </nav>
      </aside>
      <main style={{ flex: 1, padding: 24, display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: 960, minWidth: 960 }}>{children}</div>
      </main>
    </div>
  )
}


