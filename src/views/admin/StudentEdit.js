import React, { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CForm,
  CFormInput,
  CFormSelect,
  CFormLabel,
  CButton,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilArrowLeft, cilSearch, cilSave } from '@coreui/icons'
import { students as DATA } from '../../data/students'

const StudentEdit = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const base = useMemo(() => DATA.find((s) => String(s.id) === String(id)), [id])

  const [form, setForm] = useState(() => {
    const s = base || {}
    return {
      // identifiers (read-only)
      studentid: s.studentid || '',
      admissionno: s.admissionno || '',
      // name (editable)
      firstname: s.firstname || '',
      middlename: s.middlename || '',
      lastname: s.lastname || '',
      // contact (editable)
      personalemail: s.personalemail || '',
      collegeemail: s.collegeemail || '',
      mobileno1: s.mobileno1 || '',
      mobileno2: s.mobileno2 || '',
      // misc
      gender: s.gender || '',
      bloodgroup: s.bloodgroup || '',
      category: s.category || '',
      semesterid: s.semesterid || '',
      N_University: s.N_University || '',
      N_CourseType: s.N_CourseType || '',
      // address
      address: { ...(s.address || {}) },
      // previous education
      previousEducations: [...(s.previousEducations || [])],
    }
  })

  if (!base) {
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

  const onChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }
  const onAddrChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, address: { ...f.address, [name]: value } }))
  }

  const addEdu = () => setForm((f) => ({ ...f, previousEducations: [...f.previousEducations, { degree: '', board: '', year: '', percentage: '' }] }))
  const updateEdu = (idx, key, value) => setForm((f) => ({ ...f, previousEducations: f.previousEducations.map((e, i) => (i === idx ? { ...e, [key]: value } : e)) }))
  const removeEdu = (idx) => setForm((f) => ({ ...f, previousEducations: f.previousEducations.filter((_, i) => i !== idx) }))

  const save = () => {
    console.log('Admin mock save', { id, ...form })
    alert('Admin changes saved (static). Check console for payload.')
    navigate(`/admin/students/${id}/view`)
  }

  return (
    <CRow>
      <CCol md={9}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Admin</strong> <small>Student Edit</small>
          </CCardHeader>
          <CCardBody>
            <CForm className="row g-3">
              <CCol md={3}>
                <CFormInput label="Student ID (read-only)" value={form.studentid} readOnly />
              </CCol>
              <CCol md={3}>
                <CFormInput label="Admission No (read-only)" value={form.admissionno} readOnly />
              </CCol>

              <CCol md={3}>
                <CFormInput name="firstname" label="First Name" value={form.firstname} onChange={onChange} />
              </CCol>
              <CCol md={3}>
                <CFormInput name="middlename" label="Middle Name" value={form.middlename} onChange={onChange} />
              </CCol>
              <CCol md={3}>
                <CFormInput name="lastname" label="Last Name" value={form.lastname} onChange={onChange} />
              </CCol>

              <CCol md={4}>
                <CFormInput name="personalemail" label="Personal Email" value={form.personalemail} onChange={onChange} />
              </CCol>
              <CCol md={4}>
                <CFormInput name="collegeemail" label="College Email" value={form.collegeemail} onChange={onChange} />
              </CCol>
              <CCol md={2}>
                <CFormSelect name="gender" label="Gender" value={form.gender} onChange={onChange}>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </CFormSelect>
              </CCol>
              <CCol md={2}>
                <CFormInput name="bloodgroup" label="Blood Group" value={form.bloodgroup} onChange={onChange} />
              </CCol>

              <CCol md={3}>
                <CFormInput name="mobileno1" label="Mobile No 1" value={form.mobileno1} onChange={onChange} />
              </CCol>
              <CCol md={3}>
                <CFormInput name="mobileno2" label="Mobile No 2" value={form.mobileno2} onChange={onChange} />
              </CCol>

              <CCol md={3}>
                <CFormInput name="N_University" label="University" value={form.N_University} onChange={onChange} />
              </CCol>
              <CCol md={3}>
                <CFormInput name="N_CourseType" label="Course Type" value={form.N_CourseType} onChange={onChange} />
              </CCol>
              <CCol md={2}>
                <CFormInput name="semesterid" label="Semester" value={form.semesterid} onChange={onChange} />
              </CCol>
              <CCol md={2}>
                <CFormInput name="category" label="Category" value={form.category} onChange={onChange} />
              </CCol>

              <CCol xs={12} className="mt-2">
                <CFormLabel>Address</CFormLabel>
                <CRow className="g-3">
                  <CCol md={4}>
                    <CFormInput name="addressline1" label="Address Line 1" value={form.address.addressline1 || ''} onChange={onAddrChange} />
                  </CCol>
                  <CCol md={4}>
                    <CFormInput name="addressline2" label="Address Line 2" value={form.address.addressline2 || ''} onChange={onAddrChange} />
                  </CCol>
                  <CCol md={2}>
                    <CFormInput name="country" label="Country" value={form.address.country || ''} onChange={onAddrChange} />
                  </CCol>
                  <CCol md={2}>
                    <CFormInput name="state" label="State" value={form.address.state || ''} onChange={onAddrChange} />
                  </CCol>
                  <CCol md={3}>
                    <CFormInput name="district" label="District" value={form.address.district || ''} onChange={onAddrChange} />
                  </CCol>
                  <CCol md={3}>
                    <CFormInput name="city" label="City" value={form.address.city || ''} onChange={onAddrChange} />
                  </CCol>
                  <CCol md={2}>
                    <CFormInput name="pinno" label="PIN" value={form.address.pinno || ''} onChange={onAddrChange} />
                  </CCol>
                </CRow>
              </CCol>

              <CCol xs={12} className="mt-3">
                <CFormLabel>Previous Educations</CFormLabel>
                <CButton size="sm" color="secondary" variant="outline" className="ms-2" onClick={addEdu}>Add</CButton>
                <CTable small bordered className="mt-2">
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>Degree</CTableHeaderCell>
                      <CTableHeaderCell>Board</CTableHeaderCell>
                      <CTableHeaderCell>Year</CTableHeaderCell>
                      <CTableHeaderCell>%</CTableHeaderCell>
                      <CTableHeaderCell></CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {form.previousEducations.map((e, idx) => (
                      <CTableRow key={idx}>
                        <CTableDataCell>
                          <CFormInput value={e.degree} onChange={(ev) => updateEdu(idx, 'degree', ev.target.value)} />
                        </CTableDataCell>
                        <CTableDataCell>
                          <CFormInput value={e.board} onChange={(ev) => updateEdu(idx, 'board', ev.target.value)} />
                        </CTableDataCell>
                        <CTableDataCell>
                          <CFormInput value={e.year} onChange={(ev) => updateEdu(idx, 'year', ev.target.value)} />
                        </CTableDataCell>
                        <CTableDataCell>
                          <CFormInput value={e.percentage} onChange={(ev) => updateEdu(idx, 'percentage', ev.target.value)} />
                        </CTableDataCell>
                        <CTableDataCell className="text-end">
                          <CButton size="sm" color="danger" variant="outline" onClick={() => removeEdu(idx)}>Remove</CButton>
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
              </CCol>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
      <CCol md={3}>
        <CCard className="mb-4">
          <CCardHeader>Actions</CCardHeader>
          <CCardBody className="d-grid gap-2">
            <CButton
              color="secondary"
              variant="outline"
              onClick={() => navigate('/admin/students')}
              aria-label="Back to List"
              title="Back to List"
            >
              <CIcon icon={cilArrowLeft} />
            </CButton>
            <CButton
              color="secondary"
              variant="outline"
              onClick={() => navigate(`/admin/students/${id}/view`)}
              aria-label="View Profile"
              title="View Profile"
            >
              <CIcon icon={cilSearch} />
            </CButton>
            <CButton color="primary" onClick={save} aria-label="Save" title="Save">
              <CIcon icon={cilSave} />
            </CButton>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default StudentEdit
