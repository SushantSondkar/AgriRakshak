import { useState, useMemo } from 'react';
import { SCHEMES_DATA, getSchemeCategories, filterSchemes } from '../services/schemesData';
import type { GovernmentScheme } from '../types/scheme';
import {
  Landmark,
  Search,
  Filter,
  CheckCircle,
  FileText,
  ExternalLink,
  PhoneCall,
  X,
  Coins,
  Sun,
  ShieldCheck,
  Sprout,
  Tractor,
  Droplets,
  CreditCard,
  FlaskConical,
  Leaf,
  Building,
  Beef,
  Zap,
  Sparkles,
  HelpCircle,
  Calculator
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import './Schemes.css';

export const Schemes = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedGovtLevel, setSelectedGovtLevel] = useState('All');
  const [landSizeFilter, setLandSizeFilter] = useState('All');

  // Eligibility Checker Drawer / State
  const [showEligibilityChecker, setShowEligibilityChecker] = useState(false);
  const [farmerLandSize, setFarmerLandSize] = useState('Small & Marginal (< 2 Ha)');
  const [farmerCategory, setFarmerCategory] = useState('General');
  const [farmerCrop, setFarmerCrop] = useState('Onion');
  const [isEligibleFiltered, setIsEligibleFiltered] = useState(false);

  // Selected Scheme for Detail Modal
  const [activeScheme, setActiveScheme] = useState<GovernmentScheme | null>(null);

  const categories = getSchemeCategories();

  // Dynamic Icon Renderer
  const renderSchemeIcon = (iconName: string) => {
    switch (iconName) {
      case 'Coins':
        return <Coins size={22} color="#2e7d32" />;
      case 'Sun':
        return <Sun size={22} color="#f57f17" />;
      case 'ShieldCheck':
        return <ShieldCheck size={22} color="#1565c0" />;
      case 'Sprout':
        return <Sprout size={22} color="#2e7d32" />;
      case 'Landmark':
        return <Landmark size={22} color="#1b5e20" />;
      case 'Tractor':
        return <Tractor size={22} color="#d84315" />;
      case 'Droplets':
        return <Droplets size={22} color="#0288d1" />;
      case 'CreditCard':
        return <CreditCard size={22} color="#7b1fa2" />;
      case 'FlaskConical':
        return <FlaskConical size={22} color="#388e3c" />;
      case 'Leaf':
        return <Leaf size={22} color="#2e7d32" />;
      case 'Building':
        return <Building size={22} color="#455a64" />;
      case 'Beef':
        return <Beef size={22} color="#8d6e63" />;
      case 'Zap':
        return <Zap size={22} color="#f57f17" />;
      default:
        return <Sprout size={22} color="#2e7d32" />;
    }
  };

  const filteredSchemes = useMemo(() => {
    let result = filterSchemes(
      SCHEMES_DATA,
      searchQuery,
      selectedCategory,
      selectedGovtLevel,
      landSizeFilter
    );

    if (isEligibleFiltered) {
      result = result.filter((s) => {
        const matchesLand =
          s.land_holding_eligibility.includes('All Farmers') ||
          s.land_holding_eligibility.includes(farmerLandSize as any);
        const matchesCrop =
          s.crop_eligibility.includes('All Crops') ||
          s.crop_eligibility.includes(farmerCrop);
        return matchesLand && matchesCrop;
      });
    }

    return result;
  }, [
    searchQuery,
    selectedCategory,
    selectedGovtLevel,
    landSizeFilter,
    isEligibleFiltered,
    farmerLandSize,
    farmerCrop
  ]);

  const handleApplyEligibility = () => {
    setIsEligibleFiltered(true);
    setLandSizeFilter(farmerLandSize);
    setShowEligibilityChecker(false);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedGovtLevel('All');
    setLandSizeFilter('All');
    setIsEligibleFiltered(false);
  };

  return (
    <div className="schemes-page animate-fade-in">
      {/* Header Banner */}
      <header className="schemes-header-card glass-panel">
        <div className="header-left">
          <div className="schemes-icon-badge">
            <Landmark size={32} color="#1b5e20" />
          </div>
          <div>
            <h1>{t('schemes.title')}</h1>
            <p className="subtitle-mr">{t('schemes.subtitleMr')}</p>
            <p className="subtitle">
              {t('schemes.subtitle')}
            </p>
          </div>
        </div>

        <div className="header-right">
          <button
            className="eligibility-trigger-btn"
            onClick={() => setShowEligibilityChecker(true)}
          >
            <Calculator size={18} />
            <span>{t('schemes.btnCheckEligibility')}</span>
          </button>
        </div>
      </header>

      {/* Telemetry Stats Bar */}
      <div className="schemes-stats-bar">
        <div className="stat-pill">
          <span className="stat-num">13</span>
          <span className="stat-label">{t('schemes.statsActive')}</span>
        </div>
        <div className="stat-pill">
          <span className="stat-num">7</span>
          <span className="stat-label">{t('schemes.statsCentral')}</span>
        </div>
        <div className="stat-pill">
          <span className="stat-num">6</span>
          <span className="stat-label">{t('schemes.statsState')}</span>
        </div>
        <div className="stat-pill highlight">
          <span className="stat-num">Up to 90%</span>
          <span className="stat-label">{t('schemes.statsSubsidy')}</span>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="schemes-toolbar glass-panel">
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('schemes.searchPlaceholder')}
          />
          {searchQuery && (
            <button className="clear-search-btn" onClick={() => setSearchQuery('')}>
              <X size={16} />
            </button>
          )}
        </div>

        <div className="filter-group">
          {/* Government Level Filter */}
          <div className="govt-level-toggle">
            <button
              className={`toggle-chip ${selectedGovtLevel === 'All' ? 'active' : ''}`}
              onClick={() => setSelectedGovtLevel('All')}
            >
              {t('schemes.allLevels')}
            </button>
            <button
              className={`toggle-chip ${selectedGovtLevel === 'Central Government' ? 'active' : ''}`}
              onClick={() => setSelectedGovtLevel('Central Government')}
            >
              {t('schemes.centralGovt')}
            </button>
            <button
              className={`toggle-chip ${selectedGovtLevel === 'Maharashtra State Govt' ? 'active' : ''}`}
              onClick={() => setSelectedGovtLevel('Maharashtra State Govt')}
            >
              {t('schemes.stateGovt')}
            </button>
          </div>

          {/* Land Size Dropdown */}
          <div className="land-size-select-wrap">
            <Filter size={15} />
            <select
              value={landSizeFilter}
              onChange={(e) => setLandSizeFilter(e.target.value)}
              className="land-size-select"
            >
              <option value="All">{t('schemes.allLandSizes')}</option>
              <option value="Small & Marginal (< 2 Ha)">Small & Marginal (&lt; 2 Ha)</option>
              <option value="Medium (2-5 Ha)">Medium (2-5 Ha)</option>
              <option value="Large (> 5 Ha)">Large (&gt; 5 Ha)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Scroll Bar */}
      <div className="category-scroll-bar">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`category-chip ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Active Filter Banner */}
      {isEligibleFiltered && (
        <div className="eligible-filter-banner animate-fade-in">
          <div className="banner-text">
            <Sparkles size={18} />
            <span>
              Showing schemes matched for <strong>{farmerLandSize}</strong> land holding & <strong>{farmerCrop}</strong> crop.
            </span>
          </div>
          <button className="reset-banner-btn" onClick={resetFilters}>
            Clear Eligibility Filter
          </button>
        </div>
      )}

      {/* Schemes Grid */}
      <div className="schemes-grid">
        {filteredSchemes.length > 0 ? (
          filteredSchemes.map((scheme) => (
            <div key={scheme.id} className="scheme-card glass-panel animate-fade-in">
              <div className="card-top-row">
                <div className="scheme-icon-container">
                  {renderSchemeIcon(scheme.icon_name)}
                </div>
                <div className="badge-group">
                  <span className={`govt-badge ${scheme.government_level === 'Central Government' ? 'central' : 'state'}`}>
                    {scheme.government_level === 'Central Government' ? '🏛️ Central' : '🚩 Maharashtra'}
                  </span>
                  <span className="status-badge">{scheme.badge}</span>
                </div>
              </div>

              <div className="card-title-area">
                <h3 className="title-en">{scheme.title}</h3>
                <h4 className="title-mr">{scheme.title_mr}</h4>
              </div>

              <div className="subsidy-pill-banner">
                <span className="subsidy-label">Benefit:</span>
                <span className="subsidy-value">{scheme.subsidy_amount}</span>
              </div>

              <p className="scheme-summary">{scheme.summary}</p>

              <div className="eligibility-tags-row">
                {scheme.land_holding_eligibility.slice(0, 2).map((tag, idx) => (
                  <span key={idx} className="elig-tag">
                    {tag}
                  </span>
                ))}
                <span className="elig-tag category">{scheme.category}</span>
              </div>

              <div className="card-actions">
                <button
                  className="view-details-btn"
                  onClick={() => setActiveScheme(scheme)}
                >
                  <FileText size={16} />
                  <span>View Details & Apply</span>
                </button>
                <a
                  href={scheme.official_portal_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="portal-link-btn"
                  title="Official Government Portal"
                >
                  <ExternalLink size={16} />
                </a>
              </div>
            </div>
          ))
        ) : (
          <div className="no-schemes-box glass-panel">
            <HelpCircle size={48} color="var(--color-text-muted)" />
            <h3>No schemes matching your filters</h3>
            <p>Try clearing your search query or selecting "All Levels".</p>
            <button className="reset-btn" onClick={resetFilters}>
              Reset All Filters
            </button>
          </div>
        )}
      </div>

      {/* Scheme Detail Modal */}
      {activeScheme && (
        <div className="modal-overlay animate-fade-in" onClick={() => setActiveScheme(null)}>
          <div className="modal-content glass-panel" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setActiveScheme(null)}>
              <X size={20} />
            </button>

            <div className="modal-header">
              <div className="modal-icon-badge">
                {renderSchemeIcon(activeScheme.icon_name)}
              </div>
              <div>
                <div className="badge-row">
                  <span className="govt-badge-large">{activeScheme.government_level}</span>
                  <span className="category-badge-large">{activeScheme.category}</span>
                </div>
                <h2>{activeScheme.title}</h2>
                <h3 className="mr-sub">{activeScheme.title_mr}</h3>
              </div>
            </div>

            <div className="modal-body-scroll">
              <div className="benefit-highlight-box">
                <div className="b-title">💡 Scheme Financial Benefit / Subsidy</div>
                <div className="b-desc">{activeScheme.benefits}</div>
                <div className="b-subsidy-tag">Maximum Cap: {activeScheme.max_subsidy}</div>
              </div>

              <div className="detail-section">
                <h4>📜 Overview</h4>
                <p>{activeScheme.summary}</p>
              </div>

              <div className="detail-section">
                <h4>✅ Mandatory Documents Required (आवश्यक कागदपत्रे)</h4>
                <ul className="doc-list">
                  {activeScheme.required_documents.map((doc, i) => (
                    <li key={i}>
                      <CheckCircle size={16} className="check-icon" />
                      <span>{doc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="detail-section">
                <h4>📋 Step-by-Step How to Apply (अर्ज प्रक्रिया)</h4>
                <ol className="steps-list">
                  {activeScheme.application_steps.map((step, idx) => (
                    <li key={idx}>
                      <span className="step-num">{idx + 1}</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="modal-contact-row">
                <div className="helpline-box">
                  <PhoneCall size={18} />
                  <div>
                    <span className="h-label">Official Toll-Free Helpline:</span>
                    <span className="h-val">{activeScheme.helpline_number}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <a
                href={activeScheme.official_portal_url}
                target="_blank"
                rel="noopener noreferrer"
                className="apply-portal-btn"
              >
                <span>Apply on Official Portal ({activeScheme.official_portal_url.replace('https://', '')})</span>
                <ExternalLink size={18} />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Farmer Eligibility Checker Modal */}
      {showEligibilityChecker && (
        <div className="modal-overlay animate-fade-in" onClick={() => setShowEligibilityChecker(false)}>
          <div className="modal-content eligibility-modal glass-panel" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setShowEligibilityChecker(false)}>
              <X size={20} />
            </button>

            <div className="modal-header">
              <div className="modal-icon-badge">
                <Calculator size={28} color="#1b5e20" />
              </div>
              <div>
                <h2>Farmer Scheme Eligibility Calculator</h2>
                <p className="mr-sub">तुमच्या शेतीनुसार पात्र योजना शोधा</p>
              </div>
            </div>

            <div className="eligibility-form">
              <div className="form-group">
                <label>Land Holding Size (जमीन धारण क्षेत्र) *</label>
                <select
                  value={farmerLandSize}
                  onChange={(e) => setFarmerLandSize(e.target.value)}
                  className="elig-select"
                >
                  <option value="Small & Marginal (< 2 Ha)">Small & Marginal (&lt; 2 Ha / ५ एकरापेक्षा कमी)</option>
                  <option value="Medium (2-5 Ha)">Medium (2-5 Ha / ५ ते १२ एकर)</option>
                  <option value="Large (> 5 Ha)">Large (&gt; 5 Ha / १२ एकरापेक्षा जास्त)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Primary Crop Category (प्रमुख पीक) *</label>
                <select
                  value={farmerCrop}
                  onChange={(e) => setFarmerCrop(e.target.value)}
                  className="elig-select"
                >
                  <option value="Onion">Onion (कांदा)</option>
                  <option value="Sugarcane">Sugarcane (ऊस)</option>
                  <option value="Cotton">Cotton (कापूस)</option>
                  <option value="Soybean">Soybean (सोयाबीन)</option>
                  <option value="Horticulture">Horticulture / Fruits (फळबाग - डाळिंब/द्राक्षे)</option>
                  <option value="Livestock">Livestock / Dairy (शेळीपालन / दुग्धव्यवसाय)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Farmer Category (प्रवर्ग) *</label>
                <select
                  value={farmerCategory}
                  onChange={(e) => setFarmerCategory(e.target.value)}
                  className="elig-select"
                >
                  <option value="General">General (सर्वसाधारण)</option>
                  <option value="OBC">OBC (इतर मागासवर्ग)</option>
                  <option value="SC">SC (अनुसूचित जाती)</option>
                  <option value="ST">ST (अनुसूचित जमाती)</option>
                  <option value="Women Farmer">Women Farmer (महिला शेतकरी)</option>
                </select>
              </div>

              <button className="calculate-btn" onClick={handleApplyEligibility}>
                <Sparkles size={18} />
                <span>Find Eligible Schemes For Me</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
