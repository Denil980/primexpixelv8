-- ============================================================================
-- PrimeXPixel Database Schema Migration
-- Migration 00001: Initial Schema, RLS Policies, and Triggers
-- Compatible with PostgreSQL 15+ / Supabase
-- ============================================================================

-- 1. Helper Function: Automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ----------------------------------------------------------------------------
-- 2. Admin Profiles Table & Authorization
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('owner', 'admin', 'editor')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger for admin_users
CREATE OR REPLACE TRIGGER tr_admin_users_updated_at
  BEFORE UPDATE ON public.admin_users
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Security function to verify if the current request is from an authorized admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE id = auth.uid()
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ----------------------------------------------------------------------------
-- 3. Module 1: Blogs (Articles & Insights)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.blogs (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  cover_image TEXT,
  category TEXT NOT NULL,
  tags TEXT[] NOT NULL DEFAULT '{}',
  excerpt TEXT,
  content TEXT NOT NULL,
  author TEXT NOT NULL DEFAULT 'PrimeXPixel Team',
  publish_date TEXT DEFAULT TO_CHAR(NOW(), 'Mon DD, YYYY'),
  seo_title TEXT,
  seo_description TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  reading_time TEXT DEFAULT '5 min',
  area TEXT DEFAULT 'Mumbai',
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_blogs_status ON public.blogs(status);
CREATE INDEX IF NOT EXISTS idx_blogs_slug ON public.blogs(slug);
CREATE INDEX IF NOT EXISTS idx_blogs_order ON public.blogs(display_order);

CREATE OR REPLACE TRIGGER tr_blogs_updated_at
  BEFORE UPDATE ON public.blogs
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ----------------------------------------------------------------------------
-- 4. Module 2: Client Reviews (Text Testimonials)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.reviews (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  company TEXT NOT NULL,
  role TEXT,
  photo TEXT,
  initials TEXT,
  rating INTEGER NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT NOT NULL,
  date TEXT DEFAULT TO_CHAR(NOW(), 'YYYY'),
  is_visible BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reviews_visibility ON public.reviews(is_visible);
CREATE INDEX IF NOT EXISTS idx_reviews_order ON public.reviews(display_order);

CREATE OR REPLACE TRIGGER tr_reviews_updated_at
  BEFORE UPDATE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ----------------------------------------------------------------------------
-- 5. Module 3: Video Reviews
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.video_reviews (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  company TEXT NOT NULL,
  video_url TEXT NOT NULL,
  thumbnail TEXT,
  metric TEXT,
  hue TEXT DEFAULT '#0582D5',
  is_visible BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_video_reviews_visibility ON public.video_reviews(is_visible);
CREATE INDEX IF NOT EXISTS idx_video_reviews_order ON public.video_reviews(display_order);

CREATE OR REPLACE TRIGGER tr_video_reviews_updated_at
  BEFORE UPDATE ON public.video_reviews
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ----------------------------------------------------------------------------
-- 6. Module 4: Our Works (Portfolio Case Studies)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.works (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  client TEXT NOT NULL,
  category TEXT NOT NULL,
  cover_image TEXT,
  gallery TEXT[] NOT NULL DEFAULT '{}',
  description TEXT,
  challenge TEXT,
  approach TEXT,
  outcome TEXT,
  live_link TEXT,
  tech TEXT[] NOT NULL DEFAULT '{}',
  year TEXT,
  results JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_works_visibility ON public.works(is_visible);
CREATE INDEX IF NOT EXISTS idx_works_slug ON public.works(slug);
CREATE INDEX IF NOT EXISTS idx_works_order ON public.works(display_order);

CREATE OR REPLACE TRIGGER tr_works_updated_at
  BEFORE UPDATE ON public.works
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ----------------------------------------------------------------------------
-- 7. Module 5: Services (With Zero-Pricing Architecture)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.services (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  icon TEXT NOT NULL DEFAULT 'Code2',
  tagline TEXT,
  hero_image TEXT,
  short_desc TEXT NOT NULL,
  full_desc TEXT NOT NULL,
  overview TEXT,
  who_it_is_for TEXT,
  problem TEXT,
  solution TEXT,
  highlights TEXT[] NOT NULL DEFAULT '{}',
  benefits TEXT[] NOT NULL DEFAULT '{}',
  process TEXT[] NOT NULL DEFAULT '{}',
  faqs JSONB NOT NULL DEFAULT '[]'::jsonb,
  cta_text TEXT DEFAULT 'Get a Custom Quote',
  gallery TEXT[] NOT NULL DEFAULT '{}',
  meta_title TEXT,
  meta_description TEXT,
  technologies TEXT[] NOT NULL DEFAULT '{}',
  work_categories TEXT[] NOT NULL DEFAULT '{}',
  is_visible BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_services_visibility ON public.services(is_visible);
CREATE INDEX IF NOT EXISTS idx_services_slug ON public.services(slug);
CREATE INDEX IF NOT EXISTS idx_services_order ON public.services(display_order);

CREATE OR REPLACE TRIGGER tr_services_updated_at
  BEFORE UPDATE ON public.services
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ----------------------------------------------------------------------------
-- 8. Module 6: Our Process (Step-by-step Timeline)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.process_steps (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  step_number INTEGER NOT NULL DEFAULT 1,
  title TEXT NOT NULL,
  short_desc TEXT,
  icon TEXT NOT NULL DEFAULT 'Compass',
  is_visible BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_process_steps_visibility ON public.process_steps(is_visible);
CREATE INDEX IF NOT EXISTS idx_process_steps_order ON public.process_steps(display_order);

CREATE OR REPLACE TRIGGER tr_process_steps_updated_at
  BEFORE UPDATE ON public.process_steps
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ----------------------------------------------------------------------------
-- 9. Module 7: FAQs
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.faqs (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'General',
  is_visible BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_faqs_visibility ON public.faqs(is_visible);
CREATE INDEX IF NOT EXISTS idx_faqs_order ON public.faqs(display_order);

CREATE OR REPLACE TRIGGER tr_faqs_updated_at
  BEFORE UPDATE ON public.faqs
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ----------------------------------------------------------------------------
-- 10. Module 8: Site Numbers / Statistics
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.site_numbers (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  label TEXT NOT NULL,
  value TEXT NOT NULL,
  suffix TEXT DEFAULT '',
  location TEXT NOT NULL,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_site_numbers_visibility ON public.site_numbers(is_visible);
CREATE INDEX IF NOT EXISTS idx_site_numbers_location ON public.site_numbers(location);
CREATE INDEX IF NOT EXISTS idx_site_numbers_order ON public.site_numbers(display_order);

CREATE OR REPLACE TRIGGER tr_site_numbers_updated_at
  BEFORE UPDATE ON public.site_numbers
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================================
-- 11. Row Level Security (RLS) Enablement & Policies
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.video_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.works ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.process_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_numbers ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- Policies for admin_users
-- ----------------------------------------------------------------------------
CREATE POLICY "Admins can view admin list"
  ON public.admin_users
  FOR SELECT
  TO authenticated
  USING (public.is_admin() OR auth.uid() = id);

CREATE POLICY "Owners can manage admin users"
  ON public.admin_users
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE id = auth.uid() AND role = 'owner'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE id = auth.uid() AND role = 'owner'
    )
  );

-- ----------------------------------------------------------------------------
-- Policies for blogs
-- ----------------------------------------------------------------------------
-- Public: can read published articles only
CREATE POLICY "Public can view published blogs"
  ON public.blogs
  FOR SELECT
  TO anon, authenticated
  USING (status = 'published');

-- Admins: full CRUD access
CREATE POLICY "Admins have full access to blogs"
  ON public.blogs
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ----------------------------------------------------------------------------
-- Policies for reviews
-- ----------------------------------------------------------------------------
CREATE POLICY "Public can view visible reviews"
  ON public.reviews
  FOR SELECT
  TO anon, authenticated
  USING (is_visible = true);

CREATE POLICY "Admins have full access to reviews"
  ON public.reviews
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ----------------------------------------------------------------------------
-- Policies for video_reviews
-- ----------------------------------------------------------------------------
CREATE POLICY "Public can view visible video reviews"
  ON public.video_reviews
  FOR SELECT
  TO anon, authenticated
  USING (is_visible = true);

CREATE POLICY "Admins have full access to video reviews"
  ON public.video_reviews
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ----------------------------------------------------------------------------
-- Policies for works
-- ----------------------------------------------------------------------------
CREATE POLICY "Public can view visible works"
  ON public.works
  FOR SELECT
  TO anon, authenticated
  USING (is_visible = true);

CREATE POLICY "Admins have full access to works"
  ON public.works
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ----------------------------------------------------------------------------
-- Policies for services
-- ----------------------------------------------------------------------------
CREATE POLICY "Public can view visible services"
  ON public.services
  FOR SELECT
  TO anon, authenticated
  USING (is_visible = true);

CREATE POLICY "Admins have full access to services"
  ON public.services
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ----------------------------------------------------------------------------
-- Policies for process_steps
-- ----------------------------------------------------------------------------
CREATE POLICY "Public can view visible process steps"
  ON public.process_steps
  FOR SELECT
  TO anon, authenticated
  USING (is_visible = true);

CREATE POLICY "Admins have full access to process steps"
  ON public.process_steps
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ----------------------------------------------------------------------------
-- Policies for faqs
-- ----------------------------------------------------------------------------
CREATE POLICY "Public can view visible faqs"
  ON public.faqs
  FOR SELECT
  TO anon, authenticated
  USING (is_visible = true);

CREATE POLICY "Admins have full access to faqs"
  ON public.faqs
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ----------------------------------------------------------------------------
-- Policies for site_numbers
-- ----------------------------------------------------------------------------
CREATE POLICY "Public can view visible site numbers"
  ON public.site_numbers
  FOR SELECT
  TO anon, authenticated
  USING (is_visible = true);

CREATE POLICY "Admins have full access to site numbers"
  ON public.site_numbers
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ----------------------------------------------------------------------------
-- 12. Storage Bucket Configuration (SQL blueprint for later execution)
-- ----------------------------------------------------------------------------
-- INSERT INTO storage.buckets (id, name, public) VALUES ('media', 'media', true)
-- ON CONFLICT (id) DO NOTHING;
--
-- CREATE POLICY "Public Access" ON storage.objects
--   FOR SELECT TO anon, authenticated USING (bucket_id = 'media');
--
-- CREATE POLICY "Admin Upload Access" ON storage.objects
--   FOR INSERT TO authenticated WITH CHECK (bucket_id = 'media' AND public.is_admin());
--
-- CREATE POLICY "Admin Update Access" ON storage.objects
--   FOR UPDATE TO authenticated USING (bucket_id = 'media' AND public.is_admin());
--
-- CREATE POLICY "Admin Delete Access" ON storage.objects
--   FOR DELETE TO authenticated USING (bucket_id = 'media' AND public.is_admin());
