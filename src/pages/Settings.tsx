import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../i18n/LanguageContext';
import type { Language } from '../i18n/types';
import { Globe, CheckCircle, Bell, User } from 'lucide-react';
import './Settings.css';

export const Settings = () => {
  const { user } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [successMsg, setSuccessMsg] = useState('');

  const handleLanguageChange = async (newLang: Language) => {
    await setLanguage(newLang);
    setSuccessMsg(t('settings.langUpdatedMsg'));
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  return (
    <div className="settings-page-container animate-fade-in">
      <div className="settings-page-header">
        <h1>{t('settings.title')}</h1>
        <p>{t('settings.subtitle')}</p>
      </div>

      <div className="settings-grid">
        {/* Language & Region Preferences Section */}
        <div className="glass-panel settings-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.5rem' }}>
            <Globe size={24} color="#1b5e20" />
            <h2 style={{ fontSize: '1.3rem', color: 'var(--color-primary)', margin: 0 }}>{t('settings.langSectionTitle')}</h2>
          </div>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
            {t('settings.langSectionSub')}
          </p>

          {successMsg && (
            <div style={{ background: '#e8f5e9', color: '#2e7d32', padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '0.88rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #c8e6c9' }}>
              <CheckCircle size={18} /> {successMsg}
            </div>
          )}

          <div className="language-options-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            <div
              className={language === 'en' ? 'lang-card-option active' : 'lang-card-option'}
              onClick={() => handleLanguageChange('en')}
              style={{
                padding: '1.2rem',
                borderRadius: '12px',
                border: language === 'en' ? '2px solid #1b5e20' : '1px solid #d8e6d8',
                backgroundColor: language === 'en' ? '#e8f5e9' : '#f4f9f4',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'all 0.2s ease'
              }}
            >
              <div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1b5e20' }}>{t('settings.langEnglish')}</div>
                <div style={{ fontSize: '0.8rem', color: '#555' }}>Default System Language</div>
              </div>
              {language === 'en' ? <CheckCircle size={20} color="#1b5e20" /> : null}
            </div>

            <div
              className={language === 'mr' ? 'lang-card-option active' : 'lang-card-option'}
              onClick={() => handleLanguageChange('mr')}
              style={{
                padding: '1.2rem',
                borderRadius: '12px',
                border: language === 'mr' ? '2px solid #1b5e20' : '1px solid #d8e6d8',
                backgroundColor: language === 'mr' ? '#e8f5e9' : '#f4f9f4',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'all 0.2s ease'
              }}
            >
              <div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1b5e20' }}>{t('settings.langMarathi')}</div>
                <div style={{ fontSize: '0.8rem', color: '#555' }}>संपूर्ण ॲप मराठीत बदला</div>
              </div>
              {language === 'mr' ? <CheckCircle size={20} color="#1b5e20" /> : null}
            </div>

            <div
              className={language === 'hi' ? 'lang-card-option active' : 'lang-card-option'}
              onClick={() => handleLanguageChange('hi')}
              style={{
                padding: '1.2rem',
                borderRadius: '12px',
                border: language === 'hi' ? '2px solid #1b5e20' : '1px solid #d8e6d8',
                backgroundColor: language === 'hi' ? '#e8f5e9' : '#f4f9f4',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'all 0.2s ease'
              }}
            >
              <div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1b5e20' }}>{t('settings.langHindi')}</div>
                <div style={{ fontSize: '0.8rem', color: '#555' }}>संपूर्ण ऐप हिंदी में बदलें</div>
              </div>
              {language === 'hi' ? <CheckCircle size={20} color="#1b5e20" /> : null}
            </div>
          </div>
        </div>

        {/* User Profile Information Summary */}
        <div className="glass-panel settings-card" style={{ background: '#ffffff', padding: '1.75rem', borderRadius: '16px', border: '1px solid #d8e6d8' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
            <User size={22} color="#1b5e20" />
            <h2 style={{ fontSize: '1.25rem', color: 'var(--color-primary)', margin: 0 }}>{t('profile.editTitle')}</h2>
          </div>
          <div className="settings-form" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <div className="form-group">
              <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>{t('profile.fullNameLabel')}</label>
              <input type="text" value={user?.name || ''} readOnly style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #d8e6d8', background: '#f4f9f4', fontWeight: 600 }} />
            </div>
            <div className="form-group">
              <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>{t('profile.phoneLabel')}</label>
              <input type="text" value={user?.phone || ''} readOnly style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #d8e6d8', background: '#f4f9f4', fontWeight: 600 }} />
            </div>
            <div className="form-group">
              <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>{t('profile.districtLabel')}</label>
              <input type="text" value={user?.district || 'Kopargaon'} readOnly style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #d8e6d8', background: '#f4f9f4', fontWeight: 600 }} />
            </div>
          </div>
        </div>

        {/* Notification Settings Summary */}
        <div className="glass-panel settings-card" style={{ background: '#ffffff', padding: '1.75rem', borderRadius: '16px', border: '1px solid #d8e6d8' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
            <Bell size={22} color="#1b5e20" />
            <h2 style={{ fontSize: '1.25rem', color: 'var(--color-primary)', margin: 0 }}>{t('settings.notifSectionTitle')}</h2>
          </div>
          <div className="toggle-group" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="toggle-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0', borderBottom: '1px solid #e1ebe1' }}>
              <div>
                <h4 style={{ margin: 0, fontSize: '0.95rem' }}>{t('settings.notifSms')}</h4>
              </div>
              <input type="checkbox" defaultChecked style={{ width: '18px', height: '18px' }} />
            </div>
            <div className="toggle-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0' }}>
              <div>
                <h4 style={{ margin: 0, fontSize: '0.95rem' }}>{t('settings.notifPush')}</h4>
              </div>
              <input type="checkbox" defaultChecked style={{ width: '18px', height: '18px' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
