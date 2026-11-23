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

export default function HomePage() {
  return (
    <main className="min-h-screen bg-brand-green flex flex-col relative selection:bg-accent-gold selection:text-brand-green">
      {/* Sticky Navigation Header with Live Status & Lang Toggle */}
      <Navbar />

      {/* Hero Flagship Intro */}
      <Hero />

      {/* Brand Story & Logo Symbolism Breakdown */}
      <BrandStorySymbolism />

      {/* Editorial Tasting Menu & Discovery Modal */}
      <TastingMenu />

      {/* Event & Bulk Catering Booking Wizard (No Gateway) */}
      <CateringWizard />

      {/* Café Atmosphere & Packaging Craft Grid */}
      <AtmosphereGrid />

      {/* Doha Hub Location, Actions & Table Standee Reviews */}
      <DohaHub />

      {/* Global MoCI Compliant Footer */}
      <Footer />

      {/* Persistent Mobile One-Tap Action Bar */}
      <OneTapActionBar />
    </main>
  );
}
