export type RiskSeverity = 'Low' | 'Moderate' | 'High' | 'Critical';
export type GrowthStage = 'Seedling' | 'Vegetative' | 'Flowering' | 'Fruiting' | 'Harvest';
export type Language = 'en' | 'mr' | 'hi';

export interface CropDoctorInput {
  imageFile?: File;
  imageUrl?: string;
  crop: string;
  growthStage: GrowthStage;
  location: {
    state: string;
    district: string;
    village?: string;
  };
  symptomsObserved?: string;
}

export interface VerifiedCropProtectionProduct {
  id: string;
  crop: string;
  target_disease: string;
  product_name: string;
  active_ingredient: string;
  application_guidance: string;
  ppe: string;
  pre_harvest_interval: string;
  region: string;
  source: string;
  verification_date: string;
  status: 'Approved' | 'Restricted' | 'Under Review';
}

export interface IntegratedManagementGuidance {
  irrigation: string;
  hygiene: string;
  pestMonitoring: string;
  nutrition: string;
  environmental: string;
}

export interface CropDiagnosis {
  id: string;
  farmer_id?: string;
  image_url: string;
  crop: string;
  growth_stage: GrowthStage;
  location: {
    state: string;
    district: string;
    village?: string;
  };
  isHealthy: boolean;
  predicted_disease: string;
  confidence: number; // e.g. 94%
  severity: RiskSeverity;
  affected_area_percentage?: string; // e.g. "20-40%" or undefined if unavailable
  symptoms: string[];
  ai_explanation: string;
  immediate_actions: string[];
  prevention_tips: string[];
  verifiedTreatmentOptions: VerifiedCropProtectionProduct[];
  integratedManagement: IntegratedManagementGuidance;
  weather_risk_factor?: {
    currentTemp: number;
    humidity: number;
    rainfall: number;
    riskMessage: string;
  };
  model_version: string;
  created_at: string;
  status: 'Healthy' | 'Disease Detected' | 'Needs Review' | 'Low Confidence';
}

export interface ExpertReview {
  id: string;
  diagnosis_id: string;
  expert_id: string;
  expert_name: string;
  expert_role: string;
  final_assessment: string;
  comments: string;
  created_at: string;
}

export interface CropDiseaseClass {
  id: string;
  crop: string;
  disease: string;
  description: string;
  symptoms: string[];
  prevention: string[];
  status: 'Active' | 'Deprecated';
}

export interface AdminModelOverview {
  currentModel: string;
  version: string;
  accuracy: number;
  f1Score: number;
  lastUpdated: string;
  totalDiagnoses: number;
  datasetSize: number;
  diseaseClassesCount: number;
  confusionMatrix: {
    labels: string[];
    matrix: number[][];
  };
  classMetrics: Array<{
    className: string;
    precision: number;
    recall: number;
    f1: number;
    samplesCount: number;
  }>;
  feedbackStats: {
    correctCount: number;
    incorrectCount: number;
    expertReviewCount: number;
  };
}
