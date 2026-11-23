"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Container, Badge } from "@/components/ui";
import { blogPosts } from "@/data/blogData";
import { useLanguage } from "@/hooks";
import { ArrowUpRight, ArrowRight, ArrowLeft, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export function HomeBlogSection() {
  const { lang } = useLanguage();
  const featuredArticles = blogPosts.slice(0, 3);

  return (
    <section className="py-20 md:py-28 border-t border-[var(--border-subtle)] bg-[var(--bg-primary)]">
      <Container>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <Badge variant="gold" size="sm" className="mb-3">
              {lang === "ar" ? "رؤى وأبحاث هندسية" : "Architectural Perspectives"}
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-black text-[var(--text-primary)] tracking-tight">
              {lang === "ar" ? "أحدث المقالات في التقنية والفخامة" : "Latest Essays on Speed & Design"}
            </h2>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#C6A66B] hover:text-[#D8BC84] transition-colors"
          >
            <span>{lang === "ar" ? "استعراض كافة المقالات" : "Explore All Articles"}</span>
            {lang === "ar" ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {featuredArticles.map((post) => (
            <article
              key={post.slug}
              className="group rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] overflow-hidden hover:border-[#C6A66B]/50 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[16/10] bg-[var(--bg-surface-elevated)] overflow-hidden border-b border-[var(--border-subtle)]">
                  <Image
                    src={post.coverImage}
                    alt={post.title[lang]}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute top-3 start-3">
                    <span className="px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-[10px] text-[#C6A66B] border border-[#C6A66B]/30 font-medium">
                      {post.category[lang]}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-2 text-[11px] text-[var(--text-muted)] mb-2">
                    <Clock className="w-3 h-3" />
                    <span>{post.readTime[lang]}</span>
                    <span>•</span>
                    <span>{post.date}</span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-[var(--text-primary)] group-hover:text-[#C6A66B] transition-colors line-clamp-2 mb-3 leading-snug">
                    <Link href={`/blog/${post.slug}`}>
                      {post.title[lang]}
                    </Link>
                  </h3>

                  <p className="text-xs text-[var(--text-secondary)] line-clamp-2 mb-4 leading-relaxed">
                    {post.summary[lang]}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-[var(--border-subtle)]/60 mt-auto flex items-center justify-between pt-4">
                <span className="text-[11px] text-[var(--text-muted)] line-clamp-1">
                  {post.author[lang]}
                </span>
                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#C6A66B] hover:text-[#D8BC84] transition-colors"
                >
                  <span>{lang === "ar" ? "قراءة" : "Read"}</span>
                  <ArrowUpRight className={cn("w-3 h-3", lang === "ar" && "rotate-[-90deg]")} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
