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
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, formData)
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
    backgroundColor: 'var(--bg)',
    color: 'var(--text-h)',
    fontSize: '15px',
    boxSizing: 'border-box'
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'var(--bg)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* All animation CSS lives right here — no external stylesheet needed */}
      <style>{`
        @keyframes floatBlobA {
          0%, 100% { transform: translate(-130px, -90px) scale(1); }
          50% { transform: translate(70px, 40px) scale(1.2); }
        }
        @keyframes floatBlobB {
          0%, 100% { transform: translate(120px, 100px) scale(1); }
          50% { transform: translate(-60px, -50px) scale(1.1); }
        }
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(24px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes fieldIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes logoPulse {
          0%, 100% { transform: scale(1) rotate(0deg); }
          50% { transform: scale(1.08) rotate(-3deg); }
        }
        @keyframes shakeError {
          10%, 90% { transform: translateX(-1px); }
          20%, 80% { transform: translateX(3px); }
          30%, 50%, 70% { transform: translateX(-6px); }
          40%, 60% { transform: translateX(6px); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .login-card {
          animation: cardIn 0.55s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .login-logo {
          display: inline-block;
          animation: logoPulse 3.5s ease-in-out infinite;
        }
        .login-field {
          animation: fieldIn 0.45s ease both;
        }
        .login-error {
          animation: shakeError 0.5s ease;
        }
        .login-input {
          transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
        }
        .login-input:focus {
          outline: none;
          border-color: var(--accent);
          box-shadow: 0 0 0 3px var(--accent-bg);
          transform: translateY(-1px);
        }
        .login-btn {
          transition: transform 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease;
        }
        .login-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px var(--accent-bg);
        }
        .login-btn:active:not(:disabled) {
          transform: translateY(0) scale(0.98);
        }
        .login-eye {
          transition: color 0.15s ease, transform 0.15s ease;
        }
        .login-eye:hover {
          color: var(--accent);
          transform: translateY(-50%) scale(1.1);
        }
        .login-spinner {
          display: inline-block;
          width: 14px;
          height: 14px;
          border: 2px solid rgba(0,0,0,0.25);
          border-top-color: var(--bg);
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          vertical-align: -2px;
          margin-right: 8px;
        }

        @media (prefers-reduced-motion: reduce) {
          .login-card, .login-logo, .login-field, .login-error,
          [data-blob] { animation: none !important; }
        }
      `}</style>

      {/* ambient glow, purely decorative */}
      <div data-blob style={{
        position: 'absolute',
        width: '420px',
        height: '420px',
        borderRadius: '50%',
        background: 'var(--accent-bg)',
        filter: 'blur(60px)',
        animation: 'floatBlobA 9s ease-in-out infinite',
        pointerEvents: 'none'
      }} />
      <div data-blob style={{
        position: 'absolute',
        width: '340px',
        height: '340px',
        borderRadius: '50%',
        background: 'var(--status-danger-bg)',
        opacity: 0.35,
        filter: 'blur(70px)',
        animation: 'floatBlobB 11s ease-in-out infinite',
        pointerEvents: 'none'
      }} />

      <div className="login-card" style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: '16px',
        boxShadow: 'var(--shadow)',
        padding: '40px',
        width: '100%',
        maxWidth: '400px',
        position: 'relative'
      }}>
        <h2 style={{ marginBottom: '8px', textAlign: 'center' }}>
          <span className="login-logo">👻</span> Ghost Worker Detector
        </h2>
        <p style={{ textAlign: 'center', color: 'var(--text)', marginBottom: '30px', fontSize: '14px' }}>Owner Login</p>

        {error && (
          <div className="login-error" style={{
            backgroundColor: 'var(--status-danger-bg)',
            border: '1px solid var(--status-danger-text)',
            color: 'var(--status-danger-text)',
            padding: '10px',
            borderRadius: '6px',
            marginBottom: '20px',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="login-field" style={{ marginBottom: '16px', animationDelay: '0.05s' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: 'var(--text)' }}>Email</label>
            <input className="login-input" style={inputStyle} name="email" type="email" value={formData.email} onChange={handleChange} required placeholder="vignu@gmail.com"/>
          </div>

          <div className="login-field" style={{ marginBottom: '24px', animationDelay: '0.15s' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', color: 'var(--text)' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <input className="login-input" style={inputStyle} name="password" type={showPassword ? 'text' : 'password'} value={formData.password} onChange={handleChange} required placeholder="••••••••"/>
              <span className="login-eye" onClick={() => setShowPassword(!showPassword)} style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                cursor: 'pointer',
                color: 'var(--text)'
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

          <button type="submit" disabled={loading} className="login-btn login-field" style={{
            width: '100%',
            backgroundColor: 'var(--accent)',
            color: 'var(--bg)',
            border: 'none',
            padding: '12px',
            borderRadius: '6px',
            
            fontSize: '15px',
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
            animationDelay: '0.25s'
          }}>
            {loading && <span className="login-spinner" />}
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login