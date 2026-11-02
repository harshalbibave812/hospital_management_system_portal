import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import LoginPage       from './pages/Auth/LoginPage';
import SignupPage      from './pages/Auth/SignupPage';
import OtpPage         from './pages/Auth/OtpPage';
import PatientDashboard from './pages/Patient/PatientDashboard';
import PatientProfile   from './pages/Patient/PatientProfile';

import { getToken, getUser, getRoleDashboard } from './utils/auth.utils';

// Redirect to role-specific dashboard after login
const RoleRedirect = () => {
  const user = getUser();
  if (!user) return <Navigate to="/login" />;
  if (user.role_name === 'Patient') return <Navigate to="/patient/dashboard" />;
  if (user.role_name === 'Doctor')  return <Navigate to="/doctor/dashboard" />;
  if (user.role_name === 'Admin')   return <Navigate to="/admin/dashboard" />;
  return <Navigate to="/login" />;
};

// Guard: must be logged in
const PrivateRoute = ({ children }) =>
  getToken() ? children : <Navigate to="/login" />;

// Guard: must be logged in with specific role
const RoleRoute = ({ role, children }) => {
  const user = getUser();
  if (!getToken() || !user) return <Navigate to="/login" replace />;
  if (user.role_name !== role) return <Navigate to="/" replace />;
  return children;
};

// Redirect away from login/register if already authenticated
const GuestRoute = ({ children }) => {
  const user = getUser();
  if (getToken() && user) return <Navigate to={getRoleDashboard(user.role_name)} replace />;
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={3500} hideProgressBar={false} newestOnTop closeOnClick pauseOnHover />
      <Routes>
        <Route path="/"              element={<PrivateRoute><RoleRedirect /></PrivateRoute>} />
        <Route path="/login"         element={<GuestRoute><LoginPage /></GuestRoute>} />
        <Route path="/register"      element={<GuestRoute><SignupPage /></GuestRoute>} />
        <Route path="/verify-otp"    element={<OtpPage />} />

        {/* ── Patient Module ── */}
        <Route path="/patient/dashboard" element={<RoleRoute role="Patient"><PatientDashboard /></RoleRoute>} />
        <Route path="/patient/profile"   element={<RoleRoute role="Patient"><PatientProfile /></RoleRoute>} />

        {/* ── Placeholder routes for future modules ── */}
        <Route path="/doctor/*" element={<PrivateRoute><div style={{padding:'2rem'}}>Doctor module coming soon</div></PrivateRoute>} />
        <Route path="/admin/*"  element={<PrivateRoute><div style={{padding:'2rem'}}>Admin module coming soon</div></PrivateRoute>} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
