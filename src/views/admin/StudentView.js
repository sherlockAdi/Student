import React, { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CButton,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
} from '@coreui/react'
import { students as DATA } from '../../data/students'

const Row = ({ label, value }) => (
  <div className="d-flex py-1 border-bottom">
    <div className="text-body-secondary" style={{ width: 200 }}>{label}</div>
    <div className="flex-grow-1">{value || '-'}</div>
  </div>
)

const StudentView = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const student = useMemo(() => DATA.find((s) => String(s.id) === String(id)), [id])

  if (!student) {
    return (
      <CRow>
        <CCol xs={12}>
          <CCard>
            <CCardHeader>Student Not Found</CCardHeader>
            <CCardBody>
              <CButton color="secondary" onClick={() => navigate('/admin/students')}>Back to List</CButton>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    )
  }

  const name = [student.firstname, student.middlename, student.lastname].filter(Boolean).join(' ')
  const addr = student.address || {}

  return (
    <CRow>
      <CCol md={9}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Admin</strong> <small>Student View</small>
          </CCardHeader>
          <CCardBody>
            <div className="mb-4">
              <Row label="Student ID" value={student.studentid} />
              <Row label="Admission No" value={student.admissionno} />
              <Row label="Name" value={name} />
              <Row label="Gender" value={student.gender} />
              <Row label="DOB" value={student.dateofbirth} />
              <Row label="Category" value={student.category} />
              <Row label="University" value={student.N_University} />
              <Row label="Course Type" value={student.N_CourseType} />
              <Row label="Semester" value={student.semesterid} />
              <Row label="Personal Email" value={student.personalemail} />
              <Row label="College Email" value={student.collegeemail} />
              <Row label="Mobile 1" value={student.mobileno1} />
              <Row label="Mobile 2" value={student.mobileno2} />
            </div>

            <div className="mb-4">
              <h6 className="mb-2">Address</h6>
              <Row label="Address Line 1" value={addr.addressline1} />
              <Row label="Address Line 2" value={addr.addressline2} />
              <Row label="Country" value={addr.country} />
              <Row label="State" value={addr.state} />
              <Row label="District" value={addr.district} />
              <Row label="City" value={addr.city} />
              <Row label="PIN" value={addr.pinno} />
            </div>

            <div>
              <h6 className="mb-2">Previous Educations</h6>
              <CTable small bordered>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell>Degree</CTableHeaderCell>
                    <CTableHeaderCell>Board</CTableHeaderCell>
                    <CTableHeaderCell>Year</CTableHeaderCell>
                    <CTableHeaderCell>%</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {(student.previousEducations || []).map((e, i) => (
                    <CTableRow key={i}>
                      <CTableDataCell>{e.degree}</CTableDataCell>
                      <CTableDataCell>{e.board}</CTableDataCell>
                      <CTableDataCell>{e.year}</CTableDataCell>
                      <CTableDataCell>{e.percentage}</CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </div>
          </CCardBody>
        </CCard>
      </CCol>
      <CCol md={3}>
        <CCard className="mb-4">
          <CCardHeader>Actions</CCardHeader>
          <CCardBody className="d-grid gap-2">
            <CButton color="secondary" variant="outline" onClick={() => navigate('/admin/students')}>Back to List</CButton>
            <CButton color="primary" onClick={() => navigate(`/admin/students/${student.id}/edit`)}>Edit</CButton>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default StudentView
