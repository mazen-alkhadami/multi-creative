import { Metadata } from "next";

export const metadata: Metadata = {
  title: "خيارات الطباعة والتغليف | Print Options — MULTI CREATIVES",
  description: "حدد مواصفات مطبوعاتك من كروت وأكياس وعلب وبروشورات وأرسلها عبر واتساب للحصول على تفاصيل التسعير والتنفيذ.",
  alternates: { canonical: "/print-configurator" },
};

export default function PrintConfiguratorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
