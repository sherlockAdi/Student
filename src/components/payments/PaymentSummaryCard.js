import React from "react";

const formatCurrency = (value = 0) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(value);

const PaymentSummaryCard = ({
  amount,
  onPay,
  isPaying,
  selectedCount,
  totalCount,
  paymentStatus,
}) => {
  const disabled = isPaying || !amount || amount <= 0;

  return (
    <div className="card shadow-lg border-0 mb-5">
      <div
        className="card-header d-flex flex-column flex-md-row align-items-md-center justify-content-between"
        style={{
          background: "linear-gradient(135deg, #1d976c 0%, #93f9b9 100%)",
          color: "#0b3d2e",
          border: "none",
        }}
      >
        <div>
          <h5 className="fw-bold mb-1">💳 Payment Overview</h5>
          <div className="fw-semibold">
            {selectedCount > 0
              ? `${selectedCount} of ${totalCount} fee heads selected`
              : "No specific fee heads selected. Paying total outstanding amount."}
          </div>
        </div>
        <div className="text-md-end mt-3 mt-md-0">
          <div className="fw-semibold text-dark opacity-75">Payable Amount</div>
          <div className="display-6 fw-bold mb-0" style={{ color: "#0b3d2e" }}>
            {formatCurrency(amount)}
          </div>
        </div>
      </div>
      <div className="card-body p-4">
        <div className="row g-4 align-items-center">
          <div className="col-md-8">
            <ol className="mb-0 ps-3 text-muted">
              <li className="mb-2">
                <strong>Secure gateway:</strong> Payment powered by Razorpay with encrypted transaction flow.
              </li>
              <li className="mb-2">
                <strong>Automatic reconciliation:</strong> Reference IDs are captured for future accounting.
              </li>
              <li className="mb-0">
                <strong>Instant confirmation:</strong> Successful payments will update the dashboard in real-time.
              </li>
            </ol>
          </div>
          <div className="col-md-4 text-md-end">
            <button
              type="button"
              className="btn btn-lg fw-semibold w-100"
              onClick={onPay}
              disabled={disabled}
              style={{
                background: "linear-gradient(135deg, #1d976c 0%, #93f9b9 100%)",
                color: "#0b3d2e",
                border: "none",
                boxShadow: "0 10px 30px rgba(29, 151, 108, 0.3)",
              }}
            >
              {isPaying ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                  Initialising Gateway...
                </>
              ) : (
                <>Proceed to Pay</>
              )}
            </button>
            <div className="small text-muted mt-2">
              By continuing you agree to our payment terms and policies.
            </div>
          </div>
        </div>

        {paymentStatus && (
          <div
            className={`alert mt-4 ${
              paymentStatus.type === "success" ? "alert-success" : "alert-danger"
            }`}
            role="alert"
          >
            {paymentStatus.type === "success" ? (
              <>
                <div className="fw-bold mb-1">Payment Successful ✅</div>
                <div className="small text-break">
                  Payment ID: {paymentStatus.response.razorpay_payment_id}
                </div>
                {paymentStatus.response.razorpay_order_id && (
                  <div className="small text-break">
                    Order ID: {paymentStatus.response.razorpay_order_id}
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="fw-bold mb-1">Payment Failed ❌</div>
                <div className="small text-break">{paymentStatus.message}</div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSummaryCard;
