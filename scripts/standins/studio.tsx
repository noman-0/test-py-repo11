/**
 * Stand-in "photo studio" (dev tool, NOT part of the website bundle or routes).
 * Bundled on demand by scripts/render-standins.mjs. Renders one menu item's 3D model
 * (the same components used on the 3D tasting bar) and exposes window.__capture(), which
 * composites a brand backdrop + a visible "Illustrative image" label and returns a WebP data URL.
 */
import React, { Suspense, useLayoutEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import { BRAND, MATERIAL_TONES } from "../../src/experience/config/brand";
import { Bottle, Bun, CeramicCup, Chemex, CheesecakeSlice, CoffeeBag, ColdBrewGlass, CortadoGlass, V60 } from "../../src/experience/canvas/parts/vessels";

const ITEMS: Record<string, () => JSX.Element> = {
  "esp-01": () => <CortadoGlass />,
  "esp-02": () => <CeramicCup />,
  "esp-03": () => <CeramicCup scale={1.12} />,
  "po-01": () => <V60 />,
  "po-02": () => <Chemex />,
  "cb-01": () => <ColdBrewGlass />,
  "cb-02": () => <Bottle />,
  "pas-01": () => <Bun />,
  "pas-02": () => <CheesecakeSlice />,
  "bean-01": () => <CoffeeBag />,
  "bean-02": () => <CoffeeBag rotation-y={-0.25} />,
};

const id = new URLSearchParams(location.search).get("id") ?? "esp-02";
const W = 1000;

function Framed() {
  const group = useRef<THREE.Group>(null);
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const frames = useRef(0);
  useLayoutEffect(() => {
    const g = group.current!;
    const box = new THREE.Box3().setFromObject(g);
    const size = box.getSize(new THREE.Vector3());
    const centre = box.getCenter(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y * 1.15, size.z);
    const dist = maxDim / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2))) * 1.55;
    const elev = THREE.MathUtils.degToRad(18);
    camera.position.set(centre.x + dist * 0.28, centre.y + Math.sin(elev) * dist, centre.z + Math.cos(elev) * dist);
    camera.lookAt(centre.x, centre.y * 0.92, centre.z);
    camera.updateProjectionMatrix();
    const plinth = g.parent!.getObjectByName("plinth")!;
    plinth.scale.setScalar(Math.max(size.x, size.z) * 1.25);
  }, [camera]);
  useFrame(() => {
    frames.current++;
    if (frames.current === 12) (window as unknown as { __ready: boolean }).__ready = true;
  });
  const El = ITEMS[id];
  return (
    <>
      <mesh name="plinth" position={[0, -0.011, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.02, 64]} />
        <meshStandardMaterial color={BRAND.cream} roughness={0.55} />
      </mesh>
      <group ref={group}>{El ? <El /> : null}</group>
    </>
  );
}

function Studio() {
  return (
    <Canvas
      dpr={1}
      style={{ width: W, height: W }}
      camera={{ fov: 30, near: 0.01, far: 50 }}
      gl={{ preserveDrawingBuffer: true, alpha: true, antialias: true }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.NeutralToneMapping;
        gl.setClearColor(0x000000, 0);
      }}
    >
      <hemisphereLight args={[BRAND.cream, MATERIAL_TONES.greenDeep, 0.7]} />
      <directionalLight position={[2, 4, 3]} intensity={2.2} color="#FFE9CC" />
      <directionalLight position={[-3, 2, -2]} intensity={0.8} color="#9FC9C0" />
      <Environment resolution={128} frames={1}>
        <color attach="background" args={[MATERIAL_TONES.greenDeep]} />
        <Lightformer form="rect" intensity={2.4} color={BRAND.cream} position={[0, 4, 3]} scale={[6, 2, 1]} />
        <Lightformer form="rect" intensity={1.2} color="#FFE2BD" position={[-4, 1, 1]} rotation-y={Math.PI / 2} scale={[4, 3, 1]} />
        <Lightformer form="rect" intensity={0.8} color="#8FBFB5" position={[4, 1, 1]} rotation-y={-Math.PI / 2} scale={[4, 3, 1]} />
      </Environment>
      <Suspense fallback={null}>
        <Framed />
      </Suspense>
    </Canvas>
  );
}

(window as unknown as { __capture: () => string }).__capture = () => {
  const gl = document.querySelector("canvas") as HTMLCanvasElement;
  const S = 800;
  const c = document.createElement("canvas");
  c.width = c.height = S;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(S / 2, S * 0.42, 40, S / 2, S / 2, S * 0.72);
  grad.addColorStop(0, MATERIAL_TONES.greenLift);
  grad.addColorStop(1, BRAND.green);
  g.fillStyle = grad;
  g.fillRect(0, 0, S, S);
  g.drawImage(gl, 0, 0, S, S);
  // visible placeholder label (EN + AR)
  const label = "Illustrative image · صورة توضيحية";
  g.font = '600 22px "Segoe UI", Tahoma, Arial, sans-serif';
  const tw = g.measureText(label).width;
  const pw = tw + 40;
  const ph = 42;
  const x = (S - pw) / 2;
  const y = S - ph - 28;
  g.fillStyle = "rgba(7,43,41,0.86)";
  g.strokeStyle = "rgba(200,169,106,0.7)";
  g.lineWidth = 1.5;
  g.beginPath();
  g.roundRect(x, y, pw, ph, 21);
  g.fill();
  g.stroke();
  g.fillStyle = BRAND.cream;
  g.textBaseline = "middle";
  g.fillText(label, x + 20, y + ph / 2 + 1);
  return c.toDataURL("image/webp", 0.88);
};

createRoot(document.getElementById("root")!).render(<Studio />);
