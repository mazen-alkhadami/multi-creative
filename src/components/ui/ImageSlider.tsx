"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { Lightbox, LightboxItem } from "./Lightbox";
import { useLanguage } from "@/hooks";
import { cn } from "@/lib/utils";

export interface ImageSliderProps {
  items: LightboxItem[];
  aspectRatio?: "16/9" | "16/10" | "4/3";
  autoplay?: boolean;
  autoplayInterval?: number;
  className?: string;
}

export function ImageSlider({
  items,
  aspectRatio = "16/10",
  autoplay = false,
  autoplayInterval = 5000,
  className = "",
}: ImageSliderProps) {
  const { lang } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  }, [items.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  }, [items.length]);

  // Autoplay support with hover pause
  useEffect(() => {
    if (!autoplay || isPaused || items.length <= 1) return;
    const interval = setInterval(handleNext, autoplayInterval);
    return () => clearInterval(interval);
  }, [autoplay, isPaused, autoplayInterval, handleNext, items.length]);

  if (!items || items.length === 0) return null;

  const current = items[currentIndex];

  const aspectClass = {
    "16/9": "aspect-video",
    "16/10": "aspect-[16/10]",
    "4/3": "aspect-[4/3]",
  }[aspectRatio];

  return (
    <div
      className={cn("flex flex-col gap-4 w-full select-none", className)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Main Slide Card */}
      <div
        className={cn(
          "relative w-full rounded-2xl overflow-hidden border border-[var(--border-subtle)] bg-[var(--bg-surface)] group cursor-pointer shadow-lg",
          aspectClass
        )}
        onClick={() => setLightboxOpen(true)}
      >
        {/* Slide Image */}
        <Image
          src={current.image}
          alt={current.title}
          fill
          sizes="(max-width: 1024px) 100vw, 1024px"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          priority
        />

        {/* Ambient Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />

        {/* Top Tag and Inspect Trigger */}
        <div className="absolute top-4 start-4 end-4 flex items-center justify-between z-10">
          {current.tag ? (
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-black/60 backdrop-blur-md text-[#C6A66B] border border-[#C6A66B]/30">
              {current.tag}
            </span>
          ) : (
            <div />
          )}

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-black/60 backdrop-blur-md text-white/90 hover:text-[#111111] hover:bg-[#C6A66B] border border-white/20 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A66B]"
            aria-label="Open image in fullscreen preview"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>{lang === "ar" ? "معاينة مكبرة" : "Inspect Lightbox"}</span>
          </button>
        </div>

        {/* Bottom Slide Info */}
        <div className="absolute bottom-4 start-4 end-4 z-10 text-white">
          <h3 className="text-base sm:text-lg md:text-xl font-bold tracking-tight mb-1 text-white drop-shadow-md">
            {current.title}
          </h3>
          {current.desc && (
            <p className="text-xs sm:text-sm text-white/80 line-clamp-2 max-w-xl leading-relaxed">
              {current.desc}
            </p>
          )}
        </div>

        {/* Prev / Next Arrows on Hover */}
        {items.length > 1 && (
          <div className="absolute inset-y-0 start-3 end-3 flex items-center justify-between pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (lang === "ar") handleNext();
                else handlePrev();
              }}
              className="pointer-events-auto p-2.5 rounded-full bg-black/60 backdrop-blur-md text-white hover:bg-[#C6A66B] hover:text-[#111111] border border-white/20 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A66B]"
              aria-label="Previous slide"
            >
              {lang === "ar" ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (lang === "ar") handlePrev();
                else handleNext();
              }}
              className="pointer-events-auto p-2.5 rounded-full bg-black/60 backdrop-blur-md text-white hover:bg-[#C6A66B] hover:text-[#111111] border border-white/20 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A66B]"
              aria-label="Next slide"
            >
              {lang === "ar" ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
            </button>
          </div>
        )}
      </div>

      {/* Thumbnails Strip & Counter */}
      {items.length > 1 && (
        <div className="flex items-center justify-between gap-3 px-1">
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            {items.map((item, idx) => {
              const isActive = idx === currentIndex;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={cn(
                    "relative h-12 w-18 sm:h-14 sm:w-22 rounded-lg overflow-hidden border transition-all duration-200 shrink-0",
                    isActive
                      ? "border-[#C6A66B] ring-2 ring-[#C6A66B]/50 scale-105"
                      : "border-[var(--border-subtle)] opacity-60 hover:opacity-100"
                  )}
                  aria-label={`Go to slide ${idx + 1}: ${item.title}`}
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="100px"
                    className="object-cover"
                  />
                </button>
              );
            })}
          </div>

          <div className="text-xs font-mono text-[var(--text-tertiary)] shrink-0">
            <span className="text-[#C6A66B] font-bold">{currentIndex + 1}</span> / {items.length}
          </div>
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      <Lightbox
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        items={items}
        currentIndex={currentIndex}
        onIndexChange={setCurrentIndex}
      />
    </div>
  );
}
