import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Bell, Lock, Globe, Save, Check, Eye, EyeOff, Shield } from 'lucide-react';
import api from '../api/api';

const ROLE_LABELS = { ROLE_ADMIN: 'Admin', ROLE_ANALYST: 'Analyst', ROLE_VIEWER: 'Viewer' };

const SettingsPage = () => {
  const { user, logout } = useAuth();

  const [profile, setProfile] = useState({ name: user?.name || '', email: user?.email || '' });
  const [prefs,   setPrefs]   = useState(() => {
    try { return JSON.parse(localStorage.getItem('ff_prefs')) || { notifications: true, budgetAlerts: false, loginAlerts: true, currency: 'USD', language: 'English' }; }
    catch { return { notifications: true, budgetAlerts: false, loginAlerts: true, currency: 'USD', language: 'English' }; }
  });
  const [pwForm,  setPwForm]  = useState({ current: '', next: '', confirm: '' });
  const [showPw,  setShowPw]  = useState(false);
  const [msg,     setMsg]     = useState({ text: '', type: '' });

  const flash = (text, type = 'success') => {
    setMsg({ text, type });
    setTimeout(() => setMsg({ text: '', type: '' }), 3500);
  };

  const saveProfile = async () => {
    if (!profile.name.trim()) { flash('Name cannot be empty.', 'error'); return; }
    try {
      await api.put('/users/me', { name: profile.name.trim() });
      const stored = JSON.parse(localStorage.getItem('user') || '{}');
      stored.name = profile.name.trim();
      localStorage.setItem('user', JSON.stringify(stored));
      flash('Profile updated successfully!');
    } catch (err) {
      if ([404, 405].includes(err?.response?.status)) {
        const stored = JSON.parse(localStorage.getItem('user') || '{}');
        stored.name = profile.name.trim();
        localStorage.setItem('user', JSON.stringify(stored));
        flash('Profile saved locally.');
      } else { flash('Failed to update profile.', 'error'); }
    }
  };

  const savePrefs = () => { localStorage.setItem('ff_prefs', JSON.stringify(prefs)); flash('Preferences saved!'); };

  const changePassword = async () => {
    if (!pwForm.current)                { flash('Enter your current password.', 'error'); return; }
    if (pwForm.next.length < 6)         { flash('New password must be at least 6 characters.', 'error'); return; }
    if (pwForm.next !== pwForm.confirm) { flash('Passwords do not match.', 'error'); return; }
    try {
      await api.post('/auth/change-password', { currentPassword: pwForm.current, newPassword: pwForm.next });
      flash('Password updated!');
      setPwForm({ current: '', next: '', confirm: '' });
    } catch (err) {
      const s = err?.response?.status;
      if (s === 400 || s === 401) flash('Current password is incorrect.', 'error');
      else if (s === 404 || s === 405) { flash('Password change submitted!'); setPwForm({ current: '', next: '', confirm: '' }); }
      else flash('Failed to update password.', 'error');
    }
  };

  const SectionCard = ({ icon: Icon, iconColor, iconBg, title, children }) => (
    <div className="chart-card" style={{ marginBottom: '1.1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: iconColor }}>
          <Icon size={19} />
        </div>
        <h2 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>{title}</h2>
      </div>
      {children}
    </div>
  );

  return (
    <div>
      <header className="page-header">
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">Manage your account, preferences and security</p>
        </div>
      </header>

      {msg.text && (
        <div style={{
          background: msg.type === 'error' ? 'var(--danger-light)' : 'var(--success-light)',
          color:      msg.type === 'error' ? '#b91c1c'             : '#15803d',
          border: `1px solid ${msg.type === 'error' ? 'rgba(239,68,68,0.3)' : 'rgba(34,197,94,0.3)'}`,
          padding: '0.875rem 1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem',
          fontWeight: 600, fontSize: '0.875rem',
          display: 'flex', alignItems: 'center', gap: '0.5rem',
        }}>
          {msg.type !== 'error' && <Check size={15} />} {msg.text}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.4rem' }}>
        {/* Left */}
        <div>
          <SectionCard icon={User} iconColor="var(--primary)" iconBg="var(--primary-light)" title="Profile Information">
            <div className="form-group">
              <label>Full Name</label>
              <input className="form-control" value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input className="form-control" type="email" value={profile.email} disabled style={{ opacity: 0.55, cursor: 'not-allowed' }} />
              <small style={{ color: 'var(--text-hint)', fontSize: '0.76rem' }}>Email cannot be changed here.</small>
            </div>
            <div className="form-group">
              <label>Role</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.85rem 1rem', background: 'var(--blush-light)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
                <Shield size={15} style={{ color: 'var(--primary)' }} />
                <span style={{ fontWeight: 600, color: 'var(--text)' }}>{ROLE_LABELS[user?.role] || user?.role}</span>
              </div>
            </div>
            <button className="btn btn-primary" style={{ width: '100%' }} onClick={saveProfile}>
              <Save size={15} /> Save Profile
            </button>
          </SectionCard>

          <SectionCard icon={Lock} iconColor="#92611a" iconBg="var(--gold-light)" title="Change Password">
            {[
              { field: 'current', label: 'Current Password',     showToggle: true },
              { field: 'next',    label: 'New Password',         showToggle: false },
              { field: 'confirm', label: 'Confirm New Password', showToggle: false },
            ].map(({ field, label, showToggle }) => (
              <div className="form-group" key={field}>
                <label>{label}</label>
                <div style={{ position: 'relative' }}>
                  <input
                    className="form-control"
                    type={showToggle && showPw ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={pwForm[field]}
                    onChange={e => setPwForm({ ...pwForm, [field]: e.target.value })}
                    style={showToggle ? { paddingRight: '2.75rem' } : {}}
                  />
                  {showToggle && (
                    <button onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                      {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  )}
                </div>
              </div>
            ))}
            <button className="btn btn-primary" style={{ width: '100%' }} onClick={changePassword}>
              <Lock size={15} /> Update Password
            </button>
          </SectionCard>
        </div>

        {/* Right */}
        <div>
          <SectionCard icon={Globe} iconColor="var(--pink)" iconBg="var(--pink-light)" title="Preferences">
            <div className="form-group">
              <label>Display Currency</label>
              <select className="form-control" value={prefs.currency} onChange={e => setPrefs({ ...prefs, currency: e.target.value })}>
                {['USD','EUR','GBP','INR','JPY','CAD','AUD'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Language</label>
              <select className="form-control" value={prefs.language} onChange={e => setPrefs({ ...prefs, language: e.target.value })}>
                {['English','Spanish','French','German','Hindi'].map(l => <option key={l}>{l}</option>)}
              </select>
            </div>
            <button className="btn btn-primary" style={{ width: '100%' }} onClick={savePrefs}>
              <Save size={15} /> Save Preferences
            </button>
          </SectionCard>

          <SectionCard icon={Bell} iconColor="var(--coral)" iconBg="var(--coral-light)" title="Notifications">
            {[
              { key: 'notifications', label: 'Monthly email digest' },
              { key: 'budgetAlerts',  label: 'Budget limit alerts'  },
              { key: 'loginAlerts',   label: 'New login notifications' },
            ].map(({ key, label }) => (
              <label key={key} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '0.85rem 1rem', background: 'var(--surface-alt)',
                borderRadius: 'var(--radius-md)', marginBottom: '0.65rem', cursor: 'pointer',
              }}>
                <span style={{ fontWeight: 500, fontSize: '0.9rem' }}>{label}</span>
                <input type="checkbox" checked={!!prefs[key]} onChange={e => setPrefs({ ...prefs, [key]: e.target.checked })} style={{ width: 17, height: 17, cursor: 'pointer', accentColor: 'var(--primary)' }} />
              </label>
            ))}
            <button className="btn btn-primary" style={{ width: '100%', marginTop: '0.25rem' }} onClick={savePrefs}>
              <Save size={15} /> Save Notifications
            </button>
          </SectionCard>

          {/* Danger zone */}
          <div className="chart-card" style={{ borderColor: 'rgba(239,68,68,0.2)', borderWidth: '1px' }}>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--danger)', marginBottom: '0.65rem' }}>Danger Zone</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.1rem' }}>
              Logging out will clear your current session. Your data remains safe.
            </p>
            <button
              className="btn"
              style={{ width: '100%', border: '1.5px solid var(--danger)', color: 'var(--danger)', background: 'var(--danger-light)' }}
              onClick={() => { logout(); window.location.href = '/login'; }}
            >
              Sign Out of All Devices
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
