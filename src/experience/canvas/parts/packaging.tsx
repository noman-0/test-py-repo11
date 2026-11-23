"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { BRAND } from "../../config/brand";
import { getMaterials } from "../materials";
import { useLogoTextures } from "../useBrandTextures";
import { LogoPlane, LogoWrap, archShape } from "./common";

type G = JSX.IntrinsicElements["group"];

/** Kraft carton batch-brew box with dispenser spout (guide p.21). */
export function BrewBox({ size = 0.5, ...props }: { size?: number } & G) {
  const m = getMaterials();
  const { green } = useLogoTextures();
  const h = size * 0.82;
  return (
    <group {...props}>
      <mesh position={[0, h / 2, 0]} material={m.kraft}>
        <boxGeometry args={[size, h, size * 0.9]} />
      </mesh>
      {/* top flap seam */}
      <mesh position={[0, h + 0.002, 0]} material={m.kraftDark}>
        <boxGeometry args={[size * 0.98, 0.004, 0.012]} />
      </mesh>
      <LogoPlane map={green} height={h * 0.62} lit position={[-size * 0.08, h * 0.55, size * 0.451]} />
      {/* spout */}
      <mesh position={[size * 0.32, h * 0.16, size * 0.47]} rotation-x={Math.PI / 2} material={m.black}>
        <cylinderGeometry args={[0.022, 0.022, 0.06, 12]} />
      </mesh>
      <mesh position={[size * 0.32, h * 0.12, size * 0.5]} material={m.black}>
        <boxGeometry args={[0.03, 0.04, 0.03]} />
      </mesh>
    </group>
  );
}

/** Kraft crate of bottled cold brew (bottle caps visible). */
export function BottleCrate({ cols = 4, rows = 3, ...props }: { cols?: number; rows?: number } & G) {
  const m = getMaterials();
  const { green } = useLogoTextures();
  const pitch = 0.11;
  const w = cols * pitch + 0.06;
  const d = rows * pitch + 0.06;
  const h = 0.26;
  const bottleGeo = useMemo(() => new THREE.CylinderGeometry(0.045, 0.045, 0.3, 14), []);
  const capGeo = useMemo(() => new THREE.CylinderGeometry(0.025, 0.025, 0.03, 12), []);
  const bottles = useMemo(() => {
    const list: [number, number][] = [];
    for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) list.push([(i - (cols - 1) / 2) * pitch, (j - (rows - 1) / 2) * pitch]);
    return list;
  }, [cols, rows]);
  return (
    <group {...props}>
      {/* open crate walls */}
      <mesh position={[0, 0.02, 0]} material={m.kraftDark}>
        <boxGeometry args={[w, 0.04, d]} />
      </mesh>
      {[
        [0, h / 2, d / 2, w, 0.02],
        [0, h / 2, -d / 2, w, 0.02],
      ].map(([x, y, z, ww, dd], i) => (
        <mesh key={i} position={[x, y, z]} material={m.kraft}>
          <boxGeometry args={[ww, h, dd]} />
        </mesh>
      ))}
      {[-1, 1].map((sx) => (
        <mesh key={sx} position={[(sx * w) / 2, h / 2, 0]} material={m.kraft}>
          <boxGeometry args={[0.02, h, d]} />
        </mesh>
      ))}
      <LogoPlane map={green} height={h * 0.8} lit position={[0, h / 2, d / 2 + 0.012]} />
      {bottles.map(([x, z], i) => (
        <group key={i} position={[x, 0.04, z]}>
          <mesh geometry={bottleGeo} material={m.coffee} position={[0, 0.15, 0]} />
          <mesh geometry={capGeo} material={m.cream} position={[0, 0.315, 0]} />
        </group>
      ))}
    </group>
  );
}

/** Arched cup carrier with two cups (guide p.13). */
export function CupCarrier(props: G) {
  const m = getMaterials();
  const { cream } = useLogoTextures();
  const geo = useMemo(() => {
    const s = archShape(0.5, 0.22);
    const hole = new THREE.Path();
    hole.moveTo(-0.08, 0.42);
    hole.lineTo(0.08, 0.42);
    hole.lineTo(0.08, 0.46);
    hole.lineTo(-0.08, 0.46);
    hole.closePath();
    s.holes.push(hole);
    const g = new THREE.ExtrudeGeometry(s, { depth: 0.2, bevelEnabled: false, curveSegments: 24 });
    g.translate(0, 0, -0.1);
    return g;
  }, []);
  return (
    <group {...props}>
      {[-0.11, 0.11].map((x) => (
        <mesh key={x} position={[x, 0.12, 0]} material={m.cream}>
          <cylinderGeometry args={[0.075, 0.058, 0.24, 24]} />
        </mesh>
      ))}
      <group position={[0, 0.2, 0]}>
        <mesh geometry={geo} material={m.greenDeep} />
        <LogoPlane map={cream} height={0.3} position={[0, 0.24, 0.102]} />
      </group>
    </group>
  );
}

