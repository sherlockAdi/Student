import React, { useState } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CRow,
  CCol,
  CFormInput,
  CButton,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
} from "@coreui/react";
import { uid } from "chart.js/helpers";
import {
  searchStudentBySRN,
  getFeeSelectStudent,
  getFeeInstallmentDetails,
  getFeeBookNoReceiptNo,
} from "../../api/api";


const SRNSearch = () => {
  const [srnInput, setSrnInput] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [studentDetails, setStudentDetails] = useState(null); 
  const [installmentDetails, setInstallmentDetails] = useState(null);
  const [receiptDate, setReceiptDate] = useState(new Date().toISOString().split("T")[0]);
  const [BookNoReceiptNoDetails,setBookNoReceiptNoDetails]=useState(null);
  
  const [clearingDate, setClearingDate] = useState("");
const [feeDeposited, setFeeDeposited] = useState(null);

  const handleSearch = async () => {
    if (!srnInput.trim()) {
      alert("Please enter an SRN number.");
      return;
    }

    try {
      const data = await searchStudentBySRN(srnInput);
      console.log(data , data[0])

      if ( data?.length > 0) {
        setSearchResult(data[0]); // Adjust if multiple results
        //const studentId = student.id;         // ✅ Correct ID
      const collegeId = 1;  // ✅ Use this dynamically
      //const admissionNo = student.admissionno;
        const id = data[0].id
        console.log(data[0])
      const data2 = await getFeeSelectStudent(id);
       setStudentDetails(data2[0])
      const data3 = await getFeeInstallmentDetails({ collegeid: collegeId, SrnNo: srnInput });
      setInstallmentDetails(data3[0])
      const data4 = await getFeeBookNoReceiptNo({ collegeid: collegeId, uid: 1, utype: 1, message: 'hh' });
      if (data4 ) {
        //console.log(data3.data[0])
        console.log(data4)
          setBookNoReceiptNoDetails(data4[0]);
        } else {
          setBookNoReceiptNoDetails(null);
        }
      } else {
        alert("No student found.");
        setSearchResult(null);
        setStudentDetails(null);
        setInstallmentDetails(null);
        setBookNoReceiptNoDetails(null);
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Something went wrong.");
    }
  };

  return (
    <CCard className="mb-4">
      <CCardHeader>Search Student by SRN</CCardHeader>
      <CCardBody>
        <CRow className="align-items-end g-3">
          <CCol md={6}>
            <CFormInput
              label="Enter SRN Number"
              value={srnInput}
              onChange={(e) => setSrnInput(e.target.value)}
              placeholder="e.g. SRN123456"
            />
          </CCol>
          {/* ✅ Receipt Date Picker */}
          <CCol md={3}>
            <CFormInput
              type="date"
              label="Receipt Date"
              value={receiptDate}
              onChange={(e) => setReceiptDate(e.target.value)}
            />
          </CCol>
          <CCol md={2}>
            <CButton color="primary" onClick={handleSearch}>
              Search
            </CButton>
          </CCol>
        </CRow>

        {searchResult && (
          <CTable striped hover responsive className="mt-4">
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Admission No</CTableHeaderCell>
                <CTableHeaderCell>Full Name</CTableHeaderCell>
                <CTableHeaderCell>Email</CTableHeaderCell>
                <CTableHeaderCell>Mobile</CTableHeaderCell>
                <CTableHeaderCell>College</CTableHeaderCell>
                <CTableHeaderCell>Branch</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              <CTableRow>
                <CTableDataCell>{searchResult.admissionno}</CTableDataCell>
                <CTableDataCell>
                  {searchResult.firstname} {searchResult.lastname}
                </CTableDataCell>
                <CTableDataCell>{searchResult.personalemail}</CTableDataCell>
                <CTableDataCell>{searchResult.mobileno1}</CTableDataCell>
                <CTableDataCell>{searchResult.collegename}</CTableDataCell>
                <CTableDataCell>{searchResult.Branchname}</CTableDataCell>
              </CTableRow>
            </CTableBody>
          </CTable>
        )}
      
 {studentDetails && (
          <>
            <h5 className="mt-4">Student Fee Submit Details</h5>
            <CTable striped hover responsive>
              <CTableHead>
                <CTableRow>
                    <CTableHeaderCell>College</CTableHeaderCell>
                    <CTableHeaderCell>Branch</CTableHeaderCell>
                    <CTableHeaderCell>Course Type</CTableHeaderCell>
                    <CTableHeaderCell>University</CTableHeaderCell>
                    <CTableHeaderCell>Batch</CTableHeaderCell>
                    <CTableHeaderCell>Course</CTableHeaderCell>
                  <CTableHeaderCell>Semseter</CTableHeaderCell>
                  <CTableHeaderCell>Fee category</CTableHeaderCell>
                  <CTableHeaderCell>Student Name</CTableHeaderCell>
                  <CTableHeaderCell>SRN No.</CTableHeaderCell>                                    
                </CTableRow>
              </CTableHead>
              <CTableBody>
                <CTableRow>
                  <CTableDataCell>{studentDetails.collegename}</CTableDataCell>
                  <CTableDataCell>{studentDetails.Branchname}</CTableDataCell>
                  <CTableDataCell>{studentDetails.coursename}</CTableDataCell>
                  <CTableDataCell>{studentDetails.name}</CTableDataCell>
                  <CTableDataCell>{studentDetails.Batchno}</CTableDataCell>
                  <CTableDataCell>{studentDetails.corsename}</CTableDataCell>
                  <CTableDataCell>{studentDetails.semesterno}</CTableDataCell>
                  <CTableDataCell>{studentDetails.feecategoryname}</CTableDataCell>
                  <CTableDataCell>{studentDetails.studentname}</CTableDataCell>
                  <CTableDataCell>{studentDetails.admissionno}</CTableDataCell>
                </CTableRow>
              </CTableBody>
            </CTable>
          </>
        )}
        {/* 🔸 3rd Table - Installment Details */}
        {installmentDetails && BookNoReceiptNoDetails && (
          <>
            <h5 className="mt-4">Installment Details</h5>
            <CTable striped hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>Financial Year</CTableHeaderCell>
                  <CTableHeaderCell>M Receipt No.</CTableHeaderCell>
                  <CTableHeaderCell>E Receipt No.</CTableHeaderCell>
                  <CTableHeaderCell>Receipt Date</CTableHeaderCell>
                  <CTableHeaderCell>Fee Deposited</CTableHeaderCell>
                       <CTableHeaderCell>Deposit Date</CTableHeaderCell>
                  <CTableHeaderCell>Clearing Date</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                <CTableRow>
                  <CTableDataCell>{BookNoReceiptNoDetails.financialyear}</CTableDataCell>
                  <CTableDataCell>{BookNoReceiptNoDetails.receiptno}/{BookNoReceiptNoDetails.bookno}</CTableDataCell>
                  <CTableDataCell>{installmentDetails.ereceiptno}</CTableDataCell>
                  {/* <CTableDataCell>{receiptDate || "-"}</CTableDataCell> */}
            <CTableDataCell>
              <input
                type="date"
                value={receiptDate}
                onChange={(e) => setReceiptDate(e.target.value)}
              />
            </CTableDataCell>
            
                </CTableRow>
              </CTableBody>
            </CTable>
          </>
        )}
      </CCardBody>
    </CCard>
  );
};

export default SRNSearch;