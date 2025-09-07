import { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const PO_LABELS = [
  'PO1', 'PO2', 'PO3', 'PO4', 'PO5', 'PO6', 'PO7', 'PO8', 'PO9', 'PO10', 'PO11', 'PO12', 'PO13', 'PO14', 'PO15'
]

export function CoordinatorPOChart() {
  // Placeholder data. Will be replaced by GPT-5 scored outputs from backend.
  const data = useMemo(() => PO_LABELS.map((po, i) => ({ po, value: Math.round(60 + (i * 7 % 35)) })), [])
  return (
    <div style={{ height: 360 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="po" />
          <YAxis domain={[0, 100]} />
          <Tooltip formatter={(v) => `${v}% Alignment`} labelFormatter={(l) => `Program Outcome ${l}`} />
          <Bar dataKey="value" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}


