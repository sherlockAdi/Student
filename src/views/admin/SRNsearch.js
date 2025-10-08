import React, { useState, useEffect } from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CRow,
  CCol,
  CFormInput,
  CFormCheck,
  CButton,
  CDropdown,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilSearch } from "@coreui/icons";

import {
  searchStudentBySRN,
  searchStudentByMobile,
  getFeeSelectStudent,
  getFeeInstallmentDetails,
  getFeeBookNoReceiptNo,
  getAmiFeeDetails,
  submitOfflinePayment,
  submitFee,
} from "../../api/api";
import PaymentSummaryCard from "../../components/payments/PaymentSummaryCard";
import OfflinePaymentForm from "../../components/payments/OfflinePaymentForm";
import {
  initializeRazorpayCheckout,
  loadRazorpayScript,
} from "../../utils/razorpay";
import { RAZORPAY_KEY_ID } from "../../config/razorpayConfig";

const SRNSearch = () => {
  const [srnInput, setSrnInput] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [studentDetails, setStudentDetails] = useState(null);
  const [installmentDetails, setInstallmentDetails] = useState(null);
  const today = new Date().toISOString().split("T")[0];
  const [receiptDate, setReceiptDate] = useState(today);
  const [BookNoReceiptNoDetails, setBookNoReceiptNoDetails] = useState(null);

  const [depositDate, setDepositDate] = useState(today);
  const [clearingDate, setClearingDate] = useState(today);
  const [feeDeposited, setFeeDeposited] = useState(false);

  const [amiDetails, setAmiDetails] = useState([]);
  const [feeRows, setFeeRows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [paymentMode, setPaymentMode] = useState(null);

  // Select All state for fee rows
  const [selectAll, setSelectAll] = useState(false);

  // Transform AMI API data into feeRows with detailed fields
  const transformAmiToFeeRows = (amiData) => {
    return amiData.map((item, index) => {
      const feeAmount = Number(item.FeeAmount) || 0;
      const concession = 0; // Add if you have data
      const dueAmount = feeAmount - concession;
      const feesSubmitted = Number(item.DepositeFee) || 0;
      const waivedAmount = Number(item.WaivedAmount) || 0;
      const waiveAmount = 0; // Add if you have data
      const fineAmount = 0; // Initialize fine amount
      const currentFees = feeAmount - feesSubmitted - waivedAmount - concession;
      const amountRemaining = dueAmount - feesSubmitted - waivedAmount;

      return {
        slNo: index + 1,
        selectAll: false,
        feeInstallment: item.intalmentname || "N/A",
        feeHead: item.feeheadname || "N/A",
        installmentId: item.instalmentid || 1, // Add installment ID from API
        feeHeadId: item.feeheadid || 0, // Add fee head ID from API
        dueDate: today, // Set due date to today
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

  const handleSearch = async () => {
    if (!srnInput.trim()) {
      alert("Please enter an SRN number or mobile number.");
      return;
    }

    setIsLoading(true);

    try {
      // Check if input is a 10-digit mobile number
      const isMobileNumber = /^\d{10}$/.test(srnInput.trim());
      
      let data;
      let AdminNo;
      if (isMobileNumber) {
        // Search by mobile number
        data = await searchStudentByMobile(srnInput.trim());
        AdminNo = data[0].admissionno;
      } else {
        // Search by SRN
        data = await searchStudentBySRN(srnInput);
        AdminNo = srnInput;
      }
      
      if (data?.length > 0) {
        setSearchResult(data[0]);
        const collegeId = 1;
        const id = data[0].id;

        const data2 = await getFeeSelectStudent(id);
        setStudentDetails(data2[0]);

        const data3 = await getFeeInstallmentDetails({
          collegeid: collegeId,
          SrnNo: AdminNo,
        });
        setInstallmentDetails(data3[0]);

        if (data3[0]?.ereceiptdate) {
          setReceiptDate(data3[0].ereceiptdate.split("T")[0]);
        } else {
          setReceiptDate(today);
        }

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
          setAmiDetails(ami || []);

          const feeRowsFromAmi = transformAmiToFeeRows(ami || []);
          setFeeRows(feeRowsFromAmi);
          setSelectAll(false); // reset select all on new search
        } else {
          setAmiDetails([]);
          setFeeRows([]);
          setSelectAll(false);
        }
      } else {
        alert("No student found.");
        setSearchResult(null);
        setStudentDetails(null);
        setInstallmentDetails(null);
        setBookNoReceiptNoDetails(null);
        setAmiDetails([]);
        setFeeRows([]);
        setSelectAll(false);
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle individual row checkbox toggle
  const handleRowSelectToggle = (index) => {
    const newRows = [...feeRows];
    newRows[index].selectAll = !newRows[index].selectAll;
    setFeeRows(newRows);

    // If any row unchecked, uncheck selectAll; else if all checked, check selectAll
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

  // Handler to update currentFees on editable table, recalc totals
  const handleCurrentFeesChange = (index, value) => {
    const newFeeRows = [...feeRows];
    let val = Number(value);
    if (isNaN(val) || val < 0) val = 0;

    const maxCurrentFees =
      newFeeRows[index].feeAmount -
      newFeeRows[index].feesSubmitted -
      newFeeRows[index].waivedAmount -
      newFeeRows[index].concession;

    if (val > maxCurrentFees) val = maxCurrentFees;

    newFeeRows[index].currentFees = val;

    newFeeRows[index].amountRemaining =
      newFeeRows[index].dueAmount -
      newFeeRows[index].feesSubmitted -
      newFeeRows[index].waivedAmount -
      val;

    if (newFeeRows[index].amountRemaining < 0)
      newFeeRows[index].amountRemaining = 0;

    setFeeRows(newFeeRows);
  };

  // Handler to update waived amount (editable)
  const handleWaivedAmountChange = (index, value) => {
    const newFeeRows = [...feeRows];
    let val = Number(value);
    if (isNaN(val) || val < 0) val = 0;

    newFeeRows[index].waivedAmount = val;
    
    // Recalculate current fees and amount remaining
    const maxCurrentFees =
      newFeeRows[index].feeAmount -
      newFeeRows[index].feesSubmitted -
      val -
      newFeeRows[index].concession;

    if (newFeeRows[index].currentFees > maxCurrentFees) {
      newFeeRows[index].currentFees = maxCurrentFees > 0 ? maxCurrentFees : 0;
    }

    newFeeRows[index].amountRemaining =
      newFeeRows[index].dueAmount -
      newFeeRows[index].feesSubmitted -
      val -
      newFeeRows[index].currentFees;

    if (newFeeRows[index].amountRemaining < 0)
      newFeeRows[index].amountRemaining = 0;

    setFeeRows(newFeeRows);
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
        name: "ATM GLOBAL BUSSINESS SCHOOL",
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
                  InstalmentId: (row.installmentId || 1).toString(),
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
                  PaymentModes: 'Online',
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
                
                // Also submit to fee table
                const feePayload = {
                  UserId: 1,
                  UserType: 1,
                  StudentId: parseInt(searchResult?.id) || 0,
                  FeeCategoryId: parseInt(studentDetails?.feecategoryid) || 1,
                  InstalmentId: row.installmentId || 1,
                  FeeHeadId: (row.feeHeadId || 0).toString(),
                  FeeHeadAmount: row.currentFees.toString(),
                  TotalFeeAmount: row.feeAmount.toString(),
                  DepositeFee: row.currentFees.toString(),
                  WaiveAmount: row.waivedAmount.toString(),
                  RemainingFee: (row.amountRemaining - row.currentFees).toString(),
                  SubmitDate: today,
                  DDate: today,
                  PaymentClearDate: today,
                  SubmitId: 0,
                  IsOcc: false,
                  InstallmentType: 1,
                  ActualFeeAmount: row.feeAmount.toString(),
                  ConssessionAmount: row.concession.toString()
                };
                
                try {
                  await submitFee(feePayload);
                  console.log(`Fee data submitted for row ${i + 1}`);
                } catch (feeError) {
                  console.error(`Error submitting fee data for row ${i + 1}:`, feeError);
                }
                
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
            
            // Refresh data
            if (srnInput && successfulSubmissions.length > 0) {
              handleSearch();
            }
          } catch (submitError) {
            console.error('Error submitting payment to backend:', submitError);
            setPaymentStatus({ 
              type: "error", 
              message: `Payment successful on Razorpay but failed to record: ${submitError.message}` 
            });
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

  const handlePaymentmode = (mode) => {
    setPaymentMode(mode);
  };

  const handleOfflinePaymentSubmit = async (paymentData) => {
    console.log('Offline Payment Data:', paymentData);
    
    setIsPaying(true);
    
    try {
      // Get selected fee rows for installment details
      const selectedRows = feeRows.filter(row => row.selectAll);
      
      if (selectedRows.length === 0) {
        alert('⚠️ Please select at least one fee row to submit payment.');
        setIsPaying(false);
        return;
      }
      
      const successfulSubmissions = [];
      const failedSubmissions = [];
      
      // Loop through each selected row and submit individually
      for (let i = 0; i < selectedRows.length; i++) {
        const row = selectedRows[i];
        const currentEReceiptNo = (installmentDetails?.ereceiptno || 0) + 1 + i;
        
        try {
          // Prepare the API payload for each row
          const apiPayload = {
            PaymentMode: paymentData.paymentModeName || '',
            BankName: paymentData.bankNameField || paymentData.bank || '',
            ChequeDdNo: paymentData.chequeNo || paymentData.draftNo || '',
            BankBranch: paymentData.branchName || '',
            ChequeDdDate: paymentData.chequeDate || paymentData.draftDate || today,
            ChequeClearingDate: clearingDate || today,
            TransactionId: paymentData.transactionNo || '',
            TransactionReceipt: '',
            TransactionAmount: row.currentFees.toString(), // Use individual row amount
            CardNo: paymentData.cardNo || '',
            CardAmount: paymentData.cardAmount || '0',
            FeeCollectionInFavourOf: paymentData.favourOfName || '',
            OtherCharges: '0',
            OtherChargesRemarks: '',
            ChequeDraftInFavourOf: paymentData.favourOfName || '',
            StudentId: parseInt(searchResult?.id) || 0,
            FeeCategoryId: parseInt(studentDetails?.feecategoryid) || 1,
            InstalmentId: (row.installmentId || 1).toString(),
            SubmitDate: today,
            FineAmount: row.fineAmount?.toString() || '0',
            OtherFineAmount: '0',
            NetAmountSubmitted: row.currentFees.toString(), // Use individual row amount
            Remarks: `${paymentData.remarks || ''} - ${row.feeHead} (${row.feeInstallment})`,
            FeeSubmitLastDate: today,
            FinancialYearId: (BookNoReceiptNoDetails?.financialyearid || 1).toString(),
            BookNo: (BookNoReceiptNoDetails?.bookno || '').toString(),
            ReceiptNo: (BookNoReceiptNoDetails?.receiptno || '').toString(),
            FavorOfs: paymentData.favourOfName || '',
            PaymentModes: paymentData.paymentModeName || '',
            BankNames: paymentData.bank || '',
            BranchNames: paymentData.branchName || '',
            AccountNumbers: paymentData.account || '',
            InFavorOfs: paymentData.favourOfName || '',
            InstallmentType: '1',
            DepositDate: depositDate || today,
            PaymentClearDate: clearingDate || today,
            EReceiptNo: BookNoReceiptNoDetails.receiptno.toString() + '/' + BookNoReceiptNoDetails.bookno.toString(),
            InFavOfId: (paymentData.favourOf || '').toString(),
            AuthorizedSignatory: paymentData.signatoryName || '',
            Uid: '1',
            Utype: '1',
            AccountNoId: (paymentData.accountId || '').toString()
          };
          
          console.log(`API Payload for Row ${i + 1}:`, apiPayload);
          
          // Submit the payment for this row
          const response = await submitOfflinePayment(apiPayload);
          
          console.log(`Payment Response for Row ${i + 1}:`, response);
          
          // Also submit to fee table
          const feePayload = {
            UserId: 1,
            UserType: 1,
            StudentId: parseInt(searchResult?.id) || 0,
            FeeCategoryId: parseInt(studentDetails?.feecategoryid) || 1,
            InstalmentId: row.installmentId || 1,
            FeeHeadId: (row.feeHeadId || 0).toString(),
            FeeHeadAmount: row.currentFees.toString(),
            TotalFeeAmount: row.feeAmount.toString(),
            DepositeFee: row.currentFees.toString(),
            WaiveAmount: row.waivedAmount.toString(),
            RemainingFee: (row.amountRemaining - row.currentFees).toString(),
            SubmitDate: today,
            DDate: depositDate || today,
            PaymentClearDate: clearingDate || today,
            SubmitId: 0,
            IsOcc: false,
            InstallmentType: 1,
            ActualFeeAmount: row.feeAmount.toString(),
            ConssessionAmount: row.concession.toString()
          };
          
          try {
            await submitFee(feePayload);
            console.log(`Fee data submitted for row ${i + 1}`);
          } catch (feeError) {
            console.error(`Error submitting fee data for row ${i + 1}:`, feeError);
          }
          
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
      
      // Show summary of submissions
      let message = '';
      if (successfulSubmissions.length > 0) {
        message += `✅ Successfully submitted ${successfulSubmissions.length} payment(s):\n\n`;
        successfulSubmissions.forEach((sub, idx) => {
          message += `${idx + 1}. ${sub.feeHead} (${sub.installment}) - ₹${sub.amount.toFixed(2)} - Receipt: ${sub.receiptNo}\n`;
        });
      }
      
      if (failedSubmissions.length > 0) {
        message += `\n❌ Failed to submit ${failedSubmissions.length} payment(s):\n\n`;
        failedSubmissions.forEach((sub, idx) => {
          message += `${idx + 1}. ${sub.feeHead} (${sub.installment}) - ₹${sub.amount.toFixed(2)} - Error: ${sub.error}\n`;
        });
      }
      
      alert(message);
      
      // Reset payment mode and refresh data if any submission was successful
      if (successfulSubmissions.length > 0) {
        setPaymentMode(null);
        
        // Refresh the student data
        if (srnInput) {
          handleSearch();
        }
      }
    } catch (error) {
      console.error('Error submitting offline payment:', error);
      alert(`❌ Error submitting payment: ${error.response?.data?.message || error.message || 'Unknown error occurred'}`);
    } finally {
      setIsPaying(false);
    }
  };

  if (isLoading) {
    return (
      <CCard className="shadow-sm mb-4">
        <CCardHeader className="fw-bold">🎓 SRN-Based Fee Search</CCardHeader>
        <CCardBody className="text-center py-5">
          <div className="spinner-border text-primary mb-3" role="status" />
          <div className="fw-semibold">Loading student data...</div>
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
            🎓 SRN-Based Fee Search
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
        {/* Search Box */}
        <CRow className="align-items-end g-3 mb-3">
        <CCol xs={12} md={4} lg={2} className="d-flex justify-content-center align-items-center">
             <div className="fw-semibold text-center">Enter SRN or Mobile Number</div>
          </CCol>
          <CCol xs={12} md={4} lg={3}>
            <CFormInput
              // label="Enter SRN or Mobile Number"
              value={srnInput}
              onChange={(e) => setSrnInput(e.target.value)}
              placeholder="🔎 SRN or 10-digit mobile"
              size="lg"
              className="rounded-pill shadow-sm"
            />
          </CCol>
          <CCol xs={12} md={4} lg={3}>
            <CButton
              color="primary"
              size="lg"
              className="w-100 rounded-pill shadow"
              onClick={handleSearch}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                  />
                  Searching...
                </>
              ) : (
                <>
                  <CIcon icon={cilSearch} className="me-2" />
                  Search
                </>
              )}
            </CButton>
          </CCol>
        </CRow>

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

        {/* Installment Details */}
        {/* {installmentDetails && BookNoReceiptNoDetails && (
          <CCard className="mb-3 border-0 shadow-sm rounded-3">
            <CCardHeader className="fw-semibold bg-light py-2">
              📑 Installment Details
            </CCardHeader>
            <CCardBody className="p-3">
              <CRow className="gy-2 gx-3">
                <CCol xs={12} sm={6} md={3}>
                  <strong>Financial Year:</strong>
                  <div className="text-muted">
                    {BookNoReceiptNoDetails.financialyear}
                  </div>
                </CCol>
                <CCol xs={12} sm={6} md={3}>
                  <strong>M Receipt No.:</strong>
                  <div className="text-muted">
                    {BookNoReceiptNoDetails.receiptno}/
                    {BookNoReceiptNoDetails.bookno}
                  </div>
                </CCol>
                <CCol xs={12} sm={6} md={3}>
                  <strong>E-Receipt No.:</strong>
                  <div className="text-muted">
                    {installmentDetails.ShortName} /{" "}
                    {installmentDetails.ereceiptno + 1}
                  </div>
                </CCol>
                <CCol xs={12} sm={6} md={3}>
                  <strong>E-Receipt Date:</strong>
                  <CFormInput
                    type="date"
                    value={receiptDate}
                    onChange={(e) => setReceiptDate(e.target.value)}
                    size="sm"
                    className="shadow-sm"
                  />
                </CCol>
                <CCol xs={12} sm={6} md={4} className="mt-3">
                  <strong>Fee Deposited:</strong>
                  <div className="d-flex gap-3 mt-2">
                    <CFormCheck
                      type="radio"
                      label="Yes"
                      name="feeDeposited"
                      checked={feeDeposited === true}
                      onChange={() => {
                        setFeeDeposited(true);
                        setDepositDate(today);
                        setClearingDate(today);
                      }}
                    />
                    <CFormCheck
                      type="radio"
                      label="No"
                      name="feeDeposited"
                      checked={feeDeposited === false}
                      onChange={() => setFeeDeposited(false)}
                    />
                  </div>
                </CCol>
                {feeDeposited && (
                  <>
                    <CCol xs={12} sm={6} md={4} className="mt-3">
                      <strong>Deposit Date:</strong>
                      <CFormInput
                        type="date"
                        value={depositDate}
                        onChange={(e) => setDepositDate(e.target.value)}
                        size="sm"
                        className="shadow-sm"
                      />
                    </CCol>
                    <CCol xs={12} sm={6} md={4} className="mt-3">
                      <strong>Clearing Date:</strong>
                      <CFormInput
                        type="date"
                        value={clearingDate}
                        onChange={(e) => setClearingDate(e.target.value)}
                        size="sm"
                        className="shadow-sm"
                      />
                    </CCol>
                  </>
                )}
              </CRow>
            </CCardBody>
          </CCard>
        )} */}

        {/* Payment Summary */}


        {/* Fee Details */}
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
                        <td>
                          <CFormInput
                            type="number"
                            size="sm"
                            value={row.currentFees}
                            onChange={(e) =>
                              handleCurrentFeesChange(idx, e.target.value)
                            }
                            className="shadow-sm"
                            style={{ maxWidth: "90px" }}
                          />
                        </td>
                        <td className="text-end">{row.dueDate}</td>
                        <td className="text-end">{row.fineAmount.toFixed(2)}</td>
                        <td>
                          <CFormInput
                            type="number"
                            size="sm"
                            value={row.waivedAmount}
                            onChange={(e) =>
                              handleWaivedAmountChange(idx, e.target.value)
                            }
                            className="shadow-sm"
                            style={{ maxWidth: "90px" }}
                          />
                        </td>
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

        {/* Payment Mode Selection Buttons */}
        {feeRows.length > 0 && !paymentMode && (
          <CRow className="g-3 mb-3">
            <CCol xs={12} md={6}>
              <CButton
                color="success"
                size="lg"
                className="w-100 rounded-pill shadow"
                onClick={() => handlePaymentmode('online')}
              >
                💳 Online Payment
              </CButton>
            </CCol>
            <CCol xs={12} md={6}>
              <CButton
                color="warning"
                size="lg"
                className="w-100 rounded-pill shadow"
                onClick={() => handlePaymentmode('offline')}
              >
                🏦 Offline Payment
              </CButton>
            </CCol>
          </CRow>
        )}

        {/* Online Payment Summary */}
        {feeRows.length > 0 && paymentMode === 'online' && (
          <>
            <PaymentSummaryCard
              amount={payableAmount}
              onPay={handlePayment}
              isPaying={isPaying}
              selectedCount={selectedFeeRows.length}
              totalCount={feeRows.length}
              paymentStatus={paymentStatus}
            />
            <CButton
              color="secondary"
              className="mt-3"
              onClick={() => setPaymentMode(null)}
            >
              ← Back to Payment Options
            </CButton>
          </>
        )}

        {/* Offline Payment Form */}
        {feeRows.length > 0 && paymentMode === 'offline' && (
          <>
            <OfflinePaymentForm
              amount={payableAmount}
              studentDetails={{ ...studentDetails, id: searchResult?.id }}
              onSubmit={handleOfflinePaymentSubmit}
              isSubmitting={isPaying}
            />
            <CButton
              color="secondary"
              className="mt-3"
              onClick={() => setPaymentMode(null)}
            >
              ← Back to Payment Options
            </CButton>
          </>
        )}
      </CCardBody>
    </CCard>
  );
};

export default SRNSearch;
