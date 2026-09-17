import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  fetchPersonalizedAlerts,
  markAlertAsRead,
  markAllAlertsAsRead
} from '../services/alertService';
import type { FarmAlert, AlertType, AlertSeverity, NotificationSettings } from '../types/alert';
import {
  CheckCheck,
  Settings,
  Search,
  CloudRain,
  Bug,
  Stethoscope,
  TrendingUp,
  Landmark,
  AlertTriangle,
  MapPin,
  Clock,
  ExternalLink,
  ShieldCheck,
  X,
  RefreshCw,
  Sparkles,
  Sliders
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import './Alerts.css';

export const Alerts = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [alerts, setAlerts] = useState<FarmAlert[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search State
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'latest' | 'important' | 'unread'>('important');

  // Modal / Drawer States
  const [selectedAlert, setSelectedAlert] = useState<FarmAlert | null>(null);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Notification Settings State
  const [settings, setSettings] = useState<NotificationSettings>({
    sms_alerts: true,
    push_notifications: true,
    email_notifications: false,
    weather_alerts: true,
    pest_alerts: true,
    market_alerts: true,
    scheme_alerts: true
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchPersonalizedAlerts(user);
      setAlerts(data);
    } catch (e) {
      console.error('Failed to load personalized alerts', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  // Telemetry Counts
  const counts = useMemo(() => {
    const critical = alerts.filter((a) => a.severity === 'critical').length;
    const high = alerts.filter((a) => a.severity === 'high').length;
    const moderate = alerts.filter((a) => a.severity === 'moderate').length;
    const info = alerts.filter((a) => a.severity === 'informational').length;
    const read = alerts.filter((a) => a.is_read).length;
    return { critical, high, moderate, info, read };
  }, [alerts]);

  // Handle Mark Single Read
  const handleMarkRead = async (alertId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const updated = await markAlertAsRead(alertId);
    setAlerts(updated);
  };

  // Handle Mark All Read
  const handleMarkAll = async () => {
    const updated = await markAllAlertsAsRead();
    setAlerts(updated);
  };

  // Icon Helper
  const renderAlertIcon = (type: AlertType) => {
    switch (type) {
      case 'weather':
        return <CloudRain size={22} color="#0288d1" />;
      case 'pest':
      case 'disease':
        return <Bug size={22} color="#d84315" />;
      case 'crop_health':
        return <Stethoscope size={22} color="#2e7d32" />;
      case 'market':
        return <TrendingUp size={22} color="#388e3c" />;
      case 'government':
        return <Landmark size={22} color="#1b5e20" />;
      default:
        return <AlertTriangle size={22} color="#f57f17" />;
    }
  };

  // Severity Badge Helper
  const renderSeverityBadge = (severity: AlertSeverity) => {
    switch (severity) {
      case 'critical':
        return <span className="sev-badge critical">🔴 Critical</span>;
      case 'high':
        return <span className="sev-badge high">🟠 High Risk</span>;
      case 'moderate':
        return <span className="sev-badge moderate">🟡 Moderate</span>;
      case 'informational':
        return <span className="sev-badge info">🟢 Info</span>;
      default:
        return null;
    }
  };

  // Filtered & Sorted Alerts
  const processedAlerts = useMemo(() => {
    let result = alerts.filter((alert) => {
      // Unread Filter
      if (unreadOnly && alert.is_read) return false;

      // Category Filter
      if (activeCategory !== 'All') {
        if (activeCategory === 'Weather' && alert.alert_type !== 'weather') return false;
        if (activeCategory === 'Pest & Disease' && alert.alert_type !== 'pest' && alert.alert_type !== 'disease') return false;
        if (activeCategory === 'Crop Health' && alert.alert_type !== 'crop_health') return false;
        if (activeCategory === 'Market' && alert.alert_type !== 'market') return false;
        if (activeCategory === 'Government' && alert.alert_type !== 'government') return false;
        if (activeCategory === 'System' && alert.alert_type !== 'system') return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = alert.title.toLowerCase().includes(q) || (alert.title_mr && alert.title_mr.includes(q));
        const matchDesc = alert.description.toLowerCase().includes(q);
        const matchCrop = alert.crop?.toLowerCase().includes(q);
        const matchLoc = alert.location.toLowerCase().includes(q);
        return matchTitle || matchDesc || matchCrop || matchLoc;
      }

      return true;
    });

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'unread') {
        if (!a.is_read && b.is_read) return -1;
        if (a.is_read && !b.is_read) return 1;
      }
      if (sortBy === 'latest') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      // 'important' uses severity weight
      const weight: Record<string, number> = { critical: 4, high: 3, moderate: 2, informational: 1 };
      const wA = weight[a.severity] || 0;
      const wB = weight[b.severity] || 0;
      if (wA !== wB) return wB - wA;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    return result;
  }, [alerts, activeCategory, unreadOnly, searchQuery, sortBy]);

  // Separate Critical Section
  const criticalAlerts = processedAlerts.filter((a) => a.severity === 'critical');
  const otherAlerts = processedAlerts.filter((a) => a.severity !== 'critical');

  const categories = [
    { label: 'All', icon: '🔔' },
    { label: 'Weather', icon: '🌧️' },
    { label: 'Pest & Disease', icon: '🐛' },
    { label: 'Crop Health', icon: '🌱' },
    { label: 'Market', icon: '💰' },
    { label: 'Government', icon: '🏛️' },
    { label: 'System', icon: '📢' }
  ];

  return (
    <div className="alerts-page animate-fade-in">
      {/* 1. PAGE HEADER */}
      <header className="alerts-header-card glass-panel">
        <div className="header-top-row">
          <div>
            <h1>{t('alerts.title')}</h1>
            <p className="subtitle">
              {t('alerts.subtitle')}
            </p>
          </div>

          <div className="header-actions">
            <button className="mark-all-read-btn" onClick={handleMarkAll} disabled={counts.read === alerts.length}>
              <CheckCheck size={16} />
              <span>{t('alerts.btnMarkAllRead')}</span>
            </button>
            <button className="settings-icon-btn" onClick={() => setShowSettingsModal(true)} title={t('alerts.btnSettings')}>
              <Settings size={18} />
            </button>
          </div>
        </div>

        {/* Telemetry Summary Cards */}
        <div className="alerts-telemetry-row">
          <div className="telemetry-chip critical">
            <span className="dot"></span>
            <strong>{counts.critical}</strong> {t('alerts.summaryCritical')}
          </div>
          <div className="telemetry-chip high">
            <span className="dot"></span>
            <strong>{counts.high}</strong> {t('alerts.summaryWarnings')}
          </div>
          <div className="telemetry-chip moderate">
            <span className="dot"></span>
            <strong>{counts.moderate}</strong> {t('alerts.summaryModerate')}
          </div>
          <div className="telemetry-chip info">
            <span className="dot"></span>
            <strong>{counts.info}</strong> {t('alerts.summaryInfo')}
          </div>
          <div className="telemetry-chip read">
            <CheckCheck size={14} />
            <strong>{counts.read}</strong> {t('alerts.summaryRead')}
          </div>
        </div>
      </header>

      {/* 2 & 3. FILTERS, UNREAD TOGGLE & SEARCH TOOLBAR */}
      <div className="alerts-toolbar glass-panel">
        <div className="search-bar-wrap">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search alerts, crops, locations..."
          />
          {searchQuery && (
            <button className="clear-btn" onClick={() => setSearchQuery('')}>
              <X size={16} />
            </button>
          )}
        </div>

        <div className="sort-wrap">
          <Sliders size={16} color="var(--color-text-muted)" />
          <select value={sortBy} onChange={(e: any) => setSortBy(e.target.value)} className="sort-select">
            <option value="important">Most Important</option>
            <option value="latest">Latest First</option>
            <option value="unread">Unread First</option>
          </select>
        </div>

        <label className="unread-toggle-label">
          <input
            type="checkbox"
            checked={unreadOnly}
            onChange={(e) => setUnreadOnly(e.target.checked)}
          />
          <span>Unread Only</span>
        </label>
      </div>

      {/* Horizontal Category Filter Chips */}
      <div className="category-scroll-bar">
        {categories.map((cat) => (
          <button
            key={cat.label}
            className={`cat-filter-chip ${activeCategory === cat.label ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat.label)}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Main Feed Content */}
      {loading ? (
        <div className="alerts-loading glass-panel">
          <RefreshCw size={24} className="spin-icon" />
          <span>Loading early-warning intelligence feed...</span>
        </div>
      ) : processedAlerts.length === 0 ? (
        /* 16. EMPTY STATE */
        <div className="empty-alerts-box glass-panel animate-fade-in">
          <div className="empty-icon-wrap">
            <Sparkles size={48} color="#2e7d32" />
          </div>
          <h2>🌱 You're all caught up!</h2>
          <p>No new alerts for your farms and crops.</p>
          <button className="refresh-btn" onClick={loadData}>
            <RefreshCw size={16} /> Refresh Alerts
          </button>
        </div>
      ) : (
        <div className="alerts-feed-wrapper">
          {/* 4. CRITICAL ALERTS SECTION */}
          {criticalAlerts.length > 0 && (
            <section className="critical-section">
              <div className="section-title-wrap">
                <h2>🚨 Critical Alerts</h2>
                <span className="crit-count">{criticalAlerts.length} Urgent Action Required</span>
              </div>
              <div className="critical-alerts-grid">
                {criticalAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`alert-card-item critical-card ${alert.is_read ? 'read' : 'unread'}`}
                    onClick={() => setSelectedAlert(alert)}
                  >
                    <div className="card-top">
                      <div className="alert-type-badge">
                        {renderAlertIcon(alert.alert_type)}
                        <span className="type-name">{alert.alert_type.toUpperCase()} ALERT</span>
                      </div>
                      <span className="time-ago">
                        <Clock size={13} />
                        {new Date(alert.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <h3 className="alert-title">{alert.title}</h3>
                    {alert.title_mr && <h4 className="alert-title-mr">{alert.title_mr}</h4>}

                    <div className="location-row">
                      <MapPin size={14} color="#d32f2f" />
                      <span>{alert.location}</span>
                    </div>

                    <p className="alert-desc">{alert.description}</p>

                    {alert.crop && (
                      <div className="affected-crops-row">
                        <span className="crops-label">Affected crops:</span>
                        {alert.crop.split('•').map((c, i) => (
                          <span key={i} className="crop-pill">
                            🌱 {c.trim()}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="card-bottom">
                      {renderSeverityBadge(alert.severity)}

                      <div className="card-btn-group">
                        <button className="btn-view-details" onClick={() => setSelectedAlert(alert)}>
                          View Details
                        </button>
                        {!alert.is_read && (
                          <button
                            className="btn-mark-read"
                            onClick={(e) => handleMarkRead(alert.id, e)}
                            title="Mark as read"
                          >
                            <CheckCheck size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* OTHER ALERTS FEED */}
          {otherAlerts.length > 0 && (
            <section className="general-alerts-section">
              {criticalAlerts.length > 0 && <h2>📋 Regional Advisory & Market Alerts</h2>}

              <div className="alerts-cards-grid">
                {otherAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`alert-card-item ${alert.severity}-card ${alert.is_read ? 'read' : 'unread'}`}
                    onClick={() => setSelectedAlert(alert)}
                  >
                    <div className="card-top">
                      <div className="alert-type-badge">
                        {renderAlertIcon(alert.alert_type)}
                        <span className="type-name">{alert.alert_type.toUpperCase()}</span>
                      </div>
                      <div className="right-top-meta">
                        {!alert.is_read && <span className="unread-dot-badge">● Unread</span>}
                        <span className="time-ago">
                          {new Date(alert.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>

                    <h3 className="alert-title">{alert.title}</h3>

                    <div className="location-row">
                      <MapPin size={14} />
                      <span>{alert.location}</span>
                    </div>

                    <p className="alert-desc">{alert.description}</p>

                    {/* Specialized Information Widgets inside Card */}
                    {alert.alert_type === 'weather' && alert.rainfall_mm && (
                      <div className="widget-box weather-widget">
                        <div>
                          <span className="w-val">{alert.rainfall_mm}mm+</span>
                          <span className="w-lbl">Expected Rainfall</span>
                        </div>
                        <div>
                          <span className="w-val">{alert.expected_hours}h</span>
                          <span className="w-lbl">Time Window</span>
                        </div>
                      </div>
                    )}

                    {alert.alert_type === 'market' && alert.current_price && (
                      <div className="widget-box market-widget">
                        <div>
                          <span className="m-val">{alert.current_price}</span>
                          <span className="m-lbl">{alert.market_name}</span>
                        </div>
                        <div>
                          <span className="m-val green">{alert.price_change}</span>
                          <span className="m-lbl">Price Movement</span>
                        </div>
                      </div>
                    )}

                    {alert.crop && (
                      <div className="affected-crops-row">
                        {alert.crop.split('•').map((c, i) => (
                          <span key={i} className="crop-pill">
                            🌱 {c.trim()}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="verified-source-row">
                      <ShieldCheck size={14} color="#2e7d32" />
                      <span>{alert.source}</span>
                    </div>

                    <div className="card-bottom">
                      {renderSeverityBadge(alert.severity)}

                      <div className="card-btn-group">
                        {alert.action_route && (
                          <button
                            className="btn-action-route"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(alert.action_route!);
                            }}
                          >
                            <span>{alert.action_text || 'Open Module'}</span>
                            <ExternalLink size={14} />
                          </button>
                        )}

                        <button className="btn-view-details" onClick={() => setSelectedAlert(alert)}>
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      {/* 14. NOTIFICATION DETAIL DRAWER / MODAL */}
      {selectedAlert && (
        <div className="modal-overlay animate-fade-in" onClick={() => setSelectedAlert(null)}>
          <div className="modal-content drawer-content glass-panel" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setSelectedAlert(null)}>
              <X size={20} />
            </button>

            <div className="drawer-header">
              <div className="d-icon-badge">{renderAlertIcon(selectedAlert.alert_type)}</div>
              <div>
                <div className="d-meta-row">
                  {renderSeverityBadge(selectedAlert.severity)}
                  <span className="d-type">{selectedAlert.alert_type.toUpperCase()}</span>
                </div>
                <h2>{selectedAlert.title}</h2>
                {selectedAlert.title_mr && <h3 className="d-mr-title">{selectedAlert.title_mr}</h3>}
              </div>
            </div>

            <div className="drawer-body">
              <div className="detail-meta-grid">
                <div>
                  <span className="lbl">Location:</span>
                  <span className="val">📍 {selectedAlert.location}</span>
                </div>
                <div>
                  <span className="lbl">Issued Time:</span>
                  <span className="val">
                    {new Date(selectedAlert.created_at).toLocaleString('en-IN', {
                      dateStyle: 'medium',
                      timeStyle: 'short'
                    })}
                  </span>
                </div>
                {selectedAlert.crop && (
                  <div>
                    <span className="lbl">Target Crops:</span>
                    <span className="val">🌱 {selectedAlert.crop}</span>
                  </div>
                )}
              </div>

              <div className="drawer-section">
                <h4>📜 Detailed Explanation</h4>
                <p>{selectedAlert.description}</p>
              </div>

              {selectedAlert.recommended_actions && selectedAlert.recommended_actions.length > 0 && (
                <div className="drawer-section">
                  <h4>💡 Recommended Action Plan for Farmers</h4>
                  <ul className="action-list">
                    {selectedAlert.recommended_actions.map((act, idx) => (
                      <li key={idx}>
                        <span className="act-bullet">✓</span>
                        <span>{act}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="drawer-source-card">
                <ShieldCheck size={20} color="#2e7d32" />
                <div>
                  <div className="src-title">Verified Agricultural Source</div>
                  <div className="src-name">{selectedAlert.source}</div>
                  <div className="src-date">
                    Last Updated: {new Date(selectedAlert.created_at).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            <div className="drawer-footer">
              {selectedAlert.action_route && (
                <button
                  className="drawer-action-btn"
                  onClick={() => {
                    const route = selectedAlert.action_route!;
                    setSelectedAlert(null);
                    navigate(route);
                  }}
                >
                  <span>{selectedAlert.action_text || 'Open Integrated Feature'}</span>
                  <ExternalLink size={18} />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* NOTIFICATION SETTINGS MODAL */}
      {showSettingsModal && (
        <div className="modal-overlay animate-fade-in" onClick={() => setShowSettingsModal(false)}>
          <div className="modal-content settings-modal glass-panel" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setShowSettingsModal(false)}>
              <X size={20} />
            </button>

            <div className="modal-header">
              <Settings size={28} color="#1b5e20" />
              <div>
                <h2>Notification Preferences</h2>
                <p>Customize how and when you receive agricultural alerts</p>
              </div>
            </div>

            <div className="settings-body">
              <div className="settings-group">
                <h3>Delivery Channels</h3>
                <label className="toggle-row">
                  <span>SMS Weather & Pest Alerts</span>
                  <input
                    type="checkbox"
                    checked={settings.sms_alerts}
                    onChange={(e) => setSettings({ ...settings, sms_alerts: e.target.checked })}
                  />
                </label>
                <label className="toggle-row">
                  <span>In-App Push Notifications</span>
                  <input
                    type="checkbox"
                    checked={settings.push_notifications}
                    onChange={(e) => setSettings({ ...settings, push_notifications: e.target.checked })}
                  />
                </label>
              </div>

              <div className="settings-group">
                <h3>Alert Topics</h3>
                <label className="toggle-row">
                  <span>Weather Warnings (Rainfall, Frost, Drought)</span>
                  <input
                    type="checkbox"
                    checked={settings.weather_alerts}
                    onChange={(e) => setSettings({ ...settings, weather_alerts: e.target.checked })}
                  />
                </label>
                <label className="toggle-row">
                  <span>Pest & Disease Outbreak Warnings</span>
                  <input
                    type="checkbox"
                    checked={settings.pest_alerts}
                    onChange={(e) => setSettings({ ...settings, pest_alerts: e.target.checked })}
                  />
                </label>
                <label className="toggle-row">
                  <span>Market Price Fluctuations</span>
                  <input
                    type="checkbox"
                    checked={settings.market_alerts}
                    onChange={(e) => setSettings({ ...settings, market_alerts: e.target.checked })}
                  />
                </label>
              </div>

              <button className="save-settings-btn" onClick={() => setShowSettingsModal(false)}>
                Save Notification Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
