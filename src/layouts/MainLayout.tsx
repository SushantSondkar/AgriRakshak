import { useState, useEffect } from 'react';
import { Outlet, Navigate, useLocation, useNavigate, Link } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { NotificationBell } from '../components/NotificationBell';
import { LanguageSelector } from '../components/LanguageSelector';
import { VoiceAssistant } from '../components/VoiceAssistant';
import { LiveTour } from '../components/LiveTour';
import { useAuth } from '../context/AuthContext';
import { Sprout, Menu, Compass } from 'lucide-react';
import './MainLayout.css';

export const MainLayout = () => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('agri_sidebar_open');
      if (saved !== null) {
        return saved === 'true';
      }
      return window.innerWidth > 768;
    }
    return true;
  });

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => {
      const next = !prev;
      localStorage.setItem('agri_sidebar_open', String(next));
      return next;
    });
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
    localStorage.setItem('agri_sidebar_open', 'false');
  };

  useEffect(() => {
    const handleExpand = () => setIsSidebarOpen(true);
    window.addEventListener('agri_expand_sidebar', handleExpand);
    return () => window.removeEventListener('agri_expand_sidebar', handleExpand);
  }, []);

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

  const farmerName = user?.name || 'Sushant Sondkar';
  const farmerDistrict = user?.district || 'Ahmednagar';

  return (
    <div className="main-layout">
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} onToggle={toggleSidebar} />
      <div className={`main-viewport ${!isSidebarOpen ? 'sidebar-retracted' : ''}`}>
        <header className="topbar glass-panel">
          <div className="topbar-left">
            {!isSidebarOpen && (
              <>
                <button 
                  className="menu-toggle-btn" 
                  onClick={toggleSidebar}
                  aria-label="Expand navigation menu"
                  title="Expand Menu / मेनू उघडा"
                >
                  <Menu size={22} color="#1b5e20" />
                </button>
                <Link to="/" className="topbar-brand-title" title="Go to Landing Page / मुख्य पृष्ठ">
                  <div className="topbar-brand-icon">
                    <Sprout size={20} color="#1b5e20" />
                  </div>
                  <span>AgriRakshak</span>
                </Link>
              </>
            )}
          </div>
          <div className="topbar-right">
            <button
              className="btn-live-tour-trigger"
              onClick={() => window.dispatchEvent(new CustomEvent('agri_start_live_tour'))}
              title="Start Live Guided Tour / थेट अ‍ॅप मार्गदर्शक"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '0.4rem 0.8rem',
                borderRadius: '10px',
                background: '#ecfdf5',
                color: '#065f46',
                border: '1px solid #a7f3d0',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: 'var(--font-heading)',
                transition: 'all 0.2s',
              }}
            >
              <Compass size={15} color="#047857" />
              <span>Live Tour</span>
            </button>
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
        {/* Interactive Live Guided Tour */}
        <LiveTour />
      </div>
    </div>
  );
};
