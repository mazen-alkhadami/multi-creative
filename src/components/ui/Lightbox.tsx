"use client";

import React, { useEffect, useCallback } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/hooks";

export interface LightboxItem {
  title: string;
  desc?: string;
  image: string;
  tag?: string;
}

export interface LightboxProps {
  isOpen: boolean;
  onClose: () => void;
  items: LightboxItem[];
  currentIndex: number;
  onIndexChange: (newIndex: number) => void;
}

export function Lightbox({
  isOpen,
  onClose,
  items,
  currentIndex,
  onIndexChange,
}: LightboxProps) {
  const { lang } = useLanguage();

  const handleNext = useCallback(() => {
    onIndexChange((currentIndex + 1) % items.length);
  }, [currentIndex, items.length, onIndexChange]);

  const handlePrev = useCallback(() => {
    onIndexChange((currentIndex - 1 + items.length) % items.length);
  }, [currentIndex, items.length, onIndexChange]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowRight") {
        if (lang === "ar") handlePrev();
        else handleNext();
      } else if (e.key === "ArrowLeft") {
        if (lang === "ar") handleNext();
        else handlePrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose, handleNext, handlePrev, lang]);

  if (!isOpen || items.length === 0) return null;

  const currentItem = items[currentIndex];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Image preview lightbox"
      className="fixed inset-0 z-[100] flex flex-col items-center justify-between bg-black/92 backdrop-blur-xl p-4 sm:p-6 md:p-8 select-none animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Top Bar with Counter and Close Button */}
      <div
        className="w-full max-w-6xl flex items-center justify-between text-white/80 z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono tracking-widest text-[#C6A66B] px-3 py-1 rounded-full bg-[#C6A66B]/15 border border-[#C6A66B]/30">
            {currentIndex + 1} / {items.length}
          </span>
          {currentItem.tag && (
            <span className="text-xs uppercase tracking-wider text-white/60 hidden sm:inline">
              {currentItem.tag}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-2.5 rounded-full bg-white/10 hover:bg-[#C6A66B] hover:text-[#111111] text-white transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A66B]"
          aria-label="Close preview"
          title="Close (Esc)"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Image Stage */}
      <div
        className="relative w-full max-w-5xl flex-1 flex items-center justify-center my-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Previous Button */}
        {items.length > 1 && (
          <button
            type="button"
            onClick={lang === "ar" ? handleNext : handlePrev}
            className="absolute start-2 sm:start-4 z-20 p-3 rounded-full bg-black/50 hover:bg-[#C6A66B] hover:text-[#111111] text-white border border-white/20 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A66B]"
            aria-label="Previous image"
          >
            {lang === "ar" ? <ChevronRight className="w-6 h-6" /> : <ChevronLeft className="w-6 h-6" />}
          </button>
        )}

        {/* Center Image */}
        <div className="relative w-full h-full max-h-[75vh] flex items-center justify-center">
          <Image
            src={currentItem.image}
            alt={currentItem.title}
            fill
            sizes="(max-width: 1200px) 100vw, 1200px"
            className="object-contain drop-shadow-2xl transition-all duration-300"
            priority
          />
        </div>

        {/* Next Button */}
        {items.length > 1 && (
          <button
            type="button"
            onClick={lang === "ar" ? handlePrev : handleNext}
            className="absolute end-2 sm:end-4 z-20 p-3 rounded-full bg-black/50 hover:bg-[#C6A66B] hover:text-[#111111] text-white border border-white/20 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A66B]"
            aria-label="Next image"
          >
            {lang === "ar" ? <ChevronLeft className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
          </button>
        )}
      </div>

      {/* Bottom Caption Bar */}
      <div
        className="w-full max-w-3xl text-center bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 p-4 z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-base sm:text-lg font-bold text-white mb-1">
          {currentItem.title}
        </h3>
        {currentItem.desc && (
          <p className="text-xs sm:text-sm text-white/70 max-w-xl mx-auto leading-relaxed">
            {currentItem.desc}
          </p>
        )}
      </div>
    </div>
  );
}
