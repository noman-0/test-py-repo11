/**
 * Font configuration (self-hosted at build time via next/font; replaces the old render-blocking
 * Google Fonts CSS @import with the SAME families and weights).
 *
 * ── Adding the licensed Regista font later ─────────────────────────────────────────────────────
 * The brand guide (docs/BRAND_REFERENCE.md, page 7) specifies "Regista Demo" for headings. Until a
 * commercially licensed web font is supplied, Playfair Display fills the display slot.
 * To switch, only this file changes - no component or CSS edits:
 *   1. Put the licensed files in src/app/fonts/regista/ (e.g. Regista-Regular.woff2).
 *   2. Replace the `displayFont` definition below with:
 *        import localFont from "next/font/local";
 *        export const displayFont = localFont({
 *          src: [{ path: "./fonts/regista/Regista-Regular.woff2", weight: "400", style: "normal" }],
 *          variable: "--font-display-nf",
 *          display: "swap",
 *          fallback: ["Playfair Display", "serif"],
 *        });
 * Every heading uses Tailwind `font-display` -> var(--font-regista) -> var(--font-display-nf).
 */
import { DM_Mono, IBM_Plex_Sans_Arabic, Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";

export const displayFont = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display-nf",
  display: "swap",
  // No size-adjusted Arial fallback face: Arabic glyphs must fall back to the system font exactly
  // as they did with the previous Google Fonts CSS (keeps the Arabic layout unchanged).
  adjustFontFallback: false,
});

export const sansFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans-nf",
  display: "swap",
  // No size-adjusted Arial fallback face: Arabic glyphs must fall back to the system font exactly
  // as they did with the previous Google Fonts CSS (keeps the Arabic layout unchanged).
  adjustFontFallback: false,
});

export const arabicFont = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-arabic-nf",
  display: "swap",
});

/** Small uppercase interface labels (editorial "index" voice). Arabic labels fall back to IBM Plex. */
export const monoFont = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono-nf",
  display: "swap",
  adjustFontFallback: false,
});

export const fontVariables = [displayFont.variable, sansFont.variable, arabicFont.variable, monoFont.variable].join(" ");
