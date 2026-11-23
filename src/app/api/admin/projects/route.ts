import { NextResponse, type NextRequest } from "next/server";
import { getCurrentAdminProfile } from "@/lib/auth/adminAuth";
import { createAdminClient } from "@/lib/supabase/admin";

interface ApiProjectServiceJoin {
  is_primary: boolean;
  services: {
    id: string;
    slug: string;
    title_ar: string;
    title_en: string;
  } | null;
}

interface ApiProjectRow {
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
  deliverables?: unknown;
  tools?: unknown;
  cover_image: string;
  gallery?: unknown;
  preview_url?: string | null;
  status: string;
  is_concept: boolean;
  year: string;
  created_at: string;
  updated_at?: string;
  project_services?: ApiProjectServiceJoin[] | null;
}

export async function GET() {
  try {
    const auth = await getCurrentAdminProfile();
    if (!auth.user || !auth.profile || auth.profile.is_active === false) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Active team membership required" },
        { status: 401 }
      );
    }

    const supabaseAdmin = createAdminClient();

    // Query all projects with joined services
    const { data: projects, error } = await supabaseAdmin
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
        updated_at,
        project_services (
          is_primary,
          service_id,
          services (
            id,
            slug,
            title_ar,
            title_en
          )
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[api/admin/projects] Fetch error:", error.message);
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    const formatted = ((projects || []) as unknown as ApiProjectRow[]).map(
      (p: ApiProjectRow) => {
        const services = (p.project_services || [])
          .map((ps: ApiProjectServiceJoin) => {
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

        return {
          ...p,
          services,
        };
      }
    );

    return NextResponse.json({
      success: true,
      projects: formatted,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error loading projects";
    console.error("[api/admin/projects] GET exception:", err);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await getCurrentAdminProfile();
    if (!auth.user || !auth.profile || auth.profile.is_active === false) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Active team membership required" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      title_ar,
      title_en,
      slug,
      number,
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
      primary_service_id,
      additional_service_ids,
    } = body || {};

    if (!title_ar || !title_en || !summary_ar || !summary_en) {
      return NextResponse.json(
        { success: false, error: "عناوين المشروع والوصف المختصر إلزامية باللغتين / Titles and summaries are required in both languages" },
        { status: 400 }
      );
    }

    if (!primary_service_id) {
      return NextResponse.json(
        { success: false, error: "اختيار الخدمة الرئيسية إلزامي / Primary service selection is required" },
        { status: 400 }
      );
    }

    // Auto-clean slug
    const cleanSlug = (slug || title_en)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const supabaseAdmin = createAdminClient();

    // 1. Insert into projects table
    const { data: project, error: insertError } = await supabaseAdmin
      .from("projects")
      .insert({
        title_ar: title_ar.trim(),
        title_en: title_en.trim(),
        slug: cleanSlug,
        number: number ? String(number).padStart(2, "0") : "01",
        summary_ar: summary_ar.trim(),
        summary_en: summary_en.trim(),
        description_ar: description_ar?.trim() || null,
        description_en: description_en?.trim() || null,
        challenge_ar: challenge_ar?.trim() || null,
        challenge_en: challenge_en?.trim() || null,
        solution_ar: solution_ar?.trim() || null,
        solution_en: solution_en?.trim() || null,
        result_ar: result_ar?.trim() || null,
        result_en: result_en?.trim() || null,
        deliverables: Array.isArray(deliverables) ? deliverables : [],
        tools: Array.isArray(tools) ? tools : [],
        cover_image: cover_image || "/images/portfolio/coffee-web.svg",
        gallery: Array.isArray(gallery) && gallery.length > 0 ? gallery : [cover_image || "/images/portfolio/coffee-web.svg"],
        preview_url: preview_url?.trim() || null,
        status: ["draft", "published", "hidden"].includes(status) ? status : "published",
        is_concept: typeof is_concept === "boolean" ? is_concept : true,
        year: year ? String(year).trim() : "2026",
        created_by: auth.user.id,
      })
      .select()
      .single();

    if (insertError) {
      console.error("[api/admin/projects] Insert project error:", insertError.message);
      return NextResponse.json({ success: false, error: insertError.message }, { status: 400 });
    }

    // 2. Link primary service and additional services in project_services
    const serviceLinks = [
      {
        project_id: project.id,
        service_id: primary_service_id,
        is_primary: true,
      },
    ];

    if (Array.isArray(additional_service_ids)) {
      for (const sId of additional_service_ids) {
        if (sId && sId !== primary_service_id) {
          serviceLinks.push({
            project_id: project.id,
            service_id: sId,
            is_primary: false,
          });
        }
      }
    }

    const { error: linkError } = await supabaseAdmin
      .from("project_services")
      .insert(serviceLinks);

    if (linkError) {
      console.warn("[api/admin/projects] Warning linking services:", linkError.message);
    }

    return NextResponse.json({
      success: true,
      project,
      message: "تم إنشاء المشروع بنجاح / Project created successfully",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error creating project";
    console.error("[api/admin/projects] POST exception:", err);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
