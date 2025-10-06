import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CAlert,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import { loginAs } from '../../../utils/auth'
import { login as apiLogin } from '../../../api/api'

const Login = () => {
  const [role, setRole] = useState('admin')
  const [email, setEmail] = useState('dg@atm.edu.in')
  const [password, setPassword] = useState('ashok@123')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const location = useLocation()


  const onLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await apiLogin({ email, password })
      // Optional: persist token if provided
      if (data?.Token) {
        try { localStorage.setItem('authToken', data.Token) } catch {}
      }
      // If backend indicates failure, surface error
      // if (data?.status === false) {
      //   setError('Login failed. Please check your credentials or access rights.')
      //   return
      // }
      // Keep existing role-based navigation using mock auth for now
      console.log(data)
      if(data.RoleId === "1"){
        loginAs('admin')
      }
      else{
        loginAs('student')
      }
      // loginAs(role)
      const from = location.state?.from?.pathname
      if (from) {
        navigate(from, { replace: true })
        return
      }
      navigate(role === 'admin' ? '/admin/students' : '/student/profile', { replace: true })
    } catch (err) {
      if (err.response) {
        setError(`Request failed: ${err.response.status} ${err.response.statusText}`)
      } else if (err.request) {
        setError('No response received (possible CORS issue).')
      } else {
        setError(err.message)
      }
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={onLogin}>
                    <h1>Login</h1>
                    <p className="text-body-secondary">Sign In to your account</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        placeholder="Email"
                        autoComplete="username"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </CInputGroup>
                    {/* <CInputGroup className="mb-4">
                      <CInputGroupText>Role</CInputGroupText>
                      <select className="form-select" value={role} onChange={(e) => setRole(e.target.value)}>
                        <option value="admin">Admin</option>
                        <option value="student">Student</option>
                      </select>
                    </CInputGroup> */}
                    {error && (
                      <CAlert color="danger" className="mb-3">{error}</CAlert>
                    )}
                    <CRow>
                      <CCol xs={6}>
                        <CButton type="submit" color="primary" className="px-4" disabled={loading}>
                          {loading ? 'Logging in...' : 'Login'}
                        </CButton>
                      </CCol>
                      <CCol xs={6} className="text-right">
                        <CButton color="link" className="px-0">
                          Forgot password?
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard className="text-white bg-primary py-5" style={{ width: '44%' }}>
                <CCardBody className="text-center">
                  <div>
                    <h2>Sign up</h2>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                      tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                    <Link to="/register">
                      <CButton color="primary" className="mt-3" active tabIndex={-1}>
                        Register Now!
                      </CButton>
                    </Link>
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
