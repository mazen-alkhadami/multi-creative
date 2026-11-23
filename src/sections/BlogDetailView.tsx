"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { blogPosts, BlogPost } from "@/data/blogData";
import { useLanguage } from "@/hooks";
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  Calendar,
  Quote,
  Sparkles,
} from "lucide-react";

interface BlogDetailViewProps {
  slug: string;
}

export function BlogDetailView({ slug }: BlogDetailViewProps) {
  const { lang } = useLanguage();

  const currentIndex = blogPosts.findIndex((p) => p.slug === slug);
  const post: BlogPost = blogPosts[currentIndex] || blogPosts[0];

  const prevPost = currentIndex > 0 ? blogPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < blogPosts.length - 1 ? blogPosts[currentIndex + 1] : null;

  const relatedPosts = blogPosts.filter((p) => p.slug !== slug).slice(0, 2);

  const contentParagraphs = post.content[lang] || post.content.en;

  return (
    <article className="py-12 md:py-20">
      <Container>
        {/* Back Link */}
        <div className="mb-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--text-muted)] hover:text-[#C6A66B] transition-colors"
          >
            {lang === "ar" ? (
              <>
                <ArrowRight className="w-4 h-4" />
                <span>العودة إلى كافة المقالات والرؤى</span>
              </>
            ) : (
              <>
                <ArrowLeft className="w-4 h-4" />
                <span>Back to All Articles & Perspectives</span>
              </>
            )}
          </Link>
        </div>

        {/* Article Header */}
        <header className="max-w-4xl mx-auto mb-12 text-center sm:text-start">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mb-4">
            <Badge variant="gold" size="sm">
              {post.category[lang]}
            </Badge>
            <span className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
              <Clock className="w-3.5 h-3.5" />
              {post.readTime[lang]}
            </span>
            <span className="text-[var(--text-muted)]">•</span>
            <span className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
              <Calendar className="w-3.5 h-3.5" />
              {post.date}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[var(--text-primary)] tracking-tight leading-tight mb-6">
            {post.title[lang]}
          </h1>

          <p className="text-lg sm:text-xl text-[var(--text-secondary)] leading-relaxed mb-6 font-normal">
            {post.summary[lang]}
          </p>

          <div className="flex items-center justify-between pt-6 border-t border-[var(--border-subtle)] text-xs text-[var(--text-muted)]">
            <span className="font-semibold text-[var(--text-primary)]">
              {post.author[lang]}
            </span>
            <span className="font-mono uppercase tracking-widest text-[#C6A66B]">
              MULTI CREATIVES INSIGHTS
            </span>
          </div>
        </header>

        {/* Cover Image */}
        <div className="max-w-4xl mx-auto mb-16 rounded-2xl overflow-hidden border border-[var(--border-subtle)] bg-[var(--bg-surface)] relative aspect-[16/9] shadow-md">
          <Image
            src={post.coverImage}
            alt={post.title[lang]}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 1024px) 100vw, 896px"
          />
        </div>

        {/* Article Body */}
        <div className="max-w-3xl mx-auto mb-16">
          <div className="space-y-10">
            {contentParagraphs.map((section, idx) => (
              <div key={idx} className="space-y-4">
                {section.heading && (
                  <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] tracking-tight pt-4">
                    {section.heading}
                  </h2>
                )}

                <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed">
                  {section.paragraph}
                </p>

                {section.pullQuote && (
                  <div className="my-8 p-6 sm:p-8 rounded-2xl border-s-4 border-[#C6A66B] bg-[var(--bg-surface-elevated)] border-y border-e border-[var(--border-subtle)] shadow-sm">
                    <Quote className="w-8 h-8 text-[#C6A66B]/50 mb-3" />
                    <blockquote className="text-lg sm:text-xl font-bold text-[var(--text-primary)] leading-relaxed italic">
                      &ldquo;{section.pullQuote}&rdquo;
                    </blockquote>
                    <span className="block mt-3 text-xs font-semibold text-[#C6A66B] uppercase tracking-wider">
                      {lang === "ar" ? "رؤية معمارية" : "Architectural Perspective"}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Tags */}
          <div className="mt-12 pt-8 border-t border-[var(--border-subtle)] flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-[var(--text-muted)] me-2">
              {lang === "ar" ? "وسوم المقال:" : "Tags:"}
            </span>
            {post.tags.map((tag, idx) => (
              <span
                key={idx}
                className="text-xs px-3 py-1 rounded-full bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-secondary)] font-mono"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Author Box */}
          <div className="mt-12 p-6 sm:p-8 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] flex flex-col sm:flex-row items-center gap-6">
            <div className="w-16 h-16 rounded-full bg-[#C6A66B]/20 border border-[#C6A66B]/40 flex items-center justify-center shrink-0">
              <Sparkles className="w-7 h-7 text-[#C6A66B]" />
            </div>
            <div className="text-center sm:text-start">
              <h3 className="text-base font-bold text-[var(--text-primary)] mb-1">
                {post.author[lang]}
              </h3>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                {lang === "ar"
                  ? "فريق النخبة في MULTI CREATIVES المتخصص في هندسة البرمجيات المتطورة، تصميم النظم التفاعلية، والارتقاء بهويات الكيانات الكبرى إلى آفاق معمارية استثنائية."
                  : "The MULTI CREATIVES leadership squad dedicated to high-velocity software engineering, reactive UI design systems, and enterprise brand authority."}
              </p>
            </div>
          </div>
        </div>

        {/* Previous / Next Article Navigation */}
        <div className="max-w-4xl mx-auto pt-12 border-t border-[var(--border-subtle)] grid grid-cols-1 sm:grid-cols-2 gap-4 mb-16">
          {prevPost ? (
            <Link
              href={`/blog/${prevPost.slug}`}
              className="p-5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[#C6A66B]/40 transition-colors flex items-center gap-4"
            >
              <div className="p-2 rounded-lg bg-[var(--bg-surface-elevated)] text-[#C6A66B]">
                {lang === "ar" ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
              </div>
              <div>
                <span className="text-[11px] text-[var(--text-muted)] block">
                  {lang === "ar" ? "المقال السابق" : "Previous Article"}
                </span>
                <span className="text-sm font-bold text-[var(--text-primary)] line-clamp-1">
                  {prevPost.title[lang]}
                </span>
              </div>
            </Link>
          ) : <div />}

          {nextPost ? (
            <Link
              href={`/blog/${nextPost.slug}`}
              className="p-5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[#C6A66B]/40 transition-colors flex items-center justify-end gap-4 text-end"
            >
              <div>
                <span className="text-[11px] text-[var(--text-muted)] block">
                  {lang === "ar" ? "المقال التالي" : "Next Article"}
                </span>
                <span className="text-sm font-bold text-[var(--text-primary)] line-clamp-1">
                  {nextPost.title[lang]}
                </span>
              </div>
              <div className="p-2 rounded-lg bg-[var(--bg-surface-elevated)] text-[#C6A66B]">
                {lang === "ar" ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
              </div>
            </Link>
          ) : <div />}
        </div>

        {/* Related Articles Strip */}
        <div className="max-w-4xl mx-auto pt-8 border-t border-[var(--border-subtle)]">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]">
              {lang === "ar" ? "رؤى وأبحاث ذات صلة" : "Related Dispatches"}
            </h2>
            <Link
              href="/blog"
              className="text-xs font-semibold text-[#C6A66B] hover:text-[#D8BC84] transition-colors"
            >
              {lang === "ar" ? "استعراض الكل" : "View All"}
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {relatedPosts.map((related) => (
              <Link
                key={related.slug}
                href={`/blog/${related.slug}`}
                className="group p-6 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[#C6A66B]/50 transition-colors"
              >
                <span className="text-xs font-semibold text-[#C6A66B] block mb-2">
                  {related.category[lang]}
                </span>
                <h3 className="text-base font-bold text-[var(--text-primary)] group-hover:text-[#C6A66B] transition-colors line-clamp-2 mb-2">
                  {related.title[lang]}
                </h3>
                <p className="text-xs text-[var(--text-secondary)] line-clamp-2">
                  {related.summary[lang]}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </article>
  );
}
