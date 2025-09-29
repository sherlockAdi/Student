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

export async function searchStudentBySRN(enrolmentno) {
  const { data } = await api.post('/api/fees/search-student', { enrolmentno })
  return data
}

export async function getFeeSelectStudent(studentid) {
  const { data } = await api.post('/api/feeselectstudent/search-student', { studentid })
  return data
}

export async function getFeeInstallmentDetails({ collegeid, SrnNo }) {
  const { data } = await api.post('/api/feeIntallmentDetails/search-student', { collegeid, SrnNo })
  return data
}

export async function getFeeBookNoReceiptNo({ collegeid, uid, utype, message = '' }) {
  const { data } = await api.post('/api/feeBookNoReceiptNo/search-student', {
    collegeid,
    uid,
    utype,
    message,
  })
  return data
}

export default api
