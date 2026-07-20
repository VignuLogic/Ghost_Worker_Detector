import { useEffect, useState } from 'react'
import { getAttendance } from '../api/api'

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

  if (loading) return <p style={{ padding: '20px' }}>Loading attendance...</p>

  return (
    <div style={{ padding: '30px' }}>
      <h2>Attendance Records</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#1a1a2e', color: 'white' }}>
            <th style={{ padding: '10px', textAlign: 'left' }}>Employee</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Date</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Device ID</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Within Geofence</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {records.map(record => (
            <tr key={record._id} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '10px' }}>
                {record.employee ? record.employee.name : 'Unknown'}
              </td>
              <td style={{ padding: '10px' }}>
                {new Date(record.date).toLocaleDateString()}
              </td>
              <td style={{ padding: '10px' }}>{record.deviceId}</td>
              <td style={{ padding: '10px' }}>
                <span style={{
                  backgroundColor: record.isWithinGeofence ? '#4caf50' : '#f44336',
                  color: 'white',
                  padding: '3px 10px',
                  borderRadius: '20px',
                  fontSize: '12px'
                }}>
                  {record.isWithinGeofence ? 'Yes' : 'No'}
                </span>
              </td>
              <td style={{ padding: '10px' }}>
                <span style={{
                  backgroundColor: record.status === 'present' ? '#4caf50' : '#f44336',
                  color: 'white',
                  padding: '3px 10px',
                  borderRadius: '20px',
                  fontSize: '12px'
                }}>
                  {record.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Attendance