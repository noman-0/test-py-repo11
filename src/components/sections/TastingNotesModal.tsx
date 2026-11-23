"use client";

import React from "react";
import { MenuItem } from "@/types";
import { useLanguage } from "@/context/LanguageContext";
import { X, Calendar, Sparkles, MapPin, Mountain, Flame, CheckCircle2 } from "lucide-react";

interface Props {
  item: MenuItem | null;
  onClose: () => void;
}

export const TastingNotesModal: React.FC<Props> = ({ item, onClose }) => {
  const { isAr, t } = useLanguage();

  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div 
        className="bg-brand-cream text-brand-green rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border-2 border-accent-gold/40 animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 end-5 p-2 rounded-full bg-brand-green/10 text-brand-green hover:bg-brand-green hover:text-brand-cream transition-all"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Tags */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-brand-green text-brand-cream">
            {item.category.replace("-", " ")}
          </span>
          {item.availableForCatering && (
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-accent-gold/30 text-brand-green border border-accent-gold">
              {t("Event Eligible", "متاح للضيافة")}
            </span>
          )}
        </div>

        {/* Item Title & Price */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <h3 className="font-display text-2xl sm:text-3xl font-bold text-brand-green">
            {t(item.name.en, item.name.ar)}
          </h3>
          <div className="text-xl sm:text-2xl font-display font-bold text-brand-green flex-shrink-0">
            {item.priceQAR} <span className="text-xs font-sans text-muted-on-cream">{t("QAR", "ر.ق")}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs sm:text-sm text-muted-on-cream leading-relaxed mb-6">
          {t(item.description.en, item.description.ar)}
        </p>

        {/* Tasting Notes Flavor Profile */}
        {item.tastingNotes && (
          <div className="mb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-green/70 block mb-2.5">
              {t("Tasting Profile & Flavor Wheel", "ملاحظات التذوق والإيحاءات")}
            </span>
            <div className="flex flex-wrap gap-2">
              {(isAr ? item.tastingNotes.ar : item.tastingNotes.en).map((note, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-xl bg-brand-green text-brand-cream text-xs font-semibold shadow-sm"
                >
                  {note}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Origin & Agronomy Grid */}
        {(item.origin || item.altitude || item.process || item.roastLevel) && (
          <div className="bg-[#F6F0C8] p-4 rounded-2xl mb-6 grid grid-cols-2 gap-3 text-xs">
            {item.origin && (
              <div className="flex items-center gap-2 text-brand-green">
                <MapPin className="w-4 h-4 text-accent-gold flex-shrink-0" />
                <div>
                  <span className="text-[10px] text-muted-on-cream block">{t("Origin", "المصدر")}</span>
                  <span className="font-bold">{t(item.origin.en, item.origin.ar)}</span>
                </div>
              </div>
            )}
            {item.altitude && (
              <div className="flex items-center gap-2 text-brand-green">
                <Mountain className="w-4 h-4 text-accent-gold flex-shrink-0" />
                <div>
                  <span className="text-[10px] text-muted-on-cream block">{t("Altitude", "الارتفاع")}</span>
                  <span className="font-bold">{item.altitude}</span>
                </div>
              </div>
            )}
            {item.process && (
              <div className="flex items-center gap-2 text-brand-green">
                <Sparkles className="w-4 h-4 text-accent-gold flex-shrink-0" />
                <div>
                  <span className="text-[10px] text-muted-on-cream block">{t("Process", "المعالجة")}</span>
                  <span className="font-bold">{t(item.process.en, item.process.ar)}</span>
                </div>
              </div>
            )}
            {item.roastLevel && (
              <div className="flex items-center gap-2 text-brand-green">
                <Flame className="w-4 h-4 text-accent-gold flex-shrink-0" />
                <div>
                  <span className="text-[10px] text-muted-on-cream block">{t("Roast", "التحميص")}</span>
                  <span className="font-bold">{t(item.roastLevel.en, item.roastLevel.ar)}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Dietary Badges */}
        {item.dietaryTags && item.dietaryTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {item.dietaryTags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 text-[11px] text-brand-green/80 bg-brand-green/10 px-2.5 py-1 rounded-lg font-medium"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-accent-gold" />
                <span>{tag.replace("-", " ")}</span>
              </span>
            ))}
          </div>
        )}

        {/* Event Catering Bridge Card */}
        {item.availableForCatering ? (
          <div className="p-4 rounded-2xl bg-brand-green text-brand-cream border border-accent-gold/40 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold text-brand-cream">
                {t("Planning a gathering or majlis?", "هل تخطط لجمعة أو مناسبة؟")}
              </p>
              <p className="text-[11px] text-muted-on-green">
                {t("Available in bulk brew boxes and crates.", "متوفر في صناديق القهوة الكبيرة وقوارير المجموعات.")}
              </p>
            </div>
            <a
              href="#catering"
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl bg-brand-cream text-brand-green font-bold text-xs hover:bg-white transition-all flex items-center gap-1.5 flex-shrink-0 shadow-md"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{t("Book in Bulk", "طلب كميات")}</span>
            </a>
          </div>
        ) : (
          <div className="text-center pt-2">
            <span className="text-[11px] text-muted-on-cream">
              {t("Served fresh daily at our Doha coffee house.", "يُحضر طازجاً يومياً في كافيه ومحمصة الدوحة.")}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
