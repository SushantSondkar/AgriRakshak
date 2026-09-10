import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import './Market.css';

const MOCK_MARKET_DATA = [
  { crop: 'Sugarcane', price: '₹3,150 / Ton', trend: 'up', change: '+2.5%' },
  { crop: 'Onion', price: '₹2,400 / Quintal', trend: 'down', change: '-5.0%' },
  { crop: 'Cotton', price: '₹7,200 / Quintal', trend: 'flat', change: '0%' },
  { crop: 'Soybean', price: '₹4,600 / Quintal', trend: 'up', change: '+1.2%' }
];

export const Market = () => {
  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <h1>Market Prices</h1>
        <p>Live mandi rates for your region</p>
      </div>

      <div className="market-grid">
        {MOCK_MARKET_DATA.map((data, idx) => (
          <div key={idx} className="glass-panel market-card">
            <h3>{data.crop}</h3>
            <div className="price-info">
              <span className="price">{data.price}</span>
              <div className={`trend-badge ${data.trend}`}>
                {data.trend === 'up' && <TrendingUp size={16} />}
                {data.trend === 'down' && <TrendingDown size={16} />}
                {data.trend === 'flat' && <Minus size={16} />}
                {data.change}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
