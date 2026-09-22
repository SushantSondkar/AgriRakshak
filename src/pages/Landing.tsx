import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { LanguageSelector } from '../components/LanguageSelector';
import './Landing.css';

interface WaterStationData {
  rainMm: string;
  rainSub: string;
  soilMoisture: string;
  soilSub: string;
  gwLevel: string;
  gwBaseline: string;
  deficit: string;
  deficitColor: string;
  decisionTitle: string;
  decisionColor: string;
  reason: string;
  voice: string;
}

const WATER_STATIONS: Record<string, WaterStationData> = {
  kopargaon: {
    rainMm: '18.4 mm',
    rainSub: '72% probability in next 36 hours',
    soilMoisture: '38%',
    soilSub: 'Black Cotton Soil • Capacity 45%',
    gwLevel: '66,186',
    gwBaseline: '72,000',
    deficit: '-8.1% Under 5-Year Baseline',
    deficitColor: 'text-red-400',
    decisionTitle: 'Hold Irrigation / पाणी देणे टाळा',
    decisionColor: 'text-amber-400',
    reason: 'Natural rainfall (18.4mm) will replenish soil moisture within 36 hours. Over-irrigation will waterlog the root zone and deplete borewell reserve.',
    voice: 'आज पाणी देऊ नका. पुढील ३६ तासांत १८ मिमी पावसाची शक्यता आहे. भूजल साठा वाचवा.'
  },
  nashik: {
    rainMm: '0.0 mm',
    rainSub: 'No rain predicted in next 7 days',
    soilMoisture: '28%',
    soilSub: 'Red Sandy Loam • Below 35% threshold',
    gwLevel: '71,400',
    gwBaseline: '72,000',
    deficit: '-0.8% Stable Baseline',
    deficitColor: 'text-emerald-400',
    decisionTitle: 'Irrigate Now / लगेच पाणी द्या',
    decisionColor: 'text-blue-400',
    reason: 'Soil moisture is critically low at 28%. High evapotranspiration of 4.8mm/day requires immediate 3-hour drip irrigation cycle.',
    voice: 'लगेच पाणी द्या. मातीतील ओलावा २८ टक्क्यांवर आला आहे. ३ तास ठिबक सिंचन चालवा.'
  },
  sangamner: {
    rainMm: '2.5 mm',
    rainSub: 'Scattered light drizzle expected',
    soilMoisture: '32%',
    soilSub: 'Medium Black Soil',
    gwLevel: '58,200',
    gwBaseline: '70,500',
    deficit: '-17.4% Severe Aquifer Depletion',
    deficitColor: 'text-red-500',
    decisionTitle: 'Reduce Irrigation / पाणी कमी करा',
    decisionColor: 'text-purple-400',
    reason: 'Groundwater table is critically depleted (-17.4%). Switch from flood irrigation to pulse micro-drip to prevent borewell silt choking.',
    voice: 'पाणी वापर कमी करा. भूजल पातळी १७ टक्के खाली गेली आहे. मायक्रो ड्रिपचा वापर करा.'
  }
};
interface LandingProps {
  onContinueToApp?: () => void;
  onStartLiveTour?: () => void;
}

