import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCheck, ExternalLink, CloudRain, Bug, Stethoscope, TrendingUp, Landmark, AlertTriangle } from 'lucide-react';
import { fetchPersonalizedAlerts, markAlertAsRead, markAllAlertsAsRead } from '../services/alertService';
import type { FarmAlert } from '../types/alert';
import { useAuth } from '../context/AuthContext';
import './NotificationBell.css';

export const NotificationBell = () => {
  const [alerts, setAlerts] = useState<FarmAlert[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadAlerts = async () => {
      const data = await fetchPersonalizedAlerts(user);
      setAlerts(data);
    };
    loadAlerts();
    const interval = setInterval(loadAlerts, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = alerts.filter((a) => !a.is_read).length;

  const handleMarkAll = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = await markAllAlertsAsRead();
    setAlerts(updated);
  };

  const handleSelectAlert = async (alert: FarmAlert) => {
    if (!alert.is_read) {
      const updated = await markAlertAsRead(alert.id);
      setAlerts(updated);
    }
    setIsOpen(false);
    if (alert.action_route) {
      navigate(alert.action_route);
    } else {
      navigate('/alerts');
    }
  };

  const renderIcon = (type: string) => {
    switch (type) {
      case 'weather':
        return <CloudRain size={16} color="#0288d1" />;
      case 'pest':
      case 'disease':
        return <Bug size={16} color="#d84315" />;
      case 'crop_health':
        return <Stethoscope size={16} color="#2e7d32" />;
      case 'market':
        return <TrendingUp size={16} color="#388e3c" />;
      case 'government':
        return <Landmark size={16} color="#1b5e20" />;
      default:
        return <AlertTriangle size={16} color="#f57f17" />;
    }
  };

  return (
    <div className="notification-bell-container" ref={dropdownRef}>
      <button
        className={`bell-trigger-btn ${unreadCount > 0 ? 'has-unread' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        title="Alerts & Notifications"
      >
        <Bell size={20} />
        {unreadCount > 0 && <span className="bell-badge-num">{unreadCount}</span>}
      </button>

      {isOpen && (
        <div className="notification-dropdown glass-panel animate-fade-in">
          <div className="dropdown-header">
            <div className="dh-title">
              <h3>Recent Notifications</h3>
              <span className="dh-count">{unreadCount} Unread</span>
            </div>
            {unreadCount > 0 && (
              <button className="mark-all-btn" onClick={handleMarkAll}>
                <CheckCheck size={14} /> Mark all read
              </button>
            )}
          </div>

          <div className="dropdown-list">
            {alerts.length > 0 ? (
              alerts.slice(0, 5).map((item) => (
                <div
                  key={item.id}
                  className={`dropdown-item ${!item.is_read ? 'unread' : ''}`}
                  onClick={() => handleSelectAlert(item)}
                >
                  <div className="item-icon-wrap">{renderIcon(item.alert_type)}</div>
                  <div className="item-content">
                    <div className="item-title-row">
                      <h4 className="item-title">{item.title}</h4>
                      {!item.is_read && <span className="unread-dot"></span>}
                    </div>
                    <p className="item-desc">{item.description}</p>
                    <div className="item-meta">
                      <span className="item-loc">📍 {item.location}</span>
                      <span className="item-time">
                        {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="dropdown-empty">🌱 No active notifications</div>
            )}
          </div>

          <div className="dropdown-footer">
            <button
              className="view-all-alerts-btn"
              onClick={() => {
                setIsOpen(false);
                navigate('/alerts');
              }}
            >
              <span>View All Intelligence Alerts</span>
              <ExternalLink size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
