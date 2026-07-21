    import { useEffect, useState } from 'react'
import { calculateAllRiskScores } from '../api/api'

function RiskScore() {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  useEffect(() => {
    calculateAllRiskScores()
      .then(res => {
        setResults(res.data.results)
        setMessage(res.data.message)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  if (loading) return <p style={{ padding: '20px' }}>Calculating risk scores...</p>

  return (
    <div style={{ padding: '30px' }}>
      <h2>👻 Ghost Risk Scores</h2>
      <p style={{ color: '#666', marginBottom: '20px' }}>{message}</p>
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        {results.map((result, index) => (
          <div key={index} style={{
            backgroundColor: result.riskLevel === 'HIGH' ? '#fff3f3' : result.riskLevel === 'MEDIUM' ? '#fff8e1' : '#f1f8f1',
            border: `2px solid ${result.riskLevel === 'HIGH' ? '#f44336' : result.riskLevel === 'MEDIUM' ? '#ff9800' : '#4caf50'}`,
            borderRadius: '10px',
            padding: '20px',
            minWidth: '200px',
            textAlign: 'center'
          }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#1a1a2e' }}>{result.employee}</h3>
            <div style={{
              fontSize: '48px',
              fontWeight: 'bold',
              color: result.riskLevel === 'HIGH' ? '#f44336' : result.riskLevel === 'MEDIUM' ? '#ff9800' : '#4caf50'
            }}>
              {result.ghostRiskScore}
            </div>
            <div style={{
              backgroundColor: result.riskLevel === 'HIGH' ? '#f44336' : result.riskLevel === 'MEDIUM' ? '#ff9800' : '#4caf50',
              color: 'white',
              padding: '5px 15px',
              borderRadius: '20px',
              marginTop: '10px',
              fontSize: '14px'
            }}>
              {result.riskLevel} RISK
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RiskScore