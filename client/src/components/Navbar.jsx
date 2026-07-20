import { Link, useLocation } from 'react-router-dom'

function Navbar() {
  const location = useLocation()

  const linkStyle = (path) => ({
    color: location.pathname === path ? 'var(--text-h)' : 'var(--text)',
    textDecoration: 'none',
    fontSize: '15px',
    paddingBottom: '4px',
    borderBottom: location.pathname === path ? '2px solid var(--accent)' : '2px solid transparent'
  })

  return (
    <nav style={{
      backgroundColor: 'var(--bg-card)',
      borderBottom: '1px solid var(--border)',
      padding: '15px 30px',
      display: 'flex',
      gap: '30px',
      alignItems: 'center'
    }}>
      <h2 style={{ color: 'var(--accent)', margin: 0, fontSize: '20px' }}>Ghost Worker Detector</h2>
      <Link to="/" style={linkStyle('/')}>Employees</Link>
      <Link to="/attendance" style={linkStyle('/attendance')}>Attendance</Link>
      <Link to="/fraud" style={linkStyle('/fraud')}>Fraud Flags</Link>
    </nav>
  )
}

export default Navbar