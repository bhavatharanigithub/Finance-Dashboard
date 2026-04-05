import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard } from 'lucide-react';

const ROLE_LABELS = {
  ROLE_ADMIN:   'Admin',
  ROLE_ANALYST: 'Analyst',
  ROLE_VIEWER:  'Viewer',
};

const Header = () => {
  const { user } = useAuth();
  const initials = (user?.name || user?.username || 'U')
    .split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  return (
    <header className="header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{
          background: 'var(--gradient)',
          color: 'white',
          padding: '0.5rem',
          borderRadius: '0.65rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 3px 10px rgba(117,143,190,0.30)',
        }}>
          <LayoutDashboard size={22} />
        </div>
        <h2 className="header-title">FinanceFlow</h2>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ textAlign: 'right' }}>
          <div className="user-name">{user?.name || user?.username}</div>
          <div className="user-role">{ROLE_LABELS[user?.role] || user?.role}</div>
        </div>
        <div className="user-avatar">{initials}</div>
      </div>
    </header>
  );
};

export default Header;
