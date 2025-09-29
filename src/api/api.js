import axios from 'axios'

const api = axios.create({
  // Use relative base URL so Vite proxy (vite.config.mjs) can forward to backend in dev
  baseURL: '',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  // You may add timeouts/interceptors here if needed
})

export async function login({ email, password, rememberMe = false, isRemoteLogin = true }) {
  const payload = {
    User_Email_Id: email,
    Password: password,
    RememberMe: rememberMe,
    IsRemoteLogin: isRemoteLogin,
  }
  const { data } = await api.post('/login', payload)
  return data
}

export default api
