"use client";

import React from "react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { Wifi, Armchair, Coffee, Users, PackageCheck, Sparkles, Leaf } from "lucide-react";

export const AtmosphereGrid: React.FC = () => {
  const { isAr, t } = useLanguage();

  const amenities = [
    {
      icon: Coffee,
      title: { en: "Specialty Roastery Bar", ar: "بار التحميص والتقطير" },
      desc: {
        en: "Watch master baristas dial in single-origin beans on custom La Marzocco and manual V60 stations.",
        ar: "استمتع بمشاهدة خبرائنا أثناء استخلاص سلالات البن المختص عبر محطات التقطير اليدوي والإسبريسو.",
      },
    },
    {
      icon: Armchair,
      title: { en: "Quiet Workspace Seating", ar: "مساحات عمل هادئة" },
      desc: {
        en: "Ergonomic seating with integrated power outlets designed for professionals, creatives, and meetings.",
        ar: "مقاعد مريحة ومزودة بمنافذ طاقة متكاملة تناسب أصحاب الأعمال والمبدعين لعقد اللقاءات وإنجاز المهام.",
      },
    },
    {
      icon: Wifi,
      title: { en: "High-Speed Wi-Fi", ar: "إنترنت فائق السرعة" },
      desc: {
        en: "Complimentary ultra-fast fiber connectivity across all indoor and outdoor lounge areas.",
        ar: "اتصال ألياف بصرية سريع ومجاني يغطي كافة الأركان والجلسات الداخلية والخارجية.",
      },
    },
    {
      icon: Users,
      title: { en: "Majlis & Social Lounge", ar: "جلسات مجالس ومجموعات" },
      desc: {
        en: "Generous communal seating celebrating Qatari warmth, perfect for family and group gatherings.",
        ar: "جلسات رحبة تحتفي ببهجة اللقاء ودفء الضيافة القطرية، مثالية للعائلات والاجتماعات الودية.",
      },
    },
    {
      icon: PackageCheck,
      title: { en: "Eco-Friendly Craft Packaging", ar: "تغليف صديق للبيئة" },
      desc: {
        en: "100% biodegradable kraft bags, recyclable double-walled cups, and sustainably sourced merchandise.",
        ar: "أكياس كرافت قابلة للتحلل العضوي، أكواب عازلة للحرارة ومعاد تدويرها، ومواد مستدامة بالكامل.",
      },
    },
  ];

  return (
    <section id="atmosphere" className="py-24 px-4 sm:px-6 lg:px-8 bg-brand-green border-t border-surface-green relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-green border border-muted-on-green/20 text-xs text-accent-gold mb-4 font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t("In-Store Experience", "التجربة المكانية")}</span>
          </div>

          <h2 className="font-display text-3xl sm:text-5xl font-bold text-brand-cream mb-6">
            {isAr ? "أجواء الكافيه وتفاصيل الضيافة" : "Café Atmosphere & Artisanal Craft"}
          </h2>

          <p className="text-muted-on-green text-sm sm:text-base leading-relaxed">
            {t(
              "Designed in deep forest green and warm ivory textures, our Doha flagship offers an oasis of calm, connection, and unhurried specialty coffee appreciation.",
              "صُمم فرعنا الرئيسي في الدوحة بدرجات الأخضر الغابي والعاجي الدافئ ليوفر واحة من الهدوء، التفاعل الاجتماعي، والاستمتاع الحقيقي بالقهوة المختصة."
            )}
          </p>
        </div>

        {/* Amenities Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {amenities.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-surface-green/60 hover:bg-surface-green p-6 sm:p-8 rounded-3xl border border-muted-on-green/15 transition-all duration-300 hover:border-accent-gold/40 hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-2xl bg-brand-green border border-accent-gold/30 flex items-center justify-center mb-5">
                  <Icon className="w-6 h-6 text-accent-gold" />
                </div>
                <h3 className="font-display text-xl font-bold text-brand-cream mb-2">
                  {t(item.title.en, item.title.ar)}
                </h3>
                <p className="text-xs sm:text-sm text-muted-on-green leading-relaxed">
                  {t(item.desc.en, item.desc.ar)}
                </p>
              </div>
            );
          })}

          {/* Eco-Friendly Feature Card */}
          <div className="bg-gradient-to-br from-surface-green to-[#062422] p-6 sm:p-8 rounded-3xl border border-accent-gold/30 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-brand-green border border-accent-gold/40 flex items-center justify-center mb-5">
                <Leaf className="w-6 h-6 text-[#A7C4BF]" />
              </div>
              <h3 className="font-display text-xl font-bold text-brand-cream mb-2">
                {isAr ? "الاستدامة والمسؤولية" : "Sustainability & Origin"}
              </h3>
              <p className="text-xs sm:text-sm text-muted-on-green leading-relaxed">
                {t(
                  "From direct-trade farm partnerships to zero-plastic takeaway packaging, we tread lightly on nature while serving Doha's discerning palates.",
                  "من الشراكات المباشرة مع المزارعين إلى التغليف الخالي من البلاستيك، نحرص على حماية الطبيعة مع تقديم أرقى المعايير لروادنا في الدوحة."
                )}
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-muted-on-green/20 text-[11px] text-accent-gold font-semibold uppercase tracking-wider">
              {t("100% Compostable Serviceware", "مستلزمات تقديم قابلة للتحلل")}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
