import { useAuthStore } from '../../store/auth'
import { CoordinatorPOChart } from '../coordinator/CoordinatorPOChart'

export default function ChairmanDashboard() {
  const { userName } = useAuthStore()
  return (
    <div style={{ padding: 16 }}>
      <h2>Chairman Dashboard</h2>
      <div>Welcome, {userName}</div>
      <p>Section Summaries (Aggregated PO)</p>
      <CoordinatorPOChart />
    </div>
  )
}


