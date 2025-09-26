import React, { useMemo, useState } from 'react'
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
  CInputGroup,
  CInputGroupText,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
} from '@coreui/react'
import { students as DATA } from '../../data/students'

const Profile = () => {
  const base = useMemo(() => DATA[0], [])
  const [form, setForm] = useState({
    // read-only
    firstname: base.firstname,
    middlename: base.middlename,
    lastname: base.lastname,
    studentid: base.studentid,
    admissionno: base.admissionno,
    // editable
    personalemail: base.personalemail,
    mobileno1: base.mobileno1,
    mobileno2: base.mobileno2 || '',
    gender: base.gender,
    bloodgroup: base.bloodgroup || '',
    address: { ...base.address },
    previousEducations: [...(base.previousEducations || [])],
  })

  const onChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  const onAddrChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, address: { ...f.address, [name]: value } }))
  }

  const addEdu = () => {
    setForm((f) => ({
      ...f,
      previousEducations: [...f.previousEducations, { degree: '', board: '', year: '', percentage: '' }],
    }))
  }

  const updateEdu = (idx, key, value) => {
    setForm((f) => {
      const list = f.previousEducations.map((e, i) => (i === idx ? { ...e, [key]: value } : e))
      return { ...f, previousEducations: list }
    })
  }

  const removeEdu = (idx) => {
    setForm((f) => ({
      ...f,
      previousEducations: f.previousEducations.filter((_, i) => i !== idx),
    }))
  }

  const save = () => {
    console.log('Mock save', form)
    alert('Saved (static). Check console for payload.')
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Student</strong> <small>Profile</small>
          </CCardHeader>
          <CCardBody>
            <CForm className="row g-3">
              <CCol md={3}>
                <CFormInput label="First Name (read-only)" value={form.firstname} readOnly />
              </CCol>
              <CCol md={3}>
                <CFormInput label="Middle Name (read-only)" value={form.middlename} readOnly />
              </CCol>
              <CCol md={3}>
                <CFormInput label="Last Name (read-only)" value={form.lastname} readOnly />
              </CCol>
              <CCol md={3}>
                <CFormInput label="Student ID (read-only)" value={form.studentid} readOnly />
              </CCol>
              <CCol md={3}>
                <CFormInput label="Admission No (read-only)" value={form.admissionno} readOnly />
              </CCol>

              <CCol md={4}>
                <CFormInput name="personalemail" label="Personal Email" value={form.personalemail} onChange={onChange} />
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

              <CCol xs={12} className="mt-2">
                <CFormLabel>Address</CFormLabel>
                <CRow className="g-3">
                  <CCol md={4}>
                    <CFormInput name="addressline1" label="Address Line 1" value={form.address.addressline1} onChange={onAddrChange} />
                  </CCol>
                  <CCol md={4}>
                    <CFormInput name="addressline2" label="Address Line 2" value={form.address.addressline2} onChange={onAddrChange} />
                  </CCol>
                  <CCol md={2}>
                    <CFormInput name="country" label="Country" value={form.address.country} onChange={onAddrChange} />
                  </CCol>
                  <CCol md={2}>
                    <CFormInput name="state" label="State" value={form.address.state} onChange={onAddrChange} />
                  </CCol>
                  <CCol md={3}>
                    <CFormInput name="district" label="District" value={form.address.district} onChange={onAddrChange} />
                  </CCol>
                  <CCol md={3}>
                    <CFormInput name="city" label="City" value={form.address.city} onChange={onAddrChange} />
                  </CCol>
                  <CCol md={2}>
                    <CFormInput name="pinno" label="PIN" value={form.address.pinno} onChange={onAddrChange} />
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

              <CCol xs={12} className="mt-3 d-flex gap-2">
                <CButton color="primary" onClick={save}>Save</CButton>
              </CCol>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Profile
