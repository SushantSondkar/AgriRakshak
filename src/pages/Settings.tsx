import { useAuth } from '../context/AuthContext';
import './Settings.css';

export const Settings = () => {
  const { user } = useAuth();

  return (
    <div className="page-container animate-fade-in">
      <div className="page-header">
        <h1>Settings & Profile</h1>
        <p>Manage your account and preferences</p>
      </div>

      <div className="settings-grid">
        <div className="glass-panel settings-card">
          <h2>Profile Information</h2>
          <div className="settings-form">
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" defaultValue={user?.name} readOnly />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input type="text" defaultValue={user?.phone} readOnly />
            </div>
            <div className="form-group">
              <label>Primary Region</label>
              <input type="text" defaultValue={user?.region} readOnly />
            </div>
          </div>
        </div>

        <div className="glass-panel settings-card">
          <h2>Notification Preferences</h2>
          <div className="toggle-group">
            <div className="toggle-item">
              <div>
                <h4>SMS Alerts</h4>
                <p>Receive critical weather and pest alerts via SMS</p>
              </div>
              <label className="switch">
                <input type="checkbox" defaultChecked />
                <span className="slider round"></span>
              </label>
            </div>
            <div className="toggle-item">
              <div>
                <h4>Push Notifications</h4>
                <p>Receive app notifications for daily advisories</p>
              </div>
              <label className="switch">
                <input type="checkbox" defaultChecked />
                <span className="slider round"></span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
