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
  const [activeTab, setActiveTab] = useState('courses')
  const [isGoogleAuthenticated, setIsGoogleAuthenticated] = useState(false)
  const [googleCourses, setGoogleCourses] = useState([])
  const [allCourseWork, setAllCourseWork] = useState([])
  const [allMaterials, setAllMaterials] = useState([])
  const [allAnnouncements, setAllAnnouncements] = useState([])
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false)
  const [isLoadingContent, setIsLoadingContent] = useState(false)
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

  // Fetch all course work (assignments) from all courses
  const fetchAllCourseWork = async () => {
    if (!accessToken || googleCourses.length === 0) return

    setIsLoadingContent(true)
    try {
      const allWork = []
      
      for (const course of googleCourses) {
        const response = await fetch(
          `https://classroom.googleapis.com/v1/courses/${course.id}/courseWork`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )

        if (response.ok) {
          const data = await response.json()
          if (data.courseWork) {
            const workWithCourse = data.courseWork.map(work => ({
              ...work,
              courseName: course.name,
              courseId: course.id,
            }))
            allWork.push(...workWithCourse)
          }
        }
      }

      setAllCourseWork(allWork)
    } catch (error) {
      console.error('Error fetching course work:', error)
    } finally {
      setIsLoadingContent(false)
    }
  }

  // Fetch all materials from all courses
  const fetchAllMaterials = async () => {
    if (!accessToken || googleCourses.length === 0) return

    setIsLoadingContent(true)
    try {
      const allMats = []
      
      for (const course of googleCourses) {
        const response = await fetch(
          `https://classroom.googleapis.com/v1/courses/${course.id}/courseWorkMaterials`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )

        if (response.ok) {
          const data = await response.json()
          if (data.courseWorkMaterial) {
            const matsWithCourse = data.courseWorkMaterial.map(mat => ({
              ...mat,
              courseName: course.name,
              courseId: course.id,
            }))
            allMats.push(...matsWithCourse)
          }
        }
      }

      setAllMaterials(allMats)
    } catch (error) {
      console.error('Error fetching materials:', error)
    } finally {
      setIsLoadingContent(false)
    }
  }

  // Fetch all announcements from all courses
  const fetchAllAnnouncements = async () => {
    if (!accessToken || googleCourses.length === 0) return

    setIsLoadingContent(true)
    try {
      const allAnns = []
      
      for (const course of googleCourses) {
        const response = await fetch(
          `https://classroom.googleapis.com/v1/courses/${course.id}/announcements`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )

        if (response.ok) {
          const data = await response.json()
          if (data.announcements) {
            const annsWithCourse = data.announcements.map(ann => ({
              ...ann,
              courseName: course.name,
              courseId: course.id,
            }))
            allAnns.push(...annsWithCourse)
          }
        }
      }

      setAllAnnouncements(allAnns)
    } catch (error) {
      console.error('Error fetching announcements:', error)
    } finally {
      setIsLoadingContent(false)
    }
  }

  // Load courses when authenticated
  useEffect(() => {
    if (isGoogleAuthenticated && accessToken) {
      fetchGoogleCourses()
    }
  }, [isGoogleAuthenticated, accessToken])

  // Fetch all content when courses are loaded
  useEffect(() => {
    if (googleCourses.length > 0 && accessToken) {
      fetchAllCourseWork()
      fetchAllMaterials()
      fetchAllAnnouncements()
    }
  }, [googleCourses, accessToken])

  // Logout from Google
  const handleGoogleLogout = () => {
    setAccessToken(null)
    setIsGoogleAuthenticated(false)
    setGoogleCourses([])
    setAllCourseWork([])
    setAllMaterials([])
    setAllAnnouncements([])
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

      {/* Tabs Navigation */}
      {isGoogleAuthenticated && (
        <CCard className="border-0 shadow mb-3">
          <CCardBody className="p-0">
            <CNav variant="tabs" role="tablist" className="border-bottom">
              <CNavItem>
                <CNavLink
                  active={activeTab === 'courses'}
                  onClick={() => setActiveTab('courses')}
                  style={{ cursor: 'pointer' }}
                  className="fw-semibold"
                >
                  <span className="me-2">📚</span> My Courses
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink
                  active={activeTab === 'assignments'}
                  onClick={() => setActiveTab('assignments')}
                  style={{ cursor: 'pointer' }}
                  className="fw-semibold"
                >
                  <span className="me-2">📝</span> Assignments ({allCourseWork.length})
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink
                  active={activeTab === 'materials'}
                  onClick={() => setActiveTab('materials')}
                  style={{ cursor: 'pointer' }}
                  className="fw-semibold"
                >
                  <span className="me-2">📄</span> Materials ({allMaterials.length})
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink
                  active={activeTab === 'announcements'}
                  onClick={() => setActiveTab('announcements')}
                  style={{ cursor: 'pointer' }}
                  className="fw-semibold"
                >
                  <span className="me-2">📢</span> Announcements ({allAnnouncements.length})
                </CNavLink>
              </CNavItem>
            </CNav>
          </CCardBody>
        </CCard>
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

      {/* Tab Content */}
      <CTabContent>
        {/* Courses Tab */}
        <CTabPane visible={activeTab === 'courses'}>
          {isGoogleAuthenticated && !isLoadingGoogle && (
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
          )}
        </CTabPane>

        {/* Assignments Tab */}
        <CTabPane visible={activeTab === 'assignments'}>
          {isLoadingContent ? (
            <div className="text-center py-5">
              <CSpinner color="primary" />
              <p className="text-muted mt-2">Loading assignments...</p>
            </div>
          ) : (
            <CCard className="border-0 shadow">
              <CCardBody className="p-0">
                <div className="bg-warning text-white py-2 px-4">
                  <h6 className="mb-0 fw-bold">📝 All Assignments</h6>
                </div>
                <CCardBody className="p-4">
                  {allCourseWork.length === 0 ? (
                    <div className="text-center py-5">
                      <span style={{ fontSize: '3rem' }}>📝</span>
                      <p className="text-muted mt-3">No assignments found</p>
                    </div>
                  ) : (
                    <CListGroup>
                      {allCourseWork.map((work) => (
                        <CListGroupItem key={work.id} className="mb-3 border-start border-4 border-warning">
                          <div className="d-flex justify-content-between align-items-start">
                            <div className="flex-grow-1">
                              <h6 className="fw-bold mb-2">{work.title}</h6>
                              <CBadge color="primary" className="mb-2 me-2">{work.courseName}</CBadge>
                              {work.workType && <CBadge color="info">{work.workType}</CBadge>}
                              <p className="text-muted small mb-2 mt-2">{work.description || 'No description provided'}</p>
                              {work.dueDate && (
                                <small className="text-danger">
                                  <strong>📅 Due:</strong> {new Date(work.dueDate.year, work.dueDate.month - 1, work.dueDate.day).toLocaleDateString('en-IN')}
                                </small>
                              )}
                              {work.maxPoints && (
                                <small className="text-muted ms-3">
                                  <strong>Points:</strong> {work.maxPoints}
                                </small>
                              )}
                            </div>
                            <CButton color="warning" size="sm" href={work.alternateLink} target="_blank">
                              Open Assignment →
                            </CButton>
                          </div>
                        </CListGroupItem>
                      ))}
                    </CListGroup>
                  )}
                </CCardBody>
              </CCardBody>
            </CCard>
          )}
        </CTabPane>

        {/* Materials Tab */}
        <CTabPane visible={activeTab === 'materials'}>
          {isLoadingContent ? (
            <div className="text-center py-5">
              <CSpinner color="primary" />
              <p className="text-muted mt-2">Loading materials...</p>
            </div>
          ) : (
            <CCard className="border-0 shadow">
              <CCardBody className="p-0">
                <div className="bg-info text-white py-2 px-4">
                  <h6 className="mb-0 fw-bold">📄 Study Materials</h6>
                </div>
                <CCardBody className="p-4">
                  {allMaterials.length === 0 ? (
                    <div className="text-center py-5">
                      <span style={{ fontSize: '3rem' }}>📄</span>
                      <p className="text-muted mt-3">No study materials found</p>
                    </div>
                  ) : (
                    <CRow>
                      {allMaterials.map((material) => (
                        <CCol xs={12} md={6} lg={4} key={material.id} className="mb-3">
                          <CCard className="border-0 shadow-sm h-100">
                            <CCardBody>
                              <div className="bg-info bg-opacity-10 rounded p-2 mb-3 text-center">
                                <span style={{ fontSize: '2rem' }}>📚</span>
                              </div>
                              <CBadge color="info" className="mb-2">{material.courseName}</CBadge>
                              <h6 className="fw-bold mb-2">{material.title}</h6>
                              <p className="text-muted small mb-3">{material.description || 'Study material for your course'}</p>
                              <CButton color="info" size="sm" href={material.alternateLink} target="_blank" className="w-100">
                                View Material →
                              </CButton>
                            </CCardBody>
                          </CCard>
                        </CCol>
                      ))}
                    </CRow>
                  )}
                </CCardBody>
              </CCardBody>
            </CCard>
          )}
        </CTabPane>

        {/* Announcements Tab */}
        <CTabPane visible={activeTab === 'announcements'}>
          {isLoadingContent ? (
            <div className="text-center py-5">
              <CSpinner color="primary" />
              <p className="text-muted mt-2">Loading announcements...</p>
            </div>
          ) : (
            <CCard className="border-0 shadow">
              <CCardBody className="p-0">
                <div className="bg-danger text-white py-2 px-4">
                  <h6 className="mb-0 fw-bold">📢 Announcements</h6>
                </div>
                <CCardBody className="p-4">
                  {allAnnouncements.length === 0 ? (
                    <div className="text-center py-5">
                      <span style={{ fontSize: '3rem' }}>📢</span>
                      <p className="text-muted mt-3">No announcements found</p>
                    </div>
                  ) : (
                    <CListGroup>
                      {allAnnouncements.map((ann) => (
                        <CListGroupItem key={ann.id} className="mb-3 border-start border-4 border-danger">
                          <CBadge color="danger" className="mb-2">{ann.courseName}</CBadge>
                          <h6 className="fw-bold mb-2">{ann.text || 'Announcement'}</h6>
                          {ann.materials && ann.materials.length > 0 && (
                            <p className="text-muted small mb-2">
                              📎 {ann.materials.length} attachment(s)
                            </p>
                          )}
                          <small className="text-muted">
                            <strong>Posted:</strong> {new Date(ann.creationTime).toLocaleString('en-IN')}
                          </small>
                          {ann.alternateLink && (
                            <div className="mt-2">
                              <CButton color="danger" size="sm" href={ann.alternateLink} target="_blank">
                                View Full Announcement →
                              </CButton>
                            </div>
                          )}
                        </CListGroupItem>
                      ))}
                    </CListGroup>
                  )}
                </CCardBody>
              </CCardBody>
            </CCard>
          )}
        </CTabPane>
      </CTabContent>
    </div>
  )
}

export default StudyPortal