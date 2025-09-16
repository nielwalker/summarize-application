import { useEffect, useMemo, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const PO_LABELS = [
  'PO1', 'PO2', 'PO3', 'PO4', 'PO5', 'PO6', 'PO7', 'PO8', 'PO9', 'PO10', 'PO11', 'PO12', 'PO13', 'PO14', 'PO15'
]

export function CoordinatorPOChart() {
  const [scores, setScores] = useState<number[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const run = async () => {
      try {
        const base = import.meta.env.VITE_API_URL || 'http://localhost:3001'
        const headers: Record<string, string> = { 'Content-Type': 'application/json' }
        // DEV-ONLY: allow quick testing without backend env by reading key from localStorage
        const devKey = typeof window !== 'undefined' ? localStorage.getItem('OPENAI_KEY') : null
        if (devKey) headers['x-openai-key'] = devKey
        const res = await fetch(`${base}/api/summary`, { method: 'POST', headers, body: JSON.stringify({ text: '' }) })
        if (!res.ok) { setError(await res.text()); return }
        const data = await res.json()
        if (Array.isArray(data.poScores) && data.poScores.length === 15) setScores(data.poScores)
        else setError('Invalid PO scores returned')
      } catch (e: any) {
        setError(e.message)
      }
    }
    run()
  }, [])

  const data = useMemo(() => {
    const values = scores ?? Array.from({ length: 15 }, () => 0)
    return PO_LABELS.map((po, i) => ({ po, value: values[i] ?? 0 }))
  }, [scores])

  return (
    <div style={{ height: 360 }}>
      {error && <div style={{ color: 'crimson', marginBottom: 8 }}>AI scoring error: {error}</div>}
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


