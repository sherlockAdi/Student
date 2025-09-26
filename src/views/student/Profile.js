import React, { useEffect, useMemo, useState } from 'react'
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
  countries as M_COUNTRIES,
  states as M_STATES,
  districts as M_DISTRICTS,
  cities as M_CITIES,
} from '../../data/masters'

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

  // Resolve masters for noneditable program info
  const program = useMemo(() => {
    const college = colleges.find((c) => String(c.id) === String(base.N_CollegeId)) || null
    const organization = college ? organizations.find((o) => o.id === college.organizationId) : null
    const branch = branches.find((b) => String(b.id) === String(base.N_BranchId)) || null
    const sector = sectors.find((s) => String(s.id) === String(base.N_SectorId)) || null
    const courseType = courseTypes.find((t) => t.id === base.N_CourseType) || { id: base.N_CourseType, name: base.N_CourseType }
    const university = UNIS.find((u) => u.name === base.N_University) || { id: base.N_University, name: base.N_University }
    const course = courses.find((c) => String(c.id) === String(base.N_CourseId)) || null
    const batch = batches.find((b) => String(b.id) === String(base.N_BatchId)) || null
    // session not in base; pick first or compute
    const session = sessions[0]
    return { organization, college, branch, sector, courseType, university, course, batch, session }
  }, [base])

  // Address cascading: keep codes for selection while preserving names in form
  const [addrCodes, setAddrCodes] = useState({ country: '', state: '', district: '', city: '' })

  useEffect(() => {
    // Try to infer codes from names present in base.address
    const inferredCountry = M_COUNTRIES.find((c) => c.name === form.address.country)?.code || 'IN'
    const inferredState = M_STATES.find((s) => s.name === form.address.state)?.code || ''
    const inferredDistrict = M_DISTRICTS.find((d) => d.name === form.address.district)?.code || ''
    const inferredCity = M_CITIES.find((c) => c.name === form.address.city)?.code || ''
    setAddrCodes({ country: inferredCountry, state: inferredState, district: inferredDistrict, city: inferredCity })
  }, [])

  const filteredStates = useMemo(() => M_STATES.filter((s) => s.country === addrCodes.country), [addrCodes.country])
  const filteredDistricts = useMemo(() => M_DISTRICTS.filter((d) => d.state === addrCodes.state), [addrCodes.state])
  const filteredCities = useMemo(() => M_CITIES.filter((c) => c.district === addrCodes.district), [addrCodes.district])

  const onChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  const onAddrChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, address: { ...f.address, [name]: value } }))
  }

  const onAddrCodeChange = (level, code) => {
    // Update codes and corresponding names in form.address
    if (level === 'country') {
      const country = M_COUNTRIES.find((c) => c.code === code)
      setAddrCodes({ country: code, state: '', district: '', city: '' })
      setForm((f) => ({ ...f, address: { ...f.address, country: country?.name || '' , state: '', district: '', city: '' } }))
    } else if (level === 'state') {
      const state = M_STATES.find((s) => s.code === code)
      setAddrCodes((a) => ({ ...a, state: code, district: '', city: '' }))
      setForm((f) => ({ ...f, address: { ...f.address, state: state?.name || '' , district: '', city: '' } }))
    } else if (level === 'district') {
      const dist = M_DISTRICTS.find((d) => d.code === code)
      setAddrCodes((a) => ({ ...a, district: code, city: '' }))
      setForm((f) => ({ ...f, address: { ...f.address, district: dist?.name || '' , city: '' } }))
    } else if (level === 'city') {
      const city = M_CITIES.find((c) => c.code === code)
      setAddrCodes((a) => ({ ...a, city: code }))
      setForm((f) => ({ ...f, address: { ...f.address, city: city?.name || '' } }))
    }
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
              {/* Read-only overview */}
              <CCol xs={12} className="mb-2">
                <CFormLabel>Overview</CFormLabel>
                <CRow className="g-3">
                  <CCol md={3}><CFormInput label="Student ID" value={form.studentid} readOnly /></CCol>
                  <CCol md={3}><CFormInput label="Admission No" value={form.admissionno} readOnly /></CCol>
                  <CCol md={3}><CFormInput label="Name" value={[form.firstname, form.middlename, form.lastname].filter(Boolean).join(' ')} readOnly /></CCol>
                  <CCol md={3}><CFormInput label="Gender" value={form.gender} readOnly /></CCol>
                  <CCol md={3}><CFormInput label="University" value={program.university?.name || ''} readOnly /></CCol>
                  <CCol md={3}><CFormInput label="Course Type" value={program.courseType?.name || ''} readOnly /></CCol>
                  <CCol md={3}><CFormInput label="Semester" value={String(DATA[0].semesterid || '')} readOnly /></CCol>
                  <CCol md={3}><CFormInput label="Category" value={DATA[0].category || ''} readOnly /></CCol>
                </CRow>
              </CCol>

              {/* Program Details (non-editable) */}
              <CCol xs={12} className="mt-2">
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
              </CCol>
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
                    <CFormSelect label="Country" value={addrCodes.country} onChange={(e) => onAddrCodeChange('country', e.target.value)}>
                      {M_COUNTRIES.map((c) => (
                        <option key={c.code} value={c.code}>{c.name}</option>
                      ))}
                    </CFormSelect>
                  </CCol>
                  <CCol md={2}>
                    <CFormSelect label="State" value={addrCodes.state} onChange={(e) => onAddrCodeChange('state', e.target.value)}>
                      <option value="">Select</option>
                      {filteredStates.map((s) => (
                        <option key={s.code} value={s.code}>{s.name}</option>
                      ))}
                    </CFormSelect>
                  </CCol>
                  <CCol md={3}>
                    <CFormSelect label="District" value={addrCodes.district} onChange={(e) => onAddrCodeChange('district', e.target.value)}>
                      <option value="">Select</option>
                      {filteredDistricts.map((d) => (
                        <option key={d.code} value={d.code}>{d.name}</option>
                      ))}
                    </CFormSelect>
                  </CCol>
                  <CCol md={3}>
                    <CFormSelect label="City" value={addrCodes.city} onChange={(e) => onAddrCodeChange('city', e.target.value)}>
                      <option value="">Select</option>
                      {filteredCities.map((c) => (
                        <option key={c.code} value={c.code}>{c.name}</option>
                      ))}
                    </CFormSelect>
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
