"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { LOGO } from "../config/assetManifest";
import { UI } from "../content/areas";
import { useExperience } from "../store";

/**
 * Static first frame of the brand intro. Server-rendered but hidden by CSS unless the inline boot
 * script marked <html data-intro="pending">, so it appears with the first paint (no flash) and is
 * never shown when 3D is unavailable. The official logo is a CSS background so it is not even
 * downloaded when hidden.
 */
export function IntroOverlay() {
  const { t } = useLanguage();
  const set = useExperience((s) => s.set);
  return (
    <>
      <div className="xp-intro" aria-hidden="true">
        <div className="xp-intro-logo" style={{ backgroundImage: `url(${LOGO.cream.path})` }} />
        <div className="xp-intro-bar" />
        <p className="xp-intro-text">{t(UI.loading.en, UI.loading.ar)}</p>
      </div>
      <button type="button" className="xp-intro-skip" onClick={() => set({ intro: "done" })}>
        {t(UI.skipIntro.en, UI.skipIntro.ar)}
      </button>
    </>
  );
}
