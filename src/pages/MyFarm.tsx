import { useState, useEffect } from 'react';
import { 
  Sprout, 
  MapPin, 
  Calendar, 
  CheckCircle, 
  Save, 
  Sparkles,
  Info,
  Maximize2
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { 
  getSavedFarmProfile, 
  saveFarmProfile, 
  computeWaterIntelligence,
  type FarmProfileData 
} from '../services/waterIntelligenceService';
import './MyFarm.css';

export const MyFarm = () => {
  const { language } = useLanguage();
  const [profile, setProfile] = useState<FarmProfileData>(getSavedFarmProfile());
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [activeDecision, setActiveDecision] = useState(computeWaterIntelligence(profile));

  useEffect(() => {
    setActiveDecision(computeWaterIntelligence(profile));
  }, [profile.district, profile.currentCrop, profile.soilType, profile.irrigationType]);

  const handleChange = (field: keyof FarmProfileData, value: any) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveFarmProfile(profile);
    setActiveDecision(computeWaterIntelligence(profile));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="my-farm-container animate-fade-in">
      {/* Header Banner */}
      <div className="my-farm-header glass-panel">
        <div className="mf-title-row">
          <div className="mf-icon-box">
            <Sprout size={28} color="#1b5e20" />
          </div>
          <div>
            <h1>{language === 'mr' ? 'माझे शेत (My Farm Profile)' : language === 'hi' ? 'मेरा खेत (My Farm Profile)' : 'My Farm Profile'}</h1>
            <p>
              {language === 'mr' 
                ? 'आपल्या शेताची अचूक माहिती भरा. या आधारे आजचा सिंचन निर्णय व पाण्याचे नियोजन केले जाते.' 
                : language === 'hi'
                ? 'अपने खेत का सटीक विवरण भरें। इसके आधार पर सिंचाई निर्णय और जल योजना तैयार की जाती है।'
                : 'Manage your farm parameters to personalize rainfall-groundwater fusion decisions and irrigation schedules.'}
            </p>
          </div>
        </div>

        {/* Dynamic Personalization Impact Pill */}
        <div className="mf-impact-pill">
          <Sparkles size={16} color="#1b5e20" />
          <span>
            {language === 'mr' 
              ? `सध्याचा सिंचन सल्ला: ${activeDecision.decisionTitleMr}`
              : language === 'hi'
              ? `वर्तमान सिंचाई सलाह: ${activeDecision.decisionTitleHi}`
              : `Active Decision: ${activeDecision.decisionTitle}`}
          </span>
        </div>
      </div>

      {savedSuccess && (
        <div className="save-success-banner animate-fade-in">
          <CheckCircle size={20} />
          <span>
            {language === 'mr' 
              ? '✓ शेताची माहिती यशस्वीरीत्या सेव्ह केली! डॅशबोर्डवरील सिंचन सल्ला अद्ययावत झाला आहे.'
              : language === 'hi'
              ? '✓ खेत का विवरण सफलतापूर्वक सहेजा गया! डैशबोर्ड पर सिंचाई सलाह अपडेट हो गई है।'
              : '✓ Farm profile updated successfully! Real-time irrigation advisories refreshed.'}
          </span>
        </div>
      )}

      {/* Main Grid: Edit Form + Telemetry Summary Card */}
      <div className="my-farm-grid">
        {/* Left Form: Parameters */}
        <div className="farm-form-card glass-panel">
          <div className="card-sec-header">
            <h3>{language === 'mr' ? 'शेतीची तपशीलवार माहिती' : language === 'hi' ? 'खेत का विस्तृत विवरण' : 'Farm Configuration Parameters'}</h3>
            <span className="badge-kisan">Personalized Model</span>
          </div>

          <form onSubmit={handleSave} className="farm-edit-form">
            <div className="form-row-2">
              <div className="mf-input-group">
                <label>Farmer Name / शेतकऱ्याचे नाव</label>
                <input 
                  type="text" 
                  value={profile.farmerName} 
                  onChange={e => handleChange('farmerName', e.target.value)}
                  placeholder="e.g. Sushant Sondkar"
                  required
                />
              </div>

              <div className="mf-input-group">
                <label>District / जिल्हा (Target Hydrology Hub)</label>
                <select 
                  value={profile.district} 
                  onChange={e => handleChange('district', e.target.value as any)}
                >
                  <option value="Nashik">Nashik District (नाशिक जिल्हा)</option>
                  <option value="Pune">Pune District (पुणे जिल्हा)</option>
                </select>
              </div>
            </div>

            <div className="form-row-2">
              <div className="mf-input-group">
                <label>Taluka / Village / गाव किंवा तालुका</label>
                <div className="input-with-icon">
                  <MapPin size={16} className="inp-icon" />
                  <input 
                    type="text" 
                    value={profile.location} 
                    onChange={e => handleChange('location', e.target.value)}
                    placeholder="e.g. Kopargaon, Niphad, Baramati"
                    required
                  />
                </div>
              </div>

              <div className="mf-input-group">
                <label>Land Area / क्षेत्र (Acres / एकर)</label>
                <div className="input-with-icon">
                  <Maximize2 size={16} className="inp-icon" />
                  <input 
                    type="number" 
                    step="0.1" 
                    min="0.1"
                    value={profile.landArea} 
                    onChange={e => handleChange('landArea', parseFloat(e.target.value) || 1)}
                    placeholder="5.5"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-row-2">
              <div className="mf-input-group">
                <label>Current Major Crop / सध्याचे मुख्य पीक</label>
                <select 
                  value={profile.currentCrop} 
                  onChange={e => handleChange('currentCrop', e.target.value)}
                >
                  <option value="Soybean">Soybean (सोयाबीन)</option>
                  <option value="Onion">Onion (कांदा)</option>
                  <option value="Tomato">Tomato (टोमॅटो)</option>
                  <option value="Sugarcane">Sugarcane (ऊस)</option>
                  <option value="Cotton">Cotton (कापूस)</option>
                  <option value="Grapes">Grapes (द्राक्षे)</option>
                  <option value="Pomegranate">Pomegranate (डाळिंब)</option>
                  <option value="Maize">Maize (मका)</option>
                </select>
              </div>

              <div className="mf-input-group">
                <label>Sowing Date / पेरणी किंवा लागवड तारीख</label>
                <div className="input-with-icon">
                  <Calendar size={16} className="inp-icon" />
                  <input 
                    type="date" 
                    value={profile.sowingDate} 
                    onChange={e => handleChange('sowingDate', e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="form-row-3">
              <div className="mf-input-group">
                <label>Soil Type / मातीचा प्रकार</label>
                <select 
                  value={profile.soilType} 
                  onChange={e => handleChange('soilType', e.target.value as any)}
                >
                  <option value="Black Soil">Black Soil / काळी माती (High Moisture Retention)</option>
                  <option value="Red Soil">Red Soil / तांबडी माती (Moderate Retention)</option>
                  <option value="Alluvial Soil">Alluvial Soil / गाळाची माती</option>
                  <option value="Loamy Soil">Loamy Soil / पोयटा माती</option>
                </select>
              </div>

              <div className="mf-input-group">
                <label>Irrigation Type / सिंचन पद्धत</label>
                <select 
                  value={profile.irrigationType} 
                  onChange={e => handleChange('irrigationType', e.target.value as any)}
                >
                  <option value="Drip">Drip Irrigation / ठिबक सिंचन (Micro)</option>
                  <option value="Sprinkler">Sprinkler / तुषार सिंचन</option>
                  <option value="Flood">Flood Irrigation / पाटपाणी (Surface)</option>
                </select>
              </div>

              <div className="mf-input-group">
                <label>Water Source / पाण्याचा मुख्य स्त्रोत</label>
                <select 
                  value={profile.waterSource} 
                  onChange={e => handleChange('waterSource', e.target.value as any)}
                >
                  <option value="Borewell">Borewell / बोअरवेल</option>
                  <option value="Open Well">Open Well / विहीर</option>
                  <option value="Canal">Canal / कालवा</option>
                  <option value="River">River / नदी उपसा</option>
                </select>
              </div>
            </div>

            <button type="submit" className="btn-save-farm">
              <Save size={18} />
              <span>{language === 'mr' ? 'माहिती सेव्ह करा व निर्णय अद्ययावत करा' : language === 'hi' ? 'विवरण सहेजें और निर्णय अपडेट करें' : 'Save Profile & Refresh Decision'}</span>
            </button>
          </form>
        </div>

        {/* Right Card: Real-time Decision Profile Card */}
        <div className="farm-preview-col">
          <div className="preview-status-card glass-panel">
            <div className="psc-header">
              <h4>Farm Status Snapshot</h4>
              <span className="psc-tag">{profile.district} District</span>
            </div>

            <div className="psc-body">
              <div className="psc-metric-item">
                <span className="psc-label">Farmer:</span>
                <span className="psc-val">{profile.farmerName}</span>
              </div>
              <div className="psc-metric-item">
                <span className="psc-label">Location:</span>
                <span className="psc-val">{profile.location}, {profile.district}</span>
              </div>
              <div className="psc-metric-item">
                <span className="psc-label">Crop & Acreage:</span>
                <span className="psc-val">{profile.currentCrop} ({profile.landArea} Acres)</span>
              </div>
              <div className="psc-metric-item">
                <span className="psc-label">Soil Profile:</span>
                <span className="psc-val">{profile.soilType}</span>
              </div>
              <div className="psc-metric-item">
                <span className="psc-label">Water Source:</span>
                <span className="psc-val">{profile.waterSource} ({profile.irrigationType})</span>
              </div>
            </div>

            <div className="psc-decision-box" style={{ borderColor: activeDecision.decisionColor }}>
              <div className="pdb-title">
                <span>{activeDecision.badgeIcon} Today's Farm Decision</span>
              </div>
              <div className="pdb-verdict" style={{ color: activeDecision.decisionColor }}>
                {language === 'mr' ? activeDecision.decisionTitleMr : language === 'hi' ? activeDecision.decisionTitleHi : activeDecision.decisionTitle}
              </div>
              <p className="pdb-reason">
                {language === 'mr' ? activeDecision.reasonSummaryMr : language === 'hi' ? activeDecision.reasonSummaryHi : activeDecision.reasonSummary}
              </p>
            </div>

            <div className="psc-tip">
              <Info size={14} />
              <span>
                {language === 'mr'
                  ? 'टीप: मातीचा प्रकार किंवा सिंचन पद्धत बदलल्यास पाणी देण्याची वेळ व प्रमाण त्यानुसार आपोआप बदलते.'
                  : 'Note: Changing soil or irrigation parameters directly recalculates soil moisture depletion rates.'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
