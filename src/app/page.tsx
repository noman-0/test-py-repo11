"use client";

import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/sections/Hero";
import { BrandStorySymbolism } from "@/components/sections/BrandStorySymbolism";
import { TastingMenu } from "@/components/sections/TastingMenu";
import { CateringWizard } from "@/components/sections/CateringWizard";
import { AtmosphereGrid } from "@/components/sections/AtmosphereGrid";
import { DohaHub } from "@/components/sections/DohaHub";
import { Footer } from "@/components/layout/Footer";
import { OneTapActionBar } from "@/components/layout/OneTapActionBar";
import { ExperienceRoot } from "@/experience/ExperienceRoot";
import { useLanguage } from "@/context/LanguageContext";

export default function HomePage() {
  const { t } = useLanguage();
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:start-3 focus:z-[100] focus:px-4 focus:py-3 focus:bg-brand-cream focus:text-brand-green font-mono text-xs uppercase tracking-[0.16em]"
      >
        {t("Skip to content", "انتقل إلى المحتوى")}
      </a>

      {/* Immersive single-screen 3D layer: active only with WebGL + motion (classic site is the fallback) */}
      <ExperienceRoot />

      {/* Header with live Doha status, language, 3D/sound settings and the site index */}
      <Navbar />

      {/* In 3D mode <main> becomes the "reading view" for the current area */}
      <main id="main" className="min-h-screen bg-brand-green flex flex-col relative">
        <Hero />
        <BrandStorySymbolism />
        <TastingMenu />
        <CateringWizard />
        <AtmosphereGrid />
        <DohaHub />
        <Footer />
      </main>

      {/* Mobile one-tap actions (classic site) */}
      <OneTapActionBar />
    </>
  );
}
