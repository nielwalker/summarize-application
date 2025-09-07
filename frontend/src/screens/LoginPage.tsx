import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/auth'
import type { UserRole } from '../store/auth'

export default function LoginPage() {
  const login = useAuthStore((s) => s.login)
  const navigate = useNavigate()
  const [role, setRole] = useState<UserRole>('student')
  const [userName, setUserName] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const token = 'dev-token'
    login({ token, role, userName: userName || role })
    navigate(`/${role}`)
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


