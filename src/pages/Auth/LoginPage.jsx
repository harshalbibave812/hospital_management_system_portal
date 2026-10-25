import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../../services/authService';
import { saveToken, saveUser } from '../../utils/auth.utils';
import './Auth.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const data = await loginUser(form);
    setLoading(false);

    if (data.token) {
      saveToken(data.token);
      saveUser(data.user);
      navigate('/dashboard');
    } else if (data.user_id) {
      // Not verified — go to OTP
      navigate('/verify-otp', { state: { user_id: data.user_id } });
    } else {
      setError(data.message || 'Login failed');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>HMS Login</h2>
        {error && <p className="error-msg">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} required />
          </div>
          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <div className="auth-footer">
          New user? <Link to="/register">Register here</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
