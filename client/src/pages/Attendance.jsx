import { useEffect, useState } from 'react'
import { getAttendance } from '../api/api'

function getBooleanColors(value) {
  if (value) return { bg: 'var(--status-good-bg)', text: 'var(--status-good-text)' }
  return { bg: 'var(--status-danger-bg)', text: 'var(--status-danger-text)' }
}

function getStatusColors(status) {
  if (status === 'present') return { bg: 'var(--status-good-bg)', text: 'var(--status-good-text)' }
  return { bg: 'var(--status-danger-bg)', text: 'var(--status-danger-text)' }
}

function Attendance() {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAttendance()
      .then(res => {
        setRecords(res.data)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  if (loading) return <p style={{ padding: '20px', color: 'var(--text)' }}>Loading attendance...</p>

  return (
    <div style={{ padding: '30px' }}>
     <h2 style={{ marginBottom: '24px' }}>Attendance Records</h2>
      <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px' }}>
        <thead>
          <tr>
            <th style={{ padding: '10px', textAlign: 'left', color: 'var(--text)', fontSize: '16px', fontWeight: 500 }}>Employee</th>
            <th style={{ padding: '10px', textAlign: 'left', color: 'var(--text)', fontSize: '16px', fontWeight: 500 }}>Date</th>
            <th style={{ padding: '10px', textAlign: 'left', color: 'var(--text)', fontSize: '16px', fontWeight: 500 }}>Device ID</th>
            <th style={{ padding: '10px', textAlign: 'left', color: 'var(--text)', fontSize: '16px', fontWeight: 500 }}>Within Geofence</th>
            <th style={{ padding: '10px', textAlign: 'left', color: 'var(--text)', fontSize: '16px', fontWeight: 500 }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {records.map(record => {
            const geofenceColors = getBooleanColors(record.isWithinGeofence)
            const statusColors = getStatusColors(record.status)
            return (
              <tr key={record._id} style={{ backgroundColor: 'var(--bg-card)' }}>
                <td style={{ padding: '12px', color: 'var(--text-h)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', borderLeft: '1px solid var(--border)' }}>
                  {record.employee ? record.employee.name : 'Unknown'}
                </td>
                <td style={{ padding: '12px', color: 'var(--text)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
                  {new Date(record.date).toLocaleDateString()}
                </td>
                <td style={{ padding: '12px', color: 'var(--text)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>{record.deviceId}</td>
                <td style={{ padding: '12px', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
                  <span style={{
                    backgroundColor: geofenceColors.bg,
                    color: geofenceColors.text,
                    padding: '3px 10px',
                    borderRadius: '20px',
                    fontSize: '12px'
                  }}>
                    {record.isWithinGeofence ? 'Yes' : 'No'}
                  </span>
                </td>
                <td style={{ padding: '12px', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', borderRight: '1px solid var(--border)' }}>
                  <span style={{
                    backgroundColor: statusColors.bg,
                    color: statusColors.text,
                    padding: '3px 10px',
                    borderRadius: '20px',
                    fontSize: '12px'
                  }}>
                    {record.status}
                  </span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default Attendance