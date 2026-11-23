"use client";

import React from "react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { ArrowDown, Calendar, Sparkles, MapPin, Coffee } from "lucide-react";

export const Hero: React.FC = () => {
  const { isAr, t } = useLanguage();

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center pt-28 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden bg-brand-green">
      {/* Background Subtle Gradient & Light Radial */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,#0E3F3C,transparent)] pointer-events-none" />

      {/* Decorative Heritage Arches in Background */}
      <div className="absolute -top-32 start-1/2 -translate-x-1/2 w-[700px] h-[700px] border border-muted-on-green/10 rounded-full pointer-events-none" />
      <div className="absolute -top-48 start-1/2 -translate-x-1/2 w-[950px] h-[950px] border border-muted-on-green/5 rounded-full pointer-events-none" />

      <div className="relative max-w-5xl mx-auto text-center z-10 flex flex-col items-center">
        {/* Top Floating Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-green/90 border border-accent-gold/40 text-xs sm:text-sm text-brand-cream mb-8 shadow-xl animate-in fade-in slide-in-from-top-4 duration-700">
          <Sparkles className="w-4 h-4 text-accent-gold flex-shrink-0" />
          <span className="font-medium">
            {t(
              "24/7 Luxury Coffee Catering & Specialty Roastery in Doha",
              "ضيافة القهوة الفاخرة على مدار 24 ساعة ومحمصة مختصة في الدوحة"
            )}
          </span>
        </div>

        {/* Central Emblem Reveal */}
        <div className="w-24 h-36 sm:w-28 sm:h-44 relative mb-6 drop-shadow-2xl hover:scale-105 transition-transform duration-500">
          <Image
            src="/logos/excelsa-logo-cream.svg"
            alt="Excelsa Emblem"
            fill
            priority
            className="object-contain"
          />
        </div>

        {/* Brand Headline */}
        <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-brand-cream max-w-4xl leading-[1.15] mb-6">
          {isAr ? (
            <>
              رحلة البن الفاخر <br />
              <span className="text-accent-gold italic font-serif">من أحضان الطبيعة إلى فنجانك</span>
            </>
          ) : (
            <>
              The Journey of Coffee <br />
              <span className="text-accent-gold italic font-serif">From Nature to Cup</span>
            </>
          )}
        </h1>

        {/* Editorial Subtitle */}
        <p className="text-muted-on-green text-base sm:text-xl max-w-2xl leading-relaxed mb-10">
          {t(
            "An artisanal haven for single-origin brews, house-roasted beans, and bespoke 24/7 event catering tailored for Qatar's finest majlis and corporate gatherings.",
            "ملاذ أصيل لعشاق القهوة المختصة، التحميص الحرفي، وضيافة الفعاليات الفاخرة المجهزة خصيصاً للمجالس القطرية والمناسبات الراقية."
          )}
        </p>

        {/* Dual Primary Call-to-Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          {/* Catering Button */}
          <a
            href="#catering"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-brand-cream text-brand-green font-bold text-sm sm:text-base hover:bg-white transition-all shadow-xl hover:shadow-2xl flex items-center justify-center gap-2.5 active:scale-95 group"
          >
            <Calendar className="w-4 h-4 text-brand-green group-hover:scale-110 transition-transform" />
            <span>{t("Book Event Catering", "طلب حجز ضيافة المناسبات")}</span>
          </a>

          {/* Menu Button */}
          <a
            href="#menu"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-surface-green/80 text-brand-cream font-semibold text-sm sm:text-base border border-muted-on-green/30 hover:bg-surface-green-hover transition-all flex items-center justify-center gap-2.5 active:scale-95"
          >
            <Coffee className="w-4 h-4 text-accent-gold" />
            <span>{t("Explore Tasting Guide", "استكشف دليل التذوق")}</span>
          </a>
        </div>

        {/* Scroll Indicator */}
        <div className="mt-16 flex flex-col items-center gap-2 opacity-60 hover:opacity-100 transition-opacity">
          <span className="text-[11px] text-muted-on-green uppercase tracking-widest">
            {t("Discover Our Heritage", "اكتشف أصالتنا")}
          </span>
          <ArrowDown className="w-4 h-4 text-accent-gold animate-bounce" />
        </div>
      </div>
    </section>
  );
};
