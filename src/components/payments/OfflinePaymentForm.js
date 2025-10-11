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
  isSubmitting = false,
  showWaiverSection = false,
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
  const [draftNo, setDraftNo] = useState('');
  const [draftDate, setDraftDate] = useState(today);
  const [branchName, setBranchName] = useState('');
  const [bankNameField, setBankNameField] = useState(''); // For Draft/Cheque Bank Name field
  const [cardNo, setCardNo] = useState('');
  const [cardAmount, setCardAmount] = useState('');
  const [transactionNo, setTransactionNo] = useState('');
  const [remarks, setRemarks] = useState('');

  // New Offline meta fields
  const [dataEntryBy, setDataEntryBy] = useState('Aditya');
  const [collectedBy, setCollectedBy] = useState('Abshiedk');
  const [handoverTo, setHandoverTo] = useState('Shameena');

  // Waiver attachment
  const [waiverAttachmentName, setWaiverAttachmentName] = useState('');
  const [waiverAttachmentBase64, setWaiverAttachmentBase64] = useState('');

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
    
    const paymentModeId = parseInt(selectedPaymentMode);
    const paymentModeName = paymentModes.find(m => m.Id === paymentModeId)?.PaymentMode || '';
    
    // For Swap Machine, bank and account are optional
    if (paymentModeName.toLowerCase() !== 'swap machine' && paymentModeName.toLowerCase() !== 'swipe machine') {
      if (!selectedBank) {
        alert('Please select a bank');
        return;
      }
      if (!selectedAccount) {
        alert('Please select an account');
        return;
      }
    }

    // Validate based on payment mode
    if (paymentModeName.toLowerCase() === 'cheque') {
      if (!chequeNo.trim()) {
        alert('Please enter cheque number');
        return;
      }
      if (!bankNameField.trim()) {
        alert('Please enter bank name');
        return;
      }
      if (!branchName.trim()) {
        alert('Please enter branch name');
        return;
      }
    } else if (paymentModeName.toLowerCase() === 'draft') {
      if (!draftNo.trim()) {
        alert('Please enter draft number');
        return;
      }
      if (!bankNameField.trim()) {
        alert('Please enter bank name');
        return;
      }
      if (!branchName.trim()) {
        alert('Please enter branch name');
        return;
      }
    } else if (paymentModeName.toLowerCase() === 'swap machine' || paymentModeName.toLowerCase() === 'swipe machine') {
      if (!cardNo.trim()) {
        alert('Please enter credit/debit card number');
        return;
      }
      if (!cardAmount || parseFloat(cardAmount) <= 0) {
        alert('Please enter a valid amount');
        return;
      }
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
      draftNo,
      draftDate,
      branchName,
      bankNameField,
      cardNo,
      cardAmount,
      transactionNo,
      remarks,
      // New fields
      dataEntryBy,
      collectedBy,
      handoverTo,
      waiverAttachmentName,
      waiverAttachmentBase64,
      amount,
    };

    onSubmit(paymentData);
  };

  // Determine which fields to show based on payment mode
  const paymentModeName = selectedPaymentMode 
    ? paymentModes.find(m => m.Id === parseInt(selectedPaymentMode))?.PaymentMode || ''
    : '';
  const paymentModeNameLower = paymentModeName.toLowerCase();
  
  const showChequeFields = paymentModeNameLower === 'cheque';
  const showDraftFields = paymentModeNameLower === 'draft';
  const showSwapFields = paymentModeNameLower === 'swap machine' || paymentModeNameLower === 'swipe machine';
  const showBankFields = !showSwapFields; // Show bank/account for all except Swap Machine

  return (
    <CCard className="border-0 shadow-sm rounded-4 mb-4">
      <CCardHeader className="fw-semibold bg-warning text-dark">
        💳 Offline Payment Details
      </CCardHeader>
      <CCardBody>
        <CRow className="g-3">
          {/* Section: Collection Meta */}
          <CCol xs={12}>
            <div className="fw-bold text-uppercase small text-muted">Collection Meta</div>
          </CCol>
          <CCol xs={12} md={4}>
            <label className="form-label fw-semibold">Data Entry Operator</label>
            <CFormInput
              type="text"
              value={dataEntryBy}
              onChange={(e) => setDataEntryBy(e.target.value)}
              placeholder="Enter data entry operator"
              className="shadow-sm"
            />
          </CCol>
          <CCol xs={12} md={4}>
            <label className="form-label fw-semibold">Collected By</label>
            <CFormInput
              type="text"
              value={collectedBy}
              onChange={(e) => setCollectedBy(e.target.value)}
              placeholder="Enter collector name"
              className="shadow-sm"
            />
          </CCol>
          <CCol xs={12} md={4}>
            <label className="form-label fw-semibold">Handover To</label>
            <CFormInput
              type="text"
              value={handoverTo}
              onChange={(e) => setHandoverTo(e.target.value)}
              placeholder="Enter handover person"
              className="shadow-sm"
            />
          </CCol>

          {/* Section: Payment Details */}
          <CCol xs={12} className="mt-2">
            <div className="fw-bold text-uppercase small text-muted">Payment Details</div>
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
           <CCol xs={12} md={6}>
            <label className="form-label fw-semibold">Payment Mode *</label>
            <CFormSelect
              value={selectedPaymentMode}
              onChange={(e) => {
                setSelectedPaymentMode(e.target.value);
                // Reset all payment mode specific fields
                setChequeNo('');
                setDraftNo('');
                setBranchName('');
                setBankNameField('');
                setCardNo('');
                setCardAmount('');
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

          {/* Bank Name - Show for all except Swap Machine */}
          {showBankFields && (
            <CCol xs={12} md={6}>
              <label className="form-label fw-semibold">Deposit Bank *</label>
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
          )}

          {/* Account Number - Show for all except Swap Machine */}
          {showBankFields && (
            <CCol xs={12} md={6}>
              <label className="form-label fw-semibold">Account No. *</label>
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
          )}

          {/* Draft Fields */}
          {showDraftFields && (
            <>
              <CCol xs={12} md={6}>
                <label className="form-label fw-semibold">Bank Name *</label>
                <CFormInput
                  type="text"
                  value={bankNameField}
                  onChange={(e) => setBankNameField(e.target.value)}
                  placeholder="Enter bank name"
                  className="shadow-sm"
                />
              </CCol>

              <CCol xs={12} md={6}>
                <label className="form-label fw-semibold">Branch Name *</label>
                <CFormInput
                  type="text"
                  value={branchName}
                  onChange={(e) => setBranchName(e.target.value)}
                  placeholder="Enter branch name"
                  className="shadow-sm"
                />
              </CCol>

              <CCol xs={12} md={6}>
                <label className="form-label fw-semibold">Draft No. *</label>
                <CFormInput
                  type="text"
                  value={draftNo}
                  onChange={(e) => setDraftNo(e.target.value)}
                  placeholder="Enter draft number"
                  className="shadow-sm"
                />
              </CCol>

              <CCol xs={12} md={6}>
                <label className="form-label fw-semibold">Draft Date *</label>
                <CFormInput
                  type="date"
                  value={draftDate}
                  onChange={(e) => setDraftDate(e.target.value)}
                  className="shadow-sm"
                />
              </CCol>
            </>
          )}

          {/* Cheque Fields */}
          {showChequeFields && (
            <>
              <CCol xs={12} md={6}>
                <label className="form-label fw-semibold">Bank Name *</label>
                <CFormInput
                  type="text"
                  value={bankNameField}
                  onChange={(e) => setBankNameField(e.target.value)}
                  placeholder="Enter bank name"
                  className="shadow-sm"
                />
              </CCol>

              <CCol xs={12} md={6}>
                <label className="form-label fw-semibold">Branch Name *</label>
                <CFormInput
                  type="text"
                  value={branchName}
                  onChange={(e) => setBranchName(e.target.value)}
                  placeholder="Enter branch name"
                  className="shadow-sm"
                />
              </CCol>

              <CCol xs={12} md={6}>
                <label className="form-label fw-semibold">Cheque No. *</label>
                <CFormInput
                  type="text"
                  value={chequeNo}
                  onChange={(e) => setChequeNo(e.target.value)}
                  placeholder="Enter cheque number"
                  className="shadow-sm"
                />
              </CCol>

              <CCol xs={12} md={6}>
                <label className="form-label fw-semibold">Cheque Date *</label>
                <CFormInput
                  type="date"
                  value={chequeDate}
                  onChange={(e) => setChequeDate(e.target.value)}
                  className="shadow-sm"
                />
              </CCol>
            </>
          )}

          {/* Swap Machine Fields */}
          {showSwapFields && (
            <>
              <CCol xs={12} md={6}>
                <label className="form-label fw-semibold">Deposit Bank</label>
                <CFormSelect
                  value={selectedBank}
                  onChange={(e) => setSelectedBank(e.target.value)}
                  className="shadow-sm"
                >
                  <option value="">--Select Bank--</option>
                  {bankList.map((bank, idx) => (
                    <option key={idx} value={bank.BankName}>
                      {bank.BankName}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>

              <CCol xs={12} md={6}>
                <label className="form-label fw-semibold">Account No.</label>
                <CFormSelect
                  value={selectedAccount}
                  onChange={(e) => setSelectedAccount(e.target.value)}
                  disabled={!selectedBank}
                  className="shadow-sm"
                >
                  <option value="">--Select Account--</option>
                  {accountList.map((account) => (
                    <option key={account.Id} value={account.AccountNumber}>
                      {account.AccountNumber}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>

              <CCol xs={12} md={6}>
                <label className="form-label fw-semibold">Credit/Debit Card No. *</label>
                <CFormInput
                  type="text"
                  value={cardNo}
                  onChange={(e) => setCardNo(e.target.value)}
                  placeholder="Enter card number"
                  className="shadow-sm"
                  maxLength="16"
                />
              </CCol>

              <CCol xs={12} md={6}>
                <label className="form-label fw-semibold">Amount *</label>
                <CFormInput
                  type="number"
                  value={cardAmount}
                  onChange={(e) => setCardAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="shadow-sm"
                  min="0"
                  step="0.01"
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

          {/* Section: Waiver (conditional) */}
          {showWaiverSection && (
            <>
              <CCol xs={12}>
                <div className="fw-bold text-uppercase small text-muted">Waiver</div>
              </CCol>
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
              <CCol xs={12} md={6}>
                <label className="form-label fw-semibold">Waiver Attachment</label>
                <CFormInput
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) {
                      setWaiverAttachmentName('');
                      setWaiverAttachmentBase64('');
                      return;
                    }
                    setWaiverAttachmentName(file.name);
                    const reader = new FileReader();
                    reader.onload = () => {
                      const result = reader.result;
                      if (typeof result === 'string') {
                        // Strip prefix if present
                        const base64 = result.includes(',') ? result.split(',')[1] : result;
                        setWaiverAttachmentBase64(base64);
                      }
                    };
                    reader.readAsDataURL(file);
                  }}
                  className="shadow-sm"
                />
                {waiverAttachmentName && (
                  <div className="small text-muted mt-1">Selected: {waiverAttachmentName}</div>
                )}
              </CCol>
            </>
          )}

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
