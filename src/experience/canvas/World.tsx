"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { MATERIAL_TONES } from "../config/brand";
import { AREA_IDS, SET_Z, type AreaId } from "../config/world";
import { useExperience, type Tier } from "../store";
import { disposeMaterials } from "./materials";
import { Storefront } from "./sets/Storefront";
import { CateringSet, HubSet, MajlisSet, StorySet, TastingBarSet } from "./sets/Interiors";
import { IntroSequence } from "./IntroSequence";
import { HotspotProjector } from "./Hotspot";
import { Dust } from "./parts/Dust";
import { MergeStatic } from "./MergeStatic";
import { warmCompile } from "./warmCompile";

/** Shared ground plane for the whole journey (sets are added on top of it). */
function Ground() {
  return (
    <mesh rotation-x={-Math.PI / 2} position={[0, 0, -60]}>
      <planeGeometry args={[80, 230]} />
      <meshStandardMaterial color={MATERIAL_TONES.greenDeep} roughness={0.92} metalness={0} />
    </mesh>
  );
}

const CULL: Record<Tier, number> = { high: 46, medium: 26, low: 22 };

/** Skips rendering sets that are far from the camera; merges their static meshes. */
export function SetCull({ area, range, children }: { area: AreaId; range?: number; children: React.ReactNode }) {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ camera }) => {
    const r = Math.min(range ?? 999, CULL[useExperience.getState().tier]);
    if (ref.current) ref.current.visible = Math.abs(camera.position.z - SET_Z[area]) < r;
  });
  return (
    <group ref={ref}>
      <MergeStatic>{children}</MergeStatic>
    </group>
  );
}

/** Warm practical lights - fixed count for the whole session (no shader recompiles). */
function SetLights() {
  return (
    <>
      <pointLight position={[0, 3.2, SET_Z.hero - 2.5]} color="#FFD3A0" intensity={9} distance={16} decay={2} />
      <pointLight position={[0, 3.2, SET_Z.hero + 3]} color="#FFE6C4" intensity={6} distance={12} decay={2} />
      <pointLight position={[0, 4.2, SET_Z.story + 2]} color="#FFF1D6" intensity={10} distance={14} decay={2} />
      <pointLight position={[0, 3.0, SET_Z.menu + 1.6]} color="#FFD7A3" intensity={12} distance={12} decay={2} />
      <pointLight position={[0, 3.0, SET_Z.catering + 1.6]} color="#FFDDB0" intensity={11} distance={12} decay={2} />
      <pointLight position={[0, 2.7, SET_Z.atmosphere + 0.6]} color="#FFCF94" intensity={11} distance={11} decay={2} />
      <pointLight position={[0.6, 2.5, SET_Z.hub + 1]} color="#FFE2B8" intensity={7} distance={10} decay={2} />
    </>
  );
}

/** Denser fog indoors, thinner over the bay so the Doha skyline reads. */
function FogController() {
  const scene = useThree((s) => s.scene);
  useFrame(({ camera }) => {
    const fog = scene.fog as THREE.FogExp2 | null;
    if (!fog) return;
    const t = THREE.MathUtils.clamp((-camera.position.z - 84) / 8, 0, 1);
    fog.density = THREE.MathUtils.lerp(0.028, 0.0085, t);
  });
  return null;
}

type IdleWindow = Window & {
  requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number;
  cancelIdleCallback?: (id: number) => void;
};
/** Runs cb when the main thread is idle (falls back to a short timeout, e.g. Safari). */
function onIdle(cb: () => void): () => void {
  const w = window as IdleWindow;
  if (w.requestIdleCallback) {
    const id = w.requestIdleCallback(cb, { timeout: 700 });
    return () => w.cancelIdleCallback?.(id);
  }
  const id = window.setTimeout(cb, 120);
  return () => window.clearTimeout(id);
}

export function World() {
  const tier = useExperience((s) => s.tier);
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  const camera = useThree((s) => s.camera);
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => () => disposeMaterials(), []);

  // Build sets progressively - the chapter in view first, then outwards - one per idle slot,
  // so no single task blocks the main thread for long.
  const order = useMemo<AreaId[]>(() => {
    const here = AREA_IDS.indexOf(useExperience.getState().area);
    return [...AREA_IDS].sort((a, b) => Math.abs(AREA_IDS.indexOf(a) - here) - Math.abs(AREA_IDS.indexOf(b) - here));
  }, []);
  const [count, setCount] = useState(1);
  useEffect(() => {
    if (count < order.length) return onIdle(() => setCount((c) => c + 1));
    // everything mounted: compile remaining shader variants in the background
    let live = true;
    const cancel = onIdle(() => {
      warmCompile(gl, scene, camera).then(() => {
        if (live) invalidate();
      });
    });
    return () => {
      live = false;
      cancel();
    };
  }, [count, order.length, gl, scene, camera, invalidate]);
  const mounted = new Set(order.slice(0, count));

  const sets: Record<AreaId, JSX.Element> = {
    hero: <Storefront />,
    story: <StorySet tier={tier} />,
    menu: <TastingBarSet />,
    catering: <CateringSet />,
    atmosphere: <MajlisSet />,
    hub: <HubSet />,
  };

  return (
    <group>
      <Ground />
      <SetLights />
      <FogController />
      {AREA_IDS.map((a) => {
        if (!mounted.has(a)) return null;
        // tight range for the hub: the bay/skyline only appears once you leave the majlis
        const set = (
          <SetCull key={a} area={a} range={a === "hub" ? 26 : undefined}>
            {sets[a]}
          </SetCull>
        );
        // the first set belongs to the canvas-level Suspense (ready only once it is loaded);
        // later sets stream in without blanking what is already on screen
        return a === order[0] ? (
          set
        ) : (
          <Suspense key={a} fallback={null}>
            {set}
          </Suspense>
        );
      })}
      <Dust tier={tier} />
      <HotspotProjector />
      <IntroSequence />
    </group>
  );
}
