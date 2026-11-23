import type { Tier } from "../store";

export const MOTION_KEY = "excelsa_motion";
export const SOUND_KEY = "excelsa_sound";
export const INTRO_KEY = "excelsa_intro_seen";

export function safeGet(storage: "local" | "session", key: string): string | null {
  try {
    return (storage === "local" ? window.localStorage : window.sessionStorage).getItem(key);
  } catch {
    return null;
  }
}

export function safeSet(storage: "local" | "session", key: string, value: string | null) {
  try {
    const s = storage === "local" ? window.localStorage : window.sessionStorage;
    if (value === null) s.removeItem(key);
    else s.setItem(key, value);
  } catch {
    /* storage unavailable (private mode) - preference simply isn't remembered */
  }
}

export interface Capabilities {
  webgl: boolean;
  softwareRenderer: boolean;
  renderer: string;
  reducedMotion: boolean;
  coarsePointer: boolean;
  tier: Tier;
}

/** Probes WebGL once with a throwaway context, then releases it. */
export function detectCapabilities(): Capabilities {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
  let webgl = false;
  let renderer = "";
  try {
    const canvas = document.createElement("canvas");
    const gl = (canvas.getContext("webgl2") || canvas.getContext("webgl")) as WebGLRenderingContext | null;
    if (gl) {
      webgl = true;
      const dbg = gl.getExtension("WEBGL_debug_renderer_info");
      renderer = String(dbg ? gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER));
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    }
  } catch {
    webgl = false;
  }
  const softwareRenderer = /swiftshader|llvmpipe|softpipe|software|basic render|microsoft basic/i.test(renderer);
  return { webgl, softwareRenderer, renderer, reducedMotion, coarsePointer, tier: detectTier(softwareRenderer, coarsePointer) };
}

function detectTier(software: boolean, coarse: boolean): Tier {
  if (software) return "low";
  const nav = navigator as Navigator & { deviceMemory?: number };
  const cores = nav.hardwareConcurrency || 4;
  const mem = nav.deviceMemory || 4;
  const small = Math.min(window.screen.width, window.screen.height) < 820;
  if (coarse && small) return cores >= 8 && mem >= 6 ? "medium" : "low"; // phones
  if (coarse) return cores >= 8 ? "medium" : "low"; // tablets
  if (cores >= 8 && mem >= 8) return "high";
  return "medium";
}

/** Reads ?experience=on|off (shareable/debug override) and persists it. */
export function readUrlOverride(): "on" | "off" | null {
  try {
    const v = new URLSearchParams(window.location.search).get("experience");
    if (v === "on" || v === "off") {
      safeSet("local", MOTION_KEY, v);
      return v;
    }
  } catch {
    /* ignore */
  }
  return null;
}

/**
 * Decides whether 3D runs.
 * - explicit "off" -> never; explicit "on" -> whenever WebGL exists (even with reduced motion,
 *   in which case the experience runs in its reduced variant).
 * - automatic -> only with WebGL, no reduced-motion preference and a hardware GPU.
 */
export function shouldEnable(c: Capabilities, pref: "on" | "off" | null): boolean {
  if (!c.webgl || pref === "off") return false;
  if (pref === "on") return true;
  return !c.reducedMotion && !c.softwareRenderer;
}

/**
 * Inline boot script (runs before first paint) mirroring shouldEnable() so the intro overlay is
 * visible from the very first frame and nothing flashes. It only sets attributes on <html>.
 */
export const BOOT_SCRIPT = `(function(){try{var d=document.documentElement;var q=new URLSearchParams(location.search).get('experience');var p=(q==='on'||q==='off')?q:localStorage.getItem('${MOTION_KEY}');if(p==='off')return;var rm=matchMedia('(prefers-reduced-motion: reduce)').matches;var c=document.createElement('canvas');var gl=c.getContext('webgl2')||c.getContext('webgl');if(!gl)return;var r='';try{var x=gl.getExtension('WEBGL_debug_renderer_info');r=String(x?gl.getParameter(x.UNMASKED_RENDERER_WEBGL):'')}catch(e){}var lc=gl.getExtension('WEBGL_lose_context');if(lc)lc.loseContext();var sw=/swiftshader|llvmpipe|softpipe|software|basic render/i.test(r);if(p!=='on'&&(rm||sw))return;d.setAttribute('data-3d','boot');var m={story:'story',menu:'menu',catering:'catering',atmosphere:'atmosphere',hub:'hub',reviews:'hub'};var h=m[location.hash.slice(1)];d.setAttribute('data-area',h||'hero');if(h)d.setAttribute('data-panel','open');if(!h&&!rm&&!matchMedia('(pointer: coarse)').matches&&!sessionStorage.getItem('${INTRO_KEY}'))d.setAttribute('data-intro','pending')}catch(e){}})();`;
