-- ============================================================================
-- Migration: 20261030000003_works_features_highlights_results.sql
-- Description: Upgrade public.works table with structured content fields:
--              overview, features, highlights, results_list
-- ============================================================================

-- 1. Add structured content columns to public.works
ALTER TABLE public.works
  ADD COLUMN IF NOT EXISTS overview TEXT,
  ADD COLUMN IF NOT EXISTS features TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS highlights TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS results_list TEXT[] NOT NULL DEFAULT '{}';

-- 2. Document columns
COMMENT ON COLUMN public.works.overview IS 'Detailed project overview / narrative';
COMMENT ON COLUMN public.works.features IS 'Key project features and deliverables list';
COMMENT ON COLUMN public.works.highlights IS 'Design highlights and visual architecture';
COMMENT ON COLUMN public.works.results_list IS 'Client outcomes and project results list';
