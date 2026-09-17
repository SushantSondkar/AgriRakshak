import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sprout, 
  Upload, 
  Camera, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Search, 
  Droplets, 
  Thermometer, 
  Wind, 
  Send, 
  History, 
  Languages, 
  Sparkles 
} from 'lucide-react';
import { analyzeCropImage, submitExpertReview } from '../services/cropDoctorService';
import type { CropDiagnosis, GrowthStage } from '../types/cropDoctor';
import { useLanguage } from '../i18n/LanguageContext';
import './CropDoctor.css';

const CROPS_LIST = ['Tomato', 'Cotton', 'Soybean', 'Onion', 'Grapes', 'Wheat', 'Rice', 'Other'];
const GROWTH_STAGES: GrowthStage[] = ['Seedling', 'Vegetative', 'Flowering', 'Fruiting', 'Harvest'];

export const CropDoctor = () => {
  const navigate = useNavigate();
  const { language, setLanguage, t: globalT } = useLanguage();

  const cdT = new Proxy({}, {
    get: (_target, prop: string) => globalT(`cropDoctor.${prop}`)
  }) as Record<string, string>;
  const t = cdT;

  // Workflow State: 1 = Upload, 2 = Analyzing, 3 = Results
  const [step, setStep] = useState<number>(1);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Form Fields
  const [crop, setCrop] = useState<string>('Tomato');
  const [growthStage, setGrowthStage] = useState<GrowthStage>('Vegetative');
  const [stateName, setStateName] = useState<string>('Maharashtra');
  const [district, setDistrict] = useState<string>('Nashik');
  const [village, setVillage] = useState<string>('Kopargaon');
  const [symptomsObserved, setSymptomsObserved] = useState<string>('');

  // Validation & Error
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Loading Steps State
  const [loadingStepIndex, setLoadingStepIndex] = useState<number>(0);
  const loadingSteps = [
    t.stepExamining,
    t.stepDetecting,
    t.stepComparing,
    t.stepCheckingWeather,
    t.stepPreparing
  ];

  // Diagnosis Result
  const [diagnosis, setDiagnosis] = useState<CropDiagnosis | null>(null);

  // Expert Review Modal
  const [showExpertModal, setShowExpertModal] = useState<boolean>(false);
  const [expertComments, setExpertComments] = useState<string>('');
  const [expertSubmitted, setExpertSubmitted] = useState<boolean>(false);
  const [expertLoading, setExpertLoading] = useState<boolean>(false);

  // Handle File Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Format check
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setErrorMsg('Invalid format: Please upload JPG, PNG or WebP image.');
        return;
      }

      // Size check (10MB)
      if (file.size > 10 * 1024 * 1024) {
        setErrorMsg('Image size exceeds 10 MB limit.');
        return;
      }

      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Handle Retake / Clear
  const handleRetake = () => {
    setSelectedFile(null);
    setImagePreview(null);
    setErrorMsg(null);
    setStep(1);
    setDiagnosis(null);
  };

  // Start AI Analysis Pipeline
  const handleStartAnalysis = async () => {
    if (!imagePreview && !selectedFile) {
      setErrorMsg('Please upload a crop image before analyzing.');
      return;
    }

    setStep(2);
    setErrorMsg(null);

    // Animate loading steps
    setLoadingStepIndex(0);
    const stepInterval = setInterval(() => {
      setLoadingStepIndex(prev => {
        if (prev < loadingSteps.length - 1) return prev + 1;
        clearInterval(stepInterval);
        return prev;
      });
    }, 450);

    try {
      const result = await analyzeCropImage({
        imageFile: selectedFile || undefined,
        imageUrl: imagePreview || undefined,
        crop,
        growthStage,
        location: { state: stateName, district, village },
        symptomsObserved
      });

      clearInterval(stepInterval);
      setDiagnosis(result);
      setStep(3);
    } catch (err: any) {
      clearInterval(stepInterval);
      setErrorMsg(err.message || 'Crop Doctor is temporarily unavailable. Please try again.');
      setStep(1);
    }
  };

  // Submit to Expert
  const handleExpertSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!diagnosis) return;

    setExpertLoading(true);
    try {
      await submitExpertReview(diagnosis.id, expertComments);
      setExpertSubmitted(true);
      setTimeout(() => {
        setShowExpertModal(false);
        setExpertSubmitted(false);
        setExpertComments('');
      }, 2500);
    } catch (err) {
      console.error(err);
    } finally {
      setExpertLoading(false);
    }
  };

  return (
    <div className="crop-doctor-container animate-fade-in">
      {/* Top Header & Language Toggle */}
      <div className="cd-header-wrap">
        <div className="cd-title-box">
          <div className="cd-title-icon">
            <Sprout size={32} color="#1b5e20" />
          </div>
          <div>
            <h1>{t.title}</h1>
            <p>{t.subtitle}</p>
          </div>
        </div>

        <div className="cd-header-actions">
          <div className="lang-switcher">
            <Languages size={18} />
            <button className={language === 'en' ? 'active' : ''} onClick={() => setLanguage('en')}>EN</button>
            <button className={language === 'mr' ? 'active' : ''} onClick={() => setLanguage('mr')}>मराठी</button>
            <button className={language === 'hi' ? 'active' : ''} onClick={() => setLanguage('hi')}>हिन्दी</button>
          </div>

          <button className="cd-history-btn" onClick={() => navigate('/crop-doctor/history')}>
            <History size={18} />
            <span>{t.btnHistory}</span>
          </button>
        </div>
      </div>

      {/* 3-Step Progress Indicator */}
      <div className="cd-progress-bar">
        <div className={`cd-progress-step ${step >= 1 ? 'active' : ''}`}>
          <span className="step-num">01</span>
          <span className="step-label">{t.step1}</span>
        </div>
        <div className="cd-progress-line"></div>
        <div className={`cd-progress-step ${step >= 2 ? 'active' : ''}`}>
          <span className="step-num">02</span>
          <span className="step-label">{t.step2}</span>
        </div>
        <div className="cd-progress-line"></div>
        <div className={`cd-progress-step ${step >= 3 ? 'active' : ''}`}>
          <span className="step-num">03</span>
          <span className="step-label">{t.step3}</span>
        </div>
      </div>

      {errorMsg && (
        <div className="cd-error-banner">
          <AlertTriangle size={20} />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* STEP 1: UPLOAD & CROP INFORMATION */}
      {step === 1 && (
        <div className="cd-step-grid">
          {/* Left Column: Image Upload Area */}
          <div className="cd-card upload-card">
            <h2>{t.uploadTitle}</h2>
            <p className="subtext">{t.uploadSubtitle}</p>

            {!imagePreview ? (
              <div className="dropzone-area">
                <div className="dropzone-icon">
                  <Upload size={44} color="var(--color-primary)" />
                </div>
                <h3>{t.uploadTitle}</h3>
                <p>{t.maxSizeNotice}</p>

                <div className="upload-buttons">
                  <label className="btn-primary-action">
                    <Camera size={20} />
                    <span>{t.btnTakePhoto}</span>
                    <input type="file" accept="image/*" capture="environment" onChange={handleFileChange} hidden />
                  </label>

                  <label className="btn-secondary-action">
                    <Upload size={20} />
                    <span>{t.btnUploadDevice}</span>
                    <input type="file" accept="image/jpeg,image/jpg,image/png,image/webp" onChange={handleFileChange} hidden />
                  </label>
                </div>
              </div>
            ) : (
              <div className="preview-container">
                <img src={imagePreview} alt="Crop Preview" className="crop-preview-img" />
                <div className="preview-actions">
                  <button className="btn-secondary-action" onClick={handleRetake}>
                    <RefreshCw size={18} />
                    <span>{t.btnRetake}</span>
                  </button>
                  <button className="btn-primary-action" onClick={handleStartAnalysis}>
                    <Sparkles size={18} />
                    <span>{t.btnAnalyze}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Quality Checklist */}
            <div className="quality-checklist">
              <h4>{t.checklistTitle}</h4>
              <div className="checklist-grid">
                <span>✓ {t.check1}</span>
                <span>✓ {t.check2}</span>
                <span>✓ {t.check3}</span>
                <span>✓ {t.check4}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Crop Context Information Form */}
          <div className="cd-card form-card">
            <h2>Contextual Crop Details</h2>
            <p className="subtext">Provide details for accurate disease & weather risk correlation.</p>

            <div className="cd-form">
              <div className="form-group">
                <label>{t.cropSelect}</label>
                <select value={crop} onChange={e => setCrop(e.target.value)}>
                  {CROPS_LIST.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label>{t.growthStageSelect}</label>
                <select value={growthStage} onChange={e => setGrowthStage(e.target.value as GrowthStage)}>
                  {GROWTH_STAGES.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>{t.stateLabel}</label>
                  <input type="text" value={stateName} onChange={e => setStateName(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>{t.districtLabel}</label>
                  <input type="text" value={district} onChange={e => setDistrict(e.target.value)} />
                </div>
              </div>

              <div className="form-group">
                <label>{t.villageLabel}</label>
                <input type="text" value={village} onChange={e => setVillage(e.target.value)} />
              </div>

              <div className="form-group">
                <label>{t.symptomsLabel}</label>
                <textarea 
                  rows={3} 
                  placeholder={t.symptomsPlaceholder} 
                  value={symptomsObserved} 
                  onChange={e => setSymptomsObserved(e.target.value)}
                />
              </div>

              {imagePreview && (
                <button className="btn-primary-action full-width" onClick={handleStartAnalysis}>
                  <Sparkles size={20} />
                  <span>{t.btnAnalyze}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: AI LOADING ANIMATION */}
      {step === 2 && (
        <div className="cd-card loading-card animate-fade-in">
          <div className="pulse-spinner">
            <Search size={48} color="var(--color-primary)" />
          </div>

          <h2>Examining Crop Health</h2>
          <p className="loading-status-text">{loadingSteps[loadingStepIndex]}</p>

          <div className="loading-progress-track">
            <div 
              className="loading-progress-fill" 
              style={{ width: `${((loadingStepIndex + 1) / loadingSteps.length) * 100}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* STEP 3: AI DIAGNOSIS RESULT DASHBOARD */}
      {step === 3 && diagnosis && (
        <div className="cd-results-wrapper animate-fade-in">
          {/* Low Confidence Warning (if confidence < 60%) */}
          {diagnosis.confidence < 60 && (
            <div className="cd-alert-banner low-confidence">
              <AlertTriangle size={24} />
              <div>
                <h4>Low Confidence Detection</h4>
                <p>{t.lowConfidenceWarning}</p>
              </div>
              <button className="btn-secondary-action" onClick={handleRetake}>
                {t.btnRetake}
              </button>
            </div>
          )}

          {/* Top Section: Health Analysis Card */}
          <div className="cd-card result-main-card">
            <div className="result-header">
              <h2>{t.resultTitle}</h2>
              <span className={`status-badge ${diagnosis.isHealthy ? 'healthy' : 'attention'}`}>
                {diagnosis.isHealthy ? t.statusHealthy : t.statusAttention}
              </span>
            </div>

            <div className="result-body-grid">
              {/* Uploaded Image */}
              <div className="result-img-box">
                <img src={diagnosis.image_url} alt="Analyzed Leaf" />
                <span className="img-tag">{diagnosis.crop} • {diagnosis.growth_stage}</span>
              </div>

              {/* Diagnosis Details */}
              <div className="result-meta-box">
                <div className="meta-row">
                  <span className="meta-label">Crop:</span>
                  <span className="meta-val bold">{diagnosis.crop}</span>
                </div>

                <div className="meta-row">
                  <span className="meta-label">{t.possibleDisease}:</span>
                  <span className="meta-val disease-name">{diagnosis.predicted_disease}</span>
                </div>

                {/* Confidence Gauge */}
                <div className="confidence-container">
                  <div className="confidence-header">
                    <span>{t.confidenceLabel}:</span>
                    <span className="confidence-percentage">{diagnosis.confidence}%</span>
                  </div>
                  <div className="confidence-bar-bg">
                    <div className="confidence-bar-fill" style={{ width: `${diagnosis.confidence}%` }}></div>
                  </div>
                </div>

                {/* Severity Card */}
                <div className="severity-row">
                  <div>
                    <span className="meta-label">{t.severityTitle}:</span>
                    <span className={`severity-tag severity-${diagnosis.severity.toLowerCase()}`}>
                      {diagnosis.severity}
                    </span>
                  </div>
                  <div>
                    <span className="meta-label">{t.affectedArea}</span>
                    <span className="meta-val">{diagnosis.affected_area_percentage || t.severityUnavailable}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Healthy Notice vs Disease Explanation */}
            {diagnosis.isHealthy ? (
              <div className="healthy-notice-box">
                <CheckCircle2 size={24} color="#2e7d32" />
                <p>{t.healthyNotice}</p>
              </div>
            ) : (
              <>
                {/* Symptoms Detected */}
                <div className="section-block">
                  <h3>{t.symptomsTitle}</h3>
                  <ul className="symptoms-list">
                    {diagnosis.symptoms.map((sym, idx) => (
                      <li key={idx}>
                        <CheckCircle2 size={16} color="var(--color-primary-light)" />
                        <span>{sym}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* AI Explanation */}
                <div className="section-block ai-exp-box">
                  <h3>{t.explanationTitle}</h3>
                  <p>{diagnosis.ai_explanation}</p>
                  <span className="disclaimer-text">{t.aiDisclaimerNotice}</span>
                </div>
              </>
            )}
          </div>

          {/* Treatment Guidance Section */}
          {!diagnosis.isHealthy && (
            <>
              <div className="cd-card guidance-card">
                <h2>{t.actionsTitle}</h2>

                <div className="guidance-grid">
                  <div className="guidance-col immediate">
                    <h3>{t.immediateActions}</h3>
                    <ul>
                      {diagnosis.immediate_actions.map((act, idx) => (
                        <li key={idx}>
                          <span className="num-bullet">{idx + 1}</span>
                          <span>{act}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="guidance-col prevention">
                    <h3>{t.preventionTitle}</h3>
                    <ul>
                      {diagnosis.prevention_tips.map((prev, idx) => (
                        <li key={idx}>
                          <span className="dot-bullet">•</span>
                          <span>{prev}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Verified Crop Protection Products */}
              <div className="cd-card Protection-card">
                <h2>{t.protectionTitle}</h2>
                <div className="safety-warning-banner">
                  <ShieldAlert size={22} />
                  <span>{t.protectionWarning}</span>
                </div>

                {diagnosis.verifiedTreatmentOptions.length > 0 ? (
                  <div className="products-grid">
                    {diagnosis.verifiedTreatmentOptions.map(prod => (
                      <div key={prod.id} className="product-item-card">
                        <div className="prod-header">
                          <h4>{prod.product_name}</h4>
                          <span className="prod-status">{prod.status}</span>
                        </div>

                        <div className="prod-meta">
                          <p><strong>{t.activeIngredient}:</strong> {prod.active_ingredient}</p>
                          <p><strong>{t.applicationGuidance}:</strong> {prod.application_guidance}</p>
                          <p><strong>{t.safetyPPE}:</strong> {prod.ppe}</p>
                          <p><strong>{t.phi}:</strong> {prod.pre_harvest_interval}</p>
                          <p className="source-tag"><strong>{t.verificationSource}:</strong> {prod.source} ({prod.verification_date})</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="no-protection-msg">{t.noProtectionFound}</p>
                )}
              </div>

              {/* Integrated Crop Management */}
              <div className="cd-card icm-card">
                <h2>{t.integratedTitle}</h2>
                <div className="icm-grid">
                  <div className="icm-item">
                    <h4>{t.irrigationMgmt}</h4>
                    <p>{diagnosis.integratedManagement.irrigation}</p>
                  </div>
                  <div className="icm-item">
                    <h4>{t.fieldHygiene}</h4>
                    <p>{diagnosis.integratedManagement.hygiene}</p>
                  </div>
                  <div className="icm-item">
                    <h4>{t.pestMonitoring}</h4>
                    <p>{diagnosis.integratedManagement.pestMonitoring}</p>
                  </div>
                  <div className="icm-item">
                    <h4>{t.cropNutrition}</h4>
                    <p>{diagnosis.integratedManagement.nutrition}</p>
                  </div>
                  <div className="icm-item">
                    <h4>{t.environmentalMgmt}</h4>
                    <p>{diagnosis.integratedManagement.environmental}</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Weather Correlation & Expert Review */}
          <div className="cd-bottom-grid">
            <div className="cd-card weather-card">
              <h3>{t.weatherTitle}</h3>
              {diagnosis.weather_risk_factor && (
                <div className="weather-widgets">
                  <div className="weather-chip">
                    <Thermometer size={18} />
                    <span>{diagnosis.weather_risk_factor.currentTemp}°C</span>
                  </div>
                  <div className="weather-chip">
                    <Droplets size={18} />
                    <span>{diagnosis.weather_risk_factor.humidity}% Humidity</span>
                  </div>
                  <div className="weather-chip">
                    <Wind size={18} />
                    <span>{diagnosis.weather_risk_factor.rainfall} mm Rain</span>
                  </div>
                </div>
              )}
              <p className="weather-risk-msg">{diagnosis.weather_risk_factor?.riskMessage}</p>
            </div>

            <div className="cd-card confidence-card">
              <h3>{t.confidenceFooter}</h3>
              <p>Model: <strong>{diagnosis.model_version}</strong></p>
              <p className="subtext">AI diagnosis is an assistance tool and should not replace professional agricultural advice.</p>
              
              <div className="action-buttons-row">
                <button className="btn-secondary-action" onClick={() => setShowExpertModal(true)}>
                  <Send size={18} />
                  <span>{t.btnAskExpert}</span>
                </button>
                <button className="btn-primary-action" onClick={handleRetake}>
                  <RefreshCw size={18} />
                  <span>Analyze Another Crop</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Expert Review Modal */}
      {showExpertModal && (
        <div className="modal-overlay">
          <div className="modal-box glass-panel animate-fade-in">
            <h3>{t.expertModalTitle}</h3>
            <p>{t.expertModalSub}</p>

            {expertSubmitted ? (
              <div className="expert-success">
                <CheckCircle2 size={48} color="#2e7d32" />
                <p>{t.expertSuccessMsg}</p>
              </div>
            ) : (
              <form onSubmit={handleExpertSubmit} className="expert-form">
                <div className="form-group">
                  <label>Additional Notes / Observations for Agriculture Officer</label>
                  <textarea 
                    rows={4} 
                    placeholder="Provide any field context or questions..."
                    value={expertComments}
                    onChange={e => setExpertComments(e.target.value)}
                  />
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn-secondary-action" onClick={() => setShowExpertModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary-action" disabled={expertLoading}>
                    {expertLoading ? 'Submitting...' : t.btnSubmitExpert}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
