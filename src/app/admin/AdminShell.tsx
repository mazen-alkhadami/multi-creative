"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import { useAppContext } from "@/context/AppContext";
import { createClient } from "@/lib/supabase/client";
import {
  LayoutDashboard,
  Briefcase,
  PlusCircle,
  Layers,
  Users,
  Code2,
  UserCog,
  ExternalLink,
  LogOut,
  Sun,
  Moon,
  Globe,
  Menu,
  X,
  Shield,
  ChevronRight,
  ChevronLeft,
  Loader2,
} from "lucide-react";

interface AdminShellUser {
  id: string;
  email: string;
  fullName: string;
  role: "admin" | "editor";
  isActive: boolean;
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { lang, dir, theme, toggleLang, toggleTheme } = useAppContext();
  const isArabic = lang === "ar";

  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [currentUser, setCurrentUser] = useState<AdminShellUser | null>(null);

  // Fetch verified user profile
  useEffect(() => {
    async function loadUserProfile() {
      try {
        // Attempt 1: Fetch from server API
        const res = await fetch("/api/admin/profile");
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.profile) {
            setCurrentUser({
              id: json.profile.id,
              email: json.profile.email,
              fullName: json.profile.full_name || (isArabic ? "عضو معتمد" : "Team Member"),
              role: json.profile.role,
              isActive: json.profile.is_active,
            });
            return;
          }
        }

        // Attempt 2: Fallback to client session
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("id, email, full_name, role, is_active")
            .eq("id", user.id)
            .maybeSingle();

          setCurrentUser({
            id: user.id,
            email: user.email || "",
            fullName:
              profile?.full_name ||
              user.user_metadata?.full_name ||
              (isArabic ? "مشرف النظام" : "System Administrator"),
            role: (profile?.role || user.user_metadata?.role || "admin") as "admin" | "editor",
            isActive: profile?.is_active ?? true,
          });
        }
      } catch (err) {
        console.error("[AdminShell] Error loading user profile:", err);
      }
    }

    loadUserProfile();
  }, [isArabic]);

  // Exclude standalone authentication views from shell chrome
  const isAuthPage =
    pathname === "/admin/login" ||
    pathname === "/admin/set-password" ||
    pathname.startsWith("/admin/auth/callback");

  if (isAuthPage) {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await fetch("/api/admin/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch (err) {
      console.error("Logout error:", err);
      setLoggingOut(false);
    }
  };

  const isAdmin = currentUser?.role === "admin";

  // Navigation Items in exact specified order
  const navItems = [
    {
      href: "/admin",
      label: isArabic ? "الرئيسية" : "Dashboard Home",
      icon: LayoutDashboard,
      active: pathname === "/admin",
      visible: true,
    },
    {
      href: "/admin/portfolio",
      label: isArabic ? "معرض الأعمال" : "Portfolio",
      icon: Briefcase,
      active: pathname === "/admin/portfolio",
      visible: true,
    },
    {
      href: "/admin/portfolio/new",
      label: isArabic ? "إضافة مشروع" : "Add Project",
      icon: PlusCircle,
      active: pathname === "/admin/portfolio/new",
      visible: true,
    },
    {
      href: "/admin/services",
      label: isArabic ? "إدارة الخدمات" : "Services",
      icon: Layers,
      active: pathname.startsWith("/admin/services"),
      visible: true,
    },
    {
      href: "/admin/team",
      label: isArabic ? "أعضاء الفريق" : "Team Members",
      icon: Users,
      active: pathname.startsWith("/admin/team"),
      visible: isAdmin, // Admin Only
    },
    {
      href: "/admin/integrations",
      label: isArabic ? "التكاملات والتتبع" : "Integrations & Tracking",
      icon: Code2,
      active: pathname.startsWith("/admin/integrations"),
      visible: isAdmin, // Admin Only
    },
    {
      href: "/admin/settings",
      label: isArabic ? "إعدادات الحساب" : "Account Settings",
      icon: UserCog,
      active: pathname.startsWith("/admin/settings"),
      visible: true,
    },
  ];

  // Resolve current page title for Topbar
  const getCurrentPageTitle = () => {
    if (pathname === "/admin") return isArabic ? "لوحة التحكم الرئيسية" : "Dashboard Overview";
    if (pathname === "/admin/portfolio") return isArabic ? "معرض الأعمال والمشاريع" : "Portfolio Management";
    if (pathname === "/admin/portfolio/new") return isArabic ? "إضافة مشروع جديد" : "Add New Project";
    if (pathname.startsWith("/admin/services")) return isArabic ? "إدارة الخدمات والحلول" : "Services Management";
    if (pathname.startsWith("/admin/team")) return isArabic ? "إدارة فريق العمل والدعوات" : "Team & Access Control";
    if (pathname.startsWith("/admin/integrations")) return isArabic ? "التكاملات وأكواد التتبع" : "Integrations & Tracking";
    if (pathname.startsWith("/admin/settings")) return isArabic ? "إعدادات الحساب والأمان" : "Account & Security Settings";
    return isArabic ? "الإدارة المركزية" : "Admin Portal";
  };

  return (
    <div dir={dir} className="min-h-screen flex bg-[var(--bg-primary)] text-[var(--text-primary)]">
      {/* Mobile Drawer Backdrop */}
      {mobileDrawerOpen && (
        <div
          onClick={() => setMobileDrawerOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* =========================================================================
          1. Sidebar (Fixed on Desktop, Drawer on Mobile)
         ========================================================================= */}
      <aside
        className={`fixed top-0 bottom-0 z-50 w-72 bg-[var(--bg-surface)] border-e border-[var(--border-subtle)] flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          dir === "rtl"
            ? mobileDrawerOpen
              ? "translate-x-0 right-0"
              : "translate-x-full right-0 lg:translate-x-0"
            : mobileDrawerOpen
            ? "translate-x-0 left-0"
            : "-translate-x-full left-0 lg:translate-x-0"
        }`}
      >
        {/* Sidebar Header & Brand */}
        <div>
          <div className="h-20 px-6 flex items-center justify-between border-b border-[var(--border-subtle)]">
            <Logo size="sm" href="/admin" />
            <button
              onClick={() => setMobileDrawerOpen(false)}
              className="lg:hidden p-2 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>

          {/* System Badge */}
          <div className="px-6 py-4">
            <div className="px-3 py-2 rounded-xl bg-[#C6A66B]/10 border border-[#C6A66B]/25 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield size={14} className="text-[#C6A66B]" />
                <span className="text-xs font-bold text-[#C6A66B]">
                  {isArabic ? "منظومة الإدارة المركزية" : "Admin Operations"}
                </span>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="px-3 space-y-1 mt-2">
            {navItems
              .filter((item) => item.visible)
              .map((item) => {
                const Icon = item.icon;
                const isActive = item.active;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileDrawerOpen(false)}
                    className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold transition-all group ${
                      isActive
                        ? "bg-[#C6A66B]/15 text-[#C6A66B] border border-[#C6A66B]/30 shadow-sm"
                        : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        size={18}
                        className={`transition-transform duration-200 group-hover:scale-110 ${
                          isActive ? "text-[#C6A66B]" : "text-[var(--text-tertiary)] group-hover:text-[#C6A66B]"
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C6A66B]" />
                    )}
                  </Link>
                );
              })}
          </nav>
        </div>

        {/* Sidebar Footer: User Card & Sign Out */}
        <div className="p-4 border-t border-[var(--border-subtle)] bg-[var(--bg-secondary)]/40">
          <div className="p-3 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#C6A66B]/25 to-[#C6A66B]/10 text-[#C6A66B] flex items-center justify-center font-bold text-xs shrink-0 border border-[#C6A66B]/30">
                {(currentUser?.fullName || currentUser?.email || "A")[0].toUpperCase()}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-[var(--text-primary)] truncate">
                  {currentUser?.fullName || (isArabic ? "مشرف معتمد" : "Administrator")}
                </div>
                <div className="text-[10px] text-[var(--text-tertiary)] font-mono truncate">
                  {currentUser?.email || "admin@multicreatives.com"}
                </div>
              </div>
            </div>

            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase shrink-0 bg-[#C6A66B]/15 text-[#C6A66B] border border-[#C6A66B]/30">
              {currentUser?.role === "admin" ? "Admin" : "Editor"}
            </span>
          </div>

          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full py-2.5 px-3 rounded-xl border border-red-500/25 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loggingOut ? <Loader2 size={14} className="animate-spin" /> : <LogOut size={14} />}
            <span>{isArabic ? "تسجيل الخروج" : "Sign Out"}</span>
          </button>
        </div>
      </aside>

      {/* =========================================================================
          2. Main Layout (Topbar + Content Area)
         ========================================================================= */}
      <div className="flex-1 flex flex-col min-w-0 lg:ps-72 transition-all">
        {/* Topbar */}
        <header className="sticky top-0 z-30 h-20 bg-[var(--bg-primary)]/90 backdrop-blur-xl border-b border-[var(--border-subtle)] px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Left: Mobile Toggle & Page Title */}
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <button
              onClick={() => setMobileDrawerOpen(true)}
              className="lg:hidden p-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>

            <div>
              <div className="flex items-center gap-1.5 text-[11px] text-[var(--text-tertiary)] font-medium">
                <span>MULTI CREATIVES</span>
                {isArabic ? <ChevronLeft size={12} /> : <ChevronRight size={12} />}
                <span>{isArabic ? "الإدارة" : "Portal"}</span>
              </div>
              <h2 className="text-sm sm:text-base font-extrabold text-[var(--text-primary)] truncate">
                {getCurrentPageTitle()}
              </h2>
            </div>
          </div>

          {/* Right: Actions (Public site, Theme, Lang, User Pill) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* View Public Website */}
            <Link
              href="/"
              target="_blank"
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[#C6A66B]/40 hover:text-[#C6A66B] text-xs font-medium text-[var(--text-secondary)] transition-all"
              title={isArabic ? "معاينة الموقع العام" : "Preview Public Site"}
            >
              <span>{isArabic ? "معاينة الموقع" : "Public Site"}</span>
              <ExternalLink size={13} />
            </Link>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[#C6A66B]/40 hover:text-[#C6A66B] transition-all cursor-pointer text-[var(--text-secondary)]"
              title={isArabic ? "تبديل المظهر" : "Toggle Theme"}
              aria-label={isArabic ? "تبديل المظهر" : "Toggle Theme"}
            >
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {/* Language Switcher */}
            <button
              onClick={toggleLang}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[#C6A66B]/40 hover:text-[#C6A66B] text-xs font-semibold transition-all cursor-pointer text-[var(--text-secondary)]"
              title={isArabic ? "Switch to English" : "التحويل للعربية"}
            >
              <Globe size={14} />
              <span>{isArabic ? "EN" : "عربي"}</span>
            </button>

            {/* User Pill (Desktop) */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-xs font-bold text-[var(--text-primary)]">
                {currentUser?.fullName?.split(" ")[0] || "Admin"}
              </span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-[#C6A66B]/15 text-[#C6A66B] border border-[#C6A66B]/30">
                {currentUser?.role === "admin" ? "Admin" : "Editor"}
              </span>
            </div>
          </div>
        </header>

        {/* Content Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 flex flex-col">{children}</main>
      </div>
    </div>
  );
}
