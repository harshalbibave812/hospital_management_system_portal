import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser, logout } from '../../utils/auth.utils';

const DashboardPage = () => {
  const navigate = useNavigate();
  const user = getUser();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h2>Welcome, {user?.name}</h2>
      <p>Role: <strong>{user?.role_name}</strong></p>
      <button onClick={handleLogout} style={{ padding: '0.5rem 1.5rem', cursor: 'pointer' }}>
        Logout
      </button>
    </div>
  );
};

export default DashboardPage;
