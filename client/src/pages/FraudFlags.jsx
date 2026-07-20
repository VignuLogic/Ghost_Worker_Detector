import { useEffect, useState } from 'react'
import { getEmployees, checkFraud } from '../api/api'

function FraudFlags() {
  const [fraudData, setFraudData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getEmployees()
      .then(async res => {
        const employees = res.data
        const results = []

        for (const emp of employees) {
          const fraudRes = await checkFraud(emp._id)
          if (fraudRes.data.fraudFlags.length > 0) {
            results.push({
              employee: emp,
              fraudFlags: fraudRes.data.fraudFlags
            })
          }
        }

        setFraudData(results)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  if (loading) return <p style={{ padding: '20px', color: 'var(--text)' }}>Checking for fraud...</p>

  return (
    <div style={{ padding: '30px' }}>
      <h2 style={{ marginBottom: '24px' }}>🚨 Fraud Flags</h2>
      {fraudData.length === 0 ? (
        <p style={{ color: 'var(--status-good-text)', fontSize: '18px' }}>✅ No fraud detected across all employees.</p>
      ) : (
        fraudData.map(({ employee, fraudFlags }) => (
          <div key={employee._id} style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--status-danger-bar)',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '20px',
            textAlign: 'left'
          }}>
            <h3 style={{ color: 'var(--status-danger-text)', margin: '0 0 8px' }}>🚨 {employee.name} — {employee.role}</h3>
            <p style={{ color: 'var(--text)' }}>Phone: {employee.phone}</p>
            {fraudFlags.map((flag, index) => (
              <div key={index} style={{
                backgroundColor: 'var(--status-danger-bg)',
                padding: '10px',
                borderRadius: '5px',
                marginTop: '10px'
              }}>
                <p style={{ color: 'var(--status-danger-text)' }}><strong>Leave Period:</strong> {flag.leavePeriod}</p>
                <p style={{ color: 'var(--status-danger-text)' }}><strong>Attendance Found:</strong> {flag.attendanceFound} record(s)</p>
                <p style={{ color: 'var(--status-danger-text)' }}><strong>⚠️ {flag.message}</strong></p>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  )
}

export default FraudFlags