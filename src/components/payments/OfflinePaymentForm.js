import React, { useState, useEffect } from 'react';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CRow,
  CCol,
  CFormInput,
  CFormSelect,
  CFormTextarea,
  CButton,
} from '@coreui/react';
import {
  getPaymentModeList,
  getFavourOfList,
  getBankList,
  getAccountList,
  getWaiverList,
  getSignatoryList,
} from '../../api/api';

const OfflinePaymentForm = ({ 
  amount, 
  studentDetails, 
  onSubmit, 
  isSubmitting = false 
}) => {
  const today = new Date().toISOString().split('T')[0];

  // Form state
  const [paymentModes, setPaymentModes] = useState([]);
  const [favourOfList, setFavourOfList] = useState([]);
  const [bankList, setBankList] = useState([]);
  const [accountList, setAccountList] = useState([]);
  const [waiverList, setWaiverList] = useState([]);
  const [signatoryList, setSignatoryList] = useState([]);

  // Selected values
  const [selectedPaymentMode, setSelectedPaymentMode] = useState('');
  const [selectedFavourOf, setSelectedFavourOf] = useState('');
  const [selectedBank, setSelectedBank] = useState('');
  const [selectedAccount, setSelectedAccount] = useState('');
  const [selectedWaiver, setSelectedWaiver] = useState('0');
  const [selectedSignatory, setSelectedSignatory] = useState('0');

  // Additional fields
  const [chequeNo, setChequeNo] = useState('');
  const [chequeDate, setChequeDate] = useState(today);
  const [transactionNo, setTransactionNo] = useState('');
  const [remarks, setRemarks] = useState('');

  // Loading states
  const [isLoadingBanks, setIsLoadingBanks] = useState(false);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(false);

  // Load initial dropdown data
  useEffect(() => {
    if (studentDetails?.id) {
      loadInitialData();
    }
  }, [studentDetails]);

  const loadInitialData = async () => {
    try {
      // Get studentId from studentDetails
      const studentId = studentDetails?.id;
      
      if (!studentId) {
        console.error('Student ID not available');
        return;
      }

      const [modes, favour, waivers, signatories] = await Promise.all([
        getPaymentModeList(),
        getFavourOfList(studentId),
        getWaiverList(),
        getSignatoryList(),
      ]);

      setPaymentModes(modes || []);
      setFavourOfList(favour || []);
      setWaiverList(waivers || []);
      setSignatoryList(signatories || []);
    } catch (error) {
      console.error('Error loading initial data:', error);
    }
  };

  // Load banks when payment mode and favour of are selected
  useEffect(() => {
    if (selectedPaymentMode && selectedFavourOf && selectedFavourOf !== '0') {
      loadBanks();
    } else {
      setBankList([]);
      setSelectedBank('');
      setAccountList([]);
      setSelectedAccount('');
    }
  }, [selectedPaymentMode, selectedFavourOf]);

  const loadBanks = async () => {
    setIsLoadingBanks(true);
    try {
      const banks = await getBankList({
        universityId: studentDetails?.universityid || 1,
        inFavourOf: selectedFavourOf,
        paymentMode: selectedPaymentMode,
      });
      setBankList(banks || []);
    } catch (error) {
      console.error('Error loading banks:', error);
      setBankList([]);
    } finally {
      setIsLoadingBanks(false);
    }
  };

  // Load accounts when bank is selected
  useEffect(() => {
    if (selectedBank && selectedPaymentMode && selectedFavourOf) {
      loadAccounts();
    } else {
      setAccountList([]);
      setSelectedAccount('');
    }
  }, [selectedBank]);

  const loadAccounts = async () => {
    setIsLoadingAccounts(true);
    try {
      const accounts = await getAccountList({
        universityId: studentDetails?.universityid || 1,
        inFavourOf: selectedFavourOf,
        paymentMode: selectedPaymentMode,
        bankName: selectedBank,
        collegeId: studentDetails?.collegeid || 1,
      });
      setAccountList(accounts || []);
    } catch (error) {
      console.error('Error loading accounts:', error);
      setAccountList([]);
    } finally {
      setIsLoadingAccounts(false);
    }
  };

  const handleSubmit = () => {
    // Validation
    if (!selectedPaymentMode) {
      alert('Please select a payment mode');
      return;
    }
    if (!selectedFavourOf || selectedFavourOf === '') {
      alert('Please select Favour Of');
      return;
    }
    if (!selectedBank) {
      alert('Please select a bank');
      return;
    }
    if (!selectedAccount) {
      alert('Please select an account');
      return;
    }

    // For Cheque/Draft, validate cheque number
    const paymentModeId = parseInt(selectedPaymentMode);
    if ((paymentModeId === 2 || paymentModeId === 3) && !chequeNo.trim()) {
      alert('Please enter cheque/draft number');
      return;
    }

    // Prepare payment data
    const paymentData = {
      paymentMode: selectedPaymentMode,
      paymentModeName: paymentModes.find(m => m.Id === parseInt(selectedPaymentMode))?.PaymentMode || '',
      favourOf: selectedFavourOf,
      favourOfName: favourOfList.find(f => f.Ids === parseInt(selectedFavourOf))?.FavourOfName || '',
      bank: selectedBank,
      account: selectedAccount,
      accountId: accountList.find(a => a.AccountNumber === selectedAccount)?.Id || '',
      waiver: selectedWaiver,
      waiverName: waiverList.find(w => w.Id === parseInt(selectedWaiver))?.Name || '',
      signatory: selectedSignatory,
      signatoryName: signatoryList.find(s => s.Id === parseInt(selectedSignatory))?.Name || '',
      chequeNo,
      chequeDate,
      transactionNo,
      remarks,
      amount,
    };

    onSubmit(paymentData);
  };

  const showChequeFields = selectedPaymentMode && (parseInt(selectedPaymentMode) === 2 || parseInt(selectedPaymentMode) === 3);

  return (
    <CCard className="border-0 shadow-sm rounded-4 mb-4">
      <CCardHeader className="fw-semibold bg-warning text-dark">
        💳 Offline Payment Details
      </CCardHeader>
      <CCardBody>
        <CRow className="g-3">
          {/* Payment Mode */}
          <CCol xs={12} md={6}>
            <label className="form-label fw-semibold">Payment Mode *</label>
            <CFormSelect
              value={selectedPaymentMode}
              onChange={(e) => {
                setSelectedPaymentMode(e.target.value);
                setChequeNo('');
                setTransactionNo('');
              }}
              className="shadow-sm"
            >
              <option value="">--Select Payment Mode--</option>
              {paymentModes.map((mode) => (
                <option key={mode.Id} value={mode.Id}>
                  {mode.PaymentMode}
                </option>
              ))}
            </CFormSelect>
          </CCol>

          {/* Favour Of */}
          <CCol xs={12} md={6}>
            <label className="form-label fw-semibold">In Favour Of *</label>
            <CFormSelect
              value={selectedFavourOf}
              onChange={(e) => setSelectedFavourOf(e.target.value)}
              className="shadow-sm"
            >
              <option value="">--Select Favour Of--</option>
              {favourOfList.map((favour) => (
                <option key={favour.Ids} value={favour.Ids}>
                  {favour.FavourOfName}
                </option>
              ))}
            </CFormSelect>
          </CCol>

          {/* Bank Name */}
          <CCol xs={12} md={6}>
            <label className="form-label fw-semibold">Bank Name *</label>
            <CFormSelect
              value={selectedBank}
              onChange={(e) => setSelectedBank(e.target.value)}
              disabled={!selectedPaymentMode || !selectedFavourOf || selectedFavourOf === '0' || isLoadingBanks}
              className="shadow-sm"
            >
              <option value="">
                {isLoadingBanks ? 'Loading banks...' : '--Select Bank--'}
              </option>
              {bankList.map((bank, idx) => (
                <option key={idx} value={bank.BankName}>
                  {bank.BankName}
                </option>
              ))}
            </CFormSelect>
          </CCol>

          {/* Account Number */}
          <CCol xs={12} md={6}>
            <label className="form-label fw-semibold">Account Number *</label>
            <CFormSelect
              value={selectedAccount}
              onChange={(e) => setSelectedAccount(e.target.value)}
              disabled={!selectedBank || isLoadingAccounts}
              className="shadow-sm"
            >
              <option value="">
                {isLoadingAccounts ? 'Loading accounts...' : '--Select Account--'}
              </option>
              {accountList.map((account) => (
                <option key={account.Id} value={account.AccountNumber}>
                  {account.AccountNumber}
                </option>
              ))}
            </CFormSelect>
          </CCol>

          {/* Cheque/Draft Number (conditional) */}
          {showChequeFields && (
            <>
              <CCol xs={12} md={6}>
                <label className="form-label fw-semibold">
                  {parseInt(selectedPaymentMode) === 2 ? 'Cheque' : 'Draft'} Number *
                </label>
                <CFormInput
                  type="text"
                  value={chequeNo}
                  onChange={(e) => setChequeNo(e.target.value)}
                  placeholder={`Enter ${parseInt(selectedPaymentMode) === 2 ? 'cheque' : 'draft'} number`}
                  className="shadow-sm"
                />
              </CCol>

              <CCol xs={12} md={6}>
                <label className="form-label fw-semibold">
                  {parseInt(selectedPaymentMode) === 2 ? 'Cheque' : 'Draft'} Date
                </label>
                <CFormInput
                  type="date"
                  value={chequeDate}
                  onChange={(e) => setChequeDate(e.target.value)}
                  className="shadow-sm"
                />
              </CCol>
            </>
          )}

          {/* Transaction Number */}
          <CCol xs={12} md={6}>
            <label className="form-label fw-semibold">Transaction Number</label>
            <CFormInput
              type="text"
              value={transactionNo}
              onChange={(e) => setTransactionNo(e.target.value)}
              placeholder="Enter transaction number (optional)"
              className="shadow-sm"
            />
          </CCol>

          {/* Waiver */}
          <CCol xs={12} md={6}>
            <label className="form-label fw-semibold">Waiver</label>
            <CFormSelect
              value={selectedWaiver}
              onChange={(e) => setSelectedWaiver(e.target.value)}
              className="shadow-sm"
            >
              {waiverList.map((waiver) => (
                <option key={waiver.Id} value={waiver.Id}>
                  {waiver.Name}
                </option>
              ))}
            </CFormSelect>
          </CCol>

          {/* Signatory */}
          <CCol xs={12} md={6}>
            <label className="form-label fw-semibold">Signatory</label>
            <CFormSelect
              value={selectedSignatory}
              onChange={(e) => setSelectedSignatory(e.target.value)}
              className="shadow-sm"
            >
              {signatoryList.map((signatory) => (
                <option key={signatory.Id} value={signatory.Id}>
                  {signatory.Name}
                </option>
              ))}
            </CFormSelect>
          </CCol>

          {/* Remarks */}
          <CCol xs={12}>
            <label className="form-label fw-semibold">Remarks</label>
            <CFormTextarea
              rows={3}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Enter any additional remarks..."
              className="shadow-sm"
            />
          </CCol>

          {/* Amount Display */}
          <CCol xs={12}>
            <div className="alert alert-info d-flex justify-content-between align-items-center">
              <span className="fw-semibold">Total Amount to Pay:</span>
              <span className="fs-4 fw-bold text-primary">₹ {amount.toFixed(2)}</span>
            </div>
          </CCol>

          {/* Submit Button */}
          <CCol xs={12}>
            <CButton
              color="success"
              size="lg"
              className="w-100 rounded-pill shadow"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" />
                  Processing Payment...
                </>
              ) : (
                <>
                  💰 Submit Offline Payment
                </>
              )}
            </CButton>
          </CCol>
        </CRow>
      </CCardBody>
    </CCard>
  );
};

export default OfflinePaymentForm;
