import { Routes, Route } from 'react-router-dom'
import Employees from './pages/Employees'
import Attendance from './pages/Attendance'
import FraudFlags from './pages/FraudFlags'
import RiskScore from './pages/RiskScore'
import Navbar from './components/Navbar'
import Payroll from './pages/Payroll'
import MLAnalysis from './pages/MLAnalysis'
import AddEmployee from './pages/AddEmployee'
import EditEmployee from './pages/EditEmployee'

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
        <Route path="/ml" element={<MLAnalysis />} />
        <Route path="/add-employee" element={<AddEmployee />} />
        <Route path="/edit-employee/:id" element={<EditEmployee />} />
      </Routes>
    </div>
  )
}

export default App