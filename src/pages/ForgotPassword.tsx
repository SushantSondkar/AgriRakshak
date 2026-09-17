import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sprout, Mail, ArrowLeft, Send } from 'lucide-react';
import './Login.css';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const { resetPassword } = useAuth();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const res = await resetPassword(email);
      if (res.success) {
        setMessage(res.message);
      } else {
        setError(res.message);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to send reset link.');
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
          <h1>Reset Password</h1>
          <p>Enter your registered email to receive a password reset link</p>
        </div>

        <form onSubmit={handleReset} className="login-form">
          {message && (
            <div className="success-message" style={{ background: '#e8f5e9', color: '#2e7d32', padding: '0.75rem', borderRadius: '8px', fontSize: '0.88rem', fontWeight: 600, border: '1px solid #c8e6c9', textAlign: 'center' }}>
              {message}
            </div>
          )}

          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label>Registered Email Address</label>
            <div className="input-icon-wrapper">
              <Mail size={18} className="input-icon" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="farmer@agrirakshak.in"
                required
              />
            </div>
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? (
              'Sending link...'
            ) : (
              <>
                Send Reset Link <Send size={16} />
              </>
            )}
          </button>
        </form>

        <div className="login-footer">
          <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--color-primary-light)', fontWeight: 700, textDecoration: 'none' }}>
            <ArrowLeft size={16} /> Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
