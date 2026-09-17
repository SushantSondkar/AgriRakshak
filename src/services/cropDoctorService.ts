import type { 
  CropDiagnosis, 
  CropDoctorInput, 
  ExpertReview, 
  AdminModelOverview 
} from '../types/cropDoctor';
import { getVerifiedProtectionProducts } from './verifiedPesticideDatabase';

const LOCAL_STORAGE_KEY = 'agrirakshak_crop_diagnoses_v1';

// Preset disease profiles for mock AI engine
const MOCK_DISEASE_PROFILES: Record<string, any> = {
  'Tomato': {
    disease: 'Early Blight (Alternaria solani)',
    confidence: 94,
    severity: 'Moderate',
    affectedArea: '20-40%',
    isHealthy: false,
    symptoms: [
      'Concentric dark brown rings on lower leaves (bullseye pattern)',
      'Yellow chlorotic halos surrounding leaf lesions',
      'Early defoliation of lower canopy'
    ],
    explanation: 'The AI computer vision model identified concentric ring patterns and marginal yellowing characteristic of Alternaria solani fungal infection, reinforced by high ambient humidity.',
    immediateActions: [
      'Prune severely infected lower leaves and burn or bury them away from the field.',
      'Avoid overhead sprinkler irrigation to prevent leaf wetness duration exceeding 4 hours.',
      'Inspect adjacent plants for early spot formation.'
    ],
    preventionTips: [
      'Practice a 3-year crop rotation with non-solanaceous crops (e.g. maize, legumes).',
      'Maintain wider row spacing to enhance field ventilation.',
      'Apply organic mulch (straw/paddy husk) to prevent soil-splash spore dispersal.'
    ],
    integratedManagement: {
      irrigation: 'Switch to drip irrigation. Irrigate early in the morning so foliage dries quickly under sunlight.',
      hygiene: 'Remove crop debris immediately after harvest. Keep field margins weed-free.',
      pestMonitoring: 'Scout weekly starting from lower canopy leaves during humid warm weather.',
      nutrition: 'Ensure balanced Nitrogen application. Excess Nitrogen promotes susceptible plush foliage.',
      environmental: 'Warm temperatures (24-29°C) combined with high dew increase spore germination risk.'
    }
  },
  'Cotton': {
    disease: 'Bacterial Blight (Xanthomonas citri pv. malvacearum)',
    confidence: 91,
    severity: 'High',
    affectedArea: '30-50%',
    isHealthy: false,
    symptoms: [
      'Angular water-soaked spots bounded by leaf veinlets',
      'Black arm lesions on vegetative stems',
      'Sunken brown spots on young bolls'
    ],
    explanation: 'Angular vein-delimited lesions and black stem streak patterns match bacterial blight symptoms accelerated by rainfall and high temperatures.',
    immediateActions: [
      'Avoid field operations when foliage is wet to prevent bacterial spreading.',
      'Remove heavily blighted twigs and bolls.',
      'Refrain from excessive nitrogenous top-dressing.'
    ],
    preventionTips: [
      'Use acid-delinted disease-free certified seeds.',
      'Incorporate crop residues deep into soil post-harvest.',
      'Cultivate resistant Bt cotton hybrids suitable for regional soil.'
    ],
    integratedManagement: {
      irrigation: 'Ensure proper field drainage. Avoid stagnant water in furrows.',
      hygiene: 'Destroy volunteer cotton plants and wild malvaceous weed hosts.',
      pestMonitoring: 'Monitor after rain showers when humidity stays above 80%.',
      nutrition: 'Apply Potassium to boost leaf epidermal cell thickness.',
      environmental: 'High relative humidity (>85%) and temperature (28-32°C) favor bacterial multiplication.'
    }
  },
  'Onion': {
    disease: 'Purple Blotch (Alternaria porri)',
    confidence: 88,
    severity: 'Moderate',
    affectedArea: '15-30%',
    isHealthy: false,
    symptoms: [
      'Purplish-brown elliptical lesions on tubular leaves',
      'Yellowing and tip dieback of affected leaves',
      'Water-soaked sunken areas near neck of the bulb'
    ],
    explanation: 'Elongated purple-centered spots on tubular leaf tissue are indicative of Alternaria porri fungal pathogen common during humid Rabi/Kharif transitions.',
    immediateActions: [
      'Spray sticker-spreader solution to ensure uniform fungicide adhesion on waxy leaves.',
      'Avoid overhead sprinkling during late afternoon.'
    ],
    preventionTips: [
      'Maintain well-drained beds and avoid dense seedling overcrowding.',
      'Rotate crops with sugarcane or maize every 2 seasons.'
    ],
    integratedManagement: {
      irrigation: 'Drip or furrow irrigation; avoid flooding bulb necks.',
      hygiene: 'Clear crop stubble from previous season.',
      pestMonitoring: 'Check for thrips injury as thrips wounds serve as entry points for Purple Blotch.',
      nutrition: 'Ensure adequate Sulfur and Potash for bulb skin strength.',
      environmental: 'Dew persistence over 8 hours accelerates spore infection.'
    }
  },
  'Soybean': {
    disease: 'Asian Soybean Rust (Phakopsora pachyrhizi)',
    confidence: 92,
    severity: 'High',
    affectedArea: '25-45%',
    isHealthy: false,
    symptoms: [
      'Tiny tan to reddish-brown pustules (lesions) on leaf undersides',
      'Premature yellowing and leaf dropping',
      'Reduced pod filling and seed weight'
    ],
    explanation: 'Abaxial leaf pustules and rapid chlorotic leaf bronzing reflect airborne rust fungal spores active in overcast humid weather.',
    immediateActions: [
      'Scout lower leaves inside canopy daily.',
      'Destroy localized disease hot-spots before spore cloud dispersal.'
    ],
    preventionTips: [
      'Plant early-maturing rust-tolerant varieties.',
      'Avoid excessive canopy density through recommended seed rates.'
    ],
    integratedManagement: {
      irrigation: 'Maintain soil moisture without creating waterlogging.',
      hygiene: 'Keep field borders free from legume weeds.',
      pestMonitoring: 'Monitor closely at canopy closure and flowering.',
      nutrition: 'Soil test based application of Micronutrients (Zinc, Boron).',
      environmental: 'Cool nights (15-22°C) with fog/dew promote rust development.'
    }
  },
  'Healthy': {
    disease: 'No Disease Detected (Crop Appears Healthy)',
    confidence: 96,
    severity: 'Low',
    affectedArea: '0%',
    isHealthy: true,
    symptoms: [
      'Vibrant green uniform foliage',
      'No visual chlorosis, lesions, or leaf spots',
      'Sturdy stem architecture and normal growth'
    ],
    explanation: 'AI visual feature maps detected healthy chlorophyll pigments, clean leaf margins, and intact vascular structures across the uploaded image.',
    immediateActions: [
      'Continue standard crop management and routine scouting.',
      'Ensure balanced irrigation according to crop growth stage.'
    ],
    preventionTips: [
      'Maintain good soil health through compost and bio-fertilizers.',
      'Keep yellow sticky traps installed for early vector monitoring.'
    ],
    integratedManagement: {
      irrigation: 'Regular scheduled irrigation based on soil moisture tensiometer.',
      hygiene: 'Keep bunds clean.',
      pestMonitoring: 'Bi-weekly routine scouting.',
      nutrition: 'Apply recommended NPK split doses.',
      environmental: 'Favorable growth weather conditions.'
    }
  }
};

