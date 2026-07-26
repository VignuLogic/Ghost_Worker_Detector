import { Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Employees from './pages/Employees'
import Attendance from './pages/Attendance'
import FraudFlags from './pages/FraudFlags'
import RiskScore from './pages/RiskScore'
import Navbar from './components/Navbar'
import Payroll from './pages/Payroll'
import MLAnalysis from './pages/MLAnalysis'
import AddEmployee from './pages/AddEmployee'
import EditEmployee from './pages/EditEmployee'
import Login from './pages/Login'

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'))

  useEffect(() => {
    const stored = localStorage.getItem('token')
    if (stored) setToken(stored)
  }, [])

  if (!token) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    )
  }

  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Employees />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/fraud" element={<FraudFlags />} />
        <Route path="/riskscore" element={<RiskScore />} />
        <Route path="/payroll" element={<Payroll />} />
        <Route path="/ml" element={<MLAnalysis />} />
        <Route path="/add-employee" element={<AddEmployee />} />
        <Route path="/edit-employee/:id" element={<EditEmployee />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  )
}

export default App