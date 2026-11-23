"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Lightbox, LightboxItem } from "@/components/ui/Lightbox";
import { portfolioData, PORTFOLIO_CATEGORIES } from "@/data/portfolioData";
import { getPublicProjects, ExtendedPortfolioItem } from "@/lib/data/projects";
import { useLanguage } from "@/hooks";
import { ArrowUpRight, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function PortfolioPage() {
  const { lang } = useLanguage();
  const [projects, setProjects] = useState<ExtendedPortfolioItem[]>(portfolioData);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentLightboxIndex, setCurrentLightboxIndex] = useState(0);

  // Fetch live published projects from Supabase
  useEffect(() => {
    async function loadProjects() {
      try {
        const liveProjects = await getPublicProjects();
        if (liveProjects && liveProjects.length > 0) {
          setProjects(liveProjects);
        }
      } catch (err) {
        console.warn("[PortfolioPage] Error loading public projects:", err);
      }
    }
    loadProjects();
  }, []);

  // Filter items matching selected service / category
  const filteredItems = useMemo(() => {
    if (selectedCategory === "all") return projects;

    return projects.filter((item) => {
      // Primary category direct match
      if (item.category === selectedCategory) return true;

      // Match against linked service slugs (both primary & secondary)
      if (item.serviceSlugs && item.serviceSlugs.includes(selectedCategory)) return true;

      // Handle category slug aliases
      if (
        selectedCategory === "web-design" &&
        (item.category === "website-design-development" ||
          item.serviceSlugs?.includes("website-design-development"))
      ) {
        return true;
      }

      if (
        selectedCategory === "web-apps-software" &&
        (item.category === "web-applications-development" ||
          item.category === "software-systems-development" ||
          item.serviceSlugs?.includes("web-applications-development") ||
          item.serviceSlugs?.includes("software-systems-development"))
      ) {
        return true;
      }

      if (
        selectedCategory === "branding-logos" &&
        (item.category === "branding-logos" ||
          item.serviceSlugs?.includes("graphic-design"))
      ) {
        return true;
      }

      if (
        selectedCategory === "printing" &&
        (item.category === "printing-services" ||
          item.serviceSlugs?.includes("printing-services"))
      ) {
        return true;
      }

      return false;
    });
  }, [projects, selectedCategory]);

  // Lightbox items mapping
  const lightboxItems = useMemo<LightboxItem[]>(() => {
    return filteredItems.map((item) => ({
      image: item.coverImage,
      title: item.title[lang],
      desc: `${item.categoryName[lang]} • ${lang === "ar" ? "عمل تجريبي (Concept Project)" : "Concept Project"}`,
      tag: item.number,
    }));
  }, [filteredItems, lang]);

  const openPreview = (index: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="py-12 md:py-20">
      <Container>
        {/* Header Section */}
        <div className="max-w-3xl mb-12 md:mb-16">
          <Badge variant="gold" size="md" className="mb-4">
            {lang === "ar" ? "معرض الأعمال والنماذج" : "Portfolio & Concepts"}
          </Badge>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[var(--text-primary)] tracking-tight leading-tight mb-4">
            {lang === "ar"
              ? "نماذج مشاريع وتصاميم تجريبية"
              : "Selected Concept Projects & Design Mockups"}
          </h1>
          <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed">
            {lang === "ar"
              ? "مختارات من النماذج التجريبية والموك آب التي تعكس أسلوبنا في تصميم المواقع، تطبيقات الويب، الهويات البصرية، والتصميم الجرافيكي والطباعة والهدايا."
              : "A curated preview of concept projects and design mockups illustrating our capabilities across web design, apps, visual identity, print, and promotional gifts."}
          </p>
        </div>

        {/* Categories / Services Filter Bar */}
        <div className="flex flex-wrap items-center gap-2 mb-10 pb-4 border-b border-[var(--border-subtle)]">
          {PORTFOLIO_CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  "px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer",
                  isActive
                    ? "bg-[#C6A66B] text-[#111111] shadow-md shadow-[#C6A66B]/20 font-bold"
                    : "bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)]"
                )}
              >
                {cat.name[lang]}
              </button>
            );
          })}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-16">
          {filteredItems.map((item, index) => (
            <article
              key={item.slug}
              className="group rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] overflow-hidden hover:border-[#C6A66B]/50 transition-all duration-300 flex flex-col justify-between shadow-sm hover:shadow-xl"
            >
              <div>
                {/* Image Cover Box */}
                <div className="relative aspect-[16/10] bg-[var(--bg-surface-elevated)] overflow-hidden border-b border-[var(--border-subtle)]">
                  <Image
                    src={item.coverImage}
                    alt={item.title[lang]}
                    fill
                    unoptimized
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />

                  {/* Top Badges */}
                  <div className="absolute top-3 start-3 flex items-center gap-1.5 z-10">
                    <span className="px-2 py-0.5 rounded bg-black/75 backdrop-blur-md text-[10px] font-mono text-[#C6A66B] border border-[#C6A66B]/30 font-bold">
                      {item.number}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 backdrop-blur-md text-[10px] font-bold text-amber-300 border border-amber-500/30">
                      {lang === "ar" ? "عمل تجريبي (Concept)" : "Concept"}
                    </span>
                  </div>

                  {/* Quick Expand Button */}
                  <button
                    onClick={(e) => openPreview(index, e)}
                    className="absolute bottom-3 end-3 p-2 rounded-xl bg-black/60 backdrop-blur-md text-white/80 hover:text-white hover:bg-black/90 transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                    title={lang === "ar" ? "معاينة سريعة" : "Quick Preview"}
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Content Box */}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="outline" size="sm">
                      {item.categoryName[lang]}
                    </Badge>
                    <span className="text-xs text-[var(--text-muted)]">
                      {item.year}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-[var(--text-primary)] mb-3 leading-snug group-hover:text-[#C6A66B] transition-colors">
                    <Link href={`/portfolio/${item.slug}`}>
                      {item.title[lang]}
                    </Link>
                  </h2>

                  <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed line-clamp-3 mb-4">
                    {item.summary[lang]}
                  </p>

                  {/* Tools Tags */}
                  <div className="flex flex-wrap gap-1 mb-2">
                    {item.tools.slice(0, 3).map((t, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded text-[10px] font-mono bg-[var(--bg-surface-elevated)] text-[var(--text-muted)] border border-[var(--border-subtle)]"
                      >
                        {t}
                      </span>
                    ))}
                    {item.tools.length > 3 && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono text-[var(--text-muted)]">
                        +{item.tools.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom Card Footer */}
              <div className="px-6 pb-6 pt-2 border-t border-[var(--border-subtle)]/50 flex items-center justify-between">
                <Link
                  href={`/portfolio/${item.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C6A66B] hover:text-[#D8BC84] transition-colors"
                >
                  <span>{lang === "ar" ? "تفاصيل دراسة الحالة" : "Case Study Details"}</span>
                  <ArrowUpRight className={cn("w-3.5 h-3.5", lang === "ar" && "rotate-[-90deg]")} />
                </Link>

                <Button
                  href="/request-project"
                  variant="outline"
                  size="sm"
                  className="text-xs py-1 px-3"
                >
                  {lang === "ar" ? "طلب عمل مماثل" : "Request"}
                </Button>
              </div>
            </article>
          ))}
        </div>

        {/* Bottom CTA Box */}
        <div className="p-8 sm:p-12 rounded-3xl bg-[var(--bg-surface)] border border-[#C6A66B]/30 text-center max-w-3xl mx-auto shadow-xl">
          <Badge variant="gold" size="sm" className="mb-3">
            {lang === "ar" ? "مشروعك القادم" : "Your Next Project"}
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] mb-3">
            {lang === "ar" ? "هل ترغب في بناء هوية أو مشروع خاص بك؟" : "Ready to Engineer Your Next Digital Masterpiece?"}
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] mb-6 max-w-lg mx-auto leading-relaxed">
            {lang === "ar"
              ? "فريق MULTI CREATIVES جاهز لتحويل متطلباتك إلى واقع رقمي وتصميمي رفيع المستوى."
              : "MULTI CREATIVES delivers bespoke creative and technological solutions tailored to elevate your business presence."}
          </p>
          <Button href="/request-project" variant="primary" size="lg">
            {lang === "ar" ? "ابدأ طلب مشروعك الآن" : "Start Your Project"}
          </Button>
        </div>
      </Container>

      {/* Lightbox Component */}
      <Lightbox
        items={lightboxItems}
        isOpen={lightboxOpen}
        currentIndex={currentLightboxIndex}
        onIndexChange={setCurrentLightboxIndex}
        onClose={() => setLightboxOpen(false)}
      />
    </div>
  );
}