export const analyzeCropImage = async (input: CropDoctorInput): Promise<CropDiagnosis> => {
  // Validate file size if file object exists
  if (input.imageFile && input.imageFile.size > 10 * 1024 * 1024) {
    throw new Error('Image file exceeds maximum allowable size of 10 MB.');
  }

  // Simulate network latency for AI pipeline execution (2.5 seconds)
  await new Promise(res => setTimeout(res, 2200));

  // Determine crop profile
  const cropName = input.crop || 'Tomato';
  
  // Check if image filename or symptoms hint at healthy crop
  const isHealthySearch = (input.symptomsObserved || '').toLowerCase().includes('healthy') || 
                          (input.imageFile?.name || '').toLowerCase().includes('healthy');
  
  const profileKey = isHealthySearch ? 'Healthy' : (MOCK_DISEASE_PROFILES[cropName] ? cropName : 'Tomato');
  const profile = MOCK_DISEASE_PROFILES[profileKey];

  // Retrieve verified protection products from official database ONLY
  const verifiedOptions = profile.isHealthy 
    ? [] 
    : getVerifiedProtectionProducts(cropName, profile.disease.split(' ')[0]);

  // Create preview URL
  const imageUrl = input.imageUrl || (input.imageFile ? URL.createObjectURL(input.imageFile) : 'https://images.unsplash.com/photo-1592417817098-8f3d6ef23a28?auto=format&fit=crop&w=600&q=80');

  const diagnosis: CropDiagnosis = {
    id: `diag-${Date.now()}`,
    image_url: imageUrl,
    crop: cropName,
    growth_stage: input.growthStage || 'Vegetative',
    location: input.location || { state: 'Maharashtra', district: 'Nashik', village: 'Kopargaon' },
    isHealthy: profile.isHealthy,
    predicted_disease: profile.disease,
    confidence: profile.confidence,
    severity: profile.severity,
    affected_area_percentage: profile.affectedArea,
    symptoms: profile.symptoms,
    ai_explanation: profile.explanation,
    immediate_actions: profile.immediateActions,
    prevention_tips: profile.preventionTips,
    verifiedTreatmentOptions: verifiedOptions,
    integratedManagement: profile.integratedManagement,
    weather_risk_factor: {
      currentTemp: 28.5,
      humidity: 82,
      rainfall: 14.2,
      riskMessage: 'High humidity (>80%) and moderate rain increase fungal spore germination and spreading velocity.'
    },
    model_version: 'v1.4.2-cropnet-resnet50',
    created_at: new Date().toISOString(),
    status: profile.isHealthy ? 'Healthy' : 'Disease Detected'
  };

  // Save to history storage
  saveDiagnosisToHistory(diagnosis);

  return diagnosis;
};

