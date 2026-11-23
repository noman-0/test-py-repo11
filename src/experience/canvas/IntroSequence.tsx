"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useExperience, rig } from "../store";
import { BRAND } from "../config/brand";
import { LOGO_ASPECT, LAYER_NAMES, useLogoLayerTextures } from "./useBrandTextures";
import { getGlowTexture } from "./materials";
import type { LogoLayerName } from "../config/assetManifest";

const H = 1.45; // logo height (m) at DIST from the camera
const DIST = 3.2;

type Anim = { start: number; dur: number; from: [number, number, number]; scale?: number; ease?: "out" | "back" };
const ANIM: Record<LogoLayerName, Anim> = {
  frame: { start: 0.0, dur: 0.95, from: [0, 0, -0.6], scale: 0.9 },
  arch: { start: 0.25, dur: 0.85, from: [0, -0.08, -0.4] },
  rays: { start: 0.6, dur: 1.0, from: [0, -0.32, -0.25] }, // sunrise
  drop: { start: 1.0, dur: 0.9, from: [0, 0.55, 0.15], ease: "back" }, // the drop falls in
  wordmark: { start: 1.55, dur: 0.7, from: [0, -0.06, 0] },
  tagline: { start: 1.75, dur: 0.7, from: [0, -0.05, 0] },
  arabic: { start: 1.95, dur: 0.7, from: [0, -0.05, 0] },
};
const HOLD_END = 3.4;
const RECEDE = 1.0;
const DONE_AT = 4.7;

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const easeBack = (t: number) => {
  const c1 = 1.4;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

/**
 * Brand intro: the official logo assembles from its seven layers (masks of the official raster),
 * the rays rise like the morning sun, the drop falls into the arch, then everything recedes to
 * reveal the storefront. The final assembled frame is the unmodified official logo.
 */
export function IntroSequence() {
  const intro = useExperience((s) => s.intro);
  const textures = useLogoLayerTextures();
  const camera = useThree((s) => s.camera);
  const root = useRef<THREE.Group>(null);
  const logo = useRef<THREE.Group>(null);
  const curtainMat = useRef<THREE.MeshBasicMaterial>(null);
  const glowMat = useRef<THREE.MeshBasicMaterial>(null);
  const meshes = useRef<Partial<Record<LogoLayerName, THREE.Mesh>>>({});
  const t0 = useRef<number | null>(null);
  const fwd = useMemo(() => new THREE.Vector3(), []);

  // textures resolved (Suspense) -> start playing
  useEffect(() => {
    if (useExperience.getState().intro === "pending") useExperience.getState().set({ intro: "playing" });
  }, []);

  useFrame(({ clock }) => {
    if (!root.current) return;
    const st = useExperience.getState();
    if (st.intro !== "playing") {
      root.current.visible = false;
      return;
    }
    root.current.visible = true;
    if (t0.current === null) t0.current = clock.elapsedTime;
    const t = clock.elapsedTime - t0.current;
    rig.introT = t;

    // follow the camera
    camera.getWorldDirection(fwd);
    root.current.position.copy(camera.position).addScaledVector(fwd, DIST);
    root.current.quaternion.copy(camera.quaternion);

    for (const name of LAYER_NAMES) {
      const m = meshes.current[name];
      if (!m) continue;
      const a = ANIM[name];
      const p = clamp01((t - a.start) / a.dur);
      const e = a.ease === "back" ? easeBack(p) : easeOut(p);
      m.position.set(a.from[0] * (1 - e), a.from[1] * (1 - e), a.from[2] * (1 - e));
      const sc = a.scale ? a.scale + (1 - a.scale) * e : 1;
      m.scale.setScalar(sc);
      (m.material as THREE.MeshBasicMaterial).opacity = clamp01(p * 1.6);
    }

    // gentle parallax while separated (zero once assembled -> exact logo)
    const sep = 1 - clamp01((t - 2.2) / 0.6);
    if (logo.current) {
      logo.current.rotation.y = rig.pointer.x * 0.25 * sep;
      logo.current.rotation.x = rig.pointer.y * 0.15 * sep;
      const r = clamp01((t - HOLD_END) / RECEDE);
      const re = r * r;
      logo.current.position.z = -2.4 * re;
      logo.current.scale.setScalar(1 - 0.25 * re);
      logo.current.children.forEach((c) => {
        const mat = (c as THREE.Mesh).material as THREE.MeshBasicMaterial;
        if (r > 0 && mat !== glowMat.current) mat.opacity = Math.min(mat.opacity, 1 - re);
      });
    }
    if (glowMat.current) {
      const g = clamp01((t - 0.7) / 0.7) * (1 - 0.6 * clamp01((t - 1.6) / 1.0));
      glowMat.current.opacity = 0.55 * g * (1 - clamp01((t - HOLD_END) / RECEDE));
    }
    if (curtainMat.current) curtainMat.current.opacity = 1 - clamp01((t - 3.6) / 1.0);

    if (t >= DONE_AT) st.set({ intro: "done" });
  });

  if (intro === "off" || intro === "done") return null;

  const w = H * LOGO_ASPECT;
  return (
    <group ref={root} visible={false}>
      {/* brand-green curtain hides the world until the logo recedes */}
      <mesh position={[0, 0, -0.8]} renderOrder={20}>
        <planeGeometry args={[60, 60]} />
        <meshBasicMaterial ref={curtainMat} color={BRAND.green} transparent depthTest={false} depthWrite={false} toneMapped={false} />
      </mesh>
      <group ref={logo}>
        {/* sunrise glow behind the rays */}
        <mesh position={[0, H * 0.27, -0.05]} renderOrder={21}>
          <planeGeometry args={[H * 0.95, H * 0.95]} />
          <meshBasicMaterial
            ref={glowMat}
            map={getGlowTexture()}
            color={BRAND.cream}
            transparent
            opacity={0}
            blending={THREE.AdditiveBlending}
            depthTest={false}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
        {LAYER_NAMES.map((name, i) => (
          <mesh
            key={name}
            ref={(m) => {
              if (m) meshes.current[name] = m;
            }}
            renderOrder={22 + i}
          >
            <planeGeometry args={[w, H]} />
            <meshBasicMaterial map={textures[name]} transparent opacity={0} depthTest={false} depthWrite={false} toneMapped={false} />
          </mesh>
        ))}
      </group>
    </group>
  );
}
