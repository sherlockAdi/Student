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
  // Full filter set via common-data API
  const [countries, setCountries] = useState([]); // type=1
  const [states, setStates] = useState([]); // type=2 requires country
  const [districts, setDistricts] = useState([]); // type=3 requires state
  const [tehsils, setTehsils] = useState([]); // type=4 requires district
  const [castes, setCastes] = useState([]); // type=5
  const [branches, setBranches] = useState([]); // type=6 (parent college optional)
  const [semestersOpt, setSemestersOpt] = useState([]); // type=7
  const [courses, setCourses] = useState([]); // type=8 (parent optional)
  const [courseTypes, setCourseTypes] = useState([]); // type=9
  const [colleges, setColleges] = useState([]); // type=10
  const [universities, setUniversities] = useState([]); // type=11

  // Selected values (ids as strings)
  const [countryId, setCountryId] = useState('');
  const [stateId, setStateId] = useState('');
  const [districtId, setDistrictId] = useState('');
  const [tehsilId, setTehsilId] = useState('');
  const [casteId, setCasteId] = useState('');
  const [collegeId, setCollegeId] = useState('');
  const [branchId, setBranchId] = useState('');
  const [semesterId, setSemesterId] = useState('');
  const [courseId, setCourseId] = useState('');
  const [courseTypeId, setCourseTypeId] = useState('');
  const [universityId, setUniversityId] = useState('');

  // Load top-level option sets
  useEffect(() => {
    (async () => {
      setCountries(await getCommonData({ type: 1 }));
      setCastes(await getCommonData({ type: 5 }));
      setSemestersOpt(await getCommonData({ type: 7 }));
      setCourses(await getCommonData({ type: 8 }));
      setCourseTypes(await getCommonData({ type: 9 }));
      setColleges(await getCommonData({ type: 10 }));
      setUniversities(await getCommonData({ type: 11 }));
      // Branches: load all initially to allow All
      setBranches(await getCommonData({ type: 6 }));
    })();
  }, []);

  // Cascading loads for region hierarchy
  useEffect(() => {
    (async () => {
      setStates(countryId ? await getCommonData({ type: 2, parentid: parseInt(countryId) }) : []);
      setStateId('');
      setDistrictId('');
      setTehsilId('');
      setDistricts([]);
      setTehsils([]);
    })();
  }, [countryId]);

  useEffect(() => {
    (async () => {
      setDistricts(stateId ? await getCommonData({ type: 3, parentid: parseInt(stateId) }) : []);
      setDistrictId('');
      setTehsilId('');
      setTehsils([]);
    })();
  }, [stateId]);

  useEffect(() => {
    (async () => {
      setTehsils(districtId ? await getCommonData({ type: 4, parentid: parseInt(districtId) }) : []);
      setTehsilId('');
    })();
  }, [districtId]);

  // College -> Branch dependency
  useEffect(() => {
    (async () => {
      const list = await getCommonData({ type: 6, parentid: collegeId ? parseInt(collegeId) : -1 });
      setBranches(list || []);
      setBranchId('');
    })();
  }, [collegeId]);

  // Apply filters to mock DATA using names where possible
  const nameById = (list, id) => (list.find((x) => String(x.id) === String(id))?.name || '').trim();
  const filtered = useMemo(() => {
    const sel = {
      country: nameById(countries, countryId),
      state: nameById(states, stateId),
      district: nameById(districts, districtId),
      tehsil: nameById(tehsils, tehsilId),
      caste: nameById(castes, casteId),
      college: nameById(colleges, collegeId),
      branch: nameById(branches, branchId),
      semester: nameById(semestersOpt, semesterId),
      course: nameById(courses, courseId),
      courseType: nameById(courseTypes, courseTypeId),
      university: nameById(universities, universityId),
    };
    return DATA.filter((s) => {
      const addr = s.address || {};
      const okState = !sel.state || addr.state === sel.state;
      const okSemester = !semesterId || String(s.semesterid) === sel.semester; // assuming semesterno equals s.semesterid
      const okUniversity = !universityId || s.N_University === sel.university;
      const okCourseType = !courseTypeId || s.N_CourseType === sel.courseType;
      const okCategory = !casteId || s.category === sel.caste;
      // Other filters (country/district/tehsil/college/branch/course) not available in mock DATA, skip
      return okState && okSemester && okUniversity && okCourseType && okCategory;
    });
  }, [DATA, countries, states, districts, tehsils, castes, branches, semestersOpt, courses, courseTypes, colleges, universities, countryId, stateId, districtId, tehsilId, casteId, collegeId, branchId, semesterId, courseId, courseTypeId, universityId]);

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Admin</strong> <small>Student List with Filters</small>
          </CCardHeader>
          <CCardBody>
            {/* Full Filter Panel (Common Data) */}
            <CForm className="row g-3 mb-3">
              <CCol md={2}>
                <CFormSelect label="Country" value={countryId} onChange={(e) => setCountryId(e.target.value)}>
                  <option value="">All</option>
                  {countries.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}
                </CFormSelect>
              </CCol>
              <CCol md={2}>
                <CFormSelect label="State" value={stateId} onChange={(e) => setStateId(e.target.value)}>
                  <option value="">All</option>
                  {states.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}
                </CFormSelect>
              </CCol>
              <CCol md={2}>
                <CFormSelect label="District" value={districtId} onChange={(e) => setDistrictId(e.target.value)}>
                  <option value="">All</option>
                  {districts.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}
                </CFormSelect>
              </CCol>
              <CCol md={2}>
                <CFormSelect label="Tehsil" value={tehsilId} onChange={(e) => setTehsilId(e.target.value)}>
                  <option value="">All</option>
                  {tehsils.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}
                </CFormSelect>
              </CCol>
              <CCol md={2}>
                <CFormSelect label="Caste Category" value={casteId} onChange={(e) => setCasteId(e.target.value)}>
                  <option value="">All</option>
                  {castes.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}
                </CFormSelect>
              </CCol>
              <CCol md={2}>
                <CFormSelect label="University" value={universityId} onChange={(e) => setUniversityId(e.target.value)}>
                  <option value="">All</option>
                  {universities.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}
                </CFormSelect>
              </CCol>
              <CCol md={2}>
                <CFormSelect label="College" value={collegeId} onChange={(e) => setCollegeId(e.target.value)}>
                  <option value="">All</option>
                  {colleges.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}
                </CFormSelect>
              </CCol>
              <CCol md={2}>
                <CFormSelect label="Branch" value={branchId} onChange={(e) => setBranchId(e.target.value)}>
                  <option value="">All</option>
                  {branches.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}
                </CFormSelect>
              </CCol>
              <CCol md={2}>
                <CFormSelect label="Course Type" value={courseTypeId} onChange={(e) => setCourseTypeId(e.target.value)}>
                  <option value="">All</option>
                  {courseTypes.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}
                </CFormSelect>
              </CCol>
              <CCol md={2}>
                <CFormSelect label="Course" value={courseId} onChange={(e) => setCourseId(e.target.value)}>
                  <option value="">All</option>
                  {courses.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}
                </CFormSelect>
              </CCol>
              <CCol md={2}>
                <CFormSelect label="Semester" value={semesterId} onChange={(e) => setSemesterId(e.target.value)}>
                  <option value="">All</option>
                  {semestersOpt.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}
                </CFormSelect>
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
