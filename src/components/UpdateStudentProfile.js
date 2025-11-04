import React, { useState, useEffect } from 'react'
import {
  CCard, CCardBody, CCardHeader, CCol, CRow, CNav, CNavItem, CNavLink,
  CTabContent, CTabPane, CAlert, CSpinner, CBadge, CButton, CForm,
  CFormInput, CFormSelect, CFormLabel, CFormTextarea, CFormCheck, CModal, CModalHeader,
  CModalTitle, CModalBody, CModalFooter
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilSave, cilPencil, cilX } from '@coreui/icons'
import { 
  searchStudentBySRN, getFeeSelectStudent, getStudentProfile, 
  getAdministrationDetails, getStudentDetails, updateStudentDetails,
  getNationalities, getMotherTongues, getCasteCategories, 
  getSubCategories, getReligions, getParentDetails, insertParentDetails,
  getAddressDetails, submitAddressDetails, getCountries,
  getStatesByCountry, getDistrictsByState, getAreasByDistrict,
  getLastSchoolDetails, insertLastSchoolDetails, getSchoolMasterDropdown,
  insertSchoolDetails, getPreviousSchoolDetails, insertPreviousSchoolDetails,
  getSiblings, addSibling, getBestFriend, addBestFriend,
  getMedicalDetails, insertMedicalDetails, updateMedicalDetails,
  getTransportDetails, insertTransportDetails, updateTransportDetails,
  getTransportRoutes, getTransportStops, getFeeCategories, getDesignations,
  getProfessions, getIncomeRanges,
  getAdministrationById,
  getOrganizations, getCollegesByOrganization, getBranchesByCollege,
  getCourseTypesByCollege, getUniversitiesByCourseType, getBatchesByUniversity,
  getCoursesByBatch, getSectionsByCourse, getFinancialYears, getAdmissionCategories
} from '../api/api'
import { useToast } from '../components'

