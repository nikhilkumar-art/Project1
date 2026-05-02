import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CreditCard, Lock, CheckCircle, ArrowLeft } from 'lucide-react';
import './Payment.css';

const Payment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handlePayment = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
    }, 1500);
  };

  if (isSuccess) {
    return (
      <div className="payment-page animate-fade-in">
        <div className="success-card card text-center">
          <div className="success-icon-wrapper">
            <CheckCircle size={64} className="text-success" />
          </div>
          <h2>Payment Successful!</h2>
          <p className="text-secondary mt-4 mb-8">
            Your payment for Fine Reference <strong>{id}</strong> has been processed successfully. 
            A receipt has been sent to your email.
          </p>
          <button className="btn btn-primary" onClick={() => navigate('/fines')}>
            Back to Fines
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-page animate-fade-in">
      <button className="btn btn-secondary mb-4" onClick={() => navigate(-1)}>
        <ArrowLeft size={16} /> Back
      </button>
      
      <div className="page-header text-left mb-6">
        <h1>Secure Payment</h1>
        <p className="text-secondary">Complete your penalty payment securely.</p>
      </div>

      <div className="payment-container">
        <div className="summary-card card mb-6">
          <div className="card-header">
            <h3 className="m-0">Fine Summary</h3>
          </div>
          <div className="card-body">
            <div className="summary-row flex justify-between mb-4">
              <span className="text-secondary">Reference Number</span>
              <span className="font-semibold">{id}</span>
            </div>
            <div className="summary-row flex justify-between mb-4">
              <span className="text-secondary">Violation Type</span>
              <span>Speeding</span>
            </div>
            <div className="summary-row flex justify-between pt-4 border-t">
              <span className="text-lg font-bold">Total Amount</span>
              <span className="text-xl font-bold text-danger">₹1500</span>
            </div>
          </div>
        </div>

        <div className="checkout-card card">
          <div className="card-header flex items-center gap-2">
            <Lock size={18} className="text-secondary" />
            <h3 className="m-0">Payment Details</h3>
          </div>
          <div className="card-body">
            <form onSubmit={handlePayment}>
              <div className="form-group">
                <label className="form-label">Cardholder Name</label>
                <input type="text" className="form-input" required placeholder="John Doe" />
              </div>
              
              <div className="form-group">
                <label className="form-label">Card Number</label>
                <div className="card-input-wrapper relative">
                  <CreditCard size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary" />
                  <input type="text" className="form-input pl-10" required placeholder="0000 0000 0000 0000" maxLength="19" />
                </div>
              </div>

              <div className="form-row flex gap-4">
                <div className="form-group flex-1">
                  <label className="form-label">Expiry (MM/YY)</label>
                  <input type="text" className="form-input" required placeholder="MM/YY" maxLength="5" />
                </div>
                <div className="form-group flex-1">
                  <label className="form-label">CVV</label>
                  <input type="password" className="form-input" required placeholder="123" maxLength="3" />
                </div>
              </div>

              <button 
                type="submit" 
                className={`btn btn-primary w-full mt-4 flex justify-center items-center gap-2 ${isProcessing ? 'opacity-75 cursor-wait' : ''}`}
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : `Pay ₹1500 Securely`}
                {!isProcessing && <Lock size={16} />}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
