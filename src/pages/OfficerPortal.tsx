import { useState } from 'react';
import { 
  UserCheck, 
  Send, 
  CheckCircle2, 
  Upload, 
  ShieldAlert
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { useAuth } from '../context/AuthContext';
import './OfficerPortal.css';

interface OfficerCase {
  id: string;
  farmerName: string;
  phone: string;
  district: string;
  taluka: string;
  crop: string;
  problemTitle: string;
  description: string;
  photoUrl?: string;
  status: 'New' | 'Reviewing' | 'Resolved';
  priority: 'High' | 'Medium' | 'Normal';
  createdAt: string;
  officerResponse?: string;
  resolvedAt?: string;
}

const INITIAL_CASES: OfficerCase[] = [
  {
    id: 'CASE-1082',
    farmerName: 'Ramesh Patil',
    phone: '+91 98220 12345',
    district: 'Nashik',
    taluka: 'Kopargaon',
    crop: 'Soybean',
    problemTitle: 'Yellow Mosaic Virus Spread & Severe Leaf Curling',
    description: 'Noticed widespread yellowing on 3 acres of soybean crop after continuous rain. Drip irrigation has been stopped as advised.',
    photoUrl: 'https://images.unsplash.com/photo-1599420186946-7b6fb4e297f0?w=500&auto=format&fit=crop',
    status: 'Reviewing',
    priority: 'High',
    createdAt: '22 Sep 2026, 09:30 AM',
    officerResponse: 'Sample forwarded to Niphad KVK lab. Apply Thiamethoxam 25% WG at 0.5g/L water immediately to control whitefly vectors.'
  },
  {
    id: 'CASE-1081',
    farmerName: 'Suresh Shinde',
    phone: '+91 94231 98765',
    district: 'Pune',
    taluka: 'Baramati',
    crop: 'Sugarcane',
    problemTitle: 'Groundwater Borewell Salinity Stress',
    description: 'Borewell water level dropped by 45 feet. Cane leaves showing white salty burn marks on tips.',
    status: 'New',
    priority: 'High',
    createdAt: '22 Sep 2026, 07:15 AM'
  },
  {
    id: 'CASE-1080',
    farmerName: 'Anil Deshmukh',
    phone: '+91 98212 55443',
    district: 'Nashik',
    taluka: 'Niphad',
    crop: 'Grapes',
    problemTitle: 'Downy Mildew Weather Risk Consultation',
    description: 'High humidity reported. Seeking clearance for preventive metalaxyl spraying before expected rain.',
    photoUrl: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=500&auto=format&fit=crop',
    status: 'Resolved',
    priority: 'Medium',
    createdAt: '21 Sep 2026, 02:40 PM',
    officerResponse: 'Approved. Spray Potassium Phosphonate 3g/L + Mancozeb 2g/L. Ensure canopy aeration.',
    resolvedAt: '21 Sep 2026, 06:10 PM'
  }
];

export const OfficerPortal = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'submit' | 'officer_dashboard'>('submit');
  const [cases, setCases] = useState<OfficerCase[]>(INITIAL_CASES);
  
  // Submit Form States
  const [farmerName, setFarmerName] = useState(user?.name || 'Ramesh Patil');
  const [district, setDistrict] = useState(user?.district || 'Nashik');
  const [taluka, setTaluka] = useState('Kopargaon');
  const [crop, setCrop] = useState('Soybean');
  const [problemTitle, setProblemTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'High' | 'Medium' | 'Normal'>('Medium');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Officer Triage Filter States
  const [statusFilter, setStatusFilter] = useState<'All' | 'New' | 'Reviewing' | 'Resolved'>('All');
  const [selectedCase, setSelectedCase] = useState<OfficerCase | null>(INITIAL_CASES[0]);
  const [officerReplyText, setOfficerReplyText] = useState('');

  const handleSubmitCase = (e: React.FormEvent) => {
    e.preventDefault();
    const newCase: OfficerCase = {
      id: `CASE-${Math.floor(1000 + Math.random() * 9000)}`,
      farmerName,
      phone: user?.phone || '+91 98220 12345',
      district,
      taluka,
      crop,
      problemTitle,
      description,
      status: 'New',
      priority,
      createdAt: new Date().toLocaleString([], { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    };

    setCases([newCase, ...cases]);
    setSubmitSuccess(true);
    setProblemTitle('');
    setDescription('');
    setTimeout(() => setSubmitSuccess(false), 4000);
  };

  const handleUpdateStatus = (caseId: string, newStatus: 'Reviewing' | 'Resolved', reply?: string) => {
    setCases(prev => prev.map(c => {
      if (c.id === caseId) {
        return {
          ...c,
          status: newStatus,
          officerResponse: reply || c.officerResponse,
          resolvedAt: newStatus === 'Resolved' ? new Date().toLocaleString([], { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : c.resolvedAt
        };
      }
      return c;
    }));

    if (selectedCase && selectedCase.id === caseId) {
      setSelectedCase(prev => prev ? { ...prev, status: newStatus, officerResponse: reply || prev.officerResponse } : null);
    }
  };

  const filteredCases = cases.filter(c => statusFilter === 'All' || c.status === statusFilter);

  return (
    <div className="officer-portal-container animate-fade-in">
      {/* Header Banner */}
      <div className="op-header glass-panel">
        <div className="oph-title-wrap">
          <div className="oph-icon-box">
            <UserCheck size={28} color="#1b5e20" />
          </div>
          <div>
            <h1>{language === 'mr' ? 'कृषी अधिकारी सल्ला व मदत केंद्र' : language === 'hi' ? 'कृषि अधिकारी परामर्श केंद्र' : 'Ask Agriculture Officer'}</h1>
            <p>
              {language === 'mr'
                ? 'जिल्हा कृषी अधिकारी आणि तज्ज्ञांकडून थेट पीक व सिंचन तक्रारींचे जलद निवारण'
                : language === 'hi'
                ? 'जिला कृषि अधिकारियों और विशेषज्ञों से सीधे फसल व सिंचाई समस्याओं का समाधान'
                : 'Direct consultation, emergency escalation, and official advisories from Taluka & District Agriculture Officers.'}
            </p>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="portal-view-toggle">
          <button 
            className={`pvt-btn ${activeTab === 'submit' ? 'active' : ''}`}
            onClick={() => setActiveTab('submit')}
          >
            📝 {language === 'mr' ? 'तक्रार दाखल करा (Farmer)' : 'Submit Issue'}
          </button>
          <button 
            className={`pvt-btn ${activeTab === 'officer_dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('officer_dashboard')}
          >
            🛡️ {language === 'mr' ? 'अधिकारी पोर्टल (Officer View)' : 'Officer Triage Portal'}
          </button>
        </div>
      </div>

      {submitSuccess && (
        <div className="op-success-banner animate-fade-in">
          <CheckCircle2 size={20} />
          <span>
            {language === 'mr'
              ? '✓ आपली तक्रार संबंधित तालुका कृषी अधिकाऱ्याकडे यशस्वीरीत्या नोंदवली गेली आहे! केस आयडी जारी केला आहे.'
              : '✓ Your consultation case has been successfully lodged with the Taluka Agriculture Officer. Case ID assigned.'}
          </span>
        </div>
      )}

      {/* TAB 1: FARMER SUBMISSION FORM */}
      {activeTab === 'submit' && (
        <div className="farmer-submit-grid">
          <div className="submit-form-card glass-panel">
            <div className="sfc-hdr">
              <h3>{language === 'mr' ? 'नवीन तक्रार / सल्ला मागणी फॉर्म' : 'Submit Consultation Request'}</h3>
              <span className="sfc-tag">Fast Resolution SLA: 24h</span>
            </div>

            <form onSubmit={handleSubmitCase} className="case-submit-form">
              <div className="form-row-2">
                <div className="op-input-group">
                  <label>Farmer Name / नाव</label>
                  <input type="text" value={farmerName} onChange={e => setFarmerName(e.target.value)} required />
                </div>
                <div className="op-input-group">
                  <label>District / जिल्हा</label>
                  <select value={district} onChange={e => setDistrict(e.target.value)}>
                    <option value="Nashik">Nashik District</option>
                    <option value="Pune">Pune District</option>
                  </select>
                </div>
              </div>

              <div className="form-row-2">
                <div className="op-input-group">
                  <label>Taluka / तालुका</label>
                  <input type="text" value={taluka} onChange={e => setTaluka(e.target.value)} placeholder="e.g. Kopargaon, Niphad, Baramati" required />
                </div>
                <div className="op-input-group">
                  <label>Affected Crop / पीक</label>
                  <select value={crop} onChange={e => setCrop(e.target.value)}>
                    <option value="Soybean">Soybean (सोयाबीन)</option>
                    <option value="Onion">Onion (कांदा)</option>
                    <option value="Tomato">Tomato (टोमॅटो)</option>
                    <option value="Sugarcane">Sugarcane (ऊस)</option>
                    <option value="Grapes">Grapes (द्राक्षे)</option>
                    <option value="Cotton">Cotton (कापूस)</option>
                    <option value="Pomegranate">Pomegranate (डाळिंब)</option>
                  </select>
                </div>
              </div>

              <div className="op-input-group">
                <label>Problem Summary / समस्येचा मुख्य विषय</label>
                <input 
                  type="text" 
                  value={problemTitle} 
                  onChange={e => setProblemTitle(e.target.value)} 
                  placeholder="e.g. Yellow leaves after heavy rain, Borewell salinity" 
                  required 
                />
              </div>

              <div className="op-input-group">
                <label>Detailed Description & Symptoms / सविस्तर लक्षणे</label>
                <textarea 
                  rows={4} 
                  value={description} 
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Describe soil moisture, leaf discoloration, water levels, recent fertilizers used..."
                  required
                />
              </div>

              <div className="form-row-2">
                <div className="op-input-group">
                  <label>Urgency Level / जोखीम प्राधान्य</label>
                  <select value={priority} onChange={e => setPriority(e.target.value as any)}>
                    <option value="Normal">Normal (Routine Farm Consultation)</option>
                    <option value="Medium">Medium (Moderate Pest/Moisture Issue)</option>
                    <option value="High">High (Severe Crop Loss / Borewell Failure)</option>
                  </select>
                </div>

                <div className="op-input-group">
                  <label>Attach Field Photo / फोटो अपलोड (Optional)</label>
                  <div className="file-upload-mock">
                    <Upload size={16} />
                    <span>Upload Leaf / Soil Image</span>
                  </div>
                </div>
              </div>

              <button type="submit" className="btn-submit-case">
                <Send size={18} />
                <span>{language === 'mr' ? 'कृषी अधिकाऱ्याकडे पाठवा' : 'Submit to Agriculture Officer'}</span>
              </button>
            </form>
          </div>

          {/* Right Info: Officer Helplines */}
          <div className="officer-info-card glass-panel">
            <div className="oic-hdr">
              <h4>Official KVK & Taluka Contacts</h4>
              <span className="badge-official">Govt. Certified</span>
            </div>

            <div className="officer-contact-list">
              <div className="contact-item">
                <div className="c-name">Dr. Sanjay Kulkarni (SMS Agronomy)</div>
                <div className="c-role">KVK Niphad / Kopargaon, Nashik</div>
                <div className="c-phone">📞 02550 - 241289 (Mon-Fri 10am-5pm)</div>
              </div>
              <div className="contact-item">
                <div className="c-name">Dr. Pravin Patil (Plant Protection)</div>
                <div className="c-role">KVK Baramati, Pune</div>
                <div className="c-phone">📞 02112 - 255227 (Mon-Fri 10am-5pm)</div>
              </div>
              <div className="contact-item">
                <div className="c-name">Kisan Call Center (Toll-Free)</div>
                <div className="c-role">National Agricultural Advisory Desk</div>
                <div className="c-phone">📞 1800-180-1551 (24x7 All India)</div>
              </div>
            </div>

            <div className="workflow-guarantee">
              <ShieldAlert size={18} color="#1b5e20" />
              <p>
                <strong>Official Guarantee:</strong> All urgent cases marked High Priority are escalated to the Taluka Agriculture Officer within 4 hours.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: OFFICER TRIAGE DASHBOARD */}
      {activeTab === 'officer_dashboard' && (
        <div className="officer-triage-layout">
          {/* Left Column: Filterable Case Queue */}
          <div className="cases-queue-col">
            <div className="queue-filter-bar">
              <div className="status-chips">
                <button 
                  className={`q-chip ${statusFilter === 'All' ? 'active' : ''}`}
                  onClick={() => setStatusFilter('All')}
                >
                  All ({cases.length})
                </button>
                <button 
                  className={`q-chip new ${statusFilter === 'New' ? 'active' : ''}`}
                  onClick={() => setStatusFilter('New')}
                >
                  🔴 New ({cases.filter(c => c.status === 'New').length})
                </button>
                <button 
                  className={`q-chip rev ${statusFilter === 'Reviewing' ? 'active' : ''}`}
                  onClick={() => setStatusFilter('Reviewing')}
                >
                  🟡 Reviewing ({cases.filter(c => c.status === 'Reviewing').length})
                </button>
                <button 
                  className={`q-chip res ${statusFilter === 'Resolved' ? 'active' : ''}`}
                  onClick={() => setStatusFilter('Resolved')}
                >
                  🟢 Resolved ({cases.filter(c => c.status === 'Resolved').length})
                </button>
              </div>
            </div>

            <div className="case-cards-list">
              {filteredCases.map(item => {
                const isSelected = selectedCase?.id === item.id;
                return (
                  <div 
                    key={item.id}
                    className={`case-triage-card glass-panel ${isSelected ? 'selected' : ''}`}
                    onClick={() => setSelectedCase(item)}
                  >
                    <div className="ctc-top">
                      <div>
                        <span className="ctc-id">{item.id}</span>
                        <span className="ctc-crop">{item.crop}</span>
                      </div>
                      <span className={`ctc-status ${item.status.toLowerCase()}`}>{item.status}</span>
                    </div>

                    <h4 className="ctc-title">{item.problemTitle}</h4>
                    
                    <div className="ctc-meta">
                      <span>👤 {item.farmerName} ({item.taluka})</span>
                      <span>⏱️ {item.createdAt}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Case Resolution Workspace */}
          <div className="case-workspace-col">
            {selectedCase ? (
              <div className="case-detail-workspace glass-panel">
                <div className="cdw-header">
                  <div>
                    <span className="cdw-id">{selectedCase.id} • {selectedCase.district} / {selectedCase.taluka}</span>
                    <h3>{selectedCase.problemTitle}</h3>
                  </div>
                  <span className={`priority-badge ${selectedCase.priority.toLowerCase()}`}>
                    {selectedCase.priority} Priority
                  </span>
                </div>

                <div className="cdw-farmer-info">
                  <div><strong>Farmer:</strong> {selectedCase.farmerName}</div>
                  <div><strong>Contact:</strong> {selectedCase.phone}</div>
                  <div><strong>Crop:</strong> {selectedCase.crop}</div>
                  <div><strong>Lodged:</strong> {selectedCase.createdAt}</div>
                </div>

                <div className="cdw-desc-box">
                  <h5>Farmer Problem Statement:</h5>
                  <p>{selectedCase.description}</p>
                  {selectedCase.photoUrl && (
                    <div className="cdw-photo-preview">
                      <img src={selectedCase.photoUrl} alt="Crop Problem" />
                    </div>
                  )}
                </div>

                {selectedCase.officerResponse && (
                  <div className="cdw-existing-response">
                    <h5>✓ Officer Advisory Note Issued:</h5>
                    <p>{selectedCase.officerResponse}</p>
                    {selectedCase.resolvedAt && <span className="res-time">Resolved at: {selectedCase.resolvedAt}</span>}
                  </div>
                )}

                {/* Officer Action Form */}
                <div className="cdw-action-form">
                  <h5>Issue Official Recommendation:</h5>
                  <textarea 
                    rows={3} 
                    placeholder="Enter scientific dosage, chemical / bio-pesticide spray instructions, or irrigation guidance..."
                    value={officerReplyText}
                    onChange={e => setOfficerReplyText(e.target.value)}
                  />
                  <div className="cdw-btn-row">
                    <button 
                      className="btn-mark-reviewing"
                      onClick={() => handleUpdateStatus(selectedCase.id, 'Reviewing', officerReplyText)}
                    >
                      Mark In Review
                    </button>
                    <button 
                      className="btn-mark-resolved"
                      onClick={() => {
                        handleUpdateStatus(selectedCase.id, 'Resolved', officerReplyText || selectedCase.officerResponse || 'Case resolved based on field guidelines.');
                        setOfficerReplyText('');
                      }}
                    >
                      ✓ Resolve & Send Advisory
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="empty-workspace glass-panel">
                <p>Select a consultation case from the triage queue.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
