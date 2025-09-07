"use client"
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useAuth } from '../auth/AuthProvider'

type UserRole = 'student' | 'coordinator' | 'chairman'

export default function LoginPage() {
  const { login } = useAuth()
  const router = useRouter()
  const [role, setRole] = useState<UserRole>('student')
  const [userName, setUserName] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const token = 'dev-token'
    login({ token, role, userName: userName || role })
    router.push('/dashboard')
  }

  return (
    <div style={{ maxWidth: 420, margin: '64px auto', padding: 16 }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gap: 12 }}>
          <label>
            <div>Role</div>
            <select value={role} onChange={(e) => setRole(e.target.value as UserRole)}>
              <option value="student">Student</option>
              <option value="coordinator">Coordinator</option>
              <option value="chairman">Chairman</option>
            </select>
          </label>
          <label>
            <div>Name</div>
            <input value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="Your name" />
          </label>
          <button type="submit">Continue</button>
        </div>
      </form>
    </div>
  )
}


