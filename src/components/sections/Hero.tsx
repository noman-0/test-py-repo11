"use client";

import React from "react";
import Image from "next/image";
import { ArrowDown } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { LOGO } from "@/experience/config/assetManifest";
import { BRAND_INFO } from "@/data/brandInfo";
import { Eyebrow, LineButton } from "@/components/editorial";

export const Hero: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section
      data-scene="hero"
      className="relative min-h-[100svh] flex items-end px-5 sm:px-10 lg:px-14 pt-36 pb-16 sm:pb-20 overflow-hidden bg-brand-green"
    >
      {/* quiet brand backdrop */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_75%_35%,#0E3F3C,transparent_70%)] pointer-events-none" />

      <div className="relative w-full max-w-7xl mx-auto grid lg:grid-cols-[1.25fr_1fr] gap-14 items-end">
        <div>
          <Eyebrow>{t("Speciality coffee · Doha", "قهوة مختصة · الدوحة")}</Eyebrow>

          <h1 className="font-display text-[3.2rem] leading-[0.98] sm:text-7xl lg:text-[6.5rem] text-brand-cream tracking-tight mt-6">
            {t("The Journey of Coffee", "رحلة البن الفاخر")}
            <em className="block italic font-normal text-accent-gold/90 mt-1">{t("From Nature to Cup", "من الطبيعة إلى فنجانك")}</em>
          </h1>

          <p className="mt-8 text-[15px] sm:text-base leading-relaxed text-brand-cream/75 max-w-lg">
            {t(
              "Single-origin brews, house-roasted beans and 24/7 event catering for Qatar's majlis and corporate gatherings.",
              "قهوة مختصة أحادية المصدر، تحميص منزلي، وضيافة مناسبات على مدار الساعة للمجالس والفعاليات في قطر."
            )}
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4">
            <LineButton href="#catering" variant="solid" className="sm:min-w-[250px]">
              {t("Book Event Catering", "احجز ضيافة مناسبة")}
            </LineButton>
            <LineButton href="#menu" className="sm:min-w-[250px]">
              {t("Explore Tasting Guide", "استكشف دليل التذوق")}
            </LineButton>
          </div>

          <div className="mt-14 flex flex-wrap items-center gap-x-8 gap-y-3 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-on-green">
            <span>{t(BRAND_INFO.hours.displayHours.en, BRAND_INFO.hours.displayHours.ar)}</span>
            <span className="hidden sm:inline text-brand-cream/20" aria-hidden="true">
              /
            </span>
            <span>{t("24/7 event catering", "ضيافة المناسبات 24/7")}</span>
            <a href="#story" className="ms-auto inline-flex items-center gap-2 text-brand-cream/70 hover:text-accent-gold transition-colors">
              {t("Discover Our Heritage", "اكتشف أصالتنا")}
              <ArrowDown className="w-3.5 h-3.5 motion-safe:animate-bounce" aria-hidden="true" />
            </a>
          </div>
        </div>

        {/* official emblem in a hairline arch (the logo's own arched frame) */}
        <div className="hidden lg:flex justify-center" aria-hidden="true">
          <div className="relative w-[340px] h-[480px] rounded-t-full border border-brand-cream/15 flex items-center justify-center">
            <div className="relative w-[200px] h-[296px]">
              <Image src={LOGO.cream.path} alt="" fill priority sizes="200px" className="object-contain" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
