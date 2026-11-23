"use client";

import React, { useEffect, useState } from "react";
import { MENU_ITEMS } from "@/data/menuData";
import { MenuItem, CategoryType } from "@/types";
import { useLanguage } from "@/context/LanguageContext";
import { TastingNotesModal } from "./TastingNotesModal";
import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/components/editorial";

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
  const categoryLabel = (id: string) => {
    const c = categories.find((x) => x.id === id);
    return c ? t(c.label.en, c.label.ar) : id;
  };

  // 3D tasting bar / points of interest can open this same modal for a menu item
  // (additive hook; the modal component itself is unchanged).
  useEffect(() => {
    const onOpen = (e: Event) => {
      const id = (e as CustomEvent<{ id?: string }>).detail?.id;
      const item = MENU_ITEMS.find((m) => m.id === id);
      if (item) setActiveModalItem(item);
    };
    window.addEventListener("excelsa:open-tasting", onOpen);
    return () => window.removeEventListener("excelsa:open-tasting", onOpen);
  }, []);

  const filteredItems = selectedCategory === "all" ? MENU_ITEMS : MENU_ITEMS.filter((item) => item.category === selectedCategory);

  return (
    <section id="menu" aria-labelledby="menu-title" className="py-28 sm:py-36 px-5 sm:px-10 lg:px-14 bg-brand-green relative">
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          id="menu-title"
          eyebrow={t("Editorial tasting guide", "دليل التذوق الحرفي")}
          title={t("The Tasting Guide", "قائمة التذوق")}
          italic={t("& discovery.", "والاكتشاف.")}
          lede={t(
            "Single origins, slow brews and fresh bakes. Select any item for its tasting notes and origin.",
            "محاصيل أحادية المصدر، تقطير هادئ ومخبوزات طازجة. اختر أي صنف لتعرف ملاحظات تذوقه ومصدره."
          )}
        />

        {/* category filter */}
        <div className="flex gap-x-7 gap-y-3 flex-wrap border-b border-brand-cream/10 pb-px mb-2" role="group" aria-label={t("Filter the menu", "تصفية القائمة")}>
          {categories.map((cat) => {
            const active = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                aria-pressed={active}
                onClick={() => setSelectedCategory(cat.id)}
                className={`relative pb-3 font-mono text-[11px] uppercase tracking-[0.16em] transition-colors ${
                  active ? "text-brand-cream" : "text-muted-on-green hover:text-brand-cream"
                }`}
              >
                {t(cat.label.en, cat.label.ar)}
                <span className={`absolute inset-x-0 -bottom-px h-px ${active ? "bg-accent-gold" : "bg-transparent"}`} aria-hidden="true" />
              </button>
            );
          })}
        </div>

        {/* menu list */}
        <ul className="grid xp-cols md:grid-cols-2 gap-x-16">
          {filteredItems.map((item) => (
            <li key={item.id} className="py-8 border-b border-brand-cream/10 flex flex-col">
              <div className="flex items-baseline justify-between gap-6">
                <h3 className="font-display text-2xl sm:text-[1.7rem] text-brand-cream leading-tight">{t(item.name.en, item.name.ar)}</h3>
                <p className="font-mono text-[13px] text-brand-cream shrink-0 tabular-nums" dir="ltr">
                  {item.priceQAR} <span className="text-[10px] text-accent-gold">{t("QAR", "ر.ق")}</span>
                </p>
              </div>
              <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-on-green">
                {categoryLabel(item.category)}
                {item.origin ? ` · ${t(item.origin.en, item.origin.ar)}` : ""}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-brand-cream/70 line-clamp-2">{t(item.description.en, item.description.ar)}</p>
              {item.tastingNotes && (
                <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.14em] text-accent-gold/90">
                  {(isAr ? item.tastingNotes.ar : item.tastingNotes.en).slice(0, 3).join(" · ")}
                </p>
              )}
              <div className="mt-5 flex items-center gap-6">
                <button
                  type="button"
                  onClick={() => setActiveModalItem(item)}
                  className="group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-brand-cream border-b border-accent-gold/50 pb-1 hover:border-accent-gold hover:text-accent-gold transition-colors"
                >
                  <span>{t("Tasting Notes & Origin", "تفاصيل التذوق والمصدر")}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 rtl:-scale-x-100" aria-hidden="true" />
                </button>
                {item.availableForCatering && (
                  <a
                    href="#catering"
                    title={t("Order in bulk for events", "متوفر للمناسبات والمجالس")}
                    className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-on-green hover:text-brand-cream transition-colors"
                  >
                    + {t("For events", "للمناسبات")}
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>

        <p className="mt-12 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-on-green max-w-xl leading-relaxed">
          {t(
            "Prices in Qatari Riyal. Micro-lots and bakes are prepared fresh daily at our Doha coffee house.",
            "الأسعار بالريال القطري. نحضّر المحاصيل الخاصة والمخبوزات طازجة يومياً في فرعنا بالدوحة."
          )}
        </p>
      </div>

      {/* Tasting Profile Detail Modal (unchanged component) */}
      <TastingNotesModal
        item={activeModalItem}
        onClose={() => {
          setActiveModalItem(null);
          window.dispatchEvent(new Event("excelsa:tasting-closed"));
        }}
      />
    </section>
  );
};
