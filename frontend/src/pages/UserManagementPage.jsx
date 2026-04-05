import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { Users, Trash2, Shield, User as UserIcon, ChevronDown, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ROLES = ['ROLE_VIEWER', 'ROLE_ANALYST', 'ROLE_ADMIN'];
const STATUSES = ['ACTIVE', 'INACTIVE'];

const roleBadge = {
  ROLE_ADMIN:   { label: 'Admin',   bg: 'rgba(117,143,190,0.12)', color: '#5a72a3', border: 'rgba(117,143,190,0.35)' },
  ROLE_ANALYST: { label: 'Analyst', bg: 'rgba(214,193,128,0.15)', color: '#92611a', border: 'rgba(214,193,128,0.40)' },
  ROLE_VIEWER:  { label: 'Viewer',  bg: 'rgba(34,197,94,0.10)',   color: '#15803d', border: 'rgba(34,197,94,0.30)'   },
};

const statusBadge = {
  ACTIVE:   { label: 'Active',   icon: <CheckCircle size={12} />, color: '#15803d' },
  INACTIVE: { label: 'Inactive', icon: <XCircle size={12} />,    color: '#b91c1c' },
};

const UserManagementPage = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState({});

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (err) {
      console.error('Error fetching users', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (id, newRole) => {
    setSaving(prev => ({ ...prev, [id]: true }));
    try {
      const res = await api.put(`/users/${id}/role`, { role: newRole });
      setUsers(prev => prev.map(u => u.id === id ? { ...u, role: res.data.role } : u));
    } catch (err) {
      alert('Failed to update role.');
    } finally {
      setSaving(prev => ({ ...prev, [id]: false }));
    }
  };

  const handleStatusToggle = async (u) => {
    const newStatus = u.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    setSaving(prev => ({ ...prev, [u.id]: true }));
    try {
      const res = await api.put(`/users/${u.id}/status`, { status: newStatus });
      setUsers(prev => prev.map(x => x.id === u.id ? { ...x, status: res.data.status } : x));
    } catch (err) {
      alert('Failed to update status.');
    } finally {
      setSaving(prev => ({ ...prev, [u.id]: false }));
    }
  };

  const handleDelete = async (id) => {
    if (id === currentUser?.id) return alert('You cannot delete your own account.');
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.delete(`/users/${id}`);
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch (err) {
      alert('Failed to delete user.');
    }
  };

  const rb = (role) => roleBadge[role] || { label: role, bg: '#94a3b815', color: '#94a3b8', border: '#94a3b840' };
  const sb = (status) => statusBadge[status] || statusBadge.INACTIVE;

  return (
    <div className="users-page">
      <header className="page-header">
        <div>
          <h1 className="page-title">User Management</h1>
          <p className="page-subtitle">Manage platform access, roles, and account status</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 1rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          <Users size={16} />
          {users.length} user{users.length !== 1 ? 's' : ''}
        </div>
      </header>

      {/* Role legend */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {Object.entries(roleBadge).map(([key, val]) => (
          <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.35rem 0.85rem', background: val.bg, border: `1px solid ${val.border}`, borderRadius: 20, fontSize: '0.8rem', color: val.color, fontWeight: 600 }}>
            <Shield size={12} />
            {val.label}: {key === 'ROLE_VIEWER' ? 'View only' : key === 'ROLE_ANALYST' ? 'View + insights' : 'Full access'}
          </div>
        ))}
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Joined</th>
              <th style={{ textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: '3rem' }}>
                <div className="loader" style={{ margin: '0 auto 1rem' }}></div>
                Loading users...
              </td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No users found.</td></tr>
            ) : (
              users.map(u => {
                const isSelf = u.id === currentUser?.id;
                const rBadge = rb(u.role);
                const sBadge = sb(u.status);
                return (
                  <tr key={u.id} style={{ opacity: u.status === 'INACTIVE' ? 0.65 : 1 }}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                          width: 36, height: 36, borderRadius: '50%', background: rBadge.bg,
                          border: `2px solid ${rBadge.border}`, display: 'flex', alignItems: 'center',
                          justifyContent: 'center', color: rBadge.color, flexShrink: 0
                        }}>
                          <UserIcon size={16} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 600 }}>{u.name}</div>
                          {isSelf && <div style={{ fontSize: '0.72rem', color: 'var(--primary)', fontWeight: 600 }}>You</div>}
                        </div>
                      </div>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{u.email}</td>
                    <td>
                      {isSelf ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.3rem 0.75rem', background: rBadge.bg, border: `1px solid ${rBadge.border}`, borderRadius: 20, fontSize: '0.8rem', color: rBadge.color, fontWeight: 600 }}>
                          <Shield size={12} />{rBadge.label}
                        </span>
                      ) : (
                        <div style={{ position: 'relative', display: 'inline-block' }}>
                          <select
                            value={u.role}
                            onChange={e => handleRoleChange(u.id, e.target.value)}
                            disabled={saving[u.id]}
                            style={{
                              appearance: 'none', padding: '0.3rem 1.8rem 0.3rem 0.75rem',
                              background: rBadge.bg, border: `1px solid ${rBadge.border}`,
                              borderRadius: 20, fontSize: '0.8rem', color: rBadge.color,
                              fontWeight: 600, cursor: 'pointer'
                            }}
                          >
                            {ROLES.map(r => (
                              <option key={r} value={r}>{roleBadge[r]?.label || r.replace('ROLE_', '')}</option>
                            ))}
                          </select>
                          <ChevronDown size={12} style={{ position: 'absolute', right: '0.5rem', top: '50%', transform: 'translateY(-50%)', color: rBadge.color, pointerEvents: 'none' }} />
                        </div>
                      )}
                    </td>
                    <td>
                      <button
                        onClick={() => !isSelf && handleStatusToggle(u)}
                        disabled={isSelf || saving[u.id]}
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                          padding: '0.3rem 0.75rem', borderRadius: 20, fontSize: '0.8rem',
                          fontWeight: 600, cursor: isSelf ? 'default' : 'pointer',
                          background: 'transparent', border: `1px solid ${sBadge.color}40`,
                          color: sBadge.color,
                        }}
                        title={isSelf ? '' : `Click to ${u.status === 'ACTIVE' ? 'deactivate' : 'activate'}`}
                      >
                        {sBadge.icon}{sBadge.label}
                      </button>
                    </td>
                    <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        className="btn"
                        style={{ padding: '0.4rem 0.65rem', border: '1px solid var(--border)', color: isSelf ? 'var(--text-muted)' : 'var(--danger)', cursor: isSelf ? 'not-allowed' : 'pointer' }}
                        onClick={() => handleDelete(u.id)}
                        disabled={isSelf || saving[u.id]}
                        title={isSelf ? 'Cannot delete yourself' : 'Delete user'}
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagementPage;
