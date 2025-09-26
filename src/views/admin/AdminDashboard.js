import React from 'react'
import { CRow, CCol, CCard, CCardBody, CCardHeader, CButton, CWidgetStatsB } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilUser, cilSchool, cilListRich } from '@coreui/icons'
import { useNavigate } from 'react-router-dom'

const AdminDashboard = () => {
  const navigate = useNavigate()
  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Admin</strong> <small>Dashboard</small>
          </CCardHeader>
          <CCardBody>
            <CRow className="g-3 mb-4">
              <CCol sm={6} lg={3}>
                <CWidgetStatsB
                  className="mb-3"
                  progress={{ color: 'primary', value: 75 }}
                  title="Total Students"
                  value={"2"}
                  text="Static data"
                  icon={<CIcon icon={cilUser} height={24} />}
                />
              </CCol>
              <CCol sm={6} lg={3}>
                <CWidgetStatsB
                  className="mb-3"
                  progress={{ color: 'success', value: 55 }}
                  title="Active Batches"
                  value={"2"}
                  text="Static data"
                  icon={<CIcon icon={cilSchool} height={24} />}
                />
              </CCol>
              <CCol sm={6} lg={3}>
                <CWidgetStatsB
                  className="mb-3"
                  progress={{ color: 'info', value: 40 }}
                  title="Programs"
                  value={"3"}
                  text="Static data"
                  icon={<CIcon icon={cilListRich} height={24} />}
                />
              </CCol>
            </CRow>

            <CRow className="g-3">
              <CCol md={4}>
                <CCard>
                  <CCardHeader>Quick Links</CCardHeader>
                  <CCardBody className="d-grid gap-2">
                    <CButton color="primary" variant="outline" onClick={() => navigate('/admin/students')}>Manage Students</CButton>
                    <CButton color="primary" variant="outline" onClick={() => navigate('/admin/students?filter=active')}>Active Students</CButton>
                    <CButton color="primary" variant="outline" onClick={() => navigate('/admin/students?filter=inactive')}>Inactive Students</CButton>
                  </CCardBody>
                </CCard>
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default AdminDashboard
