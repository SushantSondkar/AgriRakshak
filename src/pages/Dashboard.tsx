import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../i18n/LanguageContext';
import { fetchForecast, type WeatherData } from '../services/api';
import { getUserFarms, getUserCrops, addNewFarm } from '../services/farmService';
import { fetchPersonalizedAlerts } from '../services/alertService';
import { RAW_MARKET_DATA } from '../services/marketData';
import { SCHEMES_DATA } from '../services/schemesData';
import type { Farm, FarmCrop } from '../types/farm';
import type { FarmAlert } from '../types/alert';
import { LanguageSelector } from '../components/LanguageSelector';
import { NotificationBell } from '../components/NotificationBell';
import {
  Sprout,
  Sun,
  CloudRain,
  Wind,
  Droplets,
  AlertTriangle,
  TrendingUp,
  Landmark,
  MapPin,
  Plus,
  ArrowRight,
  ChevronRight,
  ShieldAlert,
  Sparkles,
  Stethoscope,
  Building,
  TrendingDown,
  X,
  Lightbulb,
  RefreshCw,
  CheckCircle2
} from 'lucide-react';
import './Dashboard.css';

export const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();

  // Data States
  const [loading, setLoading] = useState(true);
  const [weatherError, setWeatherError] = useState<string | null>(null);
  const [dataError, setDataError] = useState<string | null>(null);

  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [farms, setFarms] = useState<Farm[]>([]);
  const [crops, setCrops] = useState<FarmCrop[]>([]);
  const [alerts, setAlerts] = useState<FarmAlert[]>([]);
  
  // Modals
  const [showAddFarmModal, setShowAddFarmModal] = useState(false);
  const [newFarmName, setNewFarmName] = useState('');
  const [newFarmAcres, setNewFarmAcres] = useState('2.5');
  const [newFarmOwnership, setNewFarmOwnership] = useState<'Owned' | 'Leased'>('Owned');

  const farmerName = user?.name || 'Ramesh Patil';
  const farmerDistrict = user?.district || 'Kopargaon';
  const farmerState = user?.state || 'Maharashtra';

  // Time-aware greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('dashboard.greetingMorning', 'Good Morning');
    if (hour < 17) return t('dashboard.greetingAfternoon', 'Good Afternoon');
    return t('dashboard.greetingEvening', 'Good Evening');
  };

  const loadDashboardData = async () => {
    setLoading(true);
    setWeatherError(null);
    setDataError(null);

    try {
      const [farmList, cropList, alertList] = await Promise.all([
        getUserFarms(user),
        getUserCrops(user),
        fetchPersonalizedAlerts(user)
      ]);

      setFarms(farmList);
      setCrops(cropList);
      setAlerts(alertList);
    } catch (err) {
      console.error('Error fetching farm dashboard data:', err);
      setDataError('Unable to load farm data.');
    }

    try {
      const weatherRes = await fetchForecast(19.88, 74.47); // Kopargaon coordinates
      setWeather(weatherRes);
    } catch (wErr) {
      console.error('Error fetching weather data:', wErr);
      setWeatherError('Unable to load weather data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  // Derived Telemetry Statistics
  const totalAcres = farms.reduce((acc, f) => acc + (f.land_size_acres || 0), 0);
  const activeCropNames = Array.from(new Set(crops.map(c => c.crop_name)));
  const unreadAlerts = alerts.filter(a => !a.is_read);
  const criticalAlerts = alerts.filter(a => a.severity === 'critical' || a.severity === 'high');
  const topCriticalAlert = criticalAlerts[0] || alerts[0];

  // Market & Schemes Snippets
  const topMarketPrices = RAW_MARKET_DATA.slice(0, 3);
  const topSchemes = SCHEMES_DATA.slice(0, 2);

  // Handle Add Farm Submit
  const handleAddFarmSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFarmName.trim()) return;

    const acres = parseFloat(newFarmAcres) || 1.0;
    const created = await addNewFarm(
      {
        farm_name: newFarmName,
        land_size_acres: acres,
        ownership_type: newFarmOwnership,
        location_village: farmerDistrict,
        district: farmerDistrict,
        state: farmerState
      },
      user
    );

    setFarms(prev => [created, ...prev]);
    setShowAddFarmModal(false);
    setNewFarmName('');
  };

  return (
    <div className="advisory-dashboard-container animate-fade-in">
      {/* 1. TOP HEADER */}
      <header className="dash-topbar">
        <div></div>

        <div className="dash-top-actions">
          <LanguageSelector />
          <NotificationBell />
          <div className="dash-user-badge">
            <div className="dash-user-avatar">{farmerName.charAt(0)}</div>
            <div className="dash-user-meta">
              <span className="dash-user-name">{farmerName}</span>
              <span className="dash-user-sub">{farmerDistrict} • {user?.role || 'Farmer'}</span>
            </div>
          </div>
        </div>
      </header>

      {/* 2. MAIN HERO GREETING SECTION */}
      <section className="dash-hero-banner">
        <div>
          <h1 className="dash-hero-title">
            ☀️ {getGreeting()}, {farmerName}!
          </h1>
          <p className="dash-hero-sub">
            {t('dashboard.heroSubtitle', "Here's what's happening on your farms today.")}
          </p>
        </div>

        <div className="dash-hero-tagline">
          <Sparkles size={16} color="#ffffff" />
          <span>{t('dashboard.agriculturalMotto', 'Better information. Better decisions. Healthier crops.')}</span>
        </div>
      </section>

      {/* 3. FARM OVERVIEW STATISTICS (5 CARDS) */}
      <section className="dash-stats-grid">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="stat-card">
              <div className="skeleton-box" style={{ width: '44px', height: '44px' }}></div>
              <div style={{ flex: 1 }}>
                <div className="skeleton-box" style={{ width: '70%', height: '12px', marginBottom: '8px' }}></div>
                <div className="skeleton-box" style={{ width: '90%', height: '22px' }}></div>
              </div>
            </div>
          ))
        ) : (
          <>
            {/* CARD 1: Total Land Area */}
            <div className="stat-card" onClick={() => navigate('/profile')}>
              <div className="stat-icon-wrap green">
                <Sprout size={22} />
              </div>
              <div className="stat-content">
                <span className="stat-title">{t('dashboard.totalLandArea', 'Total Land Area')}</span>
                <span className="stat-value">{totalAcres.toFixed(1)} Acres</span>
                <span className="stat-sub">{farms.length} {farms.length === 1 ? 'Farm' : 'Farms'}</span>
              </div>
            </div>

            {/* CARD 2: Active Crops */}
            <div className="stat-card" onClick={() => navigate('/crop-doctor')}>
              <div className="stat-icon-wrap emerald">
                <Stethoscope size={22} />
              </div>
              <div className="stat-content">
                <span className="stat-title">{t('dashboard.activeCrops', 'Active Crops')}</span>
                <span className="stat-value">{crops.length} Crops</span>
                <span className="stat-sub">{activeCropNames.length > 0 ? activeCropNames.join(' • ') : 'No Crops'}</span>
              </div>
            </div>

            {/* CARD 3: Unread Alerts */}
            <div className="stat-card" onClick={() => navigate('/alerts')}>
              <div className="stat-icon-wrap red">
                <ShieldAlert size={22} />
              </div>
              <div className="stat-content">
                <span className="stat-title">{t('dashboard.unreadAlerts', 'Unread Alerts')}</span>
                <span className="stat-value">{unreadAlerts.length} Alerts</span>
                <span className="stat-sub" style={{ color: '#c62828', fontWeight: 700 }}>
                  {criticalAlerts.length} Critical
                </span>
              </div>
            </div>

            {/* CARD 4: Eligible Schemes */}
            <div className="stat-card" onClick={() => navigate('/schemes')}>
              <div className="stat-icon-wrap gold">
                <Landmark size={22} />
              </div>
              <div className="stat-content">
                <span className="stat-title">{t('dashboard.eligibleSchemes', 'Eligible Schemes')}</span>
                <span className="stat-value">13 Schemes</span>
                <span className="stat-sub">{t('dashboard.checkEligibility', 'Check your eligibility')}</span>
              </div>
            </div>

            {/* CARD 5: Market Watch */}
            <div className="stat-card" onClick={() => navigate('/market')}>
              <div className="stat-icon-wrap blue">
                <TrendingUp size={22} />
              </div>
              <div className="stat-content">
                <span className="stat-title">{t('dashboard.marketWatch', 'Market Watch')}</span>
                <span className="stat-value">2 Price Changes</span>
                <span className="stat-sub" style={{ color: '#2e7d32', fontWeight: 700 }}>Onion ↑ 8%</span>
              </div>
            </div>
          </>
        )}
      </section>

      {/* 4. TODAY'S WEATHER & CRITICAL ALERTS ROW (2-COLUMN GRID) */}
      <section className="dash-row-grid-2">
        {/* TODAY'S WEATHER CARD */}
        <div className="dash-card">
          <div className="card-header-flex">
            <div className="card-title-wrap">
              <Sun size={24} color="#f57f17" />
              <h3>{t('dashboard.todaysWeatherTitle', "Today's Weather")}</h3>
            </div>
            <button className="btn-text-link" onClick={() => navigate('/alerts')}>
              <span>{t('dashboard.viewDetailedForecast', 'View Detailed Forecast')}</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="skeleton-box" style={{ width: '100%', height: '60px' }}></div>
              <div className="skeleton-box" style={{ width: '100%', height: '80px' }}></div>
            </div>
          ) : weatherError ? (
            <div className="section-error-banner">
              <span>{weatherError}</span>
              <button className="retry-btn" onClick={loadDashboardData}>
                <RefreshCw size={12} /> Retry
              </button>
            </div>
          ) : weather ? (
            <div>
              <div className="weather-main-row">
                <div className="weather-temp-badge">
                  {Math.round(weather.temperature_2m_max[0])}°C
                </div>
                <div className="weather-desc-box">
                  <span className="weather-condition">Partly Cloudy</span>
                  <span className="weather-location">📍 {farmerDistrict}, Maharashtra</span>
                </div>
              </div>

              <div className="weather-metrics-grid">
                <div className="metric-item">
                  <CloudRain size={18} color="#0288d1" />
                  <span className="metric-val">{weather.precipitation_sum[0]} mm</span>
                  <span className="metric-lbl">{t('dashboard.rainChance', 'Rain Chance')}</span>
                </div>
                <div className="metric-item">
                  <Droplets size={18} color="#00897b" />
                  <span className="metric-val">65%</span>
                  <span className="metric-lbl">{t('dashboard.humidity', 'Humidity')}</span>
                </div>
                <div className="metric-item">
                  <Wind size={18} color="#5e35b1" />
                  <span className="metric-val">12 km/h</span>
                  <span className="metric-lbl">{t('dashboard.windSpeed', 'Wind Speed')}</span>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* CRITICAL ALERTS CARD */}
        <div className="dash-card critical-card">
          <div className="card-header-flex">
            <div className="card-title-wrap">
              <AlertTriangle size={24} color="#d32f2f" />
              <h3 style={{ color: '#d32f2f' }}>{t('dashboard.criticalAlertsTitle', 'Critical Alerts')}</h3>
            </div>
            <button className="btn-text-link" onClick={() => navigate('/alerts')} style={{ color: '#d32f2f' }}>
              <span>{t('dashboard.viewAll', 'View All')}</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {loading ? (
            <div className="skeleton-box" style={{ width: '100%', height: '140px' }}></div>
          ) : topCriticalAlert ? (
            <div className="critical-alert-body">
              <div>
                <div className="alert-top-badge-row">
                  <span className="sev-badge-high">{t('dashboard.severityHigh', 'HIGH SEVERITY')}</span>
                  <span style={{ fontSize: '0.78rem', color: '#777' }}>2 hours ago</span>
                </div>
                <div className="alert-item-title">{topCriticalAlert.title}</div>
                <div className="alert-item-desc">{topCriticalAlert.description}</div>
              </div>

              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#555', marginBottom: '4px' }}>
                  {t('dashboard.affectedCropsLabel', 'Affected crops:')}
                </div>
                <div className="affected-crops-chips">
                  <span className="crop-chip-mini">Onion</span>
                  <span className="crop-chip-mini">Tomato</span>
                  <span className="crop-chip-mini">Grapes</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="dash-empty-state">
              <CheckCircle2 size={36} color="#2e7d32" />
              <h4>✓ You're all caught up!</h4>
              <p style={{ fontSize: '0.85rem' }}>No critical alerts currently reported for your region.</p>
            </div>
          )}
        </div>
      </section>

      {/* 5. MY FARMS, MY CROPS & MARKET PRICES ROW (3-COLUMN GRID) */}
      <section className="dash-row-grid-3">
        {/* YOUR FARMS CARD */}
        <div className="dash-card">
          <div className="card-header-flex">
            <div className="card-title-wrap">
              <Building size={22} color="#1b5e20" />
              <h3>{t('dashboard.yourFarmsTitle', 'Your Farms')}</h3>
            </div>
            <button className="btn-text-link" onClick={() => setShowAddFarmModal(true)}>
              <Plus size={14} />
              <span>{t('dashboard.addFarmBtn', '+ Add New Farm')}</span>
            </button>
          </div>

          {loading ? (
            <div className="skeleton-box" style={{ width: '100%', height: '120px' }}></div>
          ) : farms.length === 0 ? (
            <div className="dash-empty-state">
              <Sprout size={36} color="#1b5e20" />
              <h4>🌾 No farms added yet.</h4>
              <p style={{ fontSize: '0.82rem' }}>{t('dashboard.addFarmPrompt', 'Add your first farm to receive personalized advisories.')}</p>
              <button className="btn-submit-farm" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }} onClick={() => setShowAddFarmModal(true)}>
                + Add Farm
              </button>
            </div>
          ) : (
            <div className="farms-list-wrap">
              {farms.map(f => (
                <div key={f.id} className="farm-item-card">
                  <div>
                    <div className="farm-name">{f.farm_name}</div>
                    <div className="farm-meta">{f.land_size_acres} Acres • {f.location_village}</div>
                  </div>
                  <span className="farm-type-pill">{f.ownership_type}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* YOUR CROPS CARD */}
        <div className="dash-card">
          <div className="card-header-flex">
            <div className="card-title-wrap">
              <Sprout size={22} color="#1b5e20" />
              <h3>{t('dashboard.yourCropsTitle', 'Your Crops')}</h3>
            </div>
            <button className="btn-text-link" onClick={() => navigate('/crop-doctor')}>
              <span>{t('dashboard.viewAll', 'View All')}</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {loading ? (
            <div className="skeleton-box" style={{ width: '100%', height: '120px' }}></div>
          ) : crops.length === 0 ? (
            <div className="dash-empty-state">
              <Sprout size={36} color="#1b5e20" />
              <h4>🌱 No crops added.</h4>
              <button className="btn-submit-farm" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }} onClick={() => navigate('/crop-doctor')}>
                + Add Crop
              </button>
            </div>
          ) : (
            <div className="crops-list-wrap">
              {crops.map(c => (
                <div key={c.id} className="crop-item-card" onClick={() => navigate('/crop-doctor')}>
                  <div>
                    <div className="crop-name">{c.crop_name}</div>
                    <div className="crop-stage">{c.acres} Acres • Stage: {c.growth_stage}</div>
                  </div>
                  <span className={`status-badge-mini ${c.health_status.toLowerCase()}`}>
                    {c.health_status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* MARKET PRICES CARD */}
        <div className="dash-card">
          <div className="card-header-flex">
            <div className="card-title-wrap">
              <TrendingUp size={22} color="#1b5e20" />
              <h3>{t('dashboard.marketPricesTitle', 'Market Prices')}</h3>
            </div>
            <button className="btn-text-link" onClick={() => navigate('/market')}>
              <span>{t('dashboard.viewAll', 'View All')}</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div className="market-list-wrap">
            {topMarketPrices.map(m => (
              <div key={m.id} className="market-item-card">
                <div>
                  <div className="market-crop-name">{m.crop} ({m.cropMr})</div>
                  <div style={{ fontSize: '0.78rem', color: '#666' }}>{m.mandiName} Mandi</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="market-price-val">₹{m.modalPrice.toLocaleString()} / {m.unit}</div>
                  <span className={`trend-badge-pill ${m.priceChangePercent >= 0 ? 'up' : 'down'}`}>
                    {m.priceChangePercent >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    {m.priceChangePercent >= 0 ? `+${m.priceChangePercent}%` : `${m.priceChangePercent}%`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. GOVT SCHEMES, RECENT ALERTS & QUICK ACTIONS (3-COLUMN GRID) */}
      <section className="dash-row-grid-3">
        {/* GOVT SCHEMES FOR YOU */}
        <div className="dash-card">
          <div className="card-header-flex">
            <div className="card-title-wrap">
              <Landmark size={22} color="#1b5e20" />
              <h3>{t('dashboard.govtSchemesForYouTitle', 'Government Schemes For You')}</h3>
            </div>
            <button className="btn-text-link" onClick={() => navigate('/schemes')}>
              <span>{t('dashboard.viewAll', 'View All')}</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div>
            {topSchemes.map(s => (
              <div key={s.id} className="scheme-card-item">
                <div>
                  <div className="scheme-name">{s.scheme_name}</div>
                  <div className="scheme-dept">{s.department}</div>
                </div>
                <span className="eligible-tag">{t('dashboard.eligibleBadge', 'Eligible')}</span>
              </div>
            ))}
          </div>
        </div>

        {/* RECENT ALERTS */}
        <div className="dash-card">
          <div className="card-header-flex">
            <div className="card-title-wrap">
              <ShieldAlert size={22} color="#1b5e20" />
              <h3>{t('dashboard.recentAlertsTitle', 'Recent Alerts')}</h3>
            </div>
            <button className="btn-text-link" onClick={() => navigate('/alerts')}>
              <span>{t('dashboard.viewAll', 'View All')}</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div className="recent-alerts-feed">
            {alerts.slice(0, 3).map(a => (
              <div key={a.id} className="recent-alert-item" onClick={() => navigate('/alerts')} style={{ cursor: 'pointer' }}>
                <CloudRain size={16} color="#0288d1" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div className="recent-alert-title">{a.title}</div>
                  <div className="recent-alert-time">{a.location} • 2 hours ago</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div className="dash-card">
          <div className="card-header-flex">
            <div className="card-title-wrap">
              <Sparkles size={22} color="#1b5e20" />
              <h3>{t('dashboard.quickActionsTitle', 'Quick Actions')}</h3>
            </div>
          </div>

          <div className="quick-actions-grid">
            <button className="quick-action-btn" onClick={() => navigate('/crop-doctor')}>
              <Stethoscope size={24} className="qa-icon" color="#1b5e20" />
              <span>{t('dashboard.diagnoseCropAction', 'Diagnose Crop')}</span>
            </button>
            <button className="quick-action-btn" onClick={() => navigate('/alerts')}>
              <Sun size={24} className="qa-icon" color="#f57f17" />
              <span>{t('dashboard.checkWeatherAction', 'Check Weather')}</span>
            </button>
            <button className="quick-action-btn" onClick={() => navigate('/market')}>
              <TrendingUp size={24} className="qa-icon" color="#2e7d32" />
              <span>{t('dashboard.viewMarketAction', 'View Market Prices')}</span>
            </button>
            <button className="quick-action-btn" onClick={() => navigate('/schemes')}>
              <Landmark size={24} className="qa-icon" color="#1565c0" />
              <span>{t('dashboard.exploreSchemesAction', 'Explore Schemes')}</span>
            </button>
          </div>
        </div>
      </section>

      {/* 7. FARMING TIP OF THE DAY BANNER */}
      <section className="dash-tip-banner">
        <div className="tip-content-wrap">
          <div className="tip-icon-box">
            <Lightbulb size={24} />
          </div>
          <div>
            <div className="tip-title">{t('dashboard.tipOfDayTitle', 'Farming Tip of the Day')}</div>
            <p className="tip-body">
              {t('dashboard.tipOfDayBody', 'Ensure proper drainage in your fields before expected rainfall. Mulching can help retain soil moisture and prevent nutrient leaching.')}
            </p>
          </div>
        </div>

        <button className="btn-text-link" onClick={() => navigate('/community')} style={{ flexShrink: 0 }}>
          <span>{t('dashboard.viewMoreTipsBtn', 'View More Tips')}</span>
          <ChevronRight size={16} />
        </button>
      </section>

      {/* ADD FARM MODAL */}
      {showAddFarmModal && (
        <div className="modal-overlay" onClick={() => setShowAddFarmModal(false)}>
          <div className="modal-box animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="modal-header-row">
              <h3>{t('dashboard.addFarmBtn', '+ Add New Farm')}</h3>
              <button className="modal-close-btn" onClick={() => setShowAddFarmModal(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddFarmSubmit} className="add-farm-form">
              <div className="form-group">
                <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                  Farm Name *
                </label>
                <input
                  type="text"
                  value={newFarmName}
                  onChange={e => setNewFarmName(e.target.value)}
                  placeholder="e.g. North Plot Kopargaon"
                  required
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #d8e6d8' }}
                />
              </div>

              <div className="form-group">
                <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                  Land Size (Acres) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={newFarmAcres}
                  onChange={e => setNewFarmAcres(e.target.value)}
                  required
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #d8e6d8' }}
                />
              </div>

              <div className="form-group">
                <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                  Ownership Type
                </label>
                <select
                  value={newFarmOwnership}
                  onChange={e => setNewFarmOwnership(e.target.value as any)}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #d8e6d8' }}
                >
                  <option value="Owned">Owned (मालकीची)</option>
                  <option value="Leased">Leased (कौलाने/कराराने)</option>
                </select>
              </div>

              <button type="submit" className="btn-submit-farm">
                Save & Add Farm
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