// Storage Helpers
export const getDiagnosisHistory = (): CropDiagnosis[] => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      // Return default mock history if empty
      const defaultHistory = getMockHistory();
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(defaultHistory));
      return defaultHistory;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to read diagnosis history:', err);
    return getMockHistory();
  }
};

export const saveDiagnosisToHistory = (diagnosis: CropDiagnosis): void => {
  try {
    const history = getDiagnosisHistory();
    const updated = [diagnosis, ...history.filter(d => d.id !== diagnosis.id)];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save diagnosis:', err);
  }
};

export const deleteDiagnosisFromHistory = (id: string): CropDiagnosis[] => {
  try {
    const history = getDiagnosisHistory();
    const updated = history.filter(d => d.id !== id);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to delete diagnosis:', err);
    return [];
  }
};

export const submitExpertReview = async (diagnosisId: string, comments: string): Promise<ExpertReview> => {
  await new Promise(res => setTimeout(res, 1000));

  const review: ExpertReview = {
    id: `rev-${Date.now()}`,
    diagnosis_id: diagnosisId,
    expert_id: 'exp-102',
    expert_name: 'Dr. Ramesh Patil (Senior Plant Pathologist)',
    expert_role: 'Krishi Vigyan Kendra (KVK) Extension Officer',
    final_assessment: 'Under Expert Review',
    comments: comments || 'Farmer submitted diagnosis for secondary verification.',
    created_at: new Date().toISOString()
  };

  // Update diagnosis status in history
  const history = getDiagnosisHistory();
  const target = history.find(h => h.id === diagnosisId);
  if (target) {
    target.status = 'Needs Review';
    saveDiagnosisToHistory(target);
  }

  return review;
};

