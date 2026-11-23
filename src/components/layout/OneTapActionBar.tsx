"use client";

import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { BRAND_INFO } from "@/data/brandInfo";
import { MapPin, Phone, MessageCircle, Navigation, X } from "lucide-react";

export const OneTapActionBar: React.FC = () => {
  const { isAr, t } = useLanguage();
  const [mapsOpen, setMapsOpen] = useState(false);

  const whatsappGreeting = isAr
    ? "مرحباً اكسالسا كافي، أود الاستفسار عن تجربة القهوة ومواعيد الزيارة اليوم."
    : "Hello Excelsa Coffee, I have a question about visiting the café and your specialty brews.";

  const whatsappUrl = `https://wa.me/${BRAND_INFO.phone.replace("+", "")}?text=${encodeURIComponent(
    whatsappGreeting
  )}`;

  return (
    <>
      {/* Persistent Bottom Bar on Mobile */}
      <aside aria-label="Quick Action Bar" className="fixed bottom-0 start-0 end-0 z-40 bg-brand-green/95 backdrop-blur-lg border-t border-surface-green px-3 py-2.5 sm:hidden">
        <div className="grid grid-cols-3 gap-2">
          {/* Directions Button */}
          <button
            onClick={() => setMapsOpen(true)}
            className="flex flex-col items-center justify-center py-2 px-1 rounded-none bg-surface-green text-brand-cream font-mono text-[10px] uppercase tracking-[0.12em] active:scale-95 transition-all"
          >
            <MapPin className="w-4 h-4 text-accent-gold mb-0.5" />
            <span>{t("Directions", "الاتجاهات")}</span>
          </button>

          {/* Direct Call Button */}
          <a
            href={`tel:${BRAND_INFO.phone}`}
            className="flex flex-col items-center justify-center py-2 px-1 rounded-none bg-surface-green text-brand-cream font-mono text-[10px] uppercase tracking-[0.12em] active:scale-95 transition-all"
          >
            <Phone className="w-4 h-4 text-accent-gold mb-0.5" />
            <span>{t("Call Now", "اتصال مباشر")}</span>
          </a>

          {/* WhatsApp Concierge */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center py-2 px-1 rounded-none bg-[#25D366]/20 border border-[#25D366]/40 text-brand-cream font-mono text-[10px] uppercase tracking-[0.12em] active:scale-95 transition-all"
          >
            <MessageCircle className="w-4 h-4 text-[#25D366] mb-0.5" />
            <span>{t("WhatsApp", "واتساب")}</span>
          </a>
        </div>
      </aside>

      {/* Map Choice Modal */}
      {mapsOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="bg-brand-green border border-surface-green rounded-none p-6 w-full max-w-sm text-center animate-in fade-in slide-in-from-bottom-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-display text-lg text-brand-cream">
                {t("Choose Your Maps App", "اختر تطبيق الخرائط")}
              </h3>
              <button
                onClick={() => setMapsOpen(false)}
                className="p-1 rounded-full text-muted-on-green hover:text-brand-cream"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-muted-on-green mb-6 leading-relaxed">
              {t(
                "Navigate directly to Excelsa Speciality Coffee in Doha.",
                "انتقل مباشرة إلى فرع اكسالسا كافي المختص في الدوحة."
              )}
            </p>

            <div className="space-y-3">
              <a
                href={BRAND_INFO.location.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMapsOpen(false)}
                className="w-full py-3 px-4 rounded-none bg-surface-green text-brand-cream text-sm font-semibold flex items-center justify-center gap-3 hover:bg-surface-green-hover transition-colors"
              >
                <Navigation className="w-4 h-4 text-accent-gold" />
                <span>Google Maps</span>
              </a>
              <a
                href={BRAND_INFO.location.appleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMapsOpen(false)}
                className="w-full py-3 px-4 rounded-none bg-surface-green text-brand-cream text-sm font-semibold flex items-center justify-center gap-3 hover:bg-surface-green-hover transition-colors"
              >
                <Navigation className="w-4 h-4 text-accent-gold" />
                <span>Apple Maps</span>
              </a>
              <a
                href={BRAND_INFO.location.wazeUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMapsOpen(false)}
                className="w-full py-3 px-4 rounded-none bg-surface-green text-brand-cream text-sm font-semibold flex items-center justify-center gap-3 hover:bg-surface-green-hover transition-colors"
              >
                <Navigation className="w-4 h-4 text-accent-gold" />
                <span>Waze</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
