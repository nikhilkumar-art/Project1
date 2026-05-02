import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Navigate } from 'react-router-dom';
import { ShieldAlert, LogIn, Mail, Send } from 'lucide-react';
import './Auth.css';

const Auth = () => {
  const [activeTab, setActiveTab] = useState('user'); // 'user' or 'admin'
  const [userEmail, setUserEmail] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  
  // OTP Flow States
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, loginWithGoogle, sendOTP, verifyOTP, user } = useAuth();
  const navigate = useNavigate();

  // If already logged in, redirect based on role
  if (user) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/my-reports'} />;
  }

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setError('');
    const res = await login(adminEmail, adminPassword);
    if (res.success) {
      navigate('/admin');
    } else {
      setError(res.message);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    const res = await loginWithGoogle();
    if (res.success) {
      navigate('/');
    } else {
      setError(res.message);
    }
    setLoading(false);
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!userEmail) return setError("Please enter your email.");
    setError('');
    setMsg('');
    setLoading(true);
    
    const res = await sendOTP(userEmail);
    if (res.success) {
      setOtpSent(true);
      setMsg(res.message);
    } else {
      setError(res.message);
    }
    setLoading(false);
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');
    const res = await verifyOTP(userEmail, otpCode);
    if (res.success) {
      navigate('/');
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="auth-page animate-fade-in flex items-center justify-center">
      <div className="auth-card card">
        <div className="auth-header text-center mb-6">
          <div className="brand-icon-wrapper mx-auto mb-4" style={{ width: '64px', height: '64px' }}>
            <ShieldAlert size={32} className="text-white" />
          </div>
          <h2>Authentication</h2>
        </div>

        <div className="auth-tabs flex mb-6">
          <button 
            className={`tab-btn flex-1 py-2 ${activeTab === 'user' ? 'active' : ''}`}
            onClick={() => { setActiveTab('user'); setError(''); setMsg(''); }}
          >
            User Login
          </button>
          <button 
            className={`tab-btn flex-1 py-2 ${activeTab === 'admin' ? 'active' : ''}`}
            onClick={() => { setActiveTab('admin'); setError(''); setMsg(''); }}
          >
            Admin Portal
          </button>
        </div>

        {error && <div className="error-message mb-4">{error}</div>}
        {msg && <div className="success-message mb-4" style={{color: 'var(--accent-primary)', textAlign: 'center'}}>{msg}</div>}

        {activeTab === 'admin' ? (
          <form onSubmit={handleAdminLogin} className="auth-form">
            <div className="form-group">
              <label className="form-label">Admin Email</label>
              <input 
                type="email" 
                className="form-input" 
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="asif@admin.com"
                required 
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input 
                type="password" 
                className="form-input" 
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="••••••••"
                required 
              />
            </div>
            <button type="submit" className="btn btn-primary w-full mt-2 flex justify-center gap-2">
              <LogIn size={18} /> Admin Login
            </button>
          </form>
        ) : (
          <div className="auth-user-section">
            <button 
              onClick={handleGoogleLogin} 
              disabled={loading}
              className="btn btn-secondary w-full mb-4 flex justify-center gap-2"
              style={{ backgroundColor: 'white', color: 'black' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Continue with Google
            </button>
            
            {!otpSent ? (
              <form onSubmit={handleSendOTP} className="auth-form">
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input 
                    type="email" 
                    className="form-input" 
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    placeholder="Enter your email"
                    required 
                  />
                </div>
                <button type="submit" disabled={loading} className="btn btn-primary w-full mt-2 flex justify-center gap-2">
                  <Mail size={18} /> {loading ? 'Sending...' : 'Send 6-Digit OTP'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOTP} className="auth-form">
                <div className="form-group">
                  <label className="form-label">Enter 6-Digit OTP sent to {userEmail}</label>
                  <input 
                    type="text" 
                    className="form-input text-center" 
                    style={{ letterSpacing: '0.5em', fontSize: '1.25rem' }}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="------"
                    maxLength="6"
                    required 
                  />
                </div>
                <button type="submit" className="btn btn-primary w-full mt-2 flex justify-center gap-2">
                  <Send size={18} /> Verify & Login
                </button>
                <button 
                  type="button" 
                  onClick={() => setOtpSent(false)} 
                  className="btn btn-secondary w-full mt-2"
                >
                  Back
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Auth;
