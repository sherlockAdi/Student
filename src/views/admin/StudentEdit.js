import React, { useEffect, useMemo, useState } from 'react'
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
      // program masters
      N_CollegeId: s.N_CollegeId || '',
      N_BranchId: s.N_BranchId || '',
      N_SectorId: s.N_SectorId || '',
      N_CourseId: s.N_CourseId || '',
      N_BatchId: s.N_BatchId || '',
      N_University: s.N_University || '', // store name for now
      N_CourseType: s.N_CourseType || '',
      session: sessions[0]?.id || '',
      // address
      address: { ...(s.address || {}) },
      // previous education
      previousEducations: [...(s.previousEducations || [])],
    }
  })

  // Organization selection to filter colleges
  const initialOrgId = (() => {
    const col = colleges.find((c) => String(c.id) === String(form.N_CollegeId))
    return col?.organizationId || organizations[0]?.id || ''
  })()
  const [orgId, setOrgId] = useState(initialOrgId)
  const filteredColleges = useMemo(
    () => colleges.filter((c) => String(c.organizationId) === String(orgId)),
    [orgId],
  )

  // Address cascading codes based on form.address names
  const [addrCodes, setAddrCodes] = useState({ country: '', state: '', district: '', city: '' })

  useEffect(() => {
    const inferredCountry = M_COUNTRIES.find((c) => c.name === form.address.country)?.code || 'IN'
    const inferredState = M_STATES.find((s) => s.name === form.address.state)?.code || ''
    const inferredDistrict = M_DISTRICTS.find((d) => d.name === form.address.district)?.code || ''
    const inferredCity = M_CITIES.find((c) => c.name === form.address.city)?.code || ''
    setAddrCodes({ country: inferredCountry, state: inferredState, district: inferredDistrict, city: inferredCity })
  }, [])

  const filteredStates = useMemo(() => M_STATES.filter((s) => s.country === addrCodes.country), [addrCodes.country])
  const filteredDistricts = useMemo(() => M_DISTRICTS.filter((d) => d.state === addrCodes.state), [addrCodes.state])
  const filteredCities = useMemo(() => M_CITIES.filter((c) => c.district === addrCodes.district), [addrCodes.district])

  const onAddrCodeChange = (level, code) => {
    if (level === 'country') {
      const country = M_COUNTRIES.find((c) => c.code === code)
      setAddrCodes({ country: code, state: '', district: '', city: '' })
      setForm((f) => ({ ...f, address: { ...f.address, country: country?.name || '', state: '', district: '', city: '' } }))
    } else if (level === 'state') {
      const state = M_STATES.find((s) => s.code === code)
      setAddrCodes((a) => ({ ...a, state: code, district: '', city: '' }))
      setForm((f) => ({ ...f, address: { ...f.address, state: state?.name || '', district: '', city: '' } }))
    } else if (level === 'district') {
      const dist = M_DISTRICTS.find((d) => d.code === code)
      setAddrCodes((a) => ({ ...a, district: code, city: '' }))
      setForm((f) => ({ ...f, address: { ...f.address, district: dist?.name || '', city: '' } }))
    } else if (level === 'city') {
      const city = M_CITIES.find((c) => c.code === code)
      setAddrCodes((a) => ({ ...a, city: code }))
      setForm((f) => ({ ...f, address: { ...f.address, city: city?.name || '' } }))
    }
  }

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
              {/* Program Details (editable) */}
              <CCol xs={12} className="mt-2">
                <CFormLabel>Program Details</CFormLabel>
                <CRow className="g-3">
                  <CCol md={3}>
                    <CFormSelect
                      label="Organization"
                      value={orgId}
                      onChange={(e) => {
                        const val = e.target.value
                        setOrgId(val)
                        // reset college when org changes
                        setForm((f) => ({ ...f, N_CollegeId: '' }))
                      }}
                    >
                      {organizations.map((o) => (
                        <option key={o.id} value={o.id}>{o.name}</option>
                      ))}
                    </CFormSelect>
                  </CCol>
                  <CCol md={3}>
                    <CFormSelect
                      label="College"
                      value={form.N_CollegeId}
                      onChange={(e) => setForm((f) => ({ ...f, N_CollegeId: e.target.value }))}
                    >
                      <option value="">Select</option>
                      {filteredColleges.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </CFormSelect>
                  </CCol>
                  <CCol md={3}>
                    <CFormSelect
                      label="Branch"
                      value={form.N_BranchId}
                      onChange={(e) => setForm((f) => ({ ...f, N_BranchId: e.target.value }))}
                    >
                      <option value="">Select</option>
                      {branches.map((b) => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                      ))}
                    </CFormSelect>
                  </CCol>
                  <CCol md={3}>
                    <CFormSelect
                      label="Sector"
                      value={form.N_SectorId}
                      onChange={(e) => setForm((f) => ({ ...f, N_SectorId: e.target.value }))}
                    >
                      <option value="">Select</option>
                      {sectors.map((s) => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </CFormSelect>
                  </CCol>
                  <CCol md={3}>
                    <CFormSelect
                      label="Course Type"
                      value={form.N_CourseType}
                      onChange={(e) => setForm((f) => ({ ...f, N_CourseType: e.target.value }))}
                    >
                      {courseTypes.map((t) => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                      ))}
                    </CFormSelect>
                  </CCol>
                  <CCol md={3}>
                    <CFormSelect
                      label="University"
                      value={UNIS.find((u) => u.name === form.N_University)?.id || ''}
                      onChange={(e) => {
                        const uni = UNIS.find((u) => String(u.id) === String(e.target.value))
                        setForm((f) => ({ ...f, N_University: uni?.name || '' }))
                      }}
                    >
                      <option value="">Select</option>
                      {UNIS.map((u) => (
                        <option key={u.id} value={u.id}>{u.name}</option>
                      ))}
                    </CFormSelect>
                  </CCol>
                  <CCol md={3}>
                    <CFormSelect
                      label="Course"
                      value={form.N_CourseId}
                      onChange={(e) => setForm((f) => ({ ...f, N_CourseId: e.target.value }))}
                    >
                      <option value="">Select</option>
                      {courses.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </CFormSelect>
                  </CCol>
                  <CCol md={3}>
                    <CFormSelect
                      label="Batch"
                      value={form.N_BatchId}
                      onChange={(e) => setForm((f) => ({ ...f, N_BatchId: e.target.value }))}
                    >
                      <option value="">Select</option>
                      {batches.map((b) => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                      ))}
                    </CFormSelect>
                  </CCol>
                  <CCol md={3}>
                    <CFormSelect
                      label="Session"
                      value={form.session}
                      onChange={(e) => setForm((f) => ({ ...f, session: e.target.value }))}
                    >
                      {sessions.map((s) => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </CFormSelect>
                  </CCol>
                </CRow>
              </CCol>
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
