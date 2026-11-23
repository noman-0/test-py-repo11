"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Armchair, Coffee, Leaf, PackageCheck, Users, Wifi } from "lucide-react";
import { SectionHeading } from "@/components/editorial";

export const AtmosphereGrid: React.FC = () => {
  const { t } = useLanguage();

  const features = [
    {
      icon: Coffee,
      title: { en: "Specialty Roastery Bar", ar: "بار التحميص والتقطير" },
      desc: {
        en: "Baristas dial in single-origin beans on custom La Marzocco and manual V60 stations.",
        ar: "خبراؤنا يستخلصون سلالات البن المختص عبر محطات الإسبريسو والتقطير اليدوي V60.",
      },
    },
    {
      icon: Armchair,
      title: { en: "Quiet Workspace Seating", ar: "مساحات عمل هادئة" },
      desc: {
        en: "Ergonomic seating with built-in power, made for focused work and meetings.",
        ar: "مقاعد مريحة مزودة بمنافذ طاقة للعمل المركّز واللقاءات.",
      },
    },
    {
      icon: Wifi,
      title: { en: "High-Speed Wi-Fi", ar: "إنترنت فائق السرعة" },
      desc: {
        en: "Complimentary fibre connectivity across our indoor and outdoor lounges.",
        ar: "اتصال ألياف بصرية مجاني في الجلسات الداخلية والخارجية.",
      },
    },
    {
      icon: Users,
      title: { en: "Majlis & Social Lounge", ar: "جلسات مجالس ومجموعات" },
      desc: {
        en: "Generous communal seating for family and group gatherings, in true Qatari warmth.",
        ar: "جلسات رحبة للعائلات والمجموعات بدفء الضيافة القطرية.",
      },
    },
    {
      icon: PackageCheck,
      title: { en: "Eco-Friendly Craft Packaging", ar: "تغليف صديق للبيئة" },
      desc: {
        en: "Biodegradable kraft bags, recyclable double-walled cups and sustainable merchandise.",
        ar: "أكياس كرافت قابلة للتحلل، أكواب مزدوجة الجدار قابلة للتدوير، ومنتجات مستدامة.",
      },
    },
    {
      icon: Leaf,
      title: { en: "Sustainability & Origin", ar: "الاستدامة والمسؤولية" },
      desc: {
        en: "Direct-trade farm partnerships and zero-plastic takeaway packaging.",
        ar: "شراكات مباشرة مع المزارعين وتغليف خالٍ من البلاستيك.",
      },
      tag: { en: "100% Compostable Serviceware", ar: "مستلزمات تقديم قابلة للتحلل" },
    },
  ];

  return (
    <section id="atmosphere" aria-labelledby="atmosphere-title" className="py-28 sm:py-36 px-5 sm:px-10 lg:px-14 bg-brand-green border-t border-brand-cream/5 relative">
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          id="atmosphere-title"
          eyebrow={t("In-store experience", "التجربة المكانية")}
          title={t("Café Atmosphere", "أجواء الكافيه")}
          italic={t("& artisanal craft.", "وتفاصيل الضيافة.")}
          lede={t(
            "Deep forest green and warm ivory — a calm Doha flagship for unhurried specialty coffee.",
            "الأخضر الغابي والعاجي الدافئ — فرع هادئ في الدوحة للاستمتاع بالقهوة المختصة على مهل."
          )}
        />

        <ul className="grid xp-cols md:grid-cols-2 gap-x-16 border-t border-brand-cream/10">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <li key={i} className="flex gap-6 py-8 border-b border-brand-cream/10">
                <span className="font-mono text-[11px] tracking-[0.16em] text-muted-on-green pt-1.5 w-6 shrink-0">{String(i + 1).padStart(2, "0")}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-accent-gold shrink-0" strokeWidth={1.5} aria-hidden="true" />
                    <h3 className="font-display text-2xl text-brand-cream leading-tight">{t(f.title.en, f.title.ar)}</h3>
                  </div>
                  <p className="mt-3 text-[15px] leading-relaxed text-brand-cream/70">{t(f.desc.en, f.desc.ar)}</p>
                  {f.tag && <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.16em] text-accent-gold">{t(f.tag.en, f.tag.ar)}</p>}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};
