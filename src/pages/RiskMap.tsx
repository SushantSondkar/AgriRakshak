import { useState } from 'react';
import { 
  Map, 
  Droplets, 
  CloudRain, 
  ShieldCheck, 
  Info
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { TALUKA_RISK_DATA, type TalukaRiskData } from '../services/waterIntelligenceService';
import './RiskMap.css';

export const RiskMap = () => {
  const { language } = useLanguage();
  const [selectedDistrict, setSelectedDistrict] = useState<'All' | 'Pune' | 'Nashik'>('All');
  const [filterRisk, setFilterRisk] = useState<'All' | 'Low' | 'Medium' | 'High'>('All');
  const [activeTaluka, setActiveTaluka] = useState<TalukaRiskData | null>(TALUKA_RISK_DATA[0]);

  const filteredTalukas = TALUKA_RISK_DATA.filter(item => {
    const matchDistrict = selectedDistrict === 'All' || item.district === selectedDistrict;
    const matchRisk = filterRisk === 'All' || item.cropRisk === filterRisk;
    return matchDistrict && matchRisk;
  });

  const getRiskColor = (level: string) => {
    if (level === 'HIGH' || level === 'High' || level === 'High Stress') return '#ef4444';
    if (level === 'MEDIUM' || level === 'Medium' || level === 'Moderate Stress') return '#f59e0b';
    return '#10b981';
  };

  const getRiskBg = (level: string) => {
    if (level === 'HIGH' || level === 'High' || level === 'High Stress') return '#fee2e2';
    if (level === 'MEDIUM' || level === 'Medium' || level === 'Moderate Stress') return '#fef3c7';
    return '#d1fae5';
  };

  return (
    <div className="risk-map-container animate-fade-in">
      {/* Header Banner */}
      <div className="risk-map-header glass-panel">
        <div className="rmh-left">
          <div className="rmh-icon-box">
            <Map size={28} color="#1b5e20" />
          </div>
          <div>
            <h1>{language === 'mr' ? 'जल व पीक जोखीम नकाशा (Risk Map)' : language === 'hi' ? 'जल व फसल जोखिम मानचित्र (Risk Map)' : 'Water & Crop Risk Map'}</h1>
            <p>
              {language === 'mr'
                ? 'पुणे व नाशिक जिल्ह्यातील तालुकास्तरीय भूजल ताण, पाऊस तूट व पीक जोखीम निर्देशांक'
                : language === 'hi'
                ? 'पुणे और नाशिक जिले का तालुका-स्तरीय भूजल तनाव, वर्षा घाटा और फसल जोखिम सूचकांक'
                : 'Taluka-level groundwater depletion, rainfall deficit, and composite crop risk indices for Pune and Nashik.'}
            </p>
          </div>
        </div>

        <div className="demo-badge-indicator">
          <Info size={14} />
          <span>Demo Data / CGWB Baseline Model</span>
        </div>
      </div>

      {/* Filter and Switcher Controls Bar */}
      <div className="risk-controls-card glass-panel">
        <div className="district-filter-tabs">
          <button 
            className={`dist-tab-btn ${selectedDistrict === 'All' ? 'active' : ''}`}
            onClick={() => setSelectedDistrict('All')}
          >
            {language === 'mr' ? 'सर्व तालुके (१२)' : 'All Talukas (12)'}
          </button>
          <button 
            className={`dist-tab-btn ${selectedDistrict === 'Pune' ? 'active' : ''}`}
            onClick={() => setSelectedDistrict('Pune')}
          >
            📍 Pune District ({TALUKA_RISK_DATA.filter(t => t.district === 'Pune').length})
          </button>
          <button 
            className={`dist-tab-btn ${selectedDistrict === 'Nashik' ? 'active' : ''}`}
            onClick={() => setSelectedDistrict('Nashik')}
          >
            📍 Nashik District ({TALUKA_RISK_DATA.filter(t => t.district === 'Nashik').length})
          </button>
        </div>

        <div className="risk-level-filter">
          <span className="rlf-label">{language === 'mr' ? 'जोखीम पातळी:' : 'Risk Level:'}</span>
          <button 
            className={`risk-pill-btn ${filterRisk === 'All' ? 'active' : ''}`}
            onClick={() => setFilterRisk('All')}
          >
            All
          </button>
          <button 
            className={`risk-pill-btn low ${filterRisk === 'Low' ? 'active' : ''}`}
            onClick={() => setFilterRisk('Low')}
          >
            🟢 Low
          </button>
          <button 
            className={`risk-pill-btn med ${filterRisk === 'Medium' ? 'active' : ''}`}
            onClick={() => setFilterRisk('Medium')}
          >
            🟡 Moderate
          </button>
          <button 
            className={`risk-pill-btn high ${filterRisk === 'High' ? 'active' : ''}`}
            onClick={() => setFilterRisk('High')}
          >
            🔴 High Stress
          </button>
        </div>
      </div>

      {/* Main Interactive Layout: Interactive Taluka Grid + Detailed Telemetry Inspector */}
      <div className="risk-map-layout">
        {/* Left Grid: Taluka Cards / Visual Map View */}
        <div className="talukas-grid-col">
          <div className="talukas-cards-grid">
            {filteredTalukas.map(taluka => {
              const isSelected = activeTaluka?.id === taluka.id;
              return (
                <div 
                  key={taluka.id}
                  className={`taluka-risk-card glass-panel ${isSelected ? 'selected' : ''}`}
                  onClick={() => setActiveTaluka(taluka)}
                  style={{ borderLeftColor: getRiskColor(taluka.waterStressLevel) }}
                >
                  <div className="trc-header">
                    <div>
                      <h4>{taluka.name}</h4>
                      <span className="trc-sub">{taluka.nameMr} • {taluka.district}</span>
                    </div>
                    <span 
                      className="stress-pill"
                      style={{ 
                        backgroundColor: getRiskBg(taluka.waterStressLevel),
                        color: getRiskColor(taluka.waterStressLevel)
                      }}
                    >
                      {taluka.waterStressLevel === 'HIGH' ? '🔴 High Stress' : taluka.waterStressLevel === 'MEDIUM' ? '🟡 Moderate' : '🟢 Low Stress'}
                    </span>
                  </div>

                  <div className="trc-metrics-row">
                    <div className="trc-metric">
                      <Droplets size={14} color="#0288d1" />
                      <div>
                        <span className="val">{taluka.groundwaterLevel.toLocaleString()}</span>
                        <span className="lbl">{taluka.deficitPercent}% vs 5-Yr</span>
                      </div>
                    </div>

                    <div className="trc-metric">
                      <CloudRain size={14} color="#2e7d32" />
                      <div>
                        <span className="val">{taluka.rainfallForecastMm} mm</span>
                        <span className="lbl">{taluka.rainfallStatus}</span>
                      </div>
                    </div>
                  </div>

                  <div className="trc-footer">
                    <span className="crop-tag-text">Crops: {taluka.majorCrops.slice(0, 2).join(', ')}</span>
                    <span className="inspect-link">Details →</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Taluka Telemetry Inspector */}
        <div className="taluka-detail-col">
          {activeTaluka ? (
            <div className="taluka-inspector-card glass-panel">
              <div className="tic-header">
                <div>
                  <span className="tic-dist-tag">{activeTaluka.district} District</span>
                  <h3>{activeTaluka.name} ({activeTaluka.nameMr})</h3>
                </div>
                <div 
                  className="tic-status-badge"
                  style={{ 
                    backgroundColor: getRiskBg(activeTaluka.waterStressLevel),
                    color: getRiskColor(activeTaluka.waterStressLevel)
                  }}
                >
                  {activeTaluka.cropRisk.toUpperCase()} RISK
                </div>
              </div>

              {/* Water Balance Breakdown */}
              <div className="tic-section">
                <h5>Hydrological Baseline Telemetry</h5>
                <div className="tic-stat-box">
                  <div className="stat-line">
                    <span className="s-lbl">Current Groundwater:</span>
                    <span className="s-val">{activeTaluka.groundwaterLevel.toLocaleString()} m³/ha</span>
                  </div>
                  <div className="stat-line">
                    <span className="s-lbl">5-Year Historical Baseline:</span>
                    <span className="s-val">{activeTaluka.baseline5Yr.toLocaleString()} m³/ha</span>
                  </div>
                  <div className="stat-line">
                    <span className="s-lbl">Historical Depletion:</span>
                    <strong style={{ color: activeTaluka.deficitPercent < 0 ? '#ef4444' : '#10b981' }}>
                      {activeTaluka.deficitPercent}%
                    </strong>
                  </div>
                </div>
              </div>

              {/* Rainfall Forecast */}
              <div className="tic-section">
                <h5>Rainfall & Precipitation Index</h5>
                <div className="tic-stat-box">
                  <div className="stat-line">
                    <span className="s-lbl">7-Day Rain Forecast:</span>
                    <span className="s-val">{activeTaluka.rainfallForecastMm} mm</span>
                  </div>
                  <div className="stat-line">
                    <span className="s-lbl">Seasonal Status:</span>
                    <span className="s-val">{activeTaluka.rainfallStatus} Rainfall</span>
                  </div>
                </div>
              </div>

              {/* Major Crops */}
              <div className="tic-section">
                <h5>Major Cropping Pattern</h5>
                <div className="crop-chips-wrap">
                  {activeTaluka.majorCrops.map((c, i) => (
                    <span key={i} className="major-crop-chip">🌾 {c}</span>
                  ))}
                </div>
              </div>

              {/* Actionable Decision Advisory */}
              <div className="tic-advisory-box" style={{ borderLeftColor: getRiskColor(activeTaluka.waterStressLevel) }}>
                <div className="tab-hdr">
                  <ShieldCheck size={16} color="#1b5e20" />
                  <span>Actionable Farm Decision</span>
                </div>
                <p className="tab-text">
                  {language === 'mr' ? activeTaluka.recommendedActionMr : activeTaluka.recommendedAction}
                </p>
              </div>
            </div>
          ) : (
            <div className="empty-inspector-card glass-panel">
              <p>Select any taluka on the map to inspect water intelligence telemetry.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
