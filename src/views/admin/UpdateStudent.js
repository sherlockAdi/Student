import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  CCard, CCardBody, CCardHeader, CCol, CRow, CButton, CFormInput, CFormLabel,
  CAlert, CSpinner, CListGroup, CListGroupItem
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilSearch, cilUser, cilPhone, cilX } from '@coreui/icons'
import { searchStudentByText, updateStudentDetails } from '../../api/api'
import MyProfile from '../../components/UpdateStudentProfile'
import { useToast } from '../../components'

const UpdateStudent = () => {
  const { pushToast } = useToast()
  const [searchParams] = useSearchParams()
  const [searchText, setSearchText] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [searching, setSearching] = useState(false)
  const [error, setError] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')

  // Check for studentId in URL params on component mount
  useEffect(() => {
    const studentId = searchParams.get('studentId')
    const tab = searchParams.get('tab')
    
    if (studentId) {
      // If studentId is in URL, load student directly
      loadStudentById(studentId)
      setActiveTab(tab || 'profile')
    }
  }, [searchParams])

  // Function to load student by ID
  const loadStudentById = async (studentId) => {
    setSearching(true)
    setError('')
    try {
      const studentres = await searchStudentByText(studentId)
      if(studentres.length > 0){
        const student = studentres[0]
        setSelectedStudent(student)
        setSearchText('')
        setSearchResults([])
        setShowDropdown(false)
      }else{
        setError('Student not found')
        pushToast({ title: 'Error', message: 'Student not found', type: 'error' })
      }
    } catch (err) {
      console.error('Error loading student:', err)
      setError('Failed to load student')
      pushToast({ title: 'Error', message: 'Failed to load student', type: 'error' })
    } finally {
      setSearching(false)
    }
  }

  // 🔍 Manual search on button click
  const handleSearch = async () => {
    if (searchText.trim().length < 2) {
      setError('Please enter at least 2 characters to search')
      pushToast({ title: 'Validation', message: 'Please enter at least 2 characters to search', type: 'warning' })
      setSearchResults([])
      setShowDropdown(false)
      return
    }

    setSearching(true)
    setError('')
    setShowDropdown(false)

    try {
      const results = await searchStudentByText(searchText)
      setSearchResults(results || [])
      setShowDropdown(true)
      pushToast({ title: 'Search Complete', message: `Found ${results?.length || 0} student(s)`, type: 'success' })
    } catch (err) {
      console.error('Error searching students:', err)
      setError('Failed to search students')
      setSearchResults([])
      pushToast({ title: 'Error', message: 'Failed to search students', type: 'error' })
    } finally {
      setSearching(false)
    }
  }

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
    setActiveTab('profile')
  }

  const handleRemoveCurrent = async () => {
    if (!selectedStudent) return
    
    if (window.confirm(`Are you sure you want to remove ${selectedStudent.StudentName}? This action cannot be undone.`)) {
      try {
        // Here you would typically call your API to remove the student
        // For now, we'll just reset the form
        pushToast({ 
          title: 'Student Removed', 
          message: `${selectedStudent.StudentName} has been removed successfully.`,
          type: 'success' 
        })
        handleReset()
      } catch (error) {
        console.error('Error removing student:', error)
        pushToast({ 
          title: 'Error', 
          message: 'Failed to remove student. Please try again.',
          type: 'error' 
        })
      }
    }
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
                <CCol md={8}>
                  <CFormLabel>
                    Search Student by Name <span className="text-danger">*</span>
                  </CFormLabel>
                  <CFormInput
                    type="text"
                    placeholder="Enter student name"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    autoComplete="off"
                  />
                  <small className="text-muted">Type at least 2 characters before searching</small>
                </CCol>

                <CCol md={8} className="d-flex align-items-end">
                  <CButton
                    color="primary"
                    onClick={handleSearch}
                    disabled={searching}
                    className="me-2"
                  >
                    {searching ? (
                      <>
                        <CSpinner size="sm" className="me-2" />
                        Searching...
                      </>
                    ) : (
                      <>
                        <CIcon icon={cilSearch} className="me-2" />
                        Search
                      </>
                    )}
                  </CButton>
                  <CButton color="secondary" variant="outline" onClick={handleReset}>
                    <CIcon icon={cilX} className="me-1" /> Reset
                  </CButton>
                </CCol>

                {/* Search Results */}
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
                    <CAlert color="info">No students found matching "{searchText}"</CAlert>
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
                      <span className="me-3">
                        Student ID: <strong>{selectedStudent.StudentId}</strong>
                      </span>
                      <span className="me-3">📞 {selectedStudent.Mobileno1}</span>
                      <span>🆔 {selectedStudent.AdmissionNo}</span>
                    </div>
                  </div>
                  <div className="d-flex gap-2">
                    <CButton 
                      color="danger" 
                      variant="outline" 
                      size="sm" 
                      onClick={handleRemoveCurrent}
                      title="Remove current student"
                    >
                      <CIcon icon={cilX} className="me-1" /> Remove Current
                    </CButton>
                    <CButton 
                      color="secondary" 
                      size="sm" 
                      onClick={handleReset}
                      title="Search for another student"
                    >
                      <CIcon icon={cilSearch} className="me-1" /> Change Student
                    </CButton>
                  </div>
                </div>
              </CCardBody>
            </CCard>
            <MyProfile 
              studentIdProp={selectedStudent.StudentId}
              admissionNo={selectedStudent.AdmissionNo}
              activeTab={activeTab}
              onTabChange={(tab) => setActiveTab(tab)}
              onUpdateSuccess={(updatedData) => {
                // Update the selected student data if needed
                setSelectedStudent(prev => ({
                  ...prev,
                  ...updatedData,
                  // Add any other fields that might have been updated
                }))
                pushToast({
                  title: 'Success',
                  message: 'Student details updated successfully!',
                  type: 'success'
                })
              }}
            />
          </>
        )}
      </CCol>
    </CRow>
  )
}

export default UpdateStudent
