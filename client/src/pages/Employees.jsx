import { useEffect, useState } from 'react'
import { getEmployees } from '../api/api'

function Employees() {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getEmployees()
      .then(res => {
        setEmployees(res.data)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  if (loading) return <p style={{ padding: '20px' }}>Loading employees...</p>

  return (
    <div style={{ padding: '30px' }}>
      <h2>Employee Registry</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#1a1a2e', color: 'white' }}>
            <th style={{ padding: '10px', textAlign: 'left' }}>Name</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Phone</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Role</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Daily Wage</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Status</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Ghost Risk Score</th>
          </tr>
        </thead>
        <tbody>
          {employees.map(emp => (
            <tr key={emp._id} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '10px' }}>{emp.name}</td>
              <td style={{ padding: '10px' }}>{emp.phone}</td>
              <td style={{ padding: '10px' }}>{emp.role}</td>
              <td style={{ padding: '10px' }}>₹{emp.dailyWage}</td>
              <td style={{ padding: '10px' }}>
                <span style={{
                  backgroundColor: emp.status === 'active' ? '#4caf50' : '#f44336',
                  color: 'white',
                  padding: '3px 10px',
                  borderRadius: '20px',
                  fontSize: '12px'
                }}>
                  {emp.status}
                </span>
              </td>
              <td style={{ padding: '10px' }}>
                <span style={{
                  backgroundColor: emp.ghostRiskScore > 50 ? '#f44336' : emp.ghostRiskScore > 20 ? '#ff9800' : '#4caf50',
                  color: 'white',
                  padding: '3px 10px',
                  borderRadius: '20px',
                  fontSize: '12px'
                }}>
                  {emp.ghostRiskScore}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Employees