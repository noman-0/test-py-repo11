"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { getDohaCafeStatus } from "@/utils/dohaTime";
import { BRAND_INFO } from "@/data/brandInfo";
import { Phone, Globe, Menu as MenuIcon, X, Calendar, MapPin } from "lucide-react";

export const Navbar: React.FC = () => {
  const { locale, isAr, toggleLocale, t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [status, setStatus] = useState({ isOpen: true, badgeText: "Open Now • Closes 11 PM", subText: "Doha" });

  useEffect(() => {
    setStatus(getDohaCafeStatus(locale));
    const interval = setInterval(() => {
      setStatus(getDohaCafeStatus(locale));
    }, 60000);

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      clearInterval(interval);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [locale]);

  const navLinks = [
    { href: "#story", label: t("Our Heritage", "قصتنا وأصالتنا") },
    { href: "#menu", label: t("Tasting Guide", "قائمة التذوق") },
    { href: "#catering", label: t("Event Catering", "ضيافة المناسبات") },
    { href: "#atmosphere", label: t("Atmosphere", "أجواء الكافيه") },
    { href: "#hub", label: t("Doha Hub", "فرع الدوحة") },
  ];

  return (
    <header
      className={`fixed top-0 start-0 end-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-brand-green/95 backdrop-blur-md shadow-xl border-b border-surface-green py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo & Brand Name */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-10 h-14 relative flex-shrink-0 transition-transform duration-300 group-hover:scale-105">
              <Image
                src="/logos/excelsa-logo-cream.svg"
                alt="Excelsa Speciality Coffee"
                fill
                priority
                className="object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-xl sm:text-2xl font-bold tracking-wider text-brand-cream leading-tight">
                EXCELSA
              </span>
              <span className="text-[10px] sm:text-xs text-accent-gold font-semibold tracking-widest uppercase">
                {isAr ? "اكسالسا كافي • الدوحة" : "Speciality Coffee • Doha"}
              </span>
            </div>
          </a>

          {/* Live Doha Status Pill (Desktop) */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-green/80 border border-muted-on-green/20 text-xs">
            <span
              className={`w-2 h-2 rounded-full ${
                status.isOpen ? "bg-emerald-400 animate-pulse" : "bg-rose-400"
              }`}
            />
            <span className="text-brand-cream font-medium">{status.badgeText}</span>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-brand-cream/80 hover:text-brand-cream transition-colors relative py-1 after:absolute after:bottom-0 after:start-0 after:w-0 after:h-0.5 after:bg-accent-gold hover:after:w-full after:transition-all"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Action Items */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Language Switcher */}
            <button
              onClick={toggleLocale}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-muted-on-green/30 text-xs font-semibold text-brand-cream hover:bg-surface-green transition-all"
              title="Switch Language"
            >
              <Globe className="w-3.5 h-3.5 text-accent-gold" />
              <span>{isAr ? "English" : "العربية"}</span>
            </button>

            {/* Direct Call */}
            <a
              href={`tel:${BRAND_INFO.phone}`}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-green text-xs font-semibold text-brand-cream hover:bg-surface-green-hover transition-all border border-muted-on-green/20"
            >
              <Phone className="w-3.5 h-3.5 text-accent-gold" />
              <span dir="ltr">{BRAND_INFO.displayPhone}</span>
            </a>

            {/* Event Catering Quick Button */}
            <a
              href="#catering"
              className="px-4 py-2 rounded-xl bg-brand-cream text-brand-green font-bold text-xs sm:text-sm hover:bg-white transition-all shadow-md hover:shadow-lg flex items-center gap-1.5"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{t("Book Catering", "حجز ضيافة")}</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={toggleLocale}
              className="px-2.5 py-1 rounded-lg border border-muted-on-green/30 text-xs font-bold text-brand-cream"
            >
              {isAr ? "EN" : "عربي"}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-brand-cream hover:bg-surface-green"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden pt-4 pb-6 mt-3 border-t border-surface-green bg-brand-green/95 rounded-2xl p-4 shadow-2xl animate-in fade-in slide-in-from-top-4">
            <div className="flex items-center gap-2 mb-4 px-2 py-1.5 rounded-xl bg-surface-green text-xs">
              <span
                className={`w-2 h-2 rounded-full ${
                  status.isOpen ? "bg-emerald-400 animate-pulse" : "bg-rose-400"
                }`}
              />
              <span className="text-brand-cream font-medium">{status.badgeText}</span>
            </div>

            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg text-brand-cream/90 hover:bg-surface-green font-medium text-sm transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-2 border-t border-surface-green flex flex-col gap-2">
                <a
                  href={`tel:${BRAND_INFO.phone}`}
                  className="w-full py-2.5 px-4 rounded-xl bg-surface-green text-brand-cream text-center text-xs font-semibold flex items-center justify-center gap-2"
                >
                  <Phone className="w-3.5 h-3.5 text-accent-gold" />
                  <span dir="ltr">{BRAND_INFO.displayPhone}</span>
                </a>
                <a
                  href="#catering"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 px-4 rounded-xl bg-brand-cream text-brand-green text-center text-xs font-bold shadow-md"
                >
                  {t("Book Event Catering", "طلب حجز ضيافة المناسبات")}
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
