import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { cilPencil, cilSearch } from '@coreui/icons'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CForm,
  CFormInput,
  CFormSelect,
  CButton,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CBadge,
} from '@coreui/react'
import { students as DATA } from '../../data/students'
import { getCommonData } from '../../api/api'

const unique = (arr, key) => Array.from(new Set(arr.map((x) => x[key]))).filter(Boolean)

const StudentList = () => {
  const navigate = useNavigate()
  // Generic Common-Data filters
  const typeOptions = [
    { id: 1, label: 'Country' },
    { id: 2, label: 'State' },
    { id: 3, label: 'District' },
    { id: 4, label: 'Tehsil' },
    { id: 5, label: 'Caste Category' },
    { id: 6, label: 'Branch' },
    { id: 7, label: 'Semester' },
    { id: 8, label: 'Courses' },
    { id: 9, label: 'Course Type' },
    { id: 10, label: 'College' },
    { id: 11, label: 'University' },
  ];
  const parentMap = {
    2: 1,   // State <- Country
    3: 2,   // District <- State
    4: 3,   // Tehsil <- District
    6: 10,  // Branch <- College
    // 8 (Courses) parent is special in SP; left optional
  };
  const [selectedType, setSelectedType] = useState(''); // numeric string or ''
  const [parentOptions, setParentOptions] = useState([]); // [{id,name}]
  const [selectedParentId, setSelectedParentId] = useState('');
  const [mainOptions, setMainOptions] = useState([]); // [{id,name}]
  const [selectedMainId, setSelectedMainId] = useState('');
  const [filters, setFilters] = useState({
    firstname: '',
    lastname: '',
    gender: '',
    N_University: '',
    N_CourseType: '',
    category: '',
    semesterid: '',
    city: '',
    state: '',
  })

  // Load parent options when type changes and requires parent
  useEffect(() => {
    const loadParents = async () => {
      const t = parseInt(selectedType);
      const pType = parentMap[t];
      if (!t || !pType) {
        setParentOptions([]);
        setSelectedParentId('');
        return;
      }
      const data = await getCommonData({ type: pType, parentid: -1, selfid: -1 });
      setParentOptions(data || []);
      setSelectedParentId('');
    };
    loadParents();
  }, [selectedType]);

  // Load main options when selectedType or selectedParentId changes
  useEffect(() => {
    const loadMain = async () => {
      const t = parseInt(selectedType);
      if (!t) {
        setMainOptions([]);
        setSelectedMainId('');
        return;
      }
      const pType = parentMap[t];
      const parentid = pType ? (selectedParentId ? parseInt(selectedParentId) : -1) : -1;
      const data = await getCommonData({ type: t, parentid, selfid: -1 });
      setMainOptions(data || []);
    };
    loadMain();
  }, [selectedType, selectedParentId]);

  const universities = useMemo(() => unique(DATA, 'N_University'), [])
  const courseTypes = useMemo(() => unique(DATA, 'N_CourseType'), [])
  const categories = useMemo(() => unique(DATA, 'category'), [])
  const semesters = useMemo(() => unique(DATA, 'semesterid'), [])
  const states = useMemo(() => unique(DATA.map((s) => s.address || {}).filter(Boolean), 'state'), [])
  const cities = useMemo(() => unique(DATA.map((s) => s.address || {}).filter(Boolean), 'city'), [])

  const filtered = useMemo(() => {
    return DATA.filter((s) => {
      const addr = s.address || {}
      return (
        (!filters.firstname || s.firstname.toLowerCase().includes(filters.firstname.toLowerCase())) &&
        (!filters.lastname || s.lastname.toLowerCase().includes(filters.lastname.toLowerCase())) &&
        (!filters.gender || s.gender === filters.gender) &&
        (!filters.N_University || s.N_University === filters.N_University) &&
        (!filters.N_CourseType || s.N_CourseType === filters.N_CourseType) &&
        (!filters.category || s.category === filters.category) &&
        (!filters.semesterid || String(s.semesterid) === String(filters.semesterid)) &&
        (!filters.state || addr.state === filters.state) &&
        (!filters.city || addr.city === filters.city)
      )
    })
  }, [filters])

  const onChange = (e) => {
    const { name, value } = e.target
    setFilters((f) => ({ ...f, [name]: value }))
  }

  const reset = () => setFilters({
    firstname: '', lastname: '', gender: '', N_University: '', N_CourseType: '', category: '', semesterid: '', city: '', state: ''
  })

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Admin</strong> <small>Student List with Filters</small>
          </CCardHeader>
          <CCardBody>
            {/* Common-Data Filter Panel */}
            <CForm className="row g-3 mb-4">
              <CCol md={3}>
                <CFormSelect
                  label="Filter Type"
                  value={selectedType}
                  onChange={(e) => { setSelectedType(e.target.value); setSelectedMainId(''); }}
                >
                  <option value="">Select Type</option>
                  {typeOptions.map((t) => (
                    <option key={t.id} value={t.id}>{t.label}</option>
                  ))}
                </CFormSelect>
              </CCol>
              {selectedType && parentMap[parseInt(selectedType)] && (
                <CCol md={3}>
                  <CFormSelect
                    label="Parent"
                    value={selectedParentId}
                    onChange={(e) => { setSelectedParentId(e.target.value); setSelectedMainId(''); }}
                  >
                    <option value="">All</option>
                    {parentOptions.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </CFormSelect>
                </CCol>
              )}
              {selectedType && (
                <CCol md={3}>
                  <CFormSelect
                    label="Value"
                    value={selectedMainId}
                    onChange={(e) => setSelectedMainId(e.target.value)}
                  >
                    <option value="">All</option>
                    {mainOptions.map((m) => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </CFormSelect>
                </CCol>
              )}
            </CForm>
            <CForm className="row g-3 mb-3">
              <CCol md={3}>
                <CFormInput name="firstname" label="First Name" value={filters.firstname} onChange={onChange} />
              </CCol>
              <CCol md={3}>
                <CFormInput name="lastname" label="Last Name" value={filters.lastname} onChange={onChange} />
              </CCol>
              <CCol md={2}>
                <CFormSelect name="gender" label="Gender" value={filters.gender} onChange={onChange}>
                  <option value="">All</option>
                  <option>Male</option>
                  <option>Female</option>
                </CFormSelect>
              </CCol>
              <CCol md={4}>
                <CFormSelect name="N_University" label="University" value={filters.N_University} onChange={onChange}>
                  <option value="">All</option>
                  {universities.map((u) => (
                    <option key={u}>{u}</option>
                  ))}
                </CFormSelect>
              </CCol>
              <CCol md={3}>
                <CFormSelect name="N_CourseType" label="Course Type" value={filters.N_CourseType} onChange={onChange}>
                  <option value="">All</option>
                  {courseTypes.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </CFormSelect>
              </CCol>
              <CCol md={3}>
                <CFormSelect name="category" label="Category" value={filters.category} onChange={onChange}>
                  <option value="">All</option>
                  {categories.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </CFormSelect>
              </CCol>
              <CCol md={2}>
                <CFormSelect name="semesterid" label="Semester" value={filters.semesterid} onChange={onChange}>
                  <option value="">All</option>
                  {semesters.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </CFormSelect>
              </CCol>
              <CCol md={2}>
                <CFormSelect name="state" label="State" value={filters.state} onChange={onChange}>
                  <option value="">All</option>
                  {states.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </CFormSelect>
              </CCol>
              <CCol md={2}>
                <CFormSelect name="city" label="City" value={filters.city} onChange={onChange}>
                  <option value="">All</option>
                  {cities.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </CFormSelect>
              </CCol>
              <CCol xs={12} className="d-flex gap-2">
                <CButton color="secondary" variant="outline" onClick={reset}>Reset</CButton>
              </CCol>
            </CForm>

            <CTable hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>#</CTableHeaderCell>
                  <CTableHeaderCell>Student ID</CTableHeaderCell>
                  <CTableHeaderCell>Name</CTableHeaderCell>
                  <CTableHeaderCell>Gender</CTableHeaderCell>
                  <CTableHeaderCell>University</CTableHeaderCell>
                  <CTableHeaderCell>Course Type</CTableHeaderCell>
                  <CTableHeaderCell>Semester</CTableHeaderCell>
                  <CTableHeaderCell>Category</CTableHeaderCell>
                  <CTableHeaderCell>City</CTableHeaderCell>
                  <CTableHeaderCell>Status</CTableHeaderCell>
                  <CTableHeaderCell className="text-end">Actions</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {filtered.map((s, idx) => (
                  <CTableRow key={s.id}>
                    <CTableHeaderCell scope="row">{idx + 1}</CTableHeaderCell>
                    <CTableDataCell>{s.studentid}</CTableDataCell>
                    <CTableDataCell>{[s.firstname, s.middlename, s.lastname].filter(Boolean).join(' ')}</CTableDataCell>
                    <CTableDataCell>{s.gender}</CTableDataCell>
                    <CTableDataCell>{s.N_University}</CTableDataCell>
                    <CTableDataCell>{s.N_CourseType}</CTableDataCell>
                    <CTableDataCell>{s.semesterid}</CTableDataCell>
                    <CTableDataCell>{s.category}</CTableDataCell>
                    <CTableDataCell>{s.address?.city || '-'}</CTableDataCell>
                    <CTableDataCell>
                      <CBadge color={s.isactive ? 'success' : 'secondary'}>
                        {s.isactive ? 'Active' : 'Inactive'}
                      </CBadge>
                    </CTableDataCell>
                    <CTableDataCell className="text-end">
                      <div className="d-inline-flex align-items-center gap-2">
                        <CButton
                          size="sm"
                          color="secondary"
                          variant="outline"
                          className="d-inline-flex align-items-center justify-content-center"
                          style={{ width: 32, height: 32, padding: 0 }}
                          onClick={() => navigate(`/admin/students/${s.id}/view`)}
                          aria-label="View"
                          title="View"
                        >
                          <CIcon icon={cilSearch} />
                        </CButton>
                        <CButton
                          size="sm"
                          color="primary"
                          variant="outline"
                          className="d-inline-flex align-items-center justify-content-center"
                          style={{ width: 32, height: 32, padding: 0 }}
                          onClick={() => navigate(`/admin/students/${s.id}/edit`)}
                          aria-label="Edit"
                          title="Edit"
                        >
                          <CIcon icon={cilPencil} />
                        </CButton>
                      </div>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default StudentList
