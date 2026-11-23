"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "link";
  size?: "sm" | "md" | "lg";
  href?: string;
  icon?: React.ReactNode;
  iconPosition?: "start" | "end";
  children: React.ReactNode;
  className?: string;
}

export function Button({
  variant = "primary",
  size = "md",
  href,
  icon,
  iconPosition = "end",
  children,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A66B] focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer select-none";

  const sizeStyles = {
    sm: "text-xs px-3.5 py-1.5 rounded-full gap-1.5",
    md: "text-sm px-5 py-2.5 rounded-full gap-2",
    lg: "text-base px-7 py-3.5 rounded-full gap-2.5",
  }[size];

  const variantStyles = {
    primary:
      "bg-[#C6A66B] text-[#111111] font-semibold hover:bg-[#D8BC84] active:bg-[#A8884C] shadow-[0_0_20px_rgba(198,166,107,0.22)] hover:shadow-[0_0_28px_rgba(198,166,107,0.38)] hover:-translate-y-0.5",
    secondary:
      "bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] border border-[var(--border-subtle)] hover:border-[#C6A66B]/50 hover:bg-[var(--bg-surface)] hover:-translate-y-0.5 shadow-sm",
    outline:
      "bg-transparent text-[var(--text-primary)] border border-[var(--border-subtle)] hover:border-[#C6A66B] hover:text-[#C6A66B] hover:bg-[var(--accent-gold-subtle)] hover:-translate-y-0.5",
    ghost:
      "bg-transparent text-[var(--text-primary)] hover:text-[#C6A66B] hover:bg-[var(--accent-gold-subtle)]",
    link:
      "bg-transparent text-[#C6A66B] underline-offset-4 hover:underline p-0 h-auto rounded-none",
  }[variant];

  const content = (
    <>
      {icon && iconPosition === "start" && <span className="inline-flex shrink-0">{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === "end" && <span className="inline-flex shrink-0">{icon}</span>}
    </>
  );

  const combinedClass = cn(baseStyles, sizeStyles, variantStyles, className);

  if (href) {
    return (
      <Link href={href} className={combinedClass}>
        {content}
      </Link>
    );
  }

  return (
    <button disabled={disabled} className={combinedClass} {...props}>
      {content}
    </button>
  );
}
