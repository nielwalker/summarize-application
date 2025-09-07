import { useAuthStore } from '../../store/auth'
import { CoordinatorPOChart } from './CoordinatorPOChart'

export default function CoordinatorDashboard() {
  const { userName } = useAuthStore()
  return (
    <div style={{ padding: 16 }}>
      <h2>Coordinator Dashboard</h2>
      <div>Welcome, {userName}</div>
      <p>Student Weekly Report Summary</p>
      <CoordinatorPOChart />
    </div>
  )
}


