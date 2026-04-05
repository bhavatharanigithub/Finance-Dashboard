import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Receipt, Users, LogOut, Wallet,
  BarChart3, PiggyBank, TrendingUp, Settings, HelpCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ROLE_LABELS = {
  ROLE_ADMIN:   'Admin',
  ROLE_ANALYST: 'Analyst',
  ROLE_VIEWER:  'Viewer',
};

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const isAdmin   = user?.role === 'ROLE_ADMIN';
  const isAnalyst = user?.role === 'ROLE_ANALYST';

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <Wallet size={26} />
        <span className="nav-text">FinanceFlow</span>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-section-label nav-text">Main</div>

        <NavLink to="/" end className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
          <LayoutDashboard size={19} />
          <span className="nav-text">Dashboard</span>
        </NavLink>

        <NavLink to="/investments" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
          <TrendingUp size={19} />
          <span className="nav-text">Investments</span>
        </NavLink>

        {(isAnalyst || isAdmin) && (
          <>
            <div className="sidebar-section-label nav-text" style={{ marginTop: '0.5rem' }}>Analytics</div>
            <NavLink to="/records" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
              <Receipt size={19} />
              <span className="nav-text">Records</span>
            </NavLink>
            <NavLink to="/reports" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
              <BarChart3 size={19} />
              <span className="nav-text">Reports</span>
            </NavLink>
            <NavLink to="/budgets" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
              <PiggyBank size={19} />
              <span className="nav-text">Budgets</span>
            </NavLink>
          </>
        )}

        {isAdmin && (
          <>
            <div className="sidebar-section-label nav-text" style={{ marginTop: '0.5rem' }}>Administration</div>
            <NavLink to="/users" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
              <Users size={19} />
              <span className="nav-text">User Management</span>
            </NavLink>
          </>
        )}

        <div className="sidebar-footer">
          <NavLink to="/settings" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            <Settings size={19} />
            <span className="nav-text">Settings</span>
          </NavLink>
          <NavLink to="/help" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            <HelpCircle size={19} />
            <span className="nav-text">Help & Support</span>
          </NavLink>

          <div className="sidebar-user-card" style={{ marginTop: '0.75rem' }}>
            <div className="sidebar-user-label">Logged in as</div>
            <div className="sidebar-user-name">{user?.name || user?.username}</div>
            <div style={{
              fontSize: '0.68rem', fontWeight: 600, marginTop: '0.25rem',
              color: 'var(--primary)',
              background: 'var(--primary-light)',
              display: 'inline-block',
              padding: '0.1rem 0.5rem',
              borderRadius: '20px',
            }}>
              {ROLE_LABELS[user?.role] || user?.role}
            </div>
          </div>

          <button onClick={handleLogout} className="nav-link logout-btn">
            <LogOut size={19} />
            <span className="nav-text">Logout</span>
          </button>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
