import { useEffect, useState } from 'react'
import { getPayroll } from '../api/api'

function Payroll() {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getPayroll()
      .then(res => {
        setRecords(res.data)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  if (loading) return <p style={{ padding: '20px' }}>Loading payroll records...</p>

  return (
    <div style={{ padding: '30px' }}>
      <h2>💰 Payroll Records</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#1a1a2e', color: 'white' }}>
            <th style={{ padding: '10px', textAlign: 'left' }}>Employee</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Month/Year</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Days Worked</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Expected Amount</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Amount Paid</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Discrepancy</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {records.map(record => (
            <tr key={record._id} style={{
              borderBottom: '1px solid #ddd',
              backgroundColor: 'transparent'
            }}>
              <td style={{ padding: '10px' }}>
                {record.employee ? record.employee.name : 'Unknown'}
              </td>
              <td style={{ padding: '10px' }}>
                {record.month}/{record.year}
              </td>
              <td style={{ padding: '10px' }}>{record.daysWorked}</td>
              <td style={{ padding: '10px' }}>₹{record.expectedAmount}</td>
              <td style={{ padding: '10px' }}>₹{record.amountPaid}</td>
              <td style={{ padding: '10px' }}>
                <span style={{
                  backgroundColor: record.discrepancy ? '#ff9800' : '#4caf50',
                  color: 'white',
                  padding: '3px 10px',
                  borderRadius: '20px',
                  fontSize: '12px'
                }}>
                  {record.discrepancy ? 'Yes' : 'No'}
                </span>
              </td>
              <td style={{ padding: '10px' }}>
                <span style={{
                  backgroundColor: record.flagged ? '#f44336' : '#4caf50',
                  color: 'white',
                  padding: '3px 10px',
                  borderRadius: '20px',
                  fontSize: '12px'
                }}>
                  {record.flagged ? '🚨 Ghost Worker' : '✅ Clean'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Payroll