-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table linked to auth.users
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create suspect case records table
CREATE TABLE public.suspect_case_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Time & Date
  incident_timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Location
  incident_location_lat DOUBLE PRECISION,
  incident_location_lng DOUBLE PRECISION,
  incident_location_address TEXT,
  
  -- Crime Information
  crime_committed TEXT,
  arms_involved TEXT,
  vehicles_involved TEXT,
  
  -- Identifier Details
  suspect_name TEXT,
  suspect_address TEXT,
  contact_number TEXT,
  reported_by TEXT,
  
  -- Surveillance
  surveillance_footage_ref TEXT,
  
  -- Custodies
  custodies TEXT,
  
  -- Status
  status TEXT DEFAULT 'draft'
);

-- Create physical attributes table
CREATE TABLE public.suspect_physical_attributes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id UUID NOT NULL REFERENCES public.suspect_case_records(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Personal
  gender TEXT,
  age INTEGER,
  ethnicity TEXT,
  height_feet DECIMAL,
  
  -- Body Type
  body_type TEXT,
  
  -- Face
  head_shape TEXT,
  chin_shape TEXT,
  
  -- Hair
  hair_length TEXT,
  hair_texture TEXT,
  hairline_shape TEXT,
  hair_style TEXT,
  
  -- Facial Hair
  facial_hair_type TEXT,
  beard_color TEXT,
  
  -- Eyes
  eyebrow_type TEXT,
  eye_shape TEXT,
  eye_size_spacing TEXT,
  eyelid_type TEXT,
  eyelashes TEXT,
  eye_color TEXT,
  eye_bags_wrinkles TEXT,
  
  -- Nose
  nose_shape TEXT,
  bridge_height TEXT,
  nostril_width TEXT,
  nose_tip_shape TEXT,
  
  -- Mouth
  lip_thickness TEXT,
  mouth_width TEXT,
  lip_shape TEXT,
  smile_type TEXT,
  
  -- Ears
  ear_size TEXT,
  ear_lobes TEXT,
  ear_shape TEXT,
  helix_antihelix TEXT,
  
  -- Skin
  skin_tone TEXT,
  other_skin_features TEXT,
  
  -- Accessories
  accessories TEXT
);

-- Create generated images table
CREATE TABLE public.generated_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id UUID NOT NULL REFERENCES public.suspect_case_records(id) ON DELETE CASCADE,
  attributes_id UUID REFERENCES public.suspect_physical_attributes(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  image_url TEXT,
  image_data TEXT,
  generation_status TEXT DEFAULT 'pending',
  generation_metadata JSONB
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suspect_case_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suspect_physical_attributes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generated_images ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- RLS Policies for suspect_case_records
CREATE POLICY "Users can view their own cases"
  ON public.suspect_case_records FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own cases"
  ON public.suspect_case_records FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cases"
  ON public.suspect_case_records FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cases"
  ON public.suspect_case_records FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for suspect_physical_attributes
CREATE POLICY "Users can view attributes of their own cases"
  ON public.suspect_physical_attributes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.suspect_case_records
      WHERE id = case_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create attributes for their own cases"
  ON public.suspect_physical_attributes FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.suspect_case_records
      WHERE id = case_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update attributes of their own cases"
  ON public.suspect_physical_attributes FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.suspect_case_records
      WHERE id = case_id AND user_id = auth.uid()
    )
  );

-- RLS Policies for generated_images
CREATE POLICY "Users can view images of their own cases"
  ON public.generated_images FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.suspect_case_records
      WHERE id = case_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create images for their own cases"
  ON public.generated_images FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.suspect_case_records
      WHERE id = case_id AND user_id = auth.uid()
    )
  );

-- Trigger to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    NEW.email
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_case_records_updated_at
  BEFORE UPDATE ON public.suspect_case_records
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();