import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CCard, CCardBody, CCardHeader, CCol, CRow, CNav, CNavItem, CNavLink,
  CTabContent, CTabPane, CButton, CForm, CFormInput, CFormSelect,
  CFormLabel, CFormTextarea, CAlert,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilSave, cilArrowLeft, cilX } from '@coreui/icons'

const RegistrationForm = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('administration')
  const [success, setSuccess] = useState('')

  const [formData, setFormData] = useState({
    // Administration Details
    dateOfAdmission: '', feeCategory: '', organizationName: '', collegeName: '', branch: '',
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
    motherEmailId: '', motherQualification: '', motherProfession: '', motherOfficeAddress: '',
    guardianName: '', guardianMobileAdmission: '', guardianMobileNo: '', guardianEmailId: '',
    relationWithStudent: '', spouseName: '',
    
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
    siblingId: '', friendId: '', bestFName1: '', bestFName2: '', bestFName3: '', bestFName4: '', bestFName5: '',
    bestFMobile1: '', bestFMobile2: '', bestFMobile3: '', bestFMobile4: '', bestFMobile5: '',
    
    // Medical Records
    height: '', weight: '', medicalBloodGroup: '',
    
    // Transport
    transportYesNo: '', routeId: '', stopId: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Registration Data:', formData)
    setSuccess('Registration saved successfully!')
    setTimeout(() => setSuccess(''), 3000)
  }

  const handleReset = () => {
    if (window.confirm('Reset all fields?')) {
      setFormData({
        dateOfAdmission: '', feeCategory: '', organizationName: '', collegeName: '', branch: '',
        courseType: '', university: '', financialYear: '', course: '', batchId: '', section: '',
        studentName: '', mobileNumber1: '', studentRegistrationNumber: '', studentUniversityNumber: '',
        mobileNumber2: '', mobileNumber3: '', emailId: '', gender: '', dateOfBirth: '', nationality: '',
        birthplace: '', motherTongue: '', category: '', subCategory: '', minority: '', religion: '',
        bloodGroup: '', adharCardNumber: '', domicile: '', panNo: '', fatherName: '', fatherMobileAdmission: '',
        fatherContactNo: '', fatherEmailId: '', fatherAdharNo: '', fatherQualification: '', fatherProfession: '',
        fatherCompanyName: '', fatherOfficeAddress: '', fatherDesignation: '', familyIncome: '', motherName: '',
        motherContactNumber: '', motherMobileAdmission: '', motherEmailId: '', motherQualification: '',
        motherProfession: '', motherOfficeAddress: '', guardianName: '', guardianMobileAdmission: '',
        guardianMobileNo: '', guardianEmailId: '', relationWithStudent: '', spouseName: '', studentUserId: '',
        studentPassword: '', parentLoginId: '', parentPassword: '', pCountry: '', pState: '', pDistrict: '',
        pArea: '', pPincode: '', pAddress: '', cCountry: '', cState: '', cDistrict: '', cArea: '', cPincode: '',
        cAddress: '', gCountry: '', gState: '', gDistrict: '', gArea: '', gPincode: '', gAddress: '',
        schoolCollege: '', schoolPrincipalName: '', schoolMobileNo: '', schoolEmailId: '', bestSchoolTeacherName: '',
        bestSchoolTeacherMobile: '', bestSchoolTeacherEmail: '', bestCoachingTeacherName: '', bestCoachingTeacherMobile: '',
        bestCoachingTeacherEmail: '', prevSchoolCollegeName: '', educationBoard: '', mediumOfInstruction: '',
        tcNumber: '', rollNumber: '', passingYear: '', lastClassPassed: '', totalMarks: '', obtainedMarks: '',
        percentageCgpa: '', reasonForSchoolChange: '', schoolMasterName: '', schoolCountry: '', schoolState: '',
        schoolDistrict: '', schoolArea: '', schoolPincode: '', schoolContactNo: '', schoolEmailId: '', schoolWebsite: '',
        siblingId: '', friendId: '', bestFName1: '', bestFName2: '', bestFName3: '', bestFName4: '', bestFName5: '',
        bestFMobile1: '', bestFMobile2: '', bestFMobile3: '', bestFMobile4: '', bestFMobile5: '', height: '',
        weight: '', medicalBloodGroup: '', transportYesNo: '', routeId: '', stopId: '',
      })
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
            {success && <CAlert color="success" dismissible onClose={() => setSuccess('')}>{success}</CAlert>}

            <CNav variant="tabs" role="tablist" className="mb-3">
              <CNavItem><CNavLink active={activeTab === 'administration'} onClick={() => setActiveTab('administration')} style={{ cursor: 'pointer' }}>Administration Details</CNavLink></CNavItem>
              <CNavItem><CNavLink active={activeTab === 'studentDetails'} onClick={() => setActiveTab('studentDetails')} style={{ cursor: 'pointer' }}>Student Details</CNavLink></CNavItem>
              <CNavItem><CNavLink active={activeTab === 'parentGuardian'} onClick={() => setActiveTab('parentGuardian')} style={{ cursor: 'pointer' }}>Parent & Guardian</CNavLink></CNavItem>
              <CNavItem><CNavLink active={activeTab === 'loginDetails'} onClick={() => setActiveTab('loginDetails')} style={{ cursor: 'pointer' }}>Login Details</CNavLink></CNavItem>
              <CNavItem><CNavLink active={activeTab === 'address'} onClick={() => setActiveTab('address')} style={{ cursor: 'pointer' }}>Address Details</CNavLink></CNavItem>
              <CNavItem><CNavLink active={activeTab === 'lastSchool'} onClick={() => setActiveTab('lastSchool')} style={{ cursor: 'pointer' }}>Last School</CNavLink></CNavItem>
              <CNavItem><CNavLink active={activeTab === 'previousSchool'} onClick={() => setActiveTab('previousSchool')} style={{ cursor: 'pointer' }}>Previous School</CNavLink></CNavItem>
              <CNavItem><CNavLink active={activeTab === 'schoolList'} onClick={() => setActiveTab('schoolList')} style={{ cursor: 'pointer' }}>School List</CNavLink></CNavItem>
              <CNavItem><CNavLink active={activeTab === 'bestFriend'} onClick={() => setActiveTab('bestFriend')} style={{ cursor: 'pointer' }}>Best Friend</CNavLink></CNavItem>
              <CNavItem><CNavLink active={activeTab === 'medical'} onClick={() => setActiveTab('medical')} style={{ cursor: 'pointer' }}>Medical Records</CNavLink></CNavItem>
              <CNavItem><CNavLink active={activeTab === 'transport'} onClick={() => setActiveTab('transport')} style={{ cursor: 'pointer' }}>Transport</CNavLink></CNavItem>
            </CNav>

            <CForm onSubmit={handleSubmit}>
              <CTabContent>
                {/* Administration Details Tab */}
                <CTabPane visible={activeTab === 'administration'}>
                  <CRow className="g-3">
                    <CCol md={4}><CFormLabel>Date of Admission</CFormLabel><CFormInput type="date" name="dateOfAdmission" value={formData.dateOfAdmission} onChange={handleChange} /></CCol>
                    <CCol md={4}><CFormLabel>Fee Category</CFormLabel><CFormSelect name="feeCategory" value={formData.feeCategory} onChange={handleChange}><option value="">Select</option><option>Category 1</option></CFormSelect></CCol>
                    <CCol md={4}><CFormLabel>Organisation Name</CFormLabel><CFormSelect name="organizationName" value={formData.organizationName} onChange={handleChange}><option value="">Select</option><option>Org 1</option></CFormSelect></CCol>
                    <CCol md={4}><CFormLabel>College Name</CFormLabel><CFormSelect name="collegeName" value={formData.collegeName} onChange={handleChange}><option value="">Select</option><option>College 1</option></CFormSelect></CCol>
                    <CCol md={4}><CFormLabel>Branch</CFormLabel><CFormSelect name="branch" value={formData.branch} onChange={handleChange}><option value="">Select</option><option>Branch 1</option></CFormSelect></CCol>
                    <CCol md={4}><CFormLabel>Course Type</CFormLabel><CFormSelect name="courseType" value={formData.courseType} onChange={handleChange}><option value="">Select</option><option>UG</option><option>PG</option></CFormSelect></CCol>
                    <CCol md={4}><CFormLabel>University</CFormLabel><CFormSelect name="university" value={formData.university} onChange={handleChange}><option value="">Select</option><option>University 1</option></CFormSelect></CCol>
                    <CCol md={4}><CFormLabel>Financial Year</CFormLabel><CFormSelect name="financialYear" value={formData.financialYear} onChange={handleChange}><option value="">Select</option><option>2024-25</option></CFormSelect></CCol>
                    <CCol md={4}><CFormLabel>Course</CFormLabel><CFormSelect name="course" value={formData.course} onChange={handleChange}><option value="">Select</option><option>Course 1</option></CFormSelect></CCol>
                    <CCol md={4}><CFormLabel>Batch ID</CFormLabel><CFormSelect name="batchId" value={formData.batchId} onChange={handleChange}><option value="">Select</option><option>2024</option></CFormSelect></CCol>
                    <CCol md={4}><CFormLabel>Section</CFormLabel><CFormInput name="section" value={formData.section} onChange={handleChange} placeholder="Enter section" /></CCol>
                    <CCol md={4}><CFormLabel>Student Name</CFormLabel><CFormInput name="studentName" value={formData.studentName} onChange={handleChange} placeholder="Enter student name" /></CCol>
                    <CCol md={4}><CFormLabel>Mobile Number 1</CFormLabel><CFormInput name="mobileNumber1" value={formData.mobileNumber1} onChange={handleChange} placeholder="Enter mobile number" /></CCol>
                    <CCol md={4}><CFormLabel>Student Registration Number</CFormLabel><CFormInput name="studentRegistrationNumber" value={formData.studentRegistrationNumber} onChange={handleChange} placeholder="Enter SRN" /></CCol>
                    <CCol md={4}><CFormLabel>Student University Number</CFormLabel><CFormInput name="studentUniversityNumber" value={formData.studentUniversityNumber} onChange={handleChange} placeholder="Enter university number" /></CCol>
                    <CCol md={4}><CFormLabel>Mobile Number 2</CFormLabel><CFormInput name="mobileNumber2" value={formData.mobileNumber2} onChange={handleChange} placeholder="Enter mobile number" /></CCol>
                    <CCol md={4}><CFormLabel>Mobile Number 3</CFormLabel><CFormInput name="mobileNumber3" value={formData.mobileNumber3} onChange={handleChange} placeholder="Enter mobile number" /></CCol>
                  </CRow>
                </CTabPane>

                {/* Student Details Tab */}
                <CTabPane visible={activeTab === 'studentDetails'}>
                  <CRow className="g-3">
                    <CCol md={4}><CFormLabel>Email ID</CFormLabel><CFormInput type="email" name="emailId" value={formData.emailId} onChange={handleChange} placeholder="Enter email" /></CCol>
                    <CCol md={4}><CFormLabel>Gender</CFormLabel><CFormSelect name="gender" value={formData.gender} onChange={handleChange}><option value="">Select</option><option>Male</option><option>Female</option><option>Other</option></CFormSelect></CCol>
                    <CCol md={4}><CFormLabel>Date of Birth</CFormLabel><CFormInput type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} /></CCol>
                    <CCol md={4}><CFormLabel>Nationality</CFormLabel><CFormInput name="nationality" value={formData.nationality} onChange={handleChange} placeholder="Enter nationality" /></CCol>
                    <CCol md={4}><CFormLabel>Birthplace</CFormLabel><CFormInput name="birthplace" value={formData.birthplace} onChange={handleChange} placeholder="Enter birthplace" /></CCol>
                    <CCol md={4}><CFormLabel>Mother Tongue</CFormLabel><CFormInput name="motherTongue" value={formData.motherTongue} onChange={handleChange} placeholder="Enter mother tongue" /></CCol>
                    <CCol md={4}><CFormLabel>Category</CFormLabel><CFormSelect name="category" value={formData.category} onChange={handleChange}><option value="">Select</option><option>General</option><option>OBC</option><option>SC</option><option>ST</option></CFormSelect></CCol>
                    <CCol md={4}><CFormLabel>Sub-Category</CFormLabel><CFormInput name="subCategory" value={formData.subCategory} onChange={handleChange} placeholder="Enter sub-category" /></CCol>
                    <CCol md={4}><CFormLabel>Minority</CFormLabel><CFormSelect name="minority" value={formData.minority} onChange={handleChange}><option value="">Select</option><option>Yes</option><option>No</option></CFormSelect></CCol>
                    <CCol md={4}><CFormLabel>Religion</CFormLabel><CFormInput name="religion" value={formData.religion} onChange={handleChange} placeholder="Enter religion" /></CCol>
                    <CCol md={4}><CFormLabel>Blood Group</CFormLabel><CFormSelect name="bloodGroup" value={formData.bloodGroup} onChange={handleChange}><option value="">Select</option><option>A+</option><option>A-</option><option>B+</option><option>B-</option><option>O+</option><option>O-</option><option>AB+</option><option>AB-</option></CFormSelect></CCol>
                    <CCol md={4}><CFormLabel>Adhar Card Number</CFormLabel><CFormInput name="adharCardNumber" value={formData.adharCardNumber} onChange={handleChange} placeholder="Enter Adhar number" /></CCol>
                    <CCol md={4}><CFormLabel>Domicile</CFormLabel><CFormInput name="domicile" value={formData.domicile} onChange={handleChange} placeholder="Enter domicile" /></CCol>
                    <CCol md={4}><CFormLabel>PAN No.</CFormLabel><CFormInput name="panNo" value={formData.panNo} onChange={handleChange} placeholder="Enter PAN number" /></CCol>
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
                    <CCol md={4}><CFormLabel>Spouse Name</CFormLabel><CFormInput name="spouseName" value={formData.spouseName} onChange={handleChange} placeholder="Enter spouse name" /></CCol>
                  </CRow>
                </CTabPane>

                {/* Login Details Tab */}
                <CTabPane visible={activeTab === 'loginDetails'}>
                  <CRow className="g-3">
                    <CCol xs={12}><h6 className="text-primary">Student Login</h6></CCol>
                    <CCol md={6}><CFormLabel>Student User ID</CFormLabel><CFormInput name="studentUserId" value={formData.studentUserId} onChange={handleChange} placeholder="Enter user ID" /></CCol>
                    <CCol md={6}><CFormLabel>Password</CFormLabel><CFormInput type="password" name="studentPassword" value={formData.studentPassword} onChange={handleChange} placeholder="Enter password" /></CCol>
                    
                    <CCol xs={12}><h6 className="text-primary mt-3">Parent Login</h6></CCol>
                    <CCol md={6}><CFormLabel>Parent Login ID</CFormLabel><CFormInput name="parentLoginId" value={formData.parentLoginId} onChange={handleChange} placeholder="Enter login ID" /></CCol>
                    <CCol md={6}><CFormLabel>Password</CFormLabel><CFormInput type="password" name="parentPassword" value={formData.parentPassword} onChange={handleChange} placeholder="Enter password" /></CCol>
                  </CRow>
                </CTabPane>

                {/* Address Details Tab */}
                <CTabPane visible={activeTab === 'address'}>
                  <CRow className="g-3">
                    <CCol xs={12}><h6 className="text-primary">Permanent Address</h6></CCol>
                    <CCol md={3}><CFormLabel>P_Country</CFormLabel><CFormSelect name="pCountry" value={formData.pCountry} onChange={handleChange}><option value="">Select</option><option>India</option></CFormSelect></CCol>
                    <CCol md={3}><CFormLabel>P_State</CFormLabel><CFormSelect name="pState" value={formData.pState} onChange={handleChange}><option value="">Select</option><option>State 1</option></CFormSelect></CCol>
                    <CCol md={3}><CFormLabel>P_District</CFormLabel><CFormSelect name="pDistrict" value={formData.pDistrict} onChange={handleChange}><option value="">Select</option><option>District 1</option></CFormSelect></CCol>
                    <CCol md={3}><CFormLabel>P_Area</CFormLabel><CFormInput name="pArea" value={formData.pArea} onChange={handleChange} placeholder="Enter area" /></CCol>
                    <CCol md={3}><CFormLabel>P_Pincode</CFormLabel><CFormInput name="pPincode" value={formData.pPincode} onChange={handleChange} placeholder="Enter pincode" /></CCol>
                    <CCol md={9}><CFormLabel>P_Address</CFormLabel><CFormTextarea name="pAddress" value={formData.pAddress} onChange={handleChange} rows={2} placeholder="Enter address" /></CCol>
                    
                    <CCol xs={12}><h6 className="text-primary mt-3">Current Address</h6></CCol>
                    <CCol md={3}><CFormLabel>C_Country</CFormLabel><CFormSelect name="cCountry" value={formData.cCountry} onChange={handleChange}><option value="">Select</option><option>India</option></CFormSelect></CCol>
                    <CCol md={3}><CFormLabel>C_State</CFormLabel><CFormSelect name="cState" value={formData.cState} onChange={handleChange}><option value="">Select</option><option>State 1</option></CFormSelect></CCol>
                    <CCol md={3}><CFormLabel>C_District</CFormLabel><CFormSelect name="cDistrict" value={formData.cDistrict} onChange={handleChange}><option value="">Select</option><option>District 1</option></CFormSelect></CCol>
                    <CCol md={3}><CFormLabel>C_Area</CFormLabel><CFormInput name="cArea" value={formData.cArea} onChange={handleChange} placeholder="Enter area" /></CCol>
                    <CCol md={3}><CFormLabel>C_Pincode</CFormLabel><CFormInput name="cPincode" value={formData.cPincode} onChange={handleChange} placeholder="Enter pincode" /></CCol>
                    <CCol md={9}><CFormLabel>C_Address</CFormLabel><CFormTextarea name="cAddress" value={formData.cAddress} onChange={handleChange} rows={2} placeholder="Enter address" /></CCol>
                    
                    <CCol xs={12}><h6 className="text-primary mt-3">Guardian Address</h6></CCol>
                    <CCol md={3}><CFormLabel>G_Country</CFormLabel><CFormSelect name="gCountry" value={formData.gCountry} onChange={handleChange}><option value="">Select</option><option>India</option></CFormSelect></CCol>
                    <CCol md={3}><CFormLabel>G_State</CFormLabel><CFormSelect name="gState" value={formData.gState} onChange={handleChange}><option value="">Select</option><option>State 1</option></CFormSelect></CCol>
                    <CCol md={3}><CFormLabel>G_District</CFormLabel><CFormSelect name="gDistrict" value={formData.gDistrict} onChange={handleChange}><option value="">Select</option><option>District 1</option></CFormSelect></CCol>
                    <CCol md={3}><CFormLabel>G_Area</CFormLabel><CFormInput name="gArea" value={formData.gArea} onChange={handleChange} placeholder="Enter area" /></CCol>
                    <CCol md={3}><CFormLabel>G_Pincode</CFormLabel><CFormInput name="gPincode" value={formData.gPincode} onChange={handleChange} placeholder="Enter pincode" /></CCol>
                    <CCol md={9}><CFormLabel>G_Address</CFormLabel><CFormTextarea name="gAddress" value={formData.gAddress} onChange={handleChange} rows={2} placeholder="Enter address" /></CCol>
                  </CRow>
                </CTabPane>

                {/* Last School Tab */}
                <CTabPane visible={activeTab === 'lastSchool'}>
                  <CRow className="g-3">
                    <CCol md={6}><CFormLabel>School/College</CFormLabel><CFormInput name="schoolCollege" value={formData.schoolCollege} onChange={handleChange} placeholder="Enter school/college" /></CCol>
                    <CCol md={6}><CFormLabel>School Principal Name</CFormLabel><CFormInput name="schoolPrincipalName" value={formData.schoolPrincipalName} onChange={handleChange} placeholder="Enter principal name" /></CCol>
                    <CCol md={4}><CFormLabel>Mobile No.</CFormLabel><CFormInput name="schoolMobileNo" value={formData.schoolMobileNo} onChange={handleChange} placeholder="Enter mobile" /></CCol>
                    <CCol md={4}><CFormLabel>Email ID</CFormLabel><CFormInput type="email" name="schoolEmailId" value={formData.schoolEmailId} onChange={handleChange} placeholder="Enter email" /></CCol>
                    <CCol md={4}><CFormLabel>Best School Teacher Name</CFormLabel><CFormInput name="bestSchoolTeacherName" value={formData.bestSchoolTeacherName} onChange={handleChange} placeholder="Enter teacher name" /></CCol>
                    <CCol md={4}><CFormLabel>Mobile Number</CFormLabel><CFormInput name="bestSchoolTeacherMobile" value={formData.bestSchoolTeacherMobile} onChange={handleChange} placeholder="Enter mobile" /></CCol>
                    <CCol md={4}><CFormLabel>Email ID</CFormLabel><CFormInput type="email" name="bestSchoolTeacherEmail" value={formData.bestSchoolTeacherEmail} onChange={handleChange} placeholder="Enter email" /></CCol>
                    <CCol md={4}><CFormLabel>Best Coaching Teacher Name</CFormLabel><CFormInput name="bestCoachingTeacherName" value={formData.bestCoachingTeacherName} onChange={handleChange} placeholder="Enter teacher name" /></CCol>
                    <CCol md={4}><CFormLabel>Mobile Number</CFormLabel><CFormInput name="bestCoachingTeacherMobile" value={formData.bestCoachingTeacherMobile} onChange={handleChange} placeholder="Enter mobile" /></CCol>
                    <CCol md={4}><CFormLabel>Email ID</CFormLabel><CFormInput type="email" name="bestCoachingTeacherEmail" value={formData.bestCoachingTeacherEmail} onChange={handleChange} placeholder="Enter email" /></CCol>
                  </CRow>
                </CTabPane>

                {/* Previous School Details Tab */}
                <CTabPane visible={activeTab === 'previousSchool'}>
                  <CRow className="g-3">
                    <CCol md={6}><CFormLabel>College/School Name</CFormLabel><CFormInput name="prevSchoolCollegeName" value={formData.prevSchoolCollegeName} onChange={handleChange} placeholder="Enter school/college name" /></CCol>
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
                  </CRow>
                </CTabPane>

                {/* School List / School Master Tab */}
                <CTabPane visible={activeTab === 'schoolList'}>
                  <CRow className="g-3">
                    <CCol md={6}><CFormLabel>School/College Name</CFormLabel><CFormInput name="schoolMasterName" value={formData.schoolMasterName} onChange={handleChange} placeholder="Enter school/college name" /></CCol>
                    <CCol md={3}><CFormLabel>Country</CFormLabel><CFormSelect name="schoolCountry" value={formData.schoolCountry} onChange={handleChange}><option value="">Select</option><option>India</option></CFormSelect></CCol>
                    <CCol md={3}><CFormLabel>State</CFormLabel><CFormSelect name="schoolState" value={formData.schoolState} onChange={handleChange}><option value="">Select</option><option>State 1</option></CFormSelect></CCol>
                    <CCol md={4}><CFormLabel>District</CFormLabel><CFormSelect name="schoolDistrict" value={formData.schoolDistrict} onChange={handleChange}><option value="">Select</option><option>District 1</option></CFormSelect></CCol>
                    <CCol md={4}><CFormLabel>Area</CFormLabel><CFormInput name="schoolArea" value={formData.schoolArea} onChange={handleChange} placeholder="Enter area" /></CCol>
                    <CCol md={4}><CFormLabel>Pincode</CFormLabel><CFormInput name="schoolPincode" value={formData.schoolPincode} onChange={handleChange} placeholder="Enter pincode" /></CCol>
                    <CCol md={4}><CFormLabel>School/College Contact No</CFormLabel><CFormInput name="schoolContactNo" value={formData.schoolContactNo} onChange={handleChange} placeholder="Enter contact" /></CCol>
                    <CCol md={4}><CFormLabel>Email ID</CFormLabel><CFormInput type="email" name="schoolEmailId" value={formData.schoolEmailId} onChange={handleChange} placeholder="Enter email" /></CCol>
                    <CCol md={4}><CFormLabel>Website</CFormLabel><CFormInput name="schoolWebsite" value={formData.schoolWebsite} onChange={handleChange} placeholder="Enter website" /></CCol>
                  </CRow>
                </CTabPane>

                {/* Best Friend Tab */}
                <CTabPane visible={activeTab === 'bestFriend'}>
                  <CRow className="g-3">
                    <CCol md={6}><CFormLabel>Sibling ID</CFormLabel><CFormInput name="siblingId" value={formData.siblingId} onChange={handleChange} placeholder="Enter sibling ID" /></CCol>
                    <CCol md={6}><CFormLabel>Friend ID</CFormLabel><CFormInput name="friendId" value={formData.friendId} onChange={handleChange} placeholder="Enter friend ID" /></CCol>
                    
                    <CCol xs={12}><h6 className="text-primary mt-3">Best Friends</h6></CCol>
                    <CCol md={6}><CFormLabel>Best Friend Name 1</CFormLabel><CFormInput name="bestFName1" value={formData.bestFName1} onChange={handleChange} placeholder="Enter name" /></CCol>
                    <CCol md={6}><CFormLabel>Best Friend Mobile 1</CFormLabel><CFormInput name="bestFMobile1" value={formData.bestFMobile1} onChange={handleChange} placeholder="Enter mobile" /></CCol>
                    <CCol md={6}><CFormLabel>Best Friend Name 2</CFormLabel><CFormInput name="bestFName2" value={formData.bestFName2} onChange={handleChange} placeholder="Enter name" /></CCol>
                    <CCol md={6}><CFormLabel>Best Friend Mobile 2</CFormLabel><CFormInput name="bestFMobile2" value={formData.bestFMobile2} onChange={handleChange} placeholder="Enter mobile" /></CCol>
                    <CCol md={6}><CFormLabel>Best Friend Name 3</CFormLabel><CFormInput name="bestFName3" value={formData.bestFName3} onChange={handleChange} placeholder="Enter name" /></CCol>
                    <CCol md={6}><CFormLabel>Best Friend Mobile 3</CFormLabel><CFormInput name="bestFMobile3" value={formData.bestFMobile3} onChange={handleChange} placeholder="Enter mobile" /></CCol>
                    <CCol md={6}><CFormLabel>Best Friend Name 4</CFormLabel><CFormInput name="bestFName4" value={formData.bestFName4} onChange={handleChange} placeholder="Enter name" /></CCol>
                    <CCol md={6}><CFormLabel>Best Friend Mobile 4</CFormLabel><CFormInput name="bestFMobile4" value={formData.bestFMobile4} onChange={handleChange} placeholder="Enter mobile" /></CCol>
                    <CCol md={6}><CFormLabel>Best Friend Name 5</CFormLabel><CFormInput name="bestFName5" value={formData.bestFName5} onChange={handleChange} placeholder="Enter name" /></CCol>
                    <CCol md={6}><CFormLabel>Best Friend Mobile 5</CFormLabel><CFormInput name="bestFMobile5" value={formData.bestFMobile5} onChange={handleChange} placeholder="Enter mobile" /></CCol>
                  </CRow>
                </CTabPane>

                {/* Medical Records Tab */}
                <CTabPane visible={activeTab === 'medical'}>
                  <CRow className="g-3">
                    <CCol md={4}><CFormLabel>Height</CFormLabel><CFormInput name="height" value={formData.height} onChange={handleChange} placeholder="Enter height" /></CCol>
                    <CCol md={4}><CFormLabel>Weight</CFormLabel><CFormInput name="weight" value={formData.weight} onChange={handleChange} placeholder="Enter weight" /></CCol>
                    <CCol md={4}><CFormLabel>Blood Group</CFormLabel><CFormSelect name="medicalBloodGroup" value={formData.medicalBloodGroup} onChange={handleChange}><option value="">Select</option><option>A+</option><option>A-</option><option>B+</option><option>B-</option><option>O+</option><option>O-</option><option>AB+</option><option>AB-</option></CFormSelect></CCol>
                  </CRow>
                </CTabPane>

                {/* Transport Tab */}
                <CTabPane visible={activeTab === 'transport'}>
                  <CRow className="g-3">
                    <CCol md={4}><CFormLabel>Transport (Yes/No)</CFormLabel><CFormSelect name="transportYesNo" value={formData.transportYesNo} onChange={handleChange}><option value="">Select</option><option>Yes</option><option>No</option></CFormSelect></CCol>
                    <CCol md={4}><CFormLabel>Route ID</CFormLabel><CFormSelect name="routeId" value={formData.routeId} onChange={handleChange}><option value="">Select</option><option>Route 1</option><option>Route 2</option></CFormSelect></CCol>
                    <CCol md={4}><CFormLabel>Stop ID</CFormLabel><CFormSelect name="stopId" value={formData.stopId} onChange={handleChange}><option value="">Select</option><option>Stop 1</option><option>Stop 2</option></CFormSelect></CCol>
                  </CRow>
                </CTabPane>
              </CTabContent>

              <div className="mt-4 d-flex gap-2">
                <CButton type="submit" color="primary"><CIcon icon={cilSave} className="me-1" />Save Registration</CButton>
                <CButton type="button" color="secondary" onClick={handleReset}><CIcon icon={cilX} className="me-1" />Reset</CButton>
              </div>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default RegistrationForm
