"use client";

import React, { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ExternalLink, X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { getDohaCafeStatus } from "@/utils/dohaTime";
import { LineButton } from "@/components/editorial";
import { useExperience, rig } from "../store";
import { AREA_IDS, AREA_SECTION, type AreaId } from "../config/world";
import { AREA_TEXT, UI } from "../content/areas";
import { HOTSPOT_BY_ID, hotspotsFor, type HotspotAction } from "../content/hotspots";
import { MENU_IMAGES } from "../config/assetManifest";
import { goArea, goToSection, openTasting, selectHotspot, setPanel, stepArea } from "../actions";
import { attachExploreInput } from "../lib/exploreInput";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * The single-screen layer over the 3D world: area card, points of interest, reading-view bar and
 * the bottom bar. Server-rendered; CSS shows it only when <html data-3d> is set.
 */
export function ImmersiveShell() {
  const { t, locale } = useLanguage();
  const area = useExperience((s) => s.area);
  const panel = useExperience((s) => s.panel);
  const hotspot = useExperience((s) => s.hotspot);
  const traveling = useExperience((s) => s.traveling);
  const ready = useExperience((s) => s.ready);
  const enabled = useExperience((s) => s.enabled);
  const coarse = useExperience((s) => s.coarsePointer);
  const pinRefs = useRef(new Map<string, HTMLButtonElement>());
  const primaryRef = useRef<HTMLButtonElement>(null);
  const backRef = useRef<HTMLButtonElement>(null);
  const [status, setStatus] = useState<{ isOpen: boolean; badgeText: string } | null>(null);

  const idx = AREA_IDS.indexOf(area);
  const copy = AREA_TEXT[area];
  const spots = hotspotsFor(area);
  const current = hotspot ? HOTSPOT_BY_ID.get(hotspot) : undefined;
  const menuImage = current?.id.startsWith("menu-") ? MENU_IMAGES[current.id.slice(5)] : undefined;

  useEffect(() => {
    const upd = () => setStatus(getDohaCafeStatus(locale));
    upd();
    const id = window.setInterval(upd, 60000);
    return () => window.clearInterval(id);
  }, [locale]);

  // drag to look / wheel zoom on the canvas
  useEffect(() => {
    if (!enabled || !ready) return;
    const el = document.querySelector<HTMLElement>(".xp-canvas");
    return el ? attachExploreInput(el) : undefined;
  }, [enabled, ready]);

  // keyboard: ←/→ change area (mirrored for RTL), Esc closes card → reading view
  useEffect(() => {
    if (!enabled) return;
    const onKey = (e: KeyboardEvent) => {
      const st = useExperience.getState();
      if (st.indexOpen || document.documentElement.hasAttribute("data-modal") || st.intro === "playing") return;
      const el = e.target as HTMLElement;
      const typing = el.closest?.("input, textarea, select, [contenteditable='true']");
      if (e.key === "Escape") {
        if (st.hotspot) selectHotspot(null);
        else if (st.panel) {
          setPanel(false);
          requestAnimationFrame(() => primaryRef.current?.focus());
        }
        return;
      }
      if (typing || st.panel || e.altKey || e.ctrlKey || e.metaKey) return;
      const rtl = document.documentElement.dir === "rtl";
      if (e.key === "ArrowRight") stepArea(rtl ? -1 : 1);
      else if (e.key === "ArrowLeft") stepArea(rtl ? 1 : -1);
      else return;
      e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [enabled]);

  // reading view focus: into the section when it opens
  useEffect(() => {
    if (!enabled || !panel) return;
    const id = window.setTimeout(() => {
      const sec = document.getElementById(AREA_SECTION[area]);
      const h = sec?.querySelector<HTMLElement>("h2, h1");
      const target = h ?? sec;
      if (target) {
        if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
      }
    }, 80);
    return () => window.clearTimeout(id);
  }, [panel, area, enabled]);

  // pins follow their 3D anchors
  useEffect(() => {
    if (!enabled) return;
    let raf = 0;
    const loop = () => {
      for (const [id, el] of pinRefs.current) {
        const p = rig.screen.get(id);
        if (p && p.visible) {
          el.style.transform = `translate(${p.x}px, ${p.y}px) translate(-50%, -50%)`;
          el.style.visibility = "visible";
        } else el.style.visibility = "hidden";
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [enabled, area]);

  const runAction = (a: HotspotAction) => {
    if (a.kind === "section") goToSection(a.area);
    else if (a.kind === "tasting") openTasting(a.itemId);
  };

  const primary = () => (area === "hero" ? goArea("catering", { panel: true }) : setPanel(true));
  const nextArea: AreaId | undefined = AREA_IDS[idx + 1];

  return (
    <>
    <div className="xp-shell" data-traveling={traveling ? "true" : "false"} data-panel-open={panel ? "true" : "false"}>
      {/* ── area card ─────────────────────────────────────────── */}
      <div className="xp-card" key={area} aria-live="polite">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-on-green flex items-center gap-3">
          <span className="text-accent-gold text-sm leading-none" aria-hidden="true">
            +
          </span>
          <span>
            {pad(idx + 1)} / {t(copy.label.en, copy.label.ar)}
          </span>
        </p>
        <h2 className="xp-card-title font-display leading-[1.02] text-brand-cream tracking-tight mt-4 sm:mt-6">
          {t(copy.title.en, copy.title.ar)}
          <em className="block italic font-normal text-accent-gold/90">{t(copy.italic.en, copy.italic.ar)}</em>
        </h2>
        <p className="xp-card-body mt-5 text-[15px] leading-relaxed text-brand-cream/75 max-w-md">{t(copy.body.en, copy.body.ar)}</p>
        <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
          <LineButton as="button" ref={primaryRef as React.Ref<HTMLAnchorElement & HTMLButtonElement>} onClick={primary} className="min-w-[230px]">
            {t(copy.cta.en, copy.cta.ar)}
          </LineButton>
          {nextArea && (
            <button
              type="button"
              onClick={() => goArea(nextArea)}
              className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-on-green hover:text-brand-cream transition-colors flex items-center gap-2"
            >
              {area === "hero" ? t(UI.enter.en, UI.enter.ar) : `${t(UI.next.en, UI.next.ar)} · ${t(AREA_TEXT[nextArea].label.en, AREA_TEXT[nextArea].label.ar)}`}
              <ArrowRight className="w-3.5 h-3.5 rtl:-scale-x-100" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      {/* ── points of interest ───────────────────────────────── */}
      <div className="xp-pins" role="group" aria-label={t(UI.points.en, UI.points.ar)}>
        {spots.map((h) => (
          <button
            key={h.id}
            ref={(el) => {
              if (el) pinRefs.current.set(h.id, el);
              else pinRefs.current.delete(h.id);
            }}
            type="button"
            className="xp-pin"
            aria-expanded={hotspot === h.id}
            aria-controls="xp-poi"
            data-active={hotspot === h.id ? "true" : "false"}
            onClick={() => selectHotspot(hotspot === h.id ? null : h.id)}
            style={{ visibility: "hidden" }}
          >
            <span className="xp-pin-dot" aria-hidden="true" />
            <span className="xp-pin-label">{t(h.title.en, h.title.ar)}</span>
          </button>
        ))}
      </div>

      {current && (
        <div id="xp-poi" className="xp-poi" role="region" aria-labelledby="xp-poi-title" data-lenis-prevent>
          <button
            type="button"
            onClick={() => selectHotspot(null)}
            aria-label={t(UI.close.en, UI.close.ar)}
            className="absolute top-3 end-3 h-9 w-9 border border-brand-cream/15 flex items-center justify-center hover:bg-brand-cream/5"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
          {menuImage && (
            <figure className="mb-4 me-12">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={menuImage.path}
                alt={`${t(current.title.en, current.title.ar)}${menuImage.placeholder ? ` – ${t(UI.illustrative.en, UI.illustrative.ar)}` : ""}`}
                width={800}
                height={800}
                loading="lazy"
                className="w-32 h-32 object-cover border border-brand-cream/10"
              />
              {menuImage.placeholder && (
                <figcaption className="mt-1.5 font-mono text-[9px] uppercase tracking-[0.16em] text-muted-on-green">
                  {t(UI.illustrative.en, UI.illustrative.ar)}
                </figcaption>
              )}
            </figure>
          )}
          {current.meta && <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-accent-gold pe-12">{t(current.meta.en, current.meta.ar)}</p>}
          <h3 id="xp-poi-title" className="font-display text-2xl text-brand-cream mt-2 pe-12 leading-tight">
            {t(current.title.en, current.title.ar)}
          </h3>
          {current.body && <p className="mt-3 text-sm text-brand-cream/70 leading-relaxed line-clamp-5">{t(current.body.en, current.body.ar)}</p>}
          <div className="mt-5 flex flex-col gap-2">
            {current.actions.map((a, i) =>
              a.kind === "link" ? (
                <a
                  key={i}
                  href={a.href}
                  {...(a.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="xp-poi-action"
                  data-primary={i === 0 ? "true" : "false"}
                >
                  <span>{t(a.label.en, a.label.ar)}</span>
                  {a.external && <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />}
                </a>
              ) : (
                <button key={i} type="button" onClick={() => runAction(a)} className="xp-poi-action" data-primary={i === 0 ? "true" : "false"}>
                  <span>{t(a.label.en, a.label.ar)}</span>
                  <ArrowRight className="w-3.5 h-3.5 rtl:-scale-x-100" aria-hidden="true" />
                </button>
              )
            )}
          </div>
        </div>
      )}

      {/* ── bottom bar ────────────────────────────────────────── */}
      <nav className="xp-bar" aria-label={t(UI.areas.en, UI.areas.ar)}>
        <span className="xp-bar-status font-mono text-[10px] uppercase tracking-[0.18em] text-muted-on-green items-center gap-2">
          <span className={`w-1.5 h-1.5 rounded-full ${status?.isOpen ? "bg-emerald-400" : "bg-rose-400"}`} aria-hidden="true" />
          {status ? status.badgeText : t("Doha, Qatar", "الدوحة، قطر")}
        </span>
        <span className="xp-bar-hint font-mono text-[10px] uppercase tracking-[0.18em] text-muted-on-green/70" aria-hidden="true">
          {coarse ? t(UI.hintTouch.en, UI.hintTouch.ar) : t(UI.hint.en, UI.hint.ar)}
        </span>
        <span className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => stepArea(-1)}
            disabled={idx === 0}
            aria-label={t(UI.prev.en, UI.prev.ar)}
            className="h-9 w-9 flex items-center justify-center text-brand-cream disabled:opacity-25 hover:text-accent-gold"
          >
            <ArrowLeft className="w-4 h-4 rtl:-scale-x-100" aria-hidden="true" />
          </button>
          <span className="font-mono text-[11px] tracking-[0.18em] text-brand-cream tabular-nums min-w-[64px] text-center" aria-live="polite">
            {pad(idx + 1)} / {pad(AREA_IDS.length)}
          </span>
          <button
            type="button"
            onClick={() => stepArea(1)}
            disabled={idx === AREA_IDS.length - 1}
            aria-label={t(UI.next.en, UI.next.ar)}
            className="h-9 w-9 flex items-center justify-center text-brand-cream disabled:opacity-25 hover:text-accent-gold"
          >
            <ArrowRight className="w-4 h-4 rtl:-scale-x-100" aria-hidden="true" />
          </button>
        </span>
      </nav>
    </div>

      {/* reading-view bar: outside the shell's stacking context so it sits above <main> */}
      <div className="xp-panelbar">
        <button
          ref={backRef}
          type="button"
          onClick={() => {
            setPanel(false);
            requestAnimationFrame(() => primaryRef.current?.focus());
          }}
          className="font-mono text-[11px] uppercase tracking-[0.18em] text-brand-cream flex items-center gap-2.5 hover:text-accent-gold transition-colors"
        >
          <ArrowLeft className="w-4 h-4 rtl:-scale-x-100" aria-hidden="true" />
          {t(UI.back.en, UI.back.ar)}
        </button>
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-on-green">
          {pad(idx + 1)} / {t(copy.label.en, copy.label.ar)}
        </span>
      </div>
    </>
  );
}
