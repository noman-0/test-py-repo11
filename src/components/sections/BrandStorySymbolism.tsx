"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { SectionHeading } from "@/components/editorial";
import { LOGO_LAYERS, type LogoLayerName } from "@/experience/config/assetManifest";

/** Official logo layers (masks of the official artwork) used to illustrate each symbol. */
function LayerArt({ layers }: { layers: LogoLayerName[] }) {
  return (
    <div className="relative w-[76px] h-[112px] shrink-0" aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={LOGO_LAYERS.frame.path} alt="" className="absolute inset-0 w-full h-full object-contain opacity-15" />
      {layers.map((l) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img key={l} src={LOGO_LAYERS[l].path} alt="" className="absolute inset-0 w-full h-full object-contain" />
      ))}
    </div>
  );
}

export const BrandStorySymbolism: React.FC = () => {
  const { t } = useLanguage();

  const symbols: { id: string; layers: LogoLayerName[]; title: { en: string; ar: string }; subtitle: { en: string; ar: string }; text: { en: string; ar: string } }[] = [
    {
      id: "arch",
      layers: ["frame", "arch"],
      title: { en: "The Arched Frame", ar: "الإطار المقوس" },
      subtitle: { en: "Heritage & craftsmanship", ar: "العراقة والحرفية" },
      text: {
        en: "Drawn from classical archways and timeless doorways — heritage, meticulous craft and enduring trust.",
        ar: "مستوحى من الأقواس المعمارية وبوابات الضيافة العريقة — تراث أصيل وحرفية دقيقة وثقة دائمة.",
      },
    },
    {
      id: "drop",
      layers: ["drop"],
      title: { en: "The Drop & Bean", ar: "قطرة القهوة وحبة البن" },
      subtitle: { en: "Purity & rare origin", ar: "النقاء والمصدر النادر" },
      text: {
        en: "A pure drop cradling a roasted bean — richness, botanical purity and our curation of rare origins.",
        ar: "قطرة نقية تحتضن حبة بن محمصة — غنى ونقاء وانتقاء دقيق لسلالات البن النادرة.",
      },
    },
    {
      id: "rays",
      layers: ["rays"],
      title: { en: "The Rising Morning Rays", ar: "خيوط شمس الصباح" },
      subtitle: { en: "Freshness & awakening", ar: "الانتعاش وإشراقة اليوم" },
      text: {
        en: "Rising lines of fresh steam, aroma and the first light of morning — the start of a perfect day in Doha.",
        ar: "خطوط صاعدة من البخار والعبق وأول ضوء للصباح — بداية يوم مثالي في الدوحة.",
      },
    },
  ];

  return (
    <section id="story" aria-labelledby="story-title" className="py-28 sm:py-36 px-5 sm:px-10 lg:px-14 bg-[#051F1E] relative">
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          id="story-title"
          eyebrow={t("Brand philosophy", "فلسفة الهوية")}
          title={t("The Emblem,", "دلالات الشعار،")}
          italic={t("a symphony of origin.", "ورمز الأصالة.")}
          lede={t(
            "Every line of the Excelsa emblem tells a story — of origin, craft and Qatar's tradition of generous hospitality.",
            "كل خط في شعار اكسالسا يروي حكاية — عن الأصل والحرفية وتقاليد الضيافة القطرية الكريمة."
          )}
        />

        <ol className="border-t border-brand-cream/10">
          {symbols.map((s, i) => (
            <li key={s.id} className="grid xp-cols md:grid-cols-[96px_minmax(0,0.9fr)_minmax(0,1.1fr)] gap-x-10 gap-y-4 py-9 border-b border-brand-cream/10 items-start">
              <LayerArt layers={s.layers} />
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent-gold">
                  {String(i + 1).padStart(2, "0")} — {t(s.subtitle.en, s.subtitle.ar)}
                </p>
                <h3 className="font-display text-3xl text-brand-cream mt-3 leading-tight">{t(s.title.en, s.title.ar)}</h3>
              </div>
              <p className="text-[15px] leading-relaxed text-brand-cream/70 md:pt-7">{t(s.text.en, s.text.ar)}</p>
            </li>
          ))}
        </ol>

        {/* the Excelsa species */}
        <div className="mt-20 grid xp-cols md:grid-cols-[auto_1fr] gap-x-14 gap-y-6 items-center">
          <p className="font-display text-[7rem] sm:text-[9rem] leading-none text-accent-gold/90 tracking-tight" dir="ltr">
            &lt;1%
          </p>
          <div className="max-w-xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-on-green">
              {t("The Excelsa species", "سلالة اكسالسا")}
            </p>
            <h3 className="font-display text-3xl sm:text-4xl text-brand-cream mt-3 leading-tight">
              {t("Under 1% of global coffee.", "أقل من 1% من قهوة العالم.")}
            </h3>
            <p className="mt-4 text-[15px] leading-relaxed text-brand-cream/70">
              {t(
                "Coffea liberica var. dewevrei — a botanical rarity with dark fruit, a lingering tartness and real aromatic depth, at the heart of our Doha roastery.",
                "سلالة (ديففري) النادرة — نكهات فاكهة داكنة وحمضية متوازنة وعمق عطري، في قلب محمصتنا في الدوحة."
              )}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
