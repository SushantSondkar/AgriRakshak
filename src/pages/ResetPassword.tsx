import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sprout, Lock, CheckCircle } from 'lucide-react';
import './Login.css';

export const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const { updatePassword } = useAuth();
  const navigate = useNavigate();

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      const res = await updatePassword(password);
      if (res.success) {
        setMessage('Password updated successfully! Redirecting to dashboard...');
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        setError(res.message);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box glass-panel animate-fade-in">
        <div className="login-header">
          <div className="logo-icon">
            <Sprout size={36} color="var(--color-primary-light)" />
          </div>
          <h1>Set New Password</h1>
          <p>Please enter your new password below</p>
        </div>

        <form onSubmit={handleUpdatePassword} className="login-form">
          {message && (
            <div className="success-message" style={{ background: '#e8f5e9', color: '#2e7d32', padding: '0.75rem', borderRadius: '8px', fontSize: '0.88rem', fontWeight: 600, border: '1px solid #c8e6c9', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              <CheckCircle size={18} /> {message}
            </div>
          )}

          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label>New Password</label>
            <div className="input-icon-wrapper">
              <Lock size={18} className="input-icon" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Confirm New Password</label>
            <div className="input-icon-wrapper">
              <Lock size={18} className="input-icon" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                required
              />
            </div>
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Updating Password...' : 'Update Password'}
          </button>
        </form>

        <div className="login-footer">
          <Link to="/login" className="login-link">
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
