"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowUpRight, X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { getDohaCafeStatus } from "@/utils/dohaTime";
import { BRAND_INFO } from "@/data/brandInfo";
import { LOGO } from "@/experience/config/assetManifest";
import { ExperienceToggles } from "@/experience/ui/ExperienceToggles";
import { useExperience } from "@/experience/store";
import { goArea, goToSection } from "@/experience/actions";
import { AREA_IDS, type AreaId } from "@/experience/config/world";
import { AREA_TEXT } from "@/experience/content/areas";

const pad = (n: number) => String(n).padStart(2, "0");

/** Index glyph (two stacked rows of lines), as in the reference's "file index". */
const IndexGlyph = () => (
  <svg width="14" height="12" viewBox="0 0 14 12" aria-hidden="true" className="shrink-0">
    <path d="M0 1h5M0 6h5M0 11h5M8 1h6M8 6h6M8 11h6" stroke="currentColor" strokeWidth="1.2" />
  </svg>
);

export const Navbar: React.FC = () => {
  const { locale, isAr, toggleLocale, t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [status, setStatus] = useState({ isOpen: true, badgeText: "", subText: "" });
  const indexOpen = useExperience((s) => s.indexOpen);
  const setStore = useExperience((s) => s.set);
  const enabled = useExperience((s) => s.enabled);
  const currentArea = useExperience((s) => s.area);
  const indexBtn = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setStatus(getDohaCafeStatus(locale));
    const interval = setInterval(() => setStatus(getDohaCafeStatus(locale)), 60000);
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearInterval(interval);
      window.removeEventListener("scroll", onScroll);
    };
  }, [locale]);

  const setIndex = (open: boolean) => setStore({ indexOpen: open });

  // index dialog: focus in, Esc to close, focus trap, focus back to the button
  useEffect(() => {
    if (!indexOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const first = dialogRef.current?.querySelector<HTMLElement>("button, a");
    requestAnimationFrame(() => first?.focus());
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setIndex(false);
      } else if (e.key === "Tab" && dialogRef.current) {
        const f = [...dialogRef.current.querySelectorAll<HTMLElement>("button, a[href]")].filter((el) => el.offsetParent !== null);
        if (!f.length) return;
        if (e.shiftKey && document.activeElement === f[0]) {
          e.preventDefault();
          f[f.length - 1].focus();
        } else if (!e.shiftKey && document.activeElement === f[f.length - 1]) {
          e.preventDefault();
          f[0].focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
      indexBtn.current?.focus({ preventScroll: true });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [indexOpen]);

  const go = (area: AreaId) => {
    setIndex(false);
    if (enabled) goArea(area);
    else requestAnimationFrame(() => goToSection(area));
  };

  const whatsappUrl = `https://wa.me/${BRAND_INFO.phone.replace("+", "")}`;
  const solid = scrolled && !enabled;

  return (
    <>
      <header
        className={`xp-header fixed top-0 inset-x-0 z-50 transition-colors duration-300 ${
          solid ? "bg-brand-green/95 border-b border-brand-cream/10" : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className={`mx-auto px-5 sm:px-10 lg:px-14 flex items-center justify-between gap-6 transition-[padding] duration-300 ${solid ? "py-3" : "py-5 sm:py-7"}`}>
          {/* brand */}
          <a href="#" className="flex items-center gap-4 group" aria-label={t(BRAND_INFO.name.en, BRAND_INFO.name.ar)}>
            <span className="relative w-11 h-11 sm:w-[52px] sm:h-[52px] border border-brand-cream/30 flex items-center justify-center shrink-0 group-hover:border-accent-gold/70 transition-colors">
              <span className="relative w-6 h-9 sm:w-7 sm:h-10">
                <Image src={LOGO.cream.path} alt="" fill priority sizes="28px" className="object-contain" />
              </span>
            </span>
            <span className="flex flex-col">
              <span className="font-mono text-[12px] sm:text-[13px] uppercase tracking-[0.24em] text-brand-cream">
                {isAr ? "اكسالسا كافي" : "Excelsa"}
              </span>
              <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-muted-on-green mt-1">
                {t("Speciality coffee · Doha", "قهوة مختصة · الدوحة")}
              </span>
            </span>
          </a>

          {/* actions */}
          <div className="flex items-center gap-5 lg:gap-7">
            <span className="hidden xl:flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-on-green">
              <span className={`w-1.5 h-1.5 rounded-full ${status.isOpen ? "bg-emerald-400" : "bg-rose-400"}`} aria-hidden="true" />
              {status.badgeText}
            </span>
            <ExperienceToggles className="hidden lg:flex" />
            <button
              type="button"
              onClick={toggleLocale}
              title="Switch Language"
              lang={isAr ? "en" : "ar"}
              className="font-mono text-[11px] uppercase tracking-[0.16em] text-brand-cream hover:text-accent-gold transition-colors"
            >
              <span className="hidden sm:inline">{isAr ? "English" : "العربية"}</span>
              <span className="sm:hidden">{isAr ? "EN" : "عربي"}</span>
            </button>
            <a
              href="#catering"
              className="hidden md:inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-accent-gold hover:text-brand-cream transition-colors"
            >
              {t("Book catering", "حجز ضيافة")}
              <ArrowUpRight className="w-3.5 h-3.5 rtl:-scale-x-100" aria-hidden="true" />
            </a>
            <button
              ref={indexBtn}
              type="button"
              onClick={() => setIndex(true)}
              aria-haspopup="dialog"
              aria-expanded={indexOpen}
              aria-controls="site-index"
              className="h-11 sm:h-[52px] px-4 sm:px-5 border border-brand-cream/30 hover:border-accent-gold/70 text-brand-cream flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.16em] transition-colors"
            >
              <span>{t("Index", "الفهرس")}</span>
              <IndexGlyph />
            </button>
          </div>
        </div>
      </header>

      {/* ── site index (menu) ───────────────────────────────────── */}
      {indexOpen && (
        <div
          id="site-index"
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={t("Site index", "فهرس الموقع")}
          className="fixed inset-0 z-[90] bg-brand-green/[0.98] overflow-y-auto"
        >
          <div className="min-h-full px-5 sm:px-10 lg:px-14 py-6 sm:py-8 flex flex-col">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-on-green">
                + {t("Index", "الفهرس")} / {t("Excelsa Speciality Coffee", "اكسالسا كافي")}
              </span>
              <button
                type="button"
                onClick={() => setIndex(false)}
                className="h-11 sm:h-[52px] px-4 sm:px-5 border border-brand-cream/30 hover:border-accent-gold/70 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.16em] text-brand-cream"
              >
                {t("Close", "إغلاق")}
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            <div className="flex-1 grid lg:grid-cols-[1.4fr_1fr] gap-12 lg:gap-20 mt-10 sm:mt-14">
              <nav aria-label={t("Sections", "الأقسام")}>
                <ol className="border-t border-brand-cream/10">
                  {AREA_IDS.map((a, i) => {
                    const c = AREA_TEXT[a];
                    const active = enabled && currentArea === a;
                    return (
                      <li key={a} className="border-b border-brand-cream/10">
                        <button
                          type="button"
                          onClick={() => go(a)}
                          aria-current={active ? "location" : undefined}
                          className="w-full flex items-baseline gap-5 sm:gap-8 py-4 sm:py-5 text-start group"
                        >
                          <span className="font-mono text-[11px] tracking-[0.18em] text-muted-on-green w-8 shrink-0">{pad(i + 1)}</span>
                          <span
                            className={`font-display text-3xl sm:text-5xl leading-none transition-colors ${
                              active ? "text-accent-gold" : "text-brand-cream group-hover:text-accent-gold"
                            }`}
                          >
                            {t(c.label.en, c.label.ar)}
                          </span>
                          <span className="ms-auto hidden sm:block font-mono text-[10px] uppercase tracking-[0.18em] text-muted-on-green">
                            {t(c.place.en, c.place.ar)}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ol>
              </nav>

              <div className="flex flex-col gap-10 text-sm">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-on-green mb-3">{t("Visit", "الزيارة")}</p>
                  <p className="text-brand-cream">{t(BRAND_INFO.location.detailedAddress.en, BRAND_INFO.location.detailedAddress.ar)}</p>
                  <p className="text-muted-on-green mt-1">{t(BRAND_INFO.hours.displayHours.en, BRAND_INFO.hours.displayHours.ar)}</p>
                  <p className="mt-3 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-on-green">
                    <span className={`w-1.5 h-1.5 rounded-full ${status.isOpen ? "bg-emerald-400" : "bg-rose-400"}`} aria-hidden="true" />
                    {status.badgeText}
                  </p>
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-on-green mb-3">{t("Contact", "التواصل")}</p>
                  <ul className="space-y-2">
                    <li>
                      <a href={`tel:${BRAND_INFO.phone}`} dir="ltr" className="text-brand-cream hover:text-accent-gold">
                        {BRAND_INFO.displayPhone}
                      </a>
                    </li>
                    <li>
                      <a href={`mailto:${BRAND_INFO.email}`} className="text-brand-cream hover:text-accent-gold">
                        {BRAND_INFO.email}
                      </a>
                    </li>
                    <li>
                      <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-brand-cream hover:text-accent-gold">
                        WhatsApp ↗
                      </a>
                    </li>
                    <li>
                      <a href={BRAND_INFO.location.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="text-brand-cream hover:text-accent-gold">
                        {t("Get directions", "الحصول على الاتجاهات")} ↗
                      </a>
                    </li>
                  </ul>
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-on-green mb-3">{t("Settings", "الإعدادات")}</p>
                  <div className="flex flex-wrap items-center gap-6">
                    <ExperienceToggles />
                    <button
                      type="button"
                      onClick={toggleLocale}
                      className="font-mono text-[11px] uppercase tracking-[0.16em] text-brand-cream hover:text-accent-gold"
                    >
                      {isAr ? "English" : "العربية"}
                    </button>
                  </div>
                </div>
                <a
                  href="#catering"
                  onClick={() => setIndex(false)}
                  className="self-start inline-flex items-center justify-between gap-8 min-h-[52px] px-5 bg-brand-cream text-brand-green font-mono text-[12px] uppercase tracking-[0.16em] hover:bg-white"
                >
                  {t("Book event catering", "احجز ضيافة مناسبة")}
                  <ArrowUpRight className="w-4 h-4 rtl:-scale-x-100" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
