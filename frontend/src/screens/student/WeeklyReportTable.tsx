import { useEffect, useState } from 'react'
import { useAuthStore } from '../../store/auth'

type WeekEntry = {
  date: string
  hours: number | ''
  activities: string
  score: number | ''
  learnings: string
  submitted?: boolean
}

function createBlankEntry(): WeekEntry {
  return { date: '', hours: '', activities: '', score: '', learnings: '', submitted: false }
}

function createInitialWeeks(): WeekEntry[][] {
  // 13 weeks, 6 rows per week
  return Array.from({ length: 13 }, () => Array.from({ length: 6 }, () => createBlankEntry()))
}

export function WeeklyReportTable() {
  const [currentWeek, setCurrentWeek] = useState(1)
  const [weeks, setWeeks] = useState<WeekEntry[][]>(createInitialWeeks())
  const { userName, role } = useAuthStore()

  function updateField<K extends keyof WeekEntry>(rowIdx: number, key: K, value: WeekEntry[K]) {
    setWeeks((prev) => {
      const next = prev.map((weekRows) => weekRows.slice())
      const weekIndex = currentWeek - 1
      // Any edit marks the row as not submitted yet
      next[weekIndex][rowIdx] = { ...next[weekIndex][rowIdx], [key]: value, submitted: false }
      return next
    })
  }

  async function loadReports() {
    try {
      const base = import.meta.env.VITE_API_URL || 'http://localhost:3001'
      const name = userName ?? 'student'
      const res = await fetch(`${base}/api/reports?userName=${encodeURIComponent(name)}`)
      if (!res.ok) return
      const items: Array<{ weekNumber: number; date: string; hours: number; activities: string; score: number; learnings: string }>
        = await res.json()
      // Build new 13x6 table and fill per week in insertion order
      const grid = createInitialWeeks()
      const buckets = new Map<number, WeekEntry[]>()
      for (const it of items) {
        const list = buckets.get(it.weekNumber) ?? []
        list.push({ date: it.date, hours: it.hours, activities: it.activities, score: it.score, learnings: it.learnings, submitted: true })
        buckets.set(it.weekNumber, list)
      }
      for (const [wk, list] of buckets) {
        const wkIdx = Math.max(0, Math.min(12, wk - 1))
        for (let i = 0; i < Math.min(6, list.length); i++) {
          grid[wkIdx][i] = list[i]
        }
      }
      setWeeks(grid)
    } catch {}
  }

  useEffect(() => {
    loadReports()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function submitWeek(rowIdx: number) {
    const entry = weeks[currentWeek - 1][rowIdx]
    console.log('Submit week', currentWeek, 'row', rowIdx + 1, entry)
    try {
      const base = import.meta.env.VITE_API_URL || 'http://localhost:3001'
      const res = await fetch(`${base}/api/reports`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName: userName ?? 'student',
          role: role ?? 'student',
          weekNumber: currentWeek,
          ...entry,
          hours: entry.hours === '' ? 0 : entry.hours,
          score: entry.score === '' ? 0 : entry.score,
        }),
      })
      
      if (!res.ok) {
        const errorText = await res.text()
        console.error('API Error:', res.status, errorText)
        throw new Error(`Save failed (${res.status}): ${errorText}`)
      }
      
      const result = await res.json()
      console.log('Save successful:', result)
      // Mark this row as submitted after successful save
      setWeeks((prev) => {
        const next = prev.map((w) => w.slice())
        next[currentWeek - 1][rowIdx] = { ...next[currentWeek - 1][rowIdx], submitted: true }
        return next
      })
      // Reload from server to persist across refresh
      loadReports()
      alert(`Week ${currentWeek} - Row ${rowIdx + 1} saved successfully!`)
    } catch (e) {
      console.error('Submit error:', e)
      alert(`Failed to save: ${e.message}`)
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
            {weeks[currentWeek - 1].map((row, rowIdx) => (
              <tr key={rowIdx}>
                <td>
                  <input type="date" value={row.date} onChange={(e) => updateField(rowIdx, 'date', e.target.value)} />
                </td>
                <td>
                  <input type="number" value={row.hours} onChange={(e) => updateField(rowIdx, 'hours', e.target.value === '' ? '' : Number(e.target.value))} />
                </td>
                <td>
                  <input style={{ width: 320 }} value={row.activities} onChange={(e) => updateField(rowIdx, 'activities', e.target.value)} />
                </td>
                <td>
                  <input type="number" value={row.score} onChange={(e) => updateField(rowIdx, 'score', e.target.value === '' ? '' : Number(e.target.value))} />
                </td>
                <td>
                  <input style={{ width: 320 }} value={row.learnings} onChange={(e) => updateField(rowIdx, 'learnings', e.target.value)} />
                </td>
                <td>{row.date && row.hours !== '' && row.activities ? 'Submitted' : 'Missing'}</td>
                <td>
                  <button onClick={() => submitWeek(rowIdx)}>Submit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}


