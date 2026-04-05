import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useAuth } from '../context/AuthContext';

// Role-based route access map
const ROUTE_ROLES = {
  '/records':     ['ROLE_ANALYST', 'ROLE_ADMIN'],
  '/reports':     ['ROLE_ANALYST', 'ROLE_ADMIN'],
  '/budgets':     ['ROLE_ANALYST', 'ROLE_ADMIN'],
  '/users':       ['ROLE_ADMIN'],
};

const Layout = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return (
    <div className="loader-container" style={{ height: '100vh' }}>
      <div className="loader" />
    </div>
  );

  if (!user) return <Navigate to="/login" replace />;

  // Check role-based access
  const requiredRoles = ROUTE_ROLES[location.pathname];
  if (requiredRoles && !requiredRoles.includes(user.role)) {
    return (
      <div className="dashboard-layout">
        <Header />
        <Sidebar />
        <main className="main-content">
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', height: '60vh', gap: '1rem', textAlign: 'center',
          }}>
            <div style={{
              width: 70, height: 70, borderRadius: '50%',
              background: 'var(--coral-light)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '2rem',
            }}>🔒</div>
            <h2 style={{ color: 'var(--text)', fontSize: '1.5rem', fontWeight: 700 }}>Access Restricted</h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: 380 }}>
              Your current role (<strong style={{ color: 'var(--coral)' }}>{user.role.replace('ROLE_', '')}</strong>) doesn't have permission to view this page.
              Please contact an administrator to request access.
            </p>
            <a href="/" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>← Back to Dashboard</a>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <Header />
      <Sidebar />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
