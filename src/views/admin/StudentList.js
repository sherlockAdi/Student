import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { cilPencil, cilSearch, cilPlus } from '@coreui/icons'
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
  CFormLabel,
} from '@coreui/react'
import { getCommonData, getAllStudents, getOrganizations, getCollegesByOrganization, getBranchesByCollege, getCourseTypesByCollege, getUniversitiesByCourseType, getBatchesByUniversity, getCoursesByBatch, getSectionsByCourse, getFinancialYear,getCasteCategories,getFeeCategories,getadmissionCategories,getAllStudentRecords  } from '../../api/api'
import { useFormState } from 'react-dom'


const StudentList = () => {
  const navigate = useNavigate()
  const location = useLocation()
  // Full filter set via common-data API

  const [organizations, setOrganizations] = useState([])
  const [countries, setCountries] = useState([]); // type=1
  const [states, setStates] = useState([]); // type=2 requires country
  const [districts, setDistricts] = useState([]); // type=3 requires state
  const [tehsils, setTehsils] = useState([]); // type=4 requires district
  
  const [branches, setBranches] = useState([]); // type=6 (parent college optional)
  const [semestersOpt, setSemestersOpt] = useState([]); // type=7

  const [colleges, setColleges] = useState([]); // type=10


  // Selected values (ids as strings)
  const [OrganizationId, setOrganizationId] = useState('')
  const [collegeId, setCollegeId] = useState('');
  const [branchId, setBranchId] = useState('');
  const [courseTypeId, setCourseTypeId] = useState('');
  const [coursetypes, setCourseTypes] = useState([]);
  const [universityId, setUniversityId] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [BatchId, setBatchList] = useState([]);
  const [Batches, setBatches] = useState([]);
  const [CourseId, setCourseId] = useState('');
  const [Course, setCourses] = useState([]);
  const [SectionId, setSection] = useState([]);
  const [Sections, setSections] = useState([]);
  const [financialYears, setFinancialYears] = useState([]);
  const [FeeCategoryId,setFeecategoryId]=useState('');
  const [feecategories,setFeeCategories]=useState([]);
  const [admissioncategoryId,setadmissionCategoryId]=useState('');
  const [admissioncategories,setadmissioncategories]=useState([]);
  const [mobileno1,setmobile1]=useState('');
  const [mobileNumber,setMobileNumber]=useState([]);
  const [Gender,setgender]=useState('');
  const [Genders,setGenders]=useState([]);


  const [filters, setFilters] = useState({
    CollegeId: '',
    BranchId: '',
    CourseId: '',
    UniversityId: '',
    CourseTypeId: '',
    BatchId: '',
    SemesterId: '',
    IsLeft: '',
    FirstName: '',
    CEmail: '',
    UserId: '',
  });

  const [students, setStudents] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [countryId, setCountryId] = useState('');
  const [stateId, setStateId] = useState('');
  const [, setDistrictId] = useState('');
  const [tehsilId, setTehsilId] = useState('');
  const [casteId, setCasteId] = useState('');
  const [castecategories,setCastes]=useState([]);
  const [financialYear, setFinancialYear] = useState('')


  const [semesterId, setSemesterId] = useState('');




  // Server data and paging
  
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
      setOrganizations(await getOrganizations());


    })();
  }, []);

  // Load colleges when organization changes
  useEffect(() => {
    if (OrganizationId && parseInt(OrganizationId) > 0) {
      getCollegesByOrganization(OrganizationId)
        .then(data => setColleges(data || []))
        .catch(err => console.error('Error loading colleges:', err))
    } else {
      setColleges([])
    }
  }, [OrganizationId])
  // Load branches and course types when college changes
  useEffect(() => {
    if (collegeId && parseInt(collegeId) > 0) {
      Promise.all([
        getBranchesByCollege(collegeId),
        getCourseTypesByCollege(collegeId)
      ])
        .then(([branchesData, courseTypesData]) => {
          setBranches(branchesData || [])
          setCourseTypes(courseTypesData || [])
        })
        .catch(err => console.error('Error loading branches/course types:', err))
    } else {
      setBranches([])
      setCourseTypeId([])
    }
  }, [collegeId])

  // Load universities when course type changes
  useEffect(() => {
    if (courseTypeId) {
      getUniversitiesByCourseType(courseTypeId)
        .then(data => setUniversities(data || []))
        .catch(err => console.error('Error loading universities:', err))
    } else {
      setUniversities([])
    }
  }, [courseTypeId])

  // Load batches when university changes
  useEffect(() => {
    if (courseTypeId && universityId > 0) {
      getBatchesByUniversity(courseTypeId, universityId)
        .then(data => setBatches(data || []))
        .catch(err => console.error('Error loading batches:', err))
    } else {
      setBatches([])
    }
  }, [courseTypeId, universityId])

  // Load courses when batch changes
  useEffect(() => {
    if (courseTypeId && universityId && BatchId) {
      getCoursesByBatch(courseTypeId, universityId, BatchId)
        .then(data => {
          setCourses(data?.Courses || [])
        })
        .catch(err => console.error('Error loading courses:', err))
    } else {
      setCourses([])
    }
  }, [courseTypeId, universityId, BatchId])

  // Load sections when course changes
  useEffect(() => {
    if (courseTypeId && universityId && BatchId && CourseId) {

      getSectionsByCourse(courseTypeId, universityId, BatchId, CourseId)
        .then(data => {
          console.log(data)
          setSections(data?.Sections || [])
          setSemestersOpt(data?.Semesters || [])
        })
        .catch(err => console.error('Error loading sections:', err))
    } else {
      setSections([])
    }
  }, [courseTypeId, universityId, BatchId, CourseId])

  // Load financialyear 
  useEffect(() => {
  
      getFinancialYear()
        .then(data => setFinancialYears(data || []))
        .catch(err => console.error('Error loading colleges:', err))

        
      getCasteCategories()
        .then(data => setCastes(data || []))
        .catch(err => console.error('Error loading colleges:', err))

        getFeeCategories()
        .then(data => setFeeCategories(data || []))
        .catch(err => console.error('Error loading colleges:', err))

        getadmissionCategories()
        .then(data => setadmissioncategories(data || []))
        .catch(err => console.error('Error loading colleges:', err))
      
  }, [])
  
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

      if (res) {
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

  const fetchStudentss = async (page = 1, searchFilters = filters) => {
  setIsLoading(true);
  console.log(searchFilters)
  try {
    const params = {
      CollegeId: collegeId ? collegeId: '%',
      BranchId: branchId ? branchId : '%',
      CourseId: CourseId ? CourseId : '%',
      UniversityId: universityId ? universityId : '%',
      CourseTypeId: courseTypeId ? courseTypeId : '%',
      BatchId: BatchId ? BatchId: '%',
      SemesterId: semesterId ? semesterId : '%',      
      isLeft: searchFilters.IsLeft === '' ? null : searchFilters.IsLeft === 'true',
      CEmail: admissionNo || null,
      FirstName: studentName || null,
      mobileno1: mobile || null,
      Gender:gender ||null,
      pageNumber: page,
      pageSize,
    };
    console.log(params);

    const res = await getAllStudentRecords(params);
    if (res) {
      console.log(res?.data?.data)
  setStudents(res?.data?.data || []);
  setTotalRecords(res?.data?.data.length || 0);
} else {
  setStudents([]);
  setTotalRecords(0);
}
  } catch (e) {
    console.error(e);
    setStudents([]);
    setTotalRecords(0);
  } finally {
    setIsLoading(false);
  }
};

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader className="d-flex justify-content-between align-items-center">
            <div>
              <strong>Admin</strong> <small>Student List with Filters</small>
            </div>
            <CButton
              color="primary"
              size="sm"
              onClick={() => navigate('/admin/students/add')}
            >
              <CIcon icon={cilPlus} className="me-1" />
              Add Student
            </CButton>
          </CCardHeader>
          <CCardBody>
            {/* Full Filter Panel (Common Data) */}

            <CForm className="row g-3 mb-3">
              <CCol md={3}>
                <CFormLabel>Organisation Name </CFormLabel>
                <CFormSelect name="organizationName" value={OrganizationId} onChange={(e) => setOrganizationId(e.target.value)} >
                  <option value="">Select Organisation</option>
                  {organizations && organizations.map(org => (
                    <option key={org.OrganisationID} value={org.OrganisationID}>{org.OrganisationName}</option>
                  ))}
                </CFormSelect>
              </CCol>
              <CCol md={3}>
                <CFormLabel>College Name *</CFormLabel>
                <CFormSelect name="collegeName" value={collegeId} onChange={(e => setCollegeId(e.target.value))} >
                  <option value="">Select College</option>
                  {colleges.map(college => (
                    <option key={college.CollegeID} value={college.CollegeID}>{college.CollegeName}</option>
                  ))}
                </CFormSelect>
              </CCol>

              <CCol md={3}>
                <CFormSelect label="Branch" value={branchId} onChange={(e) => setBranchId(e.target.value)}>
                  <option value="">All Branches</option>
                  {branches.map((x) => <option key={x.Id} value={x.Id}>{x.BranchName}</option>)}
                </CFormSelect>
              </CCol>
              <CCol md={3}>
                <CFormSelect label="Course Type" value={courseTypeId} onChange={(e) => setCourseTypeId(e.target.value)}>
                  <option value="">All Course Types</option>
                  {coursetypes.map((x) => <option key={x.Id} value={x.Id}>{x.CourseName}</option>)}
                </CFormSelect>
              </CCol>
              <CCol md={3}>
                <CFormSelect label="University" value={universityId} onChange={(e) => setUniversityId(e.target.value)}>
                  <option value="">All University</option>
                  {universities.map((x) => <option key={x.Id} value={x.Id}>{x.Name}</option>)}
                </CFormSelect>
              </CCol>
              <CCol md={3}>
                <CFormSelect label="Batch" value={BatchId} onChange={(e) => setBatchList(e.target.value)}>
                  <option value="">All Batches</option>
                  {Batches.map((x) => <option key={x.Id} value={x.Id}>{x.BatchName}</option>)}
                </CFormSelect>
              </CCol>
              <CCol md={3}>
                <CFormSelect label="Course" value={CourseId}
                  onChange={(e) => setCourseId(e.target.value)}>
                  <option value="">All Courses</option>
                  {Course.map((x) => <option key={x.Id} value={x.Id}>{x.CourseName}</option>)}
                </CFormSelect>
              </CCol>
              <CCol md={3}>
                <CFormSelect label="Section" value={SectionId} onChange={(e) => setSection(e.target.value)}>
                  <option value="">All Section</option>
                  {Sections.map((x) => <option key={x.Id} value={x.Id}>{x.Name}</option>)}
                </CFormSelect>
              </CCol>
              <CCol md={3}>
                <CFormSelect label="Financial Year" value={financialYear} onChange={(e) => setFinancialYear(e.target.value)}>
                  <option value="">All FinancialYear</option>
                  {financialYears.map((x) => <option key={x.Id} value={x.Id}>{x.FinancialYear}</option>)}
                </CFormSelect>
              </CCol>
              <CCol md={3}>
                <CFormSelect label="Semester" value={semesterId} onChange={(e) => setSemesterId(e.target.value)}>
                  <option value="">All Semesters</option>
                  {semestersOpt.map((x) => <option key={x.Id} value={x.Id}>{x.SemesterName}</option>)}
                </CFormSelect>
              </CCol>
              <CCol md={3}>
                <CFormSelect label="Caste Category" value={casteId} onChange={(e) => setCasteId(e.target.value)}>
                  <option value="">All Categories</option>
                  {castecategories.map((x) => <option key={x.id} value={x.id}>{x.CategoryName}</option>)}
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
                <CFormSelect label="Fee Category" values={FeeCategoryId} onChange={(e)=>setFeecategoryId(e.target.value)}>
                  <option value="">All Fee Category</option>
                   {feecategories.map((x)=><option key={x.Id} value={x.Id}>{x.FeeCategoryName}</option>)}
                </CFormSelect>
              </CCol>
              <CCol md={3}>
                <CFormSelect label="Admission Category" values={admissioncategoryId} onChange={(e)=>setadmissionCategoryId(e.target.value)}>
                  <option value="">All Admission Category</option>
                  {admissioncategories.map((x)=><option key={x.Id} value={x.Id}>{x.AdmissionCategoryName}</option>)}
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
              {/* <CCol md={12} className="d-flex justify-content-end gap-2">
                <CButton color="secondary" variant="outline" onClick={onResetFilters}>
                  Reset Filters
                </CButton>
              </CCol> */}
              <CCol md={12} className="d-flex justify-content-end gap-2">
  <CButton
    color="primary"
    onClick={() => {
      setPageNumber(1);
       fetchStudentss(1, filters);// 🔍 fetch data based on filters
    }}
  >
    <CIcon icon={cilSearch} className="me-1" />
    Search
  </CButton>

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
                  <CTableHeaderCell>SRN</CTableHeaderCell>                  
                  <CTableHeaderCell>Name</CTableHeaderCell>
                  <CTableHeaderCell>University</CTableHeaderCell>
                  <CTableHeaderCell>Batch</CTableHeaderCell>
                  <CTableHeaderCell>Course </CTableHeaderCell>
                  <CTableHeaderCell>Course Type </CTableHeaderCell>
                  <CTableHeaderCell>Semester</CTableHeaderCell>
                  <CTableHeaderCell>Mobile No.</CTableHeaderCell>                  
                  <CTableHeaderCell>Personal Email Id</CTableHeaderCell>
                  <CTableHeaderCell>College Email Id</CTableHeaderCell>
                  <CTableHeaderCell>Father Name</CTableHeaderCell>
                  <CTableHeaderCell>Father Mobile No.</CTableHeaderCell>
                  <CTableHeaderCell>Student ID</CTableHeaderCell>
                  <CTableHeaderCell>IsLeft</CTableHeaderCell>
                  <CTableHeaderCell className="text-end">Actions</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {students.map((s, idx) => (
                  <CTableRow key={s.id}>
                    <CTableHeaderCell scope="row">{(pageNumber - 1) * pageSize + idx + 1}</CTableHeaderCell>
                    <CTableDataCell>{s.AdmissionNo || '-'}</CTableDataCell>
                    <CTableDataCell>{[s.FirstName, s.LastName].filter(Boolean).join(' ') || '-'}</CTableDataCell>
                    <CTableDataCell>{s.UniversityName || '-'}</CTableDataCell>
                    <CTableDataCell>{s.BatchNo ||'-'}</CTableDataCell>
                    <CTableDataCell>{s.CourseName || '-'}</CTableDataCell>
                    <CTableDataCell>{s.CourseType || '-'}</CTableDataCell>
                    <CTableDataCell>{s.SemesterName || '-'}</CTableDataCell>
                    <CTableDataCell>{s.MobileNo || '-'}</CTableDataCell>                    
                    <CTableDataCell>{s.PersonalEmailId || '-'}</CTableDataCell>
                    <CTableDataCell>{s.CollegeEmailId || '-'}</CTableDataCell>
                    <CTableDataCell>{s.FatherName || '-'}</CTableDataCell>                    
                    <CTableDataCell>{s.FatherMobileNo || '-'}</CTableDataCell>
                    <CTableDataCell>{s.Id || '-'}</CTableDataCell>
                    <CTableDataCell>
                      <CBadge color={s.IsLeft ? 'success' : 'secondary'}>
                        {s.IsLeft ? 'Active' : 'Inactive'}
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
