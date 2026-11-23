"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { BRAND_INFO } from "@/data/brandInfo";
import { getDohaCafeStatus } from "@/utils/dohaTime";
import { MapPin, Phone, MessageCircle, Star, Navigation, Clock, ShieldCheck, ExternalLink, QrCode } from "lucide-react";

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
    <section id="hub" className="py-24 px-4 sm:px-6 lg:px-8 bg-brand-green border-t border-surface-green relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-green border border-muted-on-green/20 text-xs text-accent-gold mb-4 font-semibold uppercase tracking-wider">
            <MapPin className="w-3.5 h-3.5" />
            <span>{t("Doha Destination", "وجهتنا في الدوحة")}</span>
          </div>

          <h2 className="font-display text-3xl sm:text-5xl font-bold text-brand-cream mb-4">
            {isAr ? "تفضل بزيارتنا في قلب الدوحة" : "Visit Our Doha Flagship & Roastery"}
          </h2>

          <p className="text-muted-on-green text-sm sm:text-base leading-relaxed">
            {t(
              "Step into our serene sanctuary crafted with deep forest green warmth, the soothing aroma of freshly ground specialty beans, and authentic Qatari hospitality.",
              "تفضل بزيارة مساحتنا المصممة بأناقة الأخضر الغابي، واستمتع بعبق البن المحمص طازجاً وكرم الضيافة القطرية."
            )}
          </p>
        </div>

        {/* 2-Column Hub Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch mb-16">
          {/* Left Column: Interactive Location & Quick Actions */}
          <div className="bg-surface-green/80 rounded-3xl p-8 sm:p-10 border border-muted-on-green/20 flex flex-col justify-between shadow-2xl">
            <div>
              {/* Live Status Pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-green border border-muted-on-green/20 text-xs mb-6">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    status.isOpen ? "bg-emerald-400 animate-pulse" : "bg-rose-400"
                  }`}
                />
                <span className="text-brand-cream font-bold">{status.badgeText}</span>
              </div>

              <h3 className="font-display text-2xl sm:text-3xl text-brand-cream font-bold mb-3">
                {t(BRAND_INFO.location.en, BRAND_INFO.location.ar)}
              </h3>

              <p className="text-sm text-muted-on-green leading-relaxed mb-6">
                {t(BRAND_INFO.location.detailedAddress.en, BRAND_INFO.location.detailedAddress.ar)}
              </p>

              {/* Hours Grid */}
              <div className="bg-brand-green/70 rounded-2xl p-5 mb-8 border border-muted-on-green/15 text-xs text-brand-cream space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-muted-on-green/15">
                  <span className="flex items-center gap-2 text-muted-on-green">
                    <Clock className="w-4 h-4 text-accent-gold" />
                    <span>{t("Café Hours", "مواعيد الكافيه")}</span>
                  </span>
                  <span className="font-bold">
                    {t(BRAND_INFO.hours.displayHours.en, BRAND_INFO.hours.displayHours.ar)}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-1 text-[11px] text-muted-on-green">
                  <span>{t("Event Catering", "ضيافة المناسبات")}</span>
                  <span className="text-accent-gold font-semibold">{t("24/7 By Reservation", "24/7 بالحجز المسبق")}</span>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="space-y-3">
              <a
                href={BRAND_INFO.location.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-6 rounded-xl bg-brand-cream text-brand-green font-bold text-sm hover:bg-white transition-all flex items-center justify-center gap-2.5 shadow-md group"
              >
                <Navigation className="w-4 h-4 text-brand-green group-hover:scale-110 transition-transform" />
                <span>{t("Get Directions (Google / Apple Maps)", "الحصول على الاتجاهات (الخرائط)")}</span>
              </a>

              <div className="grid grid-cols-2 gap-3">
                <a
                  href={`tel:${BRAND_INFO.phone}`}
                  className="py-3 px-4 rounded-xl bg-brand-green border border-muted-on-green/30 text-brand-cream text-xs font-semibold hover:bg-surface-green transition-colors flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4 text-accent-gold" />
                  <span dir="ltr">{BRAND_INFO.displayPhone}</span>
                </a>

                <a
                  href={whatsappConciergeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-4 rounded-xl bg-[#25D366]/20 border border-[#25D366]/40 text-brand-cream text-xs font-semibold hover:bg-[#25D366]/30 transition-colors flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 text-[#25D366]" />
                  <span>{t("WhatsApp Concierge", "واتساب الإدارة")}</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Physical Table Standee Parity (Page 22 of Brand Guide) */}
          <div
            id="reviews"
            className="bg-surface-green/80 rounded-3xl p-8 sm:p-10 border border-muted-on-green/20 flex flex-col justify-between shadow-2xl relative overflow-hidden"
          >
            <div>
              {/* Standee Header */}
              <div className="text-center mb-8">
                {/* 5 Stars */}
                <div className="flex justify-center gap-1.5 text-accent-gold text-lg mb-3">
                  {"★".repeat(5)}
                </div>

                <h3 className="font-display text-2xl sm:text-3xl font-bold text-brand-cream mb-2">
                  {isAr ? "هل أعجبتك قهوتنا وخدمتنا؟" : "Happy with our service?"}
                </h3>

                <p className="text-xs sm:text-sm text-muted-on-green max-w-sm mx-auto leading-relaxed">
                  {t(
                    "Help spread the word. Review us on Google or Cloutly as seen on our café table standees.",
                    "شاركنا رأيك وساعد الآخرين في اكتشاف قهوتنا. قيّمنا عبر منصة جوجل أو كلاوتلي."
                  )}
                </p>
              </div>

              {/* Table Standee Emblem Representation */}
              <div className="w-24 h-24 mx-auto mb-6 p-4 rounded-2xl bg-brand-green border border-accent-gold/40 flex items-center justify-center shadow-inner">
                <QrCode className="w-16 h-16 text-brand-cream" />
              </div>

              {/* Recent Verified Feedback Quote */}
              <div className="bg-brand-green/60 p-4 rounded-2xl border border-muted-on-green/15 text-xs text-muted-on-green italic text-center mb-6">
                {t(
                  "\"The single-origin V60 and the cardamom buns are unmatched in Doha. Their 5L catering box was the highlight of our Friday majlis!\"",
                  "\"محصول الـ V60 ولفائف الهيل لا مثيل لها في قطر. صندوق القهوة المقطرة 5 لتر أضاف لمسة ضيافة رائعة لمجلسنا!\""
                )}
                <span className="block text-[11px] text-accent-gold not-italic font-bold mt-2">
                  — Jassim Al-Sulaiti (Doha) ★★★★★
                </span>
              </div>
            </div>

            {/* Direct Review Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a
                href={BRAND_INFO.socials.googleReviews}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-4 rounded-xl bg-brand-cream text-brand-green font-bold text-xs hover:bg-white transition-all flex items-center justify-center gap-2 shadow-md"
              >
                <Star className="w-4 h-4 fill-brand-green text-brand-green" />
                <span>{t("Review on Google", "تقييم عبر Google")}</span>
              </a>

              <a
                href={BRAND_INFO.socials.cloutlyReviews}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-4 rounded-xl bg-brand-green border border-muted-on-green/30 text-brand-cream font-semibold text-xs hover:bg-surface-green transition-colors flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-4 h-4 text-accent-gold" />
                <span>{t("Review on Cloutly", "تقييم عبر Cloutly")}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
