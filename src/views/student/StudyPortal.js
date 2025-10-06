import React, { useState } from 'react'
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
} from '@coreui/react'

const StudyPortal = () => {
  const [activeTab, setActiveTab] = useState('materials')

  // Sample study materials - can be integrated with an API later
  const studyMaterials = [
    {
      id: 1,
      title: 'Industrial Training Institute - Course Materials',
      description: 'Comprehensive study materials for ITI courses including theory and practical guides',
      category: 'ITI Materials',
      link: 'https://bharatskills.gov.in/',
      type: 'PDF Resources',
      icon: '📚',
    },
    {
      id: 2,
      title: 'NCVT Question Papers',
      description: 'Previous year question papers and sample papers for NCVT examinations',
      category: 'Question Papers',
      link: '#',
      type: 'Practice Papers',
      icon: '📝',
    },
    {
      id: 3,
      title: 'Skill Development Videos',
      description: 'Video tutorials for practical skills and workshop training',
      category: 'Video Tutorials',
      link: '#',
      type: 'Video Content',
      icon: '🎥',
    },
    {
      id: 4,
      title: 'Trade Theory Notes',
      description: 'Detailed notes covering trade theory subjects for all semesters',
      category: 'Theory Notes',
      link: '#',
      type: 'PDF Notes',
      icon: '📖',
    },
  ]

  const assignments = [
    {
      id: 1,
      title: 'Workshop Practice Assignment',
      subject: 'Practical Training',
      dueDate: '2025-10-15',
      status: 'pending',
      marks: 50,
    },
    {
      id: 2,
      title: 'Trade Theory Assessment',
      subject: 'Theory',
      dueDate: '2025-10-20',
      status: 'pending',
      marks: 100,
    },
    {
      id: 3,
      title: 'Safety Procedures Quiz',
      subject: 'Workshop Safety',
      dueDate: '2025-10-10',
      status: 'completed',
      marks: 25,
    },
  ]

  const announcements = [
    {
      id: 1,
      title: 'Semester Examination Schedule Released',
      date: '2025-10-05',
      content: 'The final semester examinations will begin from November 15, 2025.',
      priority: 'high',
    },
    {
      id: 2,
      title: 'New Study Material Available',
      date: '2025-10-03',
      content: 'Updated study materials for Trade Theory are now available in the portal.',
      priority: 'medium',
    },
    {
      id: 3,
      title: 'Workshop Timing Change',
      date: '2025-10-01',
      content: 'Please note that workshop timings have been updated. Check your timetable.',
      priority: 'low',
    },
  ]

  const getStatusBadge = (status) => {
    return status === 'completed' ? (
      <CBadge color="success">Completed</CBadge>
    ) : (
      <CBadge color="warning">Pending</CBadge>
    )
  }

  const getPriorityBadge = (priority) => {
    const colors = { high: 'danger', medium: 'warning', low: 'info' }
    return <CBadge color={colors[priority]}>{priority.toUpperCase()}</CBadge>
  }

  return (
    <div>
      {/* Header */}
      <CCard className="border-0 shadow mb-4">
        <CCardBody className="p-0">
          <div className="bg-primary text-white py-3 px-4">
            <h4 className="mb-0 fw-bold">📚 Study Portal</h4>
            <p className="mb-0 mt-1 opacity-75">Access your study materials, assignments, and announcements</p>
          </div>
        </CCardBody>
      </CCard>

      {/* Tabs Navigation */}
      <CCard className="border-0 shadow mb-3">
        <CCardBody className="p-0">
          <CNav variant="tabs" role="tablist" className="border-bottom">
            <CNavItem>
              <CNavLink
                active={activeTab === 'materials'}
                onClick={() => setActiveTab('materials')}
                style={{ cursor: 'pointer' }}
                className="fw-semibold"
              >
                <span className="me-2">📚</span> Study Materials
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink
                active={activeTab === 'assignments'}
                onClick={() => setActiveTab('assignments')}
                style={{ cursor: 'pointer' }}
                className="fw-semibold"
              >
                <span className="me-2">📝</span> Assignments
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink
                active={activeTab === 'announcements'}
                onClick={() => setActiveTab('announcements')}
                style={{ cursor: 'pointer' }}
                className="fw-semibold"
              >
                <span className="me-2">📢</span> Announcements
              </CNavLink>
            </CNavItem>
          </CNav>
        </CCardBody>
      </CCard>

      {/* Tab Content */}
      <CTabContent>
        {/* Study Materials Tab */}
        <CTabPane visible={activeTab === 'materials'}>
          <CRow>
            {studyMaterials.map((material) => (
              <CCol xs={12} md={6} lg={6} key={material.id} className="mb-4">
                <CCard className="border-0 shadow-sm h-100">
                  <CCardBody>
                    <div className="d-flex align-items-start mb-3">
                      <div className="bg-primary bg-opacity-10 rounded p-3 me-3">
                        <span style={{ fontSize: '2rem' }}>{material.icon}</span>
                      </div>
                      <div className="flex-grow-1">
                        <h5 className="mb-2 fw-bold">{material.title}</h5>
                        <CBadge color="info" className="mb-2">
                          {material.category}
                        </CBadge>
                      </div>
                    </div>
                    <p className="text-muted mb-3">{material.description}</p>
                    <div className="d-flex justify-content-between align-items-center">
                      <small className="text-muted">
                        <strong>Type:</strong> {material.type}
                      </small>
                      <CButton
                        color="primary"
                        size="sm"
                        href={material.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Access Material →
                      </CButton>
                    </div>
                  </CCardBody>
                </CCard>
              </CCol>
            ))}
          </CRow>

          {/* External Resources */}
          <CCard className="border-0 shadow mt-4">
            <CCardBody className="p-0">
              <div className="bg-success text-white py-2 px-4">
                <h6 className="mb-0 fw-bold">🌐 External Learning Resources</h6>
              </div>
              <CCardBody className="p-4">
                <CRow>
                  <CCol md={6} className="mb-3">
                    <div className="border-start border-3 border-success ps-3 py-2 bg-light">
                      <h6 className="fw-bold mb-2">Bharat Skills Portal</h6>
                      <p className="mb-2 small text-muted">
                        Official government portal for ITI study materials and resources
                      </p>
                      <CButton
                        color="success"
                        size="sm"
                        href="https://bharatskills.gov.in/"
                        target="_blank"
                      >
                        Visit Portal
                      </CButton>
                    </div>
                  </CCol>
                  <CCol md={6} className="mb-3">
                    <div className="border-start border-3 border-info ps-3 py-2 bg-light">
                      <h6 className="fw-bold mb-2">NCVT Official Website</h6>
                      <p className="mb-2 small text-muted">
                        National Council for Vocational Training resources and guidelines
                      </p>
                      <CButton
                        color="info"
                        size="sm"
                        href="https://ncvtmis.gov.in/"
                        target="_blank"
                      >
                        Visit Website
                      </CButton>
                    </div>
                  </CCol>
                </CRow>
              </CCardBody>
            </CCardBody>
          </CCard>
        </CTabPane>

        {/* Assignments Tab */}
        <CTabPane visible={activeTab === 'assignments'}>
          <CCard className="border-0 shadow">
            <CCardBody className="p-0">
              <div className="bg-warning text-white py-2 px-4">
                <h6 className="mb-0 fw-bold">📝 Your Assignments</h6>
              </div>
              <CCardBody className="p-4">
                <CListGroup>
                  {assignments.map((assignment) => (
                    <CListGroupItem key={assignment.id} className="mb-3 border-start border-4 border-primary">
                      <div className="d-flex justify-content-between align-items-start">
                        <div className="flex-grow-1">
                          <h6 className="fw-bold mb-2">{assignment.title}</h6>
                          <div className="mb-2">
                            <small className="text-muted me-3">
                              <strong>Subject:</strong> {assignment.subject}
                            </small>
                            <small className="text-muted me-3">
                              <strong>Due Date:</strong> {new Date(assignment.dueDate).toLocaleDateString('en-IN')}
                            </small>
                            <small className="text-muted">
                              <strong>Marks:</strong> {assignment.marks}
                            </small>
                          </div>
                          {getStatusBadge(assignment.status)}
                        </div>
                        {assignment.status === 'pending' && (
                          <CButton color="primary" size="sm">
                            Submit
                          </CButton>
                        )}
                      </div>
                    </CListGroupItem>
                  ))}
                </CListGroup>
              </CCardBody>
            </CCardBody>
          </CCard>
        </CTabPane>

        {/* Announcements Tab */}
        <CTabPane visible={activeTab === 'announcements'}>
          <CCard className="border-0 shadow">
            <CCardBody className="p-0">
              <div className="bg-info text-white py-2 px-4">
                <h6 className="mb-0 fw-bold">📢 Important Announcements</h6>
              </div>
              <CCardBody className="p-4">
                <CListGroup>
                  {announcements.map((announcement) => (
                    <CListGroupItem key={announcement.id} className="mb-3">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h6 className="fw-bold mb-0">{announcement.title}</h6>
                        {getPriorityBadge(announcement.priority)}
                      </div>
                      <p className="mb-2 text-muted">{announcement.content}</p>
                      <small className="text-muted">
                        <strong>Posted on:</strong> {new Date(announcement.date).toLocaleDateString('en-IN')}
                      </small>
                    </CListGroupItem>
                  ))}
                </CListGroup>
              </CCardBody>
            </CCardBody>
          </CCard>
        </CTabPane>
      </CTabContent>
    </div>
  )
}

export default StudyPortal
