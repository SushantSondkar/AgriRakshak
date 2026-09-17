import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { NotificationBell } from '../components/NotificationBell';
import { LanguageSelector } from '../components/LanguageSelector';
import { useAuth } from '../context/AuthContext';
import { Sprout } from 'lucide-react';
import './MainLayout.css';

export const MainLayout = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

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

  return (
    <div className="main-layout">
      <Sidebar />
      <div className="main-viewport">
        <header className="topbar glass-panel">
          <div className="topbar-left">
          </div>
          <div className="topbar-right">
            <LanguageSelector />
            <NotificationBell />
          </div>
        </header>
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
