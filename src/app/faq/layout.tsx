import { Metadata } from "next";

export const metadata: Metadata = {
  title: "مركز المساعدة والأسئلة الشائعة | Help Center & FAQ",
  description: "إجابات شفافة حول نماذج التعاقد، المعايير التقنية، أمان البيانات، ومواصفات الإنتاج لدى MULTI CREATIVES.",
  alternates: { canonical: "/faq" },
};

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
