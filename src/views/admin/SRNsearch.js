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
        handler: function (response) {
          setPaymentStatus({ type: "success", response });
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
          selectedFeeHeads: selectedFeeRows
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
    // TODO: Implement offline payment submission API
    alert(`Offline payment submitted successfully!\n\nDetails:\nMode: ${paymentData.paymentModeName}\nBank: ${paymentData.bank}\nAccount: ${paymentData.account}\nAmount: ₹${paymentData.amount.toFixed(2)}`);
    
    // Reset payment mode after successful submission
    setPaymentMode(null);
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
    <div className="p-2">
      {/* Compact Header with Search */}
      <CCard className="border-0 shadow-sm mb-2">
        <CCardBody className="p-2">
          <CRow className="align-items-center g-2">
            <CCol xs={12} md={3}>
              <CFormInput
                value={srnInput}
                onChange={(e) => setSrnInput(e.target.value)}
                placeholder="🔎 SRN or Mobile"
                size="sm"
              />
            </CCol>
            <CCol xs={12} md={2}>
              <CButton
                color="primary"
                size="sm"
                className="w-100"
                onClick={handleSearch}
                disabled={isLoading}
              >
                {isLoading ? "Searching..." : "Search"}
              </CButton>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>

      {/* Installment & Receipt Details at Top - Compact */}
      {installmentDetails && BookNoReceiptNoDetails && (
        <CCard className="border-0 shadow-sm mb-2" style={{ backgroundColor: '#f8f9fa' }}>
          <CCardBody className="p-2">
            <div className="d-flex flex-wrap gap-3 align-items-center" style={{ fontSize: '0.85rem' }}>
              <div>
                <strong>FY:</strong> <span className="text-muted">{BookNoReceiptNoDetails.financialyear}</span>
              </div>
              <div className="border-start ps-3">
                <strong>M Receipt:</strong> <span className="text-muted">{BookNoReceiptNoDetails.receiptno}/{BookNoReceiptNoDetails.bookno}</span>
              </div>
              <div className="border-start ps-3">
                <strong>E-Receipt:</strong> <span className="text-muted">{installmentDetails.ShortName}/{installmentDetails.ereceiptno + 1}</span>
              </div>
              <div className="border-start ps-3">
                <strong>Date:</strong> 
                <CFormInput
                  type="date"
                  value={receiptDate}
                  onChange={(e) => setReceiptDate(e.target.value)}
                  size="sm"
                  style={{ width: '140px', display: 'inline-block', marginLeft: '5px' }}
                />
              </div>
              <div className="border-start ps-3">
                <strong>Deposited:</strong>
                <CFormCheck
                  inline
                  type="radio"
                  label="Yes"
                  name="feeDeposited"
                  checked={feeDeposited === true}
                  onChange={() => {
                    setFeeDeposited(true);
                    setDepositDate(today);
                    setClearingDate(today);
                  }}
                  className="ms-2"
                />
                <CFormCheck
                  inline
                  type="radio"
                  label="No"
                  name="feeDeposited"
                  checked={feeDeposited === false}
                  onChange={() => setFeeDeposited(false)}
                />
              </div>
              {feeDeposited && (
                <>
                  <div className="border-start ps-3">
                    <strong>Deposit:</strong>
                    <CFormInput
                      type="date"
                      value={depositDate}
                      onChange={(e) => setDepositDate(e.target.value)}
                      size="sm"
                      style={{ width: '140px', display: 'inline-block', marginLeft: '5px' }}
                    />
                  </div>
                  <div className="border-start ps-3">
                    <strong>Clearing:</strong>
                    <CFormInput
                      type="date"
                      value={clearingDate}
                      onChange={(e) => setClearingDate(e.target.value)}
                      size="sm"
                      style={{ width: '140px', display: 'inline-block', marginLeft: '5px' }}
                    />
                  </div>
                </>
              )}
            </div>
          </CCardBody>
        </CCard>
      )}

      {/* Compact Student Profile */}
      {searchResult && studentDetails && (
        <CCard className="border-0 shadow-sm mb-2">
          <CCardBody className="p-2">
            <CRow className="g-2" style={{ fontSize: '0.85rem' }}>
              <CCol xs={12} md={3} className="border-end">
                <div className="fw-bold text-primary">{searchResult.firstname} {searchResult.lastname}</div>
                <div className="text-muted small">📞 {searchResult.mobileno1}</div>
                <div className="badge bg-info mt-1" style={{ fontSize: '0.75rem' }}>🆔 {studentDetails.admissionno}</div>
              </CCol>
              <CCol xs={12} md={9}>
                <CRow className="g-2">
                  <CCol xs={6} md={3}>
                    <strong>College:</strong> <span className="text-muted">{studentDetails.collegename}</span>
                  </CCol>
                  <CCol xs={6} md={2}>
                    <strong>Branch:</strong> <span className="text-muted">{studentDetails.Branchname}</span>
                  </CCol>
                  <CCol xs={6} md={3}>
                    <strong>Course:</strong> <span className="text-muted">{studentDetails.corsename}</span>
                  </CCol>
                  <CCol xs={6} md={2}>
                    <strong>Sem:</strong> <span className="text-muted">{studentDetails.semesterno}</span>
                  </CCol>
                  <CCol xs={6} md={2}>
                    <strong>Batch:</strong> <span className="text-muted">{studentDetails.Batchno}</span>
                  </CCol>
                </CRow>
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      )}

      {/* Compact Fee Table */}
      {feeRows.length > 0 && (
        <CCard className="border-0 shadow-sm mb-2">
          <CCardBody className="p-2">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <strong style={{ fontSize: '0.9rem' }}>💰 Fee Details</strong>
              <CFormCheck
                type="checkbox"
                label="Select All"
                checked={selectAll}
                onChange={handleSelectAllToggle}
                style={{ fontSize: '0.85rem' }}
              />
            </div>
            <div className="table-responsive" style={{ maxHeight: '300px', overflowY: 'auto' }}>
              <table className="table table-sm table-hover mb-0" style={{ fontSize: '0.8rem' }}>
                <thead className="table-light" style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                  <tr>
                    <th style={{ padding: '0.3rem' }}>☑</th>
                    <th style={{ padding: '0.3rem' }}>Installment</th>
                    <th style={{ padding: '0.3rem' }}>Fee Head</th>
                    <th className="text-end" style={{ padding: '0.3rem' }}>Fee Amt</th>
                    <th className="text-end" style={{ padding: '0.3rem' }}>Submitted</th>
                    <th className="text-end" style={{ padding: '0.3rem' }}>Current</th>
                    <th className="text-end" style={{ padding: '0.3rem' }}>Waived</th>
                    <th className="text-end" style={{ padding: '0.3rem' }}>Remaining</th>
                  </tr>
                </thead>
                <tbody>
                  {feeRows.map((row, idx) => (
                    <tr key={idx}>
                      <td style={{ padding: '0.3rem' }}>
                        <CFormCheck
                          type="checkbox"
                          checked={row.selectAll || false}
                          onChange={() => handleRowSelectToggle(idx)}
                        />
                      </td>
                      <td style={{ padding: '0.3rem' }}>{row.feeInstallment}</td>
                      <td style={{ padding: '0.3rem' }}>{row.feeHead}</td>
                      <td className="text-end" style={{ padding: '0.3rem' }}>₹{row.feeAmount.toFixed(0)}</td>
                      <td className="text-end" style={{ padding: '0.3rem' }}>₹{row.feesSubmitted.toFixed(0)}</td>
                      <td style={{ padding: '0.3rem' }}>
                        <CFormInput
                          type="number"
                          size="sm"
                          value={row.currentFees}
                          onChange={(e) => handleCurrentFeesChange(idx, e.target.value)}
                          style={{ width: "70px", fontSize: '0.75rem', padding: '0.2rem' }}
                        />
                      </td>
                      <td style={{ padding: '0.3rem' }}>
                        <CFormInput
                          type="number"
                          size="sm"
                          value={row.waivedAmount}
                          onChange={(e) => handleWaivedAmountChange(idx, e.target.value)}
                          style={{ width: "70px", fontSize: '0.75rem', padding: '0.2rem' }}
                        />
                      </td>
                      <td className="text-end" style={{ padding: '0.3rem' }}>
                        ₹{(row.feeAmount - row.currentFees - row.waivedAmount - row.feesSubmitted).toFixed(0)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="table-secondary fw-semibold">
                  <tr>
                    <td colSpan={3} className="text-end" style={{ padding: '0.3rem' }}>Totals</td>
                    <td className="text-end" style={{ padding: '0.3rem' }}>₹{totals.feeAmount.toFixed(0)}</td>
                    <td className="text-end" style={{ padding: '0.3rem' }}>₹{totals.feesSubmitted.toFixed(0)}</td>
                    <td className="text-end" style={{ padding: '0.3rem' }}>₹{payableAmount.toFixed(0)}</td>
                    <td className="text-end" style={{ padding: '0.3rem' }}>₹{totals.waivedAmount.toFixed(0)}</td>
                    <td className="text-end" style={{ padding: '0.3rem' }}>
                      ₹{(totals.feeAmount - payableAmount - totals.waivedAmount - totals.feesSubmitted).toFixed(0)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </CCardBody>
        </CCard>
      )}

      {/* Compact Payment Buttons */}
      {feeRows.length > 0 && !paymentMode && (
        <CRow className="g-2 mb-2">
          <CCol xs={6}>
            <CButton
              color="success"
              size="sm"
              className="w-100"
              onClick={() => handlePaymentmode('online')}
            >
              💳 Online (₹{payableAmount.toFixed(0)})
            </CButton>
          </CCol>
          <CCol xs={6}>
            <CButton
              color="warning"
              size="sm"
              className="w-100"
              onClick={() => handlePaymentmode('offline')}
            >
              🏦 Offline (₹{payableAmount.toFixed(0)})
            </CButton>
          </CCol>
        </CRow>
      )}

      {/* Online Payment Summary */}
      {feeRows.length > 0 && paymentMode === 'online' && (
        <div className="mb-2">
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
            size="sm"
            className="mt-2"
            onClick={() => setPaymentMode(null)}
          >
            ← Back
          </CButton>
        </div>
      )}

      {/* Offline Payment Form */}
      {feeRows.length > 0 && paymentMode === 'offline' && (
        <div className="mb-2">
          <OfflinePaymentForm
            amount={payableAmount}
            studentDetails={{ ...studentDetails, id: searchResult?.id }}
            onSubmit={handleOfflinePaymentSubmit}
            isSubmitting={isPaying}
          />
          <CButton
            color="secondary"
            size="sm"
            className="mt-2"
            onClick={() => setPaymentMode(null)}
          >
            ← Back
          </CButton>
        </div>
      )}
    </div>
  );
};

export default SRNSearch;
