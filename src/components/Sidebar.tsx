import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BellRing, TrendingUp, Users, Settings, LogOut, Sprout, ShieldCheck, Stethoscope, User, Landmark, Map, Compass, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../i18n/LanguageContext';
import './Sidebar.css';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const { signOut, user } = useAuth();
  const { t } = useLanguage();

  const handleNavClick = () => {
    if (onClose) onClose();
  };

  return (
    <>
      {isOpen && <div className="sidebar-backdrop open" onClick={onClose} />}
      
      <aside className={`sidebar glass-panel ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="brand-title-wrap">
            <div className="brand-logo-icon">
              <Sprout size={24} color="#1b5e20" />
            </div>
            <div>
              <h2 className="brand-name">AgriRakshak</h2>
            </div>
          </div>
        </div>
        
        <nav className="sidebar-nav">
          <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={handleNavClick} end>
            <LayoutDashboard size={20} />
            <span>{t('nav.dashboard')}</span>
          </NavLink>
          <NavLink to="/my-farm" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={handleNavClick}>
            <Compass size={20} />
            <span>{t('nav.myFarm', 'My Farm')}</span>
          </NavLink>
          <NavLink to="/risk-map" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={handleNavClick}>
            <Map size={20} />
            <span>{t('nav.riskMap', 'Risk Map')}</span>
          </NavLink>
          <NavLink to="/crop-doctor" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={handleNavClick}>
            <Stethoscope size={20} />
            <span>{t('nav.cropDoctor')}</span>
          </NavLink>
          <NavLink to="/officer-portal" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={handleNavClick}>
            <UserCheck size={20} />
            <span>{t('nav.officerPortal', 'Officer Portal')}</span>
          </NavLink>
          <NavLink to="/schemes" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={handleNavClick}>
            <Landmark size={20} />
            <span>{t('nav.govtSchemes')}</span>
          </NavLink>
          <NavLink to="/alerts" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={handleNavClick}>
            <BellRing size={20} />
            <span>{t('nav.alerts')}</span>
          </NavLink>
          <NavLink to="/market" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={handleNavClick}>
            <TrendingUp size={20} />
            <span>{t('nav.marketPrices')}</span>
          </NavLink>
          <NavLink to="/community" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={handleNavClick}>
            <Users size={20} />
            <span>{t('nav.community')}</span>
          </NavLink>
          <NavLink to="/profile" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={handleNavClick}>
            <User size={20} />
            <span>{t('nav.profile')}</span>
          </NavLink>
          <NavLink to="/settings" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={handleNavClick}>
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