const UpdateStudentProfile = ({ studentIdProp }) => {
  const { pushToast } = useToast()
  const [activeTab, setActiveTab] = useState('administration')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [searchResult, setSearchResult] = useState(null)
  const [studentDetails, setStudentDetails] = useState(null)
  const [profileData, setProfileData] = useState(null)
  const [adminDetails, setAdminDetails] = useState(null)
  const [personalDetails, setPersonalDetails] = useState(null)
  const [parentDetails, setParentDetails] = useState(null)
  const [addressDetails, setAddressDetails] = useState(null)
  const [lastSchoolDetails, setLastSchoolDetails] = useState(null)
  const [previousSchoolDetails, setPreviousSchoolDetails] = useState([])
  const [siblings, setSiblings] = useState([])
  const [bestFriends, setBestFriends] = useState([])
  const [medicalDetails, setMedicalDetails] = useState(null)
  const [transportDetails, setTransportDetails] = useState(null)
  const [saving, setSaving] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isEditingAdministration, setIsEditingAdministration] = useState(true)
  const [isEditingParent, setIsEditingParent] = useState(false)
  const [isEditingAddress, setIsEditingAddress] = useState(false)
  const [isEditingLastSchool, setIsEditingLastSchool] = useState(false)
  const [isEditingMedical, setIsEditingMedical] = useState(false)
  const [isEditingTransport, setIsEditingTransport] = useState(false)
  const [showAddSchoolModal, setShowAddSchoolModal] = useState(false)
  const [showAddPrevSchoolModal, setShowAddPrevSchoolModal] = useState(false)
  const [showAddSiblingModal, setShowAddSiblingModal] = useState(false)
  const [showAddBestFriendModal, setShowAddBestFriendModal] = useState(false)
  const [editingPrevSchoolIndex, setEditingPrevSchoolIndex] = useState(null)
  const [editingSiblingIndex, setEditingSiblingIndex] = useState(null)
  const [editingBestFriendIndex, setEditingBestFriendIndex] = useState(null)
  const [schools, setSchools] = useState([])
  
  // Dropdown data
  const [feeCategories, setFeeCategories] = useState([])
  const [designations, setDesignations] = useState([])
  const [professions, setProfessions] = useState([])
  const [incomeRanges, setIncomeRanges] = useState([])
  const [nationalities, setNationalities] = useState([])
  const [motherTongues, setMotherTongues] = useState([])
  const [categories, setCategories] = useState([])
  const [religions, setReligions] = useState([])
  const [subCategories, setSubCategories] = useState([])
  const [countries, setCountries] = useState([])
  const [transportRoutes, setTransportRoutes] = useState([])
  const [transportStops, setTransportStops] = useState([])
  // Masters for Administration cascading (IDs)
  const [organizations, setOrganizations] = useState([])
  const [colleges, setColleges] = useState([])
  const [branches, setBranches] = useState([])
  const [courseTypes, setCourseTypes] = useState([])
  const [universities, setUniversities] = useState([])
  const [batches, setBatches] = useState([])
  const [courses, setCourses] = useState([])
  const [sections, setSections] = useState([])
  const [financialYears, setFinancialYears] = useState([])
  const [admissionCategories, setAdmissionCategories] = useState([])
  const [pStates, setPStates] = useState([])
  const [pDistricts, setPDistricts] = useState([])
  const [pAreas, setPAreas] = useState([])
  const [cStates, setCStates] = useState([])
  const [cDistricts, setCDistricts] = useState([])
  const [cAreas, setCAreas] = useState([])
  const [gStates, setGStates] = useState([])
  const [gDistricts, setGDistricts] = useState([])
  const [gAreas, setGAreas] = useState([])
  
  // Form data for personal details
  const [formData, setFormData] = useState({
    emailId: '',
    gender: '',
    dateOfBirth: '',
    nationality: '',
    birthplace: '',
    motherTongue: '',
    category: '',
    subCategory: '',
    minority: '',
    religion: '',
    bloodGroup: '',
    adharCardNumber: '',
    domicile: '',
    panNo: ''
  })
  
  // Form data for parent details
  const [parentFormData, setParentFormData] = useState({
    fatherName: '',
    fatherMobileAdmission: '',
    fatherContactNo: '',
    fatherEmailId: '',
    fatherAdharNo: '',
    fatherQualification: '',
    fatherProfession: '',
    fatherCompanyName: '',
    fatherOfficeAddress: '',
    fatherDesignation: '',
    familyIncome: '',
    motherName: '',
    motherContactNo: '',
    motherMobileAdmission: '',
    motherEmailId: '',
    motherQualification: '',
    motherProfession: '',
    motherOfficeAddress: '',
    guardianName: '',
    guardianMobileAdmission: '',
    guardianMobileNo: '',
    guardianEmailId: '',
    relationWithStudent: '',
    spouseName: '',
    spouseContactNo: '',
    spouseMobileAdmission: '',
    spouseEmailId: '',
    spouseQualification: '',
    spouseProfession: '',
    spouseOfficeAddress: ''
  })
  
  // Form data for address details
  const [addressFormData, setAddressFormData] = useState({
    pCountry: '',
    pState: '',
    pDistrict: '',
    pArea: '',
    pPincode: '',
    pAddress: '',
    cCountry: '',
    cState: '',
    cDistrict: '',
    cArea: '',
    cPincode: '',
    cAddress: '',
    gCountry: '',
    gState: '',
    gDistrict: '',
    gArea: '',
    gPincode: '',
    gAddress: ''
  })
  
  // Form data for last school details
  const [lastSchoolFormData, setLastSchoolFormData] = useState({
    schoolId: '',
    schoolCollegeName: '',
    principalName: '',
    principalMobile: '',
    principalEmail: '',
    bestSchoolTeacherName: '',
    bestSchoolTeacherMobile: '',
    bestSchoolTeacherEmail: '',
    bestCoachingTeacherName: '',
    bestCoachingTeacherMobile: '',
    bestCoachingTeacherEmail: ''
  })
  
  // Form data for new school
  const [newSchoolData, setNewSchoolData] = useState({
    schoolCollegeName: '',
    country: '',
    state: '',
    district: '',
    area: '',
    pincode: '',
    contactNo: '',
    emailID: '',
    website: ''
  })
  
  // Form data for previous school details
  const [prevSchoolFormData, setPrevSchoolFormData] = useState({
    schoolId: '',
    schoolName: '',
    educationBoard: '',
    mediumOfInstruction: '',
    tcNumber: '',
    rollNumber: '',
    passingYear: '',
    lastClassPassed: '',
    totalMarks: '',
    obtainedMarks: '',
    percentageOrCGPA: '',
    reasonForChange: ''
  })
  
  // Form data for sibling details
  const [siblingFormData, setSiblingFormData] = useState({
    siblingStudentId: '',
    relationship: ''
  })
  
  // Form data for best friend details
  const [bestFriendFormData, setBestFriendFormData] = useState({
    friendId: '',
    friendName: '',
    friendMobile: ''
  })
  
  // Form data for medical details
  const [medicalFormData, setMedicalFormData] = useState({
    height: '',
    weight: '',
    bloodGroup: ''
  })
  
  // Form data for transport details
  const [transportFormData, setTransportFormData] = useState({
    transportYesNo: false,
    routeId: '',
    stopId: ''
  })

  // Administration editable form state (mirrors Registration fields labels)
  const [adminEditData, setAdminEditData] = useState({
    dateOfAdmission: '',
    feeCategory: '', // Id
    organizationName: '', // Id
    collegeName: '', // Id
    branch: '', // Id
    courseType: '', // Id
    university: '', // Id
    financialYear: '', // Id
    course: '', // Id
    batch: '', // Id
    section: '', // Id
    studentName: '',
    studentRegistrationNumber: '',
    studentUniversityNumber: '',
    mobileNumber1: '',
    mobileNumber2: '',
    mobileNumber3: '',
    admissionNo: '',
    adminFatherName: '',
    adminMotherName: '',
    emailId: ''
  })

  // Store raw IDs response for administration
  const [adminIds, setAdminIds] = useState(null)

  // Helper to safely iterate possibly non-array responses
  const asArray = (val) => (Array.isArray(val) ? val : [])

  // Preload cascading masters based on fetched IDs
  useEffect(() => {
    const preload = async () => {
      if (!adminIds) return
      try {
        // Organization -> Colleges
        if (adminIds.OrganizationId) {
          const cols = await getCollegesByOrganization(adminIds.OrganizationId)
          setColleges(cols || [])
        }
        // College -> Branches, Course Types
        if (adminIds.CollegeId) {
          const [brs, cts] = await Promise.all([
            getBranchesByCollege(adminIds.CollegeId).catch(() => []),
            getCourseTypesByCollege(adminIds.CollegeId).catch(() => [])
          ])
          setBranches(brs || [])
          setCourseTypes(cts || [])
        }
        // CourseType -> Universities
        if (adminIds.CourseTypeId) {
          const unis = await getUniversitiesByCourseType(adminIds.CourseTypeId).catch(() => [])
          setUniversities(unis || [])
        }
        // Batches depend on CourseType + University
        if (adminIds.CourseTypeId && adminIds.UniversityId) {
          const bats = await getBatchesByUniversity(adminIds.CourseTypeId, adminIds.UniversityId).catch(() => [])
          setBatches(bats || [])
        }
        // Courses depend on CourseType + University + Batch
        if (adminIds.CourseTypeId && adminIds.UniversityId && adminIds.BatchId) {
          const crs = await getCoursesByBatch(adminIds.CourseTypeId, adminIds.UniversityId, adminIds.BatchId).catch(() => [])
          setCourses(crs || [])
        }
        // Sections depend on CourseType + University + Batch + Course
        if (adminIds.CourseTypeId && adminIds.UniversityId && adminIds.BatchId && adminIds.CourseId) {
          const secs = await getSectionsByCourse(adminIds.CourseTypeId, adminIds.UniversityId, adminIds.BatchId, adminIds.CourseId).catch(() => [])
          setSections(secs || [])
        }
      } catch (e) {
        console.error('Error preloading administration cascades:', e)
      }
    }
    preload()
  }, [adminIds])

  // Auto-select first available options if IDs are not present
  useEffect(() => {
    if (!adminEditData.organizationName && asArray(organizations).length > 0) {
      setAdminEditData(prev => ({ ...prev, organizationName: String((organizations[0].organizationid || organizations[0].Id)) }))
    }
  }, [organizations])
  useEffect(() => {
    if (!adminEditData.collegeName && asArray(colleges).length > 0) {
      setAdminEditData(prev => ({ ...prev, collegeName: String((colleges[0].CollegeId || colleges[0].Id)) }))
    }
  }, [colleges])
  useEffect(() => {
    if (!adminEditData.branch && asArray(branches).length > 0) {
      setAdminEditData(prev => ({ ...prev, branch: String((branches[0].BranchId || branches[0].Id)) }))
    }
  }, [branches])
  useEffect(() => {
    if (!adminEditData.courseType && asArray(courseTypes).length > 0) {
      setAdminEditData(prev => ({ ...prev, courseType: String((courseTypes[0].CourseTypeId || courseTypes[0].Id)) }))
    }
  }, [courseTypes])
  useEffect(() => {
    if (!adminEditData.university && asArray(universities).length > 0) {
      setAdminEditData(prev => ({ ...prev, university: String((universities[0].UniversityId || universities[0].Id)) }))
    }
  }, [universities])
  useEffect(() => {
    if (!adminEditData.batch && asArray(batches).length > 0) {
      setAdminEditData(prev => ({ ...prev, batch: String((batches[0].BatchId || batches[0].Id)) }))
    }
  }, [batches])
  useEffect(() => {
    if (!adminEditData.course && asArray(courses).length > 0) {
      setAdminEditData(prev => ({ ...prev, course: String((courses[0].CourseId || courses[0].Id)) }))
    }
  }, [courses])
  useEffect(() => {
    if (!adminEditData.section && asArray(sections).length > 0) {
      setAdminEditData(prev => ({ ...prev, section: String((sections[0].SemesterId || sections[0].Id)) }))
    }
  }, [sections])
  useEffect(() => {
    if (!adminEditData.feeCategory && asArray(feeCategories).length > 0) {
      setAdminEditData(prev => ({ ...prev, feeCategory: String(feeCategories[0].Id) }))
    }
  }, [feeCategories])
  useEffect(() => {
    if (!adminEditData.financialYear && asArray(financialYears).length > 0) {
      setAdminEditData(prev => ({ ...prev, financialYear: String(financialYears[0].Id) }))
    }
  }, [financialYears])
  useEffect(() => {
    if (!adminEditData.admissionCategory && asArray(admissionCategories).length > 0) {
      setAdminEditData(prev => ({ ...prev, admissionCategory: String(admissionCategories[0].Id) }))
    }
  }, [admissionCategories])

  // Cascading effects when user changes selections in edit form
  useEffect(() => {
    if (!adminEditData.organizationName) { setColleges([]); return }
    getCollegesByOrganization(adminEditData.organizationName)
      .then(setColleges)
      .catch(() => setColleges([]))
  }, [adminEditData.organizationName])

  useEffect(() => {
    if (!adminEditData.collegeName) { setBranches([]); setCourseTypes([]); return }
    Promise.all([
      getBranchesByCollege(adminEditData.collegeName).catch(() => []),
      getCourseTypesByCollege(adminEditData.collegeName).catch(() => [])
    ]).then(([brs, cts]) => { setBranches(brs || []); setCourseTypes(cts || []) })
  }, [adminEditData.collegeName])

  useEffect(() => {
    if (!adminEditData.courseType) { setUniversities([]); return }
    getUniversitiesByCourseType(adminEditData.courseType)
      .then(setUniversities)
      .catch(() => setUniversities([]))
  }, [adminEditData.courseType])

  useEffect(() => {
    if (!adminEditData.courseType || !adminEditData.university) { setBatches([]); return }
    getBatchesByUniversity(adminEditData.courseType, adminEditData.university)
      .then(setBatches)
      .catch(() => setBatches([]))
  }, [adminEditData.courseType, adminEditData.university])

  useEffect(() => {
    if (!adminEditData.courseType || !adminEditData.university || !adminEditData.batch) { setCourses([]); return }
    getCoursesByBatch(adminEditData.courseType, adminEditData.university, adminEditData.batch)
      .then(setCourses)
      .catch(() => setCourses([]))
  }, [adminEditData.courseType, adminEditData.university, adminEditData.batch])

  useEffect(() => {
    if (!adminEditData.courseType || !adminEditData.university || !adminEditData.batch || !adminEditData.course) { setSections([]); return }
    getSectionsByCourse(adminEditData.courseType, adminEditData.university, adminEditData.batch, adminEditData.course)
      .then(setSections)
      .catch(() => setSections([]))
  }, [adminEditData.courseType, adminEditData.university, adminEditData.batch, adminEditData.course])

  const handleAdminEditChange = (e) => {
    const { name, value } = e.target
    setAdminEditData(prev => ({ ...prev, [name]: value }))
  }

  const handleAdminEditStart = () => {
    if (adminIds) {
      setAdminEditData({
        dateOfAdmission: adminIds.DateOfAdmission ? String(adminIds.DateOfAdmission).slice(0,10) : '',
        feeCategory: adminIds.FeeCategoryId?.toString() || '',
        organizationName: adminIds.OrganizationId?.toString() || '',
        collegeName: adminIds.CollegeId?.toString() || '',
        branch: adminIds.BranchId?.toString() || '',
        courseType: adminIds.CourseTypeId?.toString() || '',
        university: adminIds.UniversityId?.toString() || '',
        financialYear: adminIds.FinancialYearId?.toString() || '',
        course: adminIds.CourseId?.toString() || '',
        batch: adminIds.BatchId?.toString() || '',
        section: adminIds.SectionId?.toString() || '',
        studentName: [adminIds.FirstName, adminIds.MiddleName, adminIds.LastName].filter(Boolean).join(' ').trim(),
        studentRegistrationNumber: adminIds.StudentUniqueId || '',
        studentUniversityNumber: adminIds.StudentUniversityNumber || '',
        mobileNumber1: adminIds.MobileNo1 || adminIds.MobileNo || '',
        mobileNumber2: adminIds.MobileNo2 || '',
        mobileNumber3: adminIds.MobileNo3 || '',
        admissionNo: adminIds.AdmissionNo || ''
      })
    } else if (adminDetails) {
      setAdminEditData({
        dateOfAdmission: adminDetails.DateOfAdmission ? String(adminDetails.DateOfAdmission).slice(0,10) : '',
        feeCategory: '',
        organizationName: '',
        collegeName: '',
        branch: '',
        courseType: '',
        university: '',
        financialYear: '',
        course: '',
        batch: '',
        section: '',
        studentName: adminDetails.StudentName || '',
        studentRegistrationNumber: adminDetails.StudentRegistrationNumber || '',
        studentUniversityNumber: adminDetails.StudentUniversityNumber || '',
        mobileNumber1: adminDetails.MobileNumber1 || '',
        mobileNumber2: adminDetails.MobileNumber2 || '',
        mobileNumber3: adminDetails.MobileNumber3 || '',
        admissionNo: adminDetails.AdmissionNo || '',
        adminFatherName: adminDetails.FatherName || '',
        adminMotherName: adminDetails.MotherName || '',
        emailId: adminDetails.CollegeEmail || ''
      })
    }
    setIsEditingAdministration(true)
  }

  const handleAdminEditCancel = () => {}

  const handleAdminEditSave = () => {
    // For now, just console all the data; change API will be wired later
    // eslint-disable-next-line no-console
    console.log('Administration update payload:', adminEditData)
    setIsEditingAdministration(false)
  }

  // Load profile data on mount
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        setLoading(true)
        
        const studentId = studentIdProp
        console.log('Student ID:', studentId)
        
        if (!studentId) {
          setError('No student ID found. Please login again.')
          return
        }

        // Fetch profile data
        try {
          const profileData = await getStudentProfile(studentId)
          console.log('Profile Data:', profileData)
          setProfileData(profileData)
        } catch (err) {
          console.error('Error loading profile data:', err)
        }

        // Fetch administration details (names)
        try {
          const adminData = await getAdministrationDetails(studentId)
          console.log('Administration Details:', adminData)
          setAdminDetails(adminData)
        } catch (err) {
          console.error('Error loading administration details:', err)
        }

        // Fetch administration details (IDs) using new endpoint
        try {
          const adminIdsRes = await getAdministrationById(studentId)
          console.log('Administration IDs:', adminIdsRes)
          const ids = adminIdsRes?.data || null
          setAdminIds(ids)
          if (ids) {
            setAdminEditData(prev => ({
              ...prev,
              dateOfAdmission: ids.DateOfAdmission ? String(ids.DateOfAdmission).slice(0,10) : '',
              feeCategory: ids.FeeCategoryId?.toString() || '',
              organizationName: ids.OrganizationId?.toString() || '',
              collegeName: ids.CollegeId?.toString() || '',
              branch: ids.BranchId?.toString() || '',
              courseType: ids.CourseTypeId?.toString() || '',
              university: ids.UniversityId?.toString() || '',
              financialYear: ids.FinancialYearId?.toString() || '',
              course: ids.CourseId?.toString() || '',
              batch: ids.BatchId?.toString() || '',
              section: ids.SectionId?.toString() || '',
              studentName: [ids.FirstName, ids.MiddleName, ids.LastName].filter(Boolean).join(' ').trim(),
              mobileNumber1: ids.MobileNo1 || ids.MobileNo || '',
              mobileNumber2: ids.MobileNo2 || '',
              mobileNumber3: ids.MobileNo3 || '',
              admissionNo: ids.AdmissionNo || '',
              adminFatherName: ids.FatherName || '',
              adminMotherName: ids.MotherName || '',
              fatherEmail: ids.FatherEmail || '',
              motherEmail: ids.MotherEmail || '',
              emailId: ids.CollegeEmail || ''
            }))
          }
        } catch (err) {
          console.error('Error loading administration IDs:', err)
        }

        // Fetch personal/student details
        try {
          const studentData = await getStudentDetails(studentId)
          console.log('Student Details:', studentData)
          setStudentDetails(studentData)
          setPersonalDetails(studentData) // Set personalDetails for the Personal tab
          if (studentData) {
            setFormData({
              emailId: studentData.EmailId || '',
              gender: studentData.Gender || '',
              dateOfBirth: studentData.DateOfBirth ? studentData.DateOfBirth.split('T')[0] : '',
              nationality: studentData.Nationality || '',
              birthplace: studentData.Birthplace || '',
              motherTongue: studentData.MotherTongue || '',
              category: studentData.Category || '',
              subCategory: studentData.SubCategory || '',
              minority: studentData.Minority || '',
              religion: studentData.Religion || '',
              bloodGroup: studentData.BloodGroup || '',
              adharCardNumber: studentData.AadharCardNumber || '',
              domicile: studentData.Domicile || '',
              panNo: studentData.PanNo || ''
            })
          }
        } catch (err) {
          console.error('Error loading student details:', err)
          setPersonalDetails(null) // Set to null so form can still be displayed
        }
        
        // Fetch parent details
        try {
          const parentData = await getParentDetails(studentId)
          console.log('Parent Details:', parentData)
          setParentDetails(parentData)
          if (parentData) {
            setParentFormData({
              fatherName: parentData.FatherName || '',
              fatherOccupation: parentData.FatherOccupation || '',
              fatherMobile: parentData.FatherMobile || '',
              fatherEmail: parentData.FatherEmail || '',
              motherName: parentData.MotherName || '',
              motherOccupation: parentData.MotherOccupation || '',
              motherMobile: parentData.MotherMobile || '',
              motherEmail: parentData.MotherEmail || '',
              guardianName: parentData.GuardianName || '',
              guardianOccupation: parentData.GuardianOccupation || '',
              guardianMobile: parentData.GuardianMobile || '',
              guardianEmail: parentData.GuardianEmail || ''
            })
          }
        } catch (err) {
          console.error('Error loading parent details:', err)
          // Set to null so form can still be displayed for adding data
          setParentDetails(null)
        }

        // Fetch address details
        try {
        const addressData = await getAddressDetails(studentId)
        console.log('Address Details:', addressData)
        setAddressDetails(addressData)
        if (addressData) {
          setAddressFormData({
            // Permanent Address mapped to form keys
            pCountry: addressData.P_Country || '',
            pState: addressData.P_State || '',
            pDistrict: addressData.P_District || '',
            pArea: addressData.P_Area || '',
            pPincode: addressData.P_Pincode || '',
            pAddress: addressData.P_Address || '',
            // Correspondence Address
            cCountry: addressData.C_Country || '',
            cState: addressData.C_State || '',
            cDistrict: addressData.C_District || '',
            cArea: addressData.C_Area || '',
            cPincode: addressData.C_Pincode || '',
            cAddress: addressData.C_Address || '',
            // Guardian Address
            gCountry: addressData.G_Country || '',
            gState: addressData.G_State || '',
            gDistrict: addressData.G_District || '',
            gArea: addressData.G_Area || '',
            gPincode: addressData.G_Pincode || '',
            gAddress: addressData.G_Address || ''
          })

          // Load states for each address type if countries are selected
          if (addressData.P_Country) {
            getStatesByCountry(addressData.P_Country)
              .then(data => setPStates(data || []))
              .catch(err => console.error('Error loading permanent states:', err))
          }
          if (addressData.C_Country) {
            getStatesByCountry(addressData.C_Country)
              .then(data => setCStates(data || []))
              .catch(err => console.error('Error loading correspondence states:', err))
          }
          if (addressData.G_Country) {
            getStatesByCountry(addressData.G_Country)
              .then(data => setGStates(data || []))
              .catch(err => console.error('Error loading guardian states:', err))
          }
        }
      } catch (err) {
        console.error('Error loading address details:', err)
        // Set to null so form can still be displayed for adding data
        setAddressDetails(null)
        }

        // Fetch dropdowns
        try {
        const [feeCatsData, desgsData, profsData, incomesData, nationalitiesData, motherTonguesData, categoriesData, religionsData, countriesData, schoolsData, routesData, orgsData, finYearsData, admCats] = await Promise.all([
          getFeeCategories().catch(err => { console.error('Error loading fee categories:', err); return []; }),
          getDesignations().catch(err => { console.error('Error loading designations:', err); return []; }),
          getProfessions().catch(err => { console.error('Error loading professions:', err); return []; }),
          getIncomeRanges().catch(err => { console.error('Error loading income ranges:', err); return []; }),
          getNationalities().catch(err => { console.error('Error loading nationalities:', err); return []; }),
          getMotherTongues().catch(err => { console.error('Error loading mother tongues:', err); return []; }),
          getCasteCategories().catch(err => { console.error('Error loading categories:', err); return []; }),
          getReligions().catch(err => { console.error('Error loading religions:', err); return []; }),
          getCountries().catch(err => { console.error('Error loading countries:', err); return []; }),
          getSchoolMasterDropdown().catch(err => { console.error('Error loading schools:', err); return []; }),
          getTransportRoutes().catch(err => { console.error('Error loading transport routes:', err); return []; }),
          getOrganizations().catch(err => { console.error('Error loading organizations:', err); return []; }),
          getFinancialYears().catch(err => { console.error('Error loading financial years:', err); return []; }),
          getAdmissionCategories().catch(err => { console.error('Error loading admission categories:', err); return []; })
        ])
        
        setFeeCategories(feeCatsData || [])
        setDesignations(desgsData || [])
        setProfessions(profsData || [])
        setIncomeRanges(incomesData || [])
        setNationalities(nationalitiesData || [])
        setMotherTongues(motherTonguesData || [])
        setCategories(categoriesData || [])
        setReligions(religionsData || [])
        setCountries(countriesData || [])
        setSchools(schoolsData || [])
        setTransportRoutes(routesData || [])
        setOrganizations(orgsData || [])
        setFinancialYears(finYearsData || [])
        setAdmissionCategories(admCats || [])
        
        // Fetch last school details
        try {
          const lastSchoolData = await getLastSchoolDetails(studentId)
          console.log('Last School Details:', lastSchoolData)
          setLastSchoolDetails(lastSchoolData)
          if (lastSchoolData && lastSchoolData.length > 0) {
            // Find school ID from school name
            const schoolId = schoolsData?.find(s => s.SchoolCollegeName === lastSchoolData[0].SchoolCollegeName)?.SchoolID || ''
            setLastSchoolFormData({
              schoolId: schoolId,
              schoolCollegeName: lastSchoolData[0].SchoolCollegeName || '',
              principalName: lastSchoolData[0].PrincipalName || '',
              principalMobile: lastSchoolData[0].PrincipalMobile || '',
              principalEmail: lastSchoolData[0].PrincipalEmail || '',
              bestSchoolTeacherName: lastSchoolData[0].BestSchoolTeacherName || '',
              bestSchoolTeacherMobile: lastSchoolData[0].BestSchoolTeacherMobile || '',
              bestSchoolTeacherEmail: lastSchoolData[0].BestSchoolTeacherEmail || '',
              bestCoachingTeacherName: lastSchoolData[0].BestCoachingTeacherName || '',
              bestCoachingTeacherMobile: lastSchoolData[0].BestCoachingTeacherMobile || '',
              bestCoachingTeacherEmail: lastSchoolData[0].BestCoachingTeacherEmail || ''
            })
          }
        } catch (err) {
          console.error('Error loading last school details:', err)
          // Set to null so form can still be displayed for adding data
          setLastSchoolDetails(null)
        }
      } catch (err) {
        console.error('Error loading dropdown data:', err)
        }
        
        // Fetch previous school details
        try {
        const prevSchoolData = await getPreviousSchoolDetails(studentId)
        console.log('Previous School Details:', prevSchoolData)
        setPreviousSchoolDetails(prevSchoolData || [])
      } catch (err) {
        console.error('Error loading previous school details:', err)
        // Set to empty array so "Add" button still works
        setPreviousSchoolDetails([])
        }
        
        // Fetch siblings
        try {
        const siblingsData = await getSiblings(studentId)
        console.log('Siblings:', siblingsData)
        setSiblings(siblingsData || [])
      } catch (err) {
        console.error('Error loading siblings:', err)
        // Set to empty array so "Add" button still works
        setSiblings([])
        }
        
        // Fetch best friends
        try {
        const bestFriendsData = await getBestFriend(studentId)
        console.log('Best Friends:', bestFriendsData)
        setBestFriends(bestFriendsData || [])
      } catch (err) {
        console.error('Error loading best friends:', err)
        // Set to empty array so "Add" button still works
        setBestFriends([])
        }
        
        // Fetch medical details
        try {
        const medicalData = await getMedicalDetails(studentId)
        console.log('Medical Details:', medicalData)
        setMedicalDetails(medicalData)
        if (medicalData) {
          setMedicalFormData({
            height: medicalData.Height || '',
            weight: medicalData.Weight || '',
            bloodGroup: medicalData.BloodGroup || ''
          })
        }
      } catch (err) {
        console.error('Error loading medical details:', err)
        // If 404 or any error, set medical details to null so "Add Details" button shows
        setMedicalDetails(null)
        }
        
        // Fetch transport details
        try {
        const transportData = await getTransportDetails(studentId)
        console.log('Transport Details:', transportData)
        setTransportDetails(transportData)
        if (transportData) {
          setTransportFormData({
            transportYesNo: transportData.Transport_Yes_No || false,
            routeId: transportData.RouteId || '',
            stopId: transportData.StopId || ''
          })
          // Load stops for the selected route
          if (transportData.RouteId) {
            getTransportStops(transportData.RouteId)
              .then(data => setTransportStops(data || []))
              .catch(err => console.error('Error loading transport stops:', err))
          }
        }
      } catch (err) {
        console.error('Error loading transport details:', err)
        // If 404 or any error, set transport details to null so "Add Details" button shows
        setTransportDetails(null)
        }
      } catch (error) {
        console.error('Critical error loading profile data:', error)
        setError('An unexpected error occurred while loading your profile.')
      } finally {
        // Always set loading to false, even if there's an error
        setLoading(false)
      }
    }

    loadProfileData()
  }, [studentIdProp])

  // Load sub-categories when category changes
  // useEffect(() => {
  //   if (formData.category) {
  //     getSubCategories(formData.category)
  //       .then(data => setSubCategories(data || []))
  //       .catch(err => console.error('Error loading sub-categories:', err))
  //   } else {
  //     setSubCategories([])
  //   }
  // }, [formData.category])

  const handleLoadSubCategories = () => {
  getSubCategories() 
    .then(data => setSubCategories(data || []))
    .catch(err => console.error('Error loading sub-categories:', err));
};
  // Load Permanent Address cascading dropdowns
  useEffect(() => {
    if (addressFormData.pCountry) {
      getStatesByCountry(addressFormData.pCountry)
        .then(data => setPStates(data || []))
        .catch(err => console.error('Error loading P states:', err))
    } else {
      setPStates([])
    }
  }, [addressFormData.pCountry])

  useEffect(() => {
    if (addressFormData.pState) {
      getDistrictsByState(addressFormData.pState)
        .then(data => setPDistricts(data || []))
        .catch(err => console.error('Error loading P districts:', err))
    } else {
      setPDistricts([])
    }
  }, [addressFormData.pState])

  useEffect(() => {
    if (addressFormData.pDistrict) {
      getAreasByDistrict(addressFormData.pDistrict)
        .then(data => setPAreas(data || []))
        .catch(err => console.error('Error loading P areas:', err))
    } else {
      setPAreas([])
    }
  }, [addressFormData.pDistrict])

  // Load Correspondence Address cascading dropdowns
  useEffect(() => {
    if (addressFormData.cCountry) {
      getStatesByCountry(addressFormData.cCountry)
        .then(data => setCStates(data || []))
        .catch(err => console.error('Error loading C states:', err))
    } else {
      setCStates([])
    }
  }, [addressFormData.cCountry])

  useEffect(() => {
    if (addressFormData.cState) {
      getDistrictsByState(addressFormData.cState)
        .then(data => setCDistricts(data || []))
        .catch(err => console.error('Error loading C districts:', err))
    } else {
      setCDistricts([])
    }
  }, [addressFormData.cState])

  useEffect(() => {
    if (addressFormData.cDistrict) {
      getAreasByDistrict(addressFormData.cDistrict)
        .then(data => setCAreas(data || []))
        .catch(err => console.error('Error loading C areas:', err))
    } else {
      setCAreas([])
    }
  }, [addressFormData.cDistrict])

  // Load Guardian Address cascading dropdowns
  useEffect(() => {
    if (addressFormData.gCountry) {
      getStatesByCountry(addressFormData.gCountry)
        .then(data => setGStates(data || []))
        .catch(err => console.error('Error loading G states:', err))
    } else {
      setGStates([])
    }
  }, [addressFormData.gCountry])

  useEffect(() => {
    if (addressFormData.gState) {
      getDistrictsByState(addressFormData.gState)
        .then(data => setGDistricts(data || []))
        .catch(err => console.error('Error loading G districts:', err))
    } else {
      setGDistricts([])
    }
  }, [addressFormData.gState])

  useEffect(() => {
    if (addressFormData.gDistrict) {
      getAreasByDistrict(addressFormData.gDistrict)
        .then(data => setGAreas(data || []))
        .catch(err => console.error('Error loading G areas:', err))
    } else {
      setGAreas([])
    }
  }, [addressFormData.gDistrict])

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleParentChange = (e) => {
    const { name, value } = e.target
    setParentFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleEditClick = () => {
    setIsEditing(true)
    setError('')
    setSuccess('')
  }

  const handleCancelEdit = () => {
    // Restore original data
    if (personalDetails) {
      setFormData({
        emailId: personalDetails.EmailId || '',
        gender: personalDetails.Gender || '',
        dateOfBirth: personalDetails.DateOfBirth ? personalDetails.DateOfBirth.split('T')[0] : '',
        nationality: personalDetails.Nationality || '',
        birthplace: personalDetails.Birthplace || '',
        motherTongue: personalDetails.MotherTongue || '',
        category: personalDetails.Category || '',
        subCategory: personalDetails.SubCategory || '',
        minority: personalDetails.Minority || '',
        religion: personalDetails.Religion || '',
        bloodGroup: personalDetails.BloodGroup || '',
        adharCardNumber: personalDetails.AadharCardNumber || '',
        domicile: personalDetails.Domicile || '',
        panNo: personalDetails.PanNo || ''
      })
    }
    setIsEditing(false)
    setError('')
    setSuccess('')
  }

  const handleSavePersonalDetails = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')
    
    try {
      const studentId = studentIdProp
      
      const payload = {
        StudentId: parseInt(studentId),
        EmailId: formData.emailId || '',
        Gender: formData.gender || '',
        DateOfBirth: formData.dateOfBirth || '',
        Nationality: parseInt(formData.nationality) || 0,
        Birthplace: formData.birthplace || '',
        MotherTongue: parseInt(formData.motherTongue) || 0,
        Category: formData.category || '',
        SubCategory: formData.subCategory || '',
        Minority: formData.minority || '',
        Religion: parseInt(formData.religion) || 0,
        BloodGroup: formData.bloodGroup || '',
        AadharCardNumber: formData.adharCardNumber || '',
        Domicile: formData.domicile || '',
        PanNo: formData.panNo || ''
      }
      
      console.log('Updating student details:', payload)
      const response = await updateStudentDetails(payload)
      setSuccess(`✅ ${response.message || 'Student details updated successfully!'}`)
      pushToast({ title: 'Success', message: response.message || 'Student details updated successfully', type: 'success' })
      
      // Refresh personal details
      const updatedData = await getStudentDetails(studentId)
      setPersonalDetails(updatedData)
      
      // Exit edit mode
      setIsEditing(false)
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      console.error('Error updating details:', err)
      setError(err.response?.data?.message || err.message || 'Failed to update details.')
      pushToast({ title: 'Error', message: err.response?.data?.message || err.message || 'Failed to update details', type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const handleEditParent = () => {
    setIsEditingParent(true)
    setError('')
    setSuccess('')
  }

  const handleCancelEditParent = () => {
    // Restore original parent data
    if (parentDetails) {
      setParentFormData({
        fatherName: parentDetails.FatherName || '',
        fatherMobileAdmission: parentDetails.FatherMobile_Admission || '',
        fatherContactNo: parentDetails.FatherContactNo || '',
        fatherEmailId: parentDetails.FatherEmailId || '',
        fatherAdharNo: parentDetails.FatherAadharNo || '',
        fatherQualification: parentDetails.FatherQualification || '',
        fatherProfession: parentDetails.FatherProfession || '',
        fatherCompanyName: parentDetails.FatherCompanyName || '',
        fatherOfficeAddress: parentDetails.FatherOfficeAddress || '',
        fatherDesignation: parentDetails.FatherDesignation || '',
        familyIncome: parentDetails.FamilyIncome || '',
        motherName: parentDetails.MotherName || '',
        motherContactNo: parentDetails.MotherContactNo || '',
        motherMobileAdmission: parentDetails.MotherMobile_Admission || '',
        motherEmailId: parentDetails.MotherEmailId || '',
        motherQualification: parentDetails.MotherQualification || '',
        motherProfession: parentDetails.MotherProfession || '',
        motherOfficeAddress: parentDetails.MotherOfficeAddress || '',
        guardianName: parentDetails.GuardianName || '',
        guardianMobileAdmission: parentDetails.GuardianMobile_Admission || '',
        guardianMobileNo: parentDetails.GuardianMobileNo || '',
        guardianEmailId: parentDetails.GuardianEmailId || '',
        relationWithStudent: parentDetails.RelationWithStudent || '',
        spouseName: parentDetails.SpouseName || '',
        spouseContactNo: parentDetails.SpouseContactNo || '',
        spouseMobileAdmission: parentDetails.SpouseMObile_Admission || '',
        spouseEmailId: parentDetails.SpouseEmailId || '',
        spouseQualification: parentDetails.SpouseQualification || '',
        spouseProfession: parentDetails.SpouseProfession || '',
        spouseOfficeAddress: parentDetails.SpouseOfficeAddress || ''
      })
    }
    setIsEditingParent(false)
    setError('')
    setSuccess('')
  }

  const handleSaveParentDetails = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')
    
    try {
      const studentId = studentIdProp
      
      const payload = {
        StudentId: parseInt(studentId),
        FatherName: parentFormData.fatherName || '',
        FatherMobile_Admission: parentFormData.fatherMobileAdmission || '',
        FatherContactNo: parentFormData.fatherContactNo || '',
        FatherEmailId: parentFormData.fatherEmailId || '',
        FatherAadharNo: parentFormData.fatherAdharNo || '',
        FatherQualification: parentFormData.fatherQualification || '',
        FatherProfession: parentFormData.fatherProfession || '',
        FatherCompanyName: parentFormData.fatherCompanyName || '',
        FatherOfficeAddress: parentFormData.fatherOfficeAddress || '',
        FatherDesignation: parentFormData.fatherDesignation || '',
        FamilyIncome: parseFloat(parentFormData.familyIncome) || 0,
        MotherName: parentFormData.motherName || '',
        MotherContactNo: parentFormData.motherContactNo || '',
        MotherMobile_Admission: parentFormData.motherMobileAdmission || '',
        MotherEmailId: parentFormData.motherEmailId || '',
        MotherQualification: parentFormData.motherQualification || '',
        MotherProfession: parentFormData.motherProfession || '',
        MotherOfficeAddress: parentFormData.motherOfficeAddress || '',
        GuardianName: parentFormData.guardianName || '',
        GuardianMobile_Admission: parentFormData.guardianMobileAdmission || '',
        GuardianMobileNo: parentFormData.guardianMobileNo || '',
        GuardianEmailId: parentFormData.guardianEmailId || '',
        RelationWithStudent: parentFormData.relationWithStudent || '',
        SpouseName: parentFormData.spouseName || '',
        SpouseContactNo: parentFormData.spouseContactNo || '',
        SpouseMObile_Admission: parentFormData.spouseMobileAdmission || '',
        SpouseEmailId: parentFormData.spouseEmailId || '',
        SpouseQualification: parentFormData.spouseQualification || '',
        SpouseProfession: parentFormData.spouseProfession || '',
        SpouseOfficeAddress: parentFormData.spouseOfficeAddress || ''
      }
      
      console.log('Updating parent details:', payload)
      const response = await insertParentDetails(payload)
      setSuccess(`✅ ${response.message || 'Parent details updated successfully!'}`)
      
      // Refresh parent details
      const updatedData = await getParentDetails(studentId)
      setParentDetails(updatedData)
      
      // Exit edit mode
      setIsEditingParent(false)
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      console.error('Error updating parent details:', err)
      setError(err.response?.data?.message || err.message || 'Failed to update parent details.')
    } finally {
      setSaving(false)
    }
  }

  const handleAddressChange = (e) => {
    const { name, value } = e.target
    setAddressFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleEditAddress = () => {
    setIsEditingAddress(true)
    setError('')
    setSuccess('')
  }

  const handleCancelEditAddress = () => {
    // Restore original address data
    if (addressDetails) {
      setAddressFormData({
        pCountry: addressDetails.P_Country || '',
        pState: addressDetails.P_State || '',
        pDistrict: addressDetails.P_District || '',
        pArea: addressDetails.P_Area || '',
        pPincode: addressDetails.P_Pincode || '',
        pAddress: addressDetails.P_Address || '',
        cCountry: addressDetails.C_Country || '',
        cState: addressDetails.C_State || '',
        cDistrict: addressDetails.C_District || '',
        cArea: addressDetails.C_Area || '',
        cPincode: addressDetails.C_Pincode || '',
        cAddress: addressDetails.C_Address || '',
        gCountry: addressDetails.G_Country || '',
        gState: addressDetails.G_State || '',
        gDistrict: addressDetails.G_District || '',
        gArea: addressDetails.G_Area || '',
        gPincode: addressDetails.G_Pincode || '',
        gAddress: addressDetails.G_Address || ''
      })
    }
    setIsEditingAddress(false)
    setError('')
    setSuccess('')
  }

  const handleSaveAddressDetails = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')
    
    try {
      const studentId = studentIdProp
      
      const payload = {
        StudentId: parseInt(studentId),
        P_Country: parseInt(addressFormData.pCountry) || 0,
        P_State: parseInt(addressFormData.pState) || 0,
        P_District: parseInt(addressFormData.pDistrict) || 0,
        P_Area: parseInt(addressFormData.pArea) || 0,
        P_Pincode: addressFormData.pPincode || '',
        P_Address: addressFormData.pAddress || '',
        C_Country: parseInt(addressFormData.cCountry) || 0,
        C_State: parseInt(addressFormData.cState) || 0,
        C_District: parseInt(addressFormData.cDistrict) || 0,
        C_Area: parseInt(addressFormData.cArea) || 0,
        C_Pincode: addressFormData.cPincode || '',
        C_Address: addressFormData.cAddress || '',
        G_Country: parseInt(addressFormData.gCountry) || 0,
        G_State: parseInt(addressFormData.gState) || 0,
        G_District: parseInt(addressFormData.gDistrict) || 0,
        G_Area: parseInt(addressFormData.gArea) || 0,
        G_Pincode: addressFormData.gPincode || '',
        G_Address: addressFormData.gAddress || ''
      }
      
      console.log('Updating address details:', payload)
      const response = await submitAddressDetails(payload)
      setSuccess(`✅ ${response.message || 'Address details updated successfully!'}`)
      pushToast({ title: 'Success', message: response.message || 'Address details updated successfully', type: 'success' })
      
      // Refresh address details
      const updatedData = await getAddressDetails(studentId)
      setAddressDetails(updatedData)
      
      // Exit edit mode
      setIsEditingAddress(false)
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      console.error('Error updating address details:', err)
      setError(err.response?.data?.message || err.message || 'Failed to update address details.')
      pushToast({ title: 'Error', message: err.response?.data?.message || err.message || 'Failed to update address details', type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const handleLastSchoolChange = (e) => {
    const { name, value } = e.target
    setLastSchoolFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleEditLastSchool = () => {
    setIsEditingLastSchool(true)
    setError('')
    setSuccess('')
  }

  const handleCancelEditLastSchool = () => {
    // Restore original last school data
    if (lastSchoolDetails) {
      const schoolId = schools?.find(s => s.SchoolCollegeName === lastSchoolDetails.SchoolCollegeName)?.SchoolID || ''
      setLastSchoolFormData({
        schoolId: schoolId,
        schoolCollegeName: lastSchoolDetails.SchoolCollegeName || '',
        principalName: lastSchoolDetails.PrincipalName || '',
        principalMobile: lastSchoolDetails.PrincipalMobile || '',
        principalEmail: lastSchoolDetails.PrincipalEmail || '',
        bestSchoolTeacherName: lastSchoolDetails.BestSchoolTeacherName || '',
        bestSchoolTeacherMobile: lastSchoolDetails.BestSchoolTeacherMobile || '',
        bestSchoolTeacherEmail: lastSchoolDetails.BestSchoolTeacherEmail || '',
        bestCoachingTeacherName: lastSchoolDetails.BestCoachingTeacherName || '',
        bestCoachingTeacherMobile: lastSchoolDetails.BestCoachingTeacherMobile || '',
        bestCoachingTeacherEmail: lastSchoolDetails.BestCoachingTeacherEmail || ''
      })
    }
    setIsEditingLastSchool(false)
    setError('')
    setSuccess('')
  }

  const handleSchoolChange = (e) => {
    const value = e.target.value
    if (value === 'add_new') {
      setShowAddSchoolModal(true)
    } else {
      const selectedSchool = schools.find(s => s.SchoolID == value)
      setLastSchoolFormData(prev => ({
        ...prev,
        schoolId: value,
        schoolCollegeName: selectedSchool?.SchoolCollegeName || ''
      }))
    }
  }

  const handleNewSchoolChange = (e) => {
    const { name, value } = e.target
    setNewSchoolData(prev => ({ ...prev, [name]: value }))
  }

  const handleAddNewSchool = async () => {
    setSaving(true)
    setError('')
    
    try {
      const payload = {
        SchoolCollegeName: newSchoolData.schoolCollegeName,
        Country: newSchoolData.country,
        State: newSchoolData.state,
        District: newSchoolData.district,
        Area: newSchoolData.area,
        Pincode: newSchoolData.pincode,
        ContactNo: newSchoolData.contactNo,
        EmailID: newSchoolData.emailID,
        Website: newSchoolData.website,
        IsActive: true
      }
      
      const response = await insertSchoolDetails(payload)
      setSuccess(`✅ ${response.message || 'School added successfully!'}`)
      pushToast({ title: 'Success', message: response.message || 'School added successfully', type: 'success' })
      
      // Refresh schools list
      const updatedSchools = await getSchoolMasterDropdown()
      setSchools(updatedSchools || [])
      
      // Find the newly added school and set it
      const newSchool = updatedSchools.find(s => s.SchoolCollegeName === newSchoolData.schoolCollegeName)
      if (newSchool) {
        setLastSchoolFormData(prev => ({
          ...prev,
          schoolId: newSchool.SchoolID,
          schoolCollegeName: newSchool.SchoolCollegeName
        }))
      }
      
      // Close modal and reset form
      setShowAddSchoolModal(false)
      setNewSchoolData({
        schoolCollegeName: '',
        country: '',
        state: '',
        district: '',
        area: '',
        pincode: '',
        contactNo: '',
        emailID: '',
        website: ''
      })
      
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      console.error('Error adding school:', err)
      setError(err.response?.data?.message || err.message || 'Failed to add school.')
      pushToast({ title: 'Error', message: err.response?.data?.message || err.message || 'Failed to add school', type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const handleSaveLastSchoolDetails = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')
    
    try {
      const studentId = studentIdProp
      
      const payload = {
        StudentId: parseInt(studentId),
        SchoolID: parseInt(lastSchoolFormData.schoolId) || 0,
        SchoolCollegeName: lastSchoolFormData.schoolId || '', // Save the ID instead of name
        PrincipalName: lastSchoolFormData.principalName || '',
        PrincipalMobile: lastSchoolFormData.principalMobile || '',
        PrincipalEmail: lastSchoolFormData.principalEmail || '',
        BestSchoolTeacherName: lastSchoolFormData.bestSchoolTeacherName || '',
        BestSchoolTeacherMobile: lastSchoolFormData.bestSchoolTeacherMobile || '',
        BestSchoolTeacherEmail: lastSchoolFormData.bestSchoolTeacherEmail || '',
        BestCoachingTeacherName: lastSchoolFormData.bestCoachingTeacherName || '',
        BestCoachingTeacherMobile: lastSchoolFormData.bestCoachingTeacherMobile || '',
        BestCoachingTeacherEmail: lastSchoolFormData.bestCoachingTeacherEmail || ''
      }
      
      console.log('Updating last school details:', payload)
      const response = await insertLastSchoolDetails(payload)
      setSuccess(`✅ ${response.message || 'Last school details updated successfully!'}`)
      pushToast({ title: 'Success', message: response.message || 'Last school details updated successfully', type: 'success' })
      
      // Refresh last school details
      const updatedData = await getLastSchoolDetails(studentId)
      if (updatedData && updatedData.length > 0) {
        setLastSchoolDetails(updatedData[0])
      }
      
      // Exit edit mode
      setIsEditingLastSchool(false)
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      console.error('Error updating last school details:', err)
      setError(err.response?.data?.message || err.message || 'Failed to update last school details.')
      pushToast({ title: 'Error', message: err.response?.data?.message || err.message || 'Failed to update last school details', type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const handlePrevSchoolChange = (e) => {
    const { name, value } = e.target
    setPrevSchoolFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleAddPrevSchool = () => {
    setPrevSchoolFormData({
      schoolId: '',
      schoolName: '',
      educationBoard: '',
      mediumOfInstruction: '',
      tcNumber: '',
      rollNumber: '',
      passingYear: '',
      lastClassPassed: '',
      totalMarks: '',
      obtainedMarks: '',
      percentageOrCGPA: '',
      reasonForChange: ''
    })
    setEditingPrevSchoolIndex(null)
    setShowAddPrevSchoolModal(true)
  }

  const handleEditPrevSchool = (index) => {
    const school = previousSchoolDetails[index]
    // Find school ID from school name
    const schoolId = schools?.find(s => s.SchoolCollegeName === school.SchoolName)?.SchoolID || school.SchoolName || ''
    setPrevSchoolFormData({
      schoolId: schoolId,
      schoolName: school.SchoolName || '',
      educationBoard: school.EducationBoard || '',
      mediumOfInstruction: school.MediumOfInstruction || '',
      tcNumber: school.TCNumber || '',
      rollNumber: school.RollNumber || '',
      passingYear: school.PassingYear || '',
      lastClassPassed: school.LastClassPassed || '',
      totalMarks: school.TotalMarks || '',
      obtainedMarks: school.ObtainedMarks || '',
      percentageOrCGPA: school.PercentageOrCGPA || '',
      reasonForChange: school.ReasonForChange || ''
    })
    setEditingPrevSchoolIndex(index)
    setShowAddPrevSchoolModal(true)
  }

  const handlePrevSchoolSelectChange = (e) => {
    const value = e.target.value
    if (value === 'add_new') {
      setShowAddSchoolModal(true)
    } else {
      const selectedSchool = schools.find(s => s.SchoolID == value)
      setPrevSchoolFormData(prev => ({
        ...prev,
        schoolId: value,
        schoolName: selectedSchool?.SchoolCollegeName || ''
      }))
    }
  }

  const handleSavePrevSchool = async () => {
    setSaving(true)
    setError('')
    setSuccess('')
    
    try {
      const studentId = studentIdProp
      
      const payload = {
        UniqueId: 0,
        StudentId: parseInt(studentId),
        SchoolName: prevSchoolFormData.schoolId || '', // Save the ID instead of name
        EducationBoard: prevSchoolFormData.educationBoard || '',
        MediumOfInstruction: prevSchoolFormData.mediumOfInstruction || '',
        TCNumber: prevSchoolFormData.tcNumber || '',
        RollNumber: prevSchoolFormData.rollNumber || '',
        PassingYear: parseInt(prevSchoolFormData.passingYear) || 0,
        LastClassPassed: prevSchoolFormData.lastClassPassed || '',
        TotalMarks: parseFloat(prevSchoolFormData.totalMarks) || 0,
        ObtainedMarks: parseFloat(prevSchoolFormData.obtainedMarks) || 0,
        PercentageOrCGPA: prevSchoolFormData.percentageOrCGPA || '',
        ReasonForChange: prevSchoolFormData.reasonForChange || ''
      }
      
      if (editingPrevSchoolIndex !== null) {
        // Update mode - just console log for now
        console.log('UPDATE Previous School Details (not implemented):', payload)
        setSuccess('✅ Update functionality will be implemented soon (data logged to console)')
        pushToast({ title: 'Success', message: 'Updated previous school (mock). Data logged to console.', type: 'success' })
      } else {
        // Insert mode
        console.log('INSERT Previous School Details:', payload)
        const response = await insertPreviousSchoolDetails(payload)
        setSuccess(`✅ ${response.message || 'Previous school details added successfully!'}`)
        pushToast({ title: 'Success', message: response.message || 'Previous school details added successfully', type: 'success' })
        
        // Refresh previous school details
        const updatedData = await getPreviousSchoolDetails(studentId)
        setPreviousSchoolDetails(updatedData || [])
      }
      
      // Close modal and reset form
      setShowAddPrevSchoolModal(false)
      setPrevSchoolFormData({
        schoolId: '',
        schoolName: '',
        educationBoard: '',
        mediumOfInstruction: '',
        tcNumber: '',
        rollNumber: '',
        passingYear: '',
        lastClassPassed: '',
        totalMarks: '',
        obtainedMarks: '',
        percentageOrCGPA: '',
        reasonForChange: ''
      })
      setEditingPrevSchoolIndex(null)
      
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      console.error('Error saving previous school details:', err)
      setError(err.response?.data?.message || err.message || 'Failed to save previous school details.')
      pushToast({ title: 'Error', message: err.response?.data?.message || err.message || 'Failed to save previous school details', type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const handleSiblingChange = (e) => {
    const { name, value } = e.target
    setSiblingFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleAddSibling = () => {
    setSiblingFormData({
      siblingStudentId: '',
      relationship: ''
    })
    setEditingSiblingIndex(null)
    setShowAddSiblingModal(true)
  }

  const handleEditSibling = (index) => {
    const sibling = siblings[index]
    setSiblingFormData({
      siblingStudentId: sibling.SiblingStudentId || '',
      relationship: sibling.Relationship || ''
    })
    setEditingSiblingIndex(index)
    setShowAddSiblingModal(true)
  }

  const handleSaveSibling = async () => {
    setSaving(true)
    setError('')
    setSuccess('')
    
    try {
      const studentId = studentIdProp
      
      const payload = {
        UniqueId: editingSiblingIndex !== null ? siblings[editingSiblingIndex].UniqueId : 0,
        StudentId: parseInt(studentId),
        SiblingStudentId: parseInt(siblingFormData.siblingStudentId) || 0,
        Relationship: siblingFormData.relationship || ''
      }
      
      if (editingSiblingIndex !== null) {
        // Update mode - just console log for now
        console.log('UPDATE Sibling (not implemented):', payload)
        setSuccess('✅ Update functionality will be implemented soon (data logged to console)')
        pushToast({ title: 'Success', message: 'Updated sibling (mock). Data logged to console.', type: 'success' })
      } else {
        // Insert mode
        console.log('INSERT Sibling:', payload)
        const response = await addSibling(payload)
        setSuccess(`✅ ${response.message || 'Sibling added successfully!'}`)
        pushToast({ title: 'Success', message: response.message || 'Sibling added successfully', type: 'success' })
        
        // Refresh siblings
        const updatedData = await getSiblings(studentId)
        setSiblings(updatedData || [])
      }
      
      // Close modal and reset form
      setShowAddSiblingModal(false)
      setSiblingFormData({
        siblingStudentId: '',
        relationship: ''
      })
      setEditingSiblingIndex(null)
      
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      console.error('Error saving sibling:', err)
      setError(err.response?.data?.message || err.message || 'Failed to save sibling.')
      pushToast({ title: 'Error', message: err.response?.data?.message || err.message || 'Failed to save sibling', type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const handleBestFriendChange = (e) => {
    const { name, value } = e.target
    setBestFriendFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleAddBestFriend = () => {
    setBestFriendFormData({
      friendId: '',
      friendName: '',
      friendMobile: ''
    })
    setEditingBestFriendIndex(null)
    setShowAddBestFriendModal(true)
  }

  const handleEditBestFriend = (index) => {
    const friend = bestFriends[index]
    setBestFriendFormData({
      friendId: friend.FriendId || '',
      friendName: friend.Best_F_Name1 || '',
      friendMobile: friend.Best_F_Mobile1 || ''
    })
    setEditingBestFriendIndex(index)
    setShowAddBestFriendModal(true)
  }

  const handleSaveBestFriend = async () => {
    setSaving(true)
    setError('')
    setSuccess('')
    
    try {
      const studentId = studentIdProp
      
      const payload = {
        Id: editingBestFriendIndex !== null ? bestFriends[editingBestFriendIndex].Id : 0,
        StudentId: parseInt(studentId),
        FriendId: parseInt(bestFriendFormData.friendId) || 0,
        Best_F_Name1: bestFriendFormData.friendName || '',
        Best_F_Mobile1: bestFriendFormData.friendMobile || ''
      }
      
      if (editingBestFriendIndex !== null) {
        // Update mode - just console log for now
        console.log('UPDATE Best Friend (not implemented):', payload)
        setSuccess('✅ Update functionality will be implemented soon (data logged to console)')
        pushToast({ title: 'Success', message: 'Updated best friend (mock). Data logged to console.', type: 'success' })
      } else {
        // Insert mode
        console.log('INSERT Best Friend:', payload)
        const response = await addBestFriend(payload)
        setSuccess(`✅ ${response.message || 'Best friend added successfully!'}`)
        pushToast({ title: 'Success', message: response.message || 'Best friend added successfully', type: 'success' })
        
        // Refresh best friends
        const updatedData = await getBestFriend(studentId)
        setBestFriends(updatedData || [])
      }
      
      // Close modal and reset form
      setShowAddBestFriendModal(false)
      setBestFriendFormData({
        friendId: '',
        friendName: '',
        friendMobile: ''
      })
      setEditingBestFriendIndex(null)
      
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      console.error('Error saving best friend:', err)
      setError(err.response?.data?.message || err.message || 'Failed to save best friend.')
      pushToast({ title: 'Error', message: err.response?.data?.message || err.message || 'Failed to save best friend', type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const handleMedicalChange = (e) => {
    const { name, value } = e.target
    setMedicalFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleEditMedical = () => {
    setIsEditingMedical(true)
  }

  const handleCancelEditMedical = () => {
    setIsEditingMedical(false)
    // Reset form to original data
    if (medicalDetails) {
      setMedicalFormData({
        height: medicalDetails.Height || '',
        weight: medicalDetails.Weight || '',
        bloodGroup: medicalDetails.BloodGroup || ''
      })
    }
  }

  const handleSaveMedicalDetails = async () => {
    setSaving(true)
    setError('')
    setSuccess('')
    
    try {
      const studentId = studentIdProp
      
      const payload = {
        StudentId: parseInt(studentId),
        Height: medicalFormData.height || '',
        Weight: medicalFormData.weight || '',
        BloodGroup: medicalFormData.bloodGroup || ''
      }
      
      console.log('Medical Details Payload:', payload)
      
      // Check if medical details exist - if not, insert, otherwise update
      let response
      if (!medicalDetails || !medicalDetails.StudentId) {
        console.log('Inserting new medical details...')
        response = await insertMedicalDetails(payload)
        setSuccess(`✅ ${response.message || 'Medical details added successfully!'}`)
        pushToast({ title: 'Success', message: response.message || 'Medical details added successfully', type: 'success' })
      } else {
        console.log('Updating existing medical details...')
        response = await updateMedicalDetails(payload)
        setSuccess(`✅ ${response.message || 'Medical details updated successfully!'}`)
        pushToast({ title: 'Success', message: response.message || 'Medical details updated successfully', type: 'success' })
      }
      
      // Refresh medical details
      const updatedData = await getMedicalDetails(studentId)
      setMedicalDetails(updatedData)
      if (updatedData) {
        setMedicalFormData({
          height: updatedData.Height || '',
          weight: updatedData.Weight || '',
          bloodGroup: updatedData.BloodGroup || ''
        })
      }
      
      setIsEditingMedical(false)
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      console.error('Error saving medical details:', err)
      setError(err.response?.data?.message || err.message || 'Failed to save medical details.')
      pushToast({ title: 'Error', message: err.response?.data?.message || err.message || 'Failed to save medical details', type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const handleTransportChange = (e) => {
    const { name, value, type, checked } = e.target
    
    // Load stops when route changes
    if (name === 'routeId' && value) {
      setTransportFormData(prev => ({ 
        ...prev, 
        routeId: value,
        stopId: '' // Reset stop when route changes
      }))
      getTransportStops(value)
        .then(data => setTransportStops(data || []))
        .catch(err => {
          console.error('Error loading transport stops:', err)
          setTransportStops([])
        })
    } else {
      setTransportFormData(prev => ({ 
        ...prev, 
        [name]: type === 'checkbox' ? checked : value 
      }))
    }
  }

  const handleEditTransport = () => {
    setIsEditingTransport(true)
  }

  const handleCancelEditTransport = () => {
    setIsEditingTransport(false)
    // Reset form to original data
    if (transportDetails) {
      setTransportFormData({
        transportYesNo: transportDetails.Transport_Yes_No || false,
        routeId: transportDetails.RouteId || '',
        stopId: transportDetails.StopId || ''
      })
      // Reload stops for the original route
      if (transportDetails.RouteId) {
        getTransportStops(transportDetails.RouteId)
          .then(data => setTransportStops(data || []))
          .catch(err => console.error('Error loading transport stops:', err))
      }
    }
  }

  const handleSaveTransportDetails = async () => {
    setSaving(true)
    setError('')
    setSuccess('')
    
    try {
      const studentId = studentIdProp
      
      const payload = {
        StudentId: parseInt(studentId),
        Transport_Yes_No: transportFormData.transportYesNo || false,
        RouteId: parseInt(transportFormData.routeId) || 0,
        StopId: parseInt(transportFormData.stopId) || 0
      }
      
      console.log('Transport Details Payload:', payload)
      
      // Check if transport details exist - if not, insert, otherwise update
      let response
      if (!transportDetails || !transportDetails.StudentId) {
        console.log('Inserting new transport details...')
        response = await insertTransportDetails(payload)
        setSuccess(`✅ ${response.message || 'Transport details added successfully!'}`)
        pushToast({ title: 'Success', message: response.message || 'Transport details added successfully', type: 'success' })
      } else {
        console.log('Updating existing transport details...')
        response = await updateTransportDetails(payload)
        setSuccess(`✅ ${response.message || 'Transport details updated successfully!'}`)
        pushToast({ title: 'Success', message: response.message || 'Transport details updated successfully', type: 'success' })
      }
      
      // Refresh transport details
      const updatedData = await getTransportDetails(studentId)
      setTransportDetails(updatedData)
      if (updatedData) {
        setTransportFormData({
          transportYesNo: updatedData.Transport_Yes_No || false,
          routeId: updatedData.RouteId || '',
          stopId: updatedData.StopId || ''
        })
      }
      
      setIsEditingTransport(false)
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      console.error('Error saving transport details:', err)
      setError(err.response?.data?.message || err.message || 'Failed to save transport details.')
      pushToast({ title: 'Error', message: err.response?.data?.message || err.message || 'Failed to save transport details', type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const InfoRow = ({ label, value, col = 4 }) => (
    <CCol xs={12} md={6} lg={col} className="mb-3">
      <div className="border-start border-3 border-primary ps-3 py-2 bg-light rounded">
        <small className="text-muted text-uppercase fw-semibold d-block" style={{ fontSize: '0.7rem' }}>
          {label}
        </small>
        <div className="fw-semibold text-dark mt-1">{value || 'N/A'}</div>
      </div>
    </CCol>
  )

  if (loading) {
    return (
      <CCard className="shadow-sm">
        <CCardHeader className="bg-gradient-primary text-white fw-bold">
          👤 My Complete Profile
        </CCardHeader>
        <CCardBody className="text-center py-5">
          <CSpinner color="primary" className="mb-3" />
          <div className="fw-semibold">Loading your profile...</div>
        </CCardBody>
      </CCard>
    )
  }

  if (error) {
    return (
      <CCard className="shadow-sm">
        <CCardHeader className="bg-gradient-primary text-white fw-bold">
          👤 My Complete Profile
        </CCardHeader>
        <CCardBody>
          <CAlert color="danger">{error}</CAlert>
        </CCardBody>
      </CCard>
    )
  }

  return (
    <div>
      {/* Header Card with Photo */}
      {adminDetails && (
        <CCard className="border-0 shadow mb-4">
          <CCardBody className="p-0">
            <div className="bg-gradient-primary text-white py-3 px-4">
              <h4 className="mb-0 fw-bold">📋 My Complete Profile</h4>
            </div>
            <CCardBody className="p-3">
              <CCard className="mb-3 border-0 shadow-sm rounded-3">
                <CCardBody>
                  <CRow>
                    <CCol
                      xs={12}
                      md={4}
                      className="d-flex flex-column align-items-center justify-content-center text-center border-end mb-3 mb-md-0"
                    >
                      <CRow>
                        <CCol>
                          <div 
                            className="rounded-circle mb-2 d-flex align-items-center justify-content-center text-white fw-bold"
                            style={{ 
                              width: '100px', 
                              height: '100px', 
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              fontSize: '2.5rem'
                            }}
                          >
                            {adminDetails.StudentName?.charAt(0) || 'S'}
                          </div>
                        </CCol>
                        <CCol>
                          <h5 className="fw-bold text-primary mb-1">
                            {adminDetails.StudentName || 'Student'}
                          </h5>
                          <div className="text-muted mb-2">
                            Student ID: {studentIdProp}
                          </div>
                          <div>
                            <strong>📞</strong> {adminDetails.MobileNumber1}
                          </div>
                          <div className="badge bg-info mt-2 px-3 py-2">
                            🆔 {adminDetails.StudentRegistrationNumber || adminDetails.StudentUniversityNumber}
                          </div>
                        </CCol>
                      </CRow>
                    </CCol>

                    <CCol xs={12} md={8}>
                      <CRow className="gy-2 gx-3">
                        <CCol xs={6} md={4}>
                          <strong>College</strong>
                          <div className="text-muted">{adminDetails.CollegeName}</div>
                        </CCol>
                        <CCol xs={6} md={2}>
                          <strong>Branch</strong>
                          <div className="text-muted">{adminDetails.BranchName}</div>
                        </CCol>
                        <CCol xs={6} md={3}>
                          <strong>Course</strong>
                          <div className="text-muted">{adminDetails.Course}</div>
                        </CCol>
                        <CCol xs={6} md={3}>
                          <strong>Type</strong>
                          <div className="text-muted">{adminDetails.CourseName}</div>
                        </CCol>
                        <CCol xs={6} md={4}>
                          <strong>Fee Category</strong>
                          <div className="text-muted">{adminDetails.FeeCategoryName}</div>
                        </CCol>
                        <CCol xs={6} md={3}>
                          <strong>University</strong>
                          <div className="text-muted">{adminDetails.UniversityName}</div>
                        </CCol>
                        <CCol xs={6} md={3}>
                          <strong>Batch</strong>
                          <div className="text-muted">{adminDetails.BatchNo}</div>
                        </CCol>
                        <CCol xs={6} md={2}>
                          <strong>Section</strong>
                          <div className="text-muted">{adminDetails.Section || 'N/A'}</div>
                        </CCol>
                      </CRow>
                    </CCol>
                  </CRow>
                </CCardBody>
              </CCard>
            </CCardBody>
          </CCardBody>
        </CCard>
      )}

      {/* Profile Tabs */}
      <CCard className="mb-4">
        <CCardBody className="p-0">
          <style>{`
            .profile-tabs {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              padding: 8px;
              border-radius: 0;
              margin-bottom: 0;
              box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
              overflow-x: auto;
              white-space: nowrap;
            }
            .profile-tabs .nav {
              flex-wrap: nowrap;
              gap: 8px;
            }
            .profile-tabs .nav-link {
              color: #ffffff !important;
              background-color: rgba(255, 255, 255, 0.1) !important;
              border: 1px solid rgba(255, 255, 255, 0.2) !important;
              border-radius: 8px !important;
              padding: 10px 16px !important;
              font-weight: 500 !important;
              font-size: 14px !important;
              transition: all 0.3s ease !important;
              cursor: pointer !important;
              white-space: nowrap !important;
              min-width: fit-content !important;
            }
            .profile-tabs .nav-link:hover {
              background-color: rgba(255, 255, 255, 0.2) !important;
              transform: translateY(-2px);
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            }
            .profile-tabs .nav-link.active {
              background-color: #ffffff !important;
              color: #667eea !important;
              font-weight: 600 !important;
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
              border: 1px solid #ffffff !important;
            }
            @media (max-width: 768px) {
              .profile-tabs .nav-link {
                font-size: 12px !important;
                padding: 8px 12px !important;
              }
            }
          `}</style>

          <div className="profile-tabs">
            <CNav variant="pills" role="tablist" className="d-flex">
              <CNavItem>
                <CNavLink active={activeTab === 'administration'} onClick={() => setActiveTab('administration')}>
                  Administration
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink active={activeTab === 'personal'} onClick={() => setActiveTab('personal')}>
                  Personal Details
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink active={activeTab === 'family'} onClick={() => setActiveTab('family')}>
                  Family & Guardian
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink active={activeTab === 'address'} onClick={() => setActiveTab('address')}>
                  Address
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink active={activeTab === 'lastSchool'} onClick={() => setActiveTab('lastSchool')}>
                  Last School
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink active={activeTab === 'previousSchool'} onClick={() => setActiveTab('previousSchool')}>
                  Previous School
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink active={activeTab === 'siblings'} onClick={() => setActiveTab('siblings')}>
                  Siblings
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink active={activeTab === 'bestFriends'} onClick={() => setActiveTab('bestFriends')}>
                  Best Friends
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink active={activeTab === 'medical'} onClick={() => setActiveTab('medical')}>
                  Medical
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink active={activeTab === 'transport'} onClick={() => setActiveTab('transport')}>
                  Transport
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink active={activeTab === 'academic'} onClick={() => setActiveTab('academic')}>
                  Academic Info
                </CNavLink>
              </CNavItem>
            </CNav>
          </div>

          <CCardBody className="p-4">
            <CTabContent>
              {/* Administration Tab (Editable) */}
              <CTabPane visible={activeTab === 'administration'}>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="text-primary mb-0">🏫 Administration Details</h5>
                </div>

                {(
                  <CForm onSubmit={(e) => { e.preventDefault(); handleAdminEditSave() }}>
                    <CRow className="g-3">
                      <CCol md={4}>
                        <CFormLabel>Organisation Name <span className="text-danger">*</span></CFormLabel>
                        <CFormSelect name="organizationName" value={adminEditData.organizationName} onChange={handleAdminEditChange} required>
                          <option value="">Select Organisation</option>
                          {asArray(organizations).map(org => (
                            <option key={(org.OrganisationID ?? org.Id ?? org.organizationid)} value={String(org.OrganisationID ?? org.Id ?? org.organizationid)}>{org.OrganisationName ?? org.OrganizationName ?? org.organizationname}</option>
                          ))}
                        </CFormSelect>
                      </CCol>
                      <CCol md={4}>
                        <CFormLabel>College Name <span className="text-danger">*</span></CFormLabel>
                        <CFormSelect name="collegeName" value={adminEditData.collegeName} onChange={handleAdminEditChange} required disabled={!adminEditData.organizationName}>
                          <option value="">Select College</option>
                          {asArray(colleges).map(col => (
                            <option key={(col.CollegeID ?? col.CollegeId ?? col.Id)} value={String(col.CollegeID ?? col.CollegeId ?? col.Id)}>{col.CollegeName}</option>
                          ))}
                        </CFormSelect>
                      </CCol>
                      <CCol md={4}>
                        <CFormLabel>Branch <span className="text-danger">*</span></CFormLabel>
                        <CFormSelect name="branch" value={adminEditData.branch} onChange={handleAdminEditChange} required disabled={!adminEditData.collegeName}>
                          <option value="">Select Branch</option>
                          {asArray(branches).map(branch => (
                            <option key={(branch.Id ?? branch.BranchId)} value={String(branch.Id ?? branch.BranchId)}>{branch.BranchName}</option>
                          ))}
                        </CFormSelect>
                      </CCol>
                      <CCol md={4}>
                        <CFormLabel>Course Type <span className="text-danger">*</span></CFormLabel>
                        <CFormSelect name="courseType" value={adminEditData.courseType} onChange={handleAdminEditChange} required disabled={!adminEditData.collegeName}>
                          <option value="">Select Course Type</option>
                          {asArray(courseTypes).map(ct => (
                            <option key={(ct.Id ?? ct.CourseTypeId)} value={String(ct.Id ?? ct.CourseTypeId)}>{ct.CourseName ?? ct.CourseTypeName}</option>
                          ))}
                        </CFormSelect>
                      </CCol>
                      <CCol md={4}>
                        <CFormLabel>University <span className="text-danger">*</span></CFormLabel>
                        <CFormSelect name="university" value={adminEditData.university} onChange={handleAdminEditChange} required disabled={!adminEditData.courseType}>
                          <option value="">Select University</option>
                          {asArray(universities).map(uni => (
                            <option key={(uni.Id ?? uni.UniversityId)} value={String(uni.Id ?? uni.UniversityId)}>{uni.Name ?? uni.UniversityName}</option>
                          ))}
                        </CFormSelect>
                      </CCol>
                      <CCol md={4}>
                        <CFormLabel>Batch <span className="text-danger">*</span></CFormLabel>
                        <CFormSelect name="batch" value={adminEditData.batch} onChange={handleAdminEditChange} required disabled={!adminEditData.university}>
                          <option value="">Select Batch</option>
                          {asArray(batches).map(batch => (
                            <option key={(batch.Id ?? batch.BatchId)} value={String(batch.Id ?? batch.BatchId)}>{batch.BatchName ?? batch.BatchNo}</option>
                          ))}
                        </CFormSelect>
                      </CCol>
                      <CCol md={4}>
                        <CFormLabel>Course <span className="text-danger">*</span></CFormLabel>
                        <CFormSelect name="course" value={adminEditData.course} onChange={handleAdminEditChange} required disabled={!adminEditData.batch}>
                          <option value="">Select Course</option>
                          {asArray(courses).map(course => (
                            <option key={(course.Id ?? course.CourseId)} value={String(course.Id ?? course.CourseId)}>{course.CourseName}</option>
                          ))}
                        </CFormSelect>
                      </CCol>
                      <CCol md={4}>
                        <CFormLabel>Section</CFormLabel>
                        <CFormSelect name="section" value={adminEditData.section} onChange={handleAdminEditChange} disabled={!adminEditData.course}>
                          <option value="">Select Section</option>
                          {asArray(sections).map(section => (
                            <option key={(section.Id ?? section.SemesterId)} value={String(section.Id ?? section.SemesterId)}>{section.Name ?? section.SemesterName ?? section.SectionName}</option>
                          ))}
                        </CFormSelect>
                      </CCol>

                      <CCol md={4}>
                        <CFormLabel>Financial Year</CFormLabel>
                        <CFormSelect name="financialYear" value={adminEditData.financialYear} onChange={handleAdminEditChange}>
                          <option value="">Select</option>
                          {asArray(financialYears).map(fy => (
                            <option key={fy.Id} value={String(fy.Id)}>{fy.FinancialYear}</option>
                          ))}
                        </CFormSelect>
                      </CCol>
                      <CCol md={4}>
                        <CFormLabel>Student Name <span className="text-danger">*</span></CFormLabel>
                        <CFormInput name="studentName" value={adminEditData.studentName} onChange={handleAdminEditChange} placeholder="Enter full name" required />
                      </CCol>
                      <CCol md={4}>
                        <CFormLabel>Student Registration Number (SRN) <span className="text-danger">*</span></CFormLabel>
                        <CFormInput name="studentRegistrationNumber" value={adminEditData.studentRegistrationNumber} readOnly className="bg-light" placeholder="Auto-generated" />
                        <small className="text-muted">Auto-generated based on selections</small>
                      </CCol>
                      <CCol md={4}>
                        <CFormLabel> Mobile Number 1 <span className="text-danger">*</span> </CFormLabel>
                        <CFormInput name="mobileNumber1" value={adminEditData.mobileNumber1} onChange={handleAdminEditChange} placeholder="Enter 10-digit mobile" required />
                      </CCol>
                      <CCol md={4}>
                        <CFormLabel>Mobile Number 2</CFormLabel>
                        <CFormInput name="mobileNumber2" value={adminEditData.mobileNumber2} onChange={handleAdminEditChange} placeholder="Enter 10-digit mobile" />
                      </CCol>
                      <CCol md={4}>
                        <CFormLabel>Mobile Number 3</CFormLabel>
                        <CFormInput name="mobileNumber3" value={adminEditData.mobileNumber3} onChange={handleAdminEditChange} placeholder="Enter 10-digit mobile" />
                      </CCol>
                      <CCol md={4}>
                        <CFormLabel>Student University Number</CFormLabel>
                        <CFormInput name="studentUniversityNumber" value={adminEditData.studentUniversityNumber} onChange={handleAdminEditChange} placeholder="Enter university number" />
                      </CCol>
                      <CCol md={4}>
                        <CFormLabel>Admission Number</CFormLabel>
                        <CFormInput type="number" name="admissionNo" value={adminEditData.admissionNo} onChange={handleAdminEditChange} placeholder="Enter admission number" />
                      </CCol>
                      <CCol md={4}>
                        <CFormLabel>Father Name</CFormLabel>
                        <CFormInput name="adminFatherName" value={adminEditData.adminFatherName} onChange={handleAdminEditChange} placeholder="Enter father name" />
                      </CCol>
                      <CCol md={4}>
                        <CFormLabel>Mother Name</CFormLabel>
                        <CFormInput name="adminMotherName" value={adminEditData.adminMotherName} onChange={handleAdminEditChange} placeholder="Enter mother name" />
                      </CCol>
                      <CCol md={4}>
                        <CFormLabel>College Email <span className="text-danger">*</span></CFormLabel>
                        <CFormInput type="email" name="emailId" value={adminEditData.emailId} readOnly className="bg-light" placeholder="Auto-generated" />
                        <small className="text-muted">Format: firstname.srn@atm.edu.in</small>
                      </CCol>
                      <CCol md={4}>
                        <CFormLabel>Date of Admission <span className="text-danger">*</span></CFormLabel>
                        <CFormInput type="date" name="dateOfAdmission" value={adminEditData.dateOfAdmission} onChange={handleAdminEditChange} required />
                      </CCol>
                      <CCol md={4}>
                        <CFormLabel>Fee Category <span className="text-danger">*</span></CFormLabel>
                        <CFormSelect name="feeCategory" value={adminEditData.feeCategory} onChange={handleAdminEditChange} required>
                          <option value="">Select Fee Category</option>
                          {asArray(feeCategories).map(category => (
                            <option key={category.Id} value={String(category.Id)}>{category.FeeCategoryName}</option>
                          ))}
                        </CFormSelect>
                      </CCol>
                      <CCol md={4}>
                        <CFormLabel>Admission Category</CFormLabel>
                        <CFormSelect name="admissionCategory" value={adminEditData.admissionCategory || ''} onChange={handleAdminEditChange}>
                          <option value="">Select Admission Category</option>
                          {asArray(admissionCategories).map(cat => (
                            <option key={cat.Id} value={String(cat.Id)}>{cat.AdmissionCategoryName || cat.Name}</option>
                          ))}
                        </CFormSelect>
                      </CCol>

                      <CCol xs={12} className="mt-2 d-flex gap-2">
                        <CButton type="submit" color="success">Save (Console)</CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                )}
              </CTabPane>

              {/* Personal Details Tab - Editable */}
              <CTabPane visible={activeTab === 'personal'}>
                <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
                  <h5 className="text-primary mb-0">👤 Personal Information</h5>
                  {!isEditing && (
                    <CButton color="primary" size="sm" onClick={handleEditClick}>
                      <CIcon icon={cilPencil} className="me-1" />
                      Edit
                    </CButton>
                  )}
                </div>
                
                {success && (
                  <CAlert color="success" dismissible onClose={() => setSuccess('')}>
                    {success}
                  </CAlert>
                )}
                {error && activeTab === 'personal' && (
                  <CAlert color="danger" dismissible onClose={() => setError('')}>
                    {error}
                  </CAlert>
                )}
                
                {personalDetails ? (
                  <CForm onSubmit={handleSavePersonalDetails}>
                    <CRow className="g-3">
                      <CCol md={4}>
                        <CFormLabel>Email ID</CFormLabel>
                        <CFormInput 
                          type="email"
                          name="emailId" 
                          value={formData.emailId} 
                          onChange={handleChange} 
                          placeholder="Enter email"
                          disabled={!isEditing}
                        />
                      </CCol>
                      
                      <CCol md={4}>
                        <CFormLabel>Gender <span className="text-danger">*</span></CFormLabel> 
                        <CFormSelect name="gender" value={formData.gender} onChange={handleChange} required disabled={!isEditing}>
                          <option value="">Select</option>
                          <option value="1">Male</option>
                          <option value="2">Female</option>
                          <option value="3">Other</option>
                        </CFormSelect>
                      </CCol>
                      
                      <CCol md={4}>
                        <CFormLabel>Date of Birth <span className="text-danger">*</span></CFormLabel> 
                        <CFormInput 
                          type="date" 
                          name="dateOfBirth" 
                          value={formData.dateOfBirth} 
                          onChange={handleChange} 
                          required 
                          disabled={!isEditing}
                        />
                      </CCol>
                      
                      <CCol md={4}>
                        <CFormLabel>Nationality</CFormLabel>
                        <CFormSelect name="nationality" value={formData.nationality} onChange={handleChange} disabled={!isEditing}>
                          <option value="">Select Nationality</option>
                          {nationalities.map(nat => (
                            <option key={nat.Id} value={nat.Id}>{nat.NationalityName}</option>
                          ))}
                        </CFormSelect>
                      </CCol>
                      
                      <CCol md={4}>
                        <CFormLabel>Birthplace</CFormLabel>
                        <CFormInput 
                          name="birthplace" 
                          value={formData.birthplace} 
                          onChange={handleChange} 
                          placeholder="Enter birthplace"
                          disabled={!isEditing}
                        />
                      </CCol>
                      
                      <CCol md={4}>
                        <CFormLabel>Mother Tongue</CFormLabel>
                        <CFormSelect name="motherTongue" value={formData.motherTongue} onChange={handleChange} disabled={!isEditing}>
                          <option value="">Select Mother Tongue</option>
                          {motherTongues.map(mt => (
                            <option key={mt.Id} value={mt.Id}>{mt.MotherTongueName}</option>
                          ))}
                        </CFormSelect>
                      </CCol>
                      
                      <CCol md={4}>
                        <CFormLabel>Category</CFormLabel>
                        <CFormSelect name="category" value={formData.category} onChange={handleChange} disabled={!isEditing}>
                          <option value="">Select Category</option>
                          {categories.map(cat => (
                            <option key={cat.Id} value={cat.Id}>{cat.CategoryName}</option>
                          ))}
                        </CFormSelect>
                      </CCol>
                      
                      <CCol md={4}>
                        <CFormLabel>Sub-Category</CFormLabel>
                        <CFormSelect 
                          name="subCategory" 
                          value={formData.subCategory} 
                          onChange={handleChange}
                          disabled={!isEditing || !formData.category}
                        >
                          <option value="">Select Sub-Category</option>
                          {subCategories.map(sub => (
                            <option key={sub.Id} value={sub.Id}>{sub.SubCategoryName}</option>
                          ))}
                        </CFormSelect>
                      </CCol>
                      
                      <CCol md={4}>
                        <CFormLabel>Minority</CFormLabel>
                        <CFormSelect name="minority" value={formData.minority} onChange={handleChange} disabled={!isEditing}>
                          <option value="">Select</option>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                        </CFormSelect>
                      </CCol>
                      
                      <CCol md={4}>
                        <CFormLabel>Religion</CFormLabel>
                        <CFormSelect name="religion" value={formData.religion} onChange={handleChange} disabled={!isEditing}>
                          <option value="">Select Religion</option>
                          {religions.map(rel => (
                            <option key={rel.Id} value={rel.Id}>{rel.ReligionName}</option>
                          ))}
                        </CFormSelect>
                      </CCol>
                      
                      {/* <CCol md={4}>
                        <CFormLabel>Blood Group</CFormLabel>
                        <CFormSelect name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} disabled={!isEditing}>
                          <option value="">Select</option>
                          <option value="1">A+</option>
                          <option value="2">A-</option>
                          <option value="3">B+</option>
                          <option value="4">B-</option>
                          <option value="5">O+</option>
                          <option value="6">O-</option>
                          <option value="7">AB+</option>
                          <option value="8">AB-</option>
                        </CFormSelect>
                      </CCol>
                       */}
                      <CCol md={4}>
                        <CFormLabel>Aadhar Card Number</CFormLabel>
                        <CFormInput 
                          name="adharCardNumber" 
                          value={formData.adharCardNumber} 
                          onChange={handleChange} 
                          placeholder="Enter Aadhar number" 
                          maxLength="12"
                          disabled={!isEditing}
                        />
                      </CCol>
                      
                      <CCol md={4}>
                        <CFormLabel>Domicile</CFormLabel>
                        <CFormInput 
                          name="domicile" 
                          value={formData.domicile} 
                          onChange={handleChange} 
                          placeholder="Enter domicile"
                          disabled={!isEditing}
                        />
                      </CCol>
                      
                      <CCol md={4}>
                        <CFormLabel>PAN No.</CFormLabel>
                        <CFormInput 
                          name="panNo" 
                          value={formData.panNo} 
                          onChange={handleChange} 
                          placeholder="Enter PAN number" 
                          maxLength="10"
                          disabled={!isEditing}
                        />
                      </CCol>
                      
                      {isEditing && (
                        <CCol xs={12} className="mt-4">
                          <div className="d-flex gap-2">
                            <CButton 
                              type="submit" 
                              color="success" 
                              disabled={saving}
                            >
                              {saving ? (
                                <>
                                  <CSpinner size="sm" className="me-1" />
                                  Saving...
                                </>
                              ) : (
                                <>
                                  <CIcon icon={cilSave} className="me-1" />
                                  Save Changes
                                </>
                              )}
                            </CButton>
                            <CButton 
                              type="button" 
                              color="secondary" 
                              onClick={handleCancelEdit}
                              disabled={saving}
                            >
                              <CIcon icon={cilX} className="me-1" />
                              Cancel
                            </CButton>
                          </div>
                        </CCol>
                      )}
                    </CRow>
                  </CForm>
                ) : (
                  <CAlert color="info">Loading personal details...</CAlert>
                )}
              </CTabPane>

              {/* Family & Guardian Tab - Editable */}
              <CTabPane visible={activeTab === 'family'}>
                <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
                  <h5 className="text-primary mb-0">👨‍👩‍👧‍👦 Family & Guardian Information</h5>
                  {!isEditingParent && (
                    <CButton color="primary" size="sm" onClick={handleEditParent}>
                      <CIcon icon={cilPencil} className="me-1" />
                      Edit
                    </CButton>
                  )}
                </div>
                
                {success && activeTab === 'family' && (
                  <CAlert color="success" dismissible onClose={() => setSuccess('')}>
                    {success}
                  </CAlert>
                )}
                {error && activeTab === 'family' && (
                  <CAlert color="danger" dismissible onClose={() => setError('')}>
                    {error}
                  </CAlert>
                )}
                
                {parentDetails ? (
                  <CForm onSubmit={handleSaveParentDetails}>
                    <CRow className="g-3">
                      <CCol xs={12}><h6 className="text-primary">Father Details</h6></CCol>
                      <CCol md={4}>
                        <CFormLabel>Father Name</CFormLabel>
                        <CFormInput name="fatherName" value={parentFormData.fatherName} onChange={handleParentChange} placeholder="Enter father name" disabled={!isEditingParent} />
                      </CCol>
                      <CCol md={4}>
                        <CFormLabel>Father Mobile (Admission)</CFormLabel>
                        <CFormInput name="fatherMobileAdmission" value={parentFormData.fatherMobileAdmission} onChange={handleParentChange} placeholder="Enter mobile" disabled={!isEditingParent} />
                      </CCol>
                      <CCol md={4}>
                        <CFormLabel>Father Contact No.</CFormLabel>
                        <CFormInput name="fatherContactNo" value={parentFormData.fatherContactNo} onChange={handleParentChange} placeholder="Enter contact" disabled={!isEditingParent} />
                      </CCol>
                      <CCol md={4}>
                        <CFormLabel>Father Email ID</CFormLabel>
                        <CFormInput type="email" name="fatherEmailId" value={parentFormData.fatherEmailId} onChange={handleParentChange} placeholder="Enter email" disabled={!isEditingParent} />
                      </CCol>
                      <CCol md={4}>
                        <CFormLabel>Father Adhar No.</CFormLabel>
                        <CFormInput name="fatherAdharNo" value={parentFormData.fatherAdharNo} onChange={handleParentChange} placeholder="Enter Adhar" disabled={!isEditingParent} />
                      </CCol>
                      <CCol md={4}>
                        <CFormLabel>Father Qualification</CFormLabel>
                        <CFormInput name="fatherQualification" value={parentFormData.fatherQualification} onChange={handleParentChange} placeholder="Enter qualification" disabled={!isEditingParent} />
                      </CCol>
                      <CCol md={4}>
                        <CFormLabel>Father's Profession</CFormLabel>
                        <CFormSelect name="fatherProfession" value={parentFormData.fatherProfession} onChange={handleParentChange} disabled={!isEditingParent}>
                          <option value="">Select Profession</option>
                          {professions.map(prof => (
                            <option key={prof.Id} value={prof.Id}>{prof.ProfessionName}</option>
                          ))}
                        </CFormSelect>
                      </CCol>
                      <CCol md={4}>
                        <CFormLabel>Father Company Name</CFormLabel>
                        <CFormInput name="fatherCompanyName" value={parentFormData.fatherCompanyName} onChange={handleParentChange} placeholder="Enter company" disabled={!isEditingParent} />
                      </CCol>
                      <CCol md={4}>
                        <CFormLabel>Father Office Address</CFormLabel>
                        <CFormInput name="fatherOfficeAddress" value={parentFormData.fatherOfficeAddress} onChange={handleParentChange} placeholder="Enter address" disabled={!isEditingParent} />
                      </CCol>
                      <CCol md={4}>
                        <CFormLabel>Father Designation</CFormLabel>
                        <CFormSelect name="fatherDesignation" value={parentFormData.fatherDesignation} onChange={handleParentChange} disabled={!isEditingParent}>
                          <option value="">Select Designation</option>
                          {designations.map(desg => (
                            <option key={desg.Id} value={desg.Id}>{desg.Desgname}</option>
                          ))}
                        </CFormSelect>
                      </CCol>
                      <CCol md={4}>
                        <CFormLabel>Family Income</CFormLabel>
                        <CFormSelect name="familyIncome" value={parentFormData.familyIncome} onChange={handleParentChange} disabled={!isEditingParent}>
                          <option value="">Select Income Range</option>
                          {incomeRanges.map(income => (
                            <option key={income.IncomeId} value={income.IncomeId}>{income.RangeValue}</option>
                          ))}
                        </CFormSelect>
                      </CCol>
                      
                      <CCol xs={12}><h6 className="text-primary mt-3">Mother Details</h6></CCol>
                      <CCol md={4}>
                        <CFormLabel>Mother Name</CFormLabel>
                        <CFormInput name="motherName" value={parentFormData.motherName} onChange={handleParentChange} placeholder="Enter mother name" disabled={!isEditingParent} />
                      </CCol>
                      <CCol md={4}>
                        <CFormLabel>Mother Contact Number</CFormLabel>
                        <CFormInput name="motherContactNo" value={parentFormData.motherContactNo} onChange={handleParentChange} placeholder="Enter contact" disabled={!isEditingParent} />
                      </CCol>
                      <CCol md={4}>
                        <CFormLabel>Mother Mobile (Admission)</CFormLabel>
                        <CFormInput name="motherMobileAdmission" value={parentFormData.motherMobileAdmission} onChange={handleParentChange} placeholder="Enter mobile" disabled={!isEditingParent} />
                      </CCol>
                      <CCol md={4}>
                        <CFormLabel>Mother Email ID</CFormLabel>
                        <CFormInput type="email" name="motherEmailId" value={parentFormData.motherEmailId} onChange={handleParentChange} placeholder="Enter email" disabled={!isEditingParent} />
                      </CCol>
                      <CCol md={4}>
                        <CFormLabel>Mother Qualification</CFormLabel>
                        <CFormInput name="motherQualification" value={parentFormData.motherQualification} onChange={handleParentChange} placeholder="Enter qualification" disabled={!isEditingParent} />
                      </CCol>
                      <CCol md={4}>
                        <CFormLabel>Mother Profession</CFormLabel>
                        <CFormSelect name="motherProfession" value={parentFormData.motherProfession} onChange={handleParentChange} disabled={!isEditingParent}>
                          <option value="">Select Profession</option>
                          {professions.map(prof => (
                            <option key={prof.Id} value={prof.Id}>{prof.ProfessionName}</option>
                          ))}
                        </CFormSelect>
                      </CCol>
                      <CCol md={4}>
                        <CFormLabel>Mother Office Address</CFormLabel>
                        <CFormInput name="motherOfficeAddress" value={parentFormData.motherOfficeAddress} onChange={handleParentChange} placeholder="Enter address" disabled={!isEditingParent} />
                      </CCol>
                      
                      <CCol xs={12}><h6 className="text-primary mt-3">Guardian Details</h6></CCol>
                      <CCol md={4}>
                        <CFormLabel>Guardian Name</CFormLabel>
                        <CFormInput name="guardianName" value={parentFormData.guardianName} onChange={handleParentChange} placeholder="Enter guardian name" disabled={!isEditingParent} />
                      </CCol>
                      <CCol md={4}>
                        <CFormLabel>Guardian Mobile (Admission)</CFormLabel>
                        <CFormInput name="guardianMobileAdmission" value={parentFormData.guardianMobileAdmission} onChange={handleParentChange} placeholder="Enter mobile" disabled={!isEditingParent} />
                      </CCol>
                      <CCol md={4}>
                        <CFormLabel>Guardian Mobile No</CFormLabel>
                        <CFormInput name="guardianMobileNo" value={parentFormData.guardianMobileNo} onChange={handleParentChange} placeholder="Enter mobile" disabled={!isEditingParent} />
                      </CCol>
                      <CCol md={4}>
                        <CFormLabel>Guardian Email ID</CFormLabel>
                        <CFormInput type="email" name="guardianEmailId" value={parentFormData.guardianEmailId} onChange={handleParentChange} placeholder="Enter email" disabled={!isEditingParent} />
                      </CCol>
                      <CCol md={4}>
                        <CFormLabel>Relation with Student</CFormLabel>
                        <CFormInput name="relationWithStudent" value={parentFormData.relationWithStudent} onChange={handleParentChange} placeholder="Enter relation" disabled={!isEditingParent} />
                      </CCol>
                      
                      <CCol xs={12}><h6 className="text-primary mt-3">Spouse Details</h6></CCol>
                      <CCol md={4}>
                        <CFormLabel>Spouse Name</CFormLabel>
                        <CFormInput name="spouseName" value={parentFormData.spouseName} onChange={handleParentChange} placeholder="Enter spouse name" disabled={!isEditingParent} />
                      </CCol>
                      <CCol md={4}>
                        <CFormLabel>Spouse Contact No</CFormLabel>
                        <CFormInput name="spouseContactNo" value={parentFormData.spouseContactNo} onChange={handleParentChange} placeholder="Enter contact" disabled={!isEditingParent} />
                      </CCol>
                      <CCol md={4}>
                        <CFormLabel>Spouse Mobile (Admission)</CFormLabel>
                        <CFormInput name="spouseMobileAdmission" value={parentFormData.spouseMobileAdmission} onChange={handleParentChange} placeholder="Enter mobile" disabled={!isEditingParent} />
                      </CCol>
                      <CCol md={4}>
                        <CFormLabel>Spouse Email ID</CFormLabel>
                        <CFormInput type="email" name="spouseEmailId" value={parentFormData.spouseEmailId} onChange={handleParentChange} placeholder="Enter email" disabled={!isEditingParent} />
                      </CCol>
                      <CCol md={4}>
                        <CFormLabel>Spouse Qualification</CFormLabel>
                        <CFormInput name="spouseQualification" value={parentFormData.spouseQualification} onChange={handleParentChange} placeholder="Enter qualification" disabled={!isEditingParent} />
                      </CCol>
                      <CCol md={4}>
                        <CFormLabel>Spouse Profession</CFormLabel>
                        <CFormInput name="spouseProfession" value={parentFormData.spouseProfession} onChange={handleParentChange} placeholder="Enter profession" disabled={!isEditingParent} />
                      </CCol>
                      <CCol md={4}>
                        <CFormLabel>Spouse Office Address</CFormLabel>
                        <CFormInput name="spouseOfficeAddress" value={parentFormData.spouseOfficeAddress} onChange={handleParentChange} placeholder="Enter office address" disabled={!isEditingParent} />
                      </CCol>
                      
                      {isEditingParent && (
                        <CCol xs={12} className="mt-4">
                          <div className="d-flex gap-2">
                            <CButton 
                              type="submit" 
                              color="success" 
                              disabled={saving}
                            >
                              {saving ? (
                                <>
                                  <CSpinner size="sm" className="me-1" />
                                  Saving...
                                </>
                              ) : (
                                <>
                                  <CIcon icon={cilSave} className="me-1" />
                                  Save Changes
                                </>
                              )}
                            </CButton>
                            <CButton 
                              type="button" 
                              color="secondary" 
                              onClick={handleCancelEditParent}
                              disabled={saving}
                            >
                              <CIcon icon={cilX} className="me-1" />
                              Cancel
                            </CButton>
                          </div>
                        </CCol>
                      )}
                    </CRow>
                  </CForm>
                ) : (
                  <CAlert color="info">Loading parent details...</CAlert>
                )}
              </CTabPane>

              {/* Address Tab - Editable */}
              <CTabPane visible={activeTab === 'address'}>
                <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
                  <h5 className="text-primary mb-0">📍 Address Information</h5>
                  {!isEditingAddress && (
                    <CButton color="primary" size="sm" onClick={handleEditAddress}>
                      <CIcon icon={cilPencil} className="me-1" />
                      Edit
                    </CButton>
                  )}
                </div>
                
                {success && activeTab === 'address' && (
                  <CAlert color="success" dismissible onClose={() => setSuccess('')}>
                    {success}
                  </CAlert>
                )}
                {error && activeTab === 'address' && (
                  <CAlert color="danger" dismissible onClose={() => setError('')}>
                    {error}
                  </CAlert>
                )}
                
                {addressDetails ? (
                  <CForm onSubmit={handleSaveAddressDetails}>
                    <CRow className="g-3">
                      <CCol xs={12}><h6 className="text-primary">Permanent Address</h6></CCol>
                      <CCol md={3}>
                        <CFormLabel>Country</CFormLabel>
                        <CFormSelect name="pCountry" value={addressFormData.pCountry} onChange={handleAddressChange} disabled={!isEditingAddress}>
                          <option value="">Select Country</option>
                          {countries.map(country => (
                            <option key={country.Id} value={String(country.Id)}>{country.Country}</option>
                          ))}
                        </CFormSelect>
                      </CCol>
                      <CCol md={3}>
                        <CFormLabel>State</CFormLabel>
                        <CFormSelect name="pState" value={addressFormData.pState} onChange={handleAddressChange} disabled={!isEditingAddress || !addressFormData.pCountry}>
                          <option value="">Select State</option>
                          {pStates.map(state => (
                            <option key={state.StateId} value={String(state.StateId)}>{state.StateName}</option>
                          ))}
                        </CFormSelect>
                      </CCol>
                      <CCol md={3}>
                        <CFormLabel>District</CFormLabel>
                        <CFormSelect name="pDistrict" value={addressFormData.pDistrict} onChange={handleAddressChange} disabled={!isEditingAddress || !addressFormData.pState}>
                          <option value="">Select District</option>
                          {pDistricts.map(district => (
                            <option key={district.DistrictId} value={String(district.DistrictId)}>{district.DistrictName}</option>
                          ))}
                        </CFormSelect>
                      </CCol>
                      <CCol md={3}>
                        <CFormLabel>Area/Tehsil</CFormLabel>
                        <CFormSelect name="pArea" value={addressFormData.pArea} onChange={handleAddressChange} disabled={!isEditingAddress || !addressFormData.pDistrict}>
                          <option value="">Select Area</option>
                          {pAreas.map(area => (
                            <option key={area.TehsilId} value={String(area.TehsilId)}>{area.TehsilName}</option>
                          ))}
                        </CFormSelect>
                      </CCol>
                      <CCol md={3}>
                        <CFormLabel>Pincode</CFormLabel>
                        <CFormInput name="pPincode" value={addressFormData.pPincode} onChange={handleAddressChange} placeholder="Enter pincode" disabled={!isEditingAddress} />
                      </CCol>
                      <CCol md={9}>
                        <CFormLabel>Address</CFormLabel>
                        <CFormTextarea name="pAddress" value={addressFormData.pAddress} onChange={handleAddressChange} rows={2} placeholder="Enter complete address" disabled={!isEditingAddress} />
                      </CCol>
                      
                      <CCol xs={12}><h6 className="text-primary mt-3">Correspondence Address</h6></CCol>
                      <CCol md={3}>
                        <CFormLabel>Country</CFormLabel>
                        <CFormSelect name="cCountry" value={addressFormData.cCountry} onChange={handleAddressChange} disabled={!isEditingAddress}>
                          <option value="">Select Country</option>
                          {countries.map(country => (
                            <option key={country.Id} value={String(country.Id)}>{country.Country}</option>
                          ))}
                        </CFormSelect>
                      </CCol>
                      <CCol md={3}>
                        <CFormLabel>State</CFormLabel>
                        <CFormSelect name="cState" value={addressFormData.cState} onChange={handleAddressChange} disabled={!isEditingAddress || !addressFormData.cCountry}>
                          <option value="">Select State</option>
                          {cStates.map(state => (
                            <option key={state.StateId} value={String(state.StateId)}>{state.StateName}</option>
                          ))}
                        </CFormSelect>
                      </CCol>
                      <CCol md={3}>
                        <CFormLabel>District</CFormLabel>
                        <CFormSelect name="cDistrict" value={addressFormData.cDistrict} onChange={handleAddressChange} disabled={!isEditingAddress || !addressFormData.cState}>
                          <option value="">Select District</option>
                          {cDistricts.map(district => (
                            <option key={district.DistrictId} value={String(district.DistrictId)}>{district.DistrictName}</option>
                          ))}
                        </CFormSelect>
                      </CCol>
                      <CCol md={3}>
                        <CFormLabel>Area/Tehsil</CFormLabel>
                        <CFormSelect name="cArea" value={addressFormData.cArea} onChange={handleAddressChange} disabled={!isEditingAddress || !addressFormData.cDistrict}>
                          <option value="">Select Area</option>
                          {cAreas.map(area => (
                            <option key={area.TehsilId} value={String(area.TehsilId)}>{area.TehsilName}</option>
                          ))}
                        </CFormSelect>
                      </CCol>
                      <CCol md={3}>
                        <CFormLabel>Pincode</CFormLabel>
                        <CFormInput name="cPincode" value={addressFormData.cPincode} onChange={handleAddressChange} placeholder="Enter pincode" disabled={!isEditingAddress} />
                      </CCol>
                      <CCol md={9}>
                        <CFormLabel>Address</CFormLabel>
                        <CFormTextarea name="cAddress" value={addressFormData.cAddress} onChange={handleAddressChange} rows={2} placeholder="Enter complete address" disabled={!isEditingAddress} />
                      </CCol>
                      
                      <CCol xs={12}><h6 className="text-primary mt-3">Guardian Address</h6></CCol>
                      <CCol md={3}>
                        <CFormLabel>Country</CFormLabel>
                        <CFormSelect name="gCountry" value={addressFormData.gCountry} onChange={handleAddressChange} disabled={!isEditingAddress}>
                          <option value="">Select Country</option>
                          {countries.map(country => (
                            <option key={country.Id} value={String(country.Id)}>{country.Country}</option>
                          ))}
                        </CFormSelect>
                      </CCol>
                      <CCol md={3}>
                        <CFormLabel>State</CFormLabel>
                        <CFormSelect name="gState" value={addressFormData.gState} onChange={handleAddressChange} disabled={!isEditingAddress || !addressFormData.gCountry}>
                          <option value="">Select State</option>
                          {gStates.map(state => (
                            <option key={state.StateId} value={String(state.StateId)}>{state.StateName}</option>
                          ))}
                        </CFormSelect>
                      </CCol>
                      <CCol md={3}>
                        <CFormLabel>District</CFormLabel>
                        <CFormSelect name="gDistrict" value={addressFormData.gDistrict} onChange={handleAddressChange} disabled={!isEditingAddress || !addressFormData.gState}>
                          <option value="">Select District</option>
                          {gDistricts.map(district => (
                            <option key={district.DistrictId} value={String(district.DistrictId)}>{district.DistrictName}</option>
                          ))}
                        </CFormSelect>
                      </CCol>
                      <CCol md={3}>
                        <CFormLabel>Area/Tehsil</CFormLabel>
                        <CFormSelect name="gArea" value={addressFormData.gArea} onChange={handleAddressChange} disabled={!isEditingAddress || !addressFormData.gDistrict}>
                          <option value="">Select Area</option>
                          {gAreas.map(area => (
                            <option key={area.TehsilId} value={String(area.TehsilId)}>{area.TehsilName}</option>
                          ))}
                        </CFormSelect>
                      </CCol>
                      <CCol md={3}>
                        <CFormLabel>Pincode</CFormLabel>
                        <CFormInput name="gPincode" value={addressFormData.gPincode} onChange={handleAddressChange} placeholder="Enter pincode" disabled={!isEditingAddress} />
                      </CCol>
                      <CCol md={9}>
                        <CFormLabel>Address</CFormLabel>
                        <CFormTextarea name="gAddress" value={addressFormData.gAddress} onChange={handleAddressChange} rows={2} placeholder="Enter complete address" disabled={!isEditingAddress} />
                      </CCol>
                      
                      {isEditingAddress && (
                        <CCol xs={12} className="mt-4">
                          <div className="d-flex gap-2">
                            <CButton 
                              type="submit" 
                              color="success" 
                              disabled={saving}
                            >
                              {saving ? (
                                <>
                                  <CSpinner size="sm" className="me-1" />
                                  Saving...
                                </>
                              ) : (
                                <>
                                  <CIcon icon={cilSave} className="me-1" />
                                  Save Changes
                                </>
                              )}
                            </CButton>
                            <CButton 
                              type="button" 
                              color="secondary" 
                              onClick={handleCancelEditAddress}
                              disabled={saving}
                            >
                              <CIcon icon={cilX} className="me-1" />
                              Cancel
                            </CButton>
                          </div>
                        </CCol>
                      )}
                    </CRow>
                  </CForm>
                ) : (
                  <CAlert color="info">Loading address details...</CAlert>
                )}
              </CTabPane>

              {/* Last School Tab */}
              <CTabPane visible={activeTab === 'lastSchool'}>
                <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
                  <h5 className="text-primary mb-0">🏫 Last School Details</h5>
                  {!isEditingLastSchool && (
                    <CButton color="primary" size="sm" onClick={handleEditLastSchool}>
                      <CIcon icon={cilPencil} className="me-1" />
                      {lastSchoolDetails && lastSchoolDetails.length > 0 ? 'Edit' : 'Add Details'}
                    </CButton>
                  )}
                </div>
                
                {success && activeTab === 'lastSchool' && (
                  <CAlert color="success" dismissible onClose={() => setSuccess('')}>
                    {success}
                  </CAlert>
                )}
                {error && activeTab === 'lastSchool' && (
                  <CAlert color="danger" dismissible onClose={() => setError('')}>
                    {error}
                  </CAlert>
                )}
                
                <CForm onSubmit={handleSaveLastSchoolDetails}>
                    <CRow className="g-3">
                      <CCol md={6}>
                        <CFormLabel>School/College Name <span className="text-danger">*</span></CFormLabel> 
                        <CFormSelect 
                          name="schoolId" 
                          value={lastSchoolFormData.schoolId} 
                          onChange={handleSchoolChange} 
                          disabled={!isEditingLastSchool}
                          required
                        >
                          <option value="">Select School/College</option>
                          {schools.map(school => (
                            <option key={school.SchoolID} value={school.SchoolID}>
                              {school.SchoolCollegeName}
                            </option>
                          ))}
                          <option value="add_new" style={{fontWeight: 'bold', color: '#0d6efd'}}>
                            ➕ Add New School
                          </option>
                        </CFormSelect>
                      </CCol>
                      <CCol md={6}>
                        <CFormLabel>School Principal Name</CFormLabel>
                        <CFormInput 
                          name="principalName" 
                          value={lastSchoolFormData.principalName} 
                          onChange={handleLastSchoolChange} 
                          placeholder="Enter principal name" 
                          disabled={!isEditingLastSchool}
                        />
                      </CCol>
                      <CCol md={4}>
                        <CFormLabel>Principal Mobile No.</CFormLabel>
                        <CFormInput 
                          name="principalMobile" 
                          value={lastSchoolFormData.principalMobile} 
                          onChange={handleLastSchoolChange} 
                          placeholder="Enter mobile" 
                          disabled={!isEditingLastSchool}
                        />
                      </CCol>
                      <CCol md={4}>
                        <CFormLabel>Principal Email ID</CFormLabel>
                        <CFormInput 
                          type="email" 
                          name="principalEmail" 
                          value={lastSchoolFormData.principalEmail} 
                          onChange={handleLastSchoolChange} 
                          placeholder="Enter email" 
                          disabled={!isEditingLastSchool}
                        />
                      </CCol>
                      <CCol md={4}>
                        <CFormLabel>Best School Teacher Name</CFormLabel>
                        <CFormInput 
                          name="bestSchoolTeacherName" 
                          value={lastSchoolFormData.bestSchoolTeacherName} 
                          onChange={handleLastSchoolChange} 
                          placeholder="Enter teacher name" 
                          disabled={!isEditingLastSchool}
                        />
                      </CCol>
                      <CCol md={4}>
                        <CFormLabel>Teacher Mobile Number</CFormLabel>
                        <CFormInput 
                          name="bestSchoolTeacherMobile" 
                          value={lastSchoolFormData.bestSchoolTeacherMobile} 
                          onChange={handleLastSchoolChange} 
                          placeholder="Enter mobile" 
                          disabled={!isEditingLastSchool}
                        />
                      </CCol>
                      <CCol md={4}>
                        <CFormLabel>Teacher Email ID</CFormLabel>
                        <CFormInput 
                          type="email" 
                          name="bestSchoolTeacherEmail" 
                          value={lastSchoolFormData.bestSchoolTeacherEmail} 
                          onChange={handleLastSchoolChange} 
                          placeholder="Enter email" 
                          disabled={!isEditingLastSchool}
                        />
                      </CCol>
                      <CCol md={4}>
                        <CFormLabel>Best Coaching Teacher Name</CFormLabel>
                        <CFormInput 
                          name="bestCoachingTeacherName" 
                          value={lastSchoolFormData.bestCoachingTeacherName} 
                          onChange={handleLastSchoolChange} 
                          placeholder="Enter teacher name" 
                          disabled={!isEditingLastSchool}
                        />
                      </CCol>
                      <CCol md={4}>
                        <CFormLabel>Coaching Teacher Mobile</CFormLabel>
                        <CFormInput 
                          name="bestCoachingTeacherMobile" 
                          value={lastSchoolFormData.bestCoachingTeacherMobile} 
                          onChange={handleLastSchoolChange} 
                          placeholder="Enter mobile" 
                          disabled={!isEditingLastSchool}
                        />
                      </CCol>
                      <CCol md={4}>
                        <CFormLabel>Coaching Teacher Email</CFormLabel>
                        <CFormInput 
                          type="email" 
                          name="bestCoachingTeacherEmail" 
                          value={lastSchoolFormData.bestCoachingTeacherEmail} 
                          onChange={handleLastSchoolChange} 
                          placeholder="Enter email" 
                          disabled={!isEditingLastSchool}
                        />
                      </CCol>
                      
                      {isEditingLastSchool && (
                        <CCol xs={12} className="mt-4">
                          <div className="d-flex gap-2">
                            <CButton 
                              type="submit" 
                              color="success" 
                              disabled={saving}
                            >
                              {saving ? (
                                <>
                                  <CSpinner size="sm" className="me-1" />
                                  Saving...
                                </>
                              ) : (
                                <>
                                  <CIcon icon={cilSave} className="me-1" />
                                  Save Changes
                                </>
                              )}
                            </CButton>
                            <CButton 
                              type="button" 
                              color="secondary" 
                              onClick={handleCancelEditLastSchool}
                              disabled={saving}
                            >
                              <CIcon icon={cilX} className="me-1" />
                              Cancel
                            </CButton>
                          </div>
                        </CCol>
                      )}
                    </CRow>
                  </CForm>
              </CTabPane>

              {/* Previous School Tab - Multiple Records */}
              <CTabPane visible={activeTab === 'previousSchool'}>
                <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
                  <h5 className="text-primary mb-0">🎓 Previous School Details</h5>
                  <CButton color="success" size="sm" onClick={handleAddPrevSchool}>
                    ➕ Add New Record
                  </CButton>
                </div>
                
                {success && activeTab === 'previousSchool' && (
                  <CAlert color="success" dismissible onClose={() => setSuccess('')}>
                    {success}
                  </CAlert>
                )}
                {error && activeTab === 'previousSchool' && (
                  <CAlert color="danger" dismissible onClose={() => setError('')}>
                    {error}
                  </CAlert>
                )}
                
                {previousSchoolDetails && previousSchoolDetails.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table table-bordered table-hover">
                      <thead className="table-primary">
                        <tr>
                          <th>School Name</th>
                          <th>Board</th>
                          <th>Medium</th>
                          <th>Passing Year</th>
                          <th>Last Class</th>
                          <th>Marks</th>
                          <th>%/CGPA</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {previousSchoolDetails.map((school, index) => {
                          // Find school name from ID
                          const schoolName = schools.find(s => s.SchoolID == school.SchoolName)?.SchoolCollegeName || school.SchoolName || 'N/A'
                          return (
                            <tr key={index}>
                              <td>{schoolName}</td>
                              <td>{school.EducationBoard || 'N/A'}</td>
                              <td>{school.MediumOfInstruction || 'N/A'}</td>
                              <td>{school.PassingYear || 'N/A'}</td>
                              <td>{school.LastClassPassed || 'N/A'}</td>
                              <td>{school.ObtainedMarks || 0}/{school.TotalMarks || 0}</td>
                              <td>{school.PercentageOrCGPA || 'N/A'}</td>
                              <td>
                                <CButton 
                                  color="primary" 
                                  size="sm" 
                                  onClick={() => handleEditPrevSchool(index)}
                                >
                                  <CIcon icon={cilPencil} className="me-1" />
                                  Edit
                                </CButton>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <CAlert color="info">
                    No previous school records found. Click "Add New Record" to add one.
                  </CAlert>
                )}
              </CTabPane>

              {/* Siblings Tab - Multiple Records */}
              <CTabPane visible={activeTab === 'siblings'}>
                <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
                  <h5 className="text-primary mb-0">👨‍👩‍👧‍👦 Sibling Information</h5>
                  <CButton color="success" size="sm" onClick={handleAddSibling}>
                    ➕ Add Sibling
                  </CButton>
                </div>
                
                {success && activeTab === 'siblings' && (
                  <CAlert color="success" dismissible onClose={() => setSuccess('')}>
                    {success}
                  </CAlert>
                )}
                {error && activeTab === 'siblings' && (
                  <CAlert color="danger" dismissible onClose={() => setError('')}>
                    {error}
                  </CAlert>
                )}
                
                {siblings && siblings.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table table-bordered table-hover">
                      <thead className="table-primary">
                        <tr>
                          <th>#</th>
                          <th>Sibling Student ID</th>
                          <th>Relationship</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {siblings.map((sibling, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{sibling.SiblingStudentId || 'N/A'}</td>
                            <td>{sibling.Relationship || 'N/A'}</td>
                            <td>
                              <CButton 
                                color="primary" 
                                size="sm" 
                                onClick={() => handleEditSibling(index)}
                              >
                                <CIcon icon={cilPencil} className="me-1" />
                                Edit
                              </CButton>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <CAlert color="info">
                    No siblings found. Click "Add Sibling" to add one.
                  </CAlert>
                )}
              </CTabPane>

              {/* Best Friends Tab - Multiple Records */}
              <CTabPane visible={activeTab === 'bestFriends'}>
                <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
                  <h5 className="text-primary mb-0">👥 Best Friends</h5>
                  <CButton color="success" size="sm" onClick={handleAddBestFriend}>
                    ➕ Add Best Friend
                  </CButton>
                </div>
                
                {success && activeTab === 'bestFriends' && (
                  <CAlert color="success" dismissible onClose={() => setSuccess('')}>
                    {success}
                  </CAlert>
                )}
                {error && activeTab === 'bestFriends' && (
                  <CAlert color="danger" dismissible onClose={() => setError('')}>
                    {error}
                  </CAlert>
                )}
                
                {bestFriends && bestFriends.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table table-bordered table-hover">
                      <thead className="table-primary">
                        <tr>
                          <th>#</th>
                          <th>Friend ID</th>
                          <th>Friend Name</th>
                          <th>Friend Mobile</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bestFriends.map((friend, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{friend.FriendId || 'N/A'}</td>
                            <td>{friend.Best_F_Name1 || 'N/A'}</td>
                            <td>{friend.Best_F_Mobile1 || 'N/A'}</td>
                            <td>
                              <CButton 
                                color="primary" 
                                size="sm" 
                                onClick={() => handleEditBestFriend(index)}
                              >
                                <CIcon icon={cilPencil} className="me-1" />
                                Edit
                              </CButton>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <CAlert color="info">
                    No best friends found. Click "Add Best Friend" to add one.
                  </CAlert>
                )}
              </CTabPane>

              {/* Medical Details Tab */}
              <CTabPane visible={activeTab === 'medical'}>
                <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
                  <h5 className="text-primary mb-0">🏥 Medical Details</h5>
                  {!isEditingMedical && (
                    <CButton color="primary" size="sm" onClick={handleEditMedical}>
                      <CIcon icon={cilPencil} className="me-1" />
                      {medicalDetails?.StudentId ? 'Edit' : 'Add Details'}
                    </CButton>
                  )}
                </div>
                
                {success && activeTab === 'medical' && (
                  <CAlert color="success" dismissible onClose={() => setSuccess('')}>
                    {success}
                  </CAlert>
                )}
                {error && activeTab === 'medical' && (
                  <CAlert color="danger" dismissible onClose={() => setError('')}>
                    {error}
                  </CAlert>
                )}
                
                <CForm>
                  <CRow className="g-3">
                    <CCol md={4}>
                      <CFormLabel>Height</CFormLabel>
                      <CFormInput 
                        name="height" 
                        value={medicalFormData.height} 
                        onChange={handleMedicalChange} 
                        disabled={!isEditingMedical}
                        placeholder="Enter height (e.g., 170 cm)"
                      />
                    </CCol>
                    <CCol md={4}>
                      <CFormLabel>Weight</CFormLabel>
                      <CFormInput 
                        name="weight" 
                        value={medicalFormData.weight} 
                        onChange={handleMedicalChange} 
                        disabled={!isEditingMedical}
                        placeholder="Enter weight (e.g., 65 kg)"
                      />
                    </CCol>
                    <CCol md={4}>
                      <CFormLabel>Blood Group</CFormLabel>
                      <CFormSelect
                        name="bloodGroup" 
                        value={medicalFormData.bloodGroup} 
                        onChange={handleMedicalChange} 
                        disabled={!isEditingMedical}
                      >
                        <option value="">Select Blood Group</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                      </CFormSelect>
                    </CCol>
                    
                    {isEditingMedical && (
                      <CCol xs={12}>
                        <div className="d-flex gap-2 justify-content-end">
                          <CButton 
                            color="secondary" 
                            onClick={handleCancelEditMedical}
                            disabled={saving}
                          >
                            <CIcon icon={cilX} className="me-1" />
                            Cancel
                          </CButton>
                          <CButton 
                            color="success" 
                            onClick={handleSaveMedicalDetails}
                            disabled={saving}
                          >
                            {saving ? (
                              <>
                                <CSpinner size="sm" className="me-1" />
                                Saving...
                              </>
                            ) : (
                              <>
                                <CIcon icon={cilSave} className="me-1" />
                                Save Changes
                              </>
                            )}
                          </CButton>
                        </div>
                      </CCol>
                    )}
                  </CRow>
                </CForm>
              </CTabPane>

              {/* Transport Details Tab */}
              <CTabPane visible={activeTab === 'transport'}>
                <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
                  <h5 className="text-primary mb-0">🚌 Transport Details</h5>
                  {!isEditingTransport && (
                    <CButton color="primary" size="sm" onClick={handleEditTransport}>
                      <CIcon icon={cilPencil} className="me-1" />
                      {transportDetails?.StudentId ? 'Edit' : 'Add Details'}
                    </CButton>
                  )}
                </div>
                
                {success && activeTab === 'transport' && (
                  <CAlert color="success" dismissible onClose={() => setSuccess('')}>
                    {success}
                  </CAlert>
                )}
                {error && activeTab === 'transport' && (
                  <CAlert color="danger" dismissible onClose={() => setError('')}>
                    {error}
                  </CAlert>
                )}
                
                <CForm>
                  <CRow className="g-3">
                    <CCol md={4}>
                      <CFormLabel>Transport Required</CFormLabel>
                      <div className="d-flex align-items-center" style={{ height: '38px' }}>
                        <CFormCheck
                          type="checkbox"
                          name="transportYesNo"
                          checked={transportFormData.transportYesNo}
                          onChange={handleTransportChange}
                          disabled={!isEditingTransport}
                          label="Yes, I need transport"
                        />
                      </div>
                    </CCol>
                    <CCol md={4}>
                      <CFormLabel>Route</CFormLabel>
                      <CFormSelect
                        name="routeId" 
                        value={transportFormData.routeId} 
                        onChange={handleTransportChange} 
                        disabled={!isEditingTransport || !transportFormData.transportYesNo}
                      >
                        <option value="">Select Route</option>
                        {transportRoutes.map(route => (
                          <option key={route.RouteId} value={route.RouteId}>
                            {route.RouteName}
                          </option>
                        ))}
                      </CFormSelect>
                    </CCol>
                    <CCol md={4}>
                      <CFormLabel>Stop</CFormLabel>
                      <CFormSelect
                        name="stopId" 
                        value={transportFormData.stopId} 
                        onChange={handleTransportChange} 
                        disabled={!isEditingTransport || !transportFormData.transportYesNo || !transportFormData.routeId}
                      >
                        <option value="">Select Stop</option>
                        {transportStops.map(stop => (
                          <option key={stop.StopId} value={stop.StopId}>
                            {stop.StopName}
                          </option>
                        ))}
                      </CFormSelect>
                    </CCol>
                    
                    {isEditingTransport && (
                      <CCol xs={12}>
                        <div className="d-flex gap-2 justify-content-end">
                          <CButton 
                            color="secondary" 
                            onClick={handleCancelEditTransport}
                            disabled={saving}
                          >
                            <CIcon icon={cilX} className="me-1" />
                            Cancel
                          </CButton>
                          <CButton 
                            color="success" 
                            onClick={handleSaveTransportDetails}
                            disabled={saving}
                          >
                            {saving ? (
                              <>
                                <CSpinner size="sm" className="me-1" />
                                Saving...
                              </>
                            ) : (
                              <>
                                <CIcon icon={cilSave} className="me-1" />
                                Save Changes
                              </>
                            )}
                          </CButton>
                        </div>
                      </CCol>
                    )}
                  </CRow>
                </CForm>
              </CTabPane>

              {/* Academic Info Tab */}
              <CTabPane visible={activeTab === 'academic'}>
                <h5 className="text-primary mb-4 border-bottom pb-2">🎓 Academic Details</h5>
                <CRow>
                  <InfoRow label="Admission Number" value={profileData?.admissionno} />
                  <InfoRow label="Student ID" value={profileData?.studentid} />
                  <InfoRow label="Branch" value={profileData?.Branchname} />
                  <InfoRow label="Course ID" value={profileData?.courseid} />
                  <InfoRow label="University ID" value={profileData?.universityid} />
                  <InfoRow label="Course Type ID" value={profileData?.coursetypeid} />
                  <InfoRow label="Batch ID" value={profileData?.batchid} />
                  <InfoRow label="Semester ID" value={profileData?.semesterid} />
                  <InfoRow label="All Semesters" value={profileData?.allsemesters} />
                  <InfoRow label="Section" value={profileData?.section} />
                  <InfoRow label="Specialisation" value={profileData?.specialisation} />
                  <InfoRow label="Specialisation 2" value={profileData?.specialisation2} />
                  <InfoRow label="Fee Category ID" value={profileData?.feescategoryid} />
                  <InfoRow label="Fee Submitted" value={profileData?.feesubmitted ? 'Yes' : 'No'} />
                  <InfoRow label="Total Fee Paid" value={profileData?.TotalFeePaid} />
                  <InfoRow label="Confirmation Date" value={formatDate(profileData?.confirmationdate)} />
                  <InfoRow label="TSRN" value={profileData?.tsrn} />
                  <InfoRow label="PES No" value={profileData?.PES_No} />
                  <InfoRow label="SDMS ID" value={profileData?.SDMSID} />
                  <InfoRow label="Form No" value={profileData?.formno} />
                  <InfoRow label="App No" value={profileData?.appno} />
                  <InfoRow label="Category" value={profileData?.category} />
                  <InfoRow label="Punch Code" value={profileData?.punchcode} />
                  <InfoRow label="Is Active" value={profileData?.isactive ? 'Yes' : 'No'} />
                  <InfoRow label="Status" value={profileData?.status ? 'Active' : 'Inactive'} />
                </CRow>
              </CTabPane>
            </CTabContent>
          </CCardBody>
        </CCardBody>
      </CCard>

      {/* Add New School Modal */}
      <CModal visible={showAddSchoolModal} onClose={() => setShowAddSchoolModal(false)} size="lg">
        <CModalHeader>
          <CModalTitle>Add New School/College</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow className="g-3">
            <CCol md={12}>
              <CFormLabel>School/College Name <span className="text-danger">*</span></CFormLabel> 
              <CFormInput 
                name="schoolCollegeName" 
                value={newSchoolData.schoolCollegeName} 
                onChange={handleNewSchoolChange} 
                placeholder="Enter school/college name"
                required
              />
            </CCol>
            <CCol md={6}>
              <CFormLabel>Country</CFormLabel>
              <CFormInput 
                name="country" 
                value={newSchoolData.country} 
                onChange={handleNewSchoolChange} 
                placeholder="Enter country"
              />
            </CCol>
            <CCol md={6}>
              <CFormLabel>State</CFormLabel>
              <CFormInput 
                name="state" 
                value={newSchoolData.state} 
                onChange={handleNewSchoolChange} 
                placeholder="Enter state"
              />
            </CCol>
            <CCol md={6}>
              <CFormLabel>District</CFormLabel>
              <CFormInput 
                name="district" 
                value={newSchoolData.district} 
                onChange={handleNewSchoolChange} 
                placeholder="Enter district"
              />
            </CCol>
            <CCol md={6}>
              <CFormLabel>Area</CFormLabel>
              <CFormInput 
                name="area" 
                value={newSchoolData.area} 
                onChange={handleNewSchoolChange} 
                placeholder="Enter area"
              />
            </CCol>
            <CCol md={4}>
              <CFormLabel>Pincode</CFormLabel>
              <CFormInput 
                name="pincode" 
                value={newSchoolData.pincode} 
                onChange={handleNewSchoolChange} 
                placeholder="Enter pincode"
              />
            </CCol>
            <CCol md={4}>
              <CFormLabel>Contact No.</CFormLabel>
              <CFormInput 
                name="contactNo" 
                value={newSchoolData.contactNo} 
                onChange={handleNewSchoolChange} 
                placeholder="Enter contact number"
              />
            </CCol>
            <CCol md={4}>
              <CFormLabel>Email ID</CFormLabel>
              <CFormInput 
                type="email"
                name="emailID" 
                value={newSchoolData.emailID} 
                onChange={handleNewSchoolChange} 
                placeholder="Enter email"
              />
            </CCol>
            <CCol md={12}>
              <CFormLabel>Website</CFormLabel>
              <CFormInput 
                name="website" 
                value={newSchoolData.website} 
                onChange={handleNewSchoolChange} 
                placeholder="Enter website URL"
              />
            </CCol>
          </CRow>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowAddSchoolModal(false)}>
            Cancel
          </CButton>
          <CButton color="primary" onClick={handleAddNewSchool} disabled={saving || !newSchoolData.schoolCollegeName}>
            {saving ? (
              <>
                <CSpinner size="sm" className="me-1" />
                Adding...
              </>
            ) : (
              'Add School'
            )}
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Add/Edit Previous School Modal */}
      <CModal visible={showAddPrevSchoolModal} onClose={() => setShowAddPrevSchoolModal(false)} size="lg">
        <CModalHeader>
          <CModalTitle>
            {editingPrevSchoolIndex !== null ? 'Edit Previous School Details' : 'Add Previous School Details'}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow className="g-3">
            <CCol md={6}>
              <CFormLabel>School/College Name <span className="text-danger">*</span></CFormLabel> 
              <CFormSelect 
                name="schoolId" 
                value={prevSchoolFormData.schoolId} 
                onChange={handlePrevSchoolSelectChange} 
                required
              >
                <option value="">Select School/College</option>
                {schools.map(school => (
                  <option key={school.SchoolID} value={school.SchoolID}>
                    {school.SchoolCollegeName}
                  </option>
                ))}
                <option value="add_new" style={{fontWeight: 'bold', color: '#0d6efd'}}>
                  ➕ Add New School
                </option>
              </CFormSelect>
            </CCol>
            <CCol md={6}>
              <CFormLabel>Education Board</CFormLabel>
              <CFormInput 
                name="educationBoard" 
                value={prevSchoolFormData.educationBoard} 
                onChange={handlePrevSchoolChange} 
                placeholder="Enter board"
              />
            </CCol>
            <CCol md={4}>
              <CFormLabel>Medium of Instruction</CFormLabel>
              <CFormInput 
                name="mediumOfInstruction" 
                value={prevSchoolFormData.mediumOfInstruction} 
                onChange={handlePrevSchoolChange} 
                placeholder="Enter medium"
              />
            </CCol>
            <CCol md={4}>
              <CFormLabel>TC Number</CFormLabel>
              <CFormInput 
                name="tcNumber" 
                value={prevSchoolFormData.tcNumber} 
                onChange={handlePrevSchoolChange} 
                placeholder="Enter TC number"
              />
            </CCol>
            <CCol md={4}>
              <CFormLabel>Roll Number</CFormLabel>
              <CFormInput 
                name="rollNumber" 
                value={prevSchoolFormData.rollNumber} 
                onChange={handlePrevSchoolChange} 
                placeholder="Enter roll number"
              />
            </CCol>
            <CCol md={4}>
              <CFormLabel>Passing Year</CFormLabel>
              <CFormInput 
                type="number"
                name="passingYear" 
                value={prevSchoolFormData.passingYear} 
                onChange={handlePrevSchoolChange} 
                placeholder="Enter year"
              />
            </CCol>
            <CCol md={4}>
              <CFormLabel>Last Class Passed</CFormLabel>
              <CFormInput 
                name="lastClassPassed" 
                value={prevSchoolFormData.lastClassPassed} 
                onChange={handlePrevSchoolChange} 
                placeholder="Enter last class"
              />
            </CCol>
            <CCol md={4}>
              <CFormLabel>Total Marks</CFormLabel>
              <CFormInput 
                type="number"
                name="totalMarks" 
                value={prevSchoolFormData.totalMarks} 
                onChange={handlePrevSchoolChange} 
                placeholder="Enter total marks"
              />
            </CCol>
            <CCol md={4}>
              <CFormLabel>Obtained Marks</CFormLabel>
              <CFormInput 
                type="number"
                name="obtainedMarks" 
                value={prevSchoolFormData.obtainedMarks} 
                onChange={handlePrevSchoolChange} 
                placeholder="Enter obtained marks"
              />
            </CCol>
            <CCol md={4}>
              <CFormLabel>%/CGPA</CFormLabel>
              <CFormInput 
                name="percentageOrCGPA" 
                value={prevSchoolFormData.percentageOrCGPA} 
                onChange={handlePrevSchoolChange} 
                placeholder="Enter percentage/CGPA"
              />
            </CCol>
            <CCol md={12}>
              <CFormLabel>Reason For School Change</CFormLabel>
              <CFormTextarea 
                name="reasonForChange" 
                value={prevSchoolFormData.reasonForChange} 
                onChange={handlePrevSchoolChange} 
                rows={2}
                placeholder="Enter reason for change"
              />
            </CCol>
          </CRow>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowAddPrevSchoolModal(false)}>
            Cancel
          </CButton>
          <CButton color="primary" onClick={handleSavePrevSchool} disabled={saving || !prevSchoolFormData.schoolId}>
            {saving ? (
              <>
                <CSpinner size="sm" className="me-1" />
                {editingPrevSchoolIndex !== null ? 'Updating...' : 'Adding...'}
              </>
            ) : (
              editingPrevSchoolIndex !== null ? 'Update Record' : 'Add Record'
            )}
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Add/Edit Sibling Modal */}
      <CModal visible={showAddSiblingModal} onClose={() => setShowAddSiblingModal(false)}>
        <CModalHeader>
          <CModalTitle>
            {editingSiblingIndex !== null ? 'Edit Sibling' : 'Add Sibling'}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow className="g-3">
            <CCol md={12}>
              <CFormLabel>Sibling Student ID <span className="text-danger">*</span></CFormLabel> 
              <CFormInput 
                type="number"
                name="siblingStudentId" 
                value={siblingFormData.siblingStudentId} 
                onChange={handleSiblingChange} 
                placeholder="Enter sibling student ID"
                required
              />
            </CCol>
            <CCol md={12}>
              <CFormLabel>Relationship <span className="text-danger">*</span></CFormLabel> 
              <CFormSelect
                name="relationship" 
                value={siblingFormData.relationship} 
                onChange={handleSiblingChange} 
                required
              >
                <option value="">Select Relationship</option>
                <option value="Brother">Brother</option>
                <option value="Sister">Sister</option>
                <option value="Half-Brother">Half-Brother</option>
                <option value="Half-Sister">Half-Sister</option>
                <option value="Step-Brother">Step-Brother</option>
                <option value="Step-Sister">Step-Sister</option>
              </CFormSelect>
            </CCol>
          </CRow>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowAddSiblingModal(false)}>
            Cancel
          </CButton>
          <CButton 
            color="primary" 
            onClick={handleSaveSibling} 
            disabled={saving || !siblingFormData.siblingStudentId || !siblingFormData.relationship}
          >
            {saving ? (
              <>
                <CSpinner size="sm" className="me-1" />
                {editingSiblingIndex !== null ? 'Updating...' : 'Adding...'}
              </>
            ) : (
              editingSiblingIndex !== null ? 'Update Sibling' : 'Add Sibling'
            )}
          </CButton>
        </CModalFooter>
      </CModal>

      {/* Add/Edit Best Friend Modal */}
      <CModal visible={showAddBestFriendModal} onClose={() => setShowAddBestFriendModal(false)}>
        <CModalHeader>
          <CModalTitle>
            {editingBestFriendIndex !== null ? 'Edit Best Friend' : 'Add Best Friend'}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow className="g-3">
            <CCol md={12}>
              <CFormLabel>Friend ID <span className="text-danger">*</span></CFormLabel> 
              <CFormInput 
                type="number"
                name="friendId" 
                value={bestFriendFormData.friendId} 
                onChange={handleBestFriendChange} 
                placeholder="Enter friend ID"
                required
              />
            </CCol>
            <CCol md={12}>
              <CFormLabel>Friend Name <span className="text-danger">*</span></CFormLabel> 
              <CFormInput 
                name="friendName" 
                value={bestFriendFormData.friendName} 
                onChange={handleBestFriendChange} 
                placeholder="Enter friend name"
                required
              />
            </CCol>
            <CCol md={12}>
              <CFormLabel>Friend Mobile <span className="text-danger">*</span></CFormLabel> 
              <CFormInput 
                name="friendMobile" 
                value={bestFriendFormData.friendMobile} 
                onChange={handleBestFriendChange} 
                placeholder="Enter friend mobile"
                required
              />
            </CCol>
          </CRow>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowAddBestFriendModal(false)}>
            Cancel
          </CButton>
          <CButton 
            color="primary" 
            onClick={handleSaveBestFriend} 
            disabled={saving || !bestFriendFormData.friendId || !bestFriendFormData.friendName || !bestFriendFormData.friendMobile}
          >
            {saving ? (
              <>
                <CSpinner size="sm" className="me-1" />
                {editingBestFriendIndex !== null ? 'Updating...' : 'Adding...'}
              </>
            ) : (
              editingBestFriendIndex !== null ? 'Update Friend' : 'Add Friend'
            )}
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  )
}

export default UpdateStudentProfile
