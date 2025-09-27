import { useState, useEffect } from 'react'
import { WeeklyReportTable } from './WeeklyReportTable'
import DashboardShell from '../../components/DashboardShell'
import { useNavigate } from 'react-router-dom'

interface StudentDetails {
  student: {
    studentId: string
    userName: string
    section: string
    companyName: string | null
  }
  coordinator: {
    userName: string
    sections: string[]
  } | null
}

export default function StudentDashboard() {
  const navigate = useNavigate()
  const [studentDetails, setStudentDetails] = useState<StudentDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        const studentId = localStorage.getItem('studentId')
        if (!studentId) {
          setError('Student ID not found')
          setLoading(false)
          return
        }

        const base = import.meta.env.VITE_API_URL || 'http://localhost:3000'
        const response = await fetch(`${base}/api/admin?action=getStudentDetails&studentId=${encodeURIComponent(studentId)}`)
        
        if (!response.ok) {
          throw new Error(`Failed to fetch student details: ${response.status}`)
        }

        const data = await response.json()
        setStudentDetails(data)
      } catch (err) {
        console.error('Error fetching student details:', err)
        setError(err instanceof Error ? err.message : 'Failed to load student details')
      } finally {
        setLoading(false)
      }
    }

    fetchStudentDetails()
  }, [])
  
  return (
    <DashboardShell>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ margin: 0, color: '#000000' }}>Student Dashboard</h2>
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

        {loading && <div style={{ marginBottom: 16, color: '#666' }}>Loading student information...</div>}
        
        {error && <div style={{ marginBottom: 16, color: 'crimson' }}>Error: {error}</div>}
        
        {studentDetails && (
          <div style={{ 
            marginBottom: 24, 
            padding: 16, 
            backgroundColor: '#f8f9fa', 
            borderRadius: 8, 
            border: '1px solidrgb(7, 9, 12)' 
          }}>
            <h3 style={{ margin: '0 0 12px 0', color: '#000000' }}>Student Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, color: '#000000' }}>
              <div>
                <strong>Name:</strong> {studentDetails.student.userName}
              </div>
              <div>
                <strong>Student ID:</strong> {studentDetails.student.studentId}
              </div>
              <div>
                <strong>Section:</strong> {studentDetails.student.section}
              </div>
              <div>
                <strong>Company:</strong> {studentDetails.student.companyName || 'Not assigned'}
              </div>
              <div>
                <strong>Coordinator:</strong> {studentDetails.coordinator?.userName || 'Not assigned'}
              </div>
            </div>
          </div>
        )}

        <WeeklyReportTable />
      </div>
    </DashboardShell>
  )
}


