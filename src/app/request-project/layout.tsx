import { Metadata } from "next";

export const metadata: Metadata = {
  title: "طلب خدمة | Request a Service — MULTI CREATIVES",
  description: "نموذج طلب خدمة مباشر وسريع لاختيار خدمتك ومشاركة متطلباتك مع إمكانية الإرسال المباشر عبر واتساب.",
  alternates: { canonical: "/request-project" },
};

export default function RequestProjectLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
