-- ====================================================================
-- AGRIRAKSHAK SUPABASE DATABASE SCHEMA & RLS POLICIES
-- Execute this SQL script in the Supabase SQL Editor to configure tables,
-- Row Level Security (RLS), and database triggers for user profiles.
-- ====================================================================

-- 1. Create Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  role TEXT DEFAULT 'Farmer' CHECK (role IN ('Farmer', 'Agriculture Expert', 'Admin')),
  district TEXT DEFAULT 'Kopargaon',
  state TEXT DEFAULT 'Maharashtra',
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles RLS Policies
CREATE POLICY "Public profiles are viewable by authenticated users"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- 2. Automatic User Profile Trigger on Auth Sign Up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, phone, role, district, state)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', 'Farmer User'),
    new.email,
    COALESCE(new.raw_user_meta_data->>'phone', ''),
    COALESCE(new.raw_user_meta_data->>'role', 'Farmer'),
    COALESCE(new.raw_user_meta_data->>'district', 'Kopargaon'),
    COALESCE(new.raw_user_meta_data->>'state', 'Maharashtra')
  )
  ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    email = EXCLUDED.email,
    updated_at = NOW();
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger execution setup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. Crop Diagnoses Table
CREATE TABLE IF NOT EXISTS public.crop_diagnoses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  crop_name TEXT NOT NULL,
  disease_name TEXT NOT NULL,
  confidence DOUBLE PRECISION,
  status TEXT,
  image_url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.crop_diagnoses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own diagnoses"
  ON public.crop_diagnoses FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own diagnoses"
  ON public.crop_diagnoses FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own diagnoses"
  ON public.crop_diagnoses FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- 4. Alerts Table & RLS Policies
CREATE TABLE IF NOT EXISTS public.alerts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  alert_type TEXT NOT NULL CHECK (alert_type IN ('weather', 'pest', 'disease', 'crop_health', 'market', 'government', 'system')),
  title TEXT NOT NULL,
  title_mr TEXT,
  description TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('critical', 'high', 'moderate', 'informational')),
  crop TEXT,
  location TEXT DEFAULT 'Nashik',
  source TEXT NOT NULL,
  source_url TEXT,
  action_text TEXT,
  action_route TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own or system alerts"
  ON public.alerts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update read status of their alerts"
  ON public.alerts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id OR user_id IS NULL);

-- 5. Farms Table & RLS Policies
CREATE TABLE IF NOT EXISTS public.farms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  farm_name TEXT NOT NULL,
  land_size_acres DOUBLE PRECISION NOT NULL,
  ownership_type TEXT CHECK (ownership_type IN ('Owned', 'Leased')),
  location_village TEXT,
  district TEXT DEFAULT 'Kopargaon',
  state TEXT DEFAULT 'Maharashtra',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.farms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own farms"
  ON public.farms FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own farms"
  ON public.farms FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- 6. Farm Crops Table & RLS Policies
CREATE TABLE IF NOT EXISTS public.farm_crops (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  farm_id UUID REFERENCES public.farms(id) ON DELETE CASCADE,
  crop_name TEXT NOT NULL,
  growth_stage TEXT NOT NULL,
  acres DOUBLE PRECISION NOT NULL,
  health_status TEXT CHECK (health_status IN ('Healthy', 'Monitor', 'Attention')),
  planted_date DATE
);

ALTER TABLE public.farm_crops ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view crops on their farms"
  ON public.farm_crops FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.farms f
      WHERE f.id = farm_crops.farm_id AND f.user_id = auth.uid()
    )
  );

