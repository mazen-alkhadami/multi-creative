import React from "react";
import { ProjectForm } from "@/components/admin/ProjectForm";

export const metadata = {
  title: "إضافة مشروع جديد — MULTI CREATIVES",
};

export default function AdminNewProjectPage() {
  return <ProjectForm mode="create" />;
}
