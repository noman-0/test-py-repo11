"use client";

import React from "react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { BRAND_INFO } from "@/data/brandInfo";
import { LOGO } from "@/experience/config/assetManifest";

const Label = ({ children }: { children: React.ReactNode }) => (
  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-on-green mb-4">{children}</p>
);

export const Footer: React.FC = () => {
  const { isAr, t } = useLanguage();

  const links = [
    { href: "#story", label: t("Our Story & Logo Heritage", "قصتنا ورمز الأصالة") },
    { href: "#menu", label: t("Interactive Tasting Guide", "دليل تذوق القهوة") },
    { href: "#catering", label: t("Home & Majlis Catering", "ضيافة المنازل والمجالس") },
    { href: "#atmosphere", label: t("Café Atmosphere & Roastery", "أجواء الكافيه والمحمصة") },
    { href: "#reviews", label: t("Google & Cloutly Reviews", "آراء الزوار والتقييمات") },
  ];

  return (
    <footer className="bg-[#041A19] text-brand-cream border-t border-brand-cream/10 px-5 sm:px-10 lg:px-14 pt-20 pb-28 md:pb-12">
      <div className="max-w-6xl mx-auto">
        <div className="grid xp-cols md:grid-cols-[1.3fr_1fr_1fr_1fr] gap-12 pb-14 border-b border-brand-cream/10">
          <div>
            <div className="flex items-center gap-4">
              <span className="w-[52px] h-[52px] border border-brand-cream/25 flex items-center justify-center">
                <span className="relative w-7 h-10">
                  <Image src={LOGO.cream.path} alt="Excelsa Speciality Coffee" fill sizes="28px" className="object-contain" />
                </span>
              </span>
              <span>
                <span className="block font-mono text-[13px] uppercase tracking-[0.24em]">{isAr ? "اكسالسا كافي" : "Excelsa"}</span>
                <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-muted-on-green mt-1">
                  {t("Speciality Coffee", "قهوة مختصة")}
                </span>
              </span>
            </div>
            <p className="mt-6 font-display italic text-xl text-brand-cream/80 leading-snug max-w-xs">
              {t(BRAND_INFO.tagline.en, BRAND_INFO.tagline.ar)}
            </p>
          </div>

          <nav aria-label={t("Explore", "استكشف")}>
            <Label>{t("Explore", "استكشف")}</Label>
            <ul className="space-y-2.5 text-sm text-brand-cream/75">
              {links.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="hover:text-accent-gold transition-colors">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <Label>{t("Opening Hours", "أوقات العمل")}</Label>
            <p className="text-sm text-brand-cream">{t(BRAND_INFO.hours.displayHours.en, BRAND_INFO.hours.displayHours.ar)}</p>
            <p className="text-sm text-brand-cream/60 mt-1">{t("Open 7 days a week, including holidays.", "نستقبلكم طوال أيام الأسبوع والعطلات.")}</p>
            <p className="mt-5 text-sm text-brand-cream/60">
              <span className="text-accent-gold">{t("24/7 event catering", "ضيافة المناسبات على مدار الساعة")}</span>
              <br />
              {t("Across Qatar, by prior booking.", "داخل قطر بالحجز المسبق.")}
            </p>
          </div>

          <div>
            <Label>{t("Doha Hub & Contact", "التواصل وموقع الدوحة")}</Label>
            <ul className="space-y-2.5 text-sm text-brand-cream/75">
              <li>{t(BRAND_INFO.location.detailedAddress.en, BRAND_INFO.location.detailedAddress.ar)}</li>
              <li>
                <a href={`tel:${BRAND_INFO.phone}`} dir="ltr" className="hover:text-accent-gold transition-colors">
                  {BRAND_INFO.displayPhone}
                </a>
              </li>
              <li>
                <a href={`mailto:${BRAND_INFO.email}`} className="hover:text-accent-gold transition-colors">
                  {BRAND_INFO.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-on-green">
          <p>
            © {new Date().getFullYear()} {t(BRAND_INFO.name.en, BRAND_INFO.name.ar)} · {t("All rights reserved.", "جميع الحقوق محفوظة.")}
          </p>
          <p className="flex flex-wrap gap-x-6 gap-y-2">
            <span>{BRAND_INFO.commercialRegistration}</span>
            <span>{t("Ministry of Commerce & Industry Compliant", "مرخص ومعتمد من وزارة التجارة والصناعة")}</span>
            <span>{t("State of Qatar", "دولة قطر")}</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