export const getAdminModelOverview = (): AdminModelOverview => {
  return {
    currentModel: 'CropNet-VisionTransformer (ViT-B/16)',
    version: 'v1.4.2-prod',
    accuracy: 94.8,
    f1Score: 0.936,
    lastUpdated: '2026-09-01',
    totalDiagnoses: 14280,
    datasetSize: 52400,
    diseaseClassesCount: 18,
    confusionMatrix: {
      labels: ['Tomato Early Blight', 'Tomato Late Blight', 'Cotton Blight', 'Onion Purple Blotch', 'Soybean Rust', 'Healthy'],
      matrix: [
        [94, 3, 1, 1, 0, 1],
        [2, 93, 2, 1, 0, 2],
        [1, 1, 95, 1, 1, 1],
        [0, 2, 1, 92, 2, 3],
        [1, 0, 1, 2, 94, 2],
        [1, 1, 0, 1, 1, 96]
      ]
    },
    classMetrics: [
      { className: 'Tomato Early Blight', precision: 0.94, recall: 0.94, f1: 0.94, samplesCount: 8500 },
      { className: 'Tomato Late Blight', precision: 0.93, recall: 0.93, f1: 0.93, samplesCount: 7800 },
      { className: 'Cotton Bacterial Blight', precision: 0.95, recall: 0.95, f1: 0.95, samplesCount: 9200 },
      { className: 'Onion Purple Blotch', precision: 0.92, recall: 0.92, f1: 0.92, samplesCount: 6400 },
      { className: 'Soybean Rust', precision: 0.94, recall: 0.94, f1: 0.94, samplesCount: 7100 },
      { className: 'Healthy Leaves', precision: 0.96, recall: 0.96, f1: 0.96, samplesCount: 13400 }
    ],
    feedbackStats: {
      correctCount: 12450,
      incorrectCount: 380,
      expertReviewCount: 1450
    }
  };
};

function getMockHistory(): CropDiagnosis[] {
  return [
    {
      id: 'diag-101',
      image_url: 'https://images.unsplash.com/photo-1592417817098-8f3d6ef23a28?auto=format&fit=crop&w=600&q=80',
      crop: 'Tomato',
      growth_stage: 'Fruiting',
      location: { state: 'Maharashtra', district: 'Nashik', village: 'Kopargaon' },
      isHealthy: false,
      predicted_disease: 'Early Blight (Alternaria solani)',
      confidence: 94,
      severity: 'Moderate',
      affected_area_percentage: '20-40%',
      symptoms: ['Concentric dark brown rings', 'Yellowing around affected areas'],
      ai_explanation: 'Identified concentric dark lesions on lower leaves with halo chlorosis.',
      immediate_actions: ['Prune severely infected leaves', 'Avoid overhead sprinkler watering'],
      prevention_tips: ['Crop rotation with legumes', 'Apply organic mulch'],
      verifiedTreatmentOptions: getVerifiedProtectionProducts('Tomato', 'Early Blight'),
      integratedManagement: {
        irrigation: 'Drip irrigation early morning',
        hygiene: 'Clear crop debris post harvest',
        pestMonitoring: 'Weekly scouting',
        nutrition: 'Balanced NPK',
        environmental: 'High relative humidity notice'
      },
      model_version: 'v1.4.2-cropnet',
      created_at: '2026-09-17T09:30:00Z',
      status: 'Disease Detected'
    },
    {
      id: 'diag-102',
      image_url: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=80',
      crop: 'Cotton',
      growth_stage: 'Vegetative',
      location: { state: 'Maharashtra', district: 'Pune', village: 'Baramati' },
      isHealthy: true,
      predicted_disease: 'No Disease Detected (Crop Appears Healthy)',
      confidence: 96,
      severity: 'Low',
      affected_area_percentage: '0%',
      symptoms: ['Vibrant green leaves', 'Clean margins'],
      ai_explanation: 'Healthy leaf structures and intact vascular tissue detected.',
      immediate_actions: ['Continue good field management'],
      prevention_tips: ['Install yellow sticky traps'],
      verifiedTreatmentOptions: [],
      integratedManagement: {
        irrigation: 'Scheduled drip',
        hygiene: 'Clean bunds',
        pestMonitoring: 'Routine',
        nutrition: 'Soil-test based',
        environmental: 'Normal'
      },
      model_version: 'v1.4.2-cropnet',
      created_at: '2026-09-15T14:10:00Z',
      status: 'Healthy'
    }
  ];
}
