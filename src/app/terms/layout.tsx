import { Metadata } from "next";

export const metadata: Metadata = {
  title: "الشروط والأحكام | Terms of Service — MULTI CREATIVES",
  description: "الشروط والأحكام وأطر العمل ومعايير الملكية الفكرية المعتمدة لدى MULTI CREATIVES.",
  alternates: { canonical: "/terms" },
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
