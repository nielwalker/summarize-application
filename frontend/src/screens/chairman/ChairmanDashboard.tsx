import { CoordinatorPOChart } from '../coordinator/CoordinatorPOChart'
import DashboardShell from '../../components/DashboardShell'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function ChairmanDashboard() {
  const navigate = useNavigate()
  const [section, setSection] = useState('IT4R8')
  const [selectedWeek, setSelectedWeek] = useState<number>(1)
  const [studentId, setStudentId] = useState('')
  const [studentName, setStudentName] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [coordName, setCoordName] = useState('')
  const [coordSection, setCoordSection] = useState<string>('IT4R8')
  const [msg, setMsg] = useState<string>('')

  const ALL_SECTIONS = ['IT4R8', 'IT4R9', 'IT4R10', 'IT4R11']
  const ALL_WEEKS = Array.from({ length: 13 }, (_, i) => i + 1) // Weeks 1-13

  async function registerStudent() {
    setMsg('')
    if (!studentId || !section) { setMsg('Student ID and section are required'); return }
    try {
      const base = (import.meta as any).env.VITE_API_URL || 'http://localhost:3000'
      const res = await fetch(`${base}/api/admin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'registerStudent', studentId, section, userName: studentName || undefined, companyName: companyName || undefined })
      })
      if (!res.ok) {
        const t = await res.text().catch(() => '')
        setMsg(`Register student failed: ${t}`)
        return
      }
      setMsg('Student registered successfully')
      setStudentId('')
      setStudentName('')
      setCompanyName('')
    } catch (e: any) {
      setMsg(`Register student error: ${e?.message || String(e)}`)
    }
  }

  async function registerCoordinator() {
    setMsg('')
    if (!coordName || !coordSection) { setMsg('Coordinator name and section are required'); return }
    try {
      const base = (import.meta as any).env.VITE_API_URL || 'http://localhost:3000'
      const res = await fetch(`${base}/api/admin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'registerCoordinator', userName: coordName, sections: [coordSection] })
      })
      if (!res.ok) {
        const t = await res.text().catch(() => '')
        setMsg(`Register coordinator failed: ${t}`)
        return
      }
      setMsg('Coordinator registered')
      setCoordName('')
      setCoordSection('IT4R8')
    } catch (e: any) {
      setMsg(`Register coordinator error: ${e?.message || String(e)}`)
    }
  }
  return (
    <DashboardShell>
      <div style={{ 
        width: '95vw', 
        height: '130vh', 
        maxWidth: '1600px', 
        padding: '20px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '20px',
          padding: '0 10px'
        }}>
              <h2 style={{ margin: 0, color: '#000000' }}>Chairman Dashboard - Section Analysis</h2>
          <button 
            onClick={() => {
              try {
                localStorage.removeItem('token')
                localStorage.removeItem('role')
                localStorage.removeItem('userName')
                localStorage.removeItem('studentId')
                localStorage.removeItem('section')
              } catch {}
              navigate('/')
            }}
            style={{
              padding: '8px 16px',
              backgroundColor: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Logout
          </button>
        </div>
        
        {msg && (
          <div style={{ 
            marginBottom: '20px', 
            padding: '12px',
            backgroundColor: msg.includes('successfully') || msg.includes('registered') ? '#f0f9ff' : '#fef2f2',
            border: `1px solid ${msg.includes('successfully') || msg.includes('registered') ? '#3b82f6' : '#dc2626'}`,
            borderRadius: '8px',
            color: msg.includes('successfully') || msg.includes('registered') ? '#1e40af' : '#dc2626'
          }}>
            {msg}
          </div>
        )}
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: 24, 
          marginBottom: '20px'
        }}>
          {/* Student Registration Table */}
          <div style={{ 
            padding: 16, 
            border: '1px solid #e5e7eb', 
            borderRadius: 8, 
            backgroundColor: '#f9fafb' 
          }}>
            <h3 style={{ margin: 0, marginBottom: 16, color: '#000000' }}>Student Registration</h3>
            <div style={{ display: 'grid', gap: 12 }}>
              <label>
                <div style={{ fontWeight: 500, marginBottom: 4, color: '#000000' }}>Student ID</div>
                <input 
                  value={studentId} 
                  onChange={(e) => setStudentId(e.target.value)} 
                  placeholder="e.g. 2025-12345"
                  style={{ 
                    width: '100%', 
                    padding: 8, 
                    border: '1px solid #d1d5db', 
                    borderRadius: 4,
                    backgroundColor: 'white',
                    color: '#000000'
                  }}
                />
              </label>
              <label>
                <div style={{ fontWeight: 500, marginBottom: 4, color: '#000000' }}>Student Name</div>
                <input 
                  value={studentName} 
                  onChange={(e) => setStudentName(e.target.value)} 
                  placeholder="Student Name"
                  style={{ 
                    width: '100%', 
                    padding: 8, 
                    border: '1px solid #d1d5db', 
                    borderRadius: 4,
                    backgroundColor: 'white',
                    color: '#000000'
                  }}
                />
              </label>
              <label>
                <div style={{ fontWeight: 500, marginBottom: 4, color: '#000000' }}>Company Name</div>
                <input 
                  value={companyName} 
                  onChange={(e) => setCompanyName(e.target.value)} 
                  placeholder="Company Name"
                  style={{ 
                    width: '100%', 
                    padding: 8, 
                    border: '1px solid #d1d5db', 
                    borderRadius: 4,
                    backgroundColor: 'white',
                    color: '#000000'
                  }}
                />
              </label>
              <label>
                <div style={{ fontWeight: 500, marginBottom: 4, color: '#000000' }}>Section</div>
                <select 
                  value={section} 
                  onChange={(e) => setSection(e.target.value)}
                  style={{ 
                    width: '100%', 
                    padding: 8, 
                    border: '1px solid #d1d5db', 
                    borderRadius: 4,
                    backgroundColor: 'white',
                    color: '#000000'
                  }}
                >
                  {ALL_SECTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </label>
              <button 
                onClick={registerStudent}
                style={{ 
                  padding: '10px 16px', 
                  backgroundColor: '#3b82f6', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: 4, 
                  cursor: 'pointer',
                  fontWeight: 500
                }}
              >
                Register Student
              </button>
            </div>
          </div>

          {/* Coordinator Registration Table */}
          <div style={{ 
            padding: 16, 
            border: '1px solid #e5e7eb', 
            borderRadius: 8, 
            backgroundColor: '#f0f9ff' 
          }}>
            <h3 style={{ margin: 0, marginBottom: 16, color: '#000000' }}>Coordinator Registration</h3>
            <div style={{ display: 'grid', gap: 12 }}>
              <label>
                <div style={{ fontWeight: 500, marginBottom: 4, color: '#000000' }}>Coordinator Name</div>
                <input 
                  value={coordName} 
                  onChange={(e) => setCoordName(e.target.value)} 
                  placeholder="Coordinator Name"
                  style={{ 
                    width: '100%', 
                    padding: 8, 
                    border: '1px solid #d1d5db', 
                    borderRadius: 4,
                    backgroundColor: 'white',
                    color: '#000000'
                  }}
                />
              </label>
              <label>
                <div style={{ fontWeight: 500, marginBottom: 4, color: '#000000' }}>Assigned Section</div>
                <select 
                  value={coordSection} 
                  onChange={(e) => setCoordSection(e.target.value)}
                  style={{ 
                    width: '100%', 
                    padding: 8, 
                    border: '1px solid #d1d5db', 
                    borderRadius: 4,
                    backgroundColor: 'white',
                    color: '#000000'
                  }}
                >
                  {ALL_SECTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </label>
              <button 
                onClick={registerCoordinator}
                style={{ 
                  padding: '10px 16px', 
                  backgroundColor: '#059669', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: 4, 
                  cursor: 'pointer',
                  fontWeight: 500
                }}
              >
                Register Coordinator
              </button>
            </div>
          </div>
        </div>
        
        <div style={{ 
          display: 'flex', 
          gap: 16, 
          alignItems: 'center', 
          marginBottom: '20px',
          padding: '12px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          border: '1px solid #e5e7eb'
        }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontWeight: '500', color: '#000000' }}>Section Summary View:</span>
            <select 
              value={section} 
              onChange={(e) => setSection(e.target.value)}
              style={{
                padding: '6px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                backgroundColor: 'white',
                color: '#000000'
              }}
            >
              {ALL_SECTIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontWeight: '500', color: '#000000' }}>Week:</span>
            <select 
              value={selectedWeek} 
              onChange={(e) => setSelectedWeek(Number(e.target.value))}
              style={{
                padding: '6px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                backgroundColor: 'white',
                color: '#000000'
              }}
            >
              {ALL_WEEKS.map(week => (
                <option key={week} value={week}>
                  Week {week}
                </option>
              ))}
            </select>
          </label>
        </div>
        
        <div style={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center', 
          alignItems: 'center',
          minHeight: '900px',
          overflow: 'visible'
        }}>
          <CoordinatorPOChart 
            section={section} 
            selectedWeek={selectedWeek}
            title={`Section ${section} - Week ${selectedWeek}`} 
          />
        </div>
      </div>
    </DashboardShell>
  )
}


