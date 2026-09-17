export type SchemeCategory =
  | 'Direct Cash Support'
  | 'Crop Insurance'
  | 'Irrigation & Solar'
  | 'Equipment & Machinery'
  | 'Organic Farming'
  | 'Loans & Credit'
  | 'Soil & Fertilizer'
  | 'Livestock & Dairy';

export type GovernmentLevel = 'Central Government' | 'Maharashtra State Govt';

export type LandSizeEligibility =
  | 'All Farmers'
  | 'Small & Marginal (< 2 Ha)'
  | 'Medium (2-5 Ha)'
  | 'Large (> 5 Ha)';

export interface GovernmentScheme {
  id: string;
  title: string;
  title_mr: string;
  category: SchemeCategory;
  government_level: GovernmentLevel;
  summary: string;
  benefits: string;
  subsidy_amount: string;
  max_subsidy: string;
  land_holding_eligibility: LandSizeEligibility[];
  crop_eligibility: string[];
  category_eligibility: string[];
  required_documents: string[];
  application_steps: string[];
  official_portal_url: string;
  helpline_number: string;
  status: 'Active / Open' | 'Always Open' | 'Seasonal';
  badge: string;
  icon_name: string;
}

export interface SchemeFilterOptions {
  searchQuery: string;
  selectedCategory: string;
  selectedGovtLevel: string;
  landSize: string;
}
