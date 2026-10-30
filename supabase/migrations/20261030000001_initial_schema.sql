-- ============================================================================
-- PrimeXPixel Database Schema Migration
-- Migration: 20261030000001_initial_schema.sql
-- Description: Hardened Production Schema, Tamper-Resistant Audit Logs,
--              Concurrency-Safe Owner Protection, Validated Settings,
--              and Secure First-Owner Provisioning
-- Target: PostgreSQL 15+ / Supabase
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. UTILITY FUNCTIONS
-- ----------------------------------------------------------------------------

-- Automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

REVOKE ALL ON FUNCTION public.handle_updated_at() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.handle_updated_at() TO authenticated;

-- ----------------------------------------------------------------------------
-- 2. ADMIN PROFILES & ACCESS CONTROL
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('owner', 'admin', 'editor')),
  theme_preference TEXT NOT NULL DEFAULT 'system' CHECK (theme_preference IN ('dark', 'light', 'system')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS tr_admin_users_updated_at ON public.admin_users;
CREATE TRIGGER tr_admin_users_updated_at
  BEFORE UPDATE ON public.admin_users
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Helper: verify if requesting user is an authorized admin/owner
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated;

-- Helper: verify if requesting user has owner role
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

REVOKE ALL ON FUNCTION public.is_owner() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_owner() TO anon, authenticated;

-- Guard & Sync: Protect email, id, and role modifications while syncing email with auth.users
CREATE OR REPLACE FUNCTION public.sync_and_protect_admin_user()
RETURNS TRIGGER AS $$
DECLARE
  verified_auth_email TEXT;
BEGIN
  -- Synchronize email directly from trusted auth.users identity
  SELECT email INTO verified_auth_email FROM auth.users WHERE id = NEW.id;
  IF verified_auth_email IS NOT NULL THEN
    NEW.email := verified_auth_email;
  END IF;

  -- Guard modifications on UPDATE
  IF TG_OP = 'UPDATE' THEN
    IF NOT public.is_owner() THEN
      -- Non-owners cannot change role
      IF OLD.role IS DISTINCT FROM NEW.role THEN
        RAISE EXCEPTION 'Unauthorized: Non-owners cannot alter administrator role permissions.';
      END IF;
      -- Non-owners cannot change id or email identity
      IF OLD.id <> NEW.id OR OLD.email IS DISTINCT FROM NEW.email THEN
        RAISE EXCEPTION 'Unauthorized: Account ID and email identity cannot be altered directly.';
      END IF;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

DROP TRIGGER IF EXISTS tr_sync_and_protect_admin_user ON public.admin_users;
CREATE TRIGGER tr_sync_and_protect_admin_user
  BEFORE INSERT OR UPDATE ON public.admin_users
  FOR EACH ROW EXECUTE FUNCTION public.sync_and_protect_admin_user();

-- Guard: Concurrency-safe protection preventing removal or demotion of the last remaining owner
CREATE OR REPLACE FUNCTION public.protect_last_owner()
RETURNS TRIGGER AS $$
DECLARE
  owner_count INTEGER;
BEGIN
  IF (TG_OP = 'DELETE' AND OLD.role = 'owner') OR 
     (TG_OP = 'UPDATE' AND OLD.role = 'owner' AND NEW.role <> 'owner') THEN
    -- Serialize all owner demotion/deletion transactions using an exclusive transaction-scoped advisory lock.
    -- This guarantees zero race conditions where two concurrent requests could leave 0 owners.
    PERFORM pg_advisory_xact_lock(847291049281749201);
    
    SELECT COUNT(*) INTO owner_count FROM public.admin_users WHERE role = 'owner';
    
    IF owner_count <= 1 THEN
      RAISE EXCEPTION 'Operation rejected: Cannot delete or demote the only remaining owner account (concurrency-safe check).';
    END IF;
  END IF;

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

DROP TRIGGER IF EXISTS tr_protect_last_owner ON public.admin_users;
CREATE TRIGGER tr_protect_last_owner
  BEFORE UPDATE OR DELETE ON public.admin_users
  FOR EACH ROW EXECUTE FUNCTION public.protect_last_owner();

-- ----------------------------------------------------------------------------
-- 3. SECURE FIRST-OWNER BOOTSTRAP PROCEDURE
-- ----------------------------------------------------------------------------

-- Controlled, one-time server-side procedure to provision the initial owner.
-- Access is strictly revoked from PUBLIC, anon, and authenticated application roles.
-- It can ONLY be executed by a trusted database operator in the Supabase SQL Editor
-- or via service-role credentials.
CREATE OR REPLACE FUNCTION public.provision_initial_owner(
  target_user_id UUID,
  target_email TEXT,
  owner_full_name TEXT DEFAULT 'PrimeXPixel Owner'
)
RETURNS JSONB AS $$
DECLARE
  verified_auth_email TEXT;
  existing_count INTEGER;
  new_admin public.admin_users;
BEGIN
  -- 1. Check if an administrator or owner already exists (one-time execution guarantee)
  SELECT COUNT(*) INTO existing_count FROM public.admin_users;
  IF existing_count > 0 THEN
    RAISE EXCEPTION 'Bootstrap unavailable: An initial owner has already been provisioned for this system.';
  END IF;

  -- 2. Verify target identity against Supabase auth.users records
  SELECT email INTO verified_auth_email FROM auth.users WHERE id = target_user_id;
  IF verified_auth_email IS NULL THEN
    RAISE EXCEPTION 'User UID % not found in auth.users authentication records.', target_user_id;
  END IF;

  IF LOWER(verified_auth_email) <> LOWER(target_email) THEN
    RAISE EXCEPTION 'Provided email does not match verified auth.users record (expected %)', verified_auth_email;
  END IF;

  -- 3. Insert initial owner record
  INSERT INTO public.admin_users (id, email, full_name, role, theme_preference)
  VALUES (target_user_id, verified_auth_email, owner_full_name, 'owner', 'system')
  RETURNING * INTO new_admin;

  -- 4. Record tamper-proof audit log entry
  INSERT INTO public.admin_activity_logs (admin_id, admin_email, action, module, record_id, record_title, metadata)
  VALUES (
    target_user_id,
    verified_auth_email,
    'bootstrap_owner',
    'auth',
    target_user_id::text,
    verified_auth_email,
    jsonb_build_object('event', 'Initial owner account successfully provisioned via trusted operator procedure')
  );

  RETURN jsonb_build_object(
    'success', true,
    'message', 'Initial owner provisioned successfully',
    'email', verified_auth_email,
    'role', 'owner'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- Revoke execution from ALL client-facing roles (prevents browser/REST execution)
REVOKE ALL ON FUNCTION public.provision_initial_owner(UUID, TEXT, TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.provision_initial_owner(UUID, TEXT, TEXT) TO service_role;

-- ----------------------------------------------------------------------------
-- 4. SYSTEM & ADMIN SETTINGS
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.admin_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  description TEXT,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Validation trigger for admin settings
CREATE OR REPLACE FUNCTION public.validate_admin_settings()
RETURNS TRIGGER AS $$
DECLARE
  timeout_val NUMERIC;
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Unauthorized: Only administrators can modify system settings.';
  END IF;

  IF NEW.key = 'session_timeout_minutes' THEN
    -- Validate that value is not null and is a valid JSON number
    IF NEW.value IS NULL OR jsonb_typeof(NEW.value) <> 'number' THEN
      RAISE EXCEPTION 'Invalid session timeout: Value must be a valid numeric JSON value.';
    END IF;

    timeout_val := (NEW.value)::text::numeric;
    IF timeout_val < 5 OR timeout_val > 1440 THEN
      RAISE EXCEPTION 'Session timeout out of bounds: Must be between 5 and 1440 minutes (24 hours).';
    END IF;
  END IF;

  NEW.updated_by := auth.uid();
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

DROP TRIGGER IF EXISTS tr_validate_admin_settings ON public.admin_settings;
CREATE TRIGGER tr_validate_admin_settings
  BEFORE INSERT OR UPDATE ON public.admin_settings
  FOR EACH ROW EXECUTE FUNCTION public.validate_admin_settings();

-- Seed default settings
INSERT INTO public.admin_settings (key, value, description)
VALUES 
  ('session_timeout_minutes', '60'::jsonb, 'Admin session inactivity timeout in minutes'),
  ('backup_retention_days', '30'::jsonb, 'Automatic backup retention period')
ON CONFLICT (key) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 5. ACTIVITY LOGS (Immutable Audit Trail)
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.admin_activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  admin_email TEXT NOT NULL,
  action TEXT NOT NULL,
  module TEXT NOT NULL,
  record_id TEXT,
  record_title TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_activity_logs_created ON public.admin_activity_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_logs_module ON public.admin_activity_logs(module);
CREATE INDEX IF NOT EXISTS idx_activity_logs_admin ON public.admin_activity_logs(admin_id);

-- Enforce unforgeable audit logging: stamps caller's verified auth identity from auth.users
CREATE OR REPLACE FUNCTION public.stamp_activity_log()
RETURNS TRIGGER AS $$
DECLARE
  trusted_email TEXT;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Audit error: Unauthorized activity log attempt without valid auth identity.';
  END IF;

  NEW.admin_id := auth.uid();

  -- Obtain verified email directly from auth.users, never editable profile
  SELECT email INTO trusted_email FROM auth.users WHERE id = auth.uid();
  IF trusted_email IS NULL THEN
    trusted_email := COALESCE(auth.jwt() ->> 'email', 'authenticated_user');
  END IF;

  NEW.admin_email := trusted_email;
  NEW.created_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

DROP TRIGGER IF EXISTS tr_stamp_activity_log ON public.admin_activity_logs;
CREATE TRIGGER tr_stamp_activity_log
  BEFORE INSERT ON public.admin_activity_logs
  FOR EACH ROW EXECUTE FUNCTION public.stamp_activity_log();

-- ----------------------------------------------------------------------------
-- 6. MODULE 1: BLOGS
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

DROP TRIGGER IF EXISTS tr_blogs_updated_at ON public.blogs;
CREATE TRIGGER tr_blogs_updated_at
  BEFORE UPDATE ON public.blogs
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ----------------------------------------------------------------------------
-- 7. MODULE 2: CLIENT REVIEWS (TEXT)
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

DROP TRIGGER IF EXISTS tr_reviews_updated_at ON public.reviews;
CREATE TRIGGER tr_reviews_updated_at
  BEFORE UPDATE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ----------------------------------------------------------------------------
-- 8. MODULE 3: VIDEO REVIEWS
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

DROP TRIGGER IF EXISTS tr_video_reviews_updated_at ON public.video_reviews;
CREATE TRIGGER tr_video_reviews_updated_at
  BEFORE UPDATE ON public.video_reviews
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ----------------------------------------------------------------------------
-- 9. MODULE 4: OUR WORKS (PORTFOLIO)
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

DROP TRIGGER IF EXISTS tr_works_updated_at ON public.works;
CREATE TRIGGER tr_works_updated_at
  BEFORE UPDATE ON public.works
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ----------------------------------------------------------------------------
-- 10. MODULE 5: SERVICES (STRICT ZERO-PRICING)
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

DROP TRIGGER IF EXISTS tr_services_updated_at ON public.services;
CREATE TRIGGER tr_services_updated_at
  BEFORE UPDATE ON public.services
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ----------------------------------------------------------------------------
-- 11. MODULE 6: OUR PROCESS
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

DROP TRIGGER IF EXISTS tr_process_steps_updated_at ON public.process_steps;
CREATE TRIGGER tr_process_steps_updated_at
  BEFORE UPDATE ON public.process_steps
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ----------------------------------------------------------------------------
-- 12. MODULE 7: FAQS
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

DROP TRIGGER IF EXISTS tr_faqs_updated_at ON public.faqs;
CREATE TRIGGER tr_faqs_updated_at
  BEFORE UPDATE ON public.faqs
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ----------------------------------------------------------------------------
-- 13. MODULE 8: SITE NUMBERS / STATISTICS
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

DROP TRIGGER IF EXISTS tr_site_numbers_updated_at ON public.site_numbers;
CREATE TRIGGER tr_site_numbers_updated_at
  BEFORE UPDATE ON public.site_numbers
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ----------------------------------------------------------------------------
-- 14. DASHBOARD & SIDEBAR AGGREGATE FUNCTION
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

REVOKE ALL ON FUNCTION public.get_admin_dashboard_counts() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_admin_dashboard_counts() TO authenticated;

-- ============================================================================
-- 15. ROW LEVEL SECURITY (RLS) POLICIES
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
-- Policies: admin_users
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Admins can view admin list" ON public.admin_users;
CREATE POLICY "Admins can view admin list"
  ON public.admin_users
  FOR SELECT
  TO authenticated
  USING (public.is_admin() OR auth.uid() = id);

-- Owner management: only authenticated owners can insert new admin accounts
DROP POLICY IF EXISTS "Owners can add admin users" ON public.admin_users;
CREATE POLICY "Owners can add admin users"
  ON public.admin_users
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_owner());

-- Profile updates: owners can update any profile; users can update their own permitted fields
DROP POLICY IF EXISTS "Owners and self can update profile" ON public.admin_users;
CREATE POLICY "Owners and self can update profile"
  ON public.admin_users
  FOR UPDATE
  TO authenticated
  USING (public.is_owner() OR auth.uid() = id)
  WITH CHECK (public.is_owner() OR auth.uid() = id);

-- Deletion: only owners can delete admins (and protect_last_owner protects the last)
DROP POLICY IF EXISTS "Owners can delete admin users" ON public.admin_users;
CREATE POLICY "Owners can delete admin users"
  ON public.admin_users
  FOR DELETE
  TO authenticated
  USING (public.is_owner());

-- ----------------------------------------------------------------------------
-- Policies: admin_settings
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Admins can view settings" ON public.admin_settings;
CREATE POLICY "Admins can view settings"
  ON public.admin_settings
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "Owners can insert settings" ON public.admin_settings;
CREATE POLICY "Owners can insert settings"
  ON public.admin_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_owner());

DROP POLICY IF EXISTS "Admins can update settings" ON public.admin_settings;
CREATE POLICY "Admins can update settings"
  ON public.admin_settings
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Owners can delete settings" ON public.admin_settings;
CREATE POLICY "Owners can delete settings"
  ON public.admin_settings
  FOR DELETE
  TO authenticated
  USING (public.is_owner());

-- ----------------------------------------------------------------------------
-- Policies: admin_activity_logs (Append-Only Immutable Audit Trail)
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Admins can view activity logs" ON public.admin_activity_logs;
CREATE POLICY "Admins can view activity logs"
  ON public.admin_activity_logs
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can insert activity logs" ON public.admin_activity_logs;
CREATE POLICY "Admins can insert activity logs"
  ON public.admin_activity_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

-- Explicitly no UPDATE or DELETE policies exist for admin_activity_logs

-- ----------------------------------------------------------------------------
-- Policies: blogs
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public can view published blogs" ON public.blogs;
CREATE POLICY "Public can view published blogs"
  ON public.blogs
  FOR SELECT
  TO anon, authenticated
  USING (status = 'published');

DROP POLICY IF EXISTS "Admins have full access to blogs" ON public.blogs;
CREATE POLICY "Admins have full access to blogs"
  ON public.blogs
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ----------------------------------------------------------------------------
-- Policies: reviews
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public can view visible reviews" ON public.reviews;
CREATE POLICY "Public can view visible reviews"
  ON public.reviews
  FOR SELECT
  TO anon, authenticated
  USING (is_visible = true);

DROP POLICY IF EXISTS "Admins have full access to reviews" ON public.reviews;
CREATE POLICY "Admins have full access to reviews"
  ON public.reviews
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ----------------------------------------------------------------------------
-- Policies: video_reviews
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public can view visible video reviews" ON public.video_reviews;
CREATE POLICY "Public can view visible video reviews"
  ON public.video_reviews
  FOR SELECT
  TO anon, authenticated
  USING (is_visible = true);

DROP POLICY IF EXISTS "Admins have full access to video reviews" ON public.video_reviews;
CREATE POLICY "Admins have full access to video reviews"
  ON public.video_reviews
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ----------------------------------------------------------------------------
-- Policies: works
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public can view visible works" ON public.works;
CREATE POLICY "Public can view visible works"
  ON public.works
  FOR SELECT
  TO anon, authenticated
  USING (is_visible = true);

DROP POLICY IF EXISTS "Admins have full access to works" ON public.works;
CREATE POLICY "Admins have full access to works"
  ON public.works
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ----------------------------------------------------------------------------
-- Policies: services
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public can view visible services" ON public.services;
CREATE POLICY "Public can view visible services"
  ON public.services
  FOR SELECT
  TO anon, authenticated
  USING (is_visible = true);

DROP POLICY IF EXISTS "Admins have full access to services" ON public.services;
CREATE POLICY "Admins have full access to services"
  ON public.services
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ----------------------------------------------------------------------------
-- Policies: process_steps
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public can view visible process steps" ON public.process_steps;
CREATE POLICY "Public can view visible process steps"
  ON public.process_steps
  FOR SELECT
  TO anon, authenticated
  USING (is_visible = true);

DROP POLICY IF EXISTS "Admins have full access to process steps" ON public.process_steps;
CREATE POLICY "Admins have full access to process steps"
  ON public.process_steps
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ----------------------------------------------------------------------------
-- Policies: faqs
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public can view visible faqs" ON public.faqs;
CREATE POLICY "Public can view visible faqs"
  ON public.faqs
  FOR SELECT
  TO anon, authenticated
  USING (is_visible = true);

DROP POLICY IF EXISTS "Admins have full access to faqs" ON public.faqs;
CREATE POLICY "Admins have full access to faqs"
  ON public.faqs
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ----------------------------------------------------------------------------
-- Policies: site_numbers
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public can view visible site numbers" ON public.site_numbers;
CREATE POLICY "Public can view visible site numbers"
  ON public.site_numbers
  FOR SELECT
  TO anon, authenticated
  USING (is_visible = true);

DROP POLICY IF EXISTS "Admins have full access to site numbers" ON public.site_numbers;
CREATE POLICY "Admins have full access to site numbers"
  ON public.site_numbers
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================================================
-- 16. TABLE-LEVEL PERMISSION HARDENING (GRANT & REVOKE)
-- ============================================================================

-- Administrative tables: revoke public/anon access entirely
REVOKE ALL ON TABLE public.admin_users FROM PUBLIC, anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.admin_users TO authenticated;

REVOKE ALL ON TABLE public.admin_settings FROM PUBLIC, anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.admin_settings TO authenticated;

-- Activity logs: strictly revoke UPDATE, DELETE, TRUNCATE from ALL roles
REVOKE ALL ON TABLE public.admin_activity_logs FROM PUBLIC, anon;
REVOKE UPDATE, DELETE, TRUNCATE ON TABLE public.admin_activity_logs FROM authenticated;
GRANT SELECT, INSERT ON TABLE public.admin_activity_logs TO authenticated;

-- Public content tables: grant read to public/anon; write only to authenticated (governed by RLS)
GRANT SELECT ON TABLE public.blogs TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON TABLE public.blogs TO authenticated;
REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON TABLE public.blogs FROM anon, PUBLIC;

GRANT SELECT ON TABLE public.reviews TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON TABLE public.reviews TO authenticated;
REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON TABLE public.reviews FROM anon, PUBLIC;

GRANT SELECT ON TABLE public.video_reviews TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON TABLE public.video_reviews TO authenticated;
REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON TABLE public.video_reviews FROM anon, PUBLIC;

GRANT SELECT ON TABLE public.works TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON TABLE public.works TO authenticated;
REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON TABLE public.works FROM anon, PUBLIC;

GRANT SELECT ON TABLE public.services TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON TABLE public.services TO authenticated;
REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON TABLE public.services FROM anon, PUBLIC;

GRANT SELECT ON TABLE public.process_steps TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON TABLE public.process_steps TO authenticated;
REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON TABLE public.process_steps FROM anon, PUBLIC;

GRANT SELECT ON TABLE public.faqs TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON TABLE public.faqs TO authenticated;
REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON TABLE public.faqs FROM anon, PUBLIC;

GRANT SELECT ON TABLE public.site_numbers TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON TABLE public.site_numbers TO authenticated;
REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON TABLE public.site_numbers FROM anon, PUBLIC;
