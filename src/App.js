import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/Auth/LoginPage';
import SignupPage from './pages/Auth/SignupPage';
import OtpPage from './pages/Auth/OtpPage';
import DashboardPage from './pages/Auth/DashboardPage';
import { getToken } from './utils/auth.utils';

const PrivateRoute = ({ children }) => getToken() ? children : <Navigate to="/login" />;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<SignupPage />} />
        <Route path="/verify-otp" element={<OtpPage />} />
        <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
