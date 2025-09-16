import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { UserRole } from '../store/auth'

export default function LoginPage() {
  const navigate = useNavigate()
  const [role, setRole] = useState<UserRole>('student')
  const [step, setStep] = useState<'selectRole' | 'auth'>('selectRole')
  const [mode, setMode] = useState<'login' | 'register' | null>(null)
  const [userName, setUserName] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // No login required; just route by role selection
    navigate(`/${role}`)
  }

  return (
    <div style={{ maxWidth: 440, margin: '64px auto', padding: 16 }}>
      <h2>Select Role</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gap: 12 }}>
          <label>
            <div>Role</div>
            <select value={role} onChange={(e) => setRole(e.target.value as UserRole)} disabled={step==='auth'}>
              <option value="student">Student</option>
              <option value="coordinator">Coordinator</option>
              <option value="chairman">Chairman</option>
            </select>
          </label>

          <p style={{ color: '#888', fontSize: 12 }}>
            - Chairman can create own account (auto-approved).<br />
            - Coordinator accounts require chairman approval.<br />
            - Student accounts are created/approved by chairman/coordinator.
          </p>
          <button type="submit">Continue</button>
        </div>
      </form>
    </div>
  )
}


