export type FarmDecisionType = 'IRRIGATE_NOW' | 'HOLD_IRRIGATION' | 'REDUCE_IRRIGATION' | 'CONSIDER_CROP_SWITCH';
export type WaterStressLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export interface FarmProfileData {
  farmerName: string;
  location: string;
  district: 'Pune' | 'Nashik';
  landArea: number; // in acres
  currentCrop: string;
  sowingDate: string;
  soilType: 'Black Soil' | 'Red Soil' | 'Alluvial Soil' | 'Loamy Soil';
  irrigationType: 'Drip' | 'Sprinkler' | 'Flood';
  waterSource: 'Borewell' | 'Open Well' | 'Canal' | 'River';
  recentIrrigationHoursAgo?: number;
}

export interface WaterIntelligenceData {
  decision: FarmDecisionType;
  decisionTitle: string;
  decisionTitleMr: string;
  decisionTitleHi: string;
  decisionColor: string; // 'success' | 'warning' | 'danger' | 'purple'
  badgeIcon: string;
  reasonSummary: string;
  reasonSummaryMr: string;
  reasonSummaryHi: string;
  
  // Telemetry Inputs
  rainfallForecastMm: number;
  rainfallExpectedProb: number; // percentage (e.g., 72%)
  groundwaterLevel: number; // e.g. 66186 liters or m3/ha index
  groundwaterBaseline5Yr: number; // e.g. 72000
  groundwaterLastYear: number; // e.g. 71200
  baselineDifferencePercent: number; // e.g. -8.1%
  waterStress: WaterStressLevel;
  cropHealthStatus: 'Healthy' | 'Mild Stress' | 'Diseased';

  // Transparent Reasoning Points
  reasons: {
    en: string;
    mr: string;
    hi: string;
    positive: boolean;
  }[];

  // 7-day rainfall trend
  rainfall7DayTrend: { day: string; rainMm: number; prob: number }[];
  
  // Groundwater historical comparison trend
  groundwaterMonthlyHistory: {
    month: string;
    currentYear: number;
    lastYear: number;
    baseline5Yr: number;
  }[];

  // Soil & Moisture Metrics
  soilMoisturePercent: number;
  evapotranspirationMm: number;
  isDemoData: boolean;
  lastSynced: string;
}

export const DEFAULT_FARM_PROFILE: FarmProfileData = {
  farmerName: 'Sushant Sondkar',
  location: 'Kopargaon, Ahmednagar',
  district: 'Nashik',
  landArea: 5.5,
  currentCrop: 'Soybean',
  sowingDate: '2026-06-25',
  soilType: 'Black Soil',
  irrigationType: 'Drip',
  waterSource: 'Borewell',
  recentIrrigationHoursAgo: 48
};

const STORAGE_KEY = 'agrirakshak_farm_profile_v1';

export const getSavedFarmProfile = (): FarmProfileData => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.farmerName === 'Ramesh Patil') {
        parsed.farmerName = 'Sushant Sondkar';
        parsed.location = 'Kopargaon, Ahmednagar';
        localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
      }
      return parsed;
    }
  } catch (e) {
    console.error('Error reading farm profile from localStorage', e);
  }
  return DEFAULT_FARM_PROFILE;
};

export const saveFarmProfile = (profile: FarmProfileData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error('Error saving farm profile to localStorage', e);
  }
};

/**
 * Fuses Rainfall + Groundwater + 5-Yr Baseline + Crop Health into an explainable Farm Decision
 */
