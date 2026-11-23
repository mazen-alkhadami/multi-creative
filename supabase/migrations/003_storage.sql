-- ==============================================================================
-- MULTI CREATIVES — Supabase Migration 003: Storage Buckets & Policies
-- Description: Public storage buckets and access policies for media assets
-- ==============================================================================

-- 1. Create Public Storage Buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  (
    'portfolio-images',
    'portfolio-images',
    true,
    10485760, -- 10MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif']
  ),
  (
    'service-images',
    'service-images',
    true,
    10485760, -- 10MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif']
  )
ON CONFLICT (id) DO UPDATE
SET public = true,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 2. Storage Objects Row Level Security Policies
-- Public can view/download images from portfolio-images and service-images
DROP POLICY IF EXISTS "Public can view portfolio and service images" ON storage.objects;
CREATE POLICY "Public can view portfolio and service images"
  ON storage.objects FOR SELECT
  USING (bucket_id IN ('portfolio-images', 'service-images'));

-- Active editors and admins can upload media
DROP POLICY IF EXISTS "Active editors can upload portfolio and service images" ON storage.objects;
CREATE POLICY "Active editors can upload portfolio and service images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id IN ('portfolio-images', 'service-images')
    AND public.is_active_editor()
  );

-- Active editors and admins can update media
DROP POLICY IF EXISTS "Active editors can update portfolio and service images" ON storage.objects;
CREATE POLICY "Active editors can update portfolio and service images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id IN ('portfolio-images', 'service-images')
    AND public.is_active_editor()
  )
  WITH CHECK (
    bucket_id IN ('portfolio-images', 'service-images')
    AND public.is_active_editor()
  );

-- Active editors and admins can delete media
DROP POLICY IF EXISTS "Active editors can delete portfolio and service images" ON storage.objects;
CREATE POLICY "Active editors can delete portfolio and service images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id IN ('portfolio-images', 'service-images')
    AND public.is_active_editor()
  );
