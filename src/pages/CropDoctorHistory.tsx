import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sprout, 
  Trash2, 
  Eye, 
  ArrowLeft
} from 'lucide-react';
import type { CropDiagnosis } from '../types/cropDoctor';
import { getDiagnosisHistory, deleteDiagnosisFromHistory } from '../services/cropDoctorService';
import { useLanguage } from '../i18n/LanguageContext';
import './CropDoctorHistory.css';

export const CropDoctorHistory = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [history, setHistory] = useState<CropDiagnosis[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [selectedReport, setSelectedReport] = useState<CropDiagnosis | null>(null);

  useEffect(() => {
    const list = getDiagnosisHistory();
    setHistory(list);
  }, []);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(t('common.confirmDelete', 'Are you sure you want to delete this diagnosis record?'))) {
      const updated = deleteDiagnosisFromHistory(id);
      setHistory(updated);
    }
  };

  const filteredHistory = history.filter(item => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Healthy') return item.isHealthy;
    if (activeFilter === 'Disease Detected') return !item.isHealthy && item.status !== 'Needs Review';
    if (activeFilter === 'Needs Review') return item.status === 'Needs Review';
    return true;
  });

  return (
    <div className="cd-history-container animate-fade-in">
      <div className="history-header-wrap">
        <button className="back-btn" onClick={() => navigate('/crop-doctor')}>
          <ArrowLeft size={18} />
          <span>{t('common.back', 'Back to Crop Doctor')}</span>
        </button>

        <div className="history-title-box">
          <div className="history-icon">
            <Sprout size={28} color="#1b5e20" />
          </div>
          <div>
            <h1>{t('cropDoctor.historyTitle')}</h1>
            <p>{t('cropDoctor.historySubtitle')}</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="history-filters">
        {[
          { key: 'All', label: t('cropDoctor.filterAll') },
          { key: 'Healthy', label: t('cropDoctor.filterHealthy') },
          { key: 'Disease Detected', label: t('cropDoctor.filterDisease') },
          { key: 'Needs Review', label: t('cropDoctor.filterReview') }
        ].map(tab => (
          <button
            key={tab.key}
            className={`filter-tab ${activeFilter === tab.key ? 'active' : ''}`}
            onClick={() => setActiveFilter(tab.key)}
          >
            {tab.label}
            {tab.key === 'All' && <span className="count-pill">{history.length}</span>}
          </button>
        ))}
      </div>

      {/* List / Cards */}
      {filteredHistory.length === 0 ? (
        <div className="empty-history-card">
          <Sprout size={48} color="var(--color-primary-light)" />
          <h3>{t('cropDoctor.emptyHistory')}</h3>
          <p>{t('cropDoctor.emptyHistoryDesc', 'You have no diagnosis reports under the selected filter.')}</p>
          <button className="btn-primary-action" onClick={() => navigate('/crop-doctor')}>
            {t('dashboard.cdHeroDiagnoseBtn')}
          </button>
        </div>
      ) : (
        <div className="history-grid">
          {filteredHistory.map(diag => (
            <div key={diag.id} className="history-card" onClick={() => setSelectedReport(diag)}>
              <div className="card-img-wrap">
                <img src={diag.image_url} alt={diag.crop} />
                <span className={`status-pill ${diag.isHealthy ? 'healthy' : 'disease'}`}>
                  {diag.isHealthy ? t('cropDoctor.filterHealthy') : t('cropDoctor.filterDisease')}
                </span>
              </div>

              <div className="card-body">
                <div className="card-meta">
                  <h3>{diag.crop}</h3>
                  <span className="card-date">{new Date(diag.created_at).toLocaleDateString()}</span>
                </div>

                <p className="disease-title">{diag.predicted_disease}</p>

                <div className="card-stats">
                  <div>
                    <span className="stat-lbl">{t('cropDoctor.confidenceLabel')}</span>
                    <span className="stat-val">{diag.confidence}%</span>
                  </div>
                  <div>
                    <span className="stat-lbl">{t('cropDoctor.severityTitle')}</span>
                    <span className={`severity-badge severity-${diag.severity.toLowerCase()}`}>
                      {diag.severity}
                    </span>
                  </div>
                </div>

                <div className="card-actions">
                  <button className="btn-view" onClick={() => setSelectedReport(diag)}>
                    <Eye size={16} />
                    <span>{t('cropDoctor.btnViewReport')}</span>
                  </button>
                  <button className="btn-delete" onClick={e => handleDelete(diag.id, e)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Report Modal */}
      {selectedReport && (
        <div className="modal-overlay" onClick={() => setSelectedReport(null)}>
          <div className="modal-box report-modal-box animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="report-modal-header">
              <h2>Diagnosis Details — {selectedReport.crop}</h2>
              <button className="close-modal-btn" onClick={() => setSelectedReport(null)}>✕</button>
            </div>

            <div className="report-modal-body">
              <div className="report-top">
                <img src={selectedReport.image_url} alt={selectedReport.crop} className="report-img" />
                <div>
                  <h3>{selectedReport.predicted_disease}</h3>
                  <p><strong>Confidence:</strong> {selectedReport.confidence}%</p>
                  <p><strong>Severity:</strong> {selectedReport.severity}</p>
                  <p><strong>Location:</strong> {selectedReport.location.district}, {selectedReport.location.state}</p>
                  <p><strong>Date:</strong> {new Date(selectedReport.created_at).toLocaleString()}</p>
                </div>
              </div>

              <div className="report-section">
                <h4>Symptoms</h4>
                <ul>
                  {selectedReport.symptoms.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>

              <div className="report-section">
                <h4>Immediate Actions</h4>
                <ul>
                  {selectedReport.immediate_actions.map((a, i) => <li key={i}>{a}</li>)}
                </ul>
              </div>

              {selectedReport.verifiedTreatmentOptions.length > 0 && (
                <div className="report-section">
                  <h4>Verified Crop Protection</h4>
                  {selectedReport.verifiedTreatmentOptions.map(p => (
                    <div key={p.id} className="mini-prod">
                      <strong>{p.product_name}</strong> ({p.active_ingredient})<br />
                      <small>{p.application_guidance}</small>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="report-modal-footer">
              <button className="btn-secondary-action" onClick={() => setSelectedReport(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
