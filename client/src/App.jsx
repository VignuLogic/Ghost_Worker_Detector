import { Routes, Route } from 'react-router-dom'
import Employees from './pages/Employees'
import Attendance from './pages/Attendance'
import FraudFlags from './pages/FraudFlags'
import Navbar from './components/Navbar'

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Employees />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/fraud" element={<FraudFlags />} />
      </Routes>
    </div>
  )
}

export default App