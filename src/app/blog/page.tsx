"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { blogPosts, BlogPost } from "@/data/blogData";
import { useLanguage } from "@/hooks";
import { ArrowUpRight, Clock, Calendar, Send, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BlogPage() {
  const { lang } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState("");

  const categories = useMemo(() => {
    const set = new Set<string>();
    blogPosts.forEach((post) => set.add(post.category[lang]));
    return [
      { id: "all", label: lang === "ar" ? "كافة الرؤى والمقالات" : "All Articles" },
      ...Array.from(set).map((cat) => ({ id: cat, label: cat })),
    ];
  }, [lang]);

  const filteredPosts = useMemo(() => {
    if (selectedCategory === "all") return blogPosts;
    return blogPosts.filter((post) => post.category[lang] === selectedCategory);
  }, [selectedCategory, lang]);

  const featuredPost = filteredPosts[0];
  const regularPosts = filteredPosts.slice(1);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <div className="py-12 md:py-20">
      <Container>
        {/* Header Section */}
        <div className="max-w-3xl mb-12 md:mb-16">
          <Badge variant="gold" size="md" className="mb-4">
            {lang === "ar" ? "رؤى ومعمارية الفكر" : "Architectural Insights"}
          </Badge>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[var(--text-primary)] tracking-tight leading-tight mb-4">
            {lang === "ar"
              ? "دراسات ومقالات في الهندسة الرقمية والفخامة الإبداعية"
              : "Essays on Digital Engineering & Creative Hegemony"}
          </h1>
          <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed">
            {lang === "ar"
              ? "تحليلات معمقة وأفكار استراتيجية يشاركها قادة الهندسة والتصميم في MULTI CREATIVES حول أحدث التقنيات وبناء العلامات الصامدة."
              : "In-depth perspectives and architectural essays by MULTI CREATIVES engineering leads and design directors on modern platforms and timeless branding."}
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="mb-12 overflow-x-auto pb-4 no-scrollbar">
          <div className="flex items-center gap-2 min-w-max">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={cn(
                    "px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 border",
                    isActive
                      ? "bg-[#C6A66B] text-black border-[#C6A66B] font-semibold shadow-sm"
                      : "bg-[var(--bg-surface)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:text-[var(--text-primary)] hover:border-[#C6A66B]/40"
                  )}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Featured Post Card (Hero) */}
        {featuredPost && (
          <div className="mb-16 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] overflow-hidden hover:border-[#C6A66B]/50 transition-all duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
              {/* Image Preview */}
              <div className="lg:col-span-6 relative aspect-[16/10] lg:aspect-auto min-h-[300px] bg-[var(--bg-surface-elevated)] overflow-hidden border-b lg:border-b-0 lg:border-e border-[var(--border-subtle)]">
                <Image
                  src={featuredPost.coverImage}
                  alt={featuredPost.title[lang]}
                  fill
                  className="object-cover transition-transform duration-500 hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                <div className="absolute top-4 start-4">
                  <span className="px-3 py-1 rounded-full bg-[#C6A66B] text-black text-xs font-bold uppercase tracking-wider shadow-sm">
                    {lang === "ar" ? "مقال مميز" : "Featured Essay"}
                  </span>
                </div>
              </div>

              {/* Text Meta */}
              <div className="lg:col-span-6 p-8 sm:p-10 lg:p-12 flex flex-col justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--text-muted)] mb-4">
                    <span className="px-2.5 py-0.5 rounded bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] font-medium text-[#C6A66B]">
                      {featuredPost.category[lang]}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {featuredPost.readTime[lang]}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {featuredPost.date}
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] mb-4 hover:text-[#C6A66B] transition-colors leading-snug">
                    <Link href={`/blog/${featuredPost.slug}`}>
                      {featuredPost.title[lang]}
                    </Link>
                  </h2>

                  <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed mb-6">
                    {featuredPost.summary[lang]}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {featuredPost.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] px-2.5 py-1 rounded bg-[var(--bg-surface-elevated)] text-[var(--text-muted)] border border-[var(--border-subtle)] font-mono"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-[var(--border-subtle)] flex items-center justify-between">
                  <span className="text-xs text-[var(--text-muted)] font-medium">
                    {featuredPost.author[lang]}
                  </span>
                  <Link
                    href={`/blog/${featuredPost.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#C6A66B] hover:text-[#D8BC84] transition-colors"
                  >
                    <span>{lang === "ar" ? "قراءة المقال كاملاً" : "Read Full Essay"}</span>
                    <ArrowUpRight className={cn("w-3.5 h-3.5", lang === "ar" && "rotate-[-90deg]")} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Regular Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {regularPosts.map((post: BlogPost) => (
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
                    <span className="px-2.5 py-1 rounded bg-black/70 backdrop-blur-md text-[11px] font-medium text-[#C6A66B] border border-[#C6A66B]/30">
                      {post.category[lang]}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-3 text-xs text-[var(--text-muted)] mb-3">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.readTime[lang]}
                    </span>
                    <span>•</span>
                    <span>{post.date}</span>
                  </div>

                  <h3 className="text-lg font-bold text-[var(--text-primary)] mb-3 group-hover:text-[#C6A66B] transition-colors line-clamp-2 leading-snug">
                    <Link href={`/blog/${post.slug}`}>
                      {post.title[lang]}
                    </Link>
                  </h3>

                  <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed line-clamp-3 mb-4">
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

        {/* Editorial Subscription / Newsletter Box */}
        <div className="p-8 sm:p-12 rounded-2xl border border-[#C6A66B]/30 bg-gradient-to-br from-[#1C1C1C] to-[#111111] text-white max-w-3xl mx-auto text-center shadow-xl">
          <Sparkles className="w-8 h-8 text-[#C6A66B] mx-auto mb-4" />
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">
            {lang === "ar"
              ? "اشترك في نشرة المعمارية الإبداعية"
              : "Subscribe to Architectural Dispatches"}
          </h2>
          <p className="text-sm text-stone-300 max-w-lg mx-auto mb-8 leading-relaxed">
            {lang === "ar"
              ? "نرسل فصلياً تحليلات غير منشورة حول هندسة الويب الحديثة، والذكاء الاصطناعي المؤسسي، وتوجهات العلامات الفاخرة. بدون رسائل مزعجة إطلاقاً."
              : "Quarterly architectural dispatches detailing edge frameworks, institutional AI, and luxury identity governance. Zero marketing noise."}
          </p>

          {subscribed ? (
            <div className="p-4 rounded-xl bg-[#C6A66B]/20 border border-[#C6A66B] text-[#C6A66B] text-sm font-semibold max-w-md mx-auto">
              {lang === "ar"
                ? "شكراً لانضمامك إلى النشرة المعمارية لـ MULTI CREATIVES."
                : "Thank you for subscribing to the MULTI CREATIVES architectural dispatches."}
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={lang === "ar" ? "أدخل بريدك الإلكتروني المؤسسي..." : "Enter your corporate email..."}
                className="flex-1 px-4 py-3 rounded-full bg-black/60 border border-white/20 text-white placeholder-stone-400 text-sm focus:outline-none focus:border-[#C6A66B] transition-colors"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-full bg-[#C6A66B] hover:bg-[#D8BC84] text-black font-bold text-sm transition-colors flex items-center justify-center gap-2"
              >
                <span>{lang === "ar" ? "اشتراك" : "Subscribe"}</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>
      </Container>
    </div>
  );
}
