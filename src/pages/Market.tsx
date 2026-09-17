import { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Search, 
  MapPin, 
  ArrowUpDown, 
  Truck, 
  BarChart2, 
  X,
  Sparkles,
  Award
} from 'lucide-react';
import { 
  RAW_MARKET_DATA, 
  getBestSellingMandiRecommendation
} from '../services/marketData';
import type { MandiPriceItem, DistrictName } from '../services/marketData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useLanguage } from '../i18n/LanguageContext';
import './Market.css';

const DISTRICTS: Array<{ label: DistrictName; labelMr: string }> = [
  { label: 'Pune District', labelMr: 'पुणे जिल्हा' },
  { label: 'Nashik District', labelMr: 'नाशिक जिल्हा' },
  { label: 'Ahmednagar / Kopargaon', labelMr: 'अहिल्यानगर / कोपरगाव' },
  { label: 'All Districts', labelMr: 'सर्व जिल्हे' }
];

const CROPS_FILTER = [
  { en: 'All', mr: 'सर्व पिके' },
  { en: 'Onion', mr: 'कांदा' },
  { en: 'Tomato', mr: 'टोमॅटो' },
  { en: 'Soybean', mr: 'सोयाबीन' },
  { en: 'Cotton', mr: 'कापूस' },
  { en: 'Pomegranate', mr: 'डाळिंब' },
  { en: 'Grapes', mr: 'द्राक्षे' },
  { en: 'Sugarcane', mr: 'ऊस' }
];

