"use client"
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

type UserRole = 'student' | 'coordinator' | 'chairman'

type AuthState = {
  token: string | null
  role: UserRole | null
  userName: string | null
  login: (args: { token: string; role: UserRole; userName: string }) => void
  logout: () => void
}

const AuthContext = createContext<AuthState | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null)
  const [role, setRole] = useState<UserRole | null>(null)
  const [userName, setUserName] = useState<string | null>(null)

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? window.localStorage.getItem('auth') : null
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as { token: string; role: UserRole; userName: string }
        setToken(parsed.token)
        setRole(parsed.role)
        setUserName(parsed.userName)
      } catch {}
    }
  }, [])

  const value = useMemo<AuthState>(() => ({
    token,
    role,
    userName,
    login: ({ token: t, role: r, userName: u }) => {
      setToken(t)
      setRole(r)
      setUserName(u)
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('auth', JSON.stringify({ token: t, role: r, userName: u }))
      }
    },
    logout: () => {
      setToken(null)
      setRole(null)
      setUserName(null)
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem('auth')
      }
    },
  }), [token, role, userName])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export function RequireAuth({ roles, children }: { roles?: Array<UserRole>; children: React.ReactNode }) {
  const { token, role } = useAuth()
  if (!token) return <LoginInvite />
  if (roles && role && !roles.includes(role)) return <div style={{ padding: 24 }}>Unauthorized</div>
  return <>{children}</>
}

function LoginInvite() {
  return (
    <div style={{ padding: 24 }}>
      <p>You are not logged in.</p>
      <a href="/login" style={{ color: '#2563eb' }}>Go to Login</a>
    </div>
  )
}


