import { Metadata } from "next";

export const metadata: Metadata = {
  title: "من نحن | About Us — MULTI CREATIVES",
  description: "تعرف على MULTI CREATIVES ورؤيتنا ومنهجيتنا في تقديم الحلول الرقمية والإبداعية والخدمات السبع المعتمدة.",
  alternates: { canonical: "/about" },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
