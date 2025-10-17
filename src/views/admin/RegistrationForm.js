import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CCard, CCardBody, CCardHeader, CCol, CRow, CNav, CNavItem, CNavLink,
  CTabContent, CTabPane, CButton, CForm, CFormInput, CFormSelect,
  CFormLabel, CFormTextarea, CAlert, CSpinner, CFormCheck,
  CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilSave, cilArrowLeft, cilX } from '@coreui/icons'
import {
  getOrganizations, getCollegesByOrganization, getBranchesByCollege,
  getCourseTypesByCollege, getUniversitiesByCourseType, getBatchesByUniversity,
  getCoursesByBatch, getSectionsByCourse, getSRN, getNationalities,
  getMotherTongues, getCasteCategories, getSubCategories, getReligions,
  insertStudentAdministration, insertParentDetails, updateStudentDetails,
  submitAddressDetails, insertLastSchoolDetails, getSchoolMasterDropdown,
  insertPreviousSchoolDetails, addSibling, addBestFriend, insertMedicalRecord,
  insertTransportDetails, getTransportRoutes, getTransportStops, getCountries,
  getStatesByCountry, getDistrictsByState, getAreasByDistrict, insertSchoolDetails
} from '../../api/api'

const RegistrationForm = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('administration')
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [studentId, setStudentId] = useState(null) // Store StudentID after administration submission
  const [sameAsPermanent, setSameAsPermanent] = useState(false) // Correspondence same as permanent
  const [guardianSameAsPermanent, setGuardianSameAsPermanent] = useState(false) // Guardian same as permanent
  const [showAddSchoolModal, setShowAddSchoolModal] = useState(false)
  const [schoolModalSource, setSchoolModalSource] = useState('lastSchool') // Track which field opened the modal
  const [newSchoolData, setNewSchoolData] = useState({
    schoolName: '',
    schoolCountry: '',
    schoolState: '',
    schoolDistrict: '',
    schoolArea: '',
    schoolPincode: '',
    schoolContactNo: '',
    schoolEmailId: '',
    schoolWebsite: ''
  })
  
  // Dropdown data states
  const [organizations, setOrganizations] = useState([])
  const [colleges, setColleges] = useState([])
  const [branches, setBranches] = useState([])
  const [courseTypes, setCourseTypes] = useState([])
  const [universities, setUniversities] = useState([])
  const [batches, setBatches] = useState([])
  const [courses, setCourses] = useState([])
  const [sections, setSections] = useState([])
  const [nationalities, setNationalities] = useState([])
  const [motherTongues, setMotherTongues] = useState([])
  const [categories, setCategories] = useState([])
  const [subCategories, setSubCategories] = useState([])
  const [religions, setReligions] = useState([])
  const [schools, setSchools] = useState([])
  const [routes, setRoutes] = useState([])
  const [stops, setStops] = useState([])
  const [countries, setCountries] = useState([])
  const [pStates, setPStates] = useState([])
  const [pDistricts, setPDistricts] = useState([])
  const [pAreas, setPAreas] = useState([])
  const [cStates, setCStates] = useState([])
  const [cDistricts, setCDistricts] = useState([])
  const [cAreas, setCAreas] = useState([])
  const [gStates, setGStates] = useState([])
  const [gDistricts, setGDistricts] = useState([])
  const [gAreas, setGAreas] = useState([])
  const [previousSchoolsList, setPreviousSchoolsList] = useState([])
  const [siblingsList, setSiblingsList] = useState([])
  const [bestFriendsList, setBestFriendsList] = useState([])
  const [mobileErrors, setMobileErrors] = useState({
    mobileNumber1: '',
    mobileNumber2: '',
    mobileNumber3: ''
  })

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const day = String(today.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const [formData, setFormData] = useState({
    // Administration Details
    dateOfAdmission: getTodayDate(), feeCategory: '', organizationName: '', collegeName: '', branch: '',
    courseType: '', university: '', financialYear: '', course: '', batchId: '', section: '',
    studentName: '', mobileNumber1: '', studentRegistrationNumber: '', studentUniversityNumber: '',
    mobileNumber2: '', mobileNumber3: '',
    
    // Student Details
    emailId: '', gender: '', dateOfBirth: '', nationality: '', birthplace: '', motherTongue: '',
    category: '', subCategory: '', minority: '', religion: '', bloodGroup: '', adharCardNumber: '',
    domicile: '', panNo: '',
    
    // Parent and Guardian Details
    fatherName: '', fatherMobileAdmission: '', fatherContactNo: '', fatherEmailId: '', fatherAdharNo: '',
    fatherQualification: '', fatherProfession: '', fatherCompanyName: '', fatherOfficeAddress: '',
    fatherDesignation: '', familyIncome: '', motherName: '', motherContactNumber: '', motherMobileAdmission: '',
    motherEmailId: '', motherQualification: '', motherProfession: '', motherOfficeAddress: '', guardianName: '',
    guardianMobileAdmission: '', guardianMobileNo: '', guardianEmailId: '', relationWithStudent: '', 
    spouseName: '', spouseContactNo: '', spouseMobileAdmission: '', spouseEmailId: '', spouseQualification: '',
    spouseProfession: '', spouseOfficeAddress: '',
    
    // Login Details
    studentUserId: '', studentPassword: '', parentLoginId: '', parentPassword: '',
    
    // Address Details
    pCountry: '', pState: '', pDistrict: '', pArea: '', pPincode: '', pAddress: '',
    cCountry: '', cState: '', cDistrict: '', cArea: '', cPincode: '', cAddress: '',
    gCountry: '', gState: '', gDistrict: '', gArea: '', gPincode: '', gAddress: '',
    
    // Last School
    schoolCollege: '', schoolPrincipalName: '', schoolMobileNo: '', schoolEmailId: '',
    bestSchoolTeacherName: '', bestSchoolTeacherMobile: '', bestSchoolTeacherEmail: '',
    bestCoachingTeacherName: '', bestCoachingTeacherMobile: '', bestCoachingTeacherEmail: '',
    
    // Previous School Details
    prevSchoolCollegeName: '', educationBoard: '', mediumOfInstruction: '', tcNumber: '',
    rollNumber: '', passingYear: '', lastClassPassed: '', totalMarks: '', obtainedMarks: '',
    percentageCgpa: '', reasonForSchoolChange: '',
    
    // School List / School Master
    schoolMasterName: '', schoolCountry: '', schoolState: '', schoolDistrict: '', schoolArea: '',
    schoolPincode: '', schoolContactNo: '', schoolEmailId: '', schoolWebsite: '',
    
    // Sibling & Best Friend
    siblingId: '', siblingRelationship: '', friendId: '', friendName: '', friendMobile: '',
    
    // Medical Records
    height: '', weight: '', medicalBloodGroup: '',
    
    // Transport
    transportYesNo: '', routeId: '', stopId: '',
  })

  // Load initial master data
  useEffect(() => {
    const loadMasterData = async () => {
      try {
        const [orgsData, natsData, tonguesData, catsData, relsData, schoolsData, routesData, countriesData] = await Promise.all([
          getOrganizations(),
          getNationalities(),
          getMotherTongues(),
          getCasteCategories(),
          getReligions(),
          getSchoolMasterDropdown(),
          getTransportRoutes(),
          getCountries()
        ])
        setOrganizations(orgsData || [])
        setNationalities(natsData || [])
        setMotherTongues(tonguesData || [])
        setCategories(catsData || [])
        setReligions(relsData || [])
        setSchools(schoolsData || [])
        setRoutes(routesData || [])
        setCountries(countriesData || [])
      } catch (err) {
        console.error('Error loading master data:', err)
        setError('Failed to load master data')
      }
    }
    loadMasterData()
  }, [])

  // Load colleges when organization changes
  useEffect(() => {
    if (formData.organizationName) {
      getCollegesByOrganization(formData.organizationName)
        .then(data => setColleges(data || []))
        .catch(err => console.error('Error loading colleges:', err))
    } else {
      setColleges([])
    }
  }, [formData.organizationName])

  // Load branches and course types when college changes
  useEffect(() => {
    if (formData.collegeName) {
      Promise.all([
        getBranchesByCollege(formData.collegeName),
        getCourseTypesByCollege(formData.collegeName)
      ])
        .then(([branchesData, courseTypesData]) => {
          setBranches(branchesData || [])
          setCourseTypes(courseTypesData || [])
        })
        .catch(err => console.error('Error loading branches/course types:', err))
    } else {
      setBranches([])
      setCourseTypes([])
    }
  }, [formData.collegeName])

  // Load universities when course type changes
  useEffect(() => {
    if (formData.courseType) {
      getUniversitiesByCourseType(formData.courseType)
        .then(data => setUniversities(data || []))
        .catch(err => console.error('Error loading universities:', err))
    } else {
      setUniversities([])
    }
  }, [formData.courseType])

  // Load batches when university changes
  useEffect(() => {
    if (formData.courseType && formData.university) {
      getBatchesByUniversity(formData.courseType, formData.university)
        .then(data => setBatches(data || []))
        .catch(err => console.error('Error loading batches:', err))
    } else {
      setBatches([])
    }
  }, [formData.courseType, formData.university])

  // Load courses when batch changes
  useEffect(() => {
    if (formData.courseType && formData.university && formData.batchId) {
      getCoursesByBatch(formData.courseType, formData.university, formData.batchId)
        .then(data => {
          setCourses(data?.Courses || [])
        })
        .catch(err => console.error('Error loading courses:', err))
    } else {
      setCourses([])
    }
  }, [formData.courseType, formData.university, formData.batchId])

  // Load sections when course changes
  useEffect(() => {
    if (formData.courseType && formData.university && formData.batchId && formData.course) {
      getSectionsByCourse(formData.courseType, formData.university, formData.batchId, formData.course)
        .then(data => {
          setSections(data?.Sections || [])
        })
        .catch(err => console.error('Error loading sections:', err))
    } else {
      setSections([])
    }
  }, [formData.courseType, formData.university, formData.batchId, formData.course])

  // Load sub-categories when category changes
  useEffect(() => {
    if (formData.category) {
      getSubCategories(formData.category)
        .then(data => setSubCategories(data || []))
        .catch(err => console.error('Error loading sub-categories:', err))
    } else {
      setSubCategories([])
    }
  }, [formData.category])

  // Auto-generate SRN when all required fields are filled
  useEffect(() => {
    if (formData.collegeName && formData.courseType && formData.university && formData.batchId) {
      getSRN({
        collegeId: formData.collegeName,
        courseTypeId: formData.courseType,
        universityId: formData.university,
        batchId: formData.batchId
      })
        .then(data => {
          if (data?.srn) {
            setFormData(prev => ({ 
              ...prev, 
              studentRegistrationNumber: data.srn,
              studentPassword: data.srn // Set password as SRN
            }))
          }
        })
        .catch(err => console.error('Error generating SRN:', err))
    }
  }, [formData.collegeName, formData.courseType, formData.university, formData.batchId])

  // Auto-generate college email when first name and SRN are available
  useEffect(() => {
    if (formData.studentName && formData.studentRegistrationNumber) {
      const firstName = formData.studentName.split(' ')[0].toLowerCase()
      const collegeEmail = `${firstName}.${formData.studentRegistrationNumber}@atm.edu.in`
      setFormData(prev => ({ ...prev, emailId: collegeEmail }))
    }
  }, [formData.studentName, formData.studentRegistrationNumber])

  // Load stops when route changes
  useEffect(() => {
    if (formData.routeId) {
      getTransportStops(formData.routeId)
        .then(data => setStops(data || []))
        .catch(err => console.error('Error loading stops:', err))
    } else {
      setStops([])
    }
  }, [formData.routeId])

  // Load Permanent Address cascading dropdowns
  useEffect(() => {
    if (formData.pCountry) {
      getStatesByCountry(formData.pCountry)
        .then(data => setPStates(data || []))
        .catch(err => console.error('Error loading P states:', err))
    } else {
      setPStates([])
    }
  }, [formData.pCountry])

  useEffect(() => {
    if (formData.pState) {
      getDistrictsByState(formData.pState)
        .then(data => setPDistricts(data || []))
        .catch(err => console.error('Error loading P districts:', err))
    } else {
      setPDistricts([])
    }
  }, [formData.pState])

  useEffect(() => {
    if (formData.pDistrict) {
      getAreasByDistrict(formData.pDistrict)
        .then(data => setPAreas(data || []))
        .catch(err => console.error('Error loading P areas:', err))
    } else {
      setPAreas([])
    }
  }, [formData.pDistrict])

  // Load Correspondence Address cascading dropdowns
  useEffect(() => {
    if (formData.cCountry) {
      getStatesByCountry(formData.cCountry)
        .then(data => setCStates(data || []))
        .catch(err => console.error('Error loading C states:', err))
    } else {
      setCStates([])
    }
  }, [formData.cCountry])

  useEffect(() => {
    if (formData.cState) {
      getDistrictsByState(formData.cState)
        .then(data => setCDistricts(data || []))
        .catch(err => console.error('Error loading C districts:', err))
    } else {
      setCDistricts([])
    }
  }, [formData.cState])

  useEffect(() => {
    if (formData.cDistrict) {
      getAreasByDistrict(formData.cDistrict)
        .then(data => setCAreas(data || []))
        .catch(err => console.error('Error loading C areas:', err))
    } else {
      setCAreas([])
    }
  }, [formData.cDistrict])

  // Load Guardian Address cascading dropdowns
  useEffect(() => {
    if (formData.gCountry) {
      getStatesByCountry(formData.gCountry)
        .then(data => setGStates(data || []))
        .catch(err => console.error('Error loading G states:', err))
    } else {
      setGStates([])
    }
  }, [formData.gCountry])

  useEffect(() => {
    if (formData.gState) {
      getDistrictsByState(formData.gState)
        .then(data => setGDistricts(data || []))
        .catch(err => console.error('Error loading G districts:', err))
    } else {
      setGDistricts([])
    }
  }, [formData.gState])

  useEffect(() => {
    if (formData.gDistrict) {
      getAreasByDistrict(formData.gDistrict)
        .then(data => setGAreas(data || []))
        .catch(err => console.error('Error loading G areas:', err))
    } else {
      setGAreas([])
    }
  }, [formData.gDistrict])

  // Validate mobile number
  const validateMobileNumber = (value) => {
    if (!value) return '' // Empty is okay for optional fields
    
    // Remove any spaces or special characters
    const cleanValue = value.replace(/\s|-/g, '')
    
    // Check if it's numeric
    if (!/^\d+$/.test(cleanValue)) {
      return 'Mobile number must contain only digits'
    }
    
    // Check length
    if (cleanValue.length !== 10) {
      return 'Mobile number must be exactly 10 digits'
    }
    
    // Check if it starts with 6-9
    if (!/^[6-9]/.test(cleanValue)) {
      return 'Mobile number must start with 6, 7, 8, or 9'
    }
    
    return '' // Valid
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Validate mobile numbers
    if (name === 'mobileNumber1' || name === 'mobileNumber2' || name === 'mobileNumber3') {
      const error = validateMobileNumber(value)
      setMobileErrors(prev => ({ ...prev, [name]: error }))
    }
  }

  // Handle "Same as Permanent Address" for Correspondence
  const handleSameAsPermanent = (e) => {
    const checked = e.target.checked
    setSameAsPermanent(checked)
    
    if (checked) {
      setFormData(prev => ({
        ...prev,
        cCountry: prev.pCountry,
        cState: prev.pState,
        cDistrict: prev.pDistrict,
        cArea: prev.pArea,
        cPincode: prev.pPincode,
        cAddress: prev.pAddress
      }))
    }
  }

  // Handle "Same as Permanent Address" for Guardian
  const handleGuardianSameAsPermanent = (e) => {
    const checked = e.target.checked
    setGuardianSameAsPermanent(checked)
    
    if (checked) {
      setFormData(prev => ({
        ...prev,
        gCountry: prev.pCountry,
        gState: prev.pState,
        gDistrict: prev.pDistrict,
        gArea: prev.pArea,
        gPincode: prev.pPincode,
        gAddress: prev.pAddress
      }))
    }
  }

  const handleSubmit = async (e, action = 'next') => {
    e.preventDefault()
    
    // Validate all mobile numbers before submitting
    const mobile1Error = validateMobileNumber(formData.mobileNumber1)
    const mobile2Error = validateMobileNumber(formData.mobileNumber2)
    const mobile3Error = validateMobileNumber(formData.mobileNumber3)
    
    // Check if mobileNumber1 is required and valid
    if (!formData.mobileNumber1) {
      setError('Mobile Number 1 is required')
      return
    }
    
    if (mobile1Error) {
      setError(`Mobile Number 1: ${mobile1Error}`)
      setMobileErrors(prev => ({ ...prev, mobileNumber1: mobile1Error }))
      return
    }
    
    if (mobile2Error) {
      setError(`Mobile Number 2: ${mobile2Error}`)
      setMobileErrors(prev => ({ ...prev, mobileNumber2: mobile2Error }))
      return
    }
    
    if (mobile3Error) {
      setError(`Mobile Number 3: ${mobile3Error}`)
      setMobileErrors(prev => ({ ...prev, mobileNumber3: mobile3Error }))
      return
    }
    
    setLoading(true)
    setError('')
    setSuccess('')
    
    try {
      // Split student name into first, middle, last
      const nameParts = formData.studentName.trim().split(' ')
      const firstName = nameParts[0] || ''
      const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : ''
      const middleName = nameParts.length > 2 ? nameParts.slice(1, -1).join(' ') : ''
      
      // Prepare payload for API
      const payload = {
        DateOfAdmission: formData.dateOfAdmission,
        FeeCategoryId: parseInt(formData.feeCategory) || 0,
        OrganizationId: parseInt(formData.organizationName) || 0,
        CollegeId: parseInt(formData.collegeName) || 0,
        BranchId: parseInt(formData.branch) || 0,
        CourseTypeId: parseInt(formData.courseType) || 0,
        UniversityId: parseInt(formData.university) || 0,
        FinancialYearId: parseInt(formData.financialYear) || 0,
        CourseId: parseInt(formData.course) || 0,
        BatchId: parseInt(formData.batchId) || 0,
        SectionId: parseInt(formData.section) || 0,
        FirstName: firstName,
        MiddleName: middleName,
        LastName: lastName,
        MobileNo1: formData.mobileNumber1,
        MobileNo2: formData.mobileNumber2 || '',
        MobileNo3: formData.mobileNumber3 || '',
        AdmissionNo: formData.studentRegistrationNumber,
        StudentId: formData.studentUniversityNumber || ''
      }
      
      console.log('Submitting Administration Data:', payload)
      
      // Call API
      const response = await insertStudentAdministration(payload)
      
      console.log('API Response:', response)
      
      // Display success message with returned data
      if (response) {
        // Store StudentID for parent details submission
        if (response.StudentID) {
          setStudentId(response.StudentID)
        }
        
        const successMsg = `
          ✅ ${response.Message || 'Student administration details submitted successfully!'}
          
          📋 Details:
          • Student ID: ${response.StudentID || 'N/A'}
          • Inserted Row ID: ${response.InsertedRowID || 'N/A'}
          • College Email: ${response.CollegeEmail || formData.emailId}
          • SRN: ${formData.studentRegistrationNumber}
          
          ${action === 'submit' ? '🔄 Form will be reset for new entry.' : '➡️ Moving to next tab...'}
        `
        setSuccess(successMsg)
        
        // Update form with returned data if available
        if (response.CollegeEmail) {
          setFormData(prev => ({ ...prev, emailId: response.CollegeEmail }))
        }
        
        // Handle action based on button clicked
        if (action === 'submit') {
          // Reset form after 2 seconds
          setTimeout(() => {
            handleReset(true) // Pass true to skip confirmation
            setSuccess('')
          }, 2000)
        } else if (action === 'next') {
          // Navigate to next tab after 2 seconds
          setTimeout(() => {
            setActiveTab('studentDetails')
            setSuccess('')
          }, 2000)
        }
      }
      
    } catch (err) {
      console.error('Error submitting registration:', err)
      setError(err.response?.data?.message || err.message || 'Failed to submit registration. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleStudentDetailsSubmit = async () => {
    if (!studentId) {
      setError('Please submit Administration details first.')
      return
    }
    
    setLoading(true)
    setError('')
    setSuccess('')
    
    try {
      const payload = {
        StudentId: studentId,
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
      
      const response = await updateStudentDetails(payload)
      setSuccess(`✅ ${response.message || 'Student details updated successfully!'}`)
      setTimeout(() => { setActiveTab('parentGuardian'); setSuccess('') }, 2000)
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update student details.')
    } finally {
      setLoading(false)
    }
  }

  const handleParentSubmit = async (e) => {
    e.preventDefault()
    
    if (!studentId) {
      setError('Please submit Administration details first to get Student ID.')
      return
    }
    
    setLoading(true)
    setError('')
    setSuccess('')
    
    try {
      const payload = {
        StudentId: studentId,
        FatherName: formData.fatherName || '',
        FatherMobile_Admission: formData.fatherMobileAdmission || '',
        FatherContactNo: formData.fatherContactNo || '',
        FatherEmailId: formData.fatherEmailId || '',
        FatherAadharNo: formData.fatherAdharNo || '',
        FatherQualification: formData.fatherQualification || '',
        FatherProfession: formData.fatherProfession || '',
        FatherCompanyName: formData.fatherCompanyName || '',
        FatherOfficeAddress: formData.fatherOfficeAddress || '',
        FatherDesignation: formData.fatherDesignation || '',
        FamilyIncome: parseFloat(formData.familyIncome) || 0,
        MotherName: formData.motherName || '',
        MotherContactNo: formData.motherContactNumber || '',
        MotherMobile_Admission: formData.motherMobileAdmission || '',
        MotherEmailId: formData.motherEmailId || '',
        MotherQualification: formData.motherQualification || '',
        MotherProfession: formData.motherProfession || '',
        MotherOfficeAddress: formData.motherOfficeAddress || '',
        GuardianName: formData.guardianName || '',
        GuardianMobile_Admission: formData.guardianMobileAdmission || '',
        GuardianMobileNo: formData.guardianMobileNo || '',
        GuardianEmailId: formData.guardianEmailId || '',
        RelationWithStudent: formData.relationWithStudent || '',
        SpouseName: formData.spouseName || '',
        SpouseContactNo: formData.spouseContactNo || '',
        SpouseMObile_Admission: formData.spouseMobileAdmission || '',
        SpouseEmailId: formData.spouseEmailId || '',
        SpouseQualification: formData.spouseQualification || '',
        SpouseProfession: formData.spouseProfession || '',
        SpouseOfficeAddress: formData.spouseOfficeAddress || ''
      }
      
      const response = await insertParentDetails(payload)
      setSuccess(`✅ ${response.message || 'Parent details saved successfully!'}`)
      setTimeout(() => { setActiveTab('address'); setSuccess('') }, 2000)
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to submit parent details.')
    } finally {
      setLoading(false)
    }
  }

  const handleAddressSubmit = async () => {
    if (!studentId) {
      setError('Please submit Administration details first.')
      return
    }
    
    setLoading(true)
    setError('')
    setSuccess('')
    
    try {
      const payload = {
        StudentId: studentId,
        P_Country: parseInt(formData.pCountry) || 0,
        P_State: parseInt(formData.pState) || 0,
        P_District: parseInt(formData.pDistrict) || 0,
        P_Area: parseInt(formData.pArea) || 0,
        P_Pincode: formData.pPincode || '',
        P_Address: formData.pAddress || '',
        C_Country: parseInt(formData.cCountry) || 0,
        C_State: parseInt(formData.cState) || 0,
        C_District: parseInt(formData.cDistrict) || 0,
        C_Area: parseInt(formData.cArea) || 0,
        C_Pincode: formData.cPincode || '',
        C_Address: formData.cAddress || '',
        G_Country: parseInt(formData.gCountry) || 0,
        G_State: parseInt(formData.gState) || 0,
        G_District: parseInt(formData.gDistrict) || 0,
        G_Area: parseInt(formData.gArea) || 0,
        G_Pincode: formData.gPincode || '',
        G_Address: formData.gAddress || ''
      }
      
      const response = await submitAddressDetails(payload)
      setSuccess(`✅ ${response.message || 'Address saved successfully!'}`)
      setTimeout(() => { setActiveTab('lastSchool'); setSuccess('') }, 2000)
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to submit address.')
    } finally {
      setLoading(false)
    }
  }

  const handleLastSchoolSubmit = async () => {
    if (!studentId) {
      setError('Please submit Administration details first.')
      return
    }
    
    setLoading(true)
    setError('')
    setSuccess('')
    
    try {
      const payload = {
        StudentId: studentId,
        SchoolID: parseInt(formData.schoolCollege) || 0,
        SchoolCollegeName: schools.find(s => s.SchoolID == formData.schoolCollege)?.SchoolCollegeName || '',
        PrincipalName: formData.schoolPrincipalName || '',
        PrincipalMobile: formData.schoolMobileNo || '',
        PrincipalEmail: formData.schoolEmailId || '',
        BestSchoolTeacherName: formData.bestSchoolTeacherName || '',
        BestSchoolTeacherMobile: formData.bestSchoolTeacherMobile || '',
        BestSchoolTeacherEmail: formData.bestSchoolTeacherEmail || '',
        BestCoachingTeacherName: formData.bestCoachingTeacherName || '',
        BestCoachingTeacherMobile: formData.bestCoachingTeacherMobile || '',
        BestCoachingTeacherEmail: formData.bestCoachingTeacherEmail || ''
      }
      
      const response = await insertLastSchoolDetails(payload)
      setSuccess(`✅ ${response.message || 'Last school details inserted successfully!'}`)
      setTimeout(() => { setActiveTab('previousSchool'); setSuccess('') }, 2000)
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to submit last school details.')
    } finally {
      setLoading(false)
    }
  }

  const handleAddPreviousSchoolToList = () => {
    if (!formData.prevSchoolCollegeName) {
      setError('Please select a school/college')
      return
    }
    
    const newRecord = {
      schoolId: formData.prevSchoolCollegeName,
      schoolName: schools.find(s => s.SchoolID == formData.prevSchoolCollegeName)?.SchoolCollegeName || formData.prevSchoolCollegeName,
      educationBoard: formData.educationBoard || '',
      mediumOfInstruction: formData.mediumOfInstruction || '',
      tcNumber: formData.tcNumber || '',
      rollNumber: formData.rollNumber || '',
      passingYear: formData.passingYear || '',
      lastClassPassed: formData.lastClassPassed || '',
      totalMarks: formData.totalMarks || '',
      obtainedMarks: formData.obtainedMarks || '',
      percentageCgpa: formData.percentageCgpa || '',
      reasonForSchoolChange: formData.reasonForSchoolChange || ''
    }
    
    setPreviousSchoolsList(prev => [...prev, newRecord])
    setSuccess('✅ Previous school record added to list!')
    
    // Clear previous school fields
    setFormData(prev => ({
      ...prev,
      prevSchoolCollegeName: '',
      educationBoard: '',
      mediumOfInstruction: '',
      tcNumber: '',
      rollNumber: '',
      passingYear: '',
      lastClassPassed: '',
      totalMarks: '',
      obtainedMarks: '',
      percentageCgpa: '',
      reasonForSchoolChange: ''
    }))
    
    setTimeout(() => setSuccess(''), 2000)
  }

  const handleRemovePreviousSchool = (index) => {
    setPreviousSchoolsList(prev => prev.filter((_, i) => i !== index))
    setSuccess('✅ Record removed from list')
    setTimeout(() => setSuccess(''), 2000)
  }

  const handlePreviousSchoolSubmit = async () => {
    if (!studentId) {
      setError('Please submit Administration details first.')
      return
    }
    
    if (previousSchoolsList.length === 0) {
      setError('Please add at least one previous school record to the list')
      return
    }
    
    setLoading(true)
    setError('')
    setSuccess('')
    
    try {
      // Submit each previous school record
      for (const school of previousSchoolsList) {
        const payload = {
          StudentId: studentId,
          SchoolName: school.schoolId || '',
          EducationBoard: school.educationBoard || '',
          MediumOfInstruction: school.mediumOfInstruction || '',
          TCNumber: school.tcNumber || '',
          RollNumber: school.rollNumber || '',
          PassingYear: parseInt(school.passingYear) || 0,
          LastClassPassed: school.lastClassPassed || '',
          TotalMarks: parseInt(school.totalMarks) || 0,
          ObtainedMarks: parseInt(school.obtainedMarks) || 0,
          PercentageOrCGPA: school.percentageCgpa || '',
          ReasonForChange: school.reasonForSchoolChange || ''
        }
        
        await insertPreviousSchoolDetails(payload)
      }
      
      setSuccess(`✅ All ${previousSchoolsList.length} previous school record(s) saved successfully!`)
      setPreviousSchoolsList([]) // Clear the list after successful submit
      setTimeout(() => { setActiveTab('sibling'); setSuccess('') }, 2000)
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to submit previous school details.')
    } finally {
      setLoading(false)
    }
  }

  const handleAddSiblingToList = () => {
    if (!formData.siblingId) {
      setError('Please enter Sibling Student ID')
      return
    }
    
    if (!formData.siblingRelationship) {
      setError('Please select Relationship')
      return
    }
    
    const newSibling = {
      siblingStudentId: formData.siblingId,
      relationship: formData.siblingRelationship
    }
    
    setSiblingsList(prev => [...prev, newSibling])
    setSuccess('✅ Sibling added to list!')
    
    // Clear sibling fields
    setFormData(prev => ({
      ...prev,
      siblingId: '',
      siblingRelationship: ''
    }))
    
    setTimeout(() => setSuccess(''), 2000)
  }

  const handleRemoveSibling = (index) => {
    setSiblingsList(prev => prev.filter((_, i) => i !== index))
    setSuccess('✅ Sibling removed from list')
    setTimeout(() => setSuccess(''), 2000)
  }

  const handleSiblingSubmit = async () => {
    if (!studentId) {
      setError('Please submit Administration details first.')
      return
    }
    
    if (siblingsList.length === 0) {
      setError('Please add at least one sibling to the list')
      return
    }
    
    setLoading(true)
    setError('')
    setSuccess('')
    
    try {
      // Submit each sibling record
      for (const sibling of siblingsList) {
        const payload = {
          StudentId: studentId,
          SiblingStudentId: parseInt(sibling.siblingStudentId) || 0,
          Relationship: sibling.relationship
        }
        
        await addSibling(payload)
      }
      
      setSuccess(`✅ All ${siblingsList.length} sibling(s) saved successfully!`)
      setSiblingsList([]) // Clear the list after successful submit
      setTimeout(() => { setActiveTab('bestFriend'); setSuccess('') }, 2000)
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to add sibling.')
    } finally {
      setLoading(false)
    }
  }

  const handleAddBestFriendToList = () => {
    if (!formData.friendId) {
      setError('Please enter Friend ID')
      return
    }
    
    if (!formData.friendName) {
      setError('Please enter Friend Name')
      return
    }
    
    if (!formData.friendMobile) {
      setError('Please enter Friend Mobile')
      return
    }
    
    const newBestFriend = {
      friendId: formData.friendId,
      friendName: formData.friendName,
      friendMobile: formData.friendMobile
    }
    
    setBestFriendsList(prev => [...prev, newBestFriend])
    setSuccess('✅ Best friend added to list!')
    
    // Clear best friend fields
    setFormData(prev => ({
      ...prev,
      friendId: '',
      friendName: '',
      friendMobile: ''
    }))
    
    setTimeout(() => setSuccess(''), 2000)
  }

  const handleRemoveBestFriend = (index) => {
    setBestFriendsList(prev => prev.filter((_, i) => i !== index))
    setSuccess('✅ Best friend removed from list')
    setTimeout(() => setSuccess(''), 2000)
  }

  const handleBestFriendSubmit = async () => {
    if (!studentId) {
      setError('Please submit Administration details first.')
      return
    }
    
    if (bestFriendsList.length === 0) {
      setError('Please add at least one best friend to the list')
      return
    }
    
    setLoading(true)
    setError('')
    setSuccess('')
    
    try {
      // Submit each best friend record
      for (const friend of bestFriendsList) {
        const payload = {
          StudentId: studentId,
          FriendId: parseInt(friend.friendId) || 0,
          Best_F_Name1: friend.friendName || '',
          Best_F_Mobile1: friend.friendMobile || ''
        }
        
        await addBestFriend(payload)
      }
      
      setSuccess(`✅ All ${bestFriendsList.length} best friend(s) saved successfully!`)
      setBestFriendsList([]) // Clear the list after successful submit
      setTimeout(() => { setActiveTab('medical'); setSuccess('') }, 2000)
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to add best friend.')
    } finally {
      setLoading(false)
    }
  }

  const handleMedicalSubmit = async () => {
    if (!studentId) {
      setError('Please submit Administration details first.')
      return
    }
    
    setLoading(true)
    setError('')
    setSuccess('')
    
    try {
      const payload = {
        StudentId: studentId,
        Height: formData.height || '',
        Weight: formData.weight || '',
        BloodGroup: formData.medicalBloodGroup || ''
      }
      
      const response = await insertMedicalRecord(payload)
      setSuccess(`✅ ${response.message || 'Medical record inserted successfully!'}`)
      setTimeout(() => { setActiveTab('transport'); setSuccess('') }, 2000)
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to submit medical record.')
    } finally {
      setLoading(false)
    }
  }

  const handleTransportSubmit = async () => {
    if (!studentId) {
      setError('Please submit Administration details first.')
      return
    }
    
    setLoading(true)
    setError('')
    setSuccess('')
    
    try {
      const payload = {
        StudentId: studentId,
        Transport_Yes_No: formData.transportYesNo === 'Yes',
        RouteId: parseInt(formData.routeId) || 0,
        StopId: parseInt(formData.stopId) || 0
      }
      
      const response = await insertTransportDetails(payload)
      setSuccess(`✅ ${response.message || 'Transport details saved successfully!'}`)
      setTimeout(() => setSuccess(''), 5000)
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to submit transport details.')
    } finally {
      setLoading(false)
    }
  }

  const handleSchoolChange = (e) => {
    const { value } = e.target
    if (value === 'add_new') {
      setSchoolModalSource('lastSchool')
      setShowAddSchoolModal(true)
    } else {
      setFormData(prev => ({ ...prev, schoolCollege: value }))
    }
  }

  const handlePrevSchoolSelectChange = (e) => {
    const { value } = e.target
    if (value === 'add_new') {
      setSchoolModalSource('previousSchool')
      setShowAddSchoolModal(true)
    } else {
      setFormData(prev => ({ ...prev, prevSchoolCollegeName: value }))
    }
  }

  const handleNewSchoolChange = (e) => {
    const { name, value } = e.target
    setNewSchoolData(prev => ({ ...prev, [name]: value }))
  }

  const handleAddNewSchool = async () => {
    setLoading(true)
    setError('')
    
    try {
      const payload = {
        SchoolCollegeName: newSchoolData.schoolName,
        Country: newSchoolData.schoolCountry,
        State: newSchoolData.schoolState,
        District: newSchoolData.schoolDistrict,
        Area: newSchoolData.schoolArea,
        Pincode: newSchoolData.schoolPincode,
        ContactNo: newSchoolData.schoolContactNo,
        EmailId: newSchoolData.schoolEmailId,
        Website: newSchoolData.schoolWebsite
      }
      
      const response = await insertSchoolDetails(payload)
      setSuccess(`✅ ${response.message || 'School added successfully!'}`)
      
      // Refresh schools dropdown
      const schoolsData = await getSchoolMasterDropdown()
      setSchools(schoolsData || [])
      
      // Set the newly added school as selected in the correct field
      if (response.SchoolID) {
        if (schoolModalSource === 'lastSchool') {
          setFormData(prev => ({ ...prev, schoolCollege: response.SchoolID }))
        } else if (schoolModalSource === 'previousSchool') {
          setFormData(prev => ({ ...prev, prevSchoolCollegeName: response.SchoolID }))
        }
      }
      
      // Reset and close modal
      setNewSchoolData({
        schoolName: '',
        schoolCountry: '',
        schoolState: '',
        schoolDistrict: '',
        schoolArea: '',
        schoolPincode: '',
        schoolContactNo: '',
        schoolEmailId: '',
        schoolWebsite: ''
      })
      setShowAddSchoolModal(false)
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to add school.')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = (skipConfirm = false) => {
    if (skipConfirm || window.confirm('Reset all fields?')) {
      setFormData({
        dateOfAdmission: getTodayDate(), feeCategory: '', organizationName: '', collegeName: '', branch: '',
        courseType: '', university: '', financialYear: '', course: '', batchId: '', section: '',
        studentName: '', mobileNumber1: '', studentRegistrationNumber: '', studentUniversityNumber: '',
        mobileNumber2: '', mobileNumber3: '', emailId: '', gender: '', dateOfBirth: '', nationality: '',
        birthplace: '', motherTongue: '', category: '', subCategory: '', minority: '', religion: '',
        bloodGroup: '', adharCardNumber: '', domicile: '', panNo: '', fatherName: '', fatherMobileAdmission: '',
        fatherContactNo: '', fatherEmailId: '', fatherAdharNo: '', fatherQualification: '', fatherProfession: '',
        fatherCompanyName: '', fatherOfficeAddress: '', fatherDesignation: '', familyIncome: '', motherName: '',
        motherContactNumber: '', motherMobileAdmission: '', motherEmailId: '', motherQualification: '',
        motherProfession: '', motherOfficeAddress: '', guardianName: '', guardianMobileAdmission: '',
        guardianMobileNo: '', guardianEmailId: '', relationWithStudent: '', 
        spouseName: '', spouseContactNo: '', spouseMobileAdmission: '', spouseEmailId: '', spouseQualification: '',
        spouseProfession: '', spouseOfficeAddress: '', studentUserId: '',
        studentPassword: '', parentLoginId: '', parentPassword: '', pCountry: '', pState: '', pDistrict: '',
        pArea: '', pPincode: '', pAddress: '', cCountry: '', cState: '', cDistrict: '', cArea: '', cPincode: '',
        cAddress: '', gCountry: '', gState: '', gDistrict: '', gArea: '', gPincode: '', gAddress: '',
        schoolCollege: '', schoolPrincipalName: '', schoolMobileNo: '', schoolEmailId: '', bestSchoolTeacherName: '',
        bestSchoolTeacherMobile: '', bestSchoolTeacherEmail: '', bestCoachingTeacherName: '', bestCoachingTeacherMobile: '',
        bestCoachingTeacherEmail: '', prevSchoolCollegeName: '', educationBoard: '', mediumOfInstruction: '',
        tcNumber: '', rollNumber: '', passingYear: '', lastClassPassed: '', totalMarks: '', obtainedMarks: '',
        percentageCgpa: '', reasonForSchoolChange: '', schoolMasterName: '', schoolCountry: '', schoolState: '',
        schoolDistrict: '', schoolArea: '', schoolPincode: '', schoolContactNo: '', schoolEmailId: '', schoolWebsite: '',
        siblingId: '', siblingRelationship: '', friendId: '', friendName: '', friendMobile: '', height: '',
        weight: '', medicalBloodGroup: '', transportYesNo: '', routeId: '', stopId: '',
      })
      setMobileErrors({
        mobileNumber1: '',
        mobileNumber2: '',
        mobileNumber3: ''
      })
      setStudentId(null) // Reset StudentID
      setActiveTab('administration') // Go back to first tab
    }
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader className="d-flex justify-content-between align-items-center">
            <div><strong>Registration Form</strong> <small>Complete Student Registration</small></div>
            <CButton color="secondary" size="sm" onClick={() => navigate('/admin/students')}>
              <CIcon icon={cilArrowLeft} className="me-1" />Back to List
            </CButton>
          </CCardHeader>
          <CCardBody>
            {success && (
              <CAlert color="success" dismissible onClose={() => setSuccess('')}>
                <pre style={{ whiteSpace: 'pre-wrap', margin: 0, fontFamily: 'inherit' }}>{success}</pre>
              </CAlert>
            )}
            {error && (
              <CAlert color="danger" dismissible onClose={() => setError('')}>
                <strong>Error:</strong> {error}
              </CAlert>
            )}

            <style>{`
              .registration-tabs {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                padding: 8px;
                border-radius: 10px;
                margin-bottom: 25px;
                box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
                overflow-x: auto;
                white-space: nowrap;
              }
              .registration-tabs .nav {
                flex-wrap: nowrap;
                gap: 8px;
              }
              .registration-tabs .nav-link {
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
              .registration-tabs .nav-link:hover {
                background-color: rgba(255, 255, 255, 0.2) !important;
                transform: translateY(-2px);
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
              }
              .registration-tabs .nav-link.active {
                background-color: #ffffff !important;
                color: #667eea !important;
                font-weight: 600 !important;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                border: 1px solid #ffffff !important;
              }
              @media (max-width: 768px) {
                .registration-tabs .nav-link {
                  font-size: 12px !important;
                  padding: 8px 12px !important;
                }
              }
              @media (max-width: 576px) {
                .registration-tabs .nav-link {
                  font-size: 11px !important;
                  padding: 6px 10px !important;
                }
              }
            `}</style>

            <div className="registration-tabs">
              <CNav variant="pills" role="tablist" className="d-flex">
                <CNavItem>
                  <CNavLink active={activeTab === 'administration'} onClick={() => setActiveTab('administration')}>
                    Administration
                  </CNavLink>
                </CNavItem>
                <CNavItem>
                  <CNavLink active={activeTab === 'studentDetails'} onClick={() => setActiveTab('studentDetails')}>
                    Student Details
                  </CNavLink>
                </CNavItem>
                <CNavItem>
                  <CNavLink active={activeTab === 'parentGuardian'} onClick={() => setActiveTab('parentGuardian')}>
                    Family Info
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
                  <CNavLink active={activeTab === 'sibling'} onClick={() => setActiveTab('sibling')}>
                    Sibling
                  </CNavLink>
                </CNavItem>
                <CNavItem>
                  <CNavLink active={activeTab === 'bestFriend'} onClick={() => setActiveTab('bestFriend')}>
                    Best Friend
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
              </CNav>
            </div>

            <CForm onSubmit={handleSubmit}>
              <CTabContent>
                {/* Administration Details Tab */}
                <CTabPane visible={activeTab === 'administration'}>
                  <CRow className="g-3">
                    <CCol md={4}>
                      <CFormLabel>Date of Admission *</CFormLabel>
                      <CFormInput type="date" name="dateOfAdmission" value={formData.dateOfAdmission} onChange={handleChange} required />
                    </CCol>
                    <CCol md={4}>
                      <CFormLabel>Fee Category</CFormLabel>
                      <CFormSelect name="feeCategory" value={formData.feeCategory} onChange={handleChange}>
                        <option value="">Select</option>
                        <option>Regular</option>
                        <option>Management Quota</option>
                      </CFormSelect>
                    </CCol>
                    <CCol md={4}>
                      <CFormLabel>Organisation Name *</CFormLabel>
                      <CFormSelect name="organizationName" value={formData.organizationName} onChange={handleChange} required>
                        <option value="">Select Organisation</option>
                        {organizations.map(org => (
                          <option key={org.OrganisationID} value={org.OrganisationID}>{org.OrganisationName}</option>
                        ))}
                      </CFormSelect>
                    </CCol>
                    <CCol md={4}>
                      <CFormLabel>College Name *</CFormLabel>
                      <CFormSelect name="collegeName" value={formData.collegeName} onChange={handleChange} required disabled={!formData.organizationName}>
                        <option value="">Select College</option>
                        {colleges.map(college => (
                          <option key={college.CollegeID} value={college.CollegeID}>{college.CollegeName}</option>
                        ))}
                      </CFormSelect>
                    </CCol>
                    <CCol md={4}>
                      <CFormLabel>Branch *</CFormLabel>
                      <CFormSelect name="branch" value={formData.branch} onChange={handleChange} required disabled={!formData.collegeName}>
                        <option value="">Select Branch</option>
                        {branches.map(branch => (
                          <option key={branch.Id} value={branch.Id}>{branch.BranchName}</option>
                        ))}
                      </CFormSelect>
                    </CCol>
                    <CCol md={4}>
                      <CFormLabel>Course Type *</CFormLabel>
                      <CFormSelect name="courseType" value={formData.courseType} onChange={handleChange} required disabled={!formData.collegeName}>
                        <option value="">Select Course Type</option>
                        {courseTypes.map(ct => (
                          <option key={ct.Id} value={ct.Id}>{ct.CourseName}</option>
                        ))}
                      </CFormSelect>
                    </CCol>
                    <CCol md={4}>
                      <CFormLabel>University *</CFormLabel>
                      <CFormSelect name="university" value={formData.university} onChange={handleChange} required disabled={!formData.courseType}>
                        <option value="">Select University</option>
                        {universities.map(uni => (
                          <option key={uni.Id} value={uni.Id}>{uni.Name}</option>
                        ))}
                      </CFormSelect>
                    </CCol>
                    <CCol md={4}>
                      <CFormLabel>Batch *</CFormLabel>
                      <CFormSelect name="batchId" value={formData.batchId} onChange={handleChange} required disabled={!formData.university}>
                        <option value="">Select Batch</option>
                        {batches.map(batch => (
                          <option key={batch.Id} value={batch.Id}>{batch.BatchName}</option>
                        ))}
                      </CFormSelect>
                    </CCol>
                    <CCol md={4}>
                      <CFormLabel>Course *</CFormLabel>
                      <CFormSelect name="course" value={formData.course} onChange={handleChange} required disabled={!formData.batchId}>
                        <option value="">Select Course</option>
                        {courses.map(course => (
                          <option key={course.Id} value={course.Id}>{course.CourseName}</option>
                        ))}
                      </CFormSelect>
                    </CCol>
                    <CCol md={4}>
                      <CFormLabel>Section</CFormLabel>
                      <CFormSelect name="section" value={formData.section} onChange={handleChange} disabled={!formData.course}>
                        <option value="">Select Section</option>
                        {sections.map(section => (
                          <option key={section.Id} value={section.Id}>{section.Name}</option>
                        ))}
                      </CFormSelect>
                    </CCol>
                    <CCol md={4}>
                      <CFormLabel>Financial Year</CFormLabel>
                      <CFormSelect name="financialYear" value={formData.financialYear} onChange={handleChange}>
                        <option value="">Select</option>
                        <option>2024-25</option>
                        <option>2025-26</option>
                      </CFormSelect>
                    </CCol>
                    <CCol md={4}>
                      <CFormLabel>Student Name *</CFormLabel>
                      <CFormInput name="studentName" value={formData.studentName} onChange={handleChange} placeholder="Enter full name" required />
                    </CCol>
                    <CCol md={4}>
                      <CFormLabel>Student Registration Number (SRN) *</CFormLabel>
                      <CFormInput name="studentRegistrationNumber" value={formData.studentRegistrationNumber} readOnly className="bg-light" placeholder="Auto-generated" />
                      <small className="text-muted">Auto-generated based on selections</small>
                    </CCol>
                    <CCol md={4}>
                      <CFormLabel>Mobile Number 1 *</CFormLabel>
                      <CFormInput 
                        name="mobileNumber1" 
                        value={formData.mobileNumber1} 
                        onChange={handleChange} 
                        placeholder="Enter 10-digit mobile" 
                        required
                        className={mobileErrors.mobileNumber1 ? 'is-invalid' : ''}
                      />
                      {mobileErrors.mobileNumber1 && (
                        <div className="invalid-feedback d-block">
                          {mobileErrors.mobileNumber1}
                        </div>
                      )}
                      <small className="text-muted">Must be 10 digits, starting with 6-9</small>
                    </CCol>
                    <CCol md={4}>
                      <CFormLabel>Mobile Number 2</CFormLabel>
                      <CFormInput 
                        name="mobileNumber2" 
                        value={formData.mobileNumber2} 
                        onChange={handleChange} 
                        placeholder="Enter 10-digit mobile"
                        className={mobileErrors.mobileNumber2 ? 'is-invalid' : ''}
                      />
                      {mobileErrors.mobileNumber2 && (
                        <div className="invalid-feedback d-block">
                          {mobileErrors.mobileNumber2}
                        </div>
                      )}
                    </CCol>
                    <CCol md={4}>
                      <CFormLabel>Mobile Number 3</CFormLabel>
                      <CFormInput 
                        name="mobileNumber3" 
                        value={formData.mobileNumber3} 
                        onChange={handleChange} 
                        placeholder="Enter 10-digit mobile"
                        className={mobileErrors.mobileNumber3 ? 'is-invalid' : ''}
                      />
                      {mobileErrors.mobileNumber3 && (
                        <div className="invalid-feedback d-block">
                          {mobileErrors.mobileNumber3}
                        </div>
                      )}
                    </CCol>
                    <CCol md={4}>
                      <CFormLabel>Student University Number</CFormLabel>
                      <CFormInput name="studentUniversityNumber" value={formData.studentUniversityNumber} onChange={handleChange} placeholder="Enter university number" />
                    </CCol>
                    <CCol md={6}>
                      <CFormLabel>College Email *</CFormLabel>
                      <CFormInput type="email" name="emailId" value={formData.emailId} readOnly className="bg-light" placeholder="Auto-generated" />
                      <small className="text-muted">Format: firstname.srn@atm.edu.in</small>
                    </CCol>
                    
                    <CCol xs={12} className="mt-4">
                      <div className="d-flex gap-2">
                        <CButton 
                          type="button" 
                          color="primary" 
                          onClick={(e) => handleSubmit(e, 'submit')} 
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <CSpinner size="sm" className="me-1" />
                              Submitting...
                            </>
                          ) : (
                            <>
                              <CIcon icon={cilSave} className="me-1" />
                              Submit 
                            </>
                          )}
                        </CButton>
                        <CButton 
                          type="button" 
                          color="success" 
                          onClick={(e) => handleSubmit(e, 'next')} 
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <CSpinner size="sm" className="me-1" />
                              Submitting...
                            </>
                          ) : (
                            <>
                              <CIcon icon={cilSave} className="me-1" />
                              Save & Next
                            </>
                          )}
                        </CButton>
                      </div>
                    </CCol>
                  </CRow>
                </CTabPane>

                {/* Student Details Tab */}
                <CTabPane visible={activeTab === 'studentDetails'}>
                  <CRow className="g-3">
                    <CCol md={4}>
                      <CFormLabel>Gender *</CFormLabel>
                      <CFormSelect name="gender" value={formData.gender} onChange={handleChange} required>
                        <option value="">Select</option>
                        <option>Male</option>
                        <option>Female</option>
                        <option>Other</option>
                      </CFormSelect>
                    </CCol>
                    <CCol md={4}>
                      <CFormLabel>Date of Birth *</CFormLabel>
                      <CFormInput type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required />
                    </CCol>
                    <CCol md={4}>
                      <CFormLabel>Nationality *</CFormLabel>
                      <CFormSelect name="nationality" value={formData.nationality} onChange={handleChange} required>
                        <option value="">Select Nationality</option>
                        {nationalities.map(nat => (
                          <option key={nat.Id} value={nat.Id}>{nat.NationalityName}</option>
                        ))}
                      </CFormSelect>
                    </CCol>
                    <CCol md={4}>
                      <CFormLabel>Birthplace</CFormLabel>
                      <CFormInput name="birthplace" value={formData.birthplace} onChange={handleChange} placeholder="Enter birthplace" />
                    </CCol>
                    <CCol md={4}>
                      <CFormLabel>Mother Tongue</CFormLabel>
                      <CFormSelect name="motherTongue" value={formData.motherTongue} onChange={handleChange}>
                        <option value="">Select Mother Tongue</option>
                        {motherTongues.map(mt => (
                          <option key={mt.Id} value={mt.Id}>{mt.MotherTongueName}</option>
                        ))}
                      </CFormSelect>
                    </CCol>
                    <CCol md={4}>
                      <CFormLabel>Category *</CFormLabel>
                      <CFormSelect name="category" value={formData.category} onChange={handleChange} required>
                        <option value="">Select Category</option>
                        {categories.map(cat => (
                          <option key={cat.Id} value={cat.Id}>{cat.CategoryName}</option>
                        ))}
                      </CFormSelect>
                    </CCol>
                    <CCol md={4}>
                      <CFormLabel>Sub-Category</CFormLabel>
                      <CFormSelect name="subCategory" value={formData.subCategory} onChange={handleChange} disabled={!formData.category}>
                        <option value="">Select Sub-Category</option>
                        {subCategories.map(sub => (
                          <option key={sub.Id} value={sub.Id}>{sub.SubCategoryName}</option>
                        ))}
                      </CFormSelect>
                    </CCol>
                    <CCol md={4}>
                      <CFormLabel>Minority</CFormLabel>
                      <CFormSelect name="minority" value={formData.minority} onChange={handleChange}>
                        <option value="">Select</option>
                        <option>Yes</option>
                        <option>No</option>
                      </CFormSelect>
                    </CCol>
                    <CCol md={4}>
                      <CFormLabel>Religion *</CFormLabel>
                      <CFormSelect name="religion" value={formData.religion} onChange={handleChange} required>
                        <option value="">Select Religion</option>
                        {religions.map(rel => (
                          <option key={rel.Id} value={rel.Id}>{rel.ReligionName}</option>
                        ))}
                      </CFormSelect>
                    </CCol>
                    <CCol md={4}>
                      <CFormLabel>Blood Group</CFormLabel>
                      <CFormSelect name="bloodGroup" value={formData.bloodGroup} onChange={handleChange}>
                        <option value="">Select</option>
                        <option>A+</option>
                        <option>A-</option>
                        <option>B+</option>
                        <option>B-</option>
                        <option>O+</option>
                        <option>O-</option>
                        <option>AB+</option>
                        <option>AB-</option>
                      </CFormSelect>
                    </CCol>
                    <CCol md={4}>
                      <CFormLabel>Adhar Card Number</CFormLabel>
                      <CFormInput name="adharCardNumber" value={formData.adharCardNumber} onChange={handleChange} placeholder="Enter Adhar number" maxLength="12" />
                    </CCol>
                    <CCol md={4}>
                      <CFormLabel>Domicile</CFormLabel>
                      <CFormInput name="domicile" value={formData.domicile} onChange={handleChange} placeholder="Enter domicile" />
                    </CCol>
                    <CCol md={4}>
                      <CFormLabel>PAN No.</CFormLabel>
                      <CFormInput name="panNo" value={formData.panNo} onChange={handleChange} placeholder="Enter PAN number" maxLength="10" />
                    </CCol>
                    
                    <CCol xs={12} className="mt-4">
                      <CButton type="button" color="success" onClick={handleStudentDetailsSubmit} disabled={loading || !studentId}>
                        {loading ? <><CSpinner size="sm" className="me-1" />Submitting...</> : <><CIcon icon={cilSave} className="me-1" />Save Student Details</>}
                      </CButton>
                      {!studentId && <small className="text-danger ms-3">⚠️ Please submit Administration details first</small>}
                    </CCol>
                  </CRow>
                </CTabPane>

                {/* Parent and Guardian Details Tab */}
                <CTabPane visible={activeTab === 'parentGuardian'}>
                  <CRow className="g-3">
                    <CCol xs={12}><h6 className="text-primary">Father Details</h6></CCol>
                    <CCol md={4}><CFormLabel>Father Name</CFormLabel><CFormInput name="fatherName" value={formData.fatherName} onChange={handleChange} placeholder="Enter father name" /></CCol>
                    <CCol md={4}><CFormLabel>Father Mobile (Admission)</CFormLabel><CFormInput name="fatherMobileAdmission" value={formData.fatherMobileAdmission} onChange={handleChange} placeholder="Enter mobile" /></CCol>
                    <CCol md={4}><CFormLabel>Father Contact No.</CFormLabel><CFormInput name="fatherContactNo" value={formData.fatherContactNo} onChange={handleChange} placeholder="Enter contact" /></CCol>
                    <CCol md={4}><CFormLabel>Father Email ID</CFormLabel><CFormInput type="email" name="fatherEmailId" value={formData.fatherEmailId} onChange={handleChange} placeholder="Enter email" /></CCol>
                    <CCol md={4}><CFormLabel>Father Adhar No.</CFormLabel><CFormInput name="fatherAdharNo" value={formData.fatherAdharNo} onChange={handleChange} placeholder="Enter Adhar" /></CCol>
                    <CCol md={4}><CFormLabel>Father Qualification</CFormLabel><CFormInput name="fatherQualification" value={formData.fatherQualification} onChange={handleChange} placeholder="Enter qualification" /></CCol>
                    <CCol md={4}><CFormLabel>Father's Profession</CFormLabel><CFormInput name="fatherProfession" value={formData.fatherProfession} onChange={handleChange} placeholder="Enter profession" /></CCol>
                    <CCol md={4}><CFormLabel>Father Company Name</CFormLabel><CFormInput name="fatherCompanyName" value={formData.fatherCompanyName} onChange={handleChange} placeholder="Enter company" /></CCol>
                    <CCol md={4}><CFormLabel>Father Office Address</CFormLabel><CFormInput name="fatherOfficeAddress" value={formData.fatherOfficeAddress} onChange={handleChange} placeholder="Enter address" /></CCol>
                    <CCol md={4}><CFormLabel>Father Designation</CFormLabel><CFormInput name="fatherDesignation" value={formData.fatherDesignation} onChange={handleChange} placeholder="Enter designation" /></CCol>
                    <CCol md={4}><CFormLabel>Family Income</CFormLabel><CFormInput type="number" name="familyIncome" value={formData.familyIncome} onChange={handleChange} placeholder="Enter income" /></CCol>
                    
                    <CCol xs={12}><h6 className="text-primary mt-3">Mother Details</h6></CCol>
                    <CCol md={4}><CFormLabel>Mother Name</CFormLabel><CFormInput name="motherName" value={formData.motherName} onChange={handleChange} placeholder="Enter mother name" /></CCol>
                    <CCol md={4}><CFormLabel>Mother Contact Number</CFormLabel><CFormInput name="motherContactNumber" value={formData.motherContactNumber} onChange={handleChange} placeholder="Enter contact" /></CCol>
                    <CCol md={4}><CFormLabel>Mother Mobile (Admission)</CFormLabel><CFormInput name="motherMobileAdmission" value={formData.motherMobileAdmission} onChange={handleChange} placeholder="Enter mobile" /></CCol>
                    <CCol md={4}><CFormLabel>Mother Email ID</CFormLabel><CFormInput type="email" name="motherEmailId" value={formData.motherEmailId} onChange={handleChange} placeholder="Enter email" /></CCol>
                    <CCol md={4}><CFormLabel>Mother Qualification</CFormLabel><CFormInput name="motherQualification" value={formData.motherQualification} onChange={handleChange} placeholder="Enter qualification" /></CCol>
                    <CCol md={4}><CFormLabel>Mother Profession</CFormLabel><CFormInput name="motherProfession" value={formData.motherProfession} onChange={handleChange} placeholder="Enter profession" /></CCol>
                    <CCol md={4}><CFormLabel>Mother Office Address</CFormLabel><CFormInput name="motherOfficeAddress" value={formData.motherOfficeAddress} onChange={handleChange} placeholder="Enter address" /></CCol>
                    
                    <CCol xs={12}><h6 className="text-primary mt-3">Guardian Details</h6></CCol>
                    <CCol md={4}><CFormLabel>Guardian Name</CFormLabel><CFormInput name="guardianName" value={formData.guardianName} onChange={handleChange} placeholder="Enter guardian name" /></CCol>
                    <CCol md={4}><CFormLabel>Guardian Mobile (Admission)</CFormLabel><CFormInput name="guardianMobileAdmission" value={formData.guardianMobileAdmission} onChange={handleChange} placeholder="Enter mobile" /></CCol>
                    <CCol md={4}><CFormLabel>Guardian Mobile No</CFormLabel><CFormInput name="guardianMobileNo" value={formData.guardianMobileNo} onChange={handleChange} placeholder="Enter mobile" /></CCol>
                    <CCol md={4}><CFormLabel>Guardian Email ID</CFormLabel><CFormInput type="email" name="guardianEmailId" value={formData.guardianEmailId} onChange={handleChange} placeholder="Enter email" /></CCol>
                    <CCol md={4}><CFormLabel>Relation with Student</CFormLabel><CFormInput name="relationWithStudent" value={formData.relationWithStudent} onChange={handleChange} placeholder="Enter relation" /></CCol>
                    
                    <CCol xs={12}><h6 className="text-primary mt-3">Spouse Details</h6></CCol>
                    <CCol md={4}><CFormLabel>Spouse Name</CFormLabel><CFormInput name="spouseName" value={formData.spouseName} onChange={handleChange} placeholder="Enter spouse name" /></CCol>
                    <CCol md={4}><CFormLabel>Spouse Contact No</CFormLabel><CFormInput name="spouseContactNo" value={formData.spouseContactNo} onChange={handleChange} placeholder="Enter contact" /></CCol>
                    <CCol md={4}><CFormLabel>Spouse Mobile (Admission)</CFormLabel><CFormInput name="spouseMobileAdmission" value={formData.spouseMobileAdmission} onChange={handleChange} placeholder="Enter mobile" /></CCol>
                    <CCol md={4}><CFormLabel>Spouse Email ID</CFormLabel><CFormInput type="email" name="spouseEmailId" value={formData.spouseEmailId} onChange={handleChange} placeholder="Enter email" /></CCol>
                    <CCol md={4}><CFormLabel>Spouse Qualification</CFormLabel><CFormInput name="spouseQualification" value={formData.spouseQualification} onChange={handleChange} placeholder="Enter qualification" /></CCol>
                    <CCol md={4}><CFormLabel>Spouse Profession</CFormLabel><CFormInput name="spouseProfession" value={formData.spouseProfession} onChange={handleChange} placeholder="Enter profession" /></CCol>
                    <CCol md={4}><CFormLabel>Spouse Office Address</CFormLabel><CFormInput name="spouseOfficeAddress" value={formData.spouseOfficeAddress} onChange={handleChange} placeholder="Enter office address" /></CCol>
                    
                    <CCol xs={12} className="mt-4">
                      <CButton 
                        type="button" 
                        color="success" 
                        onClick={handleParentSubmit} 
                        disabled={loading || !studentId}
                      >
                        {loading ? (
                          <>
                            <CSpinner size="sm" className="me-1" />
                            Submitting Parent Details...
                          </>
                        ) : (
                          <>
                            <CIcon icon={cilSave} className="me-1" />
                            Save Parent & Guardian Details
                          </>
                        )}
                      </CButton>
                      {!studentId && (
                        <small className="text-danger ms-3">
                          ⚠️ Please submit Administration details first
                        </small>
                      )}
                    </CCol>
                  </CRow>
                </CTabPane>

                {/* Address Details Tab */}
                <CTabPane visible={activeTab === 'address'}>
                  <CRow className="g-3">
                    <CCol xs={12}><h6 className="text-primary">Permanent Address</h6></CCol>
                    <CCol md={3}>
                      <CFormLabel>Country *</CFormLabel>
                      <CFormSelect name="pCountry" value={formData.pCountry} onChange={handleChange} required>
                        <option value="">Select Country</option>
                        {countries.map(country => (
                          <option key={country.Id} value={country.Id}>{country.Country}</option>
                        ))}
                      </CFormSelect>
                    </CCol>
                    <CCol md={3}>
                      <CFormLabel>State *</CFormLabel>
                      <CFormSelect name="pState" value={formData.pState} onChange={handleChange} disabled={!formData.pCountry} required>
                        <option value="">Select State</option>
                        {pStates.map(state => (
                          <option key={state.StateId} value={state.StateId}>{state.StateName}</option>
                        ))}
                      </CFormSelect>
                    </CCol>
                    <CCol md={3}>
                      <CFormLabel>District *</CFormLabel>
                      <CFormSelect name="pDistrict" value={formData.pDistrict} onChange={handleChange} disabled={!formData.pState} required>
                        <option value="">Select District</option>
                        {pDistricts.map(district => (
                          <option key={district.DistrictId} value={district.DistrictId}>{district.DistrictName}</option>
                        ))}
                      </CFormSelect>
                    </CCol>
                    <CCol md={3}>
                      <CFormLabel>Area/Tehsil</CFormLabel>
                      <CFormSelect name="pArea" value={formData.pArea} onChange={handleChange} disabled={!formData.pDistrict}>
                        <option value="">Select Area</option>
                        {pAreas.map(area => (
                          <option key={area.TehsilId} value={area.TehsilId}>{area.TehsilName}</option>
                        ))}
                      </CFormSelect>
                    </CCol>
                    <CCol md={3}><CFormLabel>Pincode</CFormLabel><CFormInput name="pPincode" value={formData.pPincode} onChange={handleChange} placeholder="Enter pincode" /></CCol>
                    <CCol md={9}><CFormLabel>Address</CFormLabel><CFormTextarea name="pAddress" value={formData.pAddress} onChange={handleChange} rows={2} placeholder="Enter complete address" /></CCol>
                    
                    <CCol xs={12} className="mt-3">
                      <div className="d-flex justify-content-between align-items-center">
                        <h6 className="text-primary mb-0">Correspondence Address</h6>
                        <CFormCheck 
                          id="sameAsPermanent"
                          label="Same as Permanent Address" 
                          checked={sameAsPermanent}
                          onChange={handleSameAsPermanent}
                        />
                      </div>
                    </CCol>
                    <CCol md={3}>
                      <CFormLabel>Country *</CFormLabel>
                      <CFormSelect name="cCountry" value={formData.cCountry} onChange={handleChange} disabled={sameAsPermanent} required>
                        <option value="">Select Country</option>
                        {countries.map(country => (
                          <option key={country.Id} value={country.Id}>{country.Country}</option>
                        ))}
                      </CFormSelect>
                    </CCol>
                    <CCol md={3}>
                      <CFormLabel>State *</CFormLabel>
                      <CFormSelect name="cState" value={formData.cState} onChange={handleChange} disabled={sameAsPermanent || !formData.cCountry} required>
                        <option value="">Select State</option>
                        {cStates.map(state => (
                          <option key={state.StateId} value={state.StateId}>{state.StateName}</option>
                        ))}
                      </CFormSelect>
                    </CCol>
                    <CCol md={3}>
                      <CFormLabel>District *</CFormLabel>
                      <CFormSelect name="cDistrict" value={formData.cDistrict} onChange={handleChange} disabled={sameAsPermanent || !formData.cState} required>
                        <option value="">Select District</option>
                        {cDistricts.map(district => (
                          <option key={district.DistrictId} value={district.DistrictId}>{district.DistrictName}</option>
                        ))}
                      </CFormSelect>
                    </CCol>
                    <CCol md={3}>
                      <CFormLabel>Area/Tehsil</CFormLabel>
                      <CFormSelect name="cArea" value={formData.cArea} onChange={handleChange} disabled={sameAsPermanent || !formData.cDistrict}>
                        <option value="">Select Area</option>
                        {cAreas.map(area => (
                          <option key={area.TehsilId} value={area.TehsilId}>{area.TehsilName}</option>
                        ))}
                      </CFormSelect>
                    </CCol>
                    <CCol md={3}><CFormLabel>Pincode</CFormLabel><CFormInput name="cPincode" value={formData.cPincode} onChange={handleChange} disabled={sameAsPermanent} placeholder="Enter pincode" /></CCol>
                    <CCol md={9}><CFormLabel>Address</CFormLabel><CFormTextarea name="cAddress" value={formData.cAddress} onChange={handleChange} disabled={sameAsPermanent} rows={2} placeholder="Enter complete address" /></CCol>
                    
                    <CCol xs={12} className="mt-3">
                      <div className="d-flex justify-content-between align-items-center">
                        <h6 className="text-primary mb-0">Guardian Address</h6>
                        <CFormCheck 
                          id="guardianSameAsPermanent"
                          label="Same as Permanent Address" 
                          checked={guardianSameAsPermanent}
                          onChange={handleGuardianSameAsPermanent}
                        />
                      </div>
                    </CCol>
                    <CCol md={3}>
                      <CFormLabel>Country *</CFormLabel>
                      <CFormSelect name="gCountry" value={formData.gCountry} onChange={handleChange} disabled={guardianSameAsPermanent} required>
                        <option value="">Select Country</option>
                        {countries.map(country => (
                          <option key={country.Id} value={country.Id}>{country.Country}</option>
                        ))}
                      </CFormSelect>
                    </CCol>
                    <CCol md={3}>
                      <CFormLabel>State *</CFormLabel>
                      <CFormSelect name="gState" value={formData.gState} onChange={handleChange} disabled={guardianSameAsPermanent || !formData.gCountry} required>
                        <option value="">Select State</option>
                        {gStates.map(state => (
                          <option key={state.StateId} value={state.StateId}>{state.StateName}</option>
                        ))}
                      </CFormSelect>
                    </CCol>
                    <CCol md={3}>
                      <CFormLabel>District *</CFormLabel>
                      <CFormSelect name="gDistrict" value={formData.gDistrict} onChange={handleChange} disabled={guardianSameAsPermanent || !formData.gState} required>
                        <option value="">Select District</option>
                        {gDistricts.map(district => (
                          <option key={district.DistrictId} value={district.DistrictId}>{district.DistrictName}</option>
                        ))}
                      </CFormSelect>
                    </CCol>
                    <CCol md={3}>
                      <CFormLabel>Area/Tehsil</CFormLabel>
                      <CFormSelect name="gArea" value={formData.gArea} onChange={handleChange} disabled={guardianSameAsPermanent || !formData.gDistrict}>
                        <option value="">Select Area</option>
                        {gAreas.map(area => (
                          <option key={area.TehsilId} value={area.TehsilId}>{area.TehsilName}</option>
                        ))}
                      </CFormSelect>
                    </CCol>
                    <CCol md={3}><CFormLabel>Pincode</CFormLabel><CFormInput name="gPincode" value={formData.gPincode} onChange={handleChange} disabled={guardianSameAsPermanent} placeholder="Enter pincode" /></CCol>
                    <CCol md={9}><CFormLabel>Address</CFormLabel><CFormTextarea name="gAddress" value={formData.gAddress} onChange={handleChange} disabled={guardianSameAsPermanent} rows={2} placeholder="Enter complete address" /></CCol>
                    
                    <CCol xs={12} className="mt-4">
                      <CButton type="button" color="success" onClick={handleAddressSubmit} disabled={loading || !studentId}>
                        {loading ? <><CSpinner size="sm" className="me-1" />Submitting...</> : <><CIcon icon={cilSave} className="me-1" />Save Address Details</>}
                      </CButton>
                      {!studentId && <small className="text-danger ms-3">⚠️ Please submit Administration details first</small>}
                    </CCol>
                  </CRow>
                </CTabPane>

                {/* Last School Tab */}
                <CTabPane visible={activeTab === 'lastSchool'}>
                  <CRow className="g-3">
                    <CCol md={6}>
                      <CFormLabel>School/College *</CFormLabel>
                      <CFormSelect name="schoolCollege" value={formData.schoolCollege} onChange={handleSchoolChange} required>
                        <option value="">Select School/College</option>
                        {schools.map(school => (
                          <option key={school.SchoolID} value={school.SchoolID}>{school.SchoolCollegeName}</option>
                        ))}
                        <option value="add_new" style={{fontWeight: 'bold', color: '#0d6efd'}}>
                          ➕ Add New School/College
                        </option>
                      </CFormSelect>
                    </CCol>
                    <CCol md={6}><CFormLabel>School Principal Name</CFormLabel><CFormInput name="schoolPrincipalName" value={formData.schoolPrincipalName} onChange={handleChange} placeholder="Enter principal name" /></CCol>
                    <CCol md={4}><CFormLabel>Principal Mobile No.</CFormLabel><CFormInput name="schoolMobileNo" value={formData.schoolMobileNo} onChange={handleChange} placeholder="Enter mobile" /></CCol>
                    <CCol md={4}><CFormLabel>Principal Email ID</CFormLabel><CFormInput type="email" name="schoolEmailId" value={formData.schoolEmailId} onChange={handleChange} placeholder="Enter email" /></CCol>
                    <CCol md={4}><CFormLabel>Best School Teacher Name</CFormLabel><CFormInput name="bestSchoolTeacherName" value={formData.bestSchoolTeacherName} onChange={handleChange} placeholder="Enter teacher name" /></CCol>
                    <CCol md={4}><CFormLabel>Teacher Mobile Number</CFormLabel><CFormInput name="bestSchoolTeacherMobile" value={formData.bestSchoolTeacherMobile} onChange={handleChange} placeholder="Enter mobile" /></CCol>
                    <CCol md={4}><CFormLabel>Teacher Email ID</CFormLabel><CFormInput type="email" name="bestSchoolTeacherEmail" value={formData.bestSchoolTeacherEmail} onChange={handleChange} placeholder="Enter email" /></CCol>
                    <CCol md={4}><CFormLabel>Best Coaching Teacher Name</CFormLabel><CFormInput name="bestCoachingTeacherName" value={formData.bestCoachingTeacherName} onChange={handleChange} placeholder="Enter teacher name" /></CCol>
                    <CCol md={4}><CFormLabel>Coaching Teacher Mobile</CFormLabel><CFormInput name="bestCoachingTeacherMobile" value={formData.bestCoachingTeacherMobile} onChange={handleChange} placeholder="Enter mobile" /></CCol>
                    <CCol md={4}><CFormLabel>Coaching Teacher Email</CFormLabel><CFormInput type="email" name="bestCoachingTeacherEmail" value={formData.bestCoachingTeacherEmail} onChange={handleChange} placeholder="Enter email" /></CCol>
                    
                    <CCol xs={12} className="mt-4">
                      <CButton type="button" color="success" onClick={handleLastSchoolSubmit} disabled={loading || !studentId}>
                        {loading ? <><CSpinner size="sm" className="me-1" />Submitting...</> : <><CIcon icon={cilSave} className="me-1" />Save Last School Details</>}
                      </CButton>
                      {!studentId && <small className="text-danger ms-3">⚠️ Please submit Administration details first</small>}
                    </CCol>
                  </CRow>
                </CTabPane>

                {/* Previous School Details Tab */}
                <CTabPane visible={activeTab === 'previousSchool'}>
                  <CRow className="g-3">
                    <CCol md={6}>
                      <CFormLabel>College/School Name</CFormLabel>
                      <CFormSelect name="prevSchoolCollegeName" value={formData.prevSchoolCollegeName} onChange={handlePrevSchoolSelectChange}>
                        <option value="">Select School/College</option>
                        {schools.map(school => (
                          <option key={school.SchoolID} value={school.SchoolID}>
                            {school.SchoolCollegeName}
                          </option>
                        ))}
                        <option value="add_new" style={{fontWeight: 'bold', color: '#0d6efd'}}>
                          ➕ Add New School/College
                        </option>
                      </CFormSelect>
                    </CCol>
                    <CCol md={6}><CFormLabel>Education Board</CFormLabel><CFormInput name="educationBoard" value={formData.educationBoard} onChange={handleChange} placeholder="Enter board" /></CCol>
                    <CCol md={4}><CFormLabel>Medium of Instruction</CFormLabel><CFormInput name="mediumOfInstruction" value={formData.mediumOfInstruction} onChange={handleChange} placeholder="Enter medium" /></CCol>
                    <CCol md={4}><CFormLabel>TC Number</CFormLabel><CFormInput name="tcNumber" value={formData.tcNumber} onChange={handleChange} placeholder="Enter TC number" /></CCol>
                    <CCol md={4}><CFormLabel>Roll Number</CFormLabel><CFormInput name="rollNumber" value={formData.rollNumber} onChange={handleChange} placeholder="Enter roll number" /></CCol>
                    <CCol md={4}><CFormLabel>Passing Year</CFormLabel><CFormInput name="passingYear" value={formData.passingYear} onChange={handleChange} placeholder="Enter passing year" /></CCol>
                    <CCol md={4}><CFormLabel>Last Class Passed</CFormLabel><CFormInput name="lastClassPassed" value={formData.lastClassPassed} onChange={handleChange} placeholder="Enter last class" /></CCol>
                    <CCol md={4}><CFormLabel>Total Marks</CFormLabel><CFormInput type="number" name="totalMarks" value={formData.totalMarks} onChange={handleChange} placeholder="Enter total marks" /></CCol>
                    <CCol md={4}><CFormLabel>Obtained Marks</CFormLabel><CFormInput type="number" name="obtainedMarks" value={formData.obtainedMarks} onChange={handleChange} placeholder="Enter obtained marks" /></CCol>
                    <CCol md={4}><CFormLabel>%/CGPA</CFormLabel><CFormInput name="percentageCgpa" value={formData.percentageCgpa} onChange={handleChange} placeholder="Enter percentage/CGPA" /></CCol>
                    <CCol md={12}><CFormLabel>Reason For School Change</CFormLabel><CFormInput name="reasonForSchoolChange" value={formData.reasonForSchoolChange} onChange={handleChange} placeholder="Enter reason" /></CCol>
                    
                    <CCol xs={12} className="mt-4">
                      <CButton 
                        type="button" 
                        color="primary" 
                        onClick={handleAddPreviousSchoolToList}
                        disabled={!formData.prevSchoolCollegeName}
                      >
                        ➕ Add to List
                      </CButton>
                      {!studentId && <small className="text-danger ms-3">⚠️ Please submit Administration details first</small>}
                    </CCol>

                    {/* Display List of Previous Schools */}
                    {previousSchoolsList.length > 0 && (
                      <CCol xs={12} className="mt-4">
                        <h6 className="text-primary mb-3">📋 Previous Schools List ({previousSchoolsList.length} record(s))</h6>
                        <div className="table-responsive">
                          <table className="table table-bordered table-hover table-sm">
                            <thead className="table-light">
                              <tr>
                                <th>#</th>
                                <th>School Name</th>
                                <th>Board</th>
                                <th>Passing Year</th>
                                <th>Last Class</th>
                                <th>Marks</th>
                                <th>%/CGPA</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {previousSchoolsList.map((school, index) => (
                                <tr key={index}>
                                  <td>{index + 1}</td>
                                  <td>{school.schoolName}</td>
                                  <td>{school.educationBoard || 'N/A'}</td>
                                  <td>{school.passingYear || 'N/A'}</td>
                                  <td>{school.lastClassPassed || 'N/A'}</td>
                                  <td>{school.obtainedMarks}/{school.totalMarks}</td>
                                  <td>{school.percentageCgpa || 'N/A'}</td>
                                  <td>
                                    <CButton 
                                      color="danger" 
                                      size="sm" 
                                      onClick={() => handleRemovePreviousSchool(index)}
                                    >
                                      <CIcon icon={cilX} />
                                    </CButton>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        <CButton 
                          type="button" 
                          color="success" 
                          onClick={handlePreviousSchoolSubmit} 
                          disabled={loading || !studentId}
                          className="mt-2"
                        >
                          {loading ? (
                            <>
                              <CSpinner size="sm" className="me-1" />
                              Saving All Records...
                            </>
                          ) : (
                            <>
                              <CIcon icon={cilSave} className="me-1" />
                              Save All {previousSchoolsList.length} Record(s) to Database
                            </>
                          )}
                        </CButton>
                      </CCol>
                    )}
                  </CRow>
                </CTabPane>

                {/* Sibling Tab */}
                <CTabPane visible={activeTab === 'sibling'}>
                  <CRow className="g-3">
                    <CCol xs={12}><h6 className="text-primary">👨‍👩‍👧‍👦 Sibling Information</h6></CCol>
                    <CCol md={4}>
                      <CFormLabel>Sibling Student ID *</CFormLabel>
                      <CFormInput 
                        type="number"
                        name="siblingId" 
                        value={formData.siblingId} 
                        onChange={handleChange} 
                        placeholder="Enter sibling student ID" 
                      />
                    </CCol>
                    <CCol md={4}>
                      <CFormLabel>Relationship *</CFormLabel>
                      <CFormSelect
                        name="siblingRelationship"
                        value={formData.siblingRelationship}
                        onChange={handleChange}
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
                    <CCol md={4} className="d-flex align-items-end">
                      <CButton 
                        type="button" 
                        color="primary" 
                        onClick={handleAddSiblingToList}
                        disabled={!formData.siblingId || !formData.siblingRelationship}
                      >
                        ➕ Add Sibling to List
                      </CButton>
                    </CCol>

                    {/* Display List of Siblings */}
                    {siblingsList.length > 0 && (
                      <CCol xs={12} className="mt-3">
                        <h6 className="text-primary mb-3">📋 Siblings List ({siblingsList.length} sibling(s))</h6>
                        <div className="table-responsive">
                          <table className="table table-bordered table-hover table-sm">
                            <thead className="table-light">
                              <tr>
                                <th>#</th>
                                <th>Sibling Student ID</th>
                                <th>Relationship</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {siblingsList.map((sibling, index) => (
                                <tr key={index}>
                                  <td>{index + 1}</td>
                                  <td>{sibling.siblingStudentId}</td>
                                  <td>{sibling.relationship}</td>
                                  <td>
                                    <CButton 
                                      color="danger" 
                                      size="sm" 
                                      onClick={() => handleRemoveSibling(index)}
                                    >
                                      <CIcon icon={cilX} />
                                    </CButton>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </CCol>
                    )}

                    <CCol xs={12} className="mt-4">
                      {siblingsList.length > 0 && (
                        <CButton 
                          type="button" 
                          color="success" 
                          onClick={handleSiblingSubmit} 
                          disabled={loading || !studentId}
                        >
                          {loading ? (
                            <>
                              <CSpinner size="sm" className="me-1" />
                              Saving Siblings...
                            </>
                          ) : (
                            <>
                              <CIcon icon={cilSave} className="me-1" />
                              Save All {siblingsList.length} Sibling(s) to Database
                            </>
                          )}
                        </CButton>
                      )}
                      {!studentId && <small className="text-danger ms-3">⚠️ Please submit Administration details first</small>}
                    </CCol>
                  </CRow>
                </CTabPane>

                {/* Best Friend Tab */}
                <CTabPane visible={activeTab === 'bestFriend'}>
                  <CRow className="g-3">
                    <CCol xs={12}><h6 className="text-primary">👥 Best Friends</h6></CCol>
                    <CCol md={3}>
                      <CFormLabel>Friend ID *</CFormLabel>
                      <CFormInput 
                        type="number"
                        name="friendId" 
                        value={formData.friendId} 
                        onChange={handleChange} 
                        placeholder="Enter friend ID" 
                      />
                    </CCol>
                    <CCol md={3}>
                      <CFormLabel>Friend Name *</CFormLabel>
                      <CFormInput 
                        name="friendName" 
                        value={formData.friendName} 
                        onChange={handleChange} 
                        placeholder="Enter friend name" 
                      />
                    </CCol>
                    <CCol md={3}>
                      <CFormLabel>Friend Mobile *</CFormLabel>
                      <CFormInput 
                        name="friendMobile" 
                        value={formData.friendMobile} 
                        onChange={handleChange} 
                        placeholder="Enter friend mobile" 
                      />
                    </CCol>
                    <CCol md={3} className="d-flex align-items-end">
                      <CButton 
                        type="button" 
                        color="primary" 
                        onClick={handleAddBestFriendToList}
                        disabled={!formData.friendId || !formData.friendName || !formData.friendMobile}
                      >
                        ➕ Add Friend to List
                      </CButton>
                    </CCol>

                    {/* Display List of Best Friends */}
                    {bestFriendsList.length > 0 && (
                      <CCol xs={12} className="mt-3">
                        <h6 className="text-primary mb-3">📋 Best Friends List ({bestFriendsList.length} friend(s))</h6>
                        <div className="table-responsive">
                          <table className="table table-bordered table-hover table-sm">
                            <thead className="table-light">
                              <tr>
                                <th>#</th>
                                <th>Friend ID</th>
                                <th>Friend Name</th>
                                <th>Friend Mobile</th>
                                <th>Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {bestFriendsList.map((friend, index) => (
                                <tr key={index}>
                                  <td>{index + 1}</td>
                                  <td>{friend.friendId}</td>
                                  <td>{friend.friendName}</td>
                                  <td>{friend.friendMobile}</td>
                                  <td>
                                    <CButton 
                                      color="danger" 
                                      size="sm" 
                                      onClick={() => handleRemoveBestFriend(index)}
                                    >
                                      <CIcon icon={cilX} />
                                    </CButton>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </CCol>
                    )}
                    
                    <CCol xs={12} className="mt-4">
                      {bestFriendsList.length > 0 && (
                        <CButton 
                          type="button" 
                          color="success" 
                          onClick={handleBestFriendSubmit} 
                          disabled={loading || !studentId}
                        >
                          {loading ? (
                            <>
                              <CSpinner size="sm" className="me-1" />
                              Saving Best Friends...
                            </>
                          ) : (
                            <>
                              <CIcon icon={cilSave} className="me-1" />
                              Save All {bestFriendsList.length} Best Friend(s) to Database
                            </>
                          )}
                        </CButton>
                      )}
                      {!studentId && <small className="text-danger ms-3">⚠️ Please submit Administration details first</small>}
                    </CCol>
                  </CRow>
                </CTabPane>

                {/* Medical Records Tab */}
                <CTabPane visible={activeTab === 'medical'}>
                  <CRow className="g-3">
                    <CCol md={4}><CFormLabel>Height</CFormLabel><CFormInput name="height" value={formData.height} onChange={handleChange} placeholder="Enter height (cm)" /></CCol>
                    <CCol md={4}><CFormLabel>Weight</CFormLabel><CFormInput name="weight" value={formData.weight} onChange={handleChange} placeholder="Enter weight (kg)" /></CCol>
                    <CCol md={4}><CFormLabel>Blood Group</CFormLabel><CFormSelect name="medicalBloodGroup" value={formData.medicalBloodGroup} onChange={handleChange}><option value="">Select</option><option>A+</option><option>A-</option><option>B+</option><option>B-</option><option>O+</option><option>O-</option><option>AB+</option><option>AB-</option></CFormSelect></CCol>
                    
                    <CCol xs={12} className="mt-4">
                      <CButton type="button" color="success" onClick={handleMedicalSubmit} disabled={loading || !studentId}>
                        {loading ? <><CSpinner size="sm" className="me-1" />Submitting...</> : <><CIcon icon={cilSave} className="me-1" />Save Medical Record</>}
                      </CButton>
                      {!studentId && <small className="text-danger ms-3">⚠️ Please submit Administration details first</small>}
                    </CCol>
                  </CRow>
                </CTabPane>

                {/* Transport Tab */}
                <CTabPane visible={activeTab === 'transport'}>
                  <CRow className="g-3">
                    <CCol md={4}>
                      <CFormLabel>Transport Required</CFormLabel>
                      <CFormSelect name="transportYesNo" value={formData.transportYesNo} onChange={handleChange}>
                        <option value="">Select</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </CFormSelect>
                    </CCol>
                    <CCol md={4}>
                      <CFormLabel>Route</CFormLabel>
                      <CFormSelect name="routeId" value={formData.routeId} onChange={handleChange} disabled={formData.transportYesNo !== 'Yes'}>
                        <option value="">Select Route</option>
                        {routes.map(route => (
                          <option key={route.RouteId} value={route.RouteId}>{route.RouteName}</option>
                        ))}
                      </CFormSelect>
                    </CCol>
                    <CCol md={4}>
                      <CFormLabel>Stop</CFormLabel>
                      <CFormSelect name="stopId" value={formData.stopId} onChange={handleChange} disabled={!formData.routeId}>
                        <option value="">Select Stop</option>
                        {stops.map(stop => (
                          <option key={stop.StopId} value={stop.StopId}>{stop.StopName}</option>
                        ))}
                      </CFormSelect>
                    </CCol>
                    
                    <CCol xs={12} className="mt-4">
                      <CButton type="button" color="success" onClick={handleTransportSubmit} disabled={loading || !studentId}>
                        {loading ? <><CSpinner size="sm" className="me-1" />Submitting...</> : <><CIcon icon={cilSave} className="me-1" />Save Transport Details</>}
                      </CButton>
                      {!studentId && <small className="text-danger ms-3">⚠️ Please submit Administration details first</small>}
                    </CCol>
                  </CRow>
                </CTabPane>
              </CTabContent>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>

      {/* Add New School Modal */}
      <CModal visible={showAddSchoolModal} onClose={() => setShowAddSchoolModal(false)} size="lg">
        <CModalHeader>
          <CModalTitle>➕ Add New School/College</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow className="g-3">
            <CCol md={12}>
              <CFormLabel>School/College Name *</CFormLabel>
              <CFormInput 
                name="schoolName" 
                value={newSchoolData.schoolName} 
                onChange={handleNewSchoolChange} 
                placeholder="Enter school/college name"
                required
              />
            </CCol>
            <CCol md={6}>
              <CFormLabel>Country</CFormLabel>
              <CFormInput 
                name="schoolCountry" 
                value={newSchoolData.schoolCountry} 
                onChange={handleNewSchoolChange} 
                placeholder="Enter country"
              />
            </CCol>
            <CCol md={6}>
              <CFormLabel>State</CFormLabel>
              <CFormInput 
                name="schoolState" 
                value={newSchoolData.schoolState} 
                onChange={handleNewSchoolChange} 
                placeholder="Enter state"
              />
            </CCol>
            <CCol md={6}>
              <CFormLabel>District</CFormLabel>
              <CFormInput 
                name="schoolDistrict" 
                value={newSchoolData.schoolDistrict} 
                onChange={handleNewSchoolChange} 
                placeholder="Enter district"
              />
            </CCol>
            <CCol md={6}>
              <CFormLabel>Area</CFormLabel>
              <CFormInput 
                name="schoolArea" 
                value={newSchoolData.schoolArea} 
                onChange={handleNewSchoolChange} 
                placeholder="Enter area"
              />
            </CCol>
            <CCol md={4}>
              <CFormLabel>Pincode</CFormLabel>
              <CFormInput 
                name="schoolPincode" 
                value={newSchoolData.schoolPincode} 
                onChange={handleNewSchoolChange} 
                placeholder="Enter pincode"
                maxLength="6"
              />
            </CCol>
            <CCol md={4}>
              <CFormLabel>Contact Number</CFormLabel>
              <CFormInput 
                name="schoolContactNo" 
                value={newSchoolData.schoolContactNo} 
                onChange={handleNewSchoolChange} 
                placeholder="Enter contact number"
              />
            </CCol>
            <CCol md={4}>
              <CFormLabel>Email ID</CFormLabel>
              <CFormInput 
                type="email"
                name="schoolEmailId" 
                value={newSchoolData.schoolEmailId} 
                onChange={handleNewSchoolChange} 
                placeholder="Enter email"
              />
            </CCol>
            <CCol md={12}>
              <CFormLabel>Website</CFormLabel>
              <CFormInput 
                name="schoolWebsite" 
                value={newSchoolData.schoolWebsite} 
                onChange={handleNewSchoolChange} 
                placeholder="Enter website URL"
              />
            </CCol>
          </CRow>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowAddSchoolModal(false)}>
            <CIcon icon={cilX} className="me-1" />
            Cancel
          </CButton>
          <CButton 
            color="success" 
            onClick={handleAddNewSchool} 
            disabled={loading || !newSchoolData.schoolName}
          >
            {loading ? (
              <>
                <CSpinner size="sm" className="me-1" />
                Adding...
              </>
            ) : (
              <>
                <CIcon icon={cilSave} className="me-1" />
                Add School
              </>
            )}
          </CButton>
        </CModalFooter>
      </CModal>
    </CRow>
  )
}

export default RegistrationForm
