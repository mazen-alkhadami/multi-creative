"use client";

import React, { createContext, useContext, useEffect, useState, useSyncExternalStore, useCallback } from "react";
import { Language, Theme, translations, TranslationDictionary } from "@/data/translations";

interface AppContextType {
  lang: Language;
  dir: "rtl" | "ltr";
  theme: Theme;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  t: TranslationDictionary;
  isSearchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
  toggleSearch: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const THEME_STORAGE_KEY = "mc_theme";
const LANG_STORAGE_KEY = "mc_lang";

const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  const handleStorage = (e: StorageEvent) => {
    if (e.key === THEME_STORAGE_KEY || e.key === LANG_STORAGE_KEY) {
      callback();
    }
  };
  window.addEventListener("storage", handleStorage);

  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", handleStorage);
  };
}

function getLangSnapshot(): Language {
  if (typeof window === "undefined") return "ar";
  try {
    const val = localStorage.getItem(LANG_STORAGE_KEY);
    if (val === "ar" || val === "en") return val;
  } catch {}
  return "ar";
}

function getThemeSnapshot(): Theme {
  if (typeof window === "undefined") return "dark";
  try {
    const val = localStorage.getItem(THEME_STORAGE_KEY);
    if (val === "dark" || val === "light") return val;
  } catch {}
  return "dark";
}

function getServerSnapshotLang(): Language {
  return "ar";
}

function getServerSnapshotTheme(): Theme {
  return "dark";
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const lang = useSyncExternalStore(subscribe, getLangSnapshot, getServerSnapshotLang);
  const theme = useSyncExternalStore(subscribe, getThemeSnapshot, getServerSnapshotTheme);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const openSearch = useCallback(() => setIsSearchOpen(true), []);
  const closeSearch = useCallback(() => setIsSearchOpen(false), []);
  const toggleSearch = useCallback(() => setIsSearchOpen((prev) => !prev), []);

  // Global keyboard shortcut (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Synchronize document attributes to state
  useEffect(() => {
    const root = document.documentElement;
    const dir = lang === "ar" ? "rtl" : "ltr";
    root.setAttribute("lang", lang);
    root.setAttribute("dir", dir);
    root.style.colorScheme = theme;

    if (theme === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.add("light");
      root.classList.remove("dark");
    }
    root.setAttribute("data-theme", theme);
  }, [lang, theme]);

  const setLang = (newLang: Language) => {
    try {
      localStorage.setItem(LANG_STORAGE_KEY, newLang);
      notify();
    } catch {}
  };

  const toggleLang = () => {
    setLang(lang === "ar" ? "en" : "ar");
  };

  const setTheme = (newTheme: Theme) => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, newTheme);
      notify();
    } catch {}
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const dir = lang === "ar" ? "rtl" : "ltr";
  const t = translations[lang];

  return (
    <AppContext.Provider
      value={{
        lang,
        dir,
        theme,
        setLang,
        toggleLang,
        setTheme,
        toggleTheme,
        t,
        isSearchOpen,
        openSearch,
        closeSearch,
        toggleSearch,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext(): AppContextType {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}

export function useTranslation(): { t: TranslationDictionary; lang: Language; dir: "rtl" | "ltr" } {
  const { t, lang, dir } = useAppContext();
  return { t, lang, dir };
}

export function useTheme(): { theme: Theme; setTheme: (theme: Theme) => void; toggleTheme: () => void } {
  const { theme, setTheme, toggleTheme } = useAppContext();
  return { theme, setTheme, toggleTheme };
}

export function useLanguage(): {
  lang: Language;
  dir: "rtl" | "ltr";
  setLang: (lang: Language) => void;
  toggleLang: () => void;
} {
  const { lang, dir, setLang, toggleLang } = useAppContext();
  return { lang, dir, setLang, toggleLang };
}

export function useSearch(): {
  isSearchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
  toggleSearch: () => void;
} {
  const { isSearchOpen, openSearch, closeSearch, toggleSearch } = useAppContext();
  return { isSearchOpen, openSearch, closeSearch, toggleSearch };
}
