import { createClient as createBrowserClient } from "@/lib/supabase/client";
import { portfolioData, PortfolioItem } from "@/data/portfolioData";

export interface DbProject {
  id: string;
  slug: string;
  number: string;
  title_ar: string;
  title_en: string;
  summary_ar: string;
  summary_en: string;
  description_ar?: string | null;
  description_en?: string | null;
  challenge_ar?: string | null;
  challenge_en?: string | null;
  solution_ar?: string | null;
  solution_en?: string | null;
  result_ar?: string | null;
  result_en?: string | null;
  deliverables?: Array<{ ar: string; en: string }> | null;
  tools?: string[] | null;
  cover_image: string;
  gallery?: string[] | null;
  preview_url?: string | null;
  status: "draft" | "published" | "hidden";
  is_concept: boolean;
  year: string;
  created_at: string;
  updated_at?: string;
}

export interface ProjectLinkedService {
  id: string;
  slug: string;
  title_ar: string;
  title_en: string;
  is_primary: boolean;
}

export interface DbProjectWithServices extends DbProject {
  services: ProjectLinkedService[];
}

export interface ExtendedPortfolioItem extends PortfolioItem {
  id?: string;
  result?: { ar: string; en: string };
  serviceSlugs?: string[];
  dbStatus?: "draft" | "published" | "hidden";
}

interface RawProjectService {
  is_primary: boolean;
  services: {
    id: string;
    slug: string;
    title_ar: string;
    title_en: string;
  } | null;
}

interface RawProjectRecord extends DbProject {
  project_services?: RawProjectService[] | null;
}

/**
 * Transforms a Supabase project record into the frontend PortfolioItem shape.
 */
export function transformDbProjectToItem(
  db: DbProjectWithServices
): ExtendedPortfolioItem {
  const primaryService =
    db.services?.find((s) => s.is_primary) || db.services?.[0];

  const categorySlug = primaryService?.slug || "general";
  const categoryTitleAr = primaryService?.title_ar || "مشروع عام";
  const categoryTitleEn = primaryService?.title_en || "General Project";

  const allServiceSlugs = (db.services || []).map((s) => s.slug);

  // Directly resolve cover_image from DB row, falling back to safe placeholder
  const effectiveCover = db.cover_image?.trim() || "/images/portfolio/coffee-web.svg";
  const rawGallery = Array.isArray(db.gallery) && db.gallery.length > 0
    ? db.gallery.filter((g): g is string => typeof g === "string" && Boolean(g.trim()))
    : [effectiveCover];

  // Guarantee that effectiveCover is the primary image at index 0 for sliders & cards
  const finalGallery = rawGallery.includes(effectiveCover)
    ? [effectiveCover, ...rawGallery.filter((img) => img !== effectiveCover)]
    : [effectiveCover, ...rawGallery];

  return {
    id: db.id,
    slug: db.slug,
    number: db.number || "01",
    title: { ar: db.title_ar, en: db.title_en },
    category: categorySlug,
    categoryName: { ar: categoryTitleAr, en: categoryTitleEn },
    status: db.is_concept ? "concept" : "real",
    isConcept: db.is_concept ?? true,
    year: db.year || "2026",
    coverImage: effectiveCover,
    gallery: finalGallery,
    summary: { ar: db.summary_ar, en: db.summary_en },
    challenge: { ar: db.challenge_ar || "", en: db.challenge_en || "" },
    solution: { ar: db.solution_ar || "", en: db.solution_en || "" },
    result: db.result_ar || db.result_en ? { ar: db.result_ar || "", en: db.result_en || "" } : undefined,
    deliverables: Array.isArray(db.deliverables) ? db.deliverables : [],
    tools: Array.isArray(db.tools) ? db.tools : [],
    previewUrl: db.preview_url,
    serviceSlugs: allServiceSlugs,
    dbStatus: db.status,
  };
}

/**
 * Fetches all published projects for public display.
 * Falls back to local baseline portfolioData if offline or empty.
 */
