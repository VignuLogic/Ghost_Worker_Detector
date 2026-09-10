import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'

function EditEmployee() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    role: '',
    dailyWage: '',
    joiningDate: '',
    workplaceLocation: {
      latitude: '',
      longitude: ''
    }
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/employees/${id}`)
      .then(res => {
        const emp = res.data
        setFormData({
          name: emp.name,
          phone: emp.phone,
          role: emp.role,
          dailyWage: emp.dailyWage,
          joiningDate: emp.joiningDate?.split('T')[0],
          workplaceLocation: {
            latitude: emp.workplaceLocation.latitude,
            longitude: emp.workplaceLocation.longitude
          }
        })
      })
      .catch(() => setError('Failed to load employee data'))
  }, [id])

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === 'latitude' || name === 'longitude') {
      setFormData(prev => ({
        ...prev,
        workplaceLocation: { ...prev.workplaceLocation, [name]: value }
      }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await axios.put(`http://localhost:5000/api/employees/${id}`, {
        ...formData,
        dailyWage: Number(formData.dailyWage),
        workplaceLocation: {
          latitude: Number(formData.workplaceLocation.latitude),
          longitude: Number(formData.workplaceLocation.longitude)
        }
      })
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%',
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid var(--border)',
    backgroundColor: 'var(--surface-1)',
    color: 'var(--text-primary)',
    fontSize: '14px',
    boxSizing: 'border-box'
  }

  const labelStyle = {
    display: 'block',
    marginBottom: '6px',
    fontSize: '13px',
    color: 'var(--text-secondary)'
  }

  return (
    <div style={{ padding: '30px', maxWidth: '500px' }}>
      <h2>Edit Employee</h2>
      {error && (
        <div style={{
          backgroundColor: '#fff3f3',
          border: '1px solid #f44336',
          color: '#f44336',
          padding: '10px',
          borderRadius: '6px',
          marginBottom: '20px'
        }}>
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>Full Name</label>
          <input style={inputStyle} name="name" value={formData.name} onChange={handleChange} required/>
        </div>
        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>Phone Number</label>
          <input style={inputStyle} name="phone" value={formData.phone} onChange={handleChange} required/>
        </div>
        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>Role</label>
          <input style={inputStyle} name="role" value={formData.role} onChange={handleChange} required/>
        </div>
        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>Daily Wage (₹)</label>
          <input style={inputStyle} name="dailyWage" type="number" value={formData.dailyWage} onChange={handleChange} required/>
        </div>
        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>Joining Date</label>
          <input style={inputStyle} name="joiningDate" type="date" value={formData.joiningDate} onChange={handleChange} required/>
        </div>
        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>Workplace Latitude</label>
          <input style={inputStyle} name="latitude" type="number" step="any" value={formData.workplaceLocation.latitude} onChange={handleChange} required/>
        </div>
        <div style={{ marginBottom: '24px' }}>
          <label style={labelStyle}>Workplace Longitude</label>
          <input style={inputStyle} name="longitude" type="number" step="any" value={formData.workplaceLocation.longitude} onChange={handleChange} required/>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button type="submit" disabled={loading} style={{
            backgroundColor: '#e94560',
            color: 'white',
            border: 'none',
            padding: '12px 30px',
            borderRadius: '6px',
            fontSize: '15px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1
          }}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
          <button type="button" onClick={() => navigate('/')} style={{
            backgroundColor: 'transparent',
            color: 'var(--text-secondary)',
            border: '1px solid var(--border)',
            padding: '12px 30px',
            borderRadius: '6px',
            fontSize: '15px',
            cursor: 'pointer'
          }}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditEmployee