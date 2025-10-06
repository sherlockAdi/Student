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
import { getStudentProfile } from '../../api/api'

const Profile = () => {
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
      <div className="d-flex flex-column">
        <small className="text-muted fw-semibold">{label}</small>
        <div className="fw-normal">{value || 'N/A'}</div>
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

  if (!profileData) {
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
      {/* Header Card with Photo */}
      <CCard className="border-0 shadow-lg mb-4">
        <CCardBody className="p-4"
          style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
        >
          <CRow className="align-items-center">
            <CCol xs={12} md={3} className="text-center mb-3 mb-md-0">
              <div 
                className="rounded-circle mx-auto d-flex align-items-center justify-content-center text-white fw-bold shadow-lg"
                style={{ 
                  width: '120px', 
                  height: '120px', 
                  background: 'rgba(255, 255, 255, 0.2)',
                  fontSize: '3rem',
                  border: '4px solid white'
                }}
              >
                {profileData.firstname?.charAt(0)}{profileData.lastname?.charAt(0)}
              </div>
            </CCol>
            <CCol xs={12} md={9}>
              <h2 className="text-white mb-2 fw-bold">
                {profileData.firstname} {profileData.middlename} {profileData.lastname}
              </h2>
              <div className="d-flex flex-wrap gap-3 mb-3">
                <CBadge color="light" className="px-3 py-2 fs-6">
                  🆔 {profileData.admissionno}
                </CBadge>
                <CBadge color="light" className="px-3 py-2 fs-6">
                  📧 {profileData.collegeemail}
                </CBadge>
                <CBadge color="light" className="px-3 py-2 fs-6">
                  📞 {profileData.mobileno1}
                </CBadge>
              </div>
              <p className="text-white mb-0 opacity-75">
                <strong>Branch:</strong> {profileData.Branchname} | <strong>Section:</strong> {profileData.section}
              </p>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>

      {/* Tabs Navigation */}
      <CCard className="border-0 shadow-sm mb-4">
        <CCardBody className="p-0">
          <CNav variant="tabs" role="tablist">
            <CNavItem>
              <CNavLink
                active={activeTab === 'personal'}
                onClick={() => setActiveTab('personal')}
                style={{ cursor: 'pointer' }}
              >
                👤 Personal Info
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink
                active={activeTab === 'academic'}
                onClick={() => setActiveTab('academic')}
                style={{ cursor: 'pointer' }}
              >
                🎓 Academic Details
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink
                active={activeTab === 'family'}
                onClick={() => setActiveTab('family')}
                style={{ cursor: 'pointer' }}
              >
                👨‍👩‍👧‍👦 Family Details
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink
                active={activeTab === 'contact'}
                onClick={() => setActiveTab('contact')}
                style={{ cursor: 'pointer' }}
              >
                📍 Contact & Address
              </CNavLink>
            </CNavItem>
          </CNav>
        </CCardBody>
      </CCard>

      {/* Tab Content */}
      <CTabContent>
        {/* Personal Info Tab */}
        <CTabPane visible={activeTab === 'personal'}>
          <CCard className="border-0 shadow-sm">
            <CCardHeader className="bg-light fw-semibold">
              👤 Personal Information
            </CCardHeader>
            <CCardBody className="p-4">
              <CRow>
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
          <CCard className="border-0 shadow-sm">
            <CCardHeader className="bg-light fw-semibold">
              🎓 Academic Details
            </CCardHeader>
            <CCardBody className="p-4">
              <CRow>
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
          <CCard className="border-0 shadow-sm mb-3">
            <CCardHeader className="bg-light fw-semibold">
              👨‍👩‍👧‍👦 Family & Guardian Information
            </CCardHeader>
            <CCardBody className="p-4">
              <h6 className="fw-bold mb-3">Father's Details</h6>
              <CRow>
                <InfoRow label="Father's Name" value={profileData.fathername} />
                <InfoRow label="Father's Occupation" value={profileData.fatheroccupation} />
                <InfoRow label="Father's Industry" value={profileData.f_industry} />
                <InfoRow label="Father's Functional Area" value={profileData.f_functionalarea} />
                <InfoRow label="Father's Role" value={profileData.f_role} />
                <InfoRow label="Father's Company" value={profileData.f_companyname} />
                <InfoRow label="Father's Annual Income" value={profileData.f_annualincome} />
              </CRow>

              <hr className="my-4" />
              <h6 className="fw-bold mb-3">Mother's Details</h6>
              <CRow>
                <InfoRow label="Mother's Name" value={profileData.mothername} />
                <InfoRow label="Mother's Industry" value={profileData.m_industry} />
                <InfoRow label="Mother's Functional Area" value={profileData.m_functionalarea} />
                <InfoRow label="Mother's Role" value={profileData.m_role} />
                <InfoRow label="Mother's Company" value={profileData.m_companyname} />
                <InfoRow label="Mother's Annual Income" value={profileData.m_annualincome} />
              </CRow>

              <hr className="my-4" />
              <h6 className="fw-bold mb-3">Guardian's Details</h6>
              <CRow>
                <InfoRow label="Guardian's Name" value={profileData.g_name} />
                <InfoRow label="Guardian's Industry" value={profileData.g_industry} />
                <InfoRow label="Guardian's Functional Area" value={profileData.g_functionalarea} />
                <InfoRow label="Guardian's Role" value={profileData.g_role} />
                <InfoRow label="Guardian's Company" value={profileData.g_companyname} />
                <InfoRow label="Guardian's Annual Income" value={profileData.g_annualincome} />
              </CRow>

              <hr className="my-4" />
              <h6 className="fw-bold mb-3">Local Guardian Details</h6>
              <CRow>
                <InfoRow label="Local Guardian Name" value={profileData.localgurdianname} />
                <InfoRow label="Relation" value={profileData.relation} />
                <InfoRow label="Mobile" value={profileData.localmobile1} />
                <InfoRow label="Landline" value={profileData.locallandlineno} />
                <InfoRow label="Email" value={profileData.guardianemail} />
              </CRow>

              <hr className="my-4" />
              <h6 className="fw-bold mb-3">Family Information</h6>
              <CRow>
                <InfoRow label="Number of Members" value={profileData.no_of_members} />
                <InfoRow label="Household Income" value={profileData.HouseHoldIncome} />
                <InfoRow label="Family Occupation" value={profileData.Family_Occupation} />
                <InfoRow label="Parent Email" value={profileData.parentemail} />
                <InfoRow label="Parent Mobile 1" value={profileData.mobile1} />
                <InfoRow label="Parent Mobile 2" value={profileData.mobile2} />
              </CRow>
            </CCardBody>
          </CCard>
        </CTabPane>

        {/* Contact & Address Tab */}
        <CTabPane visible={activeTab === 'contact'}>
          <CCard className="border-0 shadow-sm">
            <CCardHeader className="bg-light fw-semibold">
              📍 Contact & Address Information
            </CCardHeader>
            <CCardBody className="p-4">
              <h6 className="fw-bold mb-3">Primary Address</h6>
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

              <hr className="my-4" />
              <h6 className="fw-bold mb-3">Local Address</h6>
              <CRow>
                <InfoRow label="Local Address Line 1" value={profileData.Localaddress} />
                <InfoRow label="Local Address Line 2" value={profileData.Localaddressline2} />
                <InfoRow label="Local PIN Code" value={profileData.Localpinno} />
                <InfoRow label="Address Type" value={profileData.addresstype} />
              </CRow>

              <hr className="my-4" />
              <h6 className="fw-bold mb-3">Branch Contact Details</h6>
              <CRow>
                <InfoRow label="Branch Name" value={profileData.Branchname} />
                <InfoRow label="Branch Address" value={profileData.Address1} />
                <InfoRow label="Branch Phone" value={profileData.phoneNo} />
                <InfoRow label="Branch Email" value={profileData.email1} />
                <InfoRow label="Branch ESI Number" value={profileData.BranchESINumber} />
              </CRow>
            </CCardBody>
          </CCard>
        </CTabPane>
      </CTabContent>
    </div>
  )
}

export default Profile
