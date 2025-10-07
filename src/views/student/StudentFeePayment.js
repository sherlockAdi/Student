import React, { useState, useEffect } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CRow,
  CCol,
  CFormCheck,
  CButton,
  CAlert,
} from "@coreui/react";

import {
  searchStudentBySRN,
  getFeeSelectStudent,
  getFeeInstallmentDetails,
  getFeeBookNoReceiptNo,
  getAmiFeeDetails,
  submitOfflinePayment,
} from "../../api/api";
import PaymentSummaryCard from "../../components/payments/PaymentSummaryCard";
import {
  initializeRazorpayCheckout,
} from "../../utils/razorpay";
import { RAZORPAY_KEY_ID } from "../../config/razorpayConfig";

const StudentFeePayment = () => {
  const [searchResult, setSearchResult] = useState(null);
  const [studentDetails, setStudentDetails] = useState(null);
  const [installmentDetails, setInstallmentDetails] = useState(null);
  const today = new Date().toISOString().split("T")[0];
  const [BookNoReceiptNoDetails, setBookNoReceiptNoDetails] = useState(null);

  const [feeRows, setFeeRows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaying, setIsPaying] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [error, setError] = useState(null);

  // Select All state for fee rows
  const [selectAll, setSelectAll] = useState(false);

  // Transform AMI API data into feeRows with detailed fields
  const transformAmiToFeeRows = (amiData) => {
    return amiData.map((item, index) => {
      const feeAmount = Number(item.FeeAmount) || 0;
      const concession = 0;
      const dueAmount = feeAmount - concession;
      const feesSubmitted = Number(item.DepositeFee) || 0;
      const waivedAmount = Number(item.WaivedAmount) || 0;
      const waiveAmount = 0;
      const fineAmount = 0;
      const currentFees = feeAmount - feesSubmitted - waivedAmount - concession;
      const amountRemaining = dueAmount - feesSubmitted - waivedAmount;

      return {
        slNo: index + 1,
        selectAll: false,
        feeInstallment: item.intalmentname || "N/A",
        feeHead: item.feeheadname || "N/A",
        dueDate: today,
        feeAmount,
        concession,
        dueAmount,
        feesSubmitted,
        waivedAmount,
        currentFees: currentFees > 0 ? currentFees : 0,
        fineAmount,
        waiveAmount,
        amountRemaining: amountRemaining > 0 ? amountRemaining : 0,
      };
    });
  };

  // Auto-load student data on component mount
  useEffect(() => {
    const loadStudentFeeData = async () => {
      try {
        // Get student data from localStorage
        const studentDataStr = localStorage.getItem('studentData');
        if (!studentDataStr) {
          setError('Student data not found. Please login again.');
          setIsLoading(false);
          return;
        }

        const studentData = JSON.parse(studentDataStr);
        const admissionNo = studentData.admissionno;

        if (!admissionNo) {
          setError('Admission number not found. Please login again.');
          setIsLoading(false);
          return;
        }

        // Search student by admission number
        const data = await searchStudentBySRN(admissionNo);
        
        if (data?.length > 0) {
          setSearchResult(data[0]);
          const collegeId = 1;
          const id = data[0].id;

          const data2 = await getFeeSelectStudent(id);
          setStudentDetails(data2[0]);

          const data3 = await getFeeInstallmentDetails({
            collegeid: collegeId,
            SrnNo: admissionNo,
          });
          setInstallmentDetails(data3[0]);

          const data4 = await getFeeBookNoReceiptNo({
            collegeid: collegeId,
            uid: 1,
            utype: 1,
            message: "hh",
          });
          setBookNoReceiptNoDetails(data4?.[0] || null);

          if (data2[0] && data3[0]) {
            const ami = await getAmiFeeDetails({
              FeeCategoryId: 1,
              InstalmentId: 1,
              sid: id,
              installmenttype: 1,
            });

            const feeRowsFromAmi = transformAmiToFeeRows(ami || []);
            setFeeRows(feeRowsFromAmi);
            setSelectAll(false);
          } else {
            setFeeRows([]);
            setSelectAll(false);
          }
        } else {
          setError('No student record found.');
        }
      } catch (err) {
        console.error("Error:", err);
        setError('Failed to load fee details. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    loadStudentFeeData();
  }, []);

  // Handle individual row checkbox toggle
  const handleRowSelectToggle = (index) => {
    const newRows = [...feeRows];
    newRows[index].selectAll = !newRows[index].selectAll;
    setFeeRows(newRows);

    const allSelected = newRows.every((row) => row.selectAll === true);
    setSelectAll(allSelected);
  };

  // Handle select all toggle in table header
  const handleSelectAllToggle = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);

    const newRows = feeRows.map((row) => ({
      ...row,
      selectAll: newSelectAll,
    }));
    setFeeRows(newRows);
  };

  // Totals for footer
  const totals = feeRows.reduce(
    (acc, row) => {
      acc.feeAmount += row.feeAmount;
      acc.concession += row.concession;
      acc.dueAmount += row.dueAmount;
      acc.feesSubmitted += row.feesSubmitted;
      acc.waivedAmount += row.waivedAmount;
      acc.currentFees += row.currentFees;
      acc.fineAmount += row.fineAmount;
      acc.amountRemaining += row.amountRemaining;
      return acc;
    },
    {
      feeAmount: 0,
      concession: 0,
      dueAmount: 0,
      feesSubmitted: 0,
      waivedAmount: 0,
      currentFees: 0,
      fineAmount: 0,
      amountRemaining: 0,
    }
  );

  const selectedFeeRows = feeRows.filter((row) => row.selectAll);
  const totalCurrentFees = feeRows.reduce(
    (sum, row) => sum + (Number(row.currentFees) || 0),
    0
  );
  const selectedRowsAmount = selectedFeeRows.reduce(
    (sum, row) => sum + (Number(row.currentFees) || 0),
    0
  );
  const payableAmount = selectedFeeRows.length ? selectedRowsAmount : totalCurrentFees;

  const handlePayment = async () => {
    if (!payableAmount || payableAmount <= 0) {
      alert("Please select at least one fee row or ensure payable amount is valid.");
      return;
    }

    const selectedRows = feeRows.filter(row => row.selectAll);
    if (selectedRows.length === 0) {
      alert('⚠️ Please select at least one fee row to submit payment.');
      return;
    }

    setIsPaying(true);
    setPaymentStatus(null);

    try {
      const options = {
        key: RAZORPAY_KEY_ID,
        amount: Math.round(payableAmount * 100),
        currency: "INR",
        name: "ATM GLOBAL BUSINESS SCHOOL",
        description: "College Fee Payment",
        image: "https://razorpay.com/favicon.png",
        handler: async function (response) {
          console.log('Razorpay Payment Success:', response);
          
          // After successful Razorpay payment, submit each selected row to backend
          try {
            const successfulSubmissions = [];
            const failedSubmissions = [];
            
            for (let i = 0; i < selectedRows.length; i++) {
              const row = selectedRows[i];
              const currentEReceiptNo = (installmentDetails?.ereceiptno || 0) + 1 + i;
              
              try {
                const apiPayload = {
                  PaymentMode: 'Online',
                  BankName: 'Razorpay',
                  TransactionId: response.razorpay_payment_id || '',
                  TransactionAmount: row.currentFees.toString(),
                  StudentId: parseInt(searchResult?.id) || 0,
                  FeeCategoryId: parseInt(studentDetails?.feecategoryid) || 1,
                  InstalmentId: '1',
                  SubmitDate: today,
                  FineAmount: row.fineAmount?.toString() || '0',
                  OtherFineAmount: '0',
                  NetAmountSubmitted: row.currentFees.toString(),
                  Remarks: `Online Payment - ${row.feeHead} (${row.feeInstallment}) - Razorpay ID: ${response.razorpay_payment_id}`,
                  FeeSubmitLastDate: today,
                  FinancialYearId: (BookNoReceiptNoDetails?.financialyearid || 1).toString(),
                  BookNo: (BookNoReceiptNoDetails?.bookno || '').toString(),
                  ReceiptNo: (BookNoReceiptNoDetails?.receiptno || '').toString(),
                  InstallmentType: '1',
                  DepositDate: today,
                  PaymentClearDate: today,
                  EReceiptNo: currentEReceiptNo.toString(),
                  Uid: '1',
                  Utype: '1',
                  ChequeClearingDate: today,
                  TransactionReceipt: '',
                  CardNo: '',
                  CardAmount: '0',
                  FeeCollectionInFavourOf: '',
                  OtherCharges: '0',
                  OtherChargesRemarks: '',
                  ChequeDraftInFavourOf: '',
                  ChequeDdNo: '',
                  BankBranch: '',
                  ChequeDdDate: today,
                  FavorOfs: '',
                  PaymentModes: '',
                  BankNames: '',
                  BranchNames: '',
                  AccountNumbers: '',
                  InFavorOfs: '',
                  InFavOfId: '',
                  AuthorizedSignatory: '',
                  AccountNoId: '',
                  WaiverName: ''
                };
                
                const submitResponse = await submitOfflinePayment(apiPayload);
                console.log(`Payment submitted for row ${i + 1}:`, submitResponse);
                
                successfulSubmissions.push({
                  feeHead: row.feeHead,
                  installment: row.feeInstallment,
                  amount: row.currentFees,
                  receiptNo: currentEReceiptNo
                });
              } catch (rowError) {
                console.error(`Error submitting payment for row ${i + 1}:`, rowError);
                failedSubmissions.push({
                  feeHead: row.feeHead,
                  installment: row.feeInstallment,
                  amount: row.currentFees,
                  error: rowError.response?.data?.message || rowError.message
                });
              }
            }
            
            // Show summary
            let message = `🎉 Razorpay Payment ID: ${response.razorpay_payment_id}\n\n`;
            if (successfulSubmissions.length > 0) {
              message += `✅ Successfully recorded ${successfulSubmissions.length} payment(s):\n\n`;
              successfulSubmissions.forEach((sub, idx) => {
                message += `${idx + 1}. ${sub.feeHead} (${sub.installment}) - ₹${sub.amount.toFixed(2)} - Receipt: ${sub.receiptNo}\n`;
              });
            }
            
            if (failedSubmissions.length > 0) {
              message += `\n⚠️ Failed to record ${failedSubmissions.length} payment(s):\n\n`;
              failedSubmissions.forEach((sub, idx) => {
                message += `${idx + 1}. ${sub.feeHead} (${sub.installment}) - ₹${sub.amount.toFixed(2)} - Error: ${sub.error}\n`;
              });
            }
            
            setPaymentStatus({ type: "success", response, message });
            alert(message);
            
            // Reload page to refresh data
            if (successfulSubmissions.length > 0) {
              window.location.reload();
            }
          } catch (submitError) {
            console.error('Error submitting payment to backend:', submitError);
            setPaymentStatus({ 
              type: "error", 
              message: `Payment successful on Razorpay but failed to record: ${submitError.message}` 
            });
            alert(`⚠️ Payment successful on Razorpay but failed to record: ${submitError.message}\n\nRazorpay Payment ID: ${response.razorpay_payment_id}\n\nPlease contact admin with this payment ID.`);
          }
        },
        prefill: {
          name: searchResult
            ? `${searchResult.firstname || ""} ${searchResult.lastname || ""}`.trim()
            : "",
          email: searchResult?.personalemail || "",
          contact: searchResult?.mobileno1 || "",
        },
        notes: {
          srn: studentDetails?.admissionno || "",
          selectedFeeHeads: selectedRows
            .map((row) => `${row.feeHead} (${row.feeInstallment})`)
            .join(", "),
        },
        theme: {
          color: "#1d976c",
        },
        modal: {
          ondismiss: () => {
            setPaymentStatus((prev) =>
              prev && prev.type === "success"
                ? prev
                : { type: "error", message: "Payment popup closed." }
            );
            setIsPaying(false);
          },
        },
      };

      const razorpay = await initializeRazorpayCheckout(options);
      razorpay.open();
    } catch (error) {
      console.error("Razorpay Error", error);
      setPaymentStatus({
        type: "error",
        message: error?.message || "Failed to initiate payment. Please try again.",
      });
    } finally {
      setIsPaying(false);
    }
  };

  if (isLoading) {
    return (
      <CCard className="shadow-sm mb-4">
        <CCardHeader className="fw-bold">💳 My Fee Payment</CCardHeader>
        <CCardBody className="text-center py-5">
          <div className="spinner-border text-primary mb-3" role="status" />
          <div className="fw-semibold">Loading your fee details...</div>
        </CCardBody>
      </CCard>
    );
  }
  

  if (error) {
    return (
      <CCard className="shadow-sm mb-4">
        <CCardHeader className="fw-bold">💳 My Fee Payment</CCardHeader>
        <CCardBody>
          <CAlert color="danger">{error}</CAlert>
        </CCardBody>
      </CCard>
    );
  }

  return (
    <CCard className="border-0 shadow-lg ">
      <CCardHeader
        className="text-white fw-bold fs-5 rounded-top-4"
        style={{ background: "linear-gradient(135deg, #224abe, #224abe)" }}
      >
        <CRow className="align-items-center">
          <CCol xs={12} md={6}>
            💳 My Fee Payment
          </CCol>
          {/* Installment Details at Top Right */}
          {installmentDetails && BookNoReceiptNoDetails && (
            <CCol xs={12} md={6}>
              <div className="d-flex justify-content-end align-items-center gap-3 flex-wrap" style={{ fontSize: '0.85rem' }}>
                <div>
                  <strong>Financial Year:</strong> {BookNoReceiptNoDetails.financialyear}
                </div>
                <div>
                  <strong>M Receipt:</strong> {BookNoReceiptNoDetails.receiptno}/{BookNoReceiptNoDetails.bookno}
                </div>
                <div>
                  <strong>E-Receipt:</strong> {installmentDetails.ShortName}/{installmentDetails.ereceiptno + 1}
                </div>
              </div>
            </CCol>
          )}
        </CRow>
      </CCardHeader>

      <CCardBody className="p-3">
        {/* Student Profile */}
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
                      <strong>University</strong>
                      <div className="text-muted">{studentDetails.name}</div>
                    </CCol>
                  </CRow>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        )}

        {/* Fee Details - Read Only */}
        {feeRows.length > 0 && (
          <CCard className="mb-3 border-0 shadow-sm rounded-3">
            <CCardHeader className="fw-semibold bg-light py-2">
              💰 Fee Details
            </CCardHeader>
            <CCardBody className="p-2">
              <div className="table-responsive">
                <table className="table table-hover table-striped align-middle mb-0">
                  <thead className="table-dark sticky-top">
                    <tr>
                      <th>#</th>
                      <th>
                        <CFormCheck
                          type="checkbox"
                          label="Select All"
                          checked={selectAll}
                          onChange={handleSelectAllToggle}
                        />
                      </th>
                      <th>Fee Installment</th>
                      <th>Fee Head</th>
                      <th className="text-end">Fee Amount</th>
                      <th className="text-end">Fees Submitted</th>
                      <th className="text-end">Amount Due</th>
                      <th className="text-end">Current Fees</th>
                      <th className="text-end">Due Date</th>
                      <th className="text-end">Fine Amount</th>
                      <th className="text-end">Waived Amount</th>
                      <th className="text-end">Net Amount</th>
                      <th className="text-end">Amount Remaining</th>
                    </tr>
                  </thead>
                  <tbody>
                    {feeRows.map((row, idx) => (
                      <tr key={idx}>
                        <td>{row.slNo}</td>
                        <td>
                          <CFormCheck
                            type="checkbox"
                            checked={row.selectAll || false}
                            onChange={() => handleRowSelectToggle(idx)}
                          />
                        </td>
                        <td>{row.feeInstallment}</td>
                        <td>{row.feeHead}</td>
                        <td className="text-end">{row.feeAmount.toFixed(2)}</td>
                        <td className="text-end">{row.feesSubmitted.toFixed(2)}</td>
                        <td className="text-end">{(row.feeAmount - row.feesSubmitted).toFixed(2)}</td>
                        <td className="text-end">{row.currentFees.toFixed(2)}</td>
                        <td className="text-end">{row.dueDate}</td>
                        <td className="text-end">{row.fineAmount.toFixed(2)}</td>
                        <td className="text-end">{row.waivedAmount.toFixed(2)}</td>
                        <td className="text-end">{(row.feeAmount - row.waivedAmount + row.fineAmount - row.feesSubmitted).toFixed(2)}</td>
                        <td className="text-end">
                          {(row.feeAmount - row.currentFees - row.waivedAmount + row.fineAmount - row.feesSubmitted).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="table-secondary fw-semibold">
                    <tr>
                      <td colSpan={4} className="text-end">
                        Totals
                      </td>
                      <td className="text-end">{totals.feeAmount.toFixed(2)}</td>
                      <td className="text-end">{totals.feesSubmitted.toFixed(2)}</td>
                      <td className="text-end">{(totals.feeAmount - totals.feesSubmitted).toFixed(2)}</td>
                      <td className="text-end">{payableAmount.toFixed(2)}</td>
                      <td className="text-end">N/A</td>
                      <td className="text-end">{totals.fineAmount.toFixed(2)}</td>
                      <td className="text-end">{totals.waivedAmount.toFixed(2)}</td>
                      <td className="text-end">{(totals.feeAmount - totals.waivedAmount + totals.fineAmount - totals.feesSubmitted).toFixed(2)}</td>
                      <td className="text-end">
                        {(totals.feeAmount - payableAmount - totals.waivedAmount + totals.fineAmount - totals.feesSubmitted).toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </CCardBody>
          </CCard>
        )}

        {/* Online Payment Only */}
        {feeRows.length > 0 && (
          <PaymentSummaryCard
            amount={payableAmount}
            onPay={handlePayment}
            isPaying={isPaying}
            selectedCount={selectedFeeRows.length}
            totalCount={feeRows.length}
            paymentStatus={paymentStatus}
          />
        )}

        {feeRows.length === 0 && !error && (
          <CAlert color="info">No pending fees found.</CAlert>
        )}
      </CCardBody>
    </CCard>
  );
};

export default StudentFeePayment;
