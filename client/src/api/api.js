import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL

export const getEmployees = () => axios.get(`${BASE_URL}/employees`)
export const getAttendance = () => axios.get(`${BASE_URL}/attendance`)
export const getLeaves = () => axios.get(`${BASE_URL}/leaves`)
export const checkFraud = (employeeId) => axios.get(`${BASE_URL}/leaves/fraud-check/${employeeId}`)
export const calculateAllRiskScores = () => axios.get(`${BASE_URL}/riskscore/all`)
export const getRiskScore = (employeeId) => axios.get(`${BASE_URL}/riskscore/${employeeId}`)
export const getPayroll = () => axios.get(`${BASE_URL}/payroll`)