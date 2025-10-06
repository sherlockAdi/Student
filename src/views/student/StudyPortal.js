import React, { useState, useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
  CBadge,
  CButton,
  CListGroup,
  CListGroupItem,
  CAlert,
  CSpinner,
} from '@coreui/react'

const CLIENT_ID = '824399254873-7e872aj3dadc01tdtpdd1rjmck84gg8p.apps.googleusercontent.com'
const SCOPES = 'https://www.googleapis.com/auth/classroom.courses.readonly https://www.googleapis.com/auth/classroom.coursework.me.readonly'

const StudyPortal = () => {
  const [activeTab, setActiveTab] = useState('materials')
  const [isGoogleAuthenticated, setIsGoogleAuthenticated] = useState(false)
  const [googleCourses, setGoogleCourses] = useState([])
  const [googleAssignments, setGoogleAssignments] = useState([])
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false)
  const [googleError, setGoogleError] = useState(null)
  const [accessToken, setAccessToken] = useState(null)
  const [selectedCourse, setSelectedCourse] = useState(null)

  // Google OAuth Authentication
  const handleGoogleLogin = () => {
    const oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth'
    const params = {
      client_id: CLIENT_ID,
      redirect_uri: window.location.origin + '/student/study-portal',
      response_type: 'token',
      scope: SCOPES,
      include_granted_scopes: 'true',
      state: 'pass-through-value',
    }

    const form = document.createElement('form')
    form.setAttribute('method', 'GET')
    form.setAttribute('action', oauth2Endpoint)

    for (const p in params) {
      const input = document.createElement('input')
      input.setAttribute('type', 'hidden')
      input.setAttribute('name', p)
      input.setAttribute('value', params[p])
      form.appendChild(input)
    }

    document.body.appendChild(form)
    form.submit()
  }

  // Parse OAuth token from URL hash
  useEffect(() => {
    const hash = window.location.hash
    if (hash) {
      const params = new URLSearchParams(hash.substring(1))
      const token = params.get('access_token')
      if (token) {
        setAccessToken(token)
        setIsGoogleAuthenticated(true)
        window.history.replaceState({}, document.title, window.location.pathname)
      }
    }
  }, [])

  // Fetch Google Classroom courses
  const fetchGoogleCourses = async () => {
    if (!accessToken) return

    setIsLoadingGoogle(true)
    setGoogleError(null)

    try {
      const response = await fetch('https://classroom.googleapis.com/v1/courses?courseStates=ACTIVE', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch courses')
      }

      const data = await response.json()
      setGoogleCourses(data.courses || [])
    } catch (error) {
      console.error('Error fetching courses:', error)
      setGoogleError('Failed to load Google Classroom courses. Please try again.')
    } finally {
      setIsLoadingGoogle(false)
    }
  }

  // Fetch Google Classroom assignments
  const fetchGoogleAssignments = async (courseId) => {
    if (!accessToken) return

    try {
      const response = await fetch(
        `https://classroom.googleapis.com/v1/courses/${courseId}/courseWork`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )

      if (!response.ok) {
        throw new Error('Failed to fetch assignments')
      }

      const data = await response.json()
      return data.courseWork || []
    } catch (error) {
      console.error('Error fetching assignments:', error)
      return []
    }
  }

  // Load courses when authenticated
  useEffect(() => {
    if (isGoogleAuthenticated && accessToken) {
      fetchGoogleCourses()
    }
  }, [isGoogleAuthenticated, accessToken])

  // Logout from Google
  const handleGoogleLogout = () => {
    setAccessToken(null)
    setIsGoogleAuthenticated(false)
    setGoogleCourses([])
    setGoogleAssignments([])
  }

  return (
    <div>
      {/* Header */}
      <CCard className="border-0 shadow mb-4">
        <CCardBody className="p-0">
          <div className="bg-primary text-white py-3 px-4 d-flex justify-content-between align-items-center">
            <div>
              <h4 className="mb-0 fw-bold">📚 Google Classroom Study Portal</h4>
              <p className="mb-0 mt-1 opacity-75">Access your courses, materials, and assignments</p>
            </div>
            {isGoogleAuthenticated ? (
              <CButton color="light" size="sm" onClick={handleGoogleLogout}>
                Logout from Google
              </CButton>
            ) : (
              <CButton color="light" size="sm" onClick={handleGoogleLogin}>
                <strong>🔐 Login with Google</strong>
              </CButton>
            )}
          </div>
        </CCardBody>
      </CCard>

      {/* Google Login Message */}
      {!isGoogleAuthenticated && (
        <CCard className="border-0 shadow mb-4">
          <CCardBody className="text-center py-5">
            <div className="mb-3">
              <span style={{ fontSize: '4rem' }}>🎓</span>
            </div>
            <h5 className="fw-bold mb-3">Connect Your Google Classroom</h5>
            <p className="text-muted mb-4">
              Login with your Google account to access courses, assignments, and study materials from Google Classroom.
            </p>
            <CButton color="primary" size="lg" onClick={handleGoogleLogin}>
              <strong>🔐 Sign in with Google</strong>
            </CButton>
          </CCardBody>
        </CCard>
      )}

      {/* Error Message */}
      {googleError && (
        <CAlert color="danger" dismissible onClose={() => setGoogleError(null)}>
          {googleError}
        </CAlert>
      )}

      {/* Loading State */}
      {isLoadingGoogle && (
        <CCard className="border-0 shadow mb-4">
          <CCardBody className="text-center py-5">
            <CSpinner color="primary" className="mb-3" />
            <p className="text-muted">Loading your courses...</p>
          </CCardBody>
        </CCard>
      )}

      {/* Google Classroom Courses */}
      {isGoogleAuthenticated && !isLoadingGoogle && (
        <>
          <CCard className="border-0 shadow mb-4">
            <CCardBody className="p-0">
              <div className="bg-success text-white py-2 px-4">
                <h6 className="mb-0 fw-bold">📖 My Courses</h6>
              </div>
              <CCardBody className="p-4">
                {googleCourses.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-muted">No courses found. Make sure you're enrolled in Google Classroom courses.</p>
                  </div>
                ) : (
                  <CRow>
                    {googleCourses.map((course) => (
                      <CCol xs={12} md={6} lg={4} key={course.id} className="mb-4">
                        <CCard className="border-0 shadow-sm h-100">
                          <CCardBody>
                            <div className="bg-primary bg-opacity-10 rounded p-3 mb-3 text-center">
                              <span style={{ fontSize: '3rem' }}>📚</span>
                            </div>
                            <h5 className="fw-bold mb-2">{course.name}</h5>
                            <p className="text-muted small mb-3">{course.section || 'No section'}</p>
                            <CBadge color="success" className="mb-3">
                              {course.courseState}
                            </CBadge>
                            <div className="d-flex justify-content-between align-items-center">
                              <small className="text-muted">{course.descriptionHeading || 'Course'}</small>
                              <CButton
                                color="primary"
                                size="sm"
                                href={course.alternateLink}
                                target="_blank"
                              >
                                Open Course →
                              </CButton>
                            </div>
                          </CCardBody>
                        </CCard>
                      </CCol>
                    ))}
                  </CRow>
                )}
              </CCardBody>
            </CCardBody>
          </CCard>

          {/* Instructions */}
          <CCard className="border-0 shadow">
            <CCardBody className="p-0">
              <div className="bg-info text-white py-2 px-4">
                <h6 className="mb-0 fw-bold">ℹ️ How to Use</h6>
              </div>
              <CCardBody className="p-4">
                <CListGroup>
                  <CListGroupItem>
                    <strong>View Courses:</strong> Click "Open Course" to access materials and assignments
                  </CListGroupItem>
                  <CListGroupItem>
                    <strong>Submit Assignments:</strong> Open the course in Google Classroom to submit work
                  </CListGroupItem>
                  <CListGroupItem>
                    <strong>Study Materials:</strong> All PDFs and documents are available in each course
                  </CListGroupItem>
                </CListGroup>
              </CCardBody>
            </CCardBody>
          </CCard>
        </>
      )}
    </div>
  )
}

export default StudyPortal