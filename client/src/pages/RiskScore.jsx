import { useEffect, useState } from 'react'
import { calculateAllRiskScores } from '../api/api'

function RiskScore() {
  const [results, setResults] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [riskFilter, setRiskFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const perPage = 10

  useEffect(() => {
    calculateAllRiskScores()
      .then(res => {
        const sorted = [...res.data.results].sort((a, b) => b.ghostRiskScore - a.ghostRiskScore)
        setResults(sorted)
        setFiltered(sorted)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    let result = [...results]
    if (riskFilter !== 'all') result = result.filter(r => r.riskLevel === riskFilter)
    if (search) result = result.filter(r => r.employee?.toLowerCase().includes(search.toLowerCase()) || r.name?.toLowerCase().includes(search.toLowerCase()))
    setFiltered(result)
    setPage(1)
  }, [riskFilter, search, results])

  if (loading) return <p style={{ padding: '20px' }}>Calculating risk scores...</p>

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage))
  const start = (page - 1) * perPage
  const slice = filtered.slice(start, start + perPage)
  const highCount = results.filter(r => r.riskLevel === 'HIGH').length
  const mediumCount = results.filter(r => r.riskLevel === 'MEDIUM').length
  const lowCount = results.filter(r => r.riskLevel === 'LOW').length

  const barColor = level => level === 'HIGH' ? '#E24B4A' : level === 'MEDIUM' ? '#EF9F27' : '#1D9E75'
  const badgeBg = level => level === 'HIGH' ? '#3d0000' : level === 'MEDIUM' ? '#3d2000' : '#003d1a'
  const badgeText = level => level === 'HIGH' ? '#f09595' : level === 'MEDIUM' ? '#FAC775' : '#5DCAA5'

  const selectStyle = {
    border: '0.5px solid var(--border-strong)',
    backgroundColor: 'var(--surface-1)',
    color: 'var(--text-primary)',
    padding: '6px 10px',
    borderRadius: '6px',
    fontSize: '13px'
  }

  return (
    <div style={{ padding: '30px' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '500' }}>Ghost Risk Scores</h2>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--text-secondary)' }}>{results.length} employees analysed</p>
        </div>
      </div>

      {/* Summary stats */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {[
          { label: 'High risk', count: highCount, color: '#E24B4A' },
          { label: 'Medium risk', count: mediumCount, color: '#EF9F27' },
          { label: 'Low risk', count: lowCount, color: '#1D9E75' },
          { label: 'Total', count: results.length, color: 'var(--text-primary)' },
        ].map(s => (
          <div key={s.label} style={{ background: 'var(--surface-1)', border: '0.5px solid var(--border)', borderRadius: '8px', padding: '12px 22px', textAlign: 'center', minWidth: '100px' }}>
            <div style={{ fontSize: '24px', fontWeight: '500', color: s.color }}>{s.count}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <div>
          <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Risk level</label>
          <select style={selectStyle} value={riskFilter} onChange={e => setRiskFilter(e.target.value)}>
            <option value="all">All levels</option>
            <option value="HIGH">High risk</option>
            <option value="MEDIUM">Medium risk</option>
            <option value="LOW">Low risk</option>
          </select>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Search employee</label>
          <input
            style={{ ...selectStyle, width: '180px' }}
            type="text"
            placeholder="e.g. Ramesh Kumar"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div style={{ background: 'var(--surface-1)', border: '0.5px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead>
            <tr>
              {['#', 'Employee', 'Risk score', 'Risk level'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '12px 16px', color: 'var(--text-secondary)', fontWeight: '500', fontSize: '13px', borderBottom: '0.5px solid var(--border)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {slice.length === 0 ? (
              <tr><td colSpan={4} style={{ padding: '30px', textAlign: 'center', color: 'var(--text-secondary)' }}>No employees found</td></tr>
            ) : slice.map((r, i) => (
              <tr key={i} style={{ borderBottom: '0.5px solid var(--border)' }}>
                <td style={{ padding: '12px 16px', color: 'var(--text-secondary)', fontSize: '13px' }}>{start + i + 1}</td>
                <td style={{ padding: '12px 16px', fontWeight: '500', color: 'var(--text-primary)' }}>{r.employee}</td>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '80px', height: '6px', background: 'var(--border)', borderRadius: '3px' }}>
                     <div style={{ width: `${r.ghostRiskScore}%`, height: '6px', background: barColor(r.riskLevel), borderRadius: '3px' }} />
                    </div>
                    <span style={{ fontWeight: '500', color: barColor(r.riskLevel), fontSize: '14px' }}>{r.ghostRiskScore}</span>
                  </div>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ display: 'inline-block', padding: '3px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '500', backgroundColor: badgeBg(r.riskLevel), color: badgeText(r.riskLevel) }}>
                    {r.riskLevel} RISK
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
        <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
          Showing {filtered.length === 0 ? 0 : start + 1}–{Math.min(start + perPage, filtered.length)} of {filtered.length}
        </span>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            style={{ border: '0.5px solid var(--border-strong)', background: 'var(--surface-1)', color: 'var(--text-primary)', padding: '6px 14px', borderRadius: '6px', cursor: page === 1 ? 'not-allowed' : 'pointer', opacity: page === 1 ? 0.4 : 1, fontSize: '13px' }}>Prev</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(p => p === 1 || p === totalPages || (p >= page - 1 && p <= page + 1))
            .reduce((acc, p, idx, arr) => { if (idx > 0 && p - arr[idx - 1] > 1) acc.push('...'); acc.push(p); return acc }, [])
            .map((p, idx) => p === '...' ? (
              <span key={idx} style={{ padding: '6px 8px', fontSize: '13px', color: 'var(--text-secondary)' }}>...</span>
            ) : (
              <button key={p} onClick={() => setPage(p)}
                style={{ border: '0.5px solid var(--border-strong)', background: page === p ? '#378add' : 'var(--surface-1)', color: page === p ? 'white' : 'var(--text-primary)', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>{p}</button>
            ))}
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
            style={{ border: '0.5px solid var(--border-strong)', background: 'var(--surface-1)', color: 'var(--text-primary)', padding: '6px 14px', borderRadius: '6px', cursor: page === totalPages ? 'not-allowed' : 'pointer', opacity: page === totalPages ? 0.4 : 1, fontSize: '13px' }}>Next</button>
        </div>
      </div>
    </div>
  )
}

export default RiskScore