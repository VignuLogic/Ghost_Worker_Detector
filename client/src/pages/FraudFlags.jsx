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

  if (loading) return <p style={{ padding: '20px' }}>Checking for fraud...</p>

  return (
    <div style={{ padding: '30px' }}>
      <h2>🚨 Fraud Flags</h2>
      {fraudData.length === 0 ? (
        <p style={{ color: '#4caf50', fontSize: '18px' }}>✅ No fraud detected across all employees.</p>
      ) : (
        fraudData.map(({ employee, fraudFlags }) => (
          <div key={employee._id} style={{
            backgroundColor: '#fff3f3',
            border: '2px solid #f44336',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '20px'
          }}>
            <h3 style={{ color: '#f44336' }}>🚨 {employee.name} — {employee.role}</h3>
            <p>Phone: {employee.phone}</p>
            {fraudFlags.map((flag, index) => (
              <div key={index} style={{
                backgroundColor: '#ffe0e0',
                padding: '10px',
                borderRadius: '5px',
                marginTop: '10px'
              }}>
                <p><strong>Leave Period:</strong> {flag.leavePeriod}</p>
                <p><strong>Attendance Found:</strong> {flag.attendanceFound} record(s)</p>
                <p><strong>⚠️ {flag.message}</strong></p>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  )
}

export default FraudFlags