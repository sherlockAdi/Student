import React, { useState } from 'react'
import axios from 'axios'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CAlert,
} from '@coreui/react'

const Api = () => {
  const [email, setEmail] = useState('dg@atm.edu.in')
  const [password, setPassword] = useState('ashok@123')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [data, setData] = useState(null)

  const callLogin = async (e) => {
    e.preventDefault()
    setError('')
    setData(null)
    setLoading(true)
    try {
      const resp = await axios.post('http://61.246.33.108:8069/login', {
        User_Email_Id: email,
        Password: password,
        RememberMe: false,
        IsRemoteLogin: true,
      }, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      })
      setData(resp.data)
    } catch (err) {
      if (err.response) {
        setError(`Request failed: ${err.response.status} ${err.response.statusText}`)
      } else if (err.request) {
        setError('No response received. This might be a CORS issue if calling from the browser.')
      } else {
        setError(err.message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <CContainer className="py-4">
      <CRow className="justify-content-center">
        <CCol md={8}>
          <CCard>
            <CCardHeader>
              <strong>Login API Test</strong>
            </CCardHeader>
            <CCardBody>
              <CForm onSubmit={callLogin}>
                <CInputGroup className="mb-3">
                  <CInputGroupText>Email</CInputGroupText>
                  <CFormInput
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="dg@atm.edu.in"
                    required
                  />
                </CInputGroup>
                <CInputGroup className="mb-3">
                  <CInputGroupText>Password</CInputGroupText>
                  <CFormInput
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="ashok@123"
                    required
                  />
                </CInputGroup>
                <CButton type="submit" color="primary" disabled={loading}>
                  {loading ? 'Calling...' : 'Call Login API'}
                </CButton>
              </CForm>

              {error && (
                <CAlert color="danger" className="mt-3">
                  {error}
                </CAlert>
              )}

              {data && (
                <div className="mt-3">
                  <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(data, null, 2)}</pre>
                </div>
              )}
            </CCardBody>
          </CCard>

          <CAlert color="info" className="mt-3">
            If you encounter a CORS error, you may need to use a dev proxy or have the API enable CORS.
          </CAlert>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default Api
