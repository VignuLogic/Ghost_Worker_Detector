const QRCode = require('qrcode')
const { v4: uuidv4 } = require('uuid')

let currentToken = null
let tokenExpiry = null

const generateNewToken = () => {
  currentToken = uuidv4()
  tokenExpiry = Date.now() + 60000 // expires in 60 seconds
  return currentToken
}

const getCurrentToken = () => {
  if (!currentToken || Date.now() > tokenExpiry) {
    generateNewToken()
  }
  return currentToken
}

const isTokenValid = (token) => {
  return token === currentToken && Date.now() <= tokenExpiry
}

const generateQRCode = async () => {
  const token = getCurrentToken()
  const qrDataURL = await QRCode.toDataURL(token, {
    width: 300,
    margin: 2,
    color: {
      dark: '#000000',
      light: '#ffffff'
    }
  })
  return { token, qrDataURL, expiresIn: Math.round((tokenExpiry - Date.now()) / 1000) }
}

// auto-refresh token every 60 seconds
setInterval(generateNewToken, 60000)
generateNewToken() // generate first token on startup

module.exports = { generateQRCode, isTokenValid, getCurrentToken }