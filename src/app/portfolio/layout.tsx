import { Metadata } from "next";

export const metadata: Metadata = {
  title: "معرض الأعمال والدراسات المعمارية | Portfolio & Case Studies",
  description: "استكشف نماذجنا المعمارية ودراسات الجدوى الهندسية والتصميمية عبر التخصصات السبعة.",
  alternates: { canonical: "/portfolio" },
};

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
