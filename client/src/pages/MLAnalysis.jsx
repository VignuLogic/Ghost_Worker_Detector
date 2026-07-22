import { useEffect, useState } from 'react'
import axios from 'axios'

function MLAnalysis() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get('http://127.0.0.1:5001/ml/analyze')
      .then(res => {
        setData(res.data)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  if (loading) return <p style={{ padding: '20px' }}>Running Isolation Forest analysis...</p>

  return (
    <div style={{ padding: '30px' }}>
      <h2>🤖 ML Analysis — Isolation Forest</h2>
      <div style={{ marginBottom: '20px', display: 'flex', gap: '20px' }}>
        <div style={{ backgroundColor: '#1a1a2e', color: 'white', padding: '15px 25px', borderRadius: '8px' }}>
          <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{data.total_employees}</div>
          <div style={{ fontSize: '12px', color: '#aaa' }}>Total Employees</div>
        </div>
        <div style={{ backgroundColor: '#f44336', color: 'white', padding: '15px 25px', borderRadius: '8px' }}>
          <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{data.anomalies_detected}</div>
          <div style={{ fontSize: '12px' }}>Anomalies Detected</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        {data.results.map((result, index) => (
          <div key={index} style={{
            border: `2px solid ${result.risk_level === 'HIGH' ? '#f44336' : result.risk_level === 'MEDIUM' ? '#ff9800' : '#4caf50'}`,
            borderRadius: '10px',
            padding: '20px',
            minWidth: '250px',
            backgroundColor: result.is_anomaly ? '#1a0000' : 'transparent'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0 }}>{result.name}</h3>
              {result.is_anomaly && (
                <span style={{
                  backgroundColor: '#f44336',
                  color: 'white',
                  padding: '3px 8px',
                  borderRadius: '20px',
                  fontSize: '11px'
                }}>🚨 ANOMALY</span>
              )}
            </div>

            <div style={{
              fontSize: '48px',
              fontWeight: 'bold',
              color: result.risk_level === 'HIGH' ? '#f44336' : result.risk_level === 'MEDIUM' ? '#ff9800' : '#4caf50',
              margin: '10px 0'
            }}>
              {result.ml_risk_score}
            </div>

            <div style={{
              backgroundColor: result.risk_level === 'HIGH' ? '#f44336' : result.risk_level === 'MEDIUM' ? '#ff9800' : '#4caf50',
              color: 'white',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '12px',
              display: 'inline-block',
              marginBottom: '15px'
            }}>
              {result.risk_level} RISK
            </div>

            <div style={{ fontSize: '13px', color: '#aaa' }}>
              <div>Total Check-ins: {result.features.total_checkins}</div>
              <div>Suspicious Check-ins: {result.features.suspicious_checkins}</div>
              <div>Outside Geofence: {result.features.outside_geofence}</div>
              <div>Unique Devices: {result.features.unique_devices}</div>
              <div>Salary Paid: ₹{result.features.total_salary_paid}</div>
              <div>Flagged Payroll: {result.features.flagged_payroll}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MLAnalysis