export async function getPublicProjects(): Promise<ExtendedPortfolioItem[]> {
  try {
    const supabase = createBrowserClient();

    // Query published projects
    const { data: projects, error } = await supabase
      .from("projects")
      .select(`
        id,
        slug,
        number,
        title_ar,
        title_en,
        summary_ar,
        summary_en,
        challenge_ar,
        challenge_en,
        solution_ar,
        solution_en,
        result_ar,
        result_en,
        deliverables,
        tools,
        cover_image,
        gallery,
        preview_url,
        status,
        is_concept,
        year,
        created_at,
        project_services (
          is_primary,
          services (
            id,
            slug,
            title_ar,
            title_en
          )
        )
      `)
      .eq("status", "published")
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("[getPublicProjects] Supabase query failed, using baseline data:", error.message);
      return portfolioData;
    }

    if (!projects || projects.length === 0) {
      return portfolioData;
    }

    // Map joined project_services
    const mapped: ExtendedPortfolioItem[] = ((projects || []) as unknown as RawProjectRecord[]).map((p: RawProjectRecord) => {
      const services: ProjectLinkedService[] = (p.project_services || [])
        .map((ps: RawProjectService) => {
          if (!ps.services) return null;
          return {
            id: ps.services.id,
            slug: ps.services.slug,
            title_ar: ps.services.title_ar,
            title_en: ps.services.title_en,
            is_primary: Boolean(ps.is_primary),
          };
        })
        .filter(Boolean) as ProjectLinkedService[];

      const dbWithServices: DbProjectWithServices = {
        ...p,
        services,
      };

      return transformDbProjectToItem(dbWithServices);
    });

    return mapped;
  } catch (err) {
    console.warn("[getPublicProjects] Exception encountered, fallback to portfolioData:", err);
    return portfolioData;
  }
}

/**
 * Fetches a single published project by its unique slug.
 */
export async function getPublicProjectBySlug(
  slug: string
): Promise<ExtendedPortfolioItem | null> {
  try {
    const supabase = createBrowserClient();

    const { data: project, error } = await supabase
      .from("projects")
      .select(`
        id,
        slug,
        number,
        title_ar,
        title_en,
        summary_ar,
        summary_en,
        description_ar,
        description_en,
        challenge_ar,
        challenge_en,
        solution_ar,
        solution_en,
        result_ar,
        result_en,
        deliverables,
        tools,
        cover_image,
        gallery,
        preview_url,
        status,
        is_concept,
        year,
        created_at,
        project_services (
          is_primary,
          services (
            id,
            slug,
            title_ar,
            title_en
          )
        )
      `)
      .eq("slug", slug)
      .maybeSingle();

    if (error) {
      console.warn(`[getPublicProjectBySlug] Supabase query error for slug "${slug}":`, error.message);
      const fallback = portfolioData.find((p) => p.slug === slug);
      return fallback || null;
    }

    if (!project) {
      // Check baseline portfolioData
      const fallback = portfolioData.find((p) => p.slug === slug);
      return fallback || null;
    }

    // If project is not published (draft or hidden), hide from visitors
    if (project.status !== "published") {
      return null;
    }

    const rawProj = project as unknown as RawProjectRecord;
    const services: ProjectLinkedService[] = (rawProj.project_services || [])
      .map((ps: RawProjectService) => {
        if (!ps.services) return null;
        return {
          id: ps.services.id,
          slug: ps.services.slug,
          title_ar: ps.services.title_ar,
          title_en: ps.services.title_en,
          is_primary: Boolean(ps.is_primary),
        };
      })
      .filter(Boolean) as ProjectLinkedService[];

    const dbWithServices: DbProjectWithServices = {
      ...rawProj,
      services,
    };

    return transformDbProjectToItem(dbWithServices);
  } catch (err) {
    console.warn(`[getPublicProjectBySlug] Exception for "${slug}":`, err);
    const fallback = portfolioData.find((p) => p.slug === slug);
    return fallback || null;
  }
}
