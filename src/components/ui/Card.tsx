import React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: "default" | "elevated" | "interactive";
  glow?: boolean;
  className?: string;
}

export function Card({
  children,
  variant = "default",
  glow = false,
  className = "",
  ...props
}: CardProps) {
  const baseStyles =
    "relative rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 transition-all duration-300 ease-out";

  const variantStyles = {
    default: "",
    elevated: "bg-[var(--bg-surface-elevated)] shadow-lg shadow-black/10",
    interactive:
      "hover:border-[#C6A66B]/40 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#C6A66B]/5 cursor-pointer group",
  }[variant];

  const glowStyles = glow ? "border-[#C6A66B]/40 shadow-[0_0_30px_rgba(198,166,107,0.12)]" : "";

  return (
    <div className={cn(baseStyles, variantStyles, glowStyles, className)} {...props}>
      {children}
    </div>
  );
}
