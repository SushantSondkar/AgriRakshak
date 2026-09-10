import { useState, useEffect } from 'react';
import { fetchForecast, fetchHistoricalBaseline, type WeatherData } from '../services/api';
import { generateAdvisories, type CropAdvisory, type RiskLevel } from '../services/advisoryEngine';
import { AlertTriangle, Droplets, ThermometerSun, Leaf, MapPin } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import './Dashboard.css';

const REGIONS = {
  Pune: { lat: 18.5204, lon: 73.8567 },
  Nashik: { lat: 20.0110, lon: 73.7909 }
};

export const Dashboard = () => {
  const [region, setRegion] = useState<keyof typeof REGIONS>('Pune');
  const [loading, setLoading] = useState(true);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [advisories, setAdvisories] = useState<CropAdvisory[]>([]);
  const [baseline, setBaseline] = useState<number>(0);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const coords = REGIONS[region];
        const [forecast, historicalBase] = await Promise.all([
          fetchForecast(coords.lat, coords.lon),
          fetchHistoricalBaseline(coords.lat, coords.lon)
        ]);
        
        setWeatherData(forecast);
        setBaseline(historicalBase);
        
        const generatedAdvisories = generateAdvisories(forecast, historicalBase);
        setAdvisories(generatedAdvisories);
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [region]);

  const renderRiskBadge = (risk: RiskLevel) => {
    const colors = {
      Low: 'var(--color-success)',
      Medium: 'var(--color-warning)',
      High: 'var(--color-danger)'
    };
    return (
      <span className="risk-badge" style={{ backgroundColor: colors[risk] }}>
        {risk}
      </span>
    );
  };

  const chartData = weatherData?.time.map((t, i) => ({
    date: new Date(t).toLocaleDateString('en-US', { weekday: 'short' }),
    maxTemp: weatherData.temperature_2m_max[i],
    minTemp: weatherData.temperature_2m_min[i],
    precipitation: weatherData.precipitation_sum[i],
    humidity: weatherData.relative_humidity_2m_mean[i],
  })) || [];

  return (
    <div className="container">
      <header className="header animate-fade-in">
        <div className="header-content">
          <h1>AgriRakshak</h1>
          <p>Climate-Risk Advisory Platform</p>
        </div>
        <div className="region-selector">
          <MapPin size={20} />
          <select value={region} onChange={(e) => setRegion(e.target.value as any)}>
            <option value="Pune">Pune District</option>
            <option value="Nashik">Nashik District</option>
          </select>
        </div>
      </header>

      {loading ? (
        <div className="loader">Loading climate models...</div>
      ) : (
        <main className="dashboard-grid animate-fade-in">
          {/* Top Widgets */}
          <section className="widgets-section">
            <div className="glass-panel widget">
              <div className="widget-icon primary"><ThermometerSun size={24} /></div>
              <div className="widget-info">
                <h3>Avg Max Temp</h3>
                <p className="value">
                  {weatherData ? (weatherData.temperature_2m_max.reduce((a,b)=>a+b,0)/7).toFixed(1) : '--'}°C
                </p>
              </div>
            </div>
            <div className="glass-panel widget">
              <div className="widget-icon info"><Droplets size={24} /></div>
              <div className="widget-info">
                <h3>7-Day Rainfall</h3>
                <p className="value">
                  {weatherData ? weatherData.precipitation_sum.reduce((a,b)=>a+b,0).toFixed(1) : '--'} mm
                </p>
                <p className="subtext">Baseline: {(baseline * 7).toFixed(1)} mm</p>
              </div>
            </div>
            <div className="glass-panel widget">
              <div className="widget-icon danger"><AlertTriangle size={24} /></div>
              <div className="widget-info">
                <h3>Critical Alerts</h3>
                <p className="value">{advisories.filter(a => a.compositeRisk === 'High').length}</p>
                <p className="subtext">High risk crops</p>
              </div>
            </div>
          </section>

          {/* Charts Section */}
          <section className="charts-section glass-panel">
            <h2>7-Day Weather Outlook</h2>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" />
                  <XAxis dataKey="date" stroke="var(--color-text-muted)" />
                  <YAxis yAxisId="left" stroke="var(--color-text-muted)" />
                  <YAxis yAxisId="right" orientation="right" stroke="var(--color-info)" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--color-surface)', border: 'none', borderRadius: '8px' }}
                    itemStyle={{ color: 'var(--color-text-main)' }}
                  />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="maxTemp" stroke="var(--color-warning)" name="Max Temp (°C)" strokeWidth={2} />
                  <Line yAxisId="right" type="monotone" dataKey="precipitation" stroke="var(--color-info)" name="Rainfall (mm)" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* Advisories Section */}
          <section className="advisories-section">
            <h2>Crop-Specific Advisories</h2>
            <div className="advisories-grid">
              {advisories.map((adv, idx) => (
                <div key={idx} className="glass-panel advisory-card" style={{ animationDelay: `${idx * 0.1}s` }}>
                  <div className="advisory-header">
                    <div className="crop-title">
                      <Leaf size={20} color="var(--color-primary-light)" />
                      <h3>{adv.crop}</h3>
                    </div>
                    <div className="food-security-badge" data-risk={adv.compositeRisk}>
                      Yield Risk: {adv.compositeRisk}
                    </div>
                  </div>
                  
                  <div className="risk-indicators">
                    <div className="risk-item">
                      <span>Drought</span> {renderRiskBadge(adv.droughtRisk)}
                    </div>
                    <div className="risk-item">
                      <span>Flood</span> {renderRiskBadge(adv.floodRisk)}
                    </div>
                    <div className="risk-item">
                      <span>Pest/Disease</span> {renderRiskBadge(adv.pestRisk)}
                    </div>
                  </div>

                  <div className="advisory-content">
                    <div className="action-box">
                      <strong>Action:</strong> {adv.advisory}
                    </div>
                    <p className="reasoning">{adv.reasoning}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      )}
    </div>
  );
};
