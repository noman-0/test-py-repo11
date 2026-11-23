"use client";

import { Suspense, useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import { useExperience, type Tier } from "../store";
import { BRAND, MATERIAL_TONES } from "../config/brand";
import { CameraRig } from "./CameraRig";
import { World } from "./World";
import { FrameGovernor } from "./FrameGovernor";
import { warmCompile } from "./warmCompile";

const DPR: Record<Tier, [number, number]> = {
  high: [1, 1.6],
  medium: [1, 1.3],
  low: [0.75, 1],
};

/**
 * Pre-compiles every material (incl. sets hidden by distance culling) with the parallel-compile
 * extension, so no shader compiles stall the main thread mid-scroll. Then reveals the canvas.
 */
function WarmupAndReady() {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  const camera = useThree((s) => s.camera);
  const invalidate = useThree((s) => s.invalidate);
  const frames = useRef(-1);
  useEffect(() => {
    let cancelled = false;
    warmCompile(gl, scene, camera).then(() => {
      if (cancelled) return;
      frames.current = 0;
      invalidate();
    });
    return () => {
      cancelled = true;
    };
  }, [gl, scene, camera, invalidate]);
  useFrame(() => {
    if (frames.current < 0) return;
    frames.current++;
    if (frames.current === 3) useExperience.getState().set({ ready: true });
  });
  return null;
}

/** Context loss -> graceful fallback to the classic site. */
function ContextGuard() {
  const gl = useThree((s) => s.gl);
  useEffect(() => {
    const el = gl.domElement;
    const onLost = (e: Event) => {
      e.preventDefault();
      useExperience.getState().set({ failure: "webgl-context-lost" });
    };
    el.addEventListener("webglcontextlost", onLost);
    return () => el.removeEventListener("webglcontextlost", onLost);
  }, [gl]);
  return null;
}

function Lighting({ tier }: { tier: Tier }) {
  return (
    <>
      <hemisphereLight args={[BRAND.cream, MATERIAL_TONES.greenDeep, 0.55]} />
      <ambientLight intensity={0.18} color={BRAND.cream} />
      <directionalLight position={[6, 12, 8]} intensity={1.35} color="#FFE9CC" />
      <directionalLight position={[-8, 6, -4]} intensity={0.35} color="#9FC9C0" />
      <Environment resolution={tier === "low" ? 64 : 128} frames={1}>
        {/* Studio light formers in brand tones - no HDRI download needed */}
        <color attach="background" args={[MATERIAL_TONES.greenDeep]} />
        <Lightformer form="rect" intensity={2.2} color={BRAND.cream} position={[0, 5, -6]} scale={[10, 3, 1]} />
        <Lightformer form="rect" intensity={1.2} color="#FFE2BD" position={[-6, 2, 2]} rotation-y={Math.PI / 2} scale={[6, 4, 1]} />
        <Lightformer form="rect" intensity={0.8} color="#8FBFB5" position={[6, 2, 2]} rotation-y={-Math.PI / 2} scale={[6, 4, 1]} />
        <Lightformer form="ring" intensity={1.5} color={BRAND.cream} position={[0, 6, 4]} scale={2} />
      </Environment>
    </>
  );
}

export default function Canvas3D() {
  const tier = useExperience((s) => s.tier);

  return (
    <Canvas
      frameloop="demand"
      dpr={DPR[tier]}
      gl={{ antialias: tier !== "low", powerPreference: "high-performance", alpha: false, stencil: false }}
      camera={{ fov: 42, near: 0.1, far: 220, position: [0, 1.8, 10] }}
      onCreated={({ gl, scene }) => {
        // opt-in diagnostics for QA (?xpdebug) - exposes renderer stats only
        if (new URLSearchParams(window.location.search).has("xpdebug")) {
          (window as unknown as { __xp: object }).__xp = { gl, scene, tier: () => useExperience.getState().tier };
        }
        // Neutral tone mapping keeps the two brand colours faithful (ACES would shift them).
        gl.toneMapping = THREE.NeutralToneMapping;
        // synchronous shader error checks stall the main thread; not needed in production
        gl.debug.checkShaderErrors = process.env.NODE_ENV !== "production";
        gl.toneMappingExposure = 1.0;
      }}
    >
      <color attach="background" args={[BRAND.green]} />
      <fogExp2 attach="fog" args={[BRAND.green, 0.028]} />
      <FrameGovernor />
      <Lighting tier={tier} />
      <CameraRig />
      <Suspense fallback={null}>
        <World />
        {/* runs only after every texture inside World has loaded */}
        <WarmupAndReady />
      </Suspense>
      <ContextGuard />
    </Canvas>
  );
}
