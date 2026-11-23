import { createClient as createBrowserClient } from "@/lib/supabase/client";
import { servicesData, ServiceItem } from "@/data/servicesData";
import { ExtendedPortfolioItem, transformDbProjectToItem } from "@/lib/data/projects";

export interface DbService {
  id: string;
  slug: string;
  number: string;
  title_ar: string;
  title_en: string;
  tagline_ar?: string | null;
  tagline_en?: string | null;
  short_description_ar: string;
  short_description_en: string;
  overview_ar: string;
  overview_en: string;
  key_metrics?: Array<{ value: string; label: { ar: string; en: string } }> | null;
  deliverables?: Array<{ title: { ar: string; en: string }; desc: { ar: string; en: string } }> | null;
  process?: Array<{ step: string; title: { ar: string; en: string }; desc: { ar: string; en: string } }> | null;
  tech_stack?: string[] | null;
  gallery?: Array<{ title: { ar: string; en: string }; desc: { ar: string; en: string }; image: string; tag: { ar: string; en: string } }> | null;
  is_visible: boolean;
  sort_order: number;
  created_at: string;
  updated_at?: string;
}

/**
 * Transforms a Supabase service row into the frontend ServiceItem shape.
 */
export function transformDbServiceToItem(db: DbService): ServiceItem {
  // Ensure gallery has at least one valid item
  const gallery =
    Array.isArray(db.gallery) && db.gallery.length > 0
      ? db.gallery
      : [
          {
            title: { ar: db.title_ar, en: db.title_en },
            desc: { ar: db.tagline_ar || "", en: db.tagline_en || "" },
            image: `/images/services/${db.slug}.svg`,
            tag: { ar: "خدمة رئيسية", en: "Core Service" },
          },
        ];

  return {
    slug: db.slug,
    number: db.number || "01",
    title: { ar: db.title_ar, en: db.title_en },
    tagline: { ar: db.tagline_ar || "", en: db.tagline_en || "" },
    shortDescription: { ar: db.short_description_ar, en: db.short_description_en },
    overview: { ar: db.overview_ar, en: db.overview_en },
    keyMetrics: Array.isArray(db.key_metrics) ? db.key_metrics : [],
    deliverables: Array.isArray(db.deliverables) ? db.deliverables : [],
    process: Array.isArray(db.process) ? db.process : [],
    techStack: Array.isArray(db.tech_stack) ? db.tech_stack : [],
    gallery,
  };
}

/**
 * Fetches all active visible services for public display.
 * Falls back to baseline servicesData if Supabase is offline or empty.
 */
export async function getPublicServices(): Promise<ServiceItem[]> {
  try {
    const supabase = createBrowserClient();

    const { data: services, error } = await supabase
      .from("services")
      .select("*")
      .eq("is_visible", true)
      .order("sort_order", { ascending: true });

    if (error) {
      console.warn("[getPublicServices] Supabase query failed, fallback to baseline:", error.message);
      return servicesData;
    }

    if (!services || services.length === 0) {
      return servicesData;
    }

    return (services as DbService[]).map(transformDbServiceToItem);
  } catch (err) {
    console.warn("[getPublicServices] Exception encountered, fallback to servicesData:", err);
    return servicesData;
  }
}

export interface PublicServiceDetailResult {
  service: ServiceItem;
  relatedProjects: ExtendedPortfolioItem[];
  prevService?: ServiceItem | null;
  nextService?: ServiceItem | null;
}

/**
 * Fetches a single visible service by its unique slug, including linked published projects.
 */
export async function getPublicServiceBySlug(
  slug: string
): Promise<PublicServiceDetailResult | null> {
  try {
    const supabase = createBrowserClient();

    // Query all visible services to establish ordering for Prev/Next
    const { data: allServices, error: allErr } = await supabase
      .from("services")
      .select("*")
      .eq("is_visible", true)
      .order("sort_order", { ascending: true });

    const servicesList: ServiceItem[] =
      !allErr && allServices && allServices.length > 0
        ? (allServices as DbService[]).map(transformDbServiceToItem)
        : servicesData;

    const currentIndex = servicesList.findIndex((s) => s.slug === slug);
    if (currentIndex === -1) {
      // Check baseline
      const fallback = servicesData.find((s) => s.slug === slug);
      if (!fallback) return null;
      return {
        service: fallback,
        relatedProjects: [],
      };
    }

    const currentService = servicesList[currentIndex];
    const prevService =
      servicesList[(currentIndex - 1 + servicesList.length) % servicesList.length];
    const nextService = servicesList[(currentIndex + 1) % servicesList.length];

    // Query published projects linked to this service
    let relatedProjects: ExtendedPortfolioItem[] = [];
    try {
      const { data: rawProjects, error: projErr } = await supabase
        .from("project_services")
        .select(`
          is_primary,
          projects (
            id,
            slug,
            number,
            title_ar,
            title_en,
            summary_ar,
            summary_en,
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
          ),
          services!inner (
            slug
          )
        `)
        .eq("services.slug", slug);

      interface RawProjectRow {
        projects?: (Record<string, unknown> & {
          status?: string;
          project_services?: Array<{
            is_primary?: boolean | null;
            services?: {
              id: string;
              slug: string;
              title_ar: string;
              title_en: string;
            } | null;
          }> | null;
        }) | null;
      }

      if (!projErr && rawProjects) {
        relatedProjects = (rawProjects as unknown as RawProjectRow[])
          .map((row) => {
            const p = row.projects;
            if (!p || p.status !== "published") return null;

            const services = (p.project_services || [])
              .map((ps) => {
                if (!ps.services) return null;
                return {
                  id: ps.services.id,
                  slug: ps.services.slug,
                  title_ar: ps.services.title_ar,
                  title_en: ps.services.title_en,
                  is_primary: Boolean(ps.is_primary),
                };
              })
              .filter(Boolean);

            return transformDbProjectToItem({ ...p, services } as unknown as Parameters<typeof transformDbProjectToItem>[0]);
          })
          .filter((p): p is ExtendedPortfolioItem => p !== null);
      }
    } catch (pe) {
      console.warn("[getPublicServiceBySlug] Error fetching related projects:", pe);
    }

    return {
      service: currentService,
      relatedProjects,
      prevService,
      nextService,
    };
  } catch (err) {
    console.warn(`[getPublicServiceBySlug] Exception for "${slug}":`, err);
    const fallback = servicesData.find((s) => s.slug === slug);
    if (!fallback) return null;
    return {
      service: fallback,
      relatedProjects: [],
    };
  }
}
