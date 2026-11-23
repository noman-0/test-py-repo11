"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { BRAND } from "../../config/brand";
import { useExperience, type Tier } from "../../store";
import { getGlowTexture } from "../materials";

/** Warm dust motes drifting in the light along the whole journey (one draw call). */
export function Dust({ tier }: { tier: Tier }) {
  const count = tier === "high" ? 900 : tier === "medium" ? 500 : 0;
  const ref = useRef<THREE.Points>(null);
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 14;
      p[i * 3 + 1] = Math.random() * 5;
      p[i * 3 + 2] = 12 - Math.random() * 120;
    }
    g.setAttribute("position", new THREE.BufferAttribute(p, 3));
    return g;
  }, [count]);
  const mat = useMemo(
    () =>
      new THREE.PointsMaterial({
        size: 0.06,
        map: getGlowTexture(),
        color: BRAND.cream,
        transparent: true,
        opacity: 0.45,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
      }),
    []
  );
  useFrame(({ clock }) => {
    if (!ref.current || useExperience.getState().reducedMotion) return;
    const t = clock.elapsedTime;
    ref.current.position.y = Math.sin(t * 0.15) * 0.25;
    ref.current.position.x = Math.sin(t * 0.07) * 0.4;
  });
  if (!count) return null;
  return <points ref={ref} geometry={geo} material={mat} frustumCulled={false} />;
}