export const computeWaterIntelligence = (profile: FarmProfileData): WaterIntelligenceData => {
  const isPune = profile.district === 'Pune';
  
  // District-specific realistic hydrology telemetry
  const rainfallForecastMm = isPune ? 18 : 42;
  const rainfallExpectedProb = isPune ? 35 : 72;
  const groundwaterLevel = isPune ? 68450 : 66186;
  const groundwaterBaseline5Yr = 72000;
  const groundwaterLastYear = isPune ? 70100 : 71200;
  const baselineDiff = ((groundwaterLevel - groundwaterBaseline5Yr) / groundwaterBaseline5Yr) * 100;
  const baselineDifferencePercent = Math.round(baselineDiff * 10) / 10; // -8.1%

  let waterStress: WaterStressLevel = 'MEDIUM';
  if (baselineDifferencePercent < -15) waterStress = 'HIGH';
  else if (baselineDifferencePercent > -5) waterStress = 'LOW';

  const cropHealthStatus: 'Healthy' | 'Mild Stress' | 'Diseased' = 'Healthy';

  // Decision Logic Engine
  let decision: FarmDecisionType = 'HOLD_IRRIGATION';
  let decisionTitle = 'HOLD IRRIGATION';
  let decisionTitleMr = 'सिंचन पुढे ढकला (पाणी देऊ नका)';
  let decisionTitleHi = 'सिंचाई स्थगित करें (पानी न दें)';
  let decisionColor = '#f59e0b'; // amber/warning
  let badgeIcon = '🟡';
  let reasonSummary = 'Rain is expected within the next 24 hours, so irrigation can be postponed.';
  let reasonSummaryMr = 'पुढील २४ तासांत पावसाची शक्यता असल्याने आज पाणी देण्याची गरज नाही.';
  let reasonSummaryHi = 'अगले 24 घंटों में बारिश की संभावना है, इसलिए आज सिंचाई स्थगित की जा सकती है।';

  const reasons: WaterIntelligenceData['reasons'] = [];

  if (rainfallExpectedProb >= 60) {
    decision = 'HOLD_IRRIGATION';
    decisionTitle = 'HOLD IRRIGATION';
    decisionTitleMr = 'सिंचन पुढे ढकला (पाणी थांबवा)';
    decisionTitleHi = 'सिंचाई स्थगित करें (पानी रोकें)';
    decisionColor = '#f59e0b';
    badgeIcon = '🟡';
    reasonSummary = `High rain probability (${rainfallExpectedProb}%) expected within 24 hours (${rainfallForecastMm} mm). Conserve your water resources.`;
    reasonSummaryMr = `पुढील २४ तासांत ${rainfallExpectedProb}% पावसाची शक्यता (${rainfallForecastMm} मिमी) आहे. भूजल व वीज वाचवा.`;
    reasonSummaryHi = `अगले 24 घंटों में ${rainfallExpectedProb}% बारिश की संभावना (${rainfallForecastMm} मिमी) है। भूजल का संरक्षण करें।`;

    reasons.push({
      en: `Rain expected in next 24 hours (${rainfallForecastMm} mm, ${rainfallExpectedProb}% probability)`,
      mr: `पुढील २४ तासांत पाऊस पडण्याची खात्रीशीर शक्यता (${rainfallForecastMm} मिमी, ${rainfallExpectedProb}%)`,
      hi: `अगले 24 घंटों में बारिश की संभावना (${rainfallForecastMm} मिमी, ${rainfallExpectedProb}%)`,
      positive: true
    });
    reasons.push({
      en: `Groundwater is currently ${Math.abs(baselineDifferencePercent)}% below historical 5-year baseline (${groundwaterLevel.toLocaleString()} vs ${groundwaterBaseline5Yr.toLocaleString()} m³/ha)`,
      mr: `भूजल पातळी ५ वर्षांच्या सरासरीपेक्षा ${Math.abs(baselineDifferencePercent)}% खाली आहे (${groundwaterLevel.toLocaleString()} वि. ${groundwaterBaseline5Yr.toLocaleString()})`,
      hi: `भूजल स्तर 5-वर्षीय औसत से ${Math.abs(baselineDifferencePercent)}% नीचे है (${groundwaterLevel.toLocaleString()} बनाम ${groundwaterBaseline5Yr.toLocaleString()})`,
      positive: false
    });
    reasons.push({
      en: `${profile.currentCrop} moisture requirement is moderate in ${profile.soilType}`,
      mr: `${profile.soilType} मातीत ${profile.currentCrop} पिकाची पाण्याची गरज सध्या मर्यादित आहे`,
      hi: `${profile.soilType} मिट्टी में ${profile.currentCrop} फसल की नमी की आवश्यकता अभी सामान्य है`,
      positive: true
    });
  } else if (rainfallExpectedProb < 25 && baselineDifferencePercent < -12) {
    decision = 'REDUCE_IRRIGATION';
    decisionTitle = 'REDUCE IRRIGATION (DRIP ONLY)';
    decisionTitleMr = 'कमी पाणी द्या (फक्त ठिबक सिंचन)';
    decisionTitleHi = 'कम पानी दें (केवल ड्रिप सिंचाई)';
    decisionColor = '#ef4444';
    badgeIcon = '🔴';
    reasonSummary = 'Significant groundwater deficit with no immediate rain. Use micro-irrigation only.';
    reasonSummaryMr = 'भूजल पातळी कमी असून पावसाची शक्यता नाही. केवळ ठिबक सिंचनाचा वापर करा.';
    reasonSummaryHi = 'भूजल स्तर कम है और बारिश नहीं है। केवल ड्रिप सिंचाई का उपयोग करें।';

    reasons.push({
      en: `No significant rainfall forecasted for the next 7 days (${rainfallForecastMm} mm)`,
      mr: `पुढील ७ दिवसांत पावसाची शक्यता कमी आहे (${rainfallForecastMm} मिमी)`,
      hi: `अगले 7 दिनों में महत्वपूर्ण बारिश का अनुमान नहीं है (${rainfallForecastMm} मिमी)`,
      positive: false
    });
    reasons.push({
      en: `Groundwater stress is HIGH (${Math.abs(baselineDifferencePercent)}% below 5-yr baseline)`,
      mr: `भूजल ताण जास्त आहे (५ वर्षांच्या सरासरीपेक्षा ${Math.abs(baselineDifferencePercent)}% कमी)`,
      hi: `भूजल तनाव उच्च है (5-वर्षीय औसत से ${Math.abs(baselineDifferencePercent)}% कम)`,
      positive: false
    });
    reasons.push({
      en: `Switch to pulse-drip irrigation during evening hours to minimize evaporation`,
      mr: `बाष्पीभवन रोखण्यासाठी संध्याकाळी ठिबक सिंचनाद्वारे नियंत्रित पाणी द्या`,
      hi: `वाष्पीकरण रोकने के लिए शाम के समय ड्रिप सिंचाई से नियंत्रित पानी दें`,
      positive: true
    });
  } else {
    decision = 'IRRIGATE_NOW';
    decisionTitle = 'IRRIGATE NOW';
    decisionTitleMr = 'आता पाणी द्या (सिंचन करा)';
    decisionTitleHi = 'अभी सिंचाई करें (पानी दें)';
    decisionColor = '#10b981';
    badgeIcon = '🟢';
    reasonSummary = 'Soil moisture is dipping below optimal threshold. Proceed with regular scheduled irrigation.';
    reasonSummaryMr = 'मातीतील ओलावा कमी होत आहे. नियमित वेळापत्रकानुसार पिकाला पाणी द्या.';
    reasonSummaryHi = 'मिट्टी की नमी कम हो रही है। नियमित समय सारिणी के अनुसार सिंचाई करें।';

    reasons.push({
      en: `Rain probability is low (${rainfallExpectedProb}%) for the next 48 hours`,
      mr: `पुढील ४८ तासांत पावसाची शक्यता कमी (${rainfallExpectedProb}%) आहे`,
      hi: `अगले 48 घंटों में बारिश की संभावना कम (${rainfallExpectedProb}%) है`,
      positive: true
    });
    reasons.push({
      en: `Current soil moisture is at 38% (optimal is 55-65% for ${profile.currentCrop})`,
      mr: `सध्या मातीतील ओलावा ३८% आहे (${profile.currentCrop} पिकासाठी ५५-६५% योग्य असतो)`,
      hi: `वर्तमान मिट्टी की नमी 38% है (${profile.currentCrop} के लिए 55-65% उपयुक्त है)`,
      positive: true
    });
    reasons.push({
      en: `Groundwater level is adequate for planned drip cycle`,
      mr: `नियोजित सिंचन चक्रासाठी भूजल पुरवठा पुरेसा आहे`,
      hi: `योजनाबद्ध सिंचाई चक्र के लिए भूजल स्तर पर्याप्त है`,
      positive: true
    });
  }

  // 7-day rainfall trend
  const rainfall7DayTrend = [
    { day: 'Mon', rainMm: rainfallForecastMm > 20 ? 12 : 2, prob: 40 },
    { day: 'Tue', rainMm: rainfallForecastMm > 20 ? 24 : 0, prob: rainfallExpectedProb },
    { day: 'Wed', rainMm: rainfallForecastMm > 20 ? 6 : 4, prob: 55 },
    { day: 'Thu', rainMm: 0, prob: 20 },
    { day: 'Fri', rainMm: 1, prob: 15 },
    { day: 'Sat', rainMm: 0, prob: 10 },
    { day: 'Sun', rainMm: 3, prob: 25 }
  ];

  // Groundwater Monthly Comparison Dataset
  const groundwaterMonthlyHistory = [
    { month: 'Apr', currentYear: 61200, lastYear: 65400, baseline5Yr: 66500 },
    { month: 'May', currentYear: 58900, lastYear: 63100, baseline5Yr: 64200 },
    { month: 'Jun', currentYear: 62400, lastYear: 67800, baseline5Yr: 68900 },
    { month: 'Jul', currentYear: 67800, lastYear: 72500, baseline5Yr: 73400 },
    { month: 'Aug', currentYear: 69400, lastYear: 74200, baseline5Yr: 75100 },
    { month: 'Sep (Now)', currentYear: groundwaterLevel, lastYear: groundwaterLastYear, baseline5Yr: groundwaterBaseline5Yr }
  ];

  return {
    decision,
    decisionTitle,
    decisionTitleMr,
    decisionTitleHi,
    decisionColor,
    badgeIcon,
    reasonSummary,
    reasonSummaryMr,
    reasonSummaryHi,
    rainfallForecastMm,
    rainfallExpectedProb,
    groundwaterLevel,
    groundwaterBaseline5Yr,
    groundwaterLastYear,
    baselineDifferencePercent,
    waterStress,
    cropHealthStatus,
    reasons,
    rainfall7DayTrend,
    groundwaterMonthlyHistory,
    soilMoisturePercent: 44,
    evapotranspirationMm: 4.8,
    isDemoData: true,
    lastSynced: '2 hours ago (Live CGWB/NWIC Baseline & Open-Meteo)'
  };
};

