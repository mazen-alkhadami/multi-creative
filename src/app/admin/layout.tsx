import React from "react";
import { AdminShell } from "./AdminShell";

export const metadata = {
  title: "MULTI CREATIVES — الإدارة المركزية",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminShell>{children}</AdminShell>;
}
