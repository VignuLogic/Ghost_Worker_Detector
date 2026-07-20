import axios from 'axios'

const BASE_URL = 'http://localhost:5000/api'

export const getEmployees = () => axios.get(`${BASE_URL}/employees`)
export const getAttendance = () => axios.get(`${BASE_URL}/attendance`)
export const getLeaves = () => axios.get(`${BASE_URL}/leaves`)
export const checkFraud = (employeeId) => axios.get(`${BASE_URL}/leaves/fraud-check/${employeeId}`)