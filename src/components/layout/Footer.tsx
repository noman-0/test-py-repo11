"use client";

import React from "react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { BRAND_INFO } from "@/data/brandInfo";
import { Phone, Mail, MapPin, Star, ExternalLink, Clock, ShieldCheck } from "lucide-react";

export const Footer: React.FC = () => {
  const { isAr, t } = useLanguage();

  return (
    <footer className="bg-[#051F1E] text-brand-cream border-t border-surface-green pt-16 pb-24 md:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-surface-green/60">
          {/* Brand Column */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-14 relative flex-shrink-0">
                <Image
                  src="/logos/excelsa-logo-cream.svg"
                  alt="Excelsa Speciality Coffee"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <span className="font-display text-2xl font-bold tracking-wider text-brand-cream">
                  EXCELSA
                </span>
                <span className="block text-xs text-accent-gold font-medium">
                  {isAr ? "اكسالسا كافي" : "Speciality Coffee"}
                </span>
              </div>
            </div>
            <p className="text-xs text-muted-on-green leading-relaxed mb-4">
              {t(BRAND_INFO.tagline.en, BRAND_INFO.tagline.ar)}
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-surface-green text-[11px] text-muted-on-green border border-muted-on-green/20">
              <ShieldCheck className="w-3.5 h-3.5 text-accent-gold" />
              <span>{BRAND_INFO.commercialRegistration}</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="font-display text-lg text-brand-cream mb-4">
              {t("Explore", "استكشف")}
            </h4>
            <ul className="space-y-2 text-xs text-muted-on-green">
              <li>
                <a href="#story" className="hover:text-brand-cream transition-colors">
                  {t("Our Story & Logo Heritage", "قصتنا ورمز الأصالة")}
                </a>
              </li>
              <li>
                <a href="#menu" className="hover:text-brand-cream transition-colors">
                  {t("Interactive Tasting Guide", "دليل تذوق القهوة")}
                </a>
              </li>
              <li>
                <a href="#catering" className="hover:text-brand-cream transition-colors">
                  {t("Home & Majlis Catering", "ضيافة المنازل والمجالس")}
                </a>
              </li>
              <li>
                <a href="#atmosphere" className="hover:text-brand-cream transition-colors">
                  {t("Café Atmosphere & Roastery", "أجواء الكافيه والمحمصة")}
                </a>
              </li>
              <li>
                <a href="#reviews" className="hover:text-brand-cream transition-colors">
                  {t("Google & Cloutly Reviews", "آراء الزوار والتقييمات")}
                </a>
              </li>
            </ul>
          </div>

          {/* Hours & Schedule */}
          <div>
            <h4 className="font-display text-lg text-brand-cream mb-4">
              {t("Opening Hours", "أوقات العمل")}
            </h4>
            <div className="flex items-start gap-2.5 text-xs text-muted-on-green mb-3">
              <Clock className="w-4 h-4 text-accent-gold flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-brand-cream">
                  {t(BRAND_INFO.hours.displayHours.en, BRAND_INFO.hours.displayHours.ar)}
                </p>
                <p className="text-[11px] opacity-75 mt-0.5">
                  {t("Open 7 days a week including official holidays", "نستقبلكم طوال أيام الأسبوع والعطلات")}
                </p>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-surface-green/50 border border-muted-on-green/10 text-[11px] text-muted-on-green">
              <span className="text-accent-gold font-bold block mb-1">
                {t("24/7 Event Catering", "ضيافة المناسبات على مدار الساعة")}
              </span>
              {t(
                "Event booking and mobile barista services operate 24/7 across Qatar upon prior scheduling.",
                "خدمات تحضير وباريستا الفعاليات متوفرة 24 ساعة يومياً داخل قطر بالحجز المسبق."
              )}
            </div>
          </div>

          {/* Doha Location & Contact */}
          <div>
            <h4 className="font-display text-lg text-brand-cream mb-4">
              {t("Doha Hub & Contact", "التواصل وموقع الدوحة")}
            </h4>
            <div className="space-y-3 text-xs text-muted-on-green">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-accent-gold flex-shrink-0 mt-0.5" />
                <span>{t(BRAND_INFO.location.detailedAddress.en, BRAND_INFO.location.detailedAddress.ar)}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-accent-gold flex-shrink-0" />
                <a
                  href={`tel:${BRAND_INFO.phone}`}
                  className="hover:text-brand-cream transition-colors"
                  dir="ltr"
                >
                  {BRAND_INFO.displayPhone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-accent-gold flex-shrink-0" />
                <a
                  href={`mailto:${BRAND_INFO.email}`}
                  className="hover:text-brand-cream transition-colors"
                >
                  {BRAND_INFO.email}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar & MoCI Compliance */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-on-green/70">
          <p>
            © {new Date().getFullYear()} {t(BRAND_INFO.name.en, BRAND_INFO.name.ar)}. {t("All rights reserved.", "جميع الحقوق محفوظة.")}
          </p>
          <div className="flex items-center gap-6 text-[11px]">
            <span>{t("Ministry of Commerce & Industry Compliant", "مرخص ومعتمد من وزارة التجارة والصناعة")}</span>
            <span className="hidden sm:inline">•</span>
            <span>{t("State of Qatar", "دولة قطر")}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
