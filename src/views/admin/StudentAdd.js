import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
  CSpinner,
  CAlert,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilArrowLeft, cilSave } from '@coreui/icons'
import { getCommonData, getSRN, insertStudentAdministration } from '../../api/api'

const StudentAdd = () => {
  const navigate = useNavigate()

  // Master data
  const [colleges, setColleges] = useState([])
  const [branches, setBranches] = useState([])
  const [courseTypes, setCourseTypes] = useState([])
  const [universities, setUniversities] = useState([])
  const [courses, setCourses] = useState([])
  const [batches, setBatches] = useState([])
  const [feeCategories, setFeeCategories] = useState([])
  const [financialYears, setFinancialYears] = useState([])
  const [sections, setSections] = useState([])

  // Form state
  const [form, setForm] = useState({
    DateOfAdmission: new Date().toISOString().split('T')[0],
    FeeCategoryId: '',
    OrganizationId: '',
    CollegeId: '',
    BranchId: '',
    CourseTypeId: '',
    UniversityId: '',
    FinancialYearId: '',
    CourseId: '',
    BatchId: '',
    SectionId: '',
    FirstName: '',
    MiddleName: '',
    LastName: '',
    MobileNo1: '',
    MobileNo2: '',
    MobileNo3: '',
    AdmissionNo: '',
    StudentId: '', // This will be auto-generated SRN
    CollegeEmail: '', // Auto-generated: firstname.srn@atm.edu.in
    Password: '', // Auto-generated: SRN number
  })

  // UI state
  const [isLoadingSRN, setIsLoadingSRN] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Load master data on mount
  useEffect(() => {
    (async () => {
      try {
        setColleges(await getCommonData({ type: 10 })) // Colleges
        setCourseTypes(await getCommonData({ type: 9 })) // Course Types
        setUniversities(await getCommonData({ type: 11 })) // Universities
        setCourses(await getCommonData({ type: 8 })) // Courses
        setBranches(await getCommonData({ type: 6 })) // Branches (all)
        setBatches(await getCommonData({ type: 12 })) // Batches
      } catch (e) {
        console.error('Failed to load master data', e)
        setError('Failed to load master data')
      }
    })()
  }, [])

  // Load branches when college changes
  useEffect(() => {
    if (form.CollegeId) {
      (async () => {
        const list = await getCommonData({ type: 6, parentid: parseInt(form.CollegeId) })
        setBranches(list || [])
        setForm((f) => ({ ...f, BranchId: '' }))
      })()
    }
  }, [form.CollegeId])

  // Auto-generate SRN when required fields are filled
  useEffect(() => {
    const { CollegeId, CourseTypeId, UniversityId, BatchId } = form
    
    if (CollegeId && CourseTypeId && UniversityId && BatchId) {
      (async () => {
        setIsLoadingSRN(true)
        setError('')
        try {
          const result = await getSRN({
            collegeId: parseInt(CollegeId),
            courseTypeId: parseInt(CourseTypeId),
            universityId: parseInt(UniversityId),
            batchId: parseInt(BatchId),
          })
          if (result?.srn) {
            setForm((f) => ({ ...f, StudentId: result.srn, Password: result.srn }))
          }
        } catch (e) {
          console.error('Failed to get SRN', e)
          setError('Failed to generate Student ID (SRN)')
        } finally {
          setIsLoadingSRN(false)
        }
      })()
    } else {
      // Clear SRN if required fields are not filled
      setForm((f) => ({ ...f, StudentId: '', Password: '' }))
    }
  }, [form.CollegeId, form.CourseTypeId, form.UniversityId, form.BatchId])

  // Auto-generate College Email when FirstName and StudentId are available
  useEffect(() => {
    if (form.FirstName && form.StudentId) {
      const firstName = form.FirstName.toLowerCase().replace(/\s+/g, '')
      const collegeEmail = `${firstName}.${form.StudentId}@atm.edu.in`
      setForm((f) => ({ ...f, CollegeEmail: collegeEmail }))
    } else {
      setForm((f) => ({ ...f, CollegeEmail: '' }))
    }
  }, [form.FirstName, form.StudentId])

  const onChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // Validation
    if (!form.CollegeId || !form.CourseTypeId || !form.UniversityId || !form.BatchId) {
      setError('Please fill all required fields (College, Course Type, University, Batch)')
      return
    }

    if (!form.FirstName || !form.LastName) {
      setError('Please enter student first name and last name')
      return
    }

    if (!form.StudentId) {
      setError('Student ID (SRN) is required. Please ensure all required fields are filled.')
      return
    }

    setIsSaving(true)
    try {
      const payload = {
        DateOfAdmission: form.DateOfAdmission ? new Date(form.DateOfAdmission).toISOString() : new Date().toISOString(),
        FeeCategoryId: form.FeeCategoryId ? parseInt(form.FeeCategoryId) : 0,
        OrganizationId: form.OrganizationId ? parseInt(form.OrganizationId) : 0,
        CollegeId: parseInt(form.CollegeId),
        BranchId: form.BranchId ? parseInt(form.BranchId) : 0,
        CourseTypeId: parseInt(form.CourseTypeId),
        UniversityId: parseInt(form.UniversityId),
        FinancialYearId: form.FinancialYearId ? parseInt(form.FinancialYearId) : 0,
        CourseId: form.CourseId ? parseInt(form.CourseId) : 0,
        BatchId: parseInt(form.BatchId),
        SectionId: form.SectionId ? parseInt(form.SectionId) : 0,
        FirstName: form.FirstName,
        MiddleName: form.MiddleName || '',
        LastName: form.LastName,
        MobileNo1: form.MobileNo1 || '',
        MobileNo2: form.MobileNo2 || '',
        MobileNo3: form.MobileNo3 || '',
        AdmissionNo: form.StudentId || '',
        StudentId: form.StudentId,
      }

      const result = await insertStudentAdministration(payload)
      
      if (result?.isSuccess || result?.success) {
        setSuccess('Student added successfully!')
        setTimeout(() => {
          // Navigate with state to force refresh
          navigate('/admin/students', { state: { refresh: true, timestamp: Date.now() } })
        }, 1500)
      } else {
        setError(result?.message || 'Failed to add student')
      }
    } catch (e) {
      console.error('Failed to save student', e)
      setError(e.response?.data?.Message || e.response?.data?.ExceptionMessage || 'Failed to save student. Please check all fields.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Admin</strong> <small>Add New Student</small>
          </CCardHeader>
          <CCardBody>
            {error && <CAlert color="danger" dismissible onClose={() => setError('')}>{error}</CAlert>}
            {success && <CAlert color="success" dismissible onClose={() => setSuccess('')}>{success}</CAlert>}

            <CForm className="row g-3" onSubmit={handleSubmit}>
              {/* Program Details */}
              <CCol xs={12}>
                <CFormLabel className="fw-bold">Program Details *</CFormLabel>
              </CCol>

              <CCol md={3}>
                <CFormSelect
                  label="College *"
                  name="CollegeId"
                  value={form.CollegeId}
                  onChange={onChange}
                  required
                >
                  <option value="">Select College</option>
                  {colleges.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </CFormSelect>
              </CCol>

              <CCol md={3}>
                <CFormSelect
                  label="Branch"
                  name="BranchId"
                  value={form.BranchId}
                  onChange={onChange}
                >
                  <option value="">Select Branch</option>
                  {branches.map((b) => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </CFormSelect>
              </CCol>

              <CCol md={3}>
                <CFormSelect
                  label="Course Type *"
                  name="CourseTypeId"
                  value={form.CourseTypeId}
                  onChange={onChange}
                  required
                >
                  <option value="">Select Course Type</option>
                  {courseTypes.map((ct) => (
                    <option key={ct.id} value={ct.id}>{ct.name}</option>
                  ))}
                </CFormSelect>
              </CCol>

              <CCol md={3}>
                <CFormSelect
                  label="University *"
                  name="UniversityId"
                  value={form.UniversityId}
                  onChange={onChange}
                  required
                >
                  <option value="">Select University</option>
                  {universities.map((u) => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </CFormSelect>
              </CCol>

              <CCol md={3}>
                <CFormSelect
                  label="Course"
                  name="CourseId"
                  value={form.CourseId}
                  onChange={onChange}
                >
                  <option value="">Select Course</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </CFormSelect>
              </CCol>

              <CCol md={3}>
                <CFormSelect
                  label="Batch *"
                  name="BatchId"
                  value={form.BatchId}
                  onChange={onChange}
                  required
                >
                  <option value="">Select Batch</option>
                  {batches.map((b) => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </CFormSelect>
              </CCol>

              <CCol md={3}>
                <CFormInput
                  label="Date of Admission"
                  name="DateOfAdmission"
                  type="date"
                  value={form.DateOfAdmission}
                  onChange={onChange}
                />
              </CCol>

              {/* Student ID (Auto-generated SRN) */}
              <CCol md={3}>
                <CFormLabel>Admission No. (SRN) *</CFormLabel>
                <div className="input-group">
                  <CFormInput
                    name="StudentId"
                    value={form.StudentId}
                    readOnly
                    placeholder="Auto-generated"
                    className="bg-light"
                  />
                  {isLoadingSRN && (
                    <span className="input-group-text">
                      <CSpinner size="sm" />
                    </span>
                  )}
                </div>
                <small className="text-muted">
                  Auto-generated based on College, Course Type, University & Batch
                </small>
              </CCol>

              {/* Student Personal Details */}
              <CCol xs={12} className="mt-3">
                <CFormLabel className="fw-bold">Student Details *</CFormLabel>
              </CCol>

              <CCol md={4}>
                <CFormInput
                  label="First Name *"
                  name="FirstName"
                  value={form.FirstName}
                  onChange={onChange}
                  required
                />
              </CCol>

              <CCol md={4}>
                <CFormInput
                  label="Middle Name"
                  name="MiddleName"
                  value={form.MiddleName}
                  onChange={onChange}
                />
              </CCol>

              <CCol md={4}>
                <CFormInput
                  label="Last Name *"
                  name="LastName"
                  value={form.LastName}
                  onChange={onChange}
                  required
                />
              </CCol>

              <CCol md={4}>
                <CFormInput
                  label="Mobile No 1"
                  name="MobileNo1"
                  value={form.MobileNo1}
                  onChange={onChange}
                  placeholder="Primary mobile"
                />
              </CCol>

              <CCol md={4}>
                <CFormInput
                  label="Mobile No 2"
                  name="MobileNo2"
                  value={form.MobileNo2}
                  onChange={onChange}
                  placeholder="Secondary mobile"
                />
              </CCol>

              <CCol md={4}>
                <CFormInput
                  label="Mobile No 3"
                  name="MobileNo3"
                  value={form.MobileNo3}
                  onChange={onChange}
                  placeholder="Alternate mobile"
                />
              </CCol>

              {/* Auto-generated College Email */}
              <CCol md={6}>
                <CFormLabel>College Email *</CFormLabel>
                <CFormInput
                  name="CollegeEmail"
                  value={form.CollegeEmail}
                  readOnly
                  placeholder="Auto-generated"
                  className="bg-light"
                />
                <small className="text-muted">
                  Auto-generated: firstname.srn@atm.edu.in
                </small>
              </CCol>

              {/* Auto-generated Password */}
              <CCol md={6}>
                <CFormLabel>Password (Default) *</CFormLabel>
                <CFormInput
                  name="Password"
                  type="text"
                  value={form.Password}
                  readOnly
                  placeholder="Auto-generated"
                  className="bg-light"
                />
                <small className="text-muted">
                  Default password is the SRN number
                </small>
              </CCol>

              {/* <CCol md={4}>
                <CFormInput
                  label="Admission No"
                  name="AdmissionNo"
                  value={form.AdmissionNo}
                  onChange={onChange}
                  placeholder="Optional"
                />
              </CCol> */}

              {/* Action Buttons */}
              <CCol xs={12} className="mt-4">
                <div className="d-flex gap-2">
                  <CButton
                    color="secondary"
                    variant="outline"
                    onClick={() => navigate('/admin/students')}
                  >
                    <CIcon icon={cilArrowLeft} className="me-2" />
                    Cancel
                  </CButton>
                  <CButton
                    color="primary"
                    type="submit"
                    disabled={isSaving || isLoadingSRN || !form.StudentId}
                  >
                    {isSaving ? (
                      <>
                        <CSpinner size="sm" className="me-2" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <CIcon icon={cilSave} className="me-2" />
                        Save Student
                      </>
                    )}
                  </CButton>
                </div>
              </CCol>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default StudentAdd
