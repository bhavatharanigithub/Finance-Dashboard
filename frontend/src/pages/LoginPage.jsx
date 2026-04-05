import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Wallet, ArrowRight } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch {
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ animation: 'fadeIn 0.5s ease-out' }}>
        <div className="auth-header">
          <div className="auth-icon-wrapper"><Wallet size={30} /></div>
          <h1>Welcome Back</h1>
          <p>Access your professional finance dashboard</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <div className="input-with-icon">
              <Mail size={17} className="input-icon" />
              <input
                type="email" className="form-control"
                placeholder="yours@example.com"
                value={email} onChange={e => setEmail(e.target.value)}
                required disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="input-with-icon">
              <Lock size={17} className="input-icon" />
              <input
                type="password" className="form-control"
                placeholder="••••••••"
                value={password} onChange={e => setPassword(e.target.value)}
                required disabled={loading}
              />
            </div>
          </div>

          <div className="auth-actions">
            <span className="forgot-password">Forgot password?</span>
          </div>

          <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
            {loading ? <span className="small-loader" /> : (
              <><span>Sign In</span><ArrowRight size={17} /></>
            )}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account?{' '}
          <Link to="/signup" className="auth-link">Sign up free</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
