import { NextResponse, type NextRequest } from "next/server";
import { getCurrentAdminProfile, requireAdmin } from "@/lib/auth/adminAuth";
import { createAdminClient } from "@/lib/supabase/admin";

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
  "image/gif",
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB limit

export async function POST(request: NextRequest) {
  try {
    const auth = await getCurrentAdminProfile();
    if (!auth.user || !auth.profile || auth.profile.is_active === false || !["admin", "editor"].includes(auth.profile.role)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Active team membership required (Admin or Editor)" },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const requestedBucket = (formData.get("bucket") as string) || "portfolio-images";
    const bucket = requestedBucket === "service-images" ? "service-images" : "portfolio-images";

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file was uploaded" },
        { status: 400 }
      );
    }

    // 1. Validate MIME type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: `صيغة الملف غير مدعومة (${file.type}). يرجى رفع صورة (PNG, JPG, WEBP, SVG, GIF)`,
        },
        { status: 400 }
      );
    }

    // 2. Validate File Size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          error: "حجم الصورة يتجاوز الحد المسموح به (10 ميجابايت)",
        },
        { status: 400 }
      );
    }

    // 3. Generate sanitized path
    const timestamp = Date.now();
    const sanitizedFileName = file.name
      .toLowerCase()
      .replace(/[^a-z0-9.-]/g, "_");
    const folderPrefix = bucket === "service-images" ? "services" : "projects";
    const filePath = `${folderPrefix}/${timestamp}-${sanitizedFileName}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const supabaseAdmin = createAdminClient();

    // 4. Upload to target bucket
    const { error: uploadError } = await supabaseAdmin.storage
      .from(bucket)
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error(`[api/admin/upload] Storage upload error for ${bucket}:`, uploadError.message);
      return NextResponse.json(
        { success: false, error: uploadError.message },
        { status: 400 }
      );
    }

    // 5. Retrieve Public URL
    const {
      data: { publicUrl },
    } = supabaseAdmin.storage
      .from(bucket)
      .getPublicUrl(filePath);

    // Guaranteed valid public URL directly accessible in browsers
    const finalUrl =
      publicUrl && publicUrl.trim()
        ? publicUrl.trim()
        : `${(process.env.NEXT_PUBLIC_SUPABASE_URL || "").trim()}/storage/v1/object/public/${bucket}/${filePath}`;

    return NextResponse.json({
      success: true,
      url: finalUrl,
      path: filePath,
      bucket,
      message: "تم رفع الصورة بنجاح إلى السحابة / Image uploaded successfully",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error uploading file";
    console.error("[api/admin/upload] POST exception:", err);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const auth = await requireAdmin();
    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, error: auth.error || "حذف الملفات محصور بمدير النظام فقط" },
        { status: auth.status }
      );
    }

    const { searchParams } = new URL(request.url);
    const path = searchParams.get("path");
    const requestedBucket = searchParams.get("bucket") || "portfolio-images";
    const bucket = requestedBucket === "service-images" ? "service-images" : "portfolio-images";

    if (!path) {
      return NextResponse.json(
        { success: false, error: "Storage file path is required" },
        { status: 400 }
      );
    }

    const supabaseAdmin = createAdminClient();
    const { error } = await supabaseAdmin.storage
      .from(bucket)
      .remove([path]);

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: "تم حذف الصورة من السحابة بنجاح / Image removed from storage",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error deleting image";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
