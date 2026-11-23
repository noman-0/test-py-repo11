"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { BRAND_INFO } from "@/data/brandInfo";
import { getDohaCafeStatus } from "@/utils/dohaTime";
import { ArrowUpRight, MessageCircle, Phone } from "lucide-react";
import { LineButton, SectionHeading } from "@/components/editorial";

export const DohaHub: React.FC = () => {
  const { isAr, t } = useLanguage();
  const [status, setStatus] = useState({ isOpen: true, badgeText: "Open Now • Closes 11:00 PM", subText: "Doha" });

  useEffect(() => {
    setStatus(getDohaCafeStatus(isAr ? "ar" : "en"));
  }, [isAr]);

  const whatsappConciergeUrl = `https://wa.me/${BRAND_INFO.phone.replace("+", "")}?text=${encodeURIComponent(
    isAr
      ? "مرحباً اكسالسا كافي، أود الاستفسار عن تجربة القهوة أو زيارة فرع الدوحة اليوم."
      : "Hello Excelsa Coffee, I have an inquiry about visiting the Doha café or scheduling a tasting."
  )}`;

  return (
    <section id="hub" aria-labelledby="hub-title" className="py-28 sm:py-36 px-5 sm:px-10 lg:px-14 bg-[#051F1E] relative">
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          id="hub-title"
          eyebrow={t("Doha destination", "وجهتنا في الدوحة")}
          title={t("Visit Our Doha", "تفضل بزيارتنا")}
          italic={t("flagship & roastery.", "في قلب الدوحة.")}
          lede={t(
            "Forest-green calm, freshly ground specialty beans and authentic Qatari hospitality.",
            "هدوء الأخضر الغابي، عبق البن المحمص طازجاً، وكرم الضيافة القطرية."
          )}
        />

        <div className="grid xp-cols lg:grid-cols-2 gap-x-20 gap-y-16">
          {/* visit */}
          <div>
            <p className="flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.16em] text-brand-cream">
              <span className={`w-2 h-2 rounded-full ${status.isOpen ? "bg-emerald-400" : "bg-rose-400"}`} aria-hidden="true" />
              {status.badgeText}
            </p>
            <h3 className="font-display text-4xl text-brand-cream mt-6">{t(BRAND_INFO.location.en, BRAND_INFO.location.ar)}</h3>
            <p className="mt-2 text-[15px] text-brand-cream/70">{t(BRAND_INFO.location.detailedAddress.en, BRAND_INFO.location.detailedAddress.ar)}</p>

            <dl className="mt-8 border-t border-brand-cream/10 text-sm">
              <div className="flex justify-between gap-6 py-4 border-b border-brand-cream/10">
                <dt className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-on-green">{t("Café Hours", "مواعيد الكافيه")}</dt>
                <dd className="text-brand-cream text-end">{t(BRAND_INFO.hours.displayHours.en, BRAND_INFO.hours.displayHours.ar)}</dd>
              </div>
              <div className="flex justify-between gap-6 py-4 border-b border-brand-cream/10">
                <dt className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-on-green">{t("Event Catering", "ضيافة المناسبات")}</dt>
                <dd className="text-accent-gold text-end">{t("24/7 By Reservation", "24/7 بالحجز المسبق")}</dd>
              </div>
            </dl>

            <div className="mt-8 flex flex-col gap-3">
              <LineButton href={BRAND_INFO.location.googleMapsUrl} target="_blank" rel="noopener noreferrer" variant="solid">
                {t("Get Directions (Google / Apple Maps)", "الحصول على الاتجاهات (الخرائط)")}
              </LineButton>
              <div className="grid grid-cols-2 gap-3">
                <LineButton href={`tel:${BRAND_INFO.phone}`} icon={<Phone className="w-4 h-4" aria-hidden="true" />}>
                  <span dir="ltr">{BRAND_INFO.displayPhone}</span>
                </LineButton>
                <LineButton href={whatsappConciergeUrl} target="_blank" rel="noopener noreferrer" icon={<MessageCircle className="w-4 h-4" aria-hidden="true" />}>
                  {t("WhatsApp", "واتساب")}
                </LineButton>
              </div>
            </div>
          </div>

          {/* reviews (the café table standee, brand guide p.22) */}
          <div id="reviews">
            <p className="font-mono text-[13px] tracking-[0.3em] text-accent-gold" aria-label={t("Five stars", "خمس نجوم")}>
              ★★★★★
            </p>
            <h3 className="font-display text-4xl text-brand-cream mt-5 leading-tight">{isAr ? "هل أعجبتك قهوتنا وخدمتنا؟" : "Happy with our service?"}</h3>
            <p className="mt-3 text-[15px] leading-relaxed text-brand-cream/70 max-w-md">
              {t("Help spread the word — review us on Google or Cloutly, as on our café table standees.", "شاركنا رأيك وساعد الآخرين في اكتشاف قهوتنا — قيّمنا عبر جوجل أو كلاوتلي.")}
            </p>

            <figure className="mt-8 border-s-2 border-accent-gold/60 ps-6">
              <blockquote className="font-display italic text-xl sm:text-2xl text-brand-cream/90 leading-snug">
                {t(
                  "“The single-origin V60 and the cardamom buns are unmatched in Doha. Their 5L catering box was the highlight of our Friday majlis!”",
                  "“محصول الـ V60 ولفائف الهيل لا مثيل لها في قطر. صندوق القهوة المقطرة 5 لتر أضاف لمسة ضيافة رائعة لمجلسنا!”"
                )}
              </blockquote>
              <figcaption className="mt-4 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-on-green">— Jassim Al-Sulaiti (Doha) ★★★★★</figcaption>
            </figure>

            <div className="mt-10 grid sm:grid-cols-2 gap-3">
              <LineButton href={BRAND_INFO.socials.googleReviews} target="_blank" rel="noopener noreferrer" variant="solid">
                {t("Review on Google", "تقييم عبر Google")}
              </LineButton>
              <LineButton href={BRAND_INFO.socials.cloutlyReviews} target="_blank" rel="noopener noreferrer" icon={<ArrowUpRight className="w-4 h-4 rtl:-scale-x-100" aria-hidden="true" />}>
                {t("Review on Cloutly", "تقييم عبر Cloutly")}
              </LineButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