export const Market = () => {
  const { t } = useLanguage();
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictName>('Pune District');
  const [selectedCrop, setSelectedCrop] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'priceDesc' | 'priceAsc' | 'distance' | 'change'>('priceDesc');
  const [chartModalItem, setChartModalItem] = useState<MandiPriceItem | null>(null);

  // Compute AI Best Mandi Recommendation
  const aiRecommendation = getBestSellingMandiRecommendation(selectedDistrict, selectedCrop);

  // Filter & Sort logic
  const filteredData = RAW_MARKET_DATA.filter(item => {
    const matchesDistrict = selectedDistrict === 'All Districts' || item.district === selectedDistrict;
    const matchesCrop = selectedCrop === 'All' || item.crop.toLowerCase() === selectedCrop.toLowerCase();
    const matchesSearch = item.crop.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.cropMr.includes(searchQuery) ||
                          item.mandiName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.mandiNameMr.includes(searchQuery);
    return matchesDistrict && matchesCrop && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === 'priceDesc') return b.modalPrice - a.modalPrice;
    if (sortBy === 'priceAsc') return a.modalPrice - b.modalPrice;
    if (sortBy === 'distance') return a.distanceFromHubKm - b.distanceFromHubKm;
    if (sortBy === 'change') return b.priceChangePercent - a.priceChangePercent;
    return 0;
  });

  return (
    <div className="market-container animate-fade-in">
      {/* Header & District Selector */}
      <div className="market-header-wrap">
        <div>
          <h1>{t('market.title')}</h1>
          <p>{t('market.subtitle')}</p>
        </div>

        {/* District Selector Tabs */}
        <div className="district-selector-bar">
          {DISTRICTS.map(d => (
            <button
              key={d.label}
              className={`district-btn ${selectedDistrict === d.label ? 'active' : ''}`}
              onClick={() => setSelectedDistrict(d.label)}
            >
              <MapPin size={16} />
              <span>{d.label} ({d.labelMr})</span>
            </button>
          ))}
        </div>
      </div>

      {/* AI Recommendation Banner */}
      {aiRecommendation && (
        <div className="ai-recommendation-card">
          <div className="rec-badge">
            <Sparkles size={18} />
            <span>{t('market.recommendationTitle')}</span>
          </div>
          <div className="rec-content">
            <div className="rec-icon">
              <Award size={36} color="#1b5e20" />
            </div>
            <div>
              <h3>
                {t('market.recommendedMandi')} {aiRecommendation.crop} ({aiRecommendation.cropMr}): <strong>{aiRecommendation.mandiName} Mandi ({aiRecommendation.mandiNameMr})</strong>
              </h3>
              <p>
                {t('market.netProfitLabel')} <strong>₹{aiRecommendation.modalPrice} / {aiRecommendation.unit}</strong> 
                {aiRecommendation.distanceFromHubKm > 0 && ` (Est. Transport: ₹${Math.round(aiRecommendation.distanceFromHubKm * 1.5)}/Q)`}
                {' • '} Last Updated: {aiRecommendation.lastUpdated}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Crop Filter Pills */}
      <div className="crop-pills-bar">
        {CROPS_FILTER.map(c => (
          <button
            key={c.en}
            className={`crop-pill ${selectedCrop === c.en ? 'active' : ''}`}
            onClick={() => setSelectedCrop(c.en)}
          >
            {c.en} ({c.mr})
          </button>
        ))}
      </div>

      {/* Search & Sort Controls Bar */}
      <div className="controls-bar-card">
        <div className="search-box">
          <Search size={18} color="var(--color-text-muted)" />
          <input 
            type="text" 
            placeholder={t('market.searchCropPlaceholder')} 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filters-right-group">
          <div className="select-dropdown-wrap">
            <ArrowUpDown size={16} />
            <select value={sortBy} onChange={e => setSortBy(e.target.value as any)}>
              <option value="priceDesc">{t('market.sortByPriceHigh')}</option>
              <option value="priceAsc">{t('market.sortByPriceLow')}</option>
              <option value="distance">{t('market.sortByNearest')}</option>
              <option value="change">Highest % Increase</option>
            </select>
          </div>
        </div>
      </div>

      {/* Mandi Cards Grid */}
      <div className="mandi-grid">
        {filteredData.map(item => {
          const estFreight = Math.round(item.distanceFromHubKm * 1.5);
          return (
            <div key={item.id} className="mandi-card">
              {/* Card Top Header */}
              <div className="mandi-card-header">
                <div className="mandi-location-title">
                  <h3>{item.mandiName} Mandi</h3>
                  <span className="mandi-mr-name">{item.mandiNameMr}</span>
                  <span className="distance-badge">
                    <MapPin size={12} />
                    {item.distanceFromHubKm === 0 ? 'District Hub' : `${item.distanceFromHubKm} km away`}
                  </span>
                </div>
                <div className="crop-tag-box">
                  <span className="crop-tag-en">{item.crop}</span>
                  <span className="crop-tag-mr">{item.cropMr}</span>
                </div>
              </div>

              {/* Price Row */}
              <div className="mandi-price-row">
                <div>
                  <span className="price-lbl">Modal Price / दर</span>
                  <div className="price-value-wrap">
                    <span className="price-num">₹{item.modalPrice.toLocaleString()}</span>
                    <span className="unit-lbl">/ {item.unit}</span>
                  </div>
                </div>

                {/* Trend Badge */}
                <div className={`trend-pill ${item.priceChangePercent > 0 ? 'up' : (item.priceChangePercent < 0 ? 'down' : 'flat')}`}>
                  {item.priceChangePercent > 0 && <TrendingUp size={16} />}
                  {item.priceChangePercent < 0 && <TrendingDown size={16} />}
                  {item.priceChangePercent === 0 && <Minus size={16} />}
                  <span>{item.priceChangePercent > 0 ? `+${item.priceChangePercent}%` : `${item.priceChangePercent}%`}</span>
                </div>
              </div>

              {/* Price Range Breakdown */}
              <div className="price-range-box">
                <div className="range-item">
                  <span className="range-lbl">Min:</span>
                  <span className="range-val">₹{item.minPrice.toLocaleString()}</span>
                </div>
                <div className="range-divider"></div>
                <div className="range-item">
                  <span className="range-lbl">Max:</span>
                  <span className="range-val">₹{item.maxPrice.toLocaleString()}</span>
                </div>
              </div>

              {/* Card Footer */}
              <div className="mandi-card-footer">
                <div className="freight-info">
                  <Truck size={14} color="var(--color-primary-light)" />
                  <span>Transport: <strong>₹{estFreight}/Q</strong></span>
                </div>
                <button className="btn-trend-chart" onClick={() => setChartModalItem(item)}>
                  <BarChart2 size={16} />
                  <span>7-Day Trend</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 7-Day Trend Modal */}
      {chartModalItem && (
        <div className="modal-overlay" onClick={() => setChartModalItem(null)}>
          <div className="modal-box market-chart-modal animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="modal-chart-header">
              <div>
                <h2>{chartModalItem.crop} ({chartModalItem.cropMr}) — {chartModalItem.mandiName} Mandi</h2>
                <p>7-Day Price Trajectory (₹ / {chartModalItem.unit})</p>
              </div>
              <button className="close-btn" onClick={() => setChartModalItem(null)}>
                <X size={20} />
              </button>
            </div>

            <div className="chart-stat-summary">
              <div className="summary-chip">
                <span>Current Modal Price:</span>
                <strong>₹{chartModalItem.modalPrice}</strong>
              </div>
              <div className="summary-chip">
                <span>Daily Change:</span>
                <strong style={{ color: chartModalItem.priceChangeAmount >= 0 ? '#2e7d32' : '#e53935' }}>
                  {chartModalItem.priceChangeAmount >= 0 ? `+₹${chartModalItem.priceChangeAmount}` : `-₹${Math.abs(chartModalItem.priceChangeAmount)}`}
                </strong>
              </div>
            </div>

            <div className="chart-wrap">
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={chartModalItem.history7Days}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e1ebe1" />
                  <XAxis dataKey="date" stroke="#526058" />
                  <YAxis stroke="#526058" domain={['dataMin - 100', 'dataMax + 100']} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #d8e6d8', borderRadius: '12px' }} 
                    formatter={(val: any) => [`₹${val}`, 'Modal Price']}
                  />
                  <Line type="monotone" dataKey="price" stroke="#2e7d32" strokeWidth={3} dot={{ r: 4, fill: '#1b5e20' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
