import { useState, useEffect } from 'react'
import axios from 'axios'

function QRDisplay() {
  const [qrDataURL, setQrDataURL] = useState('')
  const [expiresIn, setExpiresIn] = useState(0)
  const [error, setError] = useState('')

  const fetchQR = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/attendance/qr/generate')
      setQrDataURL(res.data.qrDataURL)
      setExpiresIn(res.data.expiresIn)
      setError('')
    } catch (err) {
      setError('Could not load QR code')
    }
  }

  useEffect(() => {
    fetchQR()
    const refreshTimer = setInterval(fetchQR, 5000) // re-sync with server every 5s
    return () => clearInterval(refreshTimer)
  }, [])

  useEffect(() => {
    if (expiresIn <= 0) return
    const countdown = setInterval(() => {
      setExpiresIn(prev => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(countdown)
  }, [expiresIn])

  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '20px'
    }}>
      <h1>Scan to Check In</h1>
      <div className="glass fade-in" style={{ padding: '30px' }}>
        {qrDataURL ? (
          <img src={qrDataURL} alt="Attendance QR Code" width="300" height="300" />
        ) : (
          <p>Loading QR code...</p>
        )}
      </div>
      {error && <p style={{ color: 'var(--status-danger-text)' }}>{error}</p>}
      <p style={{ color: 'var(--text)', fontSize: '15px' }}>
        Refreshes in <strong>{expiresIn}s</strong>
      </p>
    </div>
  )
}

export default QRDisplay
