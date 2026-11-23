"use client";

import { create } from "zustand";
import type { AreaId } from "./config/world";

export type Tier = "high" | "medium" | "low";
export type IntroState = "off" | "pending" | "playing" | "done";
export type Locale = "en" | "ar";

export interface ExperienceState {
  /** Capabilities, resolved on the client. */
  webgl: boolean;
  softwareRenderer: boolean;
  reducedMotion: boolean;
  coarsePointer: boolean;
  /** User preference: null = automatic. Persisted in localStorage("excelsa_motion"). */
  motionPref: "on" | "off" | null;
  /** True when the immersive 3D experience is active (all fallbacks resolved). */
  enabled: boolean;
  /** Canvas has rendered its first frames. */
  ready: boolean;
  /** Set when WebGL failed at runtime (context loss / error). */
  failure: string | null;
  tier: Tier;
  sound: boolean;
  locale: Locale;
  intro: IntroState;

  /** Single-screen navigation: the area the visitor is in. */
  area: AreaId;
  /** Reading view (the area's existing website section) is open. */
  panel: boolean;
  /** Camera is flying between areas. */
  traveling: boolean;
  /** Selected point of interest. */
  hotspot: string | null;
  /** Header index (site menu) overlay open. */
  indexOpen: boolean;

  set: (p: Partial<ExperienceState>) => void;
}

export const useExperience = create<ExperienceState>((set) => ({
  webgl: false,
  softwareRenderer: false,
  reducedMotion: false,
  coarsePointer: false,
  motionPref: null,
  enabled: false,
  ready: false,
  failure: null,
  tier: "medium",
  sound: false,
  locale: "en",
  intro: "off",
  area: "hero",
  panel: false,
  traveling: false,
  hotspot: null,
  indexOpen: false,
  set: (p) => set(p),
}));

/**
 * Mutable per-frame data shared between DOM controls and the render loop
 * (deliberately not React state: written every frame).
 */
export const rig = {
  /** Current camera coordinate along the journey path (area poses at AREA_AT). */
  s: 0,
  /** Normalised pointer position (-1..1) for parallax. */
  pointer: { x: 0, y: 0 },
  /** Look offsets from dragging / keys (radians) and zoom (fov delta). */
  look: { yaw: 0, pitch: 0, fov: 0 },
  /** Projected screen positions of hotspot anchors (px), written by the canvas each frame. */
  screen: new Map<string, { x: number; y: number; visible: boolean }>(),
  /** Seconds since the intro began playing. */
  introT: 0,
};
