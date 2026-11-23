"use client";

import React, { useState } from "react";
import { CONTACT_CONFIG } from "@/data/contactConfig";
import { useLanguage } from "@/hooks";

export function FloatingWhatsAppButton() {
  const { lang } = useLanguage();
  const [hovered, setHovered] = useState(false);

  return (
    <aside
      aria-label={lang === "ar" ? "تواصل مباشر عبر واتساب" : "Direct WhatsApp Chat"}
      className="fixed bottom-6 end-6 z-40 flex items-center group pointer-events-auto"
    >
      {/* Tooltip Label */}
      <div
        className={`hidden sm:inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold me-3 transition-all duration-300 pointer-events-none select-none shadow-lg border ${
          hovered
            ? "opacity-100 translate-x-0 bg-[var(--bg-surface-elevated)] text-[var(--accent-gold)] border-[#C6A66B]/40"
            : "opacity-0 translate-x-2 bg-[var(--bg-surface)] text-[var(--text-secondary)] border-[var(--border-subtle)]"
        }`}
      >
        <span>{lang === "ar" ? "تواصل عبر واتساب" : "Chat on WhatsApp"}</span>
        <span className="ms-2 w-1.5 h-1.5 rounded-full bg-[#C6A66B] animate-pulse" />
      </div>

      {/* Floating Action Button */}
      <a
        href={CONTACT_CONFIG.phone.whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={lang === "ar" ? "تواصل عبر واتساب (+967779628873)" : "Chat on WhatsApp (+967779628873)"}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="w-14 h-14 rounded-full bg-[#C6A66B] hover:bg-[#D8BC84] text-[#111111] flex items-center justify-center shadow-xl shadow-black/25 transition-all duration-300 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A66B] focus-visible:ring-offset-2 relative"
        style={{
          boxShadow: hovered
            ? "0 0 25px rgba(198, 166, 107, 0.45)"
            : "0 10px 25px -5px rgba(0, 0, 0, 0.4), 0 0 15px rgba(198, 166, 107, 0.25)",
        }}
      >
        {/* Subtle Gold Halo on Hover */}
        <span
          className={`absolute -inset-0.5 rounded-full transition-opacity duration-300 pointer-events-none ${
            hovered ? "opacity-100 ring-2 ring-[#C6A66B]/50" : "opacity-0"
          }`}
        />

        {/* Crisp WhatsApp Vector Symbol */}
        <svg
          viewBox="0 0 24 24"
          width="28"
          height="28"
          fill="currentColor"
          className="relative z-10"
        >
          <path d="M17.507 14.307l-.009.075c-.238-.12-1.406-.693-1.624-.772-.218-.08-.377-.12-.535.12-.158.24-.614.772-.752.932-.139.16-.277.18-.515.06-.238-.12-1.005-.37-1.913-1.18-.708-.63-1.187-1.41-1.326-1.65-.139-.24-.015-.37.105-.49.108-.107.239-.279.358-.419.12-.14.159-.24.238-.4.079-.16.039-.3-.02-.42-.059-.12-.535-1.29-.733-1.77-.193-.467-.39-.403-.535-.411-.138-.008-.297-.01-.456-.01-.158 0-.416.06-.634.3-.218.24-.832.813-.832 1.984 0 1.171.852 2.302.971 2.462.119.16 1.676 2.56 4.06 3.587.568.244 1.011.39 1.356.5.57.183 1.09.157 1.5.096.458-.068 1.406-.575 1.604-1.13.198-.556.198-1.032.139-1.132-.059-.1-.218-.16-.456-.28zM12.012 2.003c-5.508 0-9.988 4.48-9.988 9.989 0 1.76.459 3.48 1.33 5.002L2 22l5.143-1.348c1.472.802 3.136 1.226 4.869 1.226 5.508 0 9.988-4.48 9.988-9.989 0-5.509-4.48-9.989-9.988-9.989zm0 18.226c-1.512 0-2.993-.406-4.286-1.175l-.307-.182-3.18.834.849-3.101-.2-.318a8.214 8.214 0 01-1.26-4.395c0-4.542 3.695-8.238 8.239-8.238 4.543 0 8.238 3.696 8.238 8.238 0 4.542-3.695 8.238-8.238 8.238z" />
        </svg>

        {/* Live Active Interaction Dot */}
        <span className="absolute top-1 end-1 w-2.5 h-2.5 rounded-full bg-[#C6A66B] border border-[#111111] z-20" />
      </a>
    </aside>
  );
}
