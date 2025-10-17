import React, { useState } from 'react'
import {
  CCard, CCardBody, CCardHeader, CCol, CRow, CButton, CForm,
  CFormInput, CFormLabel, CAlert, CSpinner
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilSearch } from '@coreui/icons'
// We'll import the MyProfile component and pass studentIdProp to it
import MyProfile from '../../components/UpdateStudentProfile'

const UpdateStudent = () => {
  const [searchStudentId, setSearchStudentId] = useState('')
  const [selectedStudentId, setSelectedStudentId] = useState(null)
  const [searching, setSearching] = useState(false)
  const [error, setError] = useState('')

  const handleSearch = async (e) => {
    e.preventDefault()
    
    if (!searchStudentId || isNaN(searchStudentId)) {
      setError('Please enter a valid Student ID')
      return
    }

    setSearching(true)
    setError('')
    
    // Set the student ID for the profile component
    setSelectedStudentId(parseInt(searchStudentId))
    setSearching(false)
  }

  const handleReset = () => {
    setSearchStudentId('')
    setSelectedStudentId(null)
    setError('')
  }

  return (
    <CRow>
      <CCol xs={12}>
        {!selectedStudentId ? (
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Update Student Profile</strong>
            </CCardHeader>
            <CCardBody>
              <CForm onSubmit={handleSearch}>
                <CRow className="g-3 align-items-end">
                  <CCol md={8}>
                    <CFormLabel>Student ID *</CFormLabel>
                    <CFormInput
                      type="number"
                      placeholder="Enter Student ID to update profile"
                      value={searchStudentId}
                      onChange={(e) => setSearchStudentId(e.target.value)}
                      required
                    />
                  </CCol>
                  <CCol md={4}>
                    <CButton type="submit" color="primary" disabled={searching}>
                      {searching ? (
                        <>
                          <CSpinner size="sm" className="me-1" />
                          Searching...
                        </>
                      ) : (
                        <>
                          <CIcon icon={cilSearch} className="me-1" />
                          Load Student Profile
                        </>
                      )}
                    </CButton>
                  </CCol>
                  {error && (
                    <CCol xs={12}>
                      <CAlert color="danger" dismissible onClose={() => setError('')}>
                        {error}
                      </CAlert>
                    </CCol>
                  )}
                </CRow>
              </CForm>
            </CCardBody>
          </CCard>
        ) : (
          <>
            <CCard className="mb-3">
              <CCardBody>
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">
                    Updating Profile for Student ID: <strong>{selectedStudentId}</strong>
                  </h5>
                  <CButton color="secondary" size="sm" onClick={handleReset}>
                    <CIcon icon={cilSearch} className="me-1" />
                    Change Student
                  </CButton>
                </div>
              </CCardBody>
            </CCard>
            <MyProfile studentIdProp={selectedStudentId} />
          </>
        )}
      </CCol>
    </CRow>
  )
}

export default UpdateStudent