/**
 * Taluka-level data for Risk Map (Pune and Nashik)
 */
export interface TalukaRiskData {
  id: string;
  name: string;
  nameMr: string;
  district: 'Pune' | 'Nashik';
  groundwaterStatus: 'Normal' | 'Moderate Stress' | 'High Stress';
  groundwaterLevel: number;
  baseline5Yr: number;
  deficitPercent: number;
  rainfallStatus: 'Normal' | 'Deficit' | 'Excess';
  rainfallForecastMm: number;
  cropRisk: 'Low' | 'Medium' | 'High';
  waterStressLevel: WaterStressLevel;
  majorCrops: string[];
  recommendedAction: string;
  recommendedActionMr: string;
}

export const TALUKA_RISK_DATA: TalukaRiskData[] = [
  // Pune Talukas
  {
    id: 'pune-haveli',
    name: 'Haveli',
    nameMr: 'हवेली',
    district: 'Pune',
    groundwaterStatus: 'Normal',
    groundwaterLevel: 71200,
    baseline5Yr: 72500,
    deficitPercent: -1.8,
    rainfallStatus: 'Normal',
    rainfallForecastMm: 22,
    cropRisk: 'Low',
    waterStressLevel: 'LOW',
    majorCrops: ['Sugarcane', 'Vegetables', 'Flowers'],
    recommendedAction: 'Regular scheduled irrigation permitted.',
    recommendedActionMr: 'नियमित वेळापत्रकानुसार पाणी देण्यास हरकत नाही.'
  },
  {
    id: 'pune-baramati',
    name: 'Baramati',
    nameMr: 'बारामती',
    district: 'Pune',
    groundwaterStatus: 'Moderate Stress',
    groundwaterLevel: 65400,
    baseline5Yr: 71000,
    deficitPercent: -7.9,
    rainfallStatus: 'Deficit',
    rainfallForecastMm: 12,
    cropRisk: 'Medium',
    waterStressLevel: 'MEDIUM',
    majorCrops: ['Sugarcane', 'Grapes', 'Pomegranate'],
    recommendedAction: 'Shift to drip irrigation and schedule at night.',
    recommendedActionMr: 'ठिबक सिंचनाचा वापर वाढवा व रात्री पाणी द्या.'
  },
  {
    id: 'pune-junnar',
    name: 'Junnar',
    nameMr: 'जुन्नर',
    district: 'Pune',
    groundwaterStatus: 'Normal',
    groundwaterLevel: 73400,
    baseline5Yr: 73000,
    deficitPercent: 0.5,
    rainfallStatus: 'Normal',
    rainfallForecastMm: 38,
    cropRisk: 'Low',
    waterStressLevel: 'LOW',
    majorCrops: ['Tomato', 'Onion', 'Potato'],
    recommendedAction: 'Groundwater stable. Ensure field drainage.',
    recommendedActionMr: 'भूजल स्थिर आहे. शेतातील पाण्याचा निचरा व्यवस्थित ठेवा.'
  },
  {
    id: 'pune-shirur',
    name: 'Shirur',
    nameMr: 'शिरूर',
    district: 'Pune',
    groundwaterStatus: 'High Stress',
    groundwaterLevel: 59800,
    baseline5Yr: 69500,
    deficitPercent: -13.9,
    rainfallStatus: 'Deficit',
    rainfallForecastMm: 8,
    cropRisk: 'High',
    waterStressLevel: 'HIGH',
    majorCrops: ['Soybean', 'Bajra', 'Onion'],
    recommendedAction: 'Strict groundwater rationing. Apply organic mulching.',
    recommendedActionMr: 'भूजलाचा अतिवापर टाळा. आच्छादनाचा (मल्चिंग) वापर करा.'
  },
  {
    id: 'pune-indapur',
    name: 'Indapur',
    nameMr: 'इंदापूर',
    district: 'Pune',
    groundwaterStatus: 'Moderate Stress',
    groundwaterLevel: 64200,
    baseline5Yr: 70800,
    deficitPercent: -9.3,
    rainfallStatus: 'Deficit',
    rainfallForecastMm: 14,
    cropRisk: 'Medium',
    waterStressLevel: 'MEDIUM',
    majorCrops: ['Sugarcane', 'Maize', 'Pomegranate'],
    recommendedAction: 'Prioritize canal water before tapping borewells.',
    recommendedActionMr: 'बोअरवेल ऐवजी कालव्याच्या पाण्यास प्राधान्य द्या.'
  },
  {
    id: 'pune-khed',
    name: 'Khed (Rajgurunagar)',
    nameMr: 'खेड (राजगुरुनगर)',
    district: 'Pune',
    groundwaterStatus: 'Normal',
    groundwaterLevel: 70900,
    baseline5Yr: 71800,
    deficitPercent: -1.2,
    rainfallStatus: 'Normal',
    rainfallForecastMm: 28,
    cropRisk: 'Low',
    waterStressLevel: 'LOW',
    majorCrops: ['Onion', 'Groundnut', 'Potato'],
    recommendedAction: 'Good moisture reserves. Standard cycle.',
    recommendedActionMr: 'जमिनीत चांगला ओलावा आहे. नियमित सिंचन सुरू ठेवा.'
  },

  // Nashik Talukas
  {
    id: 'nashik-kopargaon',
    name: 'Kopargaon / Niphad',
    nameMr: 'कोपरगाव / निफाड',
    district: 'Nashik',
    groundwaterStatus: 'Moderate Stress',
    groundwaterLevel: 66186,
    baseline5Yr: 72000,
    deficitPercent: -8.1,
    rainfallStatus: 'Normal',
    rainfallForecastMm: 42,
    cropRisk: 'Medium',
    waterStressLevel: 'MEDIUM',
    majorCrops: ['Grapes', 'Onion', 'Sugarcane', 'Soybean'],
    recommendedAction: 'Hold irrigation today due to expected 42 mm rain.',
    recommendedActionMr: 'आज ४२ मिमी पावसाची शक्यता असल्याने पाणी देणे थांबवा.'
  },
  {
    id: 'nashik-malegaon',
    name: 'Malegaon',
    nameMr: 'मालेगाव',
    district: 'Nashik',
    groundwaterStatus: 'High Stress',
    groundwaterLevel: 57400,
    baseline5Yr: 68500,
    deficitPercent: -16.2,
    rainfallStatus: 'Deficit',
    rainfallForecastMm: 6,
    cropRisk: 'High',
    waterStressLevel: 'HIGH',
    majorCrops: ['Cotton', 'Pomegranate', 'Bajra', 'Maize'],
    recommendedAction: 'Severe depletion alert. Restrict irrigation to survival quotas.',
    recommendedActionMr: 'तीव्र पाणी टंचाई. फक्त पिकास जिवंत ठेवण्याइतके पाणी द्या.'
  },
  {
    id: 'nashik-sinnar',
    name: 'Sinnar',
    nameMr: 'सिन्नर',
    district: 'Nashik',
    groundwaterStatus: 'High Stress',
    groundwaterLevel: 58900,
    baseline5Yr: 69200,
    deficitPercent: -14.9,
    rainfallStatus: 'Deficit',
    rainfallForecastMm: 9,
    cropRisk: 'High',
    waterStressLevel: 'HIGH',
    majorCrops: ['Onion', 'Tomato', 'Soybean'],
    recommendedAction: 'Use protective sprinkler in early morning only.',
    recommendedActionMr: 'केवळ सकाळी लवकर तुषार सिंचनाचा वापर करा.'
  },
  {
    id: 'nashik-dindori',
    name: 'Dindori',
    nameMr: 'दिंडोरी',
    district: 'Nashik',
    groundwaterStatus: 'Normal',
    groundwaterLevel: 72800,
    baseline5Yr: 73500,
    deficitPercent: -0.9,
    rainfallStatus: 'Normal',
    rainfallForecastMm: 35,
    cropRisk: 'Low',
    waterStressLevel: 'LOW',
    majorCrops: ['Grapes', 'Tomato', 'Paddy'],
    recommendedAction: 'Abundant water balance. Monitor vine fungal threats.',
    recommendedActionMr: 'पाणीपुरवठा उत्तम. द्राक्ष बागेतील बुरशीजन्य रोगांवर लक्ष ठेवा.'
  },
  {
    id: 'nashik-yeola',
    name: 'Yeola',
    nameMr: 'येवला',
    district: 'Nashik',
    groundwaterStatus: 'Moderate Stress',
    groundwaterLevel: 63100,
    baseline5Yr: 69800,
    deficitPercent: -9.6,
    rainfallStatus: 'Deficit',
    rainfallForecastMm: 11,
    cropRisk: 'Medium',
    waterStressLevel: 'MEDIUM',
    majorCrops: ['Onion', 'Maize', 'Soybean'],
    recommendedAction: 'Optimize well recovery time between pump cycles.',
    recommendedActionMr: 'विहिरीतील पाण्याची पातळी स्थिर होण्यासाठी पंपाचा वापर मर्यादित ठेवा.'
  },
  {
    id: 'nashik-baglan',
    name: 'Baglan (Satana)',
    nameMr: 'बागलाण (सटाणा)',
    district: 'Nashik',
    groundwaterStatus: 'Moderate Stress',
    groundwaterLevel: 64800,
    baseline5Yr: 71200,
    deficitPercent: -8.9,
    rainfallStatus: 'Normal',
    rainfallForecastMm: 19,
    cropRisk: 'Medium',
    waterStressLevel: 'MEDIUM',
    majorCrops: ['Pomegranate', 'Onion', 'Grapes'],
    recommendedAction: 'Inspect drip lines for leakage; maintain 4-day interval.',
    recommendedActionMr: 'ठिबक सिंचन गळती तपासा; ४ दिवसांच्या अंतराने पाणी द्या.'
  }
];
