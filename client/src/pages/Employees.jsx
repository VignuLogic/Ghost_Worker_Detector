import { useEffect, useState } from 'react'
import { getEmployees } from '../api/api'

function getStatusColors(status) {
  if (status === 'active') {
    return { bg: 'var(--status-good-bg)', text: 'var(--status-good-text)' }
  }
  return { bg: 'var(--status-danger-bg)', text: 'var(--status-danger-text)' }
}

function getRiskColors(score) {
  if (score > 50) return { bg: 'var(--status-danger-bg)', text: 'var(--status-danger-text)', bar: 'var(--status-danger-bar)' }
  if (score > 20) return { bg: 'var(--status-warn-bg)', text: 'var(--status-warn-text)', bar: 'var(--status-warn-bar)' }
  return { bg: 'var(--status-good-bg)', text: 'var(--status-good-text)', bar: 'var(--status-good-bar)' }
}

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

  if (loading) return <p style={{ padding: '20px', color: 'var(--text)' }}>Loading employees...</p>

  return (
    <div style={{ padding: '30px' }}>
      <h2 style={{ marginBottom: '24px' }}>Employee Registry</h2>
      <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px' }}>
        <thead>
          <tr>
            <th style={{ padding: '10px', textAlign: 'left', color: 'var(--text)', fontSize: '16px', fontWeight: 500 }}>Name</th>
            <th style={{ padding: '10px', textAlign: 'left', color: 'var(--text)', fontSize: '16px', fontWeight: 500 }}>Phone</th>
            <th style={{ padding: '10px', textAlign: 'left', color: 'var(--text)', fontSize: '16px', fontWeight: 500 }}>Role</th>
            <th style={{ padding: '10px', textAlign: 'left', color: 'var(--text)', fontSize: '16px', fontWeight: 500 }}>Daily Wage</th>
            <th style={{ padding: '10px', textAlign: 'left', color: 'var(--text)', fontSize: '16px', fontWeight: 500 }}>Status</th>
            <th style={{ padding: '10px', textAlign: 'left', color: 'var(--text)', fontSize: '16px', fontWeight: 500 }}>Ghost Risk Score</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {employees.map(emp => {
            const statusColors = getStatusColors(emp.status)
            const riskColors = getRiskColors(emp.ghostRiskScore)
            return (
              <tr key={emp._id} style={{ backgroundColor: 'var(--bg-card)' }}>
                <td style={{ padding: '12px', color: 'var(--text-h)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', borderLeft: '1px solid var(--border)' }}>{emp.name}</td>
                <td style={{ padding: '12px', color: 'var(--text)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>{emp.phone}</td>
                <td style={{ padding: '12px', color: 'var(--text)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>{emp.role}</td>
                <td style={{ padding: '12px', color: 'var(--text-h)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>₹{emp.dailyWage}</td>
                <td style={{ padding: '12px', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
                  <span style={{
                    backgroundColor: statusColors.bg,
                    color: statusColors.text,
                    padding: '3px 10px',
                    borderRadius: '20px',
                    fontSize: '12px'
                  }}>
                    {emp.status}
                  </span>
                </td>
                <td style={{ padding: '12px', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', borderRight: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '50px', height: '4px', backgroundColor: 'var(--border)', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{ width: `${emp.ghostRiskScore}%`, height: '100%', backgroundColor: riskColors.bar }} />
                    </div>
                    <span style={{ color: riskColors.text, fontSize: '13px' }}>{emp.ghostRiskScore}</span>
                  </div>
                </td>
                <td style={{ padding: '12px', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', borderRight: '1px solid var(--border)' }}>
                    <a href={`/edit-employee/${emp._id}`} style={{
                      backgroundColor: '#1a1a2e',
                      color: 'white',
                      padding: '5px 12px',
                      borderRadius: '4px',
                      textDecoration: 'none',
                      fontSize: '12px'
                    }}>Edit</a>
                </td>                
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default Employees