import { useState, useEffect } from 'react'
import axios from 'axios'

function getDeviceId() {
  let id = localStorage.getItem('deviceId')
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem('deviceId', id)
  }
  return id
}

function CheckIn() {
  const [employees, setEmployees] = useState([])
  const [employeeId, setEmployeeId] = useState('')
  const [qrToken, setQrToken] = useState('')
  const [status, setStatus] = useState(null) // { type: 'success' | 'error', message }
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    axios.get('http://localhost:5000/api/employees')
      .then(res => setEmployees(res.data))
      .catch(() => setStatus({ type: 'error', message: 'Could not load employee list' }))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus(null)

    if (!employeeId || !qrToken) {
      setStatus({ type: 'error', message: 'Select your name and enter the QR token' })
      return
    }

    setLoading(true)
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const res = await axios.post('http://localhost:5000/api/attendance', {
            employeeId,
            deviceId: getDeviceId(),
            qrToken,
            location: {
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude
            }
          })
          setStatus({
            type: res.data.attendance.status === 'present' ? 'success' : 'error',
            message: `Marked as ${res.data.attendance.status.toUpperCase()}`
          })
        } catch (err) {
          setStatus({ type: 'error', message: err.response?.data?.message || 'Check-in failed' })
        } finally {
          setLoading(false)
          setQrToken('')
        }
      },
      () => {
        setStatus({ type: 'error', message: 'Location permission is required to check in' })
        setLoading(false)
      }
    )
  }

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="glass fade-in" style={{ padding: '40px', width: '100%', maxWidth: '380px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '24px' }}>Worker Check-In</h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: 'var(--text)' }}>
              Your Name
            </label>
            <select
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              style={{
                width: '100%', padding: '12px', borderRadius: '6px',
                border: '1px solid var(--border)', backgroundColor: 'var(--bg)',
                color: 'var(--text-h)', fontSize: '15px'
              }}
            >
              <option value="">Select your name</option>
              {employees.map(emp => (
                <option key={emp._id} value={emp._id}>{emp.name}</option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: 'var(--text)' }}>
              QR Token (shown on the display screen)
            </label>
            <input
              type="text"
              value={qrToken}
              onChange={(e) => setQrToken(e.target.value)}
              placeholder="Paste or type the token"
              style={{
                width: '100%', padding: '12px', borderRadius: '6px',
                border: '1px solid var(--border)', backgroundColor: 'var(--bg)',
                color: 'var(--text-h)', fontSize: '15px', boxSizing: 'border-box'
              }}
            />
          </div>

          {status && (
            <div className={status.type === 'error' ? 'shake' : ''} style={{
              backgroundColor: status.type === 'success' ? 'var(--status-good-bg)' : 'var(--status-danger-bg)',
              color: status.type === 'success' ? 'var(--status-good-text)' : 'var(--status-danger-text)',
              padding: '10px', borderRadius: '6px', marginBottom: '16px', fontSize: '14px'
            }}>
              {status.message}
            </div>
          )}

          <button type="submit" disabled={loading} style={{
            width: '100%', backgroundColor: 'var(--accent)', color: 'var(--bg)',
            border: 'none', padding: '12px', borderRadius: '6px',
            fontSize: '15px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1
          }}>
            {loading ? 'Checking in...' : 'Check In'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default CheckIn