import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CCard, CCardBody, CCardHeader, CCol, CRow, CNav, CNavItem, CNavLink,
  CTabContent, CTabPane, CButton, CForm, CFormInput, CFormSelect,
  CFormLabel, CFormTextarea, CAlert, CSpinner, CFormCheck,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilSave, cilArrowLeft, cilX } from '@coreui/icons'
import {
  getOrganizations,getFinancialYear,getCourseList,getSections ,getFeeHeads,getStudentFeeSummary,
  getCoursesByBatch,getBatchesByUniversity2
} from '../../api/api'

const ReportForm = () => {
 const [financialYears, setFinancialYears] = useState([])
  const [selectedYear, setSelectedYear] = useState('')

    const [courses, setCourses] = useState([])
  const [selectedCourse, setSelectedCourse] = useState('')

   const [sections, setSections] = useState([])
  const [selectedSection, setSelectedSection] = useState('')

  const [feeHeads, setFeeHeads] = useState([]);
  const [selectedFeeHead , setselectedFeeHead ] = useState('')

  const [batchList, setBatchList] = useState([])       
const [selectedBatch, setSelectedBatch] = useState('') 

  

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

    const [feeSummary, setFeeSummary] = useState(null)
  const [loadingSummary, setLoadingSummary] = useState(false)
  const [summaryError, setSummaryError] = useState(null)

  const navigate = useNavigate()
  useEffect(() => {
    
    const fetchdata = async () => {
      setLoading(true)
      setError(null)
      try {
        
        //const result = await getFinancialYear()
        const result=await getBatchesByUniversity2()
        setFinancialYears(result)
        

        const courseResult = await getCourseList()
        setCourses(courseResult?.Courses)

        const feehead = await getFeeHeads();
        setFeeHeads(feehead);

        //  const sectionData = await getSections()
        // setSections(sectionData)
console.log('API Response:', courseResult) 
      } catch (err) {
        console.error('Error fetching financial years:', err)
        setError('Financial years!')
      } finally {
        setLoading(false)
      }
    }

    fetchdata()
  }, [])
 
  const handleYearChange = (e) => {
    setSelectedYear(e.target.value)
    console.log('Selected Financial Year:', e.target.value)
  }
  const handleCourseChange = async (e) => {
  const value = e.target.value;

//   const SelectedData   = courses.filter(course => course.CourseName === e.target.value )

  setSelectedCourse(value);
// const corId = SelectedData[0].Id;
// console.log('Selected Course ID:', corId);
 const sectionData = await getSections(value);
  setSections(sectionData.Sections);
};


    const handleSectionChange = (e) => {
    setSelectedSection(e.target.value)
  }

 const  handleFeeHeadChange = (e) =>{
   setselectedFeeHead(e.target.value)
 }

//   const handleSubmit = (e) => {
//     e.preventDefault()
//     console.log('Final Values:', {
//       year: selectedYear,
//       course: selectedCourse,
//       section: selectedSection
//     })
//}
 // Fetch fee summary on button click
  const fetchFeeSummary = async () => {
    setLoadingSummary(true)
    setSummaryError(null)
    setFeeSummary(null)

    try {
      // You need a studentId to fetch the summary, assuming you get from selected course/section or user input
      // For example, let's assume studentId is fixed or you can add input field
      const studentId = 1 // TODO: Replace this with real student ID from your form or context
// financialYear = '', courseId = null, section = null, FeeHeadId = null
      const formatedyear = selectedYear.slice(0,4)
      const summary = await getStudentFeeSummary(formatedyear ,selectedCourse,selectedSection ,selectedFeeHead)
      setFeeSummary(summary)
    } catch (err) {
      console.error('Error fetching fee summary:', err)
      setSummaryError('Failed to fetch fee summary')
    } finally {
      setLoadingSummary(false)
    }
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard>
          <CCardHeader>
            <strong>📅 Financial Year Report</strong>
          </CCardHeader>
          <CCardBody>
            {loading && <CSpinner color="primary" />}
            {error && <CAlert color="danger">{error}</CAlert>}

            <CForm>
              <CFormLabel htmlFor="financialYear">Select Financial Year</CFormLabel>
              <CFormSelect
                id="financialYear"
                value={selectedYear}
                onChange={handleYearChange}
                disabled={loading}
              >
                <option value="">-- Select Year --</option>
                {financialYears.map((year) => (
                  <option key={year.Id} value={year.Id
}>
                    {year.BatchName
}
                  </option>
                ))}
              </CFormSelect>
               <br />

              {/* 🎓 Course Name Dropdown */}
              <CFormLabel htmlFor="course">Select Course</CFormLabel>
              <CFormSelect
                id="course"
                value={selectedCourse}
                onChange={handleCourseChange}
                disabled={loading}
              >
                <option value="">-- Select Course --</option>
                {courses.map((course) => (
                  <option key={course.Id} value={course.Id}>
                    {course.CourseName}
                  </option>
                ))}
              </CFormSelect>
              <br/>
               <CFormLabel htmlFor="section">Select Section</CFormLabel>
              <CFormSelect
                id="section"
                value={selectedSection}
                onChange={handleSectionChange}
                disabled={loading}
              >
                <option value="">-- Select Section --</option>
                {sections.map((section) => (
                  <option key={section.Id} value={section.Id}>
                    {section.Name}
                  </option>
                ))}
              </CFormSelect>

            
            <br/>
            <CFormLabel htmlFor="feehead">Select Fee Head</CFormLabel>
              <CFormSelect
                id="feehead"
                value={selectedFeeHead}
                onChange={handleFeeHeadChange}
                disabled={loading}
              >
                <option value="">-- Select Fee Head --</option>
                {feeHeads.map((head) => (
                  <option key={head.FeeHeadId} value={head.FeeHeadId}>
                    {head.FeeHeadName}
                  </option>
                ))}
              </CFormSelect>
              <br />
              <CButton
                color="primary"
                onClick={fetchFeeSummary}
                disabled={loading || loadingSummary}
              >
                {loadingSummary ? 'Loading...' : 'Get Fee Summary'}
              </CButton>
              </CForm>
              {summaryError && <CAlert color="danger" className="mt-3">{summaryError}</CAlert>}

{feeSummary && (
  <div className="mt-3">
    <h5>Fee Summary:</h5>
    <table className="table table-bordered table-striped">
      <thead>
        <tr>
          <th>Student ID</th>
          <th>Student Name</th>
          <th>Amount Paid</th>
          <th>Balance Amount</th>
          <th>Next Due Date</th>
          <th>Next Amount</th>
          <th>Past Dues</th>
          <th>Total Fee</th>
        </tr>
      </thead>
      <tbody>
        {Array.isArray(feeSummary) ? (
          feeSummary.map((item, index) => (
            <tr key={index}>
              <td>{item.StudentId}</td>
              <td>{item.StudentName}</td>
              <td>{item.AmountPaid}</td>
              <td>{item.BalanceAmount}</td>
              <td>{item.NextDueDate ? new Date(item.NextDueDate).toLocaleDateString() : ''}</td>
              <td>{item.NextAmount}</td>
              <td>{item.PastDues}</td>
              <td>{item.TotalFee}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td>{feeSummary.StudentId}</td>
            <td>{feeSummary.StudentName}</td>
            <td>{feeSummary.AmountPaid}</td>
            <td>{feeSummary.BalanceAmount}</td>
            <td>{feeSummary.NextDueDate ? new Date(feeSummary.NextDueDate).toLocaleDateString() : ''}</td>
            <td>{feeSummary.NextAmount}</td>
            <td>{feeSummary.PastDues}</td>
            <td>{feeSummary.TotalFee}</td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
)}

     
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default ReportForm;
