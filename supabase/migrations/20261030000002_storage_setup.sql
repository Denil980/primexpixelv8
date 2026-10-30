-- ============================================================================
-- Migration: 20261030000002_storage_setup.sql
-- Project: PrimeXPixel (pgsbmsznteaaynzidmvf)
-- Description: Provision 'primexpixel-media' Supabase Storage bucket
--              and configure public-read + admin-write RLS security policies.
-- ============================================================================

-- 1. Create or update the public storage bucket for PrimeXPixel website assets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'primexpixel-media',
  'primexpixel-media',
  true,
  52428800, -- 50 MB max file size limit
  ARRAY[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/svg+xml',
    'video/mp4',
    'video/webm',
    'video/quicktime'
  ]::text[]
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 52428800,
  allowed_mime_types = ARRAY[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/svg+xml',
    'video/mp4',
    'video/webm',
    'video/quicktime'
  ]::text[];

-- 2. Public Read Access: Anyone (including unauthenticated website visitors) can view media
DROP POLICY IF EXISTS "Public media read access" ON storage.objects;
CREATE POLICY "Public media read access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'primexpixel-media');

-- 3. Admin Upload Policy: Only verified active admins/owners can insert files
DROP POLICY IF EXISTS "Admin upload media" ON storage.objects;
CREATE POLICY "Admin upload media"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'primexpixel-media'
  AND public.is_admin()
);

-- 4. Admin Update / Replace Policy: Only verified active admins/owners can update files
DROP POLICY IF EXISTS "Admin update media" ON storage.objects;
CREATE POLICY "Admin update media"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'primexpixel-media'
  AND public.is_admin()
)
WITH CHECK (
  bucket_id = 'primexpixel-media'
  AND public.is_admin()
);

-- 5. Admin Delete Policy: Only verified active admins/owners can delete files
DROP POLICY IF EXISTS "Admin delete media" ON storage.objects;
CREATE POLICY "Admin delete media"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'primexpixel-media'
  AND public.is_admin()
);