/** Carry bag - kraft (guide p.17) or premium green (guide p.25). */
export function CarryBag({ variant = "kraft", ...props }: { variant?: "kraft" | "green" } & G) {
  const m = getMaterials();
  const { green, cream } = useLogoTextures();
  const body = variant === "kraft" ? m.kraft : m.greenDeep;
  const handle = useMemo(() => new THREE.TorusGeometry(0.08, 0.008, 6, 20, Math.PI), []);
  return (
    <group {...props}>
      <mesh position={[0, 0.22, 0]} material={body}>
        <boxGeometry args={[0.36, 0.44, 0.16]} />
      </mesh>
      {[-0.04, 0.04].map((z) => (
        <mesh key={z} geometry={handle} position={[0, 0.44, z]} material={variant === "kraft" ? m.kraftDark : m.cream} />
      ))}
      <LogoPlane map={variant === "kraft" ? green : cream} height={0.3} lit={variant === "kraft"} position={[0, 0.23, 0.081]} />
    </group>
  );
}

/** Brass tray with mini pastries. */
export function PastryPlatter({ count = 14, ...props }: { count?: number } & G) {
  const m = getMaterials();
  const bun = useMemo(() => new THREE.SphereGeometry(0.045, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2), []);
  const spots = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const ring = i < 5 ? 0.11 : 0.23;
        const n = i < 5 ? 5 : count - 5;
        const k = i < 5 ? i : i - 5;
        const a = (k / n) * Math.PI * 2;
        return [Math.cos(a) * ring, Math.sin(a) * ring] as [number, number];
      }),
    [count]
  );
  return (
    <group {...props}>
      <mesh position={[0, 0.015, 0]} material={m.brass}>
        <cylinderGeometry args={[0.32, 0.3, 0.03, 40]} />
      </mesh>
      {spots.map(([x, z], i) => (
        <mesh key={i} geometry={bun} position={[x, 0.03, z]} material={i % 3 === 0 ? m.pastryDark : m.pastry} scale={[1, 0.8, 1]} />
      ))}
    </group>
  );
}

/** Wave texture (cream band, transparent elsewhere) generated at runtime - seamless around a cup. */
let waveTex: THREE.CanvasTexture | null = null;
function getWaveTexture() {
  if (waveTex) return waveTex;
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 128;
  const g = c.getContext("2d")!;
  g.fillStyle = BRAND.cream;
  g.beginPath();
  const waves = 3;
  g.moveTo(0, 128);
  for (let x = 0; x <= 512; x += 4) g.lineTo(x, 64 + 26 * Math.sin((x / 512) * waves * Math.PI * 2));
  g.lineTo(512, 128);
  g.closePath();
  g.fill();
  waveTex = new THREE.CanvasTexture(c);
  waveTex.colorSpace = THREE.SRGBColorSpace;
  return waveTex;
}

/** Stack of three green paper cups with the cream wave band (guide p.12). */
export function WaveCupStack(props: G) {
  const m = getMaterials();
  const { cream } = useLogoTextures();
  const tex = useMemo(() => getWaveTexture(), []);
  return (
    <group {...props}>
      {[0, 0.035, 0.07].map((y, i) => (
        <mesh key={i} position={[0, 0.13 + y, 0]} material={m.greenDeep}>
          <cylinderGeometry args={[0.112, 0.08, 0.26, 32, 1, i > 0]} />
        </mesh>
      ))}
      <mesh position={[0, 0.07, 0]}>
        {/* band spans y 0.015..0.125 of the cup; radii sit just outside the wall there */}
        <cylinderGeometry args={[0.0975, 0.083, 0.11, 40, 1, true]} />
        <meshStandardMaterial map={tex} transparent roughness={0.8} depthWrite={false} polygonOffset polygonOffsetFactor={-2} />
      </mesh>
      <LogoWrap map={cream} rTop={0.112} rBottom={0.08} height={0.26} y={0.175} logoHeight={0.1} />
    </group>
  );
}
