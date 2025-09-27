import { CoordinatorPOChart } from './CoordinatorPOChart'
import DashboardShell from '../../components/DashboardShell'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function CoordinatorDashboard() {
  const navigate = useNavigate()
  const [section, setSection] = useState('IT4R8')
  const [studentId, setStudentId] = useState('')
  const [students, setStudents] = useState<Array<{ studentId: string; userName: string; companyName?: string }>>([])
  const [selectedStudent, setSelectedStudent] = useState<{ studentId: string; userName: string; companyName?: string } | null>(null)

  useEffect(() => {
    const base = (import.meta as any).env.VITE_API_URL || 'http://localhost:3000'
    fetch(`${base}/api/admin?action=listStudents&section=${encodeURIComponent(section)}`)
      .then(r => r.json())
      .then(data => {
        // Ensure we always set an array
        if (Array.isArray(data)) {
          setStudents(data)
        } else {
          console.error('Expected array but got:', data)
          setStudents([])
        }
      })
      .catch(err => {
        console.error('Error fetching students:', err)
        setStudents([])
      })
  }, [section])

  const handleStudentChange = (selectedStudentId: string) => {
    setStudentId(selectedStudentId)
    if (selectedStudentId) {
      const student = students.find(s => s.studentId === selectedStudentId)
      setSelectedStudent(student || null)
    } else {
      setSelectedStudent(null)
    }
  }

  return (
    <DashboardShell>
      <div style={{ 
        width: '95vw', 
        height: '95vh', 
        maxWidth: '1600px', 
        padding: '20px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '20px',
          padding: '0 10px'
        }}>
            <h2 style={{ margin: 0, color: '#000000' }}>Coordinator Dashboard - Student Analysis</h2>
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
            <span style={{ fontWeight: '500', color: '#000000' }}>Section:</span>
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
              <option value="IT4R8">IT4R8</option>
              <option value="IT4R9">IT4R9</option>
              <option value="IT4R10">IT4R10</option>
              <option value="IT4R11">IT4R11</option>
            </select>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontWeight: '500', color: '#000000' }}>Student:</span>
            <select 
              value={studentId} 
              onChange={(e) => handleStudentChange(e.target.value)}
              style={{
                padding: '6px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                backgroundColor: 'white',
                color: '#000000',
                minWidth: '200px'
              }}
            >
              <option value="">Select Student</option>
              {students.map((s) => (
                <option key={s.studentId} value={s.studentId}>{s.studentId} — {s.userName}</option>
              ))}
            </select>
          </label>
        </div>
        
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          {studentId && selectedStudent ? (
            <>
              <div style={{ 
                marginBottom: '20px', 
                padding: '16px', 
                backgroundColor: '#f8f9fa', 
                borderRadius: '8px', 
                border: '1px solid #e5e7eb',
                textAlign: 'center',
                minWidth: '300px'
              }}>
                <h3 style={{ margin: '0 0 12px 0', color: '#000000' }}>Student Information</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, color: '#000000' }}>
                  <div>
                    <strong>Name:</strong> {selectedStudent.userName}
                  </div>
                  <div>
                    <strong>Student ID:</strong> {selectedStudent.studentId}
                  </div>
                  <div>
                    <strong>Company:</strong> {selectedStudent.companyName || 'Not assigned'}
                  </div>
                </div>
              </div>
              <CoordinatorPOChart 
                section={section}
                studentId={studentId} 
              />
            </>
          ) : (
            <div style={{ 
              textAlign: 'center', 
              padding: '40px', 
              color: '#666',
              fontSize: '16px'
            }}>
              Please select a student to view their individual summary and graph
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  )
}


