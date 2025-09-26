import React, { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CButton,
  CFormLabel,
  CFormSelect,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
} from '@coreui/react'
import { students as DATA } from '../../data/students'
import {
  organizations,
  colleges,
  branches,
  sectors,
  courseTypes,
  universities as UNIS,
  courses,
  batches,
  sessions,
} from '../../data/masters'

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

  const program = useMemo(() => {
    const college = colleges.find((c) => String(c.id) === String(student.N_CollegeId)) || null
    const organization = college ? organizations.find((o) => o.id === college.organizationId) : null
    const branch = branches.find((b) => String(b.id) === String(student.N_BranchId)) || null
    const sector = sectors.find((s) => String(s.id) === String(student.N_SectorId)) || null
    const courseType = courseTypes.find((t) => t.id === student.N_CourseType) || { id: student.N_CourseType, name: student.N_CourseType }
    const university = UNIS.find((u) => u.name === student.N_University) || { id: student.N_University, name: student.N_University }
    const course = courses.find((c) => String(c.id) === String(student.N_CourseId)) || null
    const batch = batches.find((b) => String(b.id) === String(student.N_BatchId)) || null
    const session = sessions[0]
    return { organization, college, branch, sector, courseType, university, course, batch, session }
  }, [student])

  return (
    <CRow>
      <CCol md={9}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Admin</strong> <small>Student View</small>
          </CCardHeader>
          <CCardBody>
            <div className="mb-4">
              <CFormLabel>Program Details</CFormLabel>
              <CRow className="g-3">
                <CCol md={3}>
                  <CFormSelect label="Organization" value={program.organization?.id || ''} disabled className="bg-body-tertiary">
                    {organizations.map((o) => (
                      <option key={o.id} value={o.id}>{o.name}</option>
                    ))}
                  </CFormSelect>
                </CCol>
                <CCol md={3}>
                  <CFormSelect label="College" value={program.college?.id || ''} disabled className="bg-body-tertiary">
                    {colleges.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </CFormSelect>
                </CCol>
                <CCol md={3}>
                  <CFormSelect label="Branch" value={program.branch?.id || ''} disabled className="bg-body-tertiary">
                    {branches.map((b) => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </CFormSelect>
                </CCol>
                <CCol md={3}>
                  <CFormSelect label="Sector" value={program.sector?.id || ''} disabled className="bg-body-tertiary">
                    {sectors.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </CFormSelect>
                </CCol>
                <CCol md={3}>
                  <CFormSelect label="Course Type" value={program.courseType?.id || ''} disabled className="bg-body-tertiary">
                    {courseTypes.map((t) => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </CFormSelect>
                </CCol>
                <CCol md={3}>
                  <CFormSelect label="University" value={program.university?.id || ''} disabled className="bg-body-tertiary">
                    {UNIS.map((u) => (
                      <option key={u.id} value={u.id}>{u.name}</option>
                    ))}
                  </CFormSelect>
                </CCol>
                <CCol md={3}>
                  <CFormSelect label="Course" value={program.course?.id || ''} disabled className="bg-body-tertiary">
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </CFormSelect>
                </CCol>
                <CCol md={3}>
                  <CFormSelect label="Batch" value={program.batch?.id || ''} disabled className="bg-body-tertiary">
                    {batches.map((b) => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </CFormSelect>
                </CCol>
                <CCol md={3}>
                  <CFormSelect label="Session" value={program.session?.id || ''} disabled className="bg-body-tertiary">
                    {sessions.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </CFormSelect>
                </CCol>
              </CRow>
            </div>

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
