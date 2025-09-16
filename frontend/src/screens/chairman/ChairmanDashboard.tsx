import { CoordinatorPOChart } from '../coordinator/CoordinatorPOChart'
import DashboardShell from '../../components/DashboardShell'

export default function ChairmanDashboard() {
  return (
    <DashboardShell>
      <div>
        <h2>Chairman Dashboard</h2>
        <p>Section Summaries (Aggregated PO)</p>
        <CoordinatorPOChart />
      </div>
    </DashboardShell>
  )
}


