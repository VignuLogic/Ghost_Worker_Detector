import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [theme, setTheme] = useState(
    document.documentElement.getAttribute('data-theme') || 'dark'
  )

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/login'
  }

  const linkStyle = (path) => ({
    color: location.pathname === path ? 'var(--text-h)' : 'var(--text)',
    textDecoration: 'none',
    fontSize: '15px',
    paddingBottom: '4px',
    borderBottom: location.pathname === path ? '2px solid var(--accent)' : '2px solid transparent'
  })

  function toggleTheme() {
    const next = theme === 'light' ? 'dark' : 'light'
    document.documentElement.setAttribute('data-theme', next)
    localStorage.setItem('theme', next)
    setTheme(next)
  }

  return (
    <nav className="glass" style={{
      position: 'sticky',
      top: 0,
      zIndex: 10,
      padding: '15px 30px',
      display: 'flex',
      gap: '30px',
      alignItems: 'center',
      borderRadius: 0,
      borderTop: 'none',
      borderLeft: 'none',
      borderRight: 'none'
    }}>
      
      <h2 style={{ color: 'var(--accent)', margin: 0, fontSize: '20px' }}>Ghost Worker Detector</h2>
      <Link to="/" style={linkStyle('/')}>Employees</Link>
      <Link to="/attendance" style={linkStyle('/attendance')}>Attendance</Link>
      <Link to="/fraud" style={linkStyle('/fraud')}>Fraud Flags</Link>
      <Link to="/riskscore" style={linkStyle('/riskscore')}>Risk Scores</Link>
      <Link to="/payroll" style={linkStyle('/payroll')}>Payroll</Link>
      <Link to="/ml" style={linkStyle('/ml')}>ML Analysis</Link>
      <Link to="/add-employee" style={linkStyle('/add-employee')}>+ Add Employee</Link>
      <Link to="/qr-display" style={linkStyle('/qr-display')}>Show QR</Link>

      <button
        onClick={toggleTheme}
        aria-label="Toggle theme"
        style={{
          marginLeft: 'auto',
          background: 'transparent',
          border: '1px solid var(--border)',
          borderRadius: '6px',
          width: '32px',
          height: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: 'var(--text)'
        }}
      >
        {theme === 'light' ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="5" />
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
          </svg>
        )}
      </button>

      <button onClick={handleLogout} style={{
        backgroundColor: 'transparent',
        border: '1px solid var(--border)',
        color: 'var(--text)',
        padding: '6px 16px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '13px'
      }}>
        Logout
      </button>
    </nav>
  )
}

export default Navbar