import { Metadata } from "next";

export const metadata: Metadata = {
  title: "المقالات والرؤى المعمارية | Architectural Insights & Blog",
  description: "مقالات استراتيجية وتحليلات معمقة حول هندسة الويب، الذكاء الاصطناعي المؤسسي، الهوية البصرية، والطباعة الفاخرة.",
  alternates: { canonical: "/blog" },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
