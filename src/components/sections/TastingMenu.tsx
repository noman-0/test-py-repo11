"use client";

import React, { useState } from "react";
import { MENU_ITEMS } from "@/data/menuData";
import { MenuItem, CategoryType } from "@/types";
import { useLanguage } from "@/context/LanguageContext";
import { TastingNotesModal } from "./TastingNotesModal";
import { Sparkles, ArrowUpRight, Calendar, Coffee } from "lucide-react";

export const TastingMenu: React.FC = () => {
  const { isAr, t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>("all");
  const [activeModalItem, setActiveModalItem] = useState<MenuItem | null>(null);

  const categories: { id: CategoryType; label: { en: string; ar: string } }[] = [
    { id: "all", label: { en: "All Offerings", ar: "جميع الأصناف" } },
    { id: "espresso", label: { en: "Espresso Bar", ar: "ركن الإسبريسو" } },
    { id: "pour-over", label: { en: "Manual Pour-Over", ar: "التقطير اليدوي" } },
    { id: "cold-brew", label: { en: "Signature Cold Brews", ar: "المشروبات الباردة" } },
    { id: "pastries", label: { en: "Artisanal Pastries", ar: "المخبوزات الحرفية" } },
    { id: "beans", label: { en: "Packaged Beans (250g)", ar: "حبوب بن مختصة" } },
  ];

  const filteredItems = selectedCategory === "all"
    ? MENU_ITEMS
    : MENU_ITEMS.filter((item) => item.category === selectedCategory);

  return (
    <section id="menu" className="py-24 px-4 sm:px-6 lg:px-8 bg-brand-green relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-green border border-muted-on-green/20 text-xs text-accent-gold mb-4 font-semibold uppercase tracking-wider">
            <Coffee className="w-3.5 h-3.5" />
            <span>{t("Editorial Tasting Guide", "دليل التذوق الحرفي")}</span>
          </div>

          <h2 className="font-display text-3xl sm:text-5xl font-bold text-brand-cream mb-4">
            {isAr ? "قائمة التذوق والاكتشاف" : "The Tasting Guide & Discovery"}
          </h2>

          <p className="text-muted-on-green text-sm sm:text-base leading-relaxed">
            {t(
              "An artisanal showcase of in-café specialty extractions, seasonal microlots, and curated pastries. Click any item to explore its origin and flavor wheel.",
              "دليل متجدد لمشروبات مقهانا، المحاصيل الموسمية النادرة، والمخبوزات الطازجة. اضغط على أي صنف لاكتشاف سلالته ونكهاته الاستثنائية."
            )}
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-12 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                selectedCategory === cat.id
                  ? "bg-brand-cream text-brand-green shadow-lg scale-105"
                  : "bg-surface-green text-brand-cream hover:bg-surface-green-hover border border-muted-on-green/15"
              }`}
            >
              {t(cat.label.en, cat.label.ar)}
            </button>
          ))}
        </div>

        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-surface-green/70 hover:bg-surface-green rounded-3xl p-6 sm:p-7 border border-muted-on-green/20 flex flex-col justify-between transition-all duration-300 hover:border-accent-gold/40 hover:-translate-y-1 shadow-lg group"
            >
              <div>
                {/* Top Card Meta: Category & Event Badge */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-brand-green text-accent-gold border border-muted-on-green/20">
                    {item.category.replace("-", " ")}
                  </span>
                  {item.availableForCatering && (
                    <a
                      href="#catering"
                      className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-accent-gold/20 text-brand-cream border border-accent-gold/50 hover:bg-accent-gold hover:text-brand-green transition-colors inline-flex items-center gap-1"
                      title={t("Order in bulk for events", "متوفر للمناسبات والمجالس")}
                    >
                      <Calendar className="w-2.5 h-2.5" />
                      <span>{t("For Events", "للمناسبات")}</span>
                    </a>
                  )}
                </div>

                {/* Title & Price */}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-brand-cream group-hover:text-accent-gold transition-colors">
                    {t(item.name.en, item.name.ar)}
                  </h3>
                  <div className="text-lg font-display font-bold text-brand-cream flex-shrink-0">
                    {item.priceQAR} <span className="text-[11px] font-sans text-accent-gold">{t("QAR", "ر.ق")}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-muted-on-green line-clamp-2 leading-relaxed mb-4">
                  {t(item.description.en, item.description.ar)}
                </p>

                {/* Flavor Notes Preview */}
                {item.tastingNotes && (
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {(isAr ? item.tastingNotes.ar : item.tastingNotes.en).slice(0, 3).map((note, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-brand-green/80 text-brand-cream border border-muted-on-green/10"
                      >
                        {note}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Button: Trigger Modal */}
              <button
                onClick={() => setActiveModalItem(item)}
                className="w-full py-2.5 px-4 rounded-xl bg-brand-green text-brand-cream text-xs font-semibold border border-muted-on-green/30 hover:border-brand-cream hover:bg-surface-green-hover transition-all flex items-center justify-center gap-2 group-hover:bg-brand-cream group-hover:text-brand-green"
              >
                <span>{t("Tasting Notes & Origin", "تفاصيل التذوق والمصدر")}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* In-Café Notice Banner */}
        <div className="mt-12 text-center p-6 rounded-2xl bg-surface-green/40 border border-muted-on-green/10 max-w-2xl mx-auto">
          <p className="text-xs text-muted-on-green">
            {t(
              "Prices displayed in Qatari Riyal (QAR). Seasonal micro-lots and specialty bakery batches are prepared fresh daily at our Doha coffee house.",
              "الأسعار بالريال القطري ومحدثة. يتم تحميص المحاصيل النادرة وخبز الحلويات طازجة يومياً في فرعنا بالدوحة."
            )}
          </p>
        </div>
      </div>

      {/* Tasting Profile Detail Modal */}
      <TastingNotesModal
        item={activeModalItem}
        onClose={() => setActiveModalItem(null)}
      />
    </section>
  );
};
