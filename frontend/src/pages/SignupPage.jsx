import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, Wallet, ArrowRight, Eye, BarChart2, Shield } from 'lucide-react';

const ROLES = [
  {
    value: 'ROLE_VIEWER',
    label: 'Viewer',
    desc: 'Read-only access to summaries & investments',
    Icon: Eye,
    color: '#22C55E',
    bg: 'rgba(34,197,94,0.10)',
    border: 'rgba(34,197,94,0.35)',
  },
  {
    value: 'ROLE_ANALYST',
    label: 'Analyst',
    desc: 'Full analytics — records, reports, budgets',
    Icon: BarChart2,
    color: '#D6C180',
    bg: 'rgba(214,193,128,0.15)',
    border: 'rgba(214,193,128,0.45)',
  },
  {
    value: 'ROLE_ADMIN',
    label: 'Admin',
    desc: 'Complete access including user management',
    Icon: Shield,
    color: '#758FBE',
    bg: 'rgba(117,143,190,0.12)',
    border: 'rgba(117,143,190,0.40)',
  },
];

const SignupPage = () => {
  const [name,     setName]     = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [role,     setRole]     = useState('ROLE_VIEWER');
  const [error,    setError]    = useState('');
  const [success,  setSuccess]  = useState('');
  const [loading,  setLoading]  = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess(''); setLoading(true);
    try {
      await register(name, email, password, role);
      setSuccess('Account created! Redirecting...');
      setTimeout(() => navigate('/'), 1000);
    } catch (err) {
      const data = err.response?.data;
      if (data && typeof data === 'object' && !data.message) {
        setError(Object.values(data)[0] || 'Registration failed.');
      } else {
        setError(data?.message || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ maxWidth: 500, animation: 'fadeIn 0.5s ease-out' }}>
        <div className="auth-header">
          <div className="auth-icon-wrapper"><Wallet size={30} /></div>
          <h1>Create Account</h1>
          <p>Start managing your finances with professional insights</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        {success && (
          <div style={{
            background: 'rgba(34,197,94,0.08)', color: '#15803d',
            padding: '0.9rem', borderRadius: '0.75rem', marginBottom: '1.5rem',
            fontSize: '0.875rem', textAlign: 'center', fontWeight: 600,
            border: '1px solid rgba(34,197,94,0.25)',
          }}>{success}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <div className="input-with-icon">
              <User size={17} className="input-icon" />
              <input
                type="text" className="form-control" placeholder="John Doe"
                value={name} onChange={e => setName(e.target.value)}
                minLength={3} maxLength={50} required disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <div className="input-with-icon">
              <Mail size={17} className="input-icon" />
              <input
                type="email" className="form-control" placeholder="yours@example.com"
                value={email} onChange={e => setEmail(e.target.value)}
                required disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label>
              Password{' '}
              <span style={{ color: 'var(--text-hint)', fontWeight: 400, fontSize: '0.78rem' }}>(min. 6 characters)</span>
            </label>
            <div className="input-with-icon">
              <Lock size={17} className="input-icon" />
              <input
                type="password" className="form-control" placeholder="••••••••"
                value={password} onChange={e => setPassword(e.target.value)}
                minLength={6} maxLength={40} required disabled={loading}
              />
            </div>
          </div>

          {/* Role selector */}
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.65rem' }}>
              <Shield size={14} style={{ color: 'var(--primary)' }} />
              Account Role
            </label>
            <div style={{ display: 'flex', gap: '0.6rem' }}>
              {ROLES.map(opt => {
                const active = role === opt.value;
                return (
                  <label
                    key={opt.value}
                    style={{
                      flex: 1,
                      display: 'flex', flexDirection: 'column', alignItems: 'center',
                      padding: '0.9rem 0.5rem',
                      borderRadius: '0.9rem',
                      border: `2px solid ${active ? opt.border : 'var(--border)'}`,
                      backgroundColor: active ? opt.bg : 'transparent',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      transition: 'all 0.18s ease',
                      textAlign: 'center',
                    }}
                  >
                    <input
                      type="radio" name="role" value={opt.value}
                      checked={active} onChange={() => setRole(opt.value)}
                      disabled={loading} style={{ display: 'none' }}
                    />
                    <opt.Icon
                      size={20}
                      style={{ color: active ? opt.color : 'var(--text-hint)', marginBottom: '0.4rem' }}
                    />
                    <span style={{ fontWeight: 700, fontSize: '0.82rem', color: active ? opt.color : 'var(--text)' }}>
                      {opt.label}
                    </span>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '0.25rem', lineHeight: 1.3 }}>
                      {opt.desc}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          <button type="submit" className="btn btn-primary auth-submit" disabled={loading} style={{ marginTop: '0.5rem' }}>
            {loading ? <span className="small-loader" /> : (
              <><span>Create Account</span><ArrowRight size={17} /></>
            )}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account?{' '}
          <Link to="/login" className="auth-link">Sign in here</Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
