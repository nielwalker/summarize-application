import { useAuthStore } from '../../store/auth'
import { WeeklyReportTable } from './WeeklyReportTable'

export default function StudentDashboard() {
  const { userName } = useAuthStore()
  return (
    <div style={{ padding: 16 }}>
      <h2>Student Dashboard</h2>
      <div>Welcome, {userName}</div>
      <WeeklyReportTable />
    </div>
  )
}


