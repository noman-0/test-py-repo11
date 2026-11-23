"use client";

import { useExperience, rig } from "./store";
import { MOTION_KEY, SOUND_KEY, safeSet } from "./lib/capabilities";
import { AREA_IDS, AREA_SECTION, type AreaId } from "./config/world";
import { sound } from "./lib/sound";
import { HOTSPOT_BY_ID } from "./content/hotspots";

/** Custom DOM events used to talk to existing site components without changing their APIs. */
export const EVENTS = {
  /** detail: { id: string } - TastingMenu opens its existing TastingNotesModal for that item. */
  openTasting: "excelsa:open-tasting",
  /** Fired by TastingMenu when that modal closes. */
  tastingClosed: "excelsa:tasting-closed",
} as const;

/** Section / anchor id -> area (used for deep links and in-page links in single-screen mode). */
export const ID_TO_AREA: Record<string, AreaId> = {
  top: "hero",
  story: "story",
  menu: "menu",
  catering: "catering",
  atmosphere: "atmosphere",
  hub: "hub",
  reviews: "hub",
};

export function setMotion(on: boolean) {
  safeSet("local", MOTION_KEY, on ? "on" : "off");
  useExperience.getState().set({ motionPref: on ? "on" : "off", failure: null });
  if (!on) setSound(false);
}

export function setSound(on: boolean) {
  safeSet("local", SOUND_KEY, on ? "on" : "off");
  useExperience.getState().set({ sound: on });
  if (on) sound.start();
  else sound.stop();
}

function syncHash(area: AreaId) {
  try {
    const id = AREA_SECTION[area];
    const url = id === "top" ? window.location.pathname + window.location.search : `#${id}`;
    window.history.replaceState(null, "", url);
  } catch {
    /* ignore */
  }
}

/** Single-screen navigation: travel to an area (optionally opening its reading view). */
export function goArea(area: AreaId, opts: { panel?: boolean } = {}) {
  const st = useExperience.getState();
  const changed = area !== st.area;
  if (changed) {
    rig.look.yaw = 0;
    rig.look.pitch = 0;
    rig.look.fov = 0;
    sound.cue("select");
  }
  st.set({ area, hotspot: null, indexOpen: false, panel: area === "hero" ? false : opts.panel ?? (changed ? false : st.panel) });
  syncHash(area);
}

export function stepArea(dir: 1 | -1) {
  const i = AREA_IDS.indexOf(useExperience.getState().area);
  const next = AREA_IDS[Math.min(AREA_IDS.length - 1, Math.max(0, i + dir))];
  goArea(next);
}

export function setPanel(open: boolean) {
  const st = useExperience.getState();
  if (st.area === "hero" && open) return;
  st.set({ panel: open, hotspot: null });
  sound.cue(open ? "open" : "close");
}

/** Selects (or clears) the point of interest whose card is shown. */
export function selectHotspot(id: string | null) {
  const st = useExperience.getState();
  if (id && !HOTSPOT_BY_ID.has(id)) return;
  st.set({ hotspot: id });
  if (id) sound.cue("select");
}

/** Classic (scrolling) site: bring a section into view. */
export function scrollToArea(area: AreaId) {
  const id = AREA_SECTION[area];
  const el = id === "top" ? null : document.getElementById(id);
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (el) {
    el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
    if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
    el.focus({ preventScroll: true });
  } else window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
}

/** Opens an area's content: reading view in single-screen mode, scroll in the classic site. */
export function goToSection(area: AreaId) {
  if (useExperience.getState().enabled) goArea(area, { panel: area !== "hero" });
  else scrollToArea(area);
}

/** Opens the site's existing TastingNotesModal for a menu item (via TastingMenu's listener). */
export function openTasting(id: string) {
  sound.cue("pour");
  window.dispatchEvent(new CustomEvent(EVENTS.openTasting, { detail: { id } }));
}
