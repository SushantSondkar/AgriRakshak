import { NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, BellRing, TrendingUp, Users, Settings, LogOut, Sprout, ShieldCheck, Stethoscope, User, Landmark, Map, Compass, UserCheck, Menu, Home, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../i18n/LanguageContext';
import './Sidebar.css';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  onToggle?: () => void;
  activeSection?: string;
  onSectionClick?: (sectionId: string) => void;
}

export const Sidebar = ({ isOpen, onClose, onToggle, activeSection, onSectionClick }: SidebarProps) => {
  const { signOut, user } = useAuth();
  const { t } = useLanguage();

  const handleNavClick = () => {
    if (window.innerWidth <= 768 && onClose) {
      onClose();
    }
  };

  const handleToggle = () => {
    if (onToggle) {
      onToggle();
    } else if (onClose) {
      onClose();
    }
  };

  const handleItemClick = (e: React.MouseEvent, sectionId: string) => {
    if (onSectionClick) {
      e.preventDefault();
      onSectionClick(sectionId);
      handleNavClick();
    } else {
      handleNavClick();
    }
  };

  return (
    <>
      {isOpen && <div className="sidebar-backdrop open" onClick={onClose} />}
      
      <aside className={`sidebar glass-panel ${isOpen ? 'open' : 'collapsed'}`}>
        <div className="sidebar-header">
          <Link 
            to="/" 
            className="brand-title-wrap" 
            title="Go to Landing Page / मुख्य पृष्ठ"
            onClick={(e) => {
              if (onSectionClick) {
                e.preventDefault();
                onSectionClick('landing-top');
                handleNavClick();
              }
            }}
          >
            <div className="brand-logo-icon">
              <Sprout size={22} color="#1b5e20" />
            </div>
            <div>
              <h2 className="brand-name">AgriRakshak</h2>
            </div>
          </Link>
          <button 
            className="sidebar-toggle-btn" 
            onClick={handleToggle} 
            aria-label="Retract navigation menu"
            title="Retract menu / मेनू लपवा"
          >
            <Menu size={20} color="#1b5e20" />
          </button>
        </div>
        
        <nav className="sidebar-nav">
          <NavLink 
            to="/" 
            className={({ isActive }) => `nav-item nav-landing ${activeSection ? (activeSection === 'landing-top' ? 'active' : '') : (isActive ? 'active' : '')}`} 
            onClick={(e) => handleItemClick(e, 'landing-top')} 
            end
          >
            <Home size={20} />
            <span>{t('nav.landing', 'Landing Page')}</span>
          </NavLink>
          <NavLink 
            to="/dashboard" 
            className={({ isActive }) => `nav-item nav-dashboard ${activeSection ? (activeSection === 'module-dashboard' ? 'active' : '') : (isActive ? 'active' : '')}`} 
            onClick={(e) => handleItemClick(e, 'module-dashboard')}
          >
            <LayoutDashboard size={20} />
            <span>{t('nav.dashboard')}</span>
          </NavLink>
          <button 
            type="button"
            className="nav-item nav-live-tour" 
            onClick={() => {
              handleNavClick();
              window.dispatchEvent(new CustomEvent('agri_start_live_tour'));
            }}
            style={{ width: '100%', border: 'none', background: 'none', textAlign: 'left', cursor: 'pointer' }}
            title="Start Live Guided Tour"
          >
            <Sparkles size={20} color="#047857" />
            <span>{t('nav.liveTour', 'Live App Tour')}</span>
          </button>
          <NavLink 
            to="/my-farm" 
            className={({ isActive }) => `nav-item nav-my-farm ${activeSection ? (activeSection === 'module-my-farm' ? 'active' : '') : (isActive ? 'active' : '')}`} 
            onClick={(e) => handleItemClick(e, 'module-my-farm')}
          >
            <Compass size={20} />
            <span>{t('nav.myFarm', 'My Farm')}</span>
          </NavLink>
          <NavLink 
            to="/risk-map" 
            className={({ isActive }) => `nav-item nav-risk-map ${activeSection ? (activeSection === 'module-risk-map' ? 'active' : '') : (isActive ? 'active' : '')}`} 
            onClick={(e) => handleItemClick(e, 'module-risk-map')}
          >
            <Map size={20} />
            <span>{t('nav.riskMap', 'Risk Map')}</span>
          </NavLink>
          <NavLink 
            to="/crop-doctor" 
            className={({ isActive }) => `nav-item nav-crop-doctor ${activeSection ? (activeSection === 'module-crop-doctor' ? 'active' : '') : (isActive ? 'active' : '')}`} 
            onClick={(e) => handleItemClick(e, 'module-crop-doctor')}
          >
            <Stethoscope size={20} />
            <span>{t('nav.cropDoctor')}</span>
          </NavLink>
          <NavLink 
            to="/officer-portal" 
            className={({ isActive }) => `nav-item nav-officer-portal ${activeSection ? (activeSection === 'module-officer-portal' ? 'active' : '') : (isActive ? 'active' : '')}`} 
            onClick={(e) => handleItemClick(e, 'module-officer-portal')}
          >
            <UserCheck size={20} />
            <span>{t('nav.officerPortal', 'Officer Portal')}</span>
          </NavLink>
          <NavLink 
            to="/schemes" 
            className={({ isActive }) => `nav-item nav-schemes ${activeSection ? (activeSection === 'module-schemes' ? 'active' : '') : (isActive ? 'active' : '')}`} 
            onClick={(e) => handleItemClick(e, 'module-schemes')}
          >
            <Landmark size={20} />
            <span>{t('nav.govtSchemes')}</span>
          </NavLink>
          <NavLink 
            to="/alerts" 
            className={({ isActive }) => `nav-item nav-alerts ${activeSection ? (activeSection === 'module-alerts' ? 'active' : '') : (isActive ? 'active' : '')}`} 
            onClick={(e) => handleItemClick(e, 'module-alerts')}
          >
            <BellRing size={20} />
            <span>{t('nav.alerts')}</span>
          </NavLink>
          <NavLink 
            to="/market" 
            className={({ isActive }) => `nav-item nav-market ${activeSection ? (activeSection === 'module-market' ? 'active' : '') : (isActive ? 'active' : '')}`} 
            onClick={(e) => handleItemClick(e, 'module-market')}
          >
            <TrendingUp size={20} />
            <span>{t('nav.marketPrices')}</span>
          </NavLink>
          <NavLink 
            to="/community" 
            className={({ isActive }) => `nav-item nav-community ${activeSection ? (activeSection === 'module-community' ? 'active' : '') : (isActive ? 'active' : '')}`} 
            onClick={(e) => handleItemClick(e, 'module-community')}
          >
            <Users size={20} />
            <span>{t('nav.community')}</span>
          </NavLink>
          <NavLink 
            to="/profile" 
            className={({ isActive }) => `nav-item nav-profile ${activeSection ? (activeSection === 'module-profile' ? 'active' : '') : (isActive ? 'active' : '')}`} 
            onClick={(e) => handleItemClick(e, 'module-profile')}
          >
            <User size={20} />
            <span>{t('nav.profile')}</span>
          </NavLink>
          <NavLink 
            to="/settings" 
            className={({ isActive }) => `nav-item nav-settings ${activeSection ? (activeSection === 'module-settings' ? 'active' : '') : (isActive ? 'active' : '')}`} 
            onClick={(e) => handleItemClick(e, 'module-settings')}
          >
            <Settings size={20} />
            <span>{t('nav.settings')}</span>
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <NavLink to="/profile" className="user-info-link" onClick={handleNavClick}>
            <div className="user-info">
              <div className="user-avatar">{user?.name ? user.name.charAt(0) : 'A'}</div>
              <div className="user-details">
                <p className="user-name">{user?.name || 'Farmer Account'}</p>
                <p className="user-region">
                  <ShieldCheck size={13} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'text-bottom' }} /> 
                  {user?.district || 'Kopargaon'} • {user?.role || 'Farmer'}
                </p>
              </div>
            </div>
          </NavLink>

          <button className="logout-btn" onClick={() => { signOut(); handleNavClick(); }}>
            <LogOut size={20} />
            <span>{t('nav.logout')}</span>
          </button>
        </div>
      </aside>
    </>
  );
};
