import React, { useEffect, useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CAlert,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
  CBadge,
} from '@coreui/react'
import { searchStudentBySRN, getFeeSelectStudent, getStudentProfile } from '../../api/api'

const Profile = () => {
  const [searchResult, setSearchResult] = useState(null)
  const [studentDetails, setStudentDetails] = useState(null)
  const [profileData, setProfileData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('personal')

  // Load profile data on component mount
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const studentDataStr = localStorage.getItem('studentData')
        if (!studentDataStr) {
          setError('Please login to view your profile.')
          setIsLoading(false)
          return
        }

        const studentData = JSON.parse(studentDataStr)
        const admissionNo = studentData.admissionno

        if (!admissionNo) {
          setError('Admission number not found. Please login again.')
          setIsLoading(false)
          return
        }

        // Call searchStudentBySRN for the top card (same as StudentFeePayment)
        const data = await searchStudentBySRN(admissionNo)
        
        if (data?.length > 0) {
          setSearchResult(data[0])
          const id = data[0].id

          // Get detailed student information for top card
          const data2 = await getFeeSelectStudent(id)
          setStudentDetails(data2[0])
        } else {
          setError('No student record found.')
        }

        // Call getStudentProfile for detailed tabs below
        const response = await getStudentProfile(admissionNo)
        
        if (response.Success && response.Data && response.Data.length > 0) {
          setProfileData(response.Data[0])
        } else {
          setError('Profile data not found.')
        }
      } catch (err) {
        console.error('Error loading profile:', err)
        setError('Failed to load profile. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    loadProfile()
  }, [])

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  const getGenderLabel = (genderCode) => {
    if (genderCode === '1') return 'Male'
    if (genderCode === '2') return 'Female'
    return 'Other'
  }

  const getBloodGroupLabel = (code) => {
    const bloodGroups = { '1': 'A+', '2': 'A-', '3': 'B+', '4': 'B-', '5': 'O+', '6': 'O-', '7': 'AB+', '8': 'AB-' }
    return bloodGroups[code] || 'N/A'
  }

  const InfoRow = ({ label, value }) => (
    <CCol xs={12} md={6} lg={4} className="mb-3">
      <div className="border-start border-3 border-primary ps-3 py-2 bg-light">
        <small className="text-muted text-uppercase fw-semibold" style={{ fontSize: '0.7rem' }}>{label}</small>
        <div className="fw-semibold text-dark mt-1">{value || 'N/A'}</div>
      </div>
    </CCol>
  )

  if (isLoading) {
    return (
      <CCard className="shadow-sm">
        <CCardHeader className="fw-bold">👤 My Profile</CCardHeader>
        <CCardBody className="text-center py-5">
          <div className="spinner-border text-primary mb-3" role="status" />
          <div className="fw-semibold">Loading your profile...</div>
        </CCardBody>
      </CCard>
    )
  }

  if (error) {
    return (
      <CCard className="shadow-sm">
        <CCardHeader className="fw-bold">👤 My Profile</CCardHeader>
        <CCardBody>
          <CAlert color="danger">{error}</CAlert>
        </CCardBody>
      </CCard>
    )
  }

  if (!searchResult || !studentDetails) {
    return (
      <CCard className="shadow-sm">
        <CCardHeader className="fw-bold">👤 My Profile</CCardHeader>
        <CCardBody>
          <CAlert color="info">No profile data available.</CAlert>
        </CCardBody>
      </CCard>
    )
  }

  return (
    <div>
      {/* Header Card with Photo - EXACT Same as StudentFeePayment */}
      <CCard className="border-0 shadow mb-4">
        <CCardBody className="p-0">
          <div className="bg-primary text-white py-3 px-4">
            <h4 className="mb-0 fw-bold">Student Profile</h4>
          </div>
          <CCardBody className="p-3">
            {/* Student Profile Card - Exact copy from StudentFeePayment */}
            {searchResult && studentDetails && (
              <CCard className="mb-3 border-0 shadow-sm rounded-3">
                <CCardBody>
                  <CRow>
                    <CCol
                      xs={12}
                      md={4}
                      className="d-flex flex-column align-items-center justify-content-center text-center border-end mb-3 mb-md-0"
                    >
                      {/* Dummy Photo */}
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
                            {searchResult.firstname?.charAt(0)}{searchResult.lastname?.charAt(0)}
                          </div>
                        </CCol>
                        <CCol>
                          <h5 className="fw-bold text-primary mb-1">
                            {searchResult.firstname} {searchResult.lastname}
                          </h5>
                          <div className="text-muted mb-2">
                            {searchResult.personalemail}
                          </div>
                          <div>
                            <strong>📞</strong> {searchResult.mobileno1}
                          </div>
                          <div className="badge bg-info mt-2 px-3 py-2">
                            🆔 {studentDetails.admissionno}
                          </div>
                        </CCol>
                      </CRow>
                    </CCol>

                    <CCol xs={12} md={8}>
                      <CRow className="gy-2 gx-3">
                        <CCol xs={6} md={4}>
                          <strong>College</strong>
                          <div className="text-muted">{studentDetails.collegename}</div>
                        </CCol>
                        <CCol xs={6} md={2}>
                          <strong>Branch</strong>
                          <div className="text-muted">{studentDetails.Branchname}</div>
                        </CCol>
                        <CCol xs={6} md={3}>
                          <strong>Course</strong>
                          <div className="text-muted">{studentDetails.corsename}</div>
                        </CCol>
                        <CCol xs={6} md={3}>
                          <strong>Type</strong>
                          <div className="text-muted">{studentDetails.coursename}</div>
                        </CCol>
                        <CCol xs={6} md={4}>
                          <strong>Fee Category</strong>
                          <div className="text-muted">
                            {studentDetails.feecategoryname}
                          </div>
                        </CCol>
                        <CCol xs={6} md={2}>
                          <strong>Semester</strong>
                          <div className="text-muted">{studentDetails.semesterno}</div>
                        </CCol>
                        <CCol xs={6} md={3}>
                          <strong>Batch</strong>
                          <div className="text-muted">{studentDetails.Batchno}</div>
                        </CCol>
                        <CCol xs={6} md={3}>
                          <strong>Section</strong>
                          <div className="text-muted">{studentDetails.Section}</div>
                        </CCol>
                      </CRow>
                    </CCol>
                  </CRow>
                </CCardBody>
              </CCard>
            )}
          </CCardBody>
        </CCardBody>
      </CCard>

      {/* Tabs Navigation */}
      <CCard className="border-0 shadow mb-3">
        <CCardBody className="p-0">
          <CNav variant="tabs" role="tablist" className="border-bottom">
            <CNavItem>
              <CNavLink
                active={activeTab === 'personal'}
                onClick={() => setActiveTab('personal')}
                style={{ cursor: 'pointer' }}
                className="fw-semibold"
              >
                <span className="me-2">👤</span> Personal Info
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink
                active={activeTab === 'academic'}
                onClick={() => setActiveTab('academic')}
                style={{ cursor: 'pointer' }}
                className="fw-semibold"
              >
                <span className="me-2">🎓</span> Academic Details
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink
                active={activeTab === 'family'}
                onClick={() => setActiveTab('family')}
                style={{ cursor: 'pointer' }}
                className="fw-semibold"
              >
                <span className="me-2">👨‍👩‍👧‍👦</span> Family Details
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink
                active={activeTab === 'contact'}
                onClick={() => setActiveTab('contact')}
                style={{ cursor: 'pointer' }}
                className="fw-semibold"
              >
                <span className="me-2">📍</span> Contact & Address
              </CNavLink>
            </CNavItem>
          </CNav>
        </CCardBody>
      </CCard>

      {/* Tab Content */}
      <CTabContent>
        {/* Personal Info Tab */}
        <CTabPane visible={activeTab === 'personal'}>
          <CCard className="border-0 shadow">
            <CCardBody className="p-0">
              <div className="bg-primary text-white py-2 px-4">
                <h6 className="mb-0 fw-bold">👤 Personal Information</h6>
              </div>
              <CRow className="p-4">
                <InfoRow label="First Name" value={profileData.firstname} />
                <InfoRow label="Middle Name" value={profileData.middlename} />
                <InfoRow label="Last Name" value={profileData.lastname} />
                <InfoRow label="Gender" value={getGenderLabel(profileData.gender)} />
                <InfoRow label="Date of Birth" value={formatDate(profileData.dateofbirth)} />
                <InfoRow label="Blood Group" value={getBloodGroupLabel(profileData.bloodgroup)} />
                <InfoRow label="Personal Email" value={profileData.personalemail} />
                <InfoRow label="College Email" value={profileData.collegeemail} />
                <InfoRow label="Mobile Number 1" value={profileData.mobileno1} />
                <InfoRow label="Mobile Number 2" value={profileData.mobileno2} />
                <InfoRow label="Landline" value={profileData.studentlandline} />
                <InfoRow label="Aadhar Card No" value={profileData.adharcardno} />
                <InfoRow label="Height (cm)" value={profileData.studentheight} />
                <InfoRow label="Weight (kg)" value={profileData.studentweight} />
                <InfoRow label="Marital Status" value={profileData.MaritalStatus} />
                <InfoRow label="Religion" value={profileData.Religion} />
              </CRow>
            </CCardBody>
          </CCard>
        </CTabPane>

        {/* Academic Details Tab */}
        <CTabPane visible={activeTab === 'academic'}>
          <CCard className="border-0 shadow">
            <CCardBody className="p-0">
              <div className="bg-success text-white py-2 px-4">
                <h6 className="mb-0 fw-bold">🎓 Academic Details</h6>
              </div>
              <CRow className="p-4">
                <InfoRow label="Admission Number" value={profileData.admissionno} />
                <InfoRow label="Student ID" value={profileData.studentid} />
                <InfoRow label="Branch" value={profileData.Branchname} />
                <InfoRow label="Course ID" value={profileData.courseid} />
                <InfoRow label="University ID" value={profileData.universityid} />
                <InfoRow label="Course Type ID" value={profileData.coursetypeid} />
                <InfoRow label="Batch ID" value={profileData.batchid} />
                <InfoRow label="Semester ID" value={profileData.semesterid} />
                <InfoRow label="All Semesters" value={profileData.allsemesters} />
                <InfoRow label="Section" value={profileData.section} />
                <InfoRow label="Specialisation" value={profileData.specialisation} />
                <InfoRow label="Specialisation 2" value={profileData.specialisation2} />
                <InfoRow label="Fee Category ID" value={profileData.feescategoryid} />
                <InfoRow label="Fee Submitted" value={profileData.feesubmitted ? 'Yes' : 'No'} />
                <InfoRow label="Total Fee Paid" value={profileData.TotalFeePaid} />
                <InfoRow label="Confirmation Date" value={formatDate(profileData.confirmationdate)} />
                <InfoRow label="TSRN" value={profileData.tsrn} />
                <InfoRow label="PES No" value={profileData.PES_No} />
                <InfoRow label="SDMS ID" value={profileData.SDMSID} />
                <InfoRow label="Form No" value={profileData.formno} />
                <InfoRow label="App No" value={profileData.appno} />
                <InfoRow label="Category" value={profileData.category} />
                <InfoRow label="Punch Code" value={profileData.punchcode} />
                <InfoRow label="Is Active" value={profileData.isactive ? 'Yes' : 'No'} />
                <InfoRow label="Status" value={profileData.status ? 'Active' : 'Inactive'} />
              </CRow>
            </CCardBody>
          </CCard>
        </CTabPane>

        {/* Family Details Tab */}
        <CTabPane visible={activeTab === 'family'}>
          <CCard className="border-0 shadow mb-3">
            <CCardBody className="p-0">
              <div className="bg-info text-white py-2 px-4">
                <h6 className="mb-0 fw-bold">👨‍👩‍👧‍👦 Family & Guardian Information</h6>
              </div>
              <div className="p-4">
                <div className="bg-light border-start border-4 border-primary p-3 mb-4">
                  <h6 className="fw-bold mb-3 text-primary">Father's Details</h6>
              <CRow>
                <InfoRow label="Father's Name" value={profileData.fathername} />
                <InfoRow label="Father's Occupation" value={profileData.fatheroccupation} />
                <InfoRow label="Father's Industry" value={profileData.f_industry} />
                <InfoRow label="Father's Functional Area" value={profileData.f_functionalarea} />
                <InfoRow label="Father's Role" value={profileData.f_role} />
                <InfoRow label="Father's Company" value={profileData.f_companyname} />
                <InfoRow label="Father's Annual Income" value={profileData.f_annualincome} />
              </CRow>
                </div>

                <div className="bg-light border-start border-4 border-success p-3 mb-4">
                  <h6 className="fw-bold mb-3 text-success">Mother's Details</h6>
                  <CRow>
                <InfoRow label="Mother's Name" value={profileData.mothername} />
                <InfoRow label="Mother's Industry" value={profileData.m_industry} />
                <InfoRow label="Mother's Functional Area" value={profileData.m_functionalarea} />
                <InfoRow label="Mother's Role" value={profileData.m_role} />
                <InfoRow label="Mother's Company" value={profileData.m_companyname} />
                <InfoRow label="Mother's Annual Income" value={profileData.m_annualincome} />
              </CRow>
                </div>

                <div className="bg-light border-start border-4 border-warning p-3 mb-4">
                  <h6 className="fw-bold mb-3 text-warning">Guardian's Details</h6>
                  <CRow>
                <InfoRow label="Guardian's Name" value={profileData.g_name} />
                <InfoRow label="Guardian's Industry" value={profileData.g_industry} />
                <InfoRow label="Guardian's Functional Area" value={profileData.g_functionalarea} />
                <InfoRow label="Guardian's Role" value={profileData.g_role} />
                <InfoRow label="Guardian's Company" value={profileData.g_companyname} />
                <InfoRow label="Guardian's Annual Income" value={profileData.g_annualincome} />
              </CRow>
                </div>

                <div className="bg-light border-start border-4 border-info p-3 mb-4">
                  <h6 className="fw-bold mb-3 text-info">Local Guardian Details</h6>
                  <CRow>
                <InfoRow label="Local Guardian Name" value={profileData.localgurdianname} />
                <InfoRow label="Relation" value={profileData.relation} />
                <InfoRow label="Mobile" value={profileData.localmobile1} />
                <InfoRow label="Landline" value={profileData.locallandlineno} />
                <InfoRow label="Email" value={profileData.guardianemail} />
              </CRow>
                </div>

                <div className="bg-light border-start border-4 border-danger p-3 mb-4">
                  <h6 className="fw-bold mb-3 text-danger">Family Information</h6>
                  <CRow>
                <InfoRow label="Number of Members" value={profileData.no_of_members} />
                <InfoRow label="Household Income" value={profileData.HouseHoldIncome} />
                <InfoRow label="Family Occupation" value={profileData.Family_Occupation} />
                <InfoRow label="Parent Email" value={profileData.parentemail} />
                <InfoRow label="Parent Mobile 1" value={profileData.mobile1} />
                <InfoRow label="Parent Mobile 2" value={profileData.mobile2} />
              </CRow>
                </div>
              </div>
            </CCardBody>
          </CCard>
        </CTabPane>

        {/* Contact & Address Tab */}
        <CTabPane visible={activeTab === 'contact'}>
          <CCard className="border-0 shadow">
            <CCardBody className="p-0">
              <div className="bg-warning text-white py-2 px-4">
                <h6 className="mb-0 fw-bold">📍 Contact & Address Information</h6>
              </div>
              <div className="p-4">
                <div className="bg-light border-start border-4 border-primary p-3 mb-4">
                  <h6 className="fw-bold mb-3 text-primary">Primary Address</h6>
              <CRow>
                <InfoRow label="Address Line 1" value={profileData.address} />
                <InfoRow label="Address Line 2" value={profileData.addressline2} />
                <InfoRow label="Village" value={profileData.village} />
                <InfoRow label="Town" value={profileData.town} />
                <InfoRow label="Block" value={profileData.block} />
                <InfoRow label="Ward" value={profileData.ward} />
                <InfoRow label="Tehsil" value={profileData.tehsil} />
                <InfoRow label="District" value={profileData.District_Name} />
                <InfoRow label="State" value={profileData.state} />
                <InfoRow label="Country" value={profileData.country} />
                <InfoRow label="PIN Code" value={profileData.pinno} />
              </CRow>
                </div>

                <div className="bg-light border-start border-4 border-success p-3 mb-4">
                  <h6 className="fw-bold mb-3 text-success">Local Address</h6>
                  <CRow>
                <InfoRow label="Local Address Line 1" value={profileData.Localaddress} />
                <InfoRow label="Local Address Line 2" value={profileData.Localaddressline2} />
                <InfoRow label="Local PIN Code" value={profileData.Localpinno} />
                <InfoRow label="Address Type" value={profileData.addresstype} />
              </CRow>
                </div>

                <div className="bg-light border-start border-4 border-info p-3 mb-4">
                  <h6 className="fw-bold mb-3 text-info">Branch Contact Details</h6>
                  <CRow>
                <InfoRow label="Branch Name" value={profileData.Branchname} />
                <InfoRow label="Branch Address" value={profileData.Address1} />
                <InfoRow label="Branch Phone" value={profileData.phoneNo} />
                <InfoRow label="Branch Email" value={profileData.email1} />
                <InfoRow label="Branch ESI Number" value={profileData.BranchESINumber} />
              </CRow>
                </div>
              </div>
            </CCardBody>
          </CCard>
        </CTabPane>
      </CTabContent>
    </div>
  )
}

export default Profile
