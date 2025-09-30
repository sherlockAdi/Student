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
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilSearch } from "@coreui/icons";

import {
  searchStudentBySRN,
  getFeeSelectStudent,
  getFeeInstallmentDetails,
  getFeeBookNoReceiptNo,
  getAmiFeeDetails,
} from "../../api/api";

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
      const currentFees = feeAmount - feesSubmitted - waivedAmount - concession;
      const amountRemaining = dueAmount - feesSubmitted - waivedAmount;

      return {
        slNo: index + 1,
        selectAll: false,
        feeInstallment: item.intalmentname || "N/A",
        feeHead: item.feeheadname || "N/A",
        feeAmount,
        concession,
        dueAmount,
        feesSubmitted,
        waivedAmount,
        currentFees: currentFees > 0 ? currentFees : 0,
        waiveAmount,
        amountRemaining: amountRemaining > 0 ? amountRemaining : 0,
      };
    });
  };

  const handleSearch = async () => {
    if (!srnInput.trim()) {
      alert("Please enter an SRN number.");
      return;
    }

    setIsLoading(true);

    try {
      const data = await searchStudentBySRN(srnInput);
      if (data?.length > 0) {
        setSearchResult(data[0]);
        const collegeId = 1;
        const id = data[0].id;

        const data2 = await getFeeSelectStudent(id);
        setStudentDetails(data2[0]);

        const data3 = await getFeeInstallmentDetails({
          collegeid: collegeId,
          SrnNo: srnInput,
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

  // Totals for footer
  const totals = feeRows.reduce(
    (acc, row) => {
      acc.feeAmount += row.feeAmount;
      acc.concession += row.concession;
      acc.dueAmount += row.dueAmount;
      acc.feesSubmitted += row.feesSubmitted;
      acc.waivedAmount += row.waivedAmount;
      acc.currentFees += row.currentFees;
      acc.waiveAmount += row.waiveAmount;
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
      waiveAmount: 0,
      amountRemaining: 0,
    }
  );

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
    <CCard className="shadow-sm mb-4">
      <CCardHeader className="fw-bold">🎓 SRN-Based Fee Search</CCardHeader>
      <CCardBody>
        <CRow className="align-items-end g-3 mb-4">
          <CCol xs={12} md={4} lg={3}>
            <CFormInput
              label="Enter SRN Number"
              value={srnInput}
              onChange={(e) => setSrnInput(e.target.value)}
              placeholder="e.g., SRN123456"
              size="lg"
            />
          </CCol>
          <CCol xs={12} md={4} lg={3}>
            <CButton
              color="primary"
              size="lg"
              className="w-100"
              onClick={handleSearch}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
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
          <CCard className="mb-4 border-0 shadow-sm profile-card">
            <CCardBody>
              <CRow>
                <CCol
                  xs={12}
                  md={4}
                  className="d-flex flex-column align-items-center justify-content-center text-center border-end mb-3 mb-md-0"
                >
                  <h5 className="fw-bold mb-1">
                    {searchResult.firstname} {searchResult.lastname}
                  </h5>
                  <div className="text-muted mb-2">
                    {searchResult.personalemail}
                  </div>
                  <div>
                    <strong>📞</strong> {searchResult.mobileno1}
                  </div>
                  <div>
                    <strong>🆔 SRN:</strong> {studentDetails.admissionno}
                  </div>
                </CCol>

                <CCol xs={12} md={8}>
                  <CRow className="mb-2">
                    <CCol xs={6} md={4}>
                      <strong>College:</strong>
                      <div className="text-muted">{studentDetails.collegename}</div>
                    </CCol>
                    <CCol xs={6} md={2}>
                      <strong>Branch:</strong>
                      <div className="text-muted">{studentDetails.Branchname}</div>
                    </CCol>
                    <CCol xs={6} md={3}>
                      <strong>Course:</strong>
                      <div className="text-muted">{studentDetails.corsename}</div>
                    </CCol>
                    <CCol xs={6} md={3}>
                      <strong>Type:</strong>
                      <div className="text-muted">{studentDetails.coursename}</div>
                    </CCol>
                  </CRow>
                  <CRow className="mb-2">
                    <CCol xs={6} md={4}>
                      <strong>Fee Category:</strong>
                      <div className="text-muted">
                        {studentDetails.feecategoryname}
                      </div>
                    </CCol>
                    <CCol xs={6} md={2}>
                      <strong>Semester:</strong>
                      <div className="text-muted">{studentDetails.semesterno}</div>
                    </CCol>
                    <CCol xs={6} md={3}>
                      <strong>Batch:</strong>
                      <div className="text-muted">{studentDetails.Batchno}</div>
                    </CCol>
                    <CCol xs={6} md={3}>
                      <strong>University:</strong>
                      <div className="text-muted">{studentDetails.name}</div>
                    </CCol>
                  </CRow>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        )}

        {/* Installment Details */}
        {installmentDetails && BookNoReceiptNoDetails && (
          <CCard className="mb-4 border-0 border-start border-4 border-warning shadow-sm">
            <CCardHeader className="fw-semibold bg-light">Installment Details</CCardHeader>
            <CCardBody>
              <CRow className="gy-3 gx-4">
                <CCol xs={12} sm={6} md={3} className="d-flex align-items-center">
                  <strong>Financial Year:&nbsp;</strong> 
                  <span className="text-muted">{BookNoReceiptNoDetails.financialyear}</span>
                </CCol>

                <CCol xs={12} sm={6} md={3} className="d-flex align-items-center">
                  <strong>M Receipt No.:&nbsp;</strong> 
                  <span className="text-muted">
                    {BookNoReceiptNoDetails.receiptno}/{BookNoReceiptNoDetails.bookno}
                  </span>
                </CCol>

                <CCol xs={12} sm={6} md={3} className="d-flex align-items-center">
                  <strong>E-Receipt No.:&nbsp;</strong>
                  <span className="text-muted">
                    {installmentDetails.ShortName} / {installmentDetails.ereceiptno + 1}
                  </span>
                </CCol>

                <CCol xs={12} sm={6} md={3} className="d-flex align-items-center gap-2">
                  <strong>E-Receipt Date:&nbsp;</strong>
                  <CFormInput
                    type="date"
                    value={receiptDate}
                    onChange={(e) => setReceiptDate(e.target.value)}
                    size="sm"
                    style={{ maxWidth: "160px" }}
                  />
                </CCol>

                <CCol xs={12} sm={6} md={3} className="d-flex align-items-center gap-2 mt-3 mt-sm-0">
                  <strong>Fee Deposited:&nbsp;</strong>
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
                    inline
                  />
                  <CFormCheck
                    type="radio"
                    label="No"
                    name="feeDeposited"
                    checked={feeDeposited === false}
                    onChange={() => setFeeDeposited(false)}
                    inline
                  />
                </CCol>

                {feeDeposited && (
                  <>
                    <CCol xs={12} sm={6} md={3} className="d-flex align-items-center gap-2 mt-3">
                      <strong>Deposit Date:&nbsp;</strong>
                      <CFormInput
                        type="date"
                        value={depositDate}
                        onChange={(e) => setDepositDate(e.target.value)}
                        size="sm"
                        style={{ maxWidth: "160px" }}
                      />
                    </CCol>
                    <CCol xs={12} sm={6} md={3} className="d-flex align-items-center gap-2 mt-3">
                      <strong>Clearing Date:&nbsp;</strong>
                      <CFormInput
                        type="date"
                        value={clearingDate}
                        onChange={(e) => setClearingDate(e.target.value)}
                        size="sm"
                        style={{ maxWidth: "160px" }}
                      />
                    </CCol>
                  </>
                )}
              </CRow>
            </CCardBody>
          </CCard>
        )}

        {/* Fee Details & Payment Table */}
        {feeRows.length > 0 && (
          <CCard className="mb-5 border-0 shadow-sm">
            <CCardHeader className="fw-semibold bg-light d-flex justify-content-between align-items-center">
              <div>💰 Fee Details & Payment</div>
              <CFormCheck
                type="checkbox"
                label="Select All"
                checked={selectAll}
                onChange={handleSelectAllToggle}
                id="selectAllCheckbox"
                inline
              />
            </CCardHeader>
            <CCardBody className="p-0">
              <div className="table-responsive">
                <table className="table table-bordered mb-0 align-middle">
                  <thead className="table-light">
                    <tr>
                      <th scope="col" style={{ width: "3rem", textAlign: "center" }}>
                        #
                      </th>
                      <th scope="col" style={{ width: "3rem", textAlign: "center" }}>
                        Select
                      </th>
                      <th scope="col" style={{ minWidth: "150px" }}>Fee Installment</th>
                      <th scope="col" style={{ minWidth: "150px" }}>Fee Head</th>
                      <th scope="col" style={{ width: "100px" }}>Fee Amount</th>
                      <th scope="col" style={{ width: "100px" }}>Concession</th>
                      <th scope="col" style={{ width: "100px" }}>Due Amount</th>
                      <th scope="col" style={{ width: "110px" }}>Fees Submitted</th>
                      <th scope="col" style={{ width: "110px" }}>Waived Amount</th>
                      <th scope="col" style={{ width: "120px" }}>Current Fees</th>
                      <th scope="col" style={{ width: "110px" }}>Waive Amount</th>
                      <th scope="col" style={{ width: "120px" }}>Amount Remaining</th>
                    </tr>
                  </thead>
                  <tbody>
                    {feeRows.map((row, idx) => (
                      <tr key={idx}>
                        <td style={{ textAlign: "center" }}>{row.slNo}</td>
                        <td style={{ textAlign: "center" }}>
                          <CFormCheck
                            type="checkbox"
                            checked={row.selectAll || false}
                            onChange={() => handleRowSelectToggle(idx)}
                            aria-label={`Select fee row ${row.slNo}`}
                          />
                        </td>
                        <td>{row.feeInstallment}</td>
                        <td>{row.feeHead}</td>
                        <td className="text-end">{row.feeAmount.toFixed(2)}</td>
                        <td className="text-end">{row.concession.toFixed(2)}</td>
                        <td className="text-end">{row.dueAmount.toFixed(2)}</td>
                        <td className="text-end">{row.feesSubmitted.toFixed(2)}</td>
                        <td className="text-end">{row.waivedAmount.toFixed(2)}</td>
                        <td>
                          <CFormInput
                            type="number"
                            size="sm"
                            min={0}
                            max={
                              row.feeAmount -
                              row.feesSubmitted -
                              row.waivedAmount -
                              row.concession
                            }
                            value={row.currentFees}
                            onChange={(e) =>
                              handleCurrentFeesChange(idx, e.target.value)
                            }
                            style={{ maxWidth: "90px" }}
                          />
                        </td>
                        <td className="text-end">{row.waiveAmount.toFixed(2)}</td>
                        <td className="text-end">{row.amountRemaining.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="table-light fw-semibold">
                    <tr>
                      <td colSpan={4} className="text-end">
                        Totals
                      </td>
                      <td className="text-end">{totals.feeAmount.toFixed(2)}</td>
                      <td className="text-end">{totals.concession.toFixed(2)}</td>
                      <td className="text-end">{totals.dueAmount.toFixed(2)}</td>
                      <td className="text-end">{totals.feesSubmitted.toFixed(2)}</td>
                      <td className="text-end">{totals.waivedAmount.toFixed(2)}</td>
                      <td className="text-end">{totals.currentFees.toFixed(2)}</td>
                      <td className="text-end">{totals.waiveAmount.toFixed(2)}</td>
                      <td className="text-end">{totals.amountRemaining.toFixed(2)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </CCardBody>
          </CCard>
        )}
      </CCardBody>
    </CCard>
  );
};

export default SRNSearch;
