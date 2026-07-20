import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav style={{
      backgroundColor: '#1a1a2e',
      padding: '15px 30px',
      display: 'flex',
      gap: '30px',
      alignItems: 'center'
    }}>
      <h2 style={{ color: '#e94560', margin: 0 }}> Ghost Worker Detector</h2>
      <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Employees</Link>
      <Link to="/attendance" style={{ color: 'white', textDecoration: 'none' }}>Attendance</Link>
      <Link to="/fraud" style={{ color: 'white', textDecoration: 'none' }}>Fraud Flags</Link>
    </nav>
  )
}

export default Navbar