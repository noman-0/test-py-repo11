"use client";

import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useLanguage } from "@/context/LanguageContext";
import { useExperience } from "./store";
import { INTRO_KEY, MOTION_KEY, detectCapabilities, readUrlOverride, safeGet, safeSet, shouldEnable } from "./lib/capabilities";
import { CanvasErrorBoundary } from "./ui/CanvasErrorBoundary";
import { IntroOverlay } from "./ui/IntroOverlay";
import { ImmersiveShell } from "./ui/ImmersiveShell";
import { ID_TO_AREA, goArea } from "./actions";

const Canvas3D = dynamic(() => import("./canvas/Canvas3D"), { ssr: false, loading: () => null });

type IdleWindow = Window & {
  requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number;
  cancelIdleCallback?: (id: number) => void;
};

/**
 * Root of the immersive single-screen experience. When 3D is unavailable / declined / reduced
 * motion is preferred, it renders nothing visible and the classic scrolling site remains.
 */
export function ExperienceRoot() {
  const { locale } = useLanguage();
  const set = useExperience((s) => s.set);
  const enabled = useExperience((s) => s.enabled);
  const ready = useExperience((s) => s.ready);
  const failure = useExperience((s) => s.failure);
  const intro = useExperience((s) => s.intro);
  const area = useExperience((s) => s.area);
  const panel = useExperience((s) => s.panel);
  const reducedMotion = useExperience((s) => s.reducedMotion);
  const motionPref = useExperience((s) => s.motionPref);
  const webgl = useExperience((s) => s.webgl);
  const capsRef = useRef<ReturnType<typeof detectCapabilities> | null>(null);
  const bootIntro = useRef(false);
  const bootIntroPending = useRef(false);
  const [resolved, setResolved] = useState(false);
  const [started, setStarted] = useState(false);

  // 1. capabilities + preference
  useEffect(() => {
    bootIntro.current = document.documentElement.getAttribute("data-intro") === "pending";
    bootIntroPending.current = bootIntro.current;
    const caps = detectCapabilities();
    capsRef.current = caps;
    const url = readUrlOverride();
    const stored = safeGet("local", MOTION_KEY);
    set({
      webgl: caps.webgl,
      softwareRenderer: caps.softwareRenderer,
      reducedMotion: caps.reducedMotion,
      coarsePointer: caps.coarsePointer,
      tier: caps.tier,
      motionPref: url ?? (stored === "on" || stored === "off" ? stored : null),
    });
    setResolved(true);
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => set({ reducedMotion: mq.matches });
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, [set]);

  // 2. resolve "enabled"
  useEffect(() => {
    const caps = capsRef.current;
    if (!caps) return;
    const on = !failure && shouldEnable({ ...caps, webgl, reducedMotion }, motionPref);
    set({ enabled: on, ...(on ? {} : { ready: false, panel: false, hotspot: null }) });
  }, [motionPref, webgl, reducedMotion, failure, set]);

  // 3. reflect state on <html> (all immersive CSS keys off these attributes)
  useEffect(() => {
    if (!resolved) return;
    const d = document.documentElement;
    if (enabled) d.setAttribute("data-3d", "on");
    else {
      d.removeAttribute("data-3d");
      d.removeAttribute("data-intro");
      d.removeAttribute("data-area");
      d.removeAttribute("data-panel");
    }
  }, [enabled, resolved]);
  useEffect(() => {
    if (!enabled) return;
    const d = document.documentElement;
    d.setAttribute("data-area", area);
    if (panel) d.setAttribute("data-panel", "open");
    else d.removeAttribute("data-panel");
  }, [enabled, area, panel]);

  // 4. deep links (#menu, #catering, #reviews …) open that area's reading view
  useEffect(() => {
    if (!resolved || !enabled) return;
    const id = window.location.hash.slice(1);
    const a = ID_TO_AREA[id];
    if (a && a !== "hero") goArea(a, { panel: true });
  }, [resolved, enabled]);

  // 5. in single-screen mode, in-page links (#catering etc.) travel to the area instead of scrolling
  useEffect(() => {
    if (!enabled) return;
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement | null)?.closest?.('a[href^="#"]') as HTMLAnchorElement | null;
      if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey) return;
      const id = a.getAttribute("href")!.slice(1);
      const target = id ? ID_TO_AREA[id] : "hero";
      if (!target) return;
      e.preventDefault();
      goArea(target, { panel: target !== "hero" });
      if (id === "reviews") window.setTimeout(() => document.getElementById("reviews")?.scrollIntoView({ block: "start" }), 450);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [enabled]);

  // 6. an existing site dialog (e.g. TastingNotesModal) lifts the reading view above the header
  useEffect(() => {
    if (!enabled) return;
    const d = document.documentElement;
    const check = () => {
      const open = !!document.querySelector('main [role="dialog"][aria-modal="true"]');
      if (open) d.setAttribute("data-modal", "open");
      else d.removeAttribute("data-modal");
    };
    const mo = new MutationObserver(check);
    const main = document.querySelector("main");
    if (main) mo.observe(main, { childList: true, subtree: true });
    return () => {
      mo.disconnect();
      d.removeAttribute("data-modal");
    };
  }, [enabled]);

  // 7. brand intro lifecycle (decided before paint by the boot script)
  useEffect(() => {
    if (!resolved) return;
    if (!enabled) {
      set({ intro: "off" });
      return;
    }
    const pending = bootIntro.current;
    bootIntro.current = false;
    set({ intro: pending ? "pending" : "off" });
    if (!pending) return;
    const t = window.setTimeout(() => {
      if (useExperience.getState().intro === "pending") set({ intro: "done" });
    }, 8000);
    return () => window.clearTimeout(t);
  }, [enabled, resolved, set]);
  useEffect(() => {
    const d = document.documentElement;
    if (intro === "pending" || intro === "playing") d.setAttribute("data-intro", intro);
    else if (intro === "done") {
      d.setAttribute("data-intro", "done");
      safeSet("session", INTRO_KEY, "1");
      const t = window.setTimeout(() => d.removeAttribute("data-intro"), 900);
      return () => window.clearTimeout(t);
    } else if (resolved && !enabled) d.removeAttribute("data-intro");
  }, [intro, enabled, resolved]);
  useEffect(() => {
    if (intro !== "playing") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") set({ intro: "done" });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [intro, set]);

  // 8. start the canvas: immediately for the intro, otherwise once the page is loaded and idle
  useEffect(() => {
    if (!enabled || !resolved) {
      setStarted(false);
      return;
    }
    if (bootIntroPending.current) {
      setStarted(true);
      return;
    }
    let cancelIdle = () => {};
    const go = () => {
      const w = window as IdleWindow;
      if (w.requestIdleCallback) {
        const id = w.requestIdleCallback(() => setStarted(true), { timeout: 1500 });
        cancelIdle = () => w.cancelIdleCallback?.(id);
      } else {
        const id = window.setTimeout(() => setStarted(true), 300);
        cancelIdle = () => window.clearTimeout(id);
      }
    };
    if (document.readyState === "complete") go();
    else window.addEventListener("load", go, { once: true });
    return () => {
      window.removeEventListener("load", go);
      cancelIdle();
    };
  }, [enabled, resolved]);

  // 9. locale for 3D text/textures
  useEffect(() => set({ locale }), [locale, set]);

  return (
    <>
      <IntroOverlay />
      {(!resolved || enabled) && <ImmersiveShell />}
      {enabled && started && (
        <div className="xp-canvas" data-ready={ready ? "true" : "false"} aria-hidden="true">
          <CanvasErrorBoundary onError={(m) => set({ failure: m || "error" })}>
            <Canvas3D />
          </CanvasErrorBoundary>
        </div>
      )}
      <p className="xp-sr-only" role="status" aria-live="polite">
        {failure
          ? locale === "ar"
            ? "تعذر تشغيل العرض ثلاثي الأبعاد، يتم عرض الموقع القياسي."
            : "The 3D view is unavailable, so the standard site is shown."
          : ""}
      </p>
    </>
  );
}
