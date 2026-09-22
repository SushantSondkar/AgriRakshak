import { useState, useEffect } from 'react';
import { WifiOff, Database, Info } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import './DataStatusBadge.css';

interface DataStatusBadgeProps {
  status?: 'live' | 'cached' | 'demo';
  lastSynced?: string;
}

export const DataStatusBadge = ({ status = 'demo', lastSynced = '2 hours ago' }: DataStatusBadgeProps) => {
  const { language } = useLanguage();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const getStatusLabel = () => {
    if (!isOnline) {
      if (language === 'mr') return 'ऑफलाइन (कॅश डेटा)';
      if (language === 'hi') return 'ऑफ़लाइन (कैश्ड डेटा)';
      return 'Offline (Cached)';
    }

    if (status === 'live') {
      if (language === 'mr') return 'थेट डेटा (Live)';
      if (language === 'hi') return 'लाइव डेटा (Live)';
      return 'Live Data';
    }

    if (status === 'cached') {
      if (language === 'mr') return 'कॅश डेटा (Cached)';
      if (language === 'hi') return 'कैश्ड डेटा (Cached)';
      return 'Cached Data';
    }

    if (language === 'mr') return 'डेमो / CGWB बेसलाइन';
    if (language === 'hi') return 'डेमो / CGWB बेसलाइन';
    return 'Demo / CGWB Baseline';
  };

  return (
    <div className="data-status-container">
      <div 
        className={`data-status-pill ${!isOnline ? 'offline' : status}`}
        onClick={() => setShowTooltip(!showTooltip)}
        title="Click to view data sources"
      >
        <span className="status-indicator-dot"></span>
        {!isOnline ? (
          <WifiOff size={13} className="status-icon" />
        ) : (
          <Database size={13} className="status-icon" />
        )}
        <span className="status-text">{getStatusLabel()}</span>
        <Info size={12} className="info-icon" />
      </div>

      {showTooltip && (
        <div className="data-status-popover glass-panel animate-fade-in">
          <div className="popover-header">
            <h4>Data Sources & Connectivity</h4>
            <button className="popover-close" onClick={() => setShowTooltip(false)}>×</button>
          </div>
          <div className="popover-body">
            <div className="source-row">
              <span className="source-name">🌦️ Weather & Rain:</span>
              <span className="source-val">Open-Meteo & IMD Radar</span>
            </div>
            <div className="source-row">
              <span className="source-name">💧 Groundwater Baseline:</span>
              <span className="source-val">CGWB / NWIC 5-Year Average</span>
            </div>
            <div className="source-row">
              <span className="source-name">🩺 AI Diagnosis Engine:</span>
              <span className="source-val">Client-Side Offline Capable</span>
            </div>
            <div className="source-row">
              <span className="source-name">⏱️ Last Sync:</span>
              <span className="source-val">{lastSynced}</span>
            </div>
          </div>
          <div className="popover-footer">
            <p className="fallback-note">
              ✓ AgriRakshak automatically uses cached local datasets when network connectivity is low or APIs are unreachable.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
