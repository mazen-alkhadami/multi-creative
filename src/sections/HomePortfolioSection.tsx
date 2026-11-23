"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Container, Badge } from "@/components/ui";
import { portfolioData } from "@/data/portfolioData";
import { getPublicProjects, ExtendedPortfolioItem } from "@/lib/data/projects";
import { useLanguage } from "@/hooks";
import { ArrowUpRight, ArrowRight, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export function HomePortfolioSection() {
  const { lang } = useLanguage();
  const [items, setItems] = useState<ExtendedPortfolioItem[]>(
    portfolioData.slice(0, 3) as ExtendedPortfolioItem[]
  );

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        const live = await getPublicProjects();
        if (isMounted && live && live.length > 0) {
          setItems(live.slice(0, 3));
        }
      } catch {
        // Fallback remains portfolioData
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="py-20 md:py-28 border-t border-[var(--border-subtle)] bg-[var(--bg-secondary)]">
      <Container>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <Badge variant="gold" size="sm" className="mb-3">
              {lang === "ar" ? "أعمال ومشاريع تجريبية" : "Selected Concept Works"}
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-black text-[var(--text-primary)] tracking-tight">
              {lang === "ar" ? "نماذج من أعمالنا وتصاميمنا" : "Preview of Our Concept Works"}
            </h2>
          </div>
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#C6A66B] hover:text-[#D8BC84] transition-colors"
          >
            <span>{lang === "ar" ? "استعراض كافة الأعمال" : "Explore All Works"}</span>
            {lang === "ar" ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {items.map((item) => (
            <div
              key={item.slug}
              className="group rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] overflow-hidden hover:border-[#C6A66B]/50 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[16/10] bg-[var(--bg-surface-elevated)] overflow-hidden border-b border-[var(--border-subtle)]">
                  <Image
                    src={item.coverImage}
                    alt={item.title[lang]}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute top-3 start-3 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-[10px] font-mono text-[#C6A66B] border border-[#C6A66B]/30 font-bold">
                      {item.number}
                    </span>
                    {item.isConcept !== false && (
                      <span className="px-2 py-0.5 rounded bg-amber-500/20 backdrop-blur-md text-[10px] font-bold text-amber-300 border border-amber-500/30">
                        {lang === "ar" ? "عمل تجريبي (Concept)" : "Concept"}
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-6">
                  <span className="text-[11px] font-semibold text-[#C6A66B] uppercase tracking-wider block mb-1">
                    {item.categoryName[lang]}
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-[var(--text-primary)] group-hover:text-[#C6A66B] transition-colors line-clamp-2 mb-3">
                    <Link href={`/portfolio/${item.slug}`}>
                      {item.title[lang]}
                    </Link>
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] line-clamp-2 mb-4 leading-relaxed">
                    {item.summary[lang]}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-[var(--border-subtle)]/60 mt-auto flex items-center justify-between pt-4">
                <span className="text-[11px] font-mono text-[var(--text-muted)]">
                  {item.categoryName[lang]}
                </span>
                <Link
                  href={`/portfolio/${item.slug}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#C6A66B] hover:text-[#D8BC84] transition-colors"
                >
                  <span>{lang === "ar" ? "تفاصيل المشروع" : "Project Details"}</span>
                  <ArrowUpRight className={cn("w-3 h-3", lang === "ar" && "rotate-[-90deg]")} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
