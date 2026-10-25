import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser, fetchRoles } from '../../services/authService';
import './Auth.css';

const SignupPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', role_id: '' });
  const [roles, setRoles] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRoles().then((data) => setRoles(data.roles || []));
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const data = await registerUser({ ...form, role_id: Number(form.role_id) });
    setLoading(false);

    if (data.user) {
      navigate('/verify-otp', { state: { user_id: data.user.id } });
    } else {
      setError(data.message || 'Registration failed');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create Account</h2>
        {error && <p className="error-msg">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" name="name" value={form.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Phone (with country code, e.g. +91...)</label>
            <input type="text" name="phone" value={form.phone} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Role</label>
            <select name="role_id" value={form.role_id} onChange={handleChange} required>
              <option value="">Select role</option>
              {roles.map((r) => (
                <option key={r.id} value={r.id}>{r.role_name}</option>
              ))}
            </select>
          </div>
          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <div className="auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
