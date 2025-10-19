import React, { useState, useEffect } from 'react'
import {
  CCard, CCardBody, CCardHeader, CCol, CRow, CButton, CForm,
  CFormInput, CFormLabel, CAlert, CSpinner, CListGroup, CListGroupItem
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilSearch, cilUser, cilPhone, cilX } from '@coreui/icons'
import { searchStudentByText } from '../../api/api'
// We'll import the MyProfile component and pass studentIdProp to it
import MyProfile from '../../components/UpdateStudentProfile'

const UpdateStudent = () => {
  const [searchText, setSearchText] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [searching, setSearching] = useState(false)
  const [error, setError] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)

  // Search students as user types
  useEffect(() => {
    const searchStudents = async () => {
      if (searchText.length < 2) {
        setSearchResults([])
        setShowDropdown(false)
        return
      }

      setSearching(true)
      setError('')
      
      try {
        const results = await searchStudentByText(searchText)
        setSearchResults(results || [])
        setShowDropdown(true)
      } catch (err) {
        console.error('Error searching students:', err)
        setError('Failed to search students')
        setSearchResults([])
      } finally {
        setSearching(false)
      }
    }

    const debounceTimer = setTimeout(searchStudents, 300)
    return () => clearTimeout(debounceTimer)
  }, [searchText])

  const handleSelectStudent = (student) => {
    setSelectedStudent(student)
    setSearchText('')
    setSearchResults([])
    setShowDropdown(false)
    setError('')
  }

  const handleReset = () => {
    setSearchText('')
    setSearchResults([])
    setSelectedStudent(null)
    setError('')
    setShowDropdown(false)
  }

  return (
    <CRow>
      <CCol xs={12}>
        {!selectedStudent ? (
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Update Student Profile</strong>
            </CCardHeader>
            <CCardBody>
              <CRow className="g-3">
                <CCol xs={12}>
                  <CFormLabel>Search Student by Name *</CFormLabel>
                  <div className="position-relative">
                    <CFormInput
                      type="text"
                      placeholder="Type student name to search..."
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                      autoComplete="off"
                    />
                    {searching && (
                      <div className="position-absolute top-50 end-0 translate-middle-y me-3">
                        <CSpinner size="sm" />
                      </div>
                    )}
                  </div>
                  <small className="text-muted">Type at least 2 characters to search</small>
                </CCol>

                {/* Search Results Dropdown */}
                {showDropdown && searchResults.length > 0 && (
                  <CCol xs={12}>
                    <CListGroup>
                      {searchResults.map((student) => (
                        <CListGroupItem
                          key={student.StudentId}
                          onClick={() => handleSelectStudent(student)}
                          style={{ cursor: 'pointer' }}
                          className="d-flex justify-content-between align-items-start hover-bg-light"
                        >
                          <div className="flex-grow-1">
                            <div className="d-flex align-items-center mb-1">
                              <CIcon icon={cilUser} className="me-2 text-primary" />
                              <strong>{student.StudentName}</strong>
                              <span className="badge bg-info ms-2">ID: {student.StudentId}</span>
                            </div>
                            <div className="d-flex align-items-center text-muted small">
                              <CIcon icon={cilPhone} className="me-1" size="sm" />
                              <span className="me-3">{student.Mobileno1 || 'N/A'}</span>
                              <span className="me-3">📧 {student.EmailId || 'N/A'}</span>
                              <span>🆔 {student.AdmissionNo || 'N/A'}</span>
                            </div>
                          </div>
                          <CIcon icon={cilSearch} className="text-primary" />
                        </CListGroupItem>
                      ))}
                    </CListGroup>
                    <small className="text-muted d-block mt-2">
                      Found {searchResults.length} student(s). Click to select.
                    </small>
                  </CCol>
                )}

                {showDropdown && searchResults.length === 0 && !searching && (
                  <CCol xs={12}>
                    <CAlert color="info">
                      No students found matching "{searchText}"
                    </CAlert>
                  </CCol>
                )}

                {error && (
                  <CCol xs={12}>
                    <CAlert color="danger" dismissible onClose={() => setError('')}>
                      {error}
                    </CAlert>
                  </CCol>
                )}
              </CRow>
            </CCardBody>
          </CCard>
        ) : (
          <>
            <CCard className="mb-3">
              <CCardBody>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="mb-1">
                      <CIcon icon={cilUser} className="me-2" />
                      {selectedStudent.StudentName}
                    </h5>
                    <div className="text-muted">
                      <span className="me-3">Student ID: <strong>{selectedStudent.StudentId}</strong></span>
                      <span className="me-3">📞 {selectedStudent.Mobileno1}</span>
                      <span>🆔 {selectedStudent.AdmissionNo}</span>
                    </div>
                  </div>
                  <CButton color="secondary" size="sm" onClick={handleReset}>
                    <CIcon icon={cilX} className="me-1" />
                    Change Student
                  </CButton>
                </div>
              </CCardBody>
            </CCard>
            <MyProfile studentIdProp={selectedStudent.StudentId} />
          </>
        )}
      </CCol>
    </CRow>
  )
}

export default UpdateStudent
