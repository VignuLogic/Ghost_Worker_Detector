import { useState } from 'react'
import axios from 'axios'

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', formData)
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify({ name: res.data.name, email: res.data.email }))
      window.location.href = '/'
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%',
    padding: '12px',
    borderRadius: '6px',
    border: '1px solid var(--border)',
    backgroundColor: 'var(--surface-1)',
    color: 'var(--text-primary)',
    fontSize: '14px',
    boxSizing: 'border-box'
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--surface-0)'
    }}>
      <div style={{
        backgroundColor: 'var(--surface-1)',
        padding: '40px',
        borderRadius: '12px',
        border: '1px solid var(--border)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <h2 style={{ marginBottom: '8px', textAlign: 'center' }}>👻 Ghost Worker Detector</h2>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '30px', fontSize: '14px' }}>Owner Login</p>

        {error && (
          <div style={{
            backgroundColor: '#fff3f3',
            border: '1px solid #f44336',
            color: '#f44336',
            padding: '10px',
            borderRadius: '6px',
            marginBottom: '20px',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: 'var(--text-secondary)' }}>Email</label>
            <input style={inputStyle} name="email" type="email" value={formData.email} onChange={handleChange} required placeholder="vignu@gmail.com"/>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: 'var(--text-secondary)' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <input style={inputStyle} name="password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={handleChange} required placeholder="••••••••"/>
              <span onClick={() => setShowPassword(!showPassword)} style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                cursor: 'pointer',
                color: 'var(--text-secondary)'
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {showPassword ? (
                    <>
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </>
                  ) : (
                    <>
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </>
                  )}
                </svg>
              </span>
            </div>
          </div>

          <button type="submit" disabled={loading} style={{
            width: '100%',
            backgroundColor: '#e94560',
            color: 'white',
            border: 'none',
            padding: '12px',
            borderRadius: '6px',
            fontSize: '15px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1
          }}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login