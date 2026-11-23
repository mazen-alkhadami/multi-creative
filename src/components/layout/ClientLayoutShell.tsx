"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { AppProvider, useSearch } from "@/context/AppContext";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { SearchModal } from "@/components/ui/SearchModal";
import { McAiAssistant } from "@/components/ui/McAiAssistant";
import { FloatingWhatsAppButton } from "@/components/ui/FloatingWhatsAppButton";
import { PwaRegister } from "@/components/pwa/PwaRegister";

function ShellInner({ children }: { children: React.ReactNode }) {
  const { isSearchOpen, closeSearch } = useSearch();
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  if (isAdminRoute) {
    return (
      <div className="min-h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300">
        <main id="main-content" className="flex-1 flex flex-col">{children}</main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:start-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-[var(--accent-gold)] focus:text-black focus:font-bold focus:rounded-md focus:shadow-xl focus:outline-none"
      >
        Skip to main content / الانتقال إلى المحتوى الرئيسي
      </a>
      <Header />
      <main id="main-content" className="flex-1 flex flex-col">{children}</main>
      <Footer />
      <SearchModal isOpen={isSearchOpen} onClose={closeSearch} />
      <McAiAssistant />
      <FloatingWhatsAppButton />
      <PwaRegister />
    </div>
  );
}

export function ClientLayoutShell({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      <ShellInner>{children}</ShellInner>
    </AppProvider>
  );
}
