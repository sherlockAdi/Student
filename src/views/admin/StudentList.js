import React, { useEffect, useState } from 'react'
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
  CSpinner,
  COffcanvas,
  COffcanvasHeader,
  COffcanvasBody,
} from '@coreui/react'
import { getCommonData, getAllStudents } from '../../api/api'


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

  // Server data and paging
  const [students, setStudents] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [isLoading, setIsLoading] = useState(false);

  // Search inputs
  const [admissionNo, setAdmissionNo] = useState('');
  const [studentName, setStudentName] = useState('');
  const [mobile, setMobile] = useState('');
  const [gender, setGender] = useState('');
  const [isLeft, setIsLeft] = useState(''); // '', 'true', 'false'

  // Details drawer
  const [showDetails, setShowDetails] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

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

  // Fetch from server
  const fetchStudents = async (page = pageNumber) => {
    setIsLoading(true);
    try {
      const params = {
        collegeId: collegeId ? parseInt(collegeId) : -1,
        branchId: branchId ? parseInt(branchId) : -1,
        courseId: courseId ? parseInt(courseId) : -1,
        universityId: universityId ? parseInt(universityId) : -1,
        courseTypeId: courseTypeId ? parseInt(courseTypeId) : -1,
        batchId: -1,
        semesterId: semesterId ? parseInt(semesterId) : -1,
        religionId: -1,
        casteId: casteId ? parseInt(casteId) : -1,
        maritalStatusId: -1,
        presentStatusId: -1,
        gender: gender || null,
        isLeft: isLeft === '' ? null : isLeft === 'true',
        admissionNo: admissionNo || null,
        studentName: studentName || null,
        mobile: mobile || null,
        searchTerm: null,
        pageNumber: page,
        pageSize,
      };
      const res = await getAllStudents(params);
      if (res?.isSuccess) {
        setStudents(res.data || []);
        setTotalRecords(res.totalRecords || 0);
      } else {
        setStudents([]);
        setTotalRecords(0);
      }
    } catch (e) {
      console.error('Failed to load students', e);
      setStudents([]);
      setTotalRecords(0);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-fetch on initial load
  useEffect(() => {
    fetchStudents(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-filter when any master data filter changes
  useEffect(() => {
    setPageNumber(1);
    fetchStudents(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collegeId, branchId, courseId, universityId, courseTypeId, semesterId, casteId, gender, isLeft, admissionNo, studentName, mobile]);

  const onResetFilters = () => {
    setCountryId(''); setStateId(''); setDistrictId(''); setTehsilId('');
    setCasteId(''); setCollegeId(''); setBranchId(''); setSemesterId('');
    setCourseId(''); setCourseTypeId(''); setUniversityId('');
    setAdmissionNo(''); setStudentName(''); setMobile(''); setGender(''); setIsLeft('');
    setPageNumber(1);
    // fetchStudents will be triggered by useEffect
  };

  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));
  const gotoPage = (p) => {
    const page = Math.min(Math.max(1, p), totalPages);
    setPageNumber(page);
    fetchStudents(page);
  };

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
              <CCol md={3}>
                <CFormSelect label="University" value={universityId} onChange={(e) => setUniversityId(e.target.value)}>
                  <option value="">All Universities</option>
                  {universities.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}
                </CFormSelect>
              </CCol>
              <CCol md={3}>
                <CFormSelect label="College" value={collegeId} onChange={(e) => setCollegeId(e.target.value)}>
                  <option value="">All Colleges</option>
                  {colleges.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}
                </CFormSelect>
              </CCol>
              <CCol md={3}>
                <CFormSelect label="Branch" value={branchId} onChange={(e) => setBranchId(e.target.value)}>
                  <option value="">All Branches</option>
                  {branches.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}
                </CFormSelect>
              </CCol>
              <CCol md={3}>
                <CFormSelect label="Course Type" value={courseTypeId} onChange={(e) => setCourseTypeId(e.target.value)}>
                  <option value="">All Course Types</option>
                  {courseTypes.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}
                </CFormSelect>
              </CCol>
              <CCol md={3}>
                <CFormSelect label="Course" value={courseId} onChange={(e) => setCourseId(e.target.value)}>
                  <option value="">All Courses</option>
                  {courses.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}
                </CFormSelect>
              </CCol>
              <CCol md={3}>
                <CFormSelect label="Semester" value={semesterId} onChange={(e) => setSemesterId(e.target.value)}>
                  <option value="">All Semesters</option>
                  {semestersOpt.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}
                </CFormSelect>
              </CCol>
              <CCol md={3}>
                <CFormSelect label="Caste Category" value={casteId} onChange={(e) => setCasteId(e.target.value)}>
                  <option value="">All Categories</option>
                  {castes.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}
                </CFormSelect>
              </CCol>
              <CCol md={3}>
                <CFormSelect label="Gender" value={gender} onChange={(e) => setGender(e.target.value)}>
                  <option value="">All Genders</option>
                  <option value="1">Male</option>
                  <option value="2">Female</option>
                </CFormSelect>
              </CCol>
              <CCol md={3}>
                <CFormInput
                  label="Admission No"
                  placeholder="Search by admission no"
                  value={admissionNo}
                  onChange={(e) => setAdmissionNo(e.target.value)}
                />
              </CCol>
              <CCol md={3}>
                <CFormInput
                  label="Student Name"
                  placeholder="Search by name"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                />
              </CCol>
              <CCol md={3}>
                <CFormInput
                  label="Mobile"
                  placeholder="Search by mobile"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                />
              </CCol>
              <CCol md={3}>
                <CFormSelect label="Student Status" value={isLeft} onChange={(e) => setIsLeft(e.target.value)}>
                  <option value="">All Students</option>
                  <option value="false">Active</option>
                  <option value="true">Left</option>
                </CFormSelect>
              </CCol>
              <CCol md={12} className="d-flex justify-content-end gap-2">
                <CButton color="secondary" variant="outline" onClick={onResetFilters}>
                  Reset Filters
                </CButton>
              </CCol>
            </CForm>

            {/* Loading Indicator */}
            {isLoading && (
              <div className="text-center py-3">
                <CSpinner color="primary" />
                <div className="mt-2 text-muted">Loading students...</div>
              </div>
            )}

            {/* Results Info */}
            {!isLoading && (
              <div className="mb-3 d-flex justify-content-between align-items-center">
                <div className="text-muted">
                  Showing {students.length > 0 ? (pageNumber - 1) * pageSize + 1 : 0} to {Math.min(pageNumber * pageSize, totalRecords)} of {totalRecords} students
                </div>
                <div className="d-flex align-items-center gap-2">
                  <CButton
                    color="primary"
                    variant="outline"
                    size="sm"
                    disabled={pageNumber === 1}
                    onClick={() => gotoPage(pageNumber - 1)}
                  >
                    Previous
                  </CButton>
                  <span className="text-muted">
                    Page {pageNumber} of {totalPages}
                  </span>
                  <CButton
                    color="primary"
                    variant="outline"
                    size="sm"
                    disabled={pageNumber >= totalPages}
                    onClick={() => gotoPage(pageNumber + 1)}
                  >
                    Next
                  </CButton>
                </div>
              </div>
            )}

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
                {students.map((s, idx) => (
                  <CTableRow key={s.id}>
                    <CTableHeaderCell scope="row">{(pageNumber - 1) * pageSize + idx + 1}</CTableHeaderCell>
                    <CTableDataCell>{s.admissionno || '-'}</CTableDataCell>
                    <CTableDataCell>{[s.firstname, s.middlename, s.lastname].filter(Boolean).join(' ')}</CTableDataCell>
                    <CTableDataCell>{s.gender}</CTableDataCell>
                    <CTableDataCell>{s.UniversityName || '-'}</CTableDataCell>
                    <CTableDataCell>{s.CourseTypeName || '-'}</CTableDataCell>
                    <CTableDataCell>{s.SemesterName || '-'}</CTableDataCell>
                    <CTableDataCell>{s.CategoryName || '-'}</CTableDataCell>
                    <CTableDataCell>{s.city || '-'}</CTableDataCell>
                    <CTableDataCell>
                      <CBadge color={s.status ? 'success' : 'secondary'}>
                        {s.status ? 'Active' : 'Inactive'}
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
                          onClick={() => { setSelectedStudent(s); setShowDetails(true); }}
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

            {/* Bottom Pagination */}
            {!isLoading && students.length > 0 && (
              <div className="mt-3 d-flex justify-content-between align-items-center">
                <div className="text-muted">
                  Showing {students.length > 0 ? (pageNumber - 1) * pageSize + 1 : 0} to {Math.min(pageNumber * pageSize, totalRecords)} of {totalRecords} students
                </div>
                <div className="d-flex align-items-center gap-2">
                  <CButton
                    color="primary"
                    variant="outline"
                    size="sm"
                    disabled={pageNumber === 1}
                    onClick={() => gotoPage(pageNumber - 1)}
                  >
                    Previous
                  </CButton>
                  <span className="text-muted">
                    Page {pageNumber} of {totalPages}
                  </span>
                  <CButton
                    color="primary"
                    variant="outline"
                    size="sm"
                    disabled={pageNumber >= totalPages}
                    onClick={() => gotoPage(pageNumber + 1)}
                  >
                    Next
                  </CButton>
                </div>
              </div>
            )}

            {/* No Results Message */}
            {!isLoading && students.length === 0 && (
              <div className="text-center py-4 text-muted">
                No students found matching the selected filters.
              </div>
            )}
            {/* Right-side Drawer for Student Details */}
            <COffcanvas placement="end" visible={showDetails} onHide={() => setShowDetails(false)}>
              <COffcanvasHeader closeButton>Student Details</COffcanvasHeader>
              <COffcanvasBody>
                {selectedStudent ? (
                  <div className="small">
                    <div className="fw-semibold mb-2">{[selectedStudent.firstname, selectedStudent.middlename, selectedStudent.lastname].filter(Boolean).join(' ')}</div>
                    <div><strong>Admission No:</strong> {selectedStudent.admissionno || '-'}</div>
                    <div><strong>Mobile:</strong> {selectedStudent.mobileno1 || '-'}</div>
                    <div><strong>Email (Personal):</strong> {selectedStudent.personalemail || '-'}</div>
                    <div><strong>Email (College):</strong> {selectedStudent.collegeemail || '-'}</div>
                    <div><strong>Gender:</strong> {selectedStudent.gender === '1' ? 'Male' : selectedStudent.gender === '2' ? 'Female' : (selectedStudent.gender || '-')}</div>
                    <div><strong>Date of Birth:</strong> {selectedStudent.dateofbirth ? String(selectedStudent.dateofbirth).split('T')[0] : '-'}</div>
                    <hr />
                    <div><strong>College:</strong> {selectedStudent.CollegeName || '-'} {selectedStudent.collegeid ? `(ID: ${selectedStudent.collegeid})` : ''}</div>
                    <div><strong>Branch:</strong> {selectedStudent.BranchName || '-'} {selectedStudent.branchid ? `(ID: ${selectedStudent.branchid})` : ''}</div>
                    <div><strong>Course Type:</strong> {selectedStudent.CourseTypeName || '-'} {selectedStudent.coursetypeid ? `(ID: ${selectedStudent.coursetypeid})` : ''}</div>
                    <div><strong>Course:</strong> {selectedStudent.CourseName || '-'} {selectedStudent.courseid ? `(ID: ${selectedStudent.courseid})` : ''}</div>
                    <div><strong>University:</strong> {selectedStudent.UniversityName || '-'} {selectedStudent.universityid ? `(ID: ${selectedStudent.universityid})` : ''}</div>
                    <div><strong>Semester:</strong> {selectedStudent.SemesterName || '-'} {selectedStudent.semesterid ? `(ID: ${selectedStudent.semesterid})` : ''}</div>
                    <hr />
                    <div><strong>Category:</strong> {selectedStudent.CategoryName || '-'} {selectedStudent.CategoryId ? `(ID: ${selectedStudent.CategoryId})` : ''}</div>
                    <div><strong>Religion:</strong> {selectedStudent.ReligionName || '-'} {selectedStudent.ReligionId ? `(ID: ${selectedStudent.ReligionId})` : ''}</div>
                    <div><strong>Marital Status:</strong> {selectedStudent.MaritalStatusName || '-'} {selectedStudent.MaritalStatusId ? `(ID: ${selectedStudent.MaritalStatusId})` : ''}</div>
                    <div><strong>Present Status:</strong> {selectedStudent.PresentStatusName || '-'} {selectedStudent.PresentStatusId ? `(ID: ${selectedStudent.PresentStatusId})` : ''}</div>
                    <div><strong>Left:</strong> {selectedStudent.isleft ? 'Yes' : 'No'}</div>
                    <div><strong>Status:</strong> {selectedStudent.status ? 'Active' : 'Inactive'}</div>
                  </div>
                ) : (
                  <div className="text-muted">No student selected.</div>
                )}
              </COffcanvasBody>
            </COffcanvas>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default StudentList
