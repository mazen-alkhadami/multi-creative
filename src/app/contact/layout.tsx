import { Metadata } from "next";

export const metadata: Metadata = {
  title: "اتصل بنا وقنوات الاستفسار | Contact & Channels",
  description: "تواصل مع فريق MULTI CREATIVES عبر قنوات الاتصال المباشرة ومحادثة الواتساب الفورية.",
  alternates: { canonical: "/contact" },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
