"use client";

import React from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { Compass, Sparkles, SunMedium, Shield, Award } from "lucide-react";

export const BrandStorySymbolism: React.FC = () => {
  const { isAr, t } = useLanguage();

  const storyCards = [
    {
      id: "arch",
      title: {
        en: "The Arched Frame",
        ar: "الإطار المقوس",
      },
      subtitle: {
        en: "Heritage & Craftsmanship",
        ar: "العراقة والأصالة والحرفية",
      },
      description: {
        en: "Inspired by classical architectural archways and timeless doorways, the frame represents heritage, meticulous craftsmanship, and enduring trust—symbolizing a refined, curated coffee experience.",
        ar: "مستوحى من الأقواس المعمارية وبوابات الضيافة العريقة. يجسد الإطار التراث الأصيل، الحرفية الدقيقة، والثقة الدائمة، رمزاً لتجربة قهوة راقية لا مثيل لها.",
      },
      icon: Shield,
    },
    {
      id: "drop",
      title: {
        en: "The Drop & Bean",
        ar: "قطرة القهوة وحبة البن",
      },
      subtitle: {
        en: "Purity & Rare Origin",
        ar: "النقاء والندرة والمصدر الموثوق",
      },
      description: {
        en: "At the center, the pure coffee drop cradling a roasted bean signifies richness, botanical purity, and our relentless curation of rare specialty origins—honoring the true Excelsa heritage.",
        ar: "في قلب الشعار، تحتضن القطرة النقية حبة بن محمصة، دلالة على الغنى العطري، النقاء العضوي، والتزامنا بانتقاء سلالات البن النادرة بكل أمانة وشغف.",
      },
      icon: Award,
    },
    {
      id: "rays",
      title: {
        en: "The Rising Morning Rays",
        ar: "خيوط شمس الصباح",
      },
      subtitle: {
        en: "Freshness & Awakening",
        ar: "الانتعاش والعبق وإشراقة اليوم",
      },
      description: {
        en: "The ascending lines above evoke fresh steam, intoxicating aromas, and the first rays of morning sunlight—celebrating the invigorating start of a perfect day in Doha.",
        ar: "تعكس الخطوط الصاعدة في قمة الشعار عبق القهوة المتصاعد، الانتعاش الصباحي، وخيوط الشمس الأولى التي تحتفي ببدء يوم مثالي ملهم في الدوحة.",
      },
      icon: SunMedium,
    },
  ];

  return (
    <section id="story" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#051F1E] relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-surface-green/40 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-green border border-muted-on-green/20 text-xs text-accent-gold mb-4 font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t("Brand Philosophy", "فلسفة الهوية")}</span>
          </div>

          <h2 className="font-display text-3xl sm:text-5xl font-bold text-brand-cream mb-6">
            {isAr ? "دلالات الشعار ورمز الأصالة" : "The Emblem: A Symphony of Origin"}
          </h2>

          <p className="text-muted-on-green text-sm sm:text-base leading-relaxed">
            {t(
              "Every curve and line in Excelsa's emblem tells the story of passion, ethical sourcing, and Qatar's revered tradition of generous hospitality.",
              "كل انحناءة وخط في شعار اكسالسا يروي فصول الشغف، التجارة العادلة، وتقاليد الضيافة القطرية الأصيلة التي نعتز بها."
            )}
          </p>
        </div>

        {/* 3 Story Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {storyCards.map((card, idx) => {
            const IconComponent = card.icon;
            return (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                className="bg-surface-green/80 hover:bg-surface-green rounded-3xl p-8 border border-muted-on-green/20 flex flex-col justify-between transition-all duration-300 hover:border-accent-gold/50 hover:shadow-2xl group"
              >
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-brand-green border border-accent-gold/40 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <IconComponent className="w-7 h-7 text-accent-gold" />
                  </div>

                  <span className="text-[11px] font-bold text-accent-gold uppercase tracking-wider block mb-1">
                    {t(card.subtitle.en, card.subtitle.ar)}
                  </span>

                  <h3 className="font-display text-2xl font-bold text-brand-cream mb-4">
                    {t(card.title.en, card.title.ar)}
                  </h3>

                  <p className="text-xs sm:text-sm text-muted-on-green leading-relaxed">
                    {t(card.description.en, card.description.ar)}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-muted-on-green/10 flex items-center justify-between text-xs text-accent-gold/80 font-medium">
                  <span>0{idx + 1}</span>
                  <span className="w-8 h-px bg-accent-gold/40" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Botanical Excelsa Story Feature */}
        <div className="mt-16 rounded-3xl bg-brand-green p-8 sm:p-12 border border-surface-green flex flex-col lg:flex-row items-center gap-8 shadow-2xl">
          <div className="w-20 h-20 rounded-2xl bg-surface-green border border-accent-gold/40 flex items-center justify-center flex-shrink-0">
            <Compass className="w-10 h-10 text-accent-gold" />
          </div>
          <div className="flex-1 text-center lg:text-start">
            <h4 className="font-display text-2xl sm:text-3xl text-brand-cream mb-2">
              {isAr ? "سلالة اكسالسا: ندرة تمثل أقل من 1% عالمياً" : "The Excelsa Species: Under 1% of Global Coffee"}
            </h4>
            <p className="text-xs sm:text-sm text-muted-on-green leading-relaxed">
              {t(
                "Named after Coffea liberica var. dewevrei, Excelsa beans represent an extraordinary botanical rarity. Renowned for their complex dark fruit profile, lingering tartness, and aromatic depth, they embody the unconventional artistry at the core of our Doha roastery.",
                "استمدت اكسالسا اسمها من سلالة البن النادرة (ديففري)، التي تشكل أقل من 1% من إنتاج القهوة حول العالم. تتميز بنكهاتها الغنية بالفاكهة الاستوائية، حمضيتها المتوازنة، وعمقها العطري، لتكون رمزاً للحرفية والتميز في الدوحة."
              )}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
