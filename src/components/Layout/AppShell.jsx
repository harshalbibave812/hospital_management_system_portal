import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { getUser, logout } from '../../utils/auth.utils';
import './Layout.css';

const NAV_ITEMS = {
  Patient: [
    { label: 'Dashboard',  icon: '🏠', path: '/patient/dashboard' },
    { label: 'Profile',    icon: '👤', path: '/patient/profile' },
    { label: 'Appointments', icon: '📅', path: '/patient/appointments' },
    { label: 'Prescriptions', icon: '💊', path: '/patient/prescriptions' },
    { label: 'Reports',    icon: '📋', path: '/patient/reports' },
    { label: 'Payments',   icon: '💳', path: '/patient/payments' },
  ],
  Doctor: [
    { label: 'Dashboard',  icon: '🏠', path: '/doctor/dashboard' },
    { label: 'My Patients', icon: '🧑‍⚕️', path: '/doctor/patients' },
    { label: 'Schedule',   icon: '📅', path: '/doctor/schedule' },
  ],
  Admin: [
    { label: 'Dashboard',  icon: '🏠', path: '/admin/dashboard' },
    { label: 'Users',      icon: '👥', path: '/admin/users' },
    { label: 'Departments', icon: '🏥', path: '/admin/departments' },
  ],
};

const AppShell = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const user = getUser();
  const navItems = NAV_ITEMS[user?.role_name] || [];
  const initials = user?.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="hms-shell">
      {/* ── Header ── */}
      <header className="hms-header">
        <div className="hms-header__left">
          <button className="hms-hamburger" onClick={() => setCollapsed(p => !p)} aria-label="Toggle sidebar">
            <span /><span /><span />
          </button>
          <a className="hms-logo" href="/">
            <div className="hms-logo__icon">HMS</div>
            <div>
              <div className="hms-logo__text">MediCare HMS</div>
              <span className="hms-logo__sub">Hospital Management</span>
            </div>
          </a>
        </div>
        <div className="hms-header__right">
          <div className="hms-header__user">
            <div className="hms-header__avatar">{initials}</div>
            <div>
              <div className="hms-header__name">{user?.name}</div>
              <div className="hms-header__role">{user?.role_name}</div>
            </div>
          </div>
          <button className="hms-btn-logout" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <div className="hms-body">
        {/* ── Sidebar ── */}
        <aside className={`hms-sidebar${collapsed ? ' collapsed' : ''}`}>
          <div className="hms-sidebar__section-label">Navigation</div>
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `hms-nav-item${isActive ? ' active' : ''}`}
            >
              <span className="hms-nav-item__icon">{item.icon}</span>
              <span className="hms-nav-item__label">{item.label}</span>
            </NavLink>
          ))}
        </aside>

        {/* ── Main ── */}
        <main className={`hms-main${collapsed ? ' expanded' : ''}`}>
          {children}
        </main>
      </div>

      {/* ── Footer ── */}
      <footer className="hms-footer">
        <span className="hms-footer__copy">© {new Date().getFullYear()} MediCare HMS. All rights reserved.</span>
        <div className="hms-footer__links">
          <a href="/privacy">Privacy Policy</a>
          <a href="/terms">Terms of Use</a>
          <a href="/support">Support</a>
        </div>
      </footer>
    </div>
  );
};

export default AppShell;
