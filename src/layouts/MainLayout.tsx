import { useState } from 'react';
import { Outlet, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { NotificationBell } from '../components/NotificationBell';
import { LanguageSelector } from '../components/LanguageSelector';
import { DataStatusBadge } from '../components/DataStatusBadge';
import { VoiceAssistant } from '../components/VoiceAssistant';
import { useAuth } from '../context/AuthContext';
import { Sprout, Menu, X } from 'lucide-react';
import './MainLayout.css';

export const MainLayout = () => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (loading) {
    return (
      <div className="auth-loading-screen" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', gap: '1rem', background: '#f4f9f4' }}>
        <div style={{ animation: 'spin 1.5s linear infinite' }}>
          <Sprout size={48} color="#2e7d32" />
        </div>
        <p style={{ color: '#1b5e20', fontWeight: 700, fontFamily: 'var(--font-heading)' }}>
          Authenticating AgriRakshak...
        </p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const farmerName = user?.name || 'Ramesh Patil';
  const farmerDistrict = user?.district || 'Kopargaon';

  return (
    <div className="main-layout">
      <Sidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      <div className="main-viewport">
        <header className="topbar glass-panel">
          <div className="topbar-left">
            <button 
              className="mobile-menu-toggle-btn" 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X size={22} color="#1b5e20" /> : <Menu size={22} color="#1b5e20" />}
            </button>
            <div className="mobile-brand-title">
              <Sprout size={20} color="#1b5e20" />
              <span>AgriRakshak</span>
            </div>
            <div className="topbar-status-wrapper">
              <DataStatusBadge />
            </div>
          </div>
          <div className="topbar-right">
            <LanguageSelector />
            <NotificationBell />
            <div 
              className="topbar-user-badge" 
              onClick={() => navigate('/profile')}
              title="View Profile / प्रोफाइल पहा"
            >
              <div className="topbar-user-avatar">{farmerName.charAt(0)}</div>
              <div className="topbar-user-meta">
                <span className="topbar-user-name">{farmerName}</span>
                <span className="topbar-user-sub">{farmerDistrict} • {user?.role || 'Farmer'}</span>
              </div>
            </div>
          </div>
        </header>
        <main className="main-content">
          <Outlet />
        </main>
        {/* Floating AI Multilingual Voice Assistant */}
        <VoiceAssistant />
      </div>
    </div>
  );
};
