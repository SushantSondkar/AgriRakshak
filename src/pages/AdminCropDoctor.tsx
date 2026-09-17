import { useState } from 'react';
import { 
  Brain, 
  Database, 
  Activity, 
  BarChart3, 
  Layers, 
  CheckCircle, 
  XCircle, 
  AlertCircle 
} from 'lucide-react';
import { getAdminModelOverview } from '../services/cropDoctorService';
import './AdminCropDoctor.css';

export const AdminCropDoctor = () => {
  const [metrics] = useState(getAdminModelOverview());

  return (
    <div className="admin-cd-container animate-fade-in">
      <div className="admin-header">
        <div className="admin-title-box">
          <Brain size={32} color="var(--color-primary)" />
          <div>
            <h1>Admin ML Crop Doctor Operations</h1>
            <p>Model architecture, dataset telemetry, confusion matrix & feedback loops</p>
          </div>
        </div>
        <div className="model-version-tag">
          {metrics.currentModel} ({metrics.version})
        </div>
      </div>

      {/* Top Stat Cards */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="stat-icon-box primary"><Activity size={24} /></div>
          <div>
            <h3>Overall Accuracy</h3>
            <p className="stat-number">{metrics.accuracy}%</p>
            <span className="stat-sub">F1 Score: {metrics.f1Score}</span>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-icon-box info"><Database size={24} /></div>
          <div>
            <h3>Dataset Size</h3>
            <p className="stat-number">{metrics.datasetSize.toLocaleString()}</p>
            <span className="stat-sub">Validated crop field images</span>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-icon-box warning"><Layers size={24} /></div>
          <div>
            <h3>Total Diagnoses</h3>
            <p className="stat-number">{metrics.totalDiagnoses.toLocaleString()}</p>
            <span className="stat-sub">Live farmer predictions</span>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-icon-box success"><BarChart3 size={24} /></div>
          <div>
            <h3>Disease Classes</h3>
            <p className="stat-number">{metrics.diseaseClassesCount}</p>
            <span className="stat-sub">Supported crop pathogens</span>
          </div>
        </div>
      </div>

      {/* Per-Class Performance Table */}
      <div className="admin-card">
        <h2>Per-Class Classification Metrics</h2>
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Disease Class Name</th>
                <th>Precision</th>
                <th>Recall</th>
                <th>F1 Score</th>
                <th>Validation Samples</th>
              </tr>
            </thead>
            <tbody>
              {metrics.classMetrics.map((cls, idx) => (
                <tr key={idx}>
                  <td className="font-bold">{cls.className}</td>
                  <td>{(cls.precision * 100).toFixed(1)}%</td>
                  <td>{(cls.recall * 100).toFixed(1)}%</td>
                  <td><span className="f1-badge">{cls.f1}</span></td>
                  <td>{cls.samplesCount.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confusion Matrix & Feedback Split */}
      <div className="admin-two-col">
        {/* Confusion Matrix */}
        <div className="admin-card">
          <h2>Validation Confusion Matrix</h2>
          <p className="subtext">Diagonal cells represent correct disease classifications across test split.</p>

          <div className="confusion-matrix-table-wrap">
            <table className="matrix-table">
              <thead>
                <tr>
                  <th>Target \ Pred</th>
                  {metrics.confusionMatrix.labels.map((lbl, i) => (
                    <th key={i}>{lbl.split(' ')[0]}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {metrics.confusionMatrix.matrix.map((row, rIdx) => (
                  <tr key={rIdx}>
                    <td className="matrix-row-hdr">{metrics.confusionMatrix.labels[rIdx].split(' ')[0]}</td>
                    {row.map((val, cIdx) => (
                      <td 
                        key={cIdx} 
                        className={rIdx === cIdx ? 'cell-diagonal' : (val > 0 ? 'cell-misclass' : '')}
                      >
                        {val}%
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Model Feedback Loop */}
        <div className="admin-card">
          <h2>Farmer & Expert Feedback Loop</h2>
          <p className="subtext">Continuous telemetry stored for active learning pipeline retraining.</p>

          <div className="feedback-list">
            <div className="feedback-item correct">
              <CheckCircle size={28} />
              <div>
                <h4>Verified Correct Diagnoses</h4>
                <p>{metrics.feedbackStats.correctCount.toLocaleString()} positive confirmations</p>
              </div>
            </div>

            <div className="feedback-item incorrect">
              <XCircle size={28} />
              <div>
                <h4>Farmer Reported Discrepancies</h4>
                <p>{metrics.feedbackStats.incorrectCount.toLocaleString()} flagged for retraining</p>
              </div>
            </div>

            <div className="feedback-item review">
              <AlertCircle size={28} />
              <div>
                <h4>Expert Extension Reviews</h4>
                <p>{metrics.feedbackStats.expertReviewCount.toLocaleString()} expert verified cases</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
