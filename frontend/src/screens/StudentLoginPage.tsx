import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function StudentLoginPage() {
  const navigate = useNavigate()
  const [studentId, setStudentId] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!studentId.trim()) {
      alert('Please enter your Student ID')
      return
    }

    setLoading(true)
    try {
      const apiUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/login`
      const body = { studentId, role: 'student' }

      const resp = await fetch(apiUrl, {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      
      if (!resp.ok) {
        const text = await resp.text().catch(() => '')
        const msg = /Student is not registered/i.test(text) ? 'No student enrolled. Ask chairman to register.' : (text || 'Login failed')
        alert(msg)
        return
      }
      
      const data = await resp.json().catch(() => null)
      if (data?.token) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('role', data.role)
        localStorage.setItem('userName', data.userName)
        if (data.studentId) localStorage.setItem('studentId', data.studentId)
        if (data.section) localStorage.setItem('section', data.section)
        navigate('/student')
      }
    } catch (e: any) {
      alert(`Login error: ${e.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 440, margin: '64px auto', padding: 16 }}>
      <h2>Student Login</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gap: 12 }}>
          <label>
            <input 
              value={studentId} 
              onChange={(e) => setStudentId(e.target.value)} 
              placeholder="Student ID"
              disabled={loading}
            />
          </label>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="button" onClick={() => navigate('/')} disabled={loading}>
              Back
            </button>
            <button type="submit" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
