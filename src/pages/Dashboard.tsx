import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../i18n/LanguageContext';
import { fetchForecast, type WeatherData } from '../services/api';
import { getUserFarms, getUserCrops, addNewFarm } from '../services/farmService';
import { fetchPersonalizedAlerts } from '../services/alertService';
import { RAW_MARKET_DATA } from '../services/marketData';
import { SCHEMES_DATA } from '../services/schemesData';
import { 
  computeWaterIntelligence, 
  getSavedFarmProfile, 
  type WaterIntelligenceData,
  type FarmProfileData
} from '../services/waterIntelligenceService';
import type { Farm, FarmCrop } from '../types/farm';
import type { FarmAlert } from '../types/alert';
import {
  Sprout,
  Sun,
  CloudRain,
  Wind,
  Droplets,
  AlertTriangle,
  TrendingUp,
  Landmark,
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
  CheckCircle2,
  HelpCircle,
  BarChart3,
  Compass,
  Map,
  UserCheck,
  ShieldCheck
} from 'lucide-react';
import './Dashboard.css';

export const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t, language } = useLanguage();

  // Data States
  const [loading, setLoading] = useState(true);
  const [weatherError, setWeatherError] = useState<string | null>(null);
  const [dataError, setDataError] = useState<string | null>(null);

  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [farms, setFarms] = useState<Farm[]>([]);
  const [crops, setCrops] = useState<FarmCrop[]>([]);
  const [alerts, setAlerts] = useState<FarmAlert[]>([]);
  
  // Farm Profile & Water Intelligence
  const [farmProfile, setFarmProfile] = useState<FarmProfileData>(getSavedFarmProfile());
  const [waterIntelligence, setWaterIntelligence] = useState<WaterIntelligenceData>(() => computeWaterIntelligence(getSavedFarmProfile()));
  const [showReasoningModal, setShowReasoningModal] = useState(false);

  // Modals
  const [showAddFarmModal, setShowAddFarmModal] = useState(false);
  const [newFarmName, setNewFarmName] = useState('');
  const [newFarmAcres, setNewFarmAcres] = useState('2.5');
  const [newFarmOwnership, setNewFarmOwnership] = useState<'Owned' | 'Leased'>('Owned');

  const farmerName = user?.name || farmProfile.farmerName || 'Sushant Sondkar';
  const farmerDistrict = user?.district || farmProfile.district || 'Ahmednagar';

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

    // Refresh farm profile and AI water intelligence
    const profile = getSavedFarmProfile();
    setFarmProfile(profile);
    const intel = computeWaterIntelligence(profile);
    setWaterIntelligence(intel);

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
      const lat = farmerDistrict === 'Pune' ? 18.52 : 19.88;
      const lon = farmerDistrict === 'Pune' ? 73.85 : 74.47;
      const weatherRes = await fetchForecast(lat, lon);
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
  const totalAcres = farms.reduce((acc, f) => acc + (f.land_size_acres || 0), 0) || farmProfile.landArea;
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
        location_village: farmProfile.location,
        district: farmerDistrict,
        state: 'Maharashtra'
      },
      user
    );

    setFarms(prev => [created, ...prev]);
    setShowAddFarmModal(false);
    setNewFarmName('');
  };

  // Decision Title based on active language
  const decisionTitle = language === 'mr' 
    ? waterIntelligence.decisionTitleMr 
    : language === 'hi' 
    ? waterIntelligence.decisionTitleHi 
    : waterIntelligence.decisionTitle;

  const decisionSummary = language === 'mr'
    ? waterIntelligence.reasonSummaryMr
    : language === 'hi'
    ? waterIntelligence.reasonSummaryHi
    : waterIntelligence.reasonSummary;

  return (
    <div className="advisory-dashboard-container animate-fade-in">
      {/* 1. MAIN HERO GREETING BANNER */}
      <section className="dash-hero-banner">
        <div>
          <h1 className="dash-hero-title">
            ☀️ {getGreeting()}, {farmerName}!
          </h1>
          <p className="dash-hero-sub">
            {t('dashboard.heroSubtitle', "Here's what's happening on your farms today.")} • 📍 {farmProfile.location}, {farmerDistrict} District
          </p>
        </div>

        <div className="dash-hero-tagline">
          <Sparkles size={16} color="#ffffff" />
          <span>{t('dashboard.agriculturalMotto', 'Better information. Better decisions. Healthier crops.')}</span>
        </div>
      </section>

      {/* ERROR FALLBACK BANNER */}
      {(dataError || weatherError) && (
        <div className="dash-error-banner glass-panel" style={{ margin: '0 0 1.5rem 0', padding: '1rem 1.25rem', borderRadius: '12px', background: '#ffebee', border: '1px solid #ffcdd2', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#c62828' }}>
            <AlertTriangle size={20} />
            <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{dataError || weatherError}</span>
          </div>
          <button onClick={loadDashboardData} className="btn-secondary-agri" style={{ padding: '0.4rem 0.9rem', fontSize: '0.85rem' }}>
            <RefreshCw size={14} style={{ marginRight: '6px' }} />
            {t('dashboard.retry', 'Retry')}
          </button>
        </div>
      )}

      {/* 2. CORE DECISION HERO: TODAY'S AI FARM DECISION */}
      <section className="today-decision-card glass-panel animate-fade-in">
        <div className="decision-header-row">
          <div className="decision-label-wrap">
            <span className="ai-tag">
              <Sparkles size={14} /> AI Decision Fusion Engine
            </span>
            <h2 className="decision-main-heading">
              {language === 'mr' ? 'आजचा शेती सल्ला व निर्णय' : language === 'hi' ? 'आज का कृषि निर्णय' : "Today's Farm Decision"}
            </h2>
            <p className="decision-sub-location">
              {farmProfile.currentCrop} Plot • {farmProfile.landArea} Acres • {farmProfile.soilType} • {farmProfile.irrigationType}
            </p>
          </div>

          <div className="decision-action-pill-wrap">
            <div className={`decision-pill ${waterIntelligence.decisionColor}`}>
              <span className="decision-icon">{waterIntelligence.badgeIcon}</span>
              <span className="decision-action-text">{decisionTitle}</span>
            </div>
            <button 
              className="btn-explain-reasoning"
              onClick={() => setShowReasoningModal(true)}
              title="See transparent AI explanation"
            >
              <HelpCircle size={15} />
              <span>{language === 'mr' ? 'कारण पहा' : language === 'hi' ? 'कारण देखें' : 'Why this decision?'}</span>
            </button>
          </div>
        </div>

        {/* 4 TELEMETRY INPUTS */}
        <div className="decision-telemetry-grid">
          <div className="telemetry-tile">
            <div className="telemetry-tile-header">
              <CloudRain size={18} color="#0288d1" />
              <span>{language === 'mr' ? 'अपेक्षित पाऊस (४८ तास)' : 'Expected Rain (48h)'}</span>
            </div>
            <div className="telemetry-val-row">
              <span className="telemetry-value">{waterIntelligence.rainfallForecastMm} mm</span>
              <span className="telemetry-badge blue">{waterIntelligence.rainfallExpectedProb}% Prob.</span>
            </div>
            <span className="telemetry-caption">IMD High-Res Doppler Forecast</span>
          </div>

          <div className="telemetry-tile">
            <div className="telemetry-tile-header">
              <Droplets size={18} color="#00897b" />
              <span>{language === 'mr' ? 'भूजल पातळी निर्देशांक' : 'Groundwater Index'}</span>
            </div>
            <div className="telemetry-val-row">
              <span className="telemetry-value">{waterIntelligence.groundwaterLevel.toLocaleString()}</span>
              <span className={`telemetry-badge ${waterIntelligence.baselineDifferencePercent < 0 ? 'red' : 'green'}`}>
                {waterIntelligence.baselineDifferencePercent}%
              </span>
            </div>
            <span className="telemetry-caption">CGWB Benchmark: {waterIntelligence.groundwaterBaseline5Yr.toLocaleString()}</span>
          </div>

          <div className="telemetry-tile">
            <div className="telemetry-tile-header">
              <BarChart3 size={18} color="#f57f17" />
              <span>{language === 'mr' ? '५ वर्षांची तुलना' : '5-Yr Historical Base'}</span>
            </div>
            <div className="telemetry-val-row">
              <span className="telemetry-value">{waterIntelligence.waterStress} Stress</span>
              <span className="telemetry-badge orange">-8.1% Deficit</span>
            </div>
            <span className="telemetry-caption">GSDA Aquifer Station {farmerDistrict}</span>
          </div>

          <div className="telemetry-tile">
            <div className="telemetry-tile-header">
              <Sprout size={18} color="#2e7d32" />
              <span>{language === 'mr' ? 'पीक आरोग्य (NDVI)' : 'Crop Health (NDVI)'}</span>
            </div>
            <div className="telemetry-val-row">
              <span className="telemetry-value">{waterIntelligence.cropHealthStatus}</span>
              <span className="telemetry-badge green">NDVI: 0.61</span>
            </div>
            <span className="telemetry-caption">Sentinel-2 Multispectral Feed</span>
          </div>
        </div>

        {/* EXPLAINABLE REASON SUMMARY STRIP */}
        <div className="decision-explanation-strip">
          <Lightbulb size={20} color="#f57f17" style={{ flexShrink: 0, marginTop: '2px' }} />
          <p className="explanation-text">{decisionSummary}</p>
          <button 
            className="btn-link-action"
            onClick={() => navigate('/my-farm')}
          >
            <span>{language === 'mr' ? 'माझे शेत व्यवस्थापन' : 'Edit Farm Profile'}</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </section>

      {/* 3. WATER INTELLIGENCE & HISTORICAL COMPARISON (2-COLUMN GRID) */}
      <section className="dash-row-grid-2">
        {/* 7-DAY RAINFALL RADAR FORECAST */}
        <div className="dash-card">
          <div className="card-header-flex">
            <div className="card-title-wrap">
              <CloudRain size={22} color="#0288d1" />
              <h3>{language === 'mr' ? '७ दिवसांचा पर्जन्य अंदाज (IMD)' : '7-Day Rainfall Radar & Forecast'}</h3>
            </div>
            <span className="badge-official">IMD Pune / Nashik</span>
          </div>

          <div className="rainfall-chart-container">
            <div className="chart-bars-wrap">
              {waterIntelligence.rainfall7DayTrend.map((item, idx) => (
                <div key={idx} className="chart-bar-column">
                  <span className="bar-val-label">{item.rainMm} mm</span>
                  <div className="bar-track">
                    <div 
                      className={`bar-fill ${item.rainMm > 15 ? 'high' : item.rainMm > 5 ? 'med' : 'low'}`}
                      style={{ height: `${Math.min(100, Math.max(12, item.rainMm * 3.5))}%` }}
                    />
                  </div>
                  <span className="bar-day-label">{item.day}</span>
                  <span className="bar-prob-label">{item.prob}%</span>
                </div>
              ))}
            </div>
            <div className="chart-legend-row">
              <span className="legend-item"><span className="legend-dot high"></span> &gt;15mm Heavy</span>
              <span className="legend-item"><span className="legend-dot med"></span> 5-15mm Moderate</span>
              <span className="legend-item"><span className="legend-dot low"></span> &lt;5mm Light</span>
            </div>
          </div>
        </div>

        {/* GROUNDWATER 5-YEAR HISTORICAL COMPARISON */}
        <div className="dash-card">
          <div className="card-header-flex">
            <div className="card-title-wrap">
              <Droplets size={22} color="#00897b" />
              <h3>{language === 'mr' ? 'भूजल पातळी: ५ वर्षांची ऐतिहासिक तुलना' : 'Groundwater 5-Yr Baseline Comparison'}</h3>
            </div>
            <span className="badge-demo-tag">CGWB Baseline</span>
          </div>

          <div className="groundwater-comparison-box">
            <div className="gw-stat-comparison-row">
              <div className="gw-comp-tile current">
                <span className="gw-comp-lbl">{language === 'mr' ? 'चालू वर्ष (२०२६)' : 'Current (2026)'}</span>
                <span className="gw-comp-num">66,186</span>
                <span className="gw-comp-sub">Index Unit</span>
              </div>
              <div className="gw-comp-tile last-year">
                <span className="gw-comp-lbl">{language === 'mr' ? 'मागील वर्ष (२०२५)' : 'Last Year (2025)'}</span>
                <span className="gw-comp-num">71,200</span>
                <span className="gw-comp-sub">-7.0%</span>
              </div>
              <div className="gw-comp-tile baseline">
                <span className="gw-comp-lbl">{language === 'mr' ? '५ वर्षांचा सरासरी बेसलाईन' : '5-Yr Benchmark'}</span>
                <span className="gw-comp-num">72,000</span>
                <span className="gw-comp-sub" style={{ color: '#c62828', fontWeight: 700 }}>-8.1% Deficit</span>
              </div>
            </div>

            {/* Trajectory Progress Bars */}
            <div className="gw-trajectory-list">
              <div className="gw-progress-item">
                <div className="gw-prog-label-row">
                  <span>Current Water Table vs 5-Yr Normal</span>
                  <span style={{ color: '#c62828', fontWeight: 700 }}>91.9% of Normal (-8.1%)</span>
                </div>
                <div className="gw-prog-bar-track">
                  <div className="gw-prog-bar-fill warning" style={{ width: '91.9%' }}></div>
                </div>
              </div>

              <div className="gw-progress-item">
                <div className="gw-prog-label-row">
                  <span>Soil Moisture Saturation</span>
                  <span style={{ color: '#2e7d32', fontWeight: 700 }}>{waterIntelligence.soilMoisturePercent}% (Optimum)</span>
                </div>
                <div className="gw-prog-bar-track">
                  <div className="gw-prog-bar-fill success" style={{ width: `${waterIntelligence.soilMoisturePercent}%` }}></div>
                </div>
              </div>
            </div>

            <div className="gw-source-footer">
              <ShieldCheck size={14} color="#1b5e20" />
              <span>Source: Central Ground Water Board (CGWB) & GSDA Maharashtra Benchmark (Demo Mode Calibrated)</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. QUICK PORTAL NAVIGATION CHIPS */}
      <section className="dash-quick-links-strip">
        <div className="quick-chip-card" onClick={() => navigate('/my-farm')}>
          <div className="chip-icon-box green">
            <Compass size={22} />
          </div>
          <div className="chip-meta">
            <h4>{language === 'mr' ? 'माझी शेती' : 'My Farm Profile'}</h4>
            <p>{farmProfile.currentCrop} • {farmProfile.landArea} Acres</p>
          </div>
          <ChevronRight size={18} color="#999" />
        </div>

        <div className="quick-chip-card" onClick={() => navigate('/risk-map')}>
          <div className="chip-icon-box blue">
            <Map size={22} />
          </div>
          <div className="chip-meta">
            <h4>{language === 'mr' ? 'तालुका जोखीम नकाशा' : 'Taluka Risk Map'}</h4>
            <p>Pune & Nashik Water Stress Zones</p>
          </div>
          <ChevronRight size={18} color="#999" />
        </div>

        <div className="quick-chip-card" onClick={() => navigate('/crop-doctor')}>
          <div className="chip-icon-box emerald">
            <Stethoscope size={22} />
          </div>
          <div className="chip-meta">
            <h4>{language === 'mr' ? 'क्रॉप डॉक्टर' : 'AI Crop Doctor'}</h4>
            <p>14 Species Leaf Scan & Diagnosis</p>
          </div>
          <ChevronRight size={18} color="#999" />
        </div>

        <div className="quick-chip-card" onClick={() => navigate('/officer-portal')}>
          <div className="chip-icon-box purple">
            <UserCheck size={22} />
          </div>
          <div className="chip-meta">
            <h4>{language === 'mr' ? 'कृषी अधिकारी कक्ष' : 'Officer Portal'}</h4>
            <p>Triage Case & Direct Support</p>
          </div>
          <ChevronRight size={18} color="#999" />
        </div>
      </section>

      {/* 5. FARM OVERVIEW STATISTICS (5 STAT CARDS) */}
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
            <div className="stat-card" onClick={() => navigate('/my-farm')}>
              <div className="stat-icon-wrap green">
                <Sprout size={22} />
              </div>
              <div className="stat-content">
                <span className="stat-title">{t('dashboard.totalLandArea', 'Total Land Area')}</span>
                <span className="stat-value">{totalAcres.toFixed(1)} Acres</span>
                <span className="stat-sub">{farms.length > 0 ? `${farms.length} Registered Plots` : `${farmProfile.district} Region`}</span>
              </div>
            </div>

            {/* CARD 2: Active Crops */}
            <div className="stat-card" onClick={() => navigate('/crop-doctor')}>
              <div className="stat-icon-wrap emerald">
                <Stethoscope size={22} />
              </div>
              <div className="stat-content">
                <span className="stat-title">{t('dashboard.activeCrops', 'Active Crops')}</span>
                <span className="stat-value">{farmProfile.currentCrop}</span>
                <span className="stat-sub">{activeCropNames.length > 0 ? activeCropNames.join(' • ') : 'Sown: ' + farmProfile.sowingDate}</span>
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

      {/* 6. TODAY'S WEATHER & CRITICAL ALERTS ROW (2-COLUMN GRID) */}
      <section className="dash-row-grid-2">
        {/* TODAY'S WEATHER CARD */}
        <div className="dash-card dash-weather-card">
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
                  <span className="weather-location">📍 {farmProfile.location}, {farmerDistrict}</span>
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

      {/* 7. YOUR FARMS, YOUR CROPS & MARKET PRICES ROW (3-COLUMN GRID) */}
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
              <h4>🌾 Registered Profile: {farmProfile.currentCrop}</h4>
              <p style={{ fontSize: '0.82rem' }}>{farmProfile.landArea} Acres in {farmProfile.location} ({farmProfile.soilType})</p>
              <button className="btn-submit-farm" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', marginTop: '8px' }} onClick={() => navigate('/my-farm')}>
                Open My Farm Profile
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

          <div className="crops-list-wrap">
            <div className="crop-item-card" onClick={() => navigate('/crop-doctor')}>
              <div>
                <div className="crop-name">{farmProfile.currentCrop}</div>
                <div className="crop-stage">{farmProfile.landArea} Acres • Sown: {farmProfile.sowingDate}</div>
              </div>
              <span className="status-badge-mini healthy">
                Healthy
              </span>
            </div>
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

      {/* 8. GOVT SCHEMES & QUICK ACTIONS */}
      <section className="dash-row-grid-2">
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
                  <div className="scheme-name">{s.title}</div>
                  <div className="scheme-dept">{s.category} • {s.government_level}</div>
                </div>
                <span className="eligible-tag">{t('dashboard.eligibleBadge', 'Eligible')}</span>
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
            <button className="quick-action-btn" onClick={() => navigate('/risk-map')}>
              <Map size={24} className="qa-icon" color="#0288d1" />
              <span>{language === 'mr' ? 'जोखीम नकाशा' : 'Risk Map'}</span>
            </button>
            <button className="quick-action-btn" onClick={() => navigate('/officer-portal')}>
              <UserCheck size={24} className="qa-icon" color="#7b1fa2" />
              <span>{language === 'mr' ? 'अधिकारी पोर्टल' : 'Officer Portal'}</span>
            </button>
            <button className="quick-action-btn" onClick={() => navigate('/schemes')}>
              <Landmark size={24} className="qa-icon" color="#1565c0" />
              <span>{t('dashboard.exploreSchemesAction', 'Explore Schemes')}</span>
            </button>
          </div>
        </div>
      </section>

      {/* 9. FARMING TIP OF THE DAY BANNER */}
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

      {/* DETAILED REASONING MODAL */}
      {showReasoningModal && (
        <div className="modal-overlay" onClick={() => setShowReasoningModal(false)}>
          <div className="modal-box reasoning-modal animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="modal-header-row">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={20} color="#1b5e20" />
                <h3 style={{ margin: 0, color: '#1b5e20', fontSize: '1.2rem' }}>
                  {language === 'mr' ? 'सविस्तर एआय कारणमीमांसा' : 'Transparent AI Reasoning'}
                </h3>
              </div>
              <button className="modal-close-btn" onClick={() => setShowReasoningModal(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="reasoning-modal-body">
              <div className="reasoning-summary-card">
                <div className="r-badge-row">
                  <span className={`decision-pill ${waterIntelligence.decisionColor}`}>
                    {decisionTitle}
                  </span>
                  <span className="confidence-pill">AI Confidence: 94%</span>
                </div>
                <p className="r-summary-text">{decisionSummary}</p>
              </div>

              <h4 className="reasoning-sub-heading">
                {language === 'mr' ? 'निर्णयाची प्रमुख कारणे (Explainable Factors):' : 'Key Factors & Model Signals:'}
              </h4>
              <div className="reasoning-points-list">
                {waterIntelligence.reasons.map((r, i) => (
                  <div key={i} className={`reason-point-card ${r.positive ? 'positive' : 'negative'}`}>
                    <CheckCircle2 size={18} color={r.positive ? '#2e7d32' : '#f57f17'} style={{ flexShrink: 0, marginTop: '2px' }} />
                    <p>{language === 'mr' ? r.mr : language === 'hi' ? r.hi : r.en}</p>
                  </div>
                ))}
              </div>

              <div className="reasoning-sources-strip">
                <h5>Data Fusion Sources</h5>
                <div className="source-badges-flex">
                  <span className="source-pill">🛰️ IMD Doppler Radar (Rainfall)</span>
                  <span className="source-pill">💧 CGWB / GSDA Well Index</span>
                  <span className="source-pill">🌱 Sentinel-2 Multispectral NDVI</span>
                  <span className="source-pill">🌾 Farm Profile Calibration</span>
                </div>
              </div>

              <div className="reasoning-modal-actions">
                <button 
                  className="btn-modal-action primary"
                  onClick={() => {
                    setShowReasoningModal(false);
                    navigate('/my-farm');
                  }}
                >
                  {language === 'mr' ? 'माझे शेत सेटिंग्ज बदला' : 'Adjust Farm Profile'}
                </button>
                <button 
                  className="btn-modal-action secondary"
                  onClick={() => {
                    setShowReasoningModal(false);
                    navigate('/officer-portal');
                  }}
                >
                  {language === 'mr' ? 'कृषी अधिकार्‍यांशी चर्चा करा' : 'Consult Agri Officer'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
