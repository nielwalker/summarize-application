import { useState } from 'react'
import { useAuthStore } from '../../store/auth'

type WeekEntry = {
  date: string
  hours: number | ''
  activities: string
  score: number | ''
  learnings: string
}

function createInitialWeeks(): WeekEntry[] {
  return Array.from({ length: 13 }, () => ({ date: '', hours: '', activities: '', score: '', learnings: '' }))
}

export function WeeklyReportTable() {
  const [currentWeek, setCurrentWeek] = useState(1)
  const [weeks, setWeeks] = useState<WeekEntry[]>(createInitialWeeks())
  const { userName, role } = useAuthStore()

  function updateField<K extends keyof WeekEntry>(idx: number, key: K, value: WeekEntry[K]) {
    setWeeks((prev) => {
      const next = [...prev]
      next[idx] = { ...next[idx], [key]: value }
      return next
    })
  }

  async function submitWeek(idx: number) {
    const entry = weeks[idx]
    console.log('Submit week', idx + 1, entry)
    try {
      const ports = [
        import.meta.env.VITE_API_PORT ? Number(import.meta.env.VITE_API_PORT) : 3000,
        3001, 3002, 3003, 3004
      ]
      const base = import.meta.env.VITE_API_URL
        || `http://localhost:${ports[0]}`
      let res = await fetch(`${base}/api/reports`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName: userName ?? 'student',
          role: role ?? 'student',
          weekNumber: idx + 1,
          ...entry,
          hours: entry.hours === '' ? 0 : entry.hours,
          score: entry.score === '' ? 0 : entry.score,
        }),
      })
      // Fallback: try additional common Next.js ports if first failed
      if (!res.ok) {
        for (const p of ports.slice(1)) {
          const alt = `http://localhost:${p}`
          try {
            const attempt = await fetch(`${alt}/api/reports`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                userName: userName ?? 'student',
                role: role ?? 'student',
                weekNumber: idx + 1,
                ...entry,
                hours: entry.hours === '' ? 0 : entry.hours,
                score: entry.score === '' ? 0 : entry.score,
              }),
            })
            if (attempt.ok) { res = attempt; break }
          } catch {}
        }
      }
      if (!res.ok) throw new Error(`Save failed (${res.status})`)
      // Optionally, give simple feedback
      alert(`Week ${idx + 1} saved`)
    } catch (e) {
      console.error(e)
      alert('Failed to save. Make sure the API server is running (tried ports 3000-3004).')
    }
  }

  return (
    <div style={{ marginTop: 16 }}>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {Array.from({ length: 13 }, (_, i) => i + 1).map((w) => (
          <button key={w} onClick={() => setCurrentWeek(w)} style={{ fontWeight: currentWeek === w ? 700 : 400 }}>
            Week {w}
          </button>
        ))}
      </div>
      <div style={{ marginTop: 12 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>Date</th>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>No. of Hours</th>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>Activities/Task</th>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>Score</th>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>New Learnings</th>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>Status</th>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {weeks.map((w, idx) => (
              <tr key={idx} style={{ background: currentWeek === idx + 1 ? '#f9fafb' : undefined }}>
                <td>
                  <input type="date" value={w.date} onChange={(e) => updateField(idx, 'date', e.target.value)} />
                </td>
                <td>
                  <input type="number" value={w.hours} onChange={(e) => updateField(idx, 'hours', e.target.value === '' ? '' : Number(e.target.value))} />
                </td>
                <td>
                  <input style={{ width: 320 }} value={w.activities} onChange={(e) => updateField(idx, 'activities', e.target.value)} />
                </td>
                <td>
                  <input type="number" value={w.score} onChange={(e) => updateField(idx, 'score', e.target.value === '' ? '' : Number(e.target.value))} />
                </td>
                <td>
                  <input style={{ width: 320 }} value={w.learnings} onChange={(e) => updateField(idx, 'learnings', e.target.value)} />
                </td>
                <td>{w.date && w.hours !== '' && w.activities ? 'Submitted' : 'Missing'}</td>
                <td>
                  <button onClick={() => submitWeek(idx)}>Submit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}


