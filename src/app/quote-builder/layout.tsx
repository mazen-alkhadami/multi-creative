import { Metadata } from "next";

export const metadata: Metadata = {
  title: "تحديد نطاق العمل | Scope Selection — MULTI CREATIVES",
  description: "حدد متطلبات مشروعك عبر خدماتنا وتواصل معنا مباشرة لمناقشة التفاصيل وخطة العمل المناسبة.",
  alternates: { canonical: "/quote-builder" },
};

export default function QuoteBuilderLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
