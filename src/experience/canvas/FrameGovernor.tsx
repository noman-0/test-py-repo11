"use client";

import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { useExperience, type Tier } from "../store";

const STEP_DOWN: Record<Tier, Tier> = { high: "medium", medium: "low", low: "low" };

/**
 * Renders the (frameloop="demand") canvas only as often as it is actually seen:
 *  - full rate on desktop; 30 fps on touch devices (40 while travelling / during the intro)
 *  - ~8 fps while the reading view covers the whole screen (phones)
 * Also steps the quality tier down when the page frame rate stays low.
 */
export function FrameGovernor() {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    let raf = 0;
    let lastRender = 0;
    let lastTick = performance.now();
    let slow = 0;
    let sampled = 0;
    let lastStep = 0;
    const loop = (now: number) => {
      const st = useExperience.getState();
      const dt = now - lastTick;
      lastTick = now;
      const busy = st.traveling || st.intro === "playing";
      const covered = st.panel && st.coarsePointer;
      const fps = covered ? 8 : st.coarsePointer ? (busy ? 40 : 30) : 120;
      if (now - lastRender >= 1000 / fps - 4) {
        lastRender = now;
        invalidate();
      }
      if (!covered && !document.hidden && dt < 250) {
        sampled++;
        if (dt > 34) slow++;
        if (sampled >= 90) {
          if (slow / sampled > 0.5 && now - lastStep > 4000 && st.tier !== "low") {
            st.set({ tier: STEP_DOWN[st.tier] });
            lastStep = now;
          }
          sampled = 0;
          slow = 0;
        }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [invalidate]);
  return null;
}
