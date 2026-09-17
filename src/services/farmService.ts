import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import type { Farm, FarmCrop } from '../types/farm';

// Realistic fallback farms for Ramesh Patil in Kopargaon
const INITIAL_DEMO_FARMS: Farm[] = [
  {
    id: 'farm-1',
    farm_name: 'Main Farm',
    land_size_acres: 3.5,
    ownership_type: 'Owned',
    location_village: 'Kopargaon',
    district: 'Kopargaon',
    state: 'Maharashtra',
    created_at: new Date().toISOString()
  },
  {
    id: 'farm-2',
    farm_name: 'Riverside Farm',
    land_size_acres: 2.0,
    ownership_type: 'Leased',
    location_village: 'Near Godavari River',
    district: 'Kopargaon',
    state: 'Maharashtra',
    created_at: new Date().toISOString()
  }
];

const INITIAL_DEMO_CROPS: FarmCrop[] = [
  {
    id: 'crop-1',
    farm_id: 'farm-1',
    crop_name: 'Onion',
    growth_stage: 'Vegetative',
    acres: 2.0,
    health_status: 'Healthy',
    planted_date: '2026-07-15'
  },
  {
    id: 'crop-2',
    farm_id: 'farm-1',
    crop_name: 'Tomato',
    growth_stage: 'Flowering',
    acres: 1.5,
    health_status: 'Monitor',
    planted_date: '2026-08-01'
  },
  {
    id: 'crop-3',
    farm_id: 'farm-2',
    crop_name: 'Wheat',
    growth_stage: 'Tillering',
    acres: 2.0,
    health_status: 'Healthy',
    planted_date: '2026-08-20'
  }
];

const LOCAL_FARMS_KEY = 'agri_rakshak_user_farms';

export const getUserFarms = async (user?: any): Promise<Farm[]> => {
  if (isSupabaseConfigured && user?.id) {
    try {
      const { data, error } = await supabase
        .from('farms')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data as Farm[];
      }
    } catch (e) {
      console.warn('Supabase farms query failed, falling back to local storage', e);
    }
  }

  // Local Storage Fallback
  const stored = localStorage.getItem(LOCAL_FARMS_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse stored farms', e);
    }
  }

  localStorage.setItem(LOCAL_FARMS_KEY, JSON.stringify(INITIAL_DEMO_FARMS));
  return INITIAL_DEMO_FARMS;
};

export const getUserCrops = async (user?: any): Promise<FarmCrop[]> => {
  if (isSupabaseConfigured && user?.id) {
    try {
      const { data, error } = await supabase
        .from('farm_crops')
        .select('*')
        .order('crop_name', { ascending: true });

      if (!error && data && data.length > 0) {
        return data as FarmCrop[];
      }
    } catch (e) {
      console.warn('Supabase farm_crops query failed, falling back to local storage', e);
    }
  }

  return INITIAL_DEMO_CROPS;
};

export const addNewFarm = async (
  farmData: Omit<Farm, 'id' | 'created_at'>,
  user?: any
): Promise<Farm> => {
  const newFarm: Farm = {
    ...farmData,
    id: `farm-${Date.now()}`,
    user_id: user?.id,
    created_at: new Date().toISOString()
  };

  if (isSupabaseConfigured && user?.id) {
    try {
      const { data, error } = await supabase
        .from('farms')
        .insert([{ ...newFarm, user_id: user.id }])
        .select()
        .single();

      if (!error && data) {
        return data as Farm;
      }
    } catch (e) {
      console.error('Failed to insert farm in Supabase', e);
    }
  }

  // Fallback to local storage update
  const existing = await getUserFarms(user);
  const updated = [newFarm, ...existing];
  localStorage.setItem(LOCAL_FARMS_KEY, JSON.stringify(updated));
  return newFarm;
};
