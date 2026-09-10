import { AlertTriangle, CloudRain, Bug } from 'lucide-react';
import './Alerts.css';

const mockAlerts = [
  { id: 1, type: 'weather', severity: 'high', title: 'Heavy Rainfall Expected', message: 'Nashik district expected to receive 50mm+ rainfall in the next 48 hours. Ensure proper drainage for crops.', date: 'Today, 08:30 AM', icon: CloudRain },
  { id: 2, type: 'pest', severity: 'medium', title: 'Pest Outbreak Alert', message: 'Early signs of Aphids detected in nearby regions. Preventive spraying recommended for Onion crops.', date: 'Yesterday, 14:15 PM', icon: Bug },
  { id: 3, type: 'system', severity: 'low', title: 'System Maintenance', message: 'Platform will undergo brief maintenance tonight between 2 AM and 3 AM.', date: 'Sept 08, 10:00 AM', icon: AlertTriangle }
];

export const Alerts = () => {
  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <h1>Alerts & Notifications</h1>
        <p>Stay updated with critical regional alerts</p>
      </div>

      <div className="alerts-list">
        {mockAlerts.map(alert => {
          const Icon = alert.icon;
          return (
            <div key={alert.id} className={`glass-panel alert-card severity-${alert.severity}`}>
              <div className="alert-icon">
                <Icon size={24} />
              </div>
              <div className="alert-content">
                <div className="alert-header">
                  <h3>{alert.title}</h3>
                  <span className="alert-date">{alert.date}</span>
                </div>
                <p>{alert.message}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
