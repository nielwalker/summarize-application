import { CoordinatorPOChart } from './CoordinatorPOChart'
import DashboardShell from '../../components/DashboardShell'

export default function CoordinatorDashboard() {
  return (
    <DashboardShell>
      <div>
        <h2>Coordinator Dashboard</h2>
        <p>Student Weekly Report Summary</p>
        <CoordinatorPOChart />
      </div>
    </DashboardShell>
  )
}


