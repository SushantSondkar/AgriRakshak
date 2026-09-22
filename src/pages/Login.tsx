import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../i18n/LanguageContext';
import { Sprout, Eye, EyeOff, Lock, Mail, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';
import './Login.css';

export const Login = () => {
  const { t } = useLanguage();
  const [email, setEmail] = useState('sushant.sondkar@agrirakshak.in');
  const [password, setPassword] = useState('farmer123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signIn, demoLogin, isConfigured } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signIn(email, password);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Failed to sign in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (role: 'Farmer' | 'Agriculture Expert') => {
    demoLogin(role);
    navigate(from, { replace: true });
  };

  return (
    <div className="login-container">
      <div className="login-box glass-panel animate-fade-in">
        <div className="login-header">
          <div className="logo-icon">
            <Sprout size={36} color="var(--color-primary-light)" />
          </div>
          <h1>AgriRakshak</h1>
          <p>{t('auth.signInSub')}</p>
          
          {isConfigured ? (
            <div className="supabase-status-badge live">
              <span className="dot"></span> Connected to Supabase Cloud
            </div>
          ) : (
            <div className="supabase-status-badge demo">
              <span className="dot"></span> Offline / Demo Mode Active
            </div>
          )}
        </div>

        <form onSubmit={handleLogin} className="login-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label>{t('auth.emailLabel')}</label>
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

          <div className="form-group">
            <div className="form-label-row">
              <label>{t('auth.passwordLabel')}</label>
              <Link to="/forgot-password" className="forgot-link">
                {t('auth.forgotPassword')}
              </Link>
            </div>
            <div className="input-icon-wrapper">
              <Lock size={18} className="input-icon" />
              <input 
                type={showPassword ? 'text' : 'password'} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="Enter password"
                required 
              />
              <button 
                type="button" 
                className="toggle-password-btn" 
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? t('auth.hidePassword') : t('auth.showPassword')}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? (
              t('common.loading')
            ) : (
              <>
                {t('auth.btnSignIn')} <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="demo-fill-section">
          <p className="demo-title">{t('auth.quickDemoLogin')}</p>
          <div className="demo-btn-group">
            <button 
              type="button" 
              className="demo-chip-btn farmer" 
              onClick={() => handleDemoLogin('Farmer')}
            >
              <UserCheck size={14} /> {t('auth.loginAsFarmer')}
            </button>
            <button 
              type="button" 
              className="demo-chip-btn expert" 
              onClick={() => handleDemoLogin('Agriculture Expert')}
            >
              <ShieldCheck size={14} /> {t('auth.loginAsExpert')}
            </button>
          </div>
        </div>

        <div className="login-footer">
          <p>
            {t('auth.noAccountPrompt')}{' '}
            <Link to="/signup" className="signup-link">
              {t('auth.createAccountLink')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
