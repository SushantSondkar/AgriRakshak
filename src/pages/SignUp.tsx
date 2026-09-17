import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../i18n/LanguageContext';
import { Sprout, User, Mail, Lock, Phone, MapPin, ShieldCheck, UserCheck, ArrowRight } from 'lucide-react';
import './SignUp.css';

export const SignUp = () => {
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'Farmer' | 'Agriculture Expert'>('Farmer');
  const [district, setDistrict] = useState('Kopargaon');
  const stateName = 'Maharashtra';

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      await signUp(email, password, {
        name,
        phone,
        role,
        district,
        state: stateName,
      });
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box glass-panel animate-fade-in">
        <div className="signup-header">
          <div className="logo-icon">
            <Sprout size={36} color="var(--color-primary-light)" />
          </div>
          <h1>{t('auth.signUpTitle')}</h1>
          <p>{t('auth.signUpSub')}</p>
        </div>

        <form onSubmit={handleSignUp} className="signup-form">
          {error && <div className="error-message">{error}</div>}

          {/* Account Role Selector */}
          <div className="role-selector-group">
            <label className="section-label">{t('auth.registeringAs')}</label>
            <div className="role-options">
              <button
                type="button"
                className={`role-option-btn ${role === 'Farmer' ? 'selected' : ''}`}
                onClick={() => setRole('Farmer')}
              >
                <UserCheck size={18} />
                <span>{t('auth.roleFarmerBtn')}</span>
              </button>
              <button
                type="button"
                className={`role-option-btn ${role === 'Agriculture Expert' ? 'selected' : ''}`}
                onClick={() => setRole('Agriculture Expert')}
              >
                <ShieldCheck size={18} />
                <span>{t('auth.roleExpertBtn')}</span>
              </button>
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>{t('profile.fullNameLabel')} *</label>
              <div className="input-icon-wrapper">
                <User size={18} className="input-icon" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ramesh Patil"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>{t('auth.emailLabel')} *</label>
              <div className="input-icon-wrapper">
                <Mail size={18} className="input-icon" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ramesh@gmail.com"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>{t('profile.phoneLabel')}</label>
              <div className="input-icon-wrapper">
                <Phone size={18} className="input-icon" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="10-digit mobile number"
                />
              </div>
            </div>

            <div className="form-group">
              <label>{t('profile.districtLabel')} *</label>
              <div className="input-icon-wrapper">
                <MapPin size={18} className="input-icon" />
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="select-input"
                >
                  <option value="Kopargaon">Kopargaon (कोपरगाव)</option>
                  <option value="Pune">Pune (पुणे)</option>
                  <option value="Nashik">Nashik (नाशिक)</option>
                  <option value="Ahmednagar">Ahmednagar (अहिल्यानगर)</option>
                  <option value="Satara">Satara (सातारा)</option>
                  <option value="Solapur">Solapur (सोलापूर)</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>{t('auth.passwordLabel')} *</label>
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
              <label>{t('auth.confirmPasswordLabel')} *</label>
              <div className="input-icon-wrapper">
                <Lock size={18} className="input-icon" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  required
                />
              </div>
            </div>
          </div>

          <button type="submit" className="signup-btn" disabled={loading}>
            {loading ? (
              t('common.loading')
            ) : (
              <>
                {t('auth.btnCompleteSignUp')} <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="signup-footer">
          <p>
            {t('auth.alreadyAccountPrompt')}{' '}
            <Link to="/login" className="login-link">
              {t('auth.loginLink')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
