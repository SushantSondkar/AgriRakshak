export type OwnershipType = 'Owned' | 'Leased';
export type HealthStatus = 'Healthy' | 'Monitor' | 'Attention';

export interface Farm {
  id: string;
  user_id?: string;
  farm_name: string;
  land_size_acres: number;
  ownership_type: OwnershipType;
  location_village: string;
  district: string;
  state: string;
  created_at?: string;
}

export interface FarmCrop {
  id: string;
  farm_id: string;
  crop_name: string;
  growth_stage: string;
  acres: number;
  health_status: HealthStatus;
  planted_date?: string;
}
