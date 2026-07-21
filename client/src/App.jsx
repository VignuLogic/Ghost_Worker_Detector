import { Routes, Route } from 'react-router-dom'
import Employees from './pages/Employees'
import Attendance from './pages/Attendance'
import FraudFlags from './pages/FraudFlags'
import RiskScore from './pages/RiskScore'
import Navbar from './components/Navbar'
import Payroll from './pages/Payroll'

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Employees />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/fraud" element={<FraudFlags />} />
        <Route path="/riskscore" element={<RiskScore />} />
        <Route path="/payroll" element={<Payroll />} />
      </Routes>
    </div>
  )
}

export default App