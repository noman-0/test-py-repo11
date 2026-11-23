"use client";

import React, { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useExperience } from "../store";
import { setMotion, setSound } from "../actions";

/**
 * "3D ON / SOUND OFF" text toggles (reference-style mono labels). Real buttons with aria-pressed.
 * Render nothing on the server and on devices without WebGL.
 */
export function ExperienceToggles({ className = "" }: { className?: string }) {
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const webgl = useExperience((s) => s.webgl);
  const enabled = useExperience((s) => s.enabled);
  const sound = useExperience((s) => s.sound);
  useEffect(() => setMounted(true), []);
  if (!mounted || !webgl) return null;
  const on = t("On", "تشغيل");
  const off = t("Off", "إيقاف");
  return (
    <div className={`flex items-center gap-5 ${className}`} role="group" aria-label={t("Experience settings", "إعدادات التجربة")}>
      <button
        type="button"
        aria-pressed={enabled}
        aria-label={`${t("3D experience", "التجربة ثلاثية الأبعاد")}: ${enabled ? on : off}`}
        onClick={() => setMotion(!enabled)}
        className="font-mono text-[11px] uppercase tracking-[0.16em] text-brand-cream hover:text-accent-gold transition-colors"
      >
        3D <span className={enabled ? "text-accent-gold" : "text-muted-on-green"}>{enabled ? on : off}</span>
      </button>
      {enabled && (
        <button
          type="button"
          aria-pressed={sound}
          aria-label={`${t("Sound", "الصوت")}: ${sound ? on : off}`}
          onClick={() => setSound(!sound)}
          className="font-mono text-[11px] uppercase tracking-[0.16em] text-brand-cream hover:text-accent-gold transition-colors"
        >
          {t("Sound", "الصوت")} <span className={sound ? "text-accent-gold" : "text-muted-on-green"}>{sound ? on : off}</span>
        </button>
      )}
    </div>
  );
}
