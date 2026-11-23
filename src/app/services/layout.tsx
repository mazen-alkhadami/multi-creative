import { Metadata } from "next";

export const metadata: Metadata = {
  title: "خدماتنا وتخصصاتنا السبعة | Core Disciplines",
  description: "استكشف خدمات MULTI CREATIVES السبعة: تطوير المواقع، تطبيقات الويب، البرمجيات، الذكاء الاصطناعي، التصميم، الطباعة، والهدايا الدعائية.",
  alternates: { canonical: "/services" },
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
