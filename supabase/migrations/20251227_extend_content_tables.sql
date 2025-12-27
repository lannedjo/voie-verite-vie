-- Extend activities, gallery_items, activity_registrations and profiles to match frontend needs

-- Add columns to activities for event metadata
ALTER TABLE IF EXISTS public.activities
  ADD COLUMN IF NOT EXISTS category text,
  ADD COLUMN IF NOT EXISTS event_date date,
  ADD COLUMN IF NOT EXISTS event_time text,
  ADD COLUMN IF NOT EXISTS location text,
  ADD COLUMN IF NOT EXISTS participants integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS max_participants integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS image_url text,
  ADD COLUMN IF NOT EXISTS price numeric(10,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS currency text DEFAULT 'FCFA',
  ADD COLUMN IF NOT EXISTS is_paid boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS payment_methods jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS status text DEFAULT 'open';

-- Add richer metadata to gallery_items
ALTER TABLE IF EXISTS public.gallery_items
  ADD COLUMN IF NOT EXISTS media_type text DEFAULT 'image', -- image | video
  ADD COLUMN IF NOT EXISTS category text,
  ADD COLUMN IF NOT EXISTS media_url text,
  ADD COLUMN IF NOT EXISTS media_duration text,
  ADD COLUMN IF NOT EXISTS location text,
  ADD COLUMN IF NOT EXISTS participants integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS metadata jsonb DEFAULT '{}'::jsonb;

-- Add optional fields to registrations
ALTER TABLE IF EXISTS public.activity_registrations
  ADD COLUMN IF NOT EXISTS activity_title varchar(255),
  ADD COLUMN IF NOT EXISTS payment_status varchar(50) DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS backend_source text DEFAULT 'supabase';

-- Add phone to profiles
ALTER TABLE IF EXISTS public.profiles
  ADD COLUMN IF NOT EXISTS phone varchar(20);

-- Indexes for new columns
CREATE INDEX IF NOT EXISTS idx_activities_event_date ON public.activities(event_date);
CREATE INDEX IF NOT EXISTS idx_gallery_items_category ON public.gallery_items(category);
CREATE INDEX IF NOT EXISTS idx_activity_registrations_activity_title ON public.activity_registrations(activity_title);

-- Ensure RLS is enabled and policies permit admins to manage new columns
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_registrations ENABLE ROW LEVEL SECURITY;

-- Grant basic admin management policies (assumes public.has_role function exists)
CREATE POLICY IF NOT EXISTS "Admins can manage activities" ON public.activities FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY IF NOT EXISTS "Admins can manage gallery_items" ON public.gallery_items FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY IF NOT EXISTS "Admins can manage registrations" ON public.activity_registrations FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- End of migration
