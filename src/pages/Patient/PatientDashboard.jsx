import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import { toast } from 'react-toastify';
import AppShell from '../../components/Layout/AppShell';
import { getDashboard } from '../../services/patientService';

const STAT_CARDS = [
  { key: 'upcomingAppointments',  label: 'Upcoming Appointments',  icon: '📅', color: 'green'  },
  { key: 'completedAppointments', label: 'Completed Appointments', icon: '✅', color: 'navy'   },
  { key: 'prescriptions',         label: 'Prescriptions',          icon: '💊', color: 'blue'   },
  { key: 'medicalReports',        label: 'Medical Reports',        icon: '📋', color: 'orange' },
  { key: 'pendingPayments',       label: 'Pending Payments',       icon: '💳', color: 'red'    },
];

const PIE_COLORS = ['#00A651','#1B2A4A','#0288D1','#F57C00','#D32F2F','#7B1FA2'];

const PatientDashboard = () => {
  const [stats, setStats]  = useState({});
  const [apptChart, setApptChart]  = useState([]);
  const [deptChart, setDeptChart]  = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboard()
      .then((data) => {
        setStats(data.stats);
        setApptChart(data.appointmentsChart);
        setDeptChart(data.departmentsChart);
      })
      .catch(() => toast.error('Failed to load dashboard data'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AppShell>
      <div className="hms-page-header">
        <h1>Patient Dashboard</h1>
        <div className="hms-breadcrumb">Home &rsaquo; <span>Dashboard</span></div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="hms-stats-grid">
        {STAT_CARDS.map(({ key, label, icon, color }) => (
          <div className="hms-stat-card" key={key}>
            <div className={`hms-stat-card__icon ${color}`}>{icon}</div>
            <div>
              <div className="hms-stat-card__value">
                {loading ? '—' : (stats[key] ?? 0)}
              </div>
              <div className="hms-stat-card__label">{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Charts ── */}
      <div className="hms-charts-grid">
        <div className="hms-card">
          <div className="hms-card__title">Appointments This Month</div>
          {apptChart.length === 0 && !loading
            ? <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '1rem' }}>No appointments this month.</p>
            : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={apptChart} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                  <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#00A651" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
        </div>

        <div className="hms-card">
          <div className="hms-card__title">Consultations by Department</div>
          {deptChart.length === 0 && !loading
            ? <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '1rem' }}>No consultation data available.</p>
            : (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={deptChart} dataKey="count" nameKey="department"
                    cx="50%" cy="50%" outerRadius={80} label={({ department, percent }) =>
                      `${department} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {deptChart.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend iconSize={10} wrapperStyle={{ fontSize: '0.75rem' }} />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
        </div>
      </div>
    </AppShell>
  );
};

export default PatientDashboard;
