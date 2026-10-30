-- ============================================================================
-- PrimeXPixel Database Schema Migration
-- Migration 00001: Complete Schema, RLS Policies, Activity Logs & Triggers
-- Compatible with PostgreSQL 15+ / Supabase
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Helper Function: Automatically update updated_at timestamp
-- ----------------------------------------------------------------------------
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
  theme_preference TEXT DEFAULT 'system' CHECK (theme_preference IN ('dark', 'light', 'system')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger for admin_users updated_at
CREATE OR REPLACE TRIGGER tr_admin_users_updated_at
  BEFORE UPDATE ON public.admin_users
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Security helper: check if requesting user is an authorized admin
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

-- Security helper: check if requesting user is an owner
CREATE OR REPLACE FUNCTION public.is_owner()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE id = auth.uid() AND role = 'owner'
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Prevent role self-escalation: only owners can change roles
CREATE OR REPLACE FUNCTION public.check_admin_role_escalation()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'UPDATE' AND OLD.role IS DISTINCT FROM NEW.role) THEN
    IF NOT public.is_owner() THEN
      RAISE EXCEPTION 'Unauthorized: Only owners can modify administrator roles';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER tr_check_admin_role_escalation
  BEFORE UPDATE ON public.admin_users
  FOR EACH ROW EXECUTE FUNCTION public.check_admin_role_escalation();

-- ----------------------------------------------------------------------------
-- 3. System & Admin Settings Table
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admin_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  description TEXT,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE TRIGGER tr_admin_settings_updated_at
  BEFORE UPDATE ON public.admin_settings
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Seed default settings
INSERT INTO public.admin_settings (key, value, description)
VALUES 
  ('session_timeout_minutes', '60'::jsonb, 'Admin session inactivity timeout in minutes'),
  ('backup_retention_days', '30'::jsonb, 'Automatic backup retention period')
ON CONFLICT (key) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 4. Activity Logs (Audit Trail)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admin_activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  admin_email TEXT NOT NULL,
  action TEXT NOT NULL, -- 'login', 'logout', 'create', 'update', 'delete', 'publish', 'unpublish', 'backup_export', 'backup_restore', 'reset_defaults', 'settings_update'
  module TEXT NOT NULL, -- 'blogs', 'reviews', 'works', 'services', 'process', 'faqs', 'site_numbers', 'settings', 'auth'
  record_id TEXT,
  record_title TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb, -- Safe metadata (e.g. diff, counts). Never passwords or tokens.
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_activity_logs_created ON public.admin_activity_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_logs_module ON public.admin_activity_logs(module);
CREATE INDEX IF NOT EXISTS idx_activity_logs_admin ON public.admin_activity_logs(admin_id);

-- ----------------------------------------------------------------------------
-- 5. Module 1: Blogs (Articles & Insights)
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
-- 6. Module 2: Client Reviews (Text Testimonials)
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
-- 7. Module 3: Video Reviews
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
-- 8. Module 4: Our Works (Portfolio Case Studies)
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
-- 9. Module 5: Services (With Zero-Pricing Architecture)
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
-- 10. Module 6: Our Process (Step-by-step Timeline)
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
-- 11. Module 7: FAQs
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
-- 12. Module 8: Site Numbers / Statistics
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

-- ----------------------------------------------------------------------------
-- 13. High-Performance Dashboard & Sidebar Statistics Function
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_admin_dashboard_counts()
RETURNS JSONB AS $$
DECLARE
  counts JSONB;
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Unauthorized: Access restricted to administrators';
  END IF;

  SELECT jsonb_build_object(
    'blogs_total', (SELECT COUNT(*) FROM public.blogs),
    'blogs_published', (SELECT COUNT(*) FROM public.blogs WHERE status = 'published'),
    'blogs_draft', (SELECT COUNT(*) FROM public.blogs WHERE status = 'draft'),
    'works_total', (SELECT COUNT(*) FROM public.works),
    'works_visible', (SELECT COUNT(*) FROM public.works WHERE is_visible = true),
    'services_total', (SELECT COUNT(*) FROM public.services),
    'services_visible', (SELECT COUNT(*) FROM public.services WHERE is_visible = true),
    'reviews_total', (SELECT COUNT(*) FROM public.reviews),
    'reviews_visible', (SELECT COUNT(*) FROM public.reviews WHERE is_visible = true),
    'video_reviews_total', (SELECT COUNT(*) FROM public.video_reviews),
    'video_reviews_visible', (SELECT COUNT(*) FROM public.video_reviews WHERE is_visible = true),
    'process_total', (SELECT COUNT(*) FROM public.process_steps),
    'process_visible', (SELECT COUNT(*) FROM public.process_steps WHERE is_visible = true),
    'faqs_total', (SELECT COUNT(*) FROM public.faqs),
    'faqs_visible', (SELECT COUNT(*) FROM public.faqs WHERE is_visible = true),
    'site_numbers_total', (SELECT COUNT(*) FROM public.site_numbers),
    'site_numbers_visible', (SELECT COUNT(*) FROM public.site_numbers WHERE is_visible = true)
  ) INTO counts;

  RETURN counts;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 14. Row Level Security (RLS) Enablement & Policies
-- ============================================================================

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_activity_logs ENABLE ROW LEVEL SECURITY;
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

CREATE POLICY "Owners can insert or update admin users"
  ON public.admin_users
  FOR ALL
  TO authenticated
  USING (public.is_owner() OR auth.uid() = id)
  WITH CHECK (public.is_owner() OR auth.uid() = id);

-- ----------------------------------------------------------------------------
-- Policies for admin_settings
-- ----------------------------------------------------------------------------
CREATE POLICY "Admins can view settings"
  ON public.admin_settings
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "Admins can update settings"
  ON public.admin_settings
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ----------------------------------------------------------------------------
-- Policies for admin_activity_logs (Append-Only Immutable Audit Trail)
-- ----------------------------------------------------------------------------
CREATE POLICY "Admins can view activity logs"
  ON public.admin_activity_logs
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "Admins can insert activity logs"
  ON public.admin_activity_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

-- Note: No UPDATE or DELETE policies are defined for admin_activity_logs,
-- ensuring logs remain strictly immutable and tamper-resistant.

-- ----------------------------------------------------------------------------
-- Policies for blogs
-- ----------------------------------------------------------------------------
CREATE POLICY "Public can view published blogs"
  ON public.blogs
  FOR SELECT
  TO anon, authenticated
  USING (status = 'published');

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
