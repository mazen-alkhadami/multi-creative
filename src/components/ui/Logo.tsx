"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useAppContext } from "@/context/AppContext";

export interface LogoProps {
  variant?: "auto" | "gold" | "light" | "dark" | "original";
  showWordmark?: boolean;
  size?: "sm" | "md" | "lg";
  href?: string;
  className?: string;
}

export function Logo({
  variant = "auto",
  showWordmark = true,
  size = "md",
  href = "/",
  className = "",
}: LogoProps) {
  const { theme, lang } = useAppContext();

  // Determine which asset to display while strictly preserving original symbol geometry (632x392)
  let logoSrc = "/images/logo-original.png";

  if (variant === "gold") {
    logoSrc = "/images/logo-gold.png";
  } else if (variant === "light") {
    logoSrc = "/images/logo-light.png";
  } else if (variant === "dark") {
    logoSrc = "/images/logo-dark.png";
  } else if (variant === "auto") {
    // In dark theme, gold shines with luxury distinction; in light theme, gold or dark
    logoSrc = theme === "dark" ? "/images/logo-gold.png" : "/images/logo-dark.png";
  }

  const dimensions = {
    sm: { width: 34, height: 21, wordmarkClass: "text-base", subClass: "text-[9px]" },
    md: { width: 44, height: 27, wordmarkClass: "text-lg", subClass: "text-[10px]" },
    lg: { width: 58, height: 36, wordmarkClass: "text-2xl", subClass: "text-xs" },
  }[size];

  const content = (
    <div className={`inline-flex items-center gap-3 select-none group ${className}`}>
      {/* Official Symbol - Preserving exact geometry and proportions */}
      <div className="relative flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
        <Image
          src={logoSrc}
          alt="MULTI CREATIVES Mark"
          width={dimensions.width}
          height={dimensions.height}
          priority
          className="object-contain"
          style={{ width: "auto", height: `${dimensions.height}px` }}
        />
      </div>

      {showWordmark && (
        <div className="flex flex-col">
          <span
            className={`font-bold tracking-wider leading-none text-primary transition-colors group-hover:text-gold ${dimensions.wordmarkClass}`}
            style={{ letterSpacing: lang === "ar" ? "0.02em" : "0.08em" }}
          >
            MULTI CREATIVES
          </span>
          <span
            className={`text-muted uppercase tracking-widest leading-tight mt-0.5 hidden sm:inline-block ${dimensions.subClass}`}
            style={{ color: "var(--text-secondary)" }}
          >
            {lang === "ar" ? "الإبداع والحلول الرقمية" : "Creative & Digital Solutions"}
          </span>
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} aria-label="MULTI CREATIVES Home" className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A66B] rounded-lg">
        {content}
      </Link>
    );
  }

  return content;
}
