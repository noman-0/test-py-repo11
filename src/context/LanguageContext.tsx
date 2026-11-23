"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Locale = "en" | "ar";

interface LanguageContextType {
  locale: Locale;
  isAr: boolean;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
  t: (en: string, ar: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    // Check saved preference or browser language
    const saved = localStorage.getItem("excelsa_locale") as Locale;
    if (saved === "ar" || saved === "en") {
      setLocaleState(saved);
      document.documentElement.lang = saved;
      document.documentElement.dir = saved === "ar" ? "rtl" : "ltr";
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("excelsa_locale", newLocale);
    document.documentElement.lang = newLocale;
    document.documentElement.dir = newLocale === "ar" ? "rtl" : "ltr";
  };

  const toggleLocale = () => {
    setLocale(locale === "en" ? "ar" : "en");
  };

  const t = (en: string, ar: string) => {
    return locale === "ar" ? ar : en;
  };

  return (
    <LanguageContext.Provider value={{ locale, isAr: locale === "ar", setLocale, toggleLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
