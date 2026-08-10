import { useEffect, useState } from 'react'
import { getAttendance } from '../api/api'

function Attendance() {
  const [records, setRecords] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [monthFilter, setMonthFilter] = useState('6')
  const [statusFilter, setStatusFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const [page, setPage] = useState(1)
  const perPage = 10

  useEffect(() => {
    getAttendance()
      .then(res => {
        setRecords(res.data)
        setFiltered(res.data)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    let result = [...records]

    if (monthFilter !== 'all') {
      result = result.filter(r => {
        const month = new Date(r.date).getMonth() + 1
        return month === parseInt(monthFilter)
      })
    }

    if (statusFilter !== 'all') {
      result = result.filter(r => r.status === statusFilter)
    }

    if (dateFilter) {
      result = result.filter(r => {
        const d = new Date(r.date)
        const recordDate = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
        return recordDate === dateFilter
      })
    }

    if (search) {
      result = result.filter(r =>
        r.employee?.name?.toLowerCase().includes(search.toLowerCase())
      )
    }

    setFiltered(result)
    setPage(1)
  }, [monthFilter, statusFilter, search, dateFilter, records])

  if (loading) return <p style={{ padding: '20px', color: 'var(--text-primary)' }}>Loading attendance...</p>

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage))
  const start = (page - 1) * perPage
  const slice = filtered.slice(start, start + perPage)
  const presentCount = filtered.filter(r => r.status === 'present').length
  const suspiciousCount = filtered.filter(r => r.status === 'suspicious').length

  const selectStyle = {
    border: '0.5px solid var(--border-strong)',
    backgroundColor: 'var(--surface-1)',
    color: 'var(--text-primary)',
    padding: '6px 10px',
    borderRadius: '6px',
    fontSize: '13px'
  }

  const labelStyle = {
    display: 'block',
    fontSize: '12px',
    color: 'var(--text-secondary)',
    marginBottom: '4px'
  }

  return (
    <div style={{ padding: '30px' }}>
      <h2 style={{ marginBottom: '20px', fontSize: '20px', fontWeight: '500' }}>Attendance Records</h2>

      {/* Filters — all in one row */}
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '20px', alignItems: 'flex-end' }}>
        <div>
          <label style={labelStyle}>Month</label>
          <select style={selectStyle} value={monthFilter} onChange={e => setMonthFilter(e.target.value)}>
            <option value="all">All months</option>
            <option value="1">January</option>
            <option value="2">February</option>
            <option value="3">March</option>
            <option value="4">April</option>
            <option value="5">May</option>
            <option value="6">June</option>
            <option value="7">July</option>
            <option value="8">August</option>
            <option value="9">September</option>
            <option value="10">October</option>
            <option value="11">November</option>
            <option value="12">December</option>
          </select>
        </div>

        <div>
          <label style={labelStyle}>Date</label>
          <input
            style={{ ...selectStyle, width: '150px' }}
            type="date"
            value={dateFilter}
            onChange={e => setDateFilter(e.target.value)}
          />
        </div>

        <div>
          <label style={labelStyle}>Status</label>
          <select style={selectStyle} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="present">Present</option>
            <option value="suspicious">Suspicious</option>
          </select>
        </div>

        <div>
          <label style={labelStyle}>Search employee</label>
          <input
            style={{ ...selectStyle, width: '180px' }}
            type="text"
            placeholder="e.g. Ramesh Kumar"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {(dateFilter || statusFilter !== 'all' || search) && (
          <div style={{ alignSelf: 'flex-end' }}>
            <button
              onClick={() => { setDateFilter(''); setStatusFilter('all'); setSearch('') }}
              style={{ ...selectStyle, cursor: 'pointer', color: '#791f1f', borderColor: '#791f1f' }}
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div style={{ background: 'var(--surface-1)', border: '0.5px solid var(--border)', borderRadius: '8px', padding: '12px 20px', textAlign: 'center', minWidth: '100px' }}>
          <div style={{ fontSize: '22px', fontWeight: '500', color: 'var(--text-primary)' }}>{filtered.length}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>Total records</div>
        </div>
        <div style={{ background: 'var(--surface-1)', border: '0.5px solid var(--border)', borderRadius: '8px', padding: '12px 20px', textAlign: 'center', minWidth: '100px' }}>
          <div style={{ fontSize: '22px', fontWeight: '500', color: '#085041' }}>{presentCount}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>Present</div>
        </div>
        <div style={{ background: 'var(--surface-1)', border: '0.5px solid var(--border)', borderRadius: '8px', padding: '12px 20px', textAlign: 'center', minWidth: '100px' }}>
          <div style={{ fontSize: '22px', fontWeight: '500', color: '#791f1f' }}>{suspiciousCount}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>Suspicious</div>
        </div>
      </div>

      {/* Table */}
      <div style={{ background: 'var(--surface-1)', border: '0.5px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead>
            <tr>
              {['Employee', 'Date', 'Device ID', 'Within geofence', 'Status'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '12px 16px', color: 'var(--text-secondary)', fontWeight: '500', fontSize: '13px', borderBottom: '0.5px solid var(--border)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {slice.length === 0 ? (
              <tr><td colSpan={5} style={{ padding: '30px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '14px' }}>No records found</td></tr>
            ) : slice.map(record => (
              <tr key={record._id} style={{ borderBottom: '0.5px solid var(--border)' }}>
                <td style={{ padding: '12px 16px', fontWeight: '500', color: 'var(--text-primary)', fontSize: '14px' }}>{record.employee?.name || 'Unknown'}</td>
                <td style={{ padding: '12px 16px', color: 'var(--text-secondary)', fontSize: '13px' }}>{new Date(record.date).toLocaleDateString()}</td>
                <td style={{ padding: '12px 16px', color: 'var(--text-secondary)', fontFamily: 'monospace', fontSize: '13px' }}>{record.deviceId}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ color: record.isWithinGeofence ? '#085041' : '#791f1f', fontWeight: '500', fontSize: '13px' }}>
                    {record.isWithinGeofence ? 'Yes' : 'No'}
                  </span>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{
                    display: 'inline-block',
                    padding: '3px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '500',
                    backgroundColor: record.status === 'present' ? '#e1f5ee' : '#fcebeb',
                    color: record.status === 'present' ? '#085041' : '#791f1f'
                  }}>
                    {record.status}
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
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            style={{ border: '0.5px solid var(--border-strong)', background: 'var(--surface-1)', color: 'var(--text-primary)', padding: '6px 14px', borderRadius: '6px', cursor: page === 1 ? 'not-allowed' : 'pointer', opacity: page === 1 ? 0.4 : 1, fontSize: '13px' }}
          >Prev</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(p => p === 1 || p === totalPages || (p >= page - 1 && p <= page + 1))
            .reduce((acc, p, idx, arr) => {
              if (idx > 0 && p - arr[idx - 1] > 1) acc.push('...')
              acc.push(p)
              return acc
            }, [])
            .map((p, idx) => p === '...' ? (
              <span key={idx} style={{ padding: '6px 8px', fontSize: '13px', color: 'var(--text-secondary)' }}>...</span>
            ) : (
              <button
                key={p}
                onClick={() => setPage(p)}
                style={{ border: '0.5px solid var(--border-strong)', background: page === p ? '#378add' : 'var(--surface-1)', color: page === p ? 'white' : 'var(--text-primary)', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}
              >{p}</button>
            ))
          }
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            style={{ border: '0.5px solid var(--border-strong)', background: 'var(--surface-1)', color: 'var(--text-primary)', padding: '6px 14px', borderRadius: '6px', cursor: page === totalPages ? 'not-allowed' : 'pointer', opacity: page === totalPages ? 0.4 : 1, fontSize: '13px' }}
          >Next</button>
        </div>
      </div>
    </div>
  )
}

export default Attendance
