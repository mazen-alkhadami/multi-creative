-- ==============================================================================
-- MULTI CREATIVES — Supabase Migration 002: Row Level Security (RLS) & Permissions
-- Description: Access control matrices, security definer functions, and grants
-- ==============================================================================

-- 0. Schema & Table Grants (Required by Postgres before RLS evaluation)
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO anon, authenticated, service_role;

-- 1. Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integration_versions ENABLE ROW LEVEL SECURITY;

-- 2. Security Definer Helper Functions (Immune to Infinite Recursion)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
      AND role = 'admin'
      AND is_active = true
  );
$$;

CREATE OR REPLACE FUNCTION public.is_active_editor()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
      AND role IN ('admin', 'editor')
      AND is_active = true
  );
$$;

ALTER FUNCTION public.is_admin() OWNER TO postgres;
ALTER FUNCTION public.is_active_editor() OWNER TO postgres;
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.is_active_editor() TO anon, authenticated, service_role;

-- 3. Profiles Policies (Separated to eliminate circular recursion)
DROP POLICY IF EXISTS "Users can view own profile or admins view all" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users update own profile or admins update any" ON public.profiles;
DROP POLICY IF EXISTS "Users update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins update any profile" ON public.profiles;
DROP POLICY IF EXISTS "Only admins can delete profiles" ON public.profiles;

-- Authenticated users can view their own profile directly (No function call, No recursion)
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- Users can update their own profile details
CREATE POLICY "Users update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Admins can update any profile
CREATE POLICY "Admins update any profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Only admins can delete profiles
CREATE POLICY "Only admins can delete profiles"
  ON public.profiles FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- 4. Services Policies
DROP POLICY IF EXISTS "Public can view visible services" ON public.services;
CREATE POLICY "Public can view visible services"
  ON public.services FOR SELECT
  USING (is_visible = true OR public.is_active_editor());

DROP POLICY IF EXISTS "Active editors can insert services" ON public.services;
CREATE POLICY "Active editors can insert services"
  ON public.services FOR INSERT
  WITH CHECK (public.is_active_editor());

DROP POLICY IF EXISTS "Active editors can update services" ON public.services;
CREATE POLICY "Active editors can update services"
  ON public.services FOR UPDATE
  USING (public.is_active_editor())
  WITH CHECK (public.is_active_editor());

DROP POLICY IF EXISTS "Only admins can delete services" ON public.services;
CREATE POLICY "Only admins can delete services"
  ON public.services FOR DELETE
  USING (public.is_admin());

-- 5. Projects Policies
DROP POLICY IF EXISTS "Public can view published projects" ON public.projects;
CREATE POLICY "Public can view published projects"
  ON public.projects FOR SELECT
  USING (status = 'published' OR public.is_active_editor());

DROP POLICY IF EXISTS "Active editors can insert projects" ON public.projects;
CREATE POLICY "Active editors can insert projects"
  ON public.projects FOR INSERT
  WITH CHECK (public.is_active_editor());

DROP POLICY IF EXISTS "Active editors can update projects" ON public.projects;
CREATE POLICY "Active editors can update projects"
  ON public.projects FOR UPDATE
  USING (public.is_active_editor())
  WITH CHECK (public.is_active_editor());

DROP POLICY IF EXISTS "Only admins can delete projects" ON public.projects;
CREATE POLICY "Only admins can delete projects"
  ON public.projects FOR DELETE
  USING (public.is_admin());

-- 6. Project Services Policies
DROP POLICY IF EXISTS "Public can view published project services" ON public.project_services;
CREATE POLICY "Public can view published project services"
  ON public.project_services FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE projects.id = project_services.project_id
        AND projects.status = 'published'
    )
    OR public.is_active_editor()
  );

DROP POLICY IF EXISTS "Active editors can insert project services" ON public.project_services;
CREATE POLICY "Active editors can insert project services"
  ON public.project_services FOR INSERT
  WITH CHECK (public.is_active_editor());

DROP POLICY IF EXISTS "Active editors can update project services" ON public.project_services;
CREATE POLICY "Active editors can update project services"
  ON public.project_services FOR UPDATE
  USING (public.is_active_editor())
  WITH CHECK (public.is_active_editor());

DROP POLICY IF EXISTS "Only admins can delete project services" ON public.project_services;
CREATE POLICY "Only admins can delete project services"
  ON public.project_services FOR DELETE
  USING (public.is_admin());

-- 7. Integrations Policies
DROP POLICY IF EXISTS "Public can view active approved integrations" ON public.integrations;
CREATE POLICY "Public can view active approved integrations"
  ON public.integrations FOR SELECT
  USING ((is_active = true AND is_approved = true) OR public.is_admin());

DROP POLICY IF EXISTS "Admins can manage integrations" ON public.integrations;
CREATE POLICY "Admins can manage integrations"
  ON public.integrations FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 8. Integration Versions Policies
DROP POLICY IF EXISTS "Admins can manage integration versions" ON public.integration_versions;
CREATE POLICY "Admins can manage integration versions"
  ON public.integration_versions FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());
