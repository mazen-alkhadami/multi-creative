import { Metadata } from "next";

export const metadata: Metadata = {
  title: "سياسة الخصوصية | Privacy Policy — MULTI CREATIVES",
  description: "سياسة الخصوصية وسرية المعلومات وكيفية التعامل مع بيانات الطلبات والتواصل لدى MULTI CREATIVES.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
