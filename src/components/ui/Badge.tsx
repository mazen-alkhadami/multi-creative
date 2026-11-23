import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps {
  children: React.ReactNode;
  variant?: "gold" | "subtle" | "outline";
  size?: "sm" | "md" | "lg";
  showDot?: boolean;
  className?: string;
}

export function Badge({
  children,
  variant = "gold",
  size = "md",
  showDot = true,
  className = "",
}: BadgeProps) {
  const variantStyles = {
    gold: "bg-[#C6A66B]/10 text-[#C6A66B] border border-[#C6A66B]/30",
    subtle: "bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] border border-[var(--border-subtle)]",
    outline: "bg-transparent text-[var(--text-primary)] border border-[var(--border-subtle)]",
  }[variant];

  const sizeStyles = {
    sm: "px-2.5 py-0.5 text-[11px]",
    md: "px-3 py-1 text-xs",
    lg: "px-3.5 py-1.5 text-sm",
  }[size];

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full font-medium tracking-wide backdrop-blur-sm select-none",
        variantStyles,
        sizeStyles,
        className
      )}
    >
      {showDot && (
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C6A66B] opacity-75" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#C6A66B]" />
        </span>
      )}
      <span>{children}</span>
    </div>
  );
}
