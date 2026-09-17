import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../i18n/LanguageContext';
import { User, Phone, MapPin, ShieldCheck, UserCheck, Save, CheckCircle, Stethoscope, MessageSquare, AlertCircle } from 'lucide-react';
import './Profile.css';

export const Profile = () => {
  const { user, updateProfile, isConfigured } = useAuth();
  const { t } = useLanguage();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [district, setDistrict] = useState(user?.district || 'Kopargaon');
  const [state, setState] = useState(user?.state || 'Maharashtra');

  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      await updateProfile({
        name,
        phone,
        district,
        state,
      });
      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3500);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="profile-container animate-fade-in">
      <header className="profile-header-banner">
        <div className="profile-avatar-large">
          {user?.name ? user.name.charAt(0) : 'A'}
        </div>
        <div className="profile-header-meta">
          <div className="profile-name-row">
            <h1>{user?.name || 'Farmer Account'}</h1>
            <span className={`role-badge ${user?.role === 'Agriculture Expert' ? 'expert' : 'farmer'}`}>
              {user?.role === 'Agriculture Expert' ? (
                <>
                  <ShieldCheck size={14} /> {t('profile.roleExpert')}
                </>
              ) : (
                <>
                  <UserCheck size={14} /> {t('profile.roleFarmer')}
                </>
              )}
            </span>
          </div>
          <p className="profile-email">{user?.email || 'farmer@agrirakshak.in'}</p>
          <div className="profile-tags">
            <span className="location-tag">
              <MapPin size={13} /> {user?.district || 'Kopargaon'}, {user?.state || 'Maharashtra'}
            </span>
            <span className="auth-type-tag">
              {isConfigured ? t('profile.verifiedAccount') : t('profile.demoAccount')}
            </span>
          </div>
        </div>
      </header>

      {/* Account Telemetry Summary */}
      <div className="profile-telemetry-grid">
        <div className="telemetry-card">
          <div className="telemetry-icon green">
            <Stethoscope size={22} />
          </div>
          <div>
            <div className="telemetry-num">14</div>
            <div className="telemetry-label">{t('profile.diagnosesCompleted')}</div>
          </div>
        </div>
        <div className="telemetry-card">
          <div className="telemetry-icon blue">
            <MessageSquare size={22} />
          </div>
          <div>
            <div className="telemetry-num">8</div>
            <div className="telemetry-label">{t('profile.communityDiscussions')}</div>
          </div>
        </div>
        <div className="telemetry-card">
          <div className="telemetry-icon gold">
            <ShieldCheck size={22} />
          </div>
          <div>
            <div className="telemetry-num">{t('common.verified')}</div>
            <div className="telemetry-label">{t('profile.trustRegion')}</div>
          </div>
        </div>
      </div>

      <div className="profile-content-grid">
        <div className="profile-card glass-panel">
          <h2>{t('profile.editTitle')}</h2>
          <p className="subtitle">{t('profile.editSubtitle')}</p>

          {successMessage && (
            <div className="alert-box success">
              <CheckCircle size={18} /> {t('profile.successUpdate')}
            </div>
          )}

          {errorMessage && (
            <div className="alert-box error">
              <AlertCircle size={18} /> {errorMessage}
            </div>
          )}

          <form onSubmit={handleSave} className="profile-form">
            <div className="form-group">
              <label>{t('profile.fullNameLabel')}</label>
              <div className="input-wrapper">
                <User size={18} className="input-icon" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter full name"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>{t('profile.phoneLabel')}</label>
              <div className="input-wrapper">
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
              <label>{t('profile.districtLabel')}</label>
              <div className="input-wrapper">
                <MapPin size={18} className="input-icon" />
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="profile-select"
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
              <label>{t('profile.stateLabel')}</label>
              <div className="input-wrapper">
                <MapPin size={18} className="input-icon" />
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="State"
                />
              </div>
            </div>

            <button type="submit" className="save-profile-btn" disabled={saving}>
              <Save size={18} /> {saving ? t('common.loading') : t('profile.btnSaveProfile')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