export const Landing = ({ onContinueToApp, onStartLiveTour }: LandingProps = {}) => {
  const { language } = useLanguage();

  const continueAppText = language === 'mr' ? 'थेट अ‍ॅप सुरू करा' : language === 'hi' ? 'ऐप में जाएं' : 'Continue to App';
  const liveTourText = language === 'mr' ? 'थेट अ‍ॅप फेरफटका' : language === 'hi' ? 'लाइव ऐप टूर' : 'Live App Tour';
  const startTourText = language === 'mr' ? 'थेट फेरफटका पहा' : language === 'hi' ? 'लाइव टूर देखें' : 'Start Live Tour';

  const handleContinueClick = (e: React.MouseEvent) => {
    if (onContinueToApp) {
      e.preventDefault();
      onContinueToApp();
    }
  };

  const handleTourClick = (e: React.MouseEvent) => {
    if (onStartLiveTour) {
      e.preventDefault();
      onStartLiveTour();
    }
  };

  // State
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [archTab, setArchTab] = useState<'pipeline' | 'diagram' | 'schema'>('pipeline');
  const [stationKey, setStationKey] = useState<string>('kopargaon');

  const currentStation = WATER_STATIONS[stationKey] || WATER_STATIONS.kopargaon;

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'mr-IN';
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Speech synthesis is not supported on this browser.');
    }
  };

  return (
    <div className="landing-page-root antialiased font-sans selection:bg-emerald-200 selection:text-emerald-900">
      
      {/* Sticky Navigation */}
      <nav className="sticky top-0 z-40 landing-glass-panel border-b border-stone-200/80 transition-all duration-300">
        <div className="container mx-auto px-6 py-3.5 flex justify-between items-center">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-800 to-primary-600 flex items-center justify-center text-white shadow-md shadow-emerald-800/25 group-hover:scale-105 transition-transform">
              <i className="fas fa-seedling text-lg"></i>
            </div>
            <div>
              <div className="text-xl font-extrabold tracking-tight text-stone-900 font-heading flex items-center gap-2">
                AgriRakshak
                <span className="text-[11px] font-marathi font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded border border-emerald-200">ॲग्रीरक्षक</span>
              </div>
              <p className="text-[11px] text-stone-500 font-medium -mt-0.5">Smart Agriculture Decision-Support Platform</p>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden lg:flex items-center gap-7 text-sm font-semibold text-stone-600">
            <a href="#problem" className="hover:text-emerald-700 transition flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> The Problem
            </a>
            <a href="#architecture" className="hover:text-emerald-700 transition flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> System Architecture
            </a>
            <a href="#modules" className="hover:text-emerald-700 transition flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Core Modules
            </a>
            <a href="#telemetry" className="hover:text-emerald-700 transition flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Water Intelligence
            </a>
            <a href="#stack" className="hover:text-emerald-700 transition flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Tech Stack
            </a>
          </div>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            <LanguageSelector />
            <Link 
              to="/dashboard?tour=true" 
              onClick={handleTourClick}
              className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg font-semibold text-xs transition flex items-center gap-2 border border-stone-300 shadow-sm"
              title="Start Interactive Live Tour inside the app"
            >
              <i className="fas fa-play text-emerald-700 text-xs"></i>
              <span>{liveTourText}</span>
            </Link>
            <Link 
              to="/dashboard?from=landing" 
              onClick={handleContinueClick}
              className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold text-xs transition shadow-sm shadow-emerald-700/30 flex items-center gap-2 hover:scale-102"
            >
              <span>{continueAppText}</span>
              <i className="fas fa-arrow-right text-[10px]"></i>
            </Link>
          </div>

          {/* Mobile Hamburger Toggle */}
          <button 
            onClick={() => setMobileNavOpen(prev => !prev)} 
            className="lg:hidden p-2 rounded-lg bg-stone-100 text-stone-700 hover:bg-stone-200 transition" 
            aria-label="Toggle navigation"
          >
            <i className="fas fa-bars text-lg"></i>
          </button>
        </div>

        {/* Mobile Drawer */}
        {mobileNavOpen && (
          <div className="lg:hidden px-6 pt-2 pb-6 bg-white/95 border-b border-stone-200 shadow-xl transition-all">
            <div className="flex flex-col gap-4 font-semibold text-stone-700 text-sm py-2">
              <a href="#problem" onClick={() => setMobileNavOpen(false)} className="hover:text-emerald-700">The Problem</a>
              <a href="#architecture" onClick={() => setMobileNavOpen(false)} className="hover:text-emerald-700">System Architecture</a>
              <a href="#modules" onClick={() => setMobileNavOpen(false)} className="hover:text-emerald-700">Core Modules</a>
              <a href="#telemetry" onClick={() => setMobileNavOpen(false)} className="hover:text-emerald-700">Water Intelligence</a>
              <a href="#stack" onClick={() => setMobileNavOpen(false)} className="hover:text-emerald-700">Tech Stack</a>
            </div>
            <div className="flex flex-col gap-2 pt-4 border-t border-stone-200">
              <div className="pb-2 flex justify-center">
                <LanguageSelector />
              </div>
              <Link 
                to="/dashboard?from=landing" 
                onClick={(e) => {
                  setMobileNavOpen(false);
                  handleContinueClick(e);
                }}
                className="w-full py-2.5 bg-emerald-700 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-2 shadow-sm"
              >
                <span>{continueAppText}</span>
                <i className="fas fa-arrow-right text-[10px]"></i>
              </Link>
              <Link 
                to="/dashboard?tour=true" 
                onClick={(e) => {
                  setMobileNavOpen(false);
                  handleTourClick(e);
                }} 
                className="w-full py-2.5 bg-stone-100 text-stone-800 rounded-lg font-semibold text-xs flex items-center justify-center gap-2 border border-stone-300"
              >
                <i className="fas fa-play text-emerald-700"></i> {liveTourText}
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <header className="relative pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[720px] h-[360px] bg-emerald-300/20 rounded-full blur-3xl pointer-events-none -z-10"></div>
        <div className="absolute top-1/3 right-10 w-[320px] h-[320px] bg-teal-200/20 rounded-full blur-3xl pointer-events-none -z-10"></div>

        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            {/* Location & Mission Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/90 border border-emerald-300 text-emerald-900 font-semibold text-xs mb-8 shadow-sm backdrop-blur-sm">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
              </span>
              <span>AI-Powered Decision-Support Platform</span>
              <span className="text-emerald-400">|</span>
              <span className="font-mono text-[11px] text-emerald-800">Calibrated for Maharashtra (Pune & Nashik)</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-stone-900 mb-6 font-heading tracking-tight leading-[1.1]">
              Data-Driven Agricultural Intelligence <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-emerald-800 via-primary-600 to-teal-600 bg-clip-text text-transparent">Built for Resilient Farming.</span>
            </h1>

            {/* Subheading */}
            <p className="text-lg sm:text-xl text-stone-600 mb-10 max-w-3xl mx-auto leading-relaxed font-normal">
              AgriRakshak fuses <strong>Central Ground Water Board (CGWB)</strong> 5-year hydrological baselines, <strong>IMD Doppler radar</strong> forecasts, on-device foliar computer vision, and multilingual voice assistance to help farmers irrigate smarter, prevent crop loss, and maximize harvest income.
            </p>

            {/* Primary Call-To-Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-16">
              <Link 
                to="/dashboard?from=landing" 
                onClick={handleContinueClick}
                className="w-full sm:w-auto px-9 py-4 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold rounded-xl shadow-xl shadow-emerald-800/30 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-3 text-base group"
              >
                <span>{continueAppText}</span>
                <i className="fas fa-arrow-right text-sm group-hover:translate-x-1.5 transition-transform"></i>
              </Link>
              <Link 
                to="/dashboard?tour=true" 
                onClick={handleTourClick}
                className="w-full sm:w-auto px-7 py-4 bg-white hover:bg-stone-50 text-stone-800 font-bold rounded-xl border border-stone-300 shadow-sm transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2.5 text-sm group"
              >
                <i className="fas fa-play-circle text-emerald-700 text-base group-hover:scale-110 transition-transform"></i>
                <span>{startTourText}</span>
                <span className="text-[10px] px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded">Live App</span>
              </Link>
            </div>

            {/* Live AgriRakshak Telemetry Dashboard Widget (Hero Preview) */}
            <div id="hero-telemetry" className="max-w-4xl mx-auto rounded-2xl landing-glass-panel p-4 md:p-6 shadow-2xl border border-emerald-600/15 landing-glow-emerald text-left">
              <div className="flex flex-wrap items-center justify-between pb-4 border-b border-stone-200/80 gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-3 w-3 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-600"></span>
                  </span>
                  <span className="font-bold text-xs uppercase tracking-wider text-stone-800 font-mono">AgriRakshak Telemetry Node</span>
                  <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200 font-semibold">Kopargaon Farm • Sushant Sondkar</span>
                </div>
                <a href="#telemetry" className="flex items-center gap-1 text-xs font-mono text-emerald-700 hover:text-emerald-800 font-semibold">
                  <span>Deep Dive Water Engine</span>
                  <i className="fas fa-chevron-down text-[10px]"></i>
                </a>
              </div>

              {/* Telemetry Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                {/* Sensor 1: Water Decision */}
                <div className="bg-white/90 rounded-xl p-4 border border-stone-200/80 shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-semibold text-stone-500">Water Decision</span>
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">HOLD</span>
                  </div>
                  <div className="text-xl font-black text-amber-800 font-heading">Hold Irrigation</div>
                  <p className="text-[11px] text-stone-600 mt-1 font-medium leading-tight">Rain expected in 36h (18.4mm). Conserve groundwater reserves.</p>
                </div>

                {/* Sensor 2: Groundwater Baseline */}
                <div className="bg-white/90 rounded-xl p-4 border border-stone-200/80 shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-semibold text-stone-500">CGWB 5-Yr Baseline</span>
                    <i className="fas fa-water text-blue-600"></i>
                  </div>
                  <div className="text-2xl font-black text-stone-900 font-heading">-8.1% <span className="text-xs font-sans font-medium text-stone-500">vs Benchmark</span></div>
                  <p className="text-[11px] text-red-700 mt-1 font-medium"><i className="fas fa-arrow-down mr-1"></i> Aquifer Depth: 66,186 L/ha</p>
                </div>

                {/* Sensor 3: Crop Doctor */}
                <div className="bg-white/90 rounded-xl p-4 border border-stone-200/80 shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-semibold text-stone-500">AI Crop Doctor</span>
                    <i className="fas fa-stethoscope text-emerald-600"></i>
                  </div>
                  <div className="text-2xl font-black text-stone-900 font-heading">98.4% <span className="text-xs font-sans font-medium text-stone-500">Confidence</span></div>
                  <p className="text-[11px] text-stone-600 mt-1 font-medium truncate" title="Tomato Early Blight (Alternaria solani)">Tomato Early Blight detected</p>
                </div>

                {/* Sensor 4: Regional Voice Synthesis */}
                <div className="bg-white/90 rounded-xl p-4 border border-stone-200/80 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-semibold text-stone-500">Multilingual Voice</span>
                      <i className="fas fa-volume-up text-amber-600"></i>
                    </div>
                    <div className="text-xs font-bold text-stone-800">Marathi / Hindi TTS</div>
                  </div>
                  <button 
                    onClick={() => speakText("नमस्कार! मी तुमचा ॲग्रीरक्षक सहाय्यक आहे. कोपरगाव परिसरात आज पाणी देऊ नका. पुढील ३६ तासांत पाऊस अपेक्षित आहे.")} 
                    className="w-full mt-2 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded font-semibold text-[11px] border border-emerald-300 transition flex items-center justify-center gap-1.5"
                  >
                    <i className="fas fa-play text-[9px]"></i> मराठी ऑडिओ ऐका
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* The Problem Section */}
      <section id="problem" className="bg-stone-900 text-white py-24 relative overflow-hidden scroll-mt-14">
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]"></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="inline-block px-3 py-1 rounded-full bg-emerald-900/60 text-emerald-300 font-mono font-semibold text-xs mb-3 border border-emerald-700/50">
              REAL-WORLD AGRARIAN CHALLENGE
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold mb-4 font-heading tracking-tight text-white">
              The Ground Reality We Are Solving
            </h2>
            <p className="text-stone-300 text-base sm:text-lg leading-relaxed">
              Farming in drought-prone and rain-shadow belts of Maharashtra faces three systemic blindspots that lead to crop failures and borewell debt traps.
            </p>
          </div>

          {/* Quantitative Impact Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16">
            <div className="p-6 rounded-2xl bg-stone-850 border border-stone-700 text-center">
              <div className="text-4xl sm:text-5xl font-extrabold text-blue-400 font-heading mb-2">54%</div>
              <p className="text-stone-200 text-sm font-semibold mb-1">Aquifer Depletion Rate</p>
              <p className="text-stone-400 text-xs leading-relaxed">Of CGWB observation wells in peninsular Deccan regions operate below the 5-year average baseline.</p>
            </div>

            <div className="p-6 rounded-2xl bg-stone-850 border border-stone-700 text-center">
              <div className="text-4xl sm:text-5xl font-extrabold text-emerald-400 font-heading mb-2">63%</div>
              <p className="text-stone-200 text-sm font-semibold mb-1">Unpredicted Yield Losses</p>
              <p className="text-stone-400 text-xs leading-relaxed">Caused by micro-climate variability that standard 25km weather apps fail to resolve at the 1km² farm level.</p>
            </div>

            <div className="p-6 rounded-2xl bg-stone-850 border border-stone-700 text-center">
              <div className="text-4xl sm:text-5xl font-extrabold text-amber-400 font-heading mb-2">₹50k+ Cr</div>
              <p className="text-stone-200 text-sm font-semibold mb-1">Annual Pathogen Damage</p>
              <p className="text-stone-400 text-xs leading-relaxed">Destroyed annually due to delayed crop disease diagnosis and ineffective chemical retail advice.</p>
            </div>
          </div>

          {/* Detailed Problem Breakdown Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="p-8 bg-stone-850 rounded-2xl border border-stone-700/80 text-left hover:border-blue-500/50 transition group">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center text-xl mb-6 border border-blue-500/20 group-hover:bg-blue-500/20 transition">
                <i className="fas fa-water"></i>
              </div>
              <h3 className="text-xl font-bold mb-3 text-white font-heading">Blind Borewell Drilling</h3>
              <p className="text-stone-300 text-sm leading-relaxed mb-4">
                Farmers lack access to Central Ground Water Board (CGWB) & GSDA Maharashtra hydrogeological models. Thousands of borewells dry up mid-season due to unmonitored over-extraction.
              </p>
              <div className="text-xs font-mono text-blue-400/90 pt-3 border-t border-stone-700/50 flex items-center gap-1.5">
                <i className="fas fa-arrow-right text-[10px]"></i> CGWB Aquifer Telemetry Gap
              </div>
            </div>

            <div className="p-8 bg-stone-850 rounded-2xl border border-stone-700/80 text-left hover:border-emerald-500/50 transition group">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-xl mb-6 border border-emerald-500/20 group-hover:bg-emerald-500/20 transition">
                <i className="fas fa-cloud-showers-heavy"></i>
              </div>
              <h3 className="text-xl font-bold mb-3 text-white font-heading">Hyper-Local Rain Disasters</h3>
              <p className="text-stone-300 text-sm leading-relaxed mb-4">
                Generic consumer weather forecasts cover 25km radii. Sudden convective cloudbursts or unseasonal hailstorms destroy standing cash crops (onions, grapes, tomatoes) without timely warning.
              </p>
              <div className="text-xs font-mono text-emerald-400/90 pt-3 border-t border-stone-700/50 flex items-center gap-1.5">
                <i className="fas fa-arrow-right text-[10px]"></i> IMD Radar Spatial Gap
              </div>
            </div>

            <div className="p-8 bg-stone-850 rounded-2xl border border-stone-700/80 text-left hover:border-amber-500/50 transition group">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center text-xl mb-6 border border-amber-500/20 group-hover:bg-amber-500/20 transition">
                <i className="fas fa-shield-virus"></i>
              </div>
              <h3 className="text-xl font-bold mb-3 text-white font-heading">Late Disease Intervention</h3>
              <p className="text-stone-300 text-sm leading-relaxed mb-4">
                By the time foliar fungus or bacterial blight is visible to the untrained eye, 40% of the yield is lost. Farmers spray expensive, toxic chemicals indiscriminately based on guesswork.
              </p>
              <div className="text-xs font-mono text-amber-400/90 pt-3 border-t border-stone-700/50 flex items-center gap-1.5">
                <i className="fas fa-arrow-right text-[10px]"></i> On-Device AI Vision Solution
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* System Architecture Section */}
      <section id="architecture" className="py-24 bg-stone-100 border-b border-stone-200 scroll-mt-14">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-mono font-semibold text-xs mb-3 border border-emerald-200">
              AGRIRAKSHAK SYSTEM ARCHITECTURE
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold mb-4 font-heading tracking-tight text-stone-900">
              How AgriRakshak Works
            </h2>
            <p className="text-stone-600 text-base sm:text-lg">
              A multi-tier decision engine uniting open government hydrological databases, live IMD radar feeds, on-device neural vision, and multilingual voice dispatches.
            </p>

            {/* Architecture Tab Navigation */}
            <div className="flex justify-center gap-2 mt-8 p-1.5 bg-stone-200/80 rounded-xl max-w-md mx-auto">
              <button 
                onClick={() => setArchTab('pipeline')} 
                className={`flex-1 py-2 px-4 rounded-lg font-bold text-xs transition ${archTab === 'pipeline' ? 'bg-white text-emerald-800 shadow-sm' : 'text-stone-600 hover:text-stone-900'}`}
              >
                End-to-End Pipeline
              </button>
              <button 
                onClick={() => setArchTab('diagram')} 
                className={`flex-1 py-2 px-4 rounded-lg font-bold text-xs transition ${archTab === 'diagram' ? 'bg-white text-emerald-800 shadow-sm' : 'text-stone-600 hover:text-stone-900'}`}
              >
                System Diagram
              </button>
              <button 
                onClick={() => setArchTab('schema')} 
                className={`flex-1 py-2 px-4 rounded-lg font-bold text-xs transition ${archTab === 'schema' ? 'bg-white text-emerald-800 shadow-sm' : 'text-stone-600 hover:text-stone-900'}`}
              >
                Telemetry Schema
              </button>
            </div>
          </div>

          {/* Tab 1: Pipeline Flow */}
          {archTab === 'pipeline' && (
            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
                <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm relative hover:shadow-md transition">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-mono font-bold text-sm mb-4 border border-emerald-200">
                    01
                  </div>
                  <h3 className="text-lg font-bold text-stone-900 mb-2 font-heading">Multi-Source Ingestion</h3>
                  <p className="text-stone-600 text-xs leading-relaxed mb-4">
                    Fetches 1km² precipitation grids from Open-Meteo & IMD radar, cross-referenced with CGWB 5-year water tables and GSDA Maharashtra datasets.
                  </p>
                  <span className="inline-flex items-center text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-stone-100 text-stone-700">
                    GeoJSON / REST APIs
                  </span>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm relative hover:shadow-md transition">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-mono font-bold text-sm mb-4 border border-emerald-200">
                    02
                  </div>
                  <h3 className="text-lg font-bold text-stone-900 mb-2 font-heading">Water Intelligence Engine</h3>
                  <p className="text-stone-600 text-xs leading-relaxed mb-4">
                    Applies FAO-56 Penman-Monteith Evapotranspiration (ET₀) to compute precise crop moisture deficit and recommend: IRRIGATE_NOW, HOLD, or REDUCE.
                  </p>
                  <span className="inline-flex items-center text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Hydrological Modeling
                  </span>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm relative hover:shadow-md transition">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-mono font-bold text-sm mb-4 border border-emerald-200">
                    03
                  </div>
                  <h3 className="text-lg font-bold text-stone-900 mb-2 font-heading">AI Crop Doctor Vision</h3>
                  <p className="text-stone-600 text-xs leading-relaxed mb-4">
                    Quantized MobileNet/ResNet model runs client-side in the browser. Classifies foliar diseases in under 120ms with verified CIBRC pesticide remedies.
                  </p>
                  <span className="inline-flex items-center text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                    On-Device Vision AI
                  </span>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm relative hover:shadow-md transition">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-mono font-bold text-sm mb-4 border border-emerald-200">
                    04
                  </div>
                  <h3 className="text-lg font-bold text-stone-900 mb-2 font-heading">Multilingual Voice & Sync</h3>
                  <p className="text-stone-600 text-xs leading-relaxed mb-4">
                    Dispatches localized voice advisories in Marathi, Hindi, and English via native Web Speech synthesis and stores records offline in IndexedDB.
                  </p>
                  <span className="inline-flex items-center text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                    Web Speech + PWA Cache
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: System Diagram */}
          {archTab === 'diagram' && (
            <div className="max-w-4xl mx-auto">
              <div className="bg-stone-900 p-8 rounded-2xl border border-stone-700 text-stone-200 font-mono text-xs shadow-xl">
                <div className="flex items-center justify-between pb-4 border-b border-stone-700 mb-6">
                  <span className="text-emerald-400 font-bold"><i className="fas fa-network-wired mr-2"></i> AgriRakshak Technical Architecture</span>
                  <span className="text-stone-400 text-[11px]">Vite + React 19 + Supabase + Open Data</span>
                </div>
                <div className="space-y-6">
                  <div className="p-4 rounded-xl bg-stone-850 border border-emerald-600/40">
                    <div className="text-emerald-400 font-bold mb-2">1. DATA TELEMETRY & OPEN APIs</div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-stone-300">
                      <div className="bg-stone-900 p-2.5 rounded border border-stone-700">💧 CGWB Ground Water Board Telemetry</div>
                      <div className="bg-stone-900 p-2.5 rounded border border-stone-700">🌦️ IMD Doppler Radar & Open-Meteo</div>
                      <div className="bg-stone-900 p-2.5 rounded border border-stone-700">🏛️ APMC Mandi Rates & Govt Schemes</div>
                    </div>
                  </div>

                  <div className="text-center text-emerald-400 text-lg"><i className="fas fa-arrow-down"></i></div>

                  <div className="p-4 rounded-xl bg-stone-850 border border-blue-500/40">
                    <div className="text-blue-400 font-bold mb-2">2. INTELLIGENCE & ADVISORY SERVICES</div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-stone-300">
                      <div className="bg-stone-900 p-2.5 rounded border border-stone-700">⚡ waterIntelligenceService.ts (FAO-56)</div>
                      <div className="bg-stone-900 p-2.5 rounded border border-stone-700">🩺 cropDoctorService.ts (Plant Pathology)</div>
                      <div className="bg-stone-900 p-2.5 rounded border border-stone-700">🗺️ alertService.ts (Taluka Risk Mapping)</div>
                    </div>
                  </div>

                  <div className="text-center text-blue-400 text-lg"><i className="fas fa-arrow-down"></i></div>

                  <div className="p-4 rounded-xl bg-stone-850 border border-amber-500/40">
                    <div className="text-amber-400 font-bold mb-2">3. FARMER CLIENT LAYER (OFFLINE PWA)</div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-stone-300">
                      <div className="bg-stone-900 p-2.5 rounded border border-stone-700">📱 React 19 Responsive Dashboard</div>
                      <div className="bg-stone-900 p-2.5 rounded border border-stone-700">🗣️ Multilingual VoiceAssistant (Web Speech)</div>
                      <div className="bg-stone-900 p-2.5 rounded border border-stone-700">💾 IndexedDB Offline PWA Cache</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Telemetry Schema */}
          {archTab === 'schema' && (
            <div className="max-w-4xl mx-auto">
              <div className="bg-stone-900 p-6 rounded-2xl border border-stone-700 text-stone-200 font-mono text-xs shadow-xl overflow-x-auto">
                <div className="flex justify-between items-center pb-3 border-b border-stone-700 mb-4">
                  <span className="text-emerald-400 font-bold">// AgriRakshak WaterIntelligenceData Payload (Real Codebase Schema)</span>
                  <span className="text-stone-400 text-[10px]">waterIntelligenceService.ts</span>
                </div>
                <pre className="text-emerald-300/90 leading-relaxed">{`{
  "decision": "HOLD_IRRIGATION",
  "decisionTitle": "Hold Irrigation / पाणी देणे टाळा",
  "district": "Ahmednagar (Kopargaon)",
  "soilType": "Black Soil (काळी माती)",
  "telemetry": {
    "rainfallForecastMm": 18.4,
    "rainfallExpectedProb": 72,
    "groundwaterLevel": 66186,
    "groundwaterBaseline5Yr": 72000,
    "baselineDifferencePercent": -8.1,
    "waterStress": "MEDIUM",
    "evapotranspirationMm": 4.12
  },
  "cropDoctor": {
    "crop": "Tomato",
    "detectedDisease": "Early Blight (करपा)",
    "pathogen": "Alternaria solani",
    "treatment": "Spray Copper Oxychloride 50 WP (2.5g/L water)",
    "organicAlternative": "Trichoderma viride bio-fungicide (5g/L)"
  },
  "voiceAdvisory": {
    "mr": "पुढील ३६ तासांत १८ मिमी पावसाची शक्यता आहे. पाणी देणे टाळा.",
    "hi": "अगले ३६ घंटों में १८ मिमी बारिश की संभावना है। सिंचाई रोकें।"
  }
}`}</pre>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Core Modules Section */}
      <section id="modules" className="py-24 bg-stone-50 scroll-mt-14">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-mono font-semibold text-xs mb-3 border border-emerald-200">
              PLATFORM CAPABILITIES
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold mb-4 font-heading tracking-tight text-stone-900">
              Comprehensive AgriRakshak Modules
            </h2>
            <p className="text-stone-600 text-base sm:text-lg">
              Every module is calibrated for Maharashtra agro-climatic zones with real government data feeds.
            </p>
          </div>

          {/* Modules Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Module 1: Water Intelligence */}
            <div id="water-intelligence-card" className="bg-white p-8 rounded-2xl shadow-sm border border-stone-200/90 hover:shadow-xl hover:border-emerald-500/40 transition duration-300 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center text-xl mb-6 border border-blue-200">
                  <i className="fas fa-water text-blue-700"></i>
                </div>
                <h3 className="text-xl font-bold text-stone-900 mb-2 font-heading">Water Intelligence Engine</h3>
                <p className="text-stone-600 text-sm leading-relaxed mb-4">
                  Calculates real-time irrigation advisories (Irrigate Now, Hold, or Reduce) by combining 7-day IMD rain probability, soil moisture, and CGWB 5-year aquifer recharge baselines.
                </p>
              </div>
              <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs font-mono text-blue-800">
                <span><i className="fas fa-tint mr-1"></i> FAO-56 Penman</span>
                <a href="#telemetry" className="font-bold text-blue-600 hover:underline">Inspect Engine ➔</a>
              </div>
            </div>

            {/* Module 2: Crop Doctor */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-200/90 hover:shadow-xl hover:border-emerald-500/40 transition duration-300 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-xl mb-6 border border-emerald-200">
                  <i className="fas fa-stethoscope text-emerald-700"></i>
                </div>
                <h3 className="text-xl font-bold text-stone-900 mb-2 font-heading">AI Crop Doctor</h3>
                <p className="text-stone-600 text-sm leading-relaxed mb-4">
                  Farmers snap a photo of diseased leaves to receive instant AI pathology identification and verified chemical & organic remedies (CIBRC approved guidelines).
                </p>
              </div>
              <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs font-mono text-emerald-800">
                <span><i className="fas fa-camera mr-1"></i> On-Device Vision</span>
                <span className="font-bold text-emerald-600">28+ Plant Diseases</span>
              </div>
            </div>

            {/* Module 3: Risk Map */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-200/90 hover:shadow-xl hover:border-amber-500/40 transition duration-300 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center text-xl mb-6 border border-amber-200">
                  <i className="fas fa-map-marked-alt text-amber-700"></i>
                </div>
                <h3 className="text-xl font-bold text-stone-900 mb-2 font-heading">Geospatial Risk Map</h3>
                <p className="text-stone-600 text-sm leading-relaxed mb-4">
                  Interactive district and taluka-level heatmaps visualizing drought stress, pest outbreak corridors, and unseasonal rainfall vulnerability across Pune & Nashik.
                </p>
              </div>
              <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs font-mono text-amber-800">
                <span><i className="fas fa-layer-group mr-1"></i> Taluka Heatmap</span>
                <span className="font-bold text-amber-600">Early Warning</span>
              </div>
            </div>

            {/* Module 4: Govt Schemes Matcher */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-200/90 hover:shadow-xl hover:border-purple-500/40 transition duration-300 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center text-xl mb-6 border border-purple-200">
                  <i className="fas fa-landmark text-purple-700"></i>
                </div>
                <h3 className="text-xl font-bold text-stone-900 mb-2 font-heading">Govt Schemes Matcher</h3>
                <p className="text-stone-600 text-sm leading-relaxed mb-4">
                  Automated eligibility matching connecting farm size and soil category to PM-KUSUM (solar pumps up to 90% subsidy), PMFBY, MahaDBT Drip Subsidies, and PoCRA.
                </p>
              </div>
              <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs font-mono text-purple-800">
                <span><i className="fas fa-award mr-1"></i> PM-KUSUM / PMFBY</span>
                <span className="font-bold text-purple-600">Direct Eligibility</span>
              </div>
            </div>

            {/* Module 5: Mandi APMC Prices */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-200/90 hover:shadow-xl hover:border-emerald-500/40 transition duration-300 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-xl mb-6 border border-emerald-200">
                  <i className="fas fa-chart-line text-emerald-700"></i>
                </div>
                <h3 className="text-xl font-bold text-stone-900 mb-2 font-heading">Live APMC Mandi Prices</h3>
                <p className="text-stone-600 text-sm leading-relaxed mb-4">
                  Daily commodity price tracking from Lasalgaon, Pune, and Kopargaon mandis with historical price trends and predictive sell vs. store guidance.
                </p>
              </div>
              <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs font-mono text-emerald-800">
                <span><i className="fas fa-rupee-sign mr-1"></i> APMC Live Telemetry</span>
                <span className="font-bold text-emerald-600">Mandi Price Index</span>
              </div>
            </div>

            {/* Module 6: Voice Assistant & Officer Portal */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-200/90 hover:shadow-xl hover:border-teal-500/40 transition duration-300 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center text-xl mb-6 border border-teal-200">
                  <i className="fas fa-headset text-teal-700"></i>
                </div>
                <h3 className="text-xl font-bold text-stone-900 mb-2 font-heading">Voice AI & Officer Portal</h3>
                <p className="text-stone-600 text-sm leading-relaxed mb-4">
                  Multilingual speech assistant speaking Marathi, Hindi, and English, coupled with an Agronomist portal for extension officers to review and verify field outbreaks.
                </p>
              </div>
              <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs font-mono text-teal-800">
                <span><i className="fas fa-users-cog mr-1"></i> Web Speech TTS</span>
                <span className="font-bold text-teal-600">Extension Support</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dedicated Water Intelligence Deep-Dive Section */}
      <section id="telemetry" className="py-24 bg-gradient-to-b from-stone-900 via-stone-850 to-stone-900 text-white relative overflow-hidden border-t border-stone-800 scroll-mt-16">
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-900/60 text-blue-300 font-mono font-semibold text-xs mb-3 border border-blue-700/50">
              <i className="fas fa-tint"></i>
              <span>HYDROLOGICAL TELEMETRY ENGINE</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold mb-4 font-heading tracking-tight text-white">
              AgriRakshak Water Intelligence
            </h2>
            <p className="text-stone-300 text-base sm:text-lg">
              Combining live IMD Doppler rain radar, evapotranspiration models, and Central Ground Water Board (CGWB) 5-year aquifer baselines to produce transparent irrigation decisions.
            </p>
          </div>

          {/* Interactive Water Intelligence Live Sandbox */}
          <div className="max-w-5xl mx-auto bg-stone-950/90 rounded-3xl border border-stone-700/80 p-6 md:p-10 shadow-2xl backdrop-blur-md">
            {/* Location Tabs */}
            <div className="flex flex-wrap items-center justify-between pb-6 border-b border-stone-800 gap-4">
              <div>
                <span className="text-xs font-mono uppercase text-stone-400">Select Taluka Observation Station:</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  <button 
                    onClick={() => setStationKey('kopargaon')} 
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition ${stationKey === 'kopargaon' ? 'bg-emerald-600 text-white shadow-md' : 'bg-stone-800 hover:bg-stone-700 text-stone-300'}`}
                  >
                    Kopargaon (Rain Forecast)
                  </button>
                  <button 
                    onClick={() => setStationKey('nashik')} 
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition ${stationKey === 'nashik' ? 'bg-emerald-600 text-white shadow-md' : 'bg-stone-800 hover:bg-stone-700 text-stone-300'}`}
                  >
                    Nashik (Soil Moisture Deficit)
                  </button>
                  <button 
                    onClick={() => setStationKey('sangamner')} 
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition ${stationKey === 'sangamner' ? 'bg-emerald-600 text-white shadow-md' : 'bg-stone-800 hover:bg-stone-700 text-stone-300'}`}
                  >
                    Sangamner (Critical Aquifer)
                  </button>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[11px] font-mono text-stone-400 block">FAO-56 Penman-Monteith Model</span>
                <span className="text-xs font-bold text-emerald-400 font-mono">Dynamic Irrigation Dispatch</span>
              </div>
            </div>

            {/* Main Telemetry Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              {/* Column 1: Hydrology Inputs */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 font-mono flex items-center gap-2">
                  <i className="fas fa-satellite text-blue-400"></i> Field Sensors & Radar
                </h4>
                
                <div className="p-4 rounded-xl bg-stone-900 border border-stone-800">
                  <div className="text-xs text-stone-400 mb-1">IMD Doppler Rainfall Radar</div>
                  <div className="text-2xl font-black text-blue-400 font-heading">{currentStation.rainMm}</div>
                  <div className="text-xs text-stone-500 mt-0.5">{currentStation.rainSub}</div>
                </div>

                <div className="p-4 rounded-xl bg-stone-900 border border-stone-800">
                  <div className="text-xs text-stone-400 mb-1">Soil Moisture Field Sensor</div>
                  <div className="text-2xl font-black text-amber-400 font-heading">{currentStation.soilMoisture}</div>
                  <div className="text-xs text-stone-500 mt-0.5">{currentStation.soilSub}</div>
                </div>
              </div>

              {/* Column 2: CGWB Groundwater Table */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 font-mono flex items-center gap-2">
                  <i className="fas fa-water text-teal-400"></i> CGWB 5-Year Aquifer Benchmarks
                </h4>

                <div className="p-4 rounded-xl bg-stone-900 border border-stone-800">
                  <div className="text-xs text-stone-400 mb-1">Observation Well Current Level</div>
                  <div className="text-2xl font-black text-teal-300 font-heading">
                    {currentStation.gwLevel} <span className="text-xs text-stone-400 font-normal">L/ha</span>
                  </div>
                  <div className="text-xs text-stone-500 mt-0.5">Govt Well Station #MH-CGWB-2026</div>
                </div>

                <div className="p-4 rounded-xl bg-stone-900 border border-stone-800">
                  <div className="text-xs text-stone-400 mb-1">Historical 5-Year Average</div>
                  <div className="text-2xl font-black text-stone-300 font-heading">
                    {currentStation.gwBaseline} <span className="text-xs text-stone-400 font-normal">L/ha</span>
                  </div>
                  <div className={`text-xs font-bold ${currentStation.deficitColor} mt-0.5`}>
                    <i className="fas fa-arrow-down mr-1"></i> {currentStation.deficit}
                  </div>
                </div>
              </div>

              {/* Column 3: Synthesized Decision & Advisory */}
              <div className="space-y-4 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 font-mono flex items-center gap-2">
                    <i className="fas fa-brain text-emerald-400"></i> Decision & Action
                  </h4>

                  <div className="p-5 rounded-2xl bg-stone-900/90 border border-emerald-500/40 mt-3 shadow-lg">
                    <div className="text-[11px] font-mono text-stone-400 uppercase">Recommendation:</div>
                    <div className={`text-xl font-black ${currentStation.decisionColor} font-heading mt-0.5`}>
                      {currentStation.decisionTitle}
                    </div>
                    <p className="text-xs text-stone-300 mt-2 leading-relaxed">
                      {currentStation.reason}
                    </p>
                  </div>
                </div>

                {/* Voice Playback button */}
                <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-700/50">
                  <div className="text-[11px] font-marathi text-emerald-300 font-bold mb-1">
                    <i className="fas fa-volume-up mr-1 text-emerald-400"></i> व्हॉईस सल्लागार (मराठी):
                  </div>
                  <div className="text-xs text-stone-300 font-marathi mb-3 italic">
                    "{currentStation.voice}"
                  </div>
                  <button 
                    onClick={() => speakText(currentStation.voice)} 
                    className="w-full py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg font-bold text-xs transition flex items-center justify-center gap-2"
                  >
                    <i className="fas fa-play text-[10px]"></i> ऐका (Listen Audio Advisory)
                  </button>
                </div>
              </div>
            </div>

            {/* Launch in Real App banner */}
            <div className="mt-8 pt-6 border-t border-stone-800 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-xs text-stone-400">
                Experience continuous telemetry streaming and customize your own farm acreage directly in the app.
              </div>
              <Link 
                to="/dashboard" 
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition shadow-md shadow-emerald-700/20 flex items-center gap-2 shrink-0"
              >
                <span>Launch App (Dashboard)</span>
                <i className="fas fa-arrow-right text-[10px]"></i>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Breakdown */}
      <section id="stack" className="py-20 bg-stone-900 text-white border-t border-stone-800 scroll-mt-14">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-14">
            <div className="inline-block px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 font-mono font-semibold text-xs mb-3 border border-emerald-800">
              PRODUCTION TECH STACK
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-3 font-heading tracking-tight">
              AgriRakshak Architecture Stack
            </h2>
            <p className="text-stone-400 text-sm sm:text-base">
              Engineered with deterministic latency, offline resilience, and zero proprietary software licensing.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
            <div className="p-5 rounded-xl bg-stone-850 border border-stone-800 text-center">
              <i className="fab fa-react text-3xl text-sky-400 mb-3"></i>
              <h3 className="font-bold text-sm text-stone-100">React 19 & TypeScript</h3>
              <p className="text-xs text-stone-400 mt-1">Reactive UI, Vite HMR, and Lucide icons</p>
            </div>

            <div className="p-5 rounded-xl bg-stone-850 border border-stone-800 text-center">
              <i className="fas fa-brain text-3xl text-emerald-400 mb-3"></i>
              <h3 className="font-bold text-sm text-stone-100">On-Device Vision AI</h3>
              <p className="text-xs text-stone-400 mt-1">Quantized leaf pathology in under 120ms</p>
            </div>

            <div className="p-5 rounded-xl bg-stone-850 border border-stone-800 text-center">
              <i className="fas fa-database text-3xl text-teal-400 mb-3"></i>
              <h3 className="font-bold text-sm text-stone-100">Supabase & PostgreSQL</h3>
              <p className="text-xs text-stone-400 mt-1">Field profiles, telemetry, and scheme rules</p>
            </div>

            <div className="p-5 rounded-xl bg-stone-850 border border-stone-800 text-center">
              <i className="fas fa-volume-up text-3xl text-amber-400 mb-3"></i>
              <h3 className="font-bold text-sm text-stone-100">Web Speech API</h3>
              <p className="text-xs text-stone-400 mt-1">Real-time Marathi / Hindi / English TTS</p>
            </div>
          </div>
        </div>
      </section>

      {/* Launch App Pre-Footer Banner */}
      <section className="py-16 bg-gradient-to-r from-emerald-900 via-primary-900 to-stone-900 text-white text-center border-t border-emerald-800/40">
        <div className="container mx-auto px-6 max-w-3xl">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 font-heading">
            Ready to Experience AgriRakshak?
          </h2>
          <p className="text-emerald-200 text-base mb-8 max-w-xl mx-auto leading-relaxed">
            Launch the complete AgriRakshak application directly to explore real-time irrigation advisories, AI crop doctor, and farm risk maps.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              to="/dashboard?from=landing" 
              onClick={handleContinueClick}
              className="inline-flex items-center gap-3 px-9 py-4 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-extrabold rounded-xl shadow-xl transition-all transform hover:-translate-y-0.5 text-base"
            >
              <span>{continueAppText}</span>
              <i className="fas fa-arrow-right"></i>
            </Link>
            <Link 
              to="/dashboard?tour=true" 
              onClick={handleTourClick}
              className="inline-flex items-center gap-2.5 px-7 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl border border-white/20 transition-all text-sm"
            >
              <i className="fas fa-play text-emerald-400"></i>
              <span>{startTourText}</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Hackathon Footer */}
      <footer className="bg-stone-950 text-stone-400 py-16 border-t border-stone-800">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 pb-12 border-b border-stone-800/80">
            {/* Brand Info */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-700 flex items-center justify-center text-white font-bold">
                <i className="fas fa-seedling"></i>
              </div>
              <div>
                <div className="text-xl font-bold text-white tracking-wider font-heading">AGRIRAKSHAK</div>
                <p className="text-xs text-stone-400">AI-Powered Agricultural Decision-Support Platform for Farmers in Maharashtra</p>
              </div>
            </div>

            {/* Credits */}
            <div className="text-center md:text-right">
              <div className="text-xs text-stone-300 font-medium">Developed by <span className="text-emerald-400 font-bold">Apex_Coder</span></div>
              <div className="text-[11px] text-stone-500 font-mono mt-0.5">Calibrated with CGWB Hydrology & Open-Meteo Radar</div>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-mono">
            <div>
              <span>Released under the <strong>MIT Open Source License</strong></span>
              <span className="mx-2">•</span>
              <span>100% Non-Commercial Research & Extension Platform</span>
            </div>
            <div className="flex items-center gap-6">
              <Link to="/dashboard?tour=true" onClick={handleTourClick} className="hover:text-white transition flex items-center gap-1.5">
                <i className="fas fa-play text-emerald-400"></i> {liveTourText}
              </Link>
              <Link to="/dashboard?from=landing" onClick={handleContinueClick} className="text-emerald-400 hover:text-emerald-300 font-bold transition flex items-center gap-1.5">
                <span>{continueAppText}</span>
                <i className="fas fa-arrow-right text-[10px]"></i>
              </Link>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};
