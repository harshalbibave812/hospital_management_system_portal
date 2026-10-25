import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { sendOtp, verifyOtp } from '../../services/authService';
import { saveToken, saveUser } from '../../utils/auth.utils';
import './Auth.css';

const OtpPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user_id = location.state?.user_id;

  const [method, setMethod] = useState('email');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  if (!user_id) {
    navigate('/login');
    return null;
  }

  const handleSendOtp = async () => {
    setError('');
    setLoading(true);
    const data = await sendOtp({ user_id, method });
    setLoading(false);
    if (data.message && !data.errors) {
      setOtpSent(true);
      setSuccess(data.message);
    } else {
      setError(data.message || 'Failed to send OTP');
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const data = await verifyOtp({ user_id, otp });
    setLoading(false);

    if (data.token) {
      saveToken(data.token);
      saveUser(data.user);
      navigate('/dashboard');
    } else {
      setError(data.message || 'OTP verification failed');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Verify OTP</h2>
        {error && <p className="error-msg">{error}</p>}
        {success && <p className="success-msg">{success}</p>}

        {!otpSent ? (
          <div>
            <div className="form-group">
              <label>Send OTP via</label>
              <select value={method} onChange={(e) => setMethod(e.target.value)}>
                <option value="email">Email</option>
                <option value="phone">Phone (SMS)</option>
              </select>
            </div>
            <button className="btn-primary" onClick={handleSendOtp} disabled={loading}>
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </div>
        ) : (
          <form onSubmit={handleVerify}>
            <div className="form-group">
              <label>Enter 6-digit OTP</label>
              <input
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="______"
                required
              />
            </div>
            <button className="btn-primary" type="submit" disabled={loading}>
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
            <button
              type="button"
              className="btn-primary"
              style={{ background: '#555', marginTop: '0.5rem' }}
              onClick={() => { setOtpSent(false); setSuccess(''); setOtp(''); }}
            >
              Resend OTP
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default OtpPage;
