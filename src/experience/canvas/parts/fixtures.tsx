"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { BRAND, MATERIAL_TONES } from "../../config/brand";
import { getGlowTexture, getMaterials } from "../materials";
import { useLogoTextures } from "../useBrandTextures";
import { LogoPlane, archShape, useArchTrim, useLathe } from "./common";
import { WaveBand } from "./effects";
import { useExperience } from "../../store";

type G = JSX.IntrinsicElements["group"];

/* ── Bar equipment ─────────────────────────────────────────────────────────────────────── */

export function EspressoMachine({ scale = 1, ...props }: { scale?: number } & G) {
  const m = getMaterials();
  return (
    <group scale={scale} {...props}>
      <RoundedBox args={[0.95, 0.46, 0.55]} radius={0.05} smoothness={3} position={[0, 0.33, 0]} material={m.greenDeep} />
      <mesh position={[0, 0.575, 0]} material={m.steel}>
        <boxGeometry args={[0.9, 0.03, 0.5]} />
      </mesh>
      {/* cup warmer rail */}
      <mesh position={[0, 0.62, 0.2]} rotation-z={Math.PI / 2} material={m.brass}>
        <cylinderGeometry args={[0.012, 0.012, 0.86, 8]} />
      </mesh>
      {/* group heads + portafilters */}
      {[-0.2, 0.2].map((x) => (
        <group key={x} position={[x, 0.18, 0.28]}>
          <mesh material={m.brass}>
            <cylinderGeometry args={[0.055, 0.065, 0.06, 20]} />
          </mesh>
          <mesh position={[0, -0.045, 0.02]} material={m.steel}>
            <cylinderGeometry args={[0.05, 0.045, 0.035, 20]} />
          </mesh>
          <mesh position={[0, -0.05, 0.13]} rotation-x={Math.PI / 2} material={m.black}>
            <cylinderGeometry args={[0.014, 0.018, 0.2, 10]} />
          </mesh>
        </group>
      ))}
      {/* steam wand */}
      <mesh position={[0.42, 0.14, 0.3]} rotation-z={0.15} material={m.steel}>
        <cylinderGeometry args={[0.008, 0.008, 0.22, 8]} />
      </mesh>
      {/* drip tray + feet */}
      <mesh position={[0, 0.06, 0.24]} material={m.steel}>
        <boxGeometry args={[0.8, 0.025, 0.2]} />
      </mesh>
      {[-0.4, 0.4].map((x) => (
        <mesh key={x} position={[x, 0.04, 0]} material={m.black}>
          <cylinderGeometry args={[0.03, 0.03, 0.08, 10]} />
        </mesh>
      ))}
    </group>
  );
}

export function Grinder(props: G) {
  const m = getMaterials();
  const hopper = useLathe(
    [
      [0.03, 0],
      [0.1, 0.16],
      [0.11, 0.2],
      [0.104, 0.2],
      [0.094, 0.16],
      [0.026, 0.006],
    ],
    24
  );
  return (
    <group {...props}>
      <mesh position={[0, 0.17, 0]} material={m.greenDeep}>
        <boxGeometry args={[0.18, 0.34, 0.24]} />
      </mesh>
      <mesh position={[0, 0.36, 0]} material={m.brass}>
        <cylinderGeometry args={[0.06, 0.07, 0.05, 20]} />
      </mesh>
      <group position={[0, 0.38, 0]}>
        <mesh geometry={hopper} material={m.glass} />
        <mesh position={[0, 0.06, 0]} material={m.coffee}>
          <cylinderGeometry args={[0.07, 0.035, 0.1, 18]} />
        </mesh>
      </group>
    </group>
  );
}

export function PendantLamp({ drop = 2.4, ...props }: { drop?: number } & G) {
  const m = getMaterials();
  const shade = useLathe(
    [
      [0.02, 0.2],
      [0.06, 0.18],
      [0.16, 0.06],
      [0.2, 0],
      [0.19, 0],
      [0.15, 0.055],
      [0.055, 0.17],
      [0.02, 0.19],
    ],
    32
  );
  return (
    <group {...props}>
      <mesh position={[0, drop / 2 + 0.2, 0]} material={m.black}>
        <cylinderGeometry args={[0.006, 0.006, drop, 6]} />
      </mesh>
      <mesh geometry={shade} material={m.brass} />
      <mesh position={[0, 0.03, 0]} material={m.warmLight}>
        <sphereGeometry args={[0.055, 16, 10]} />
      </mesh>
    </group>
  );
}

/** Tasting-bar counter: green front with the cream wave band, cream stone top. */
export function BarCounter({ length = 6.6, ...props }: { length?: number } & G) {
  const m = getMaterials();
  return (
    <group {...props}>
      <mesh position={[0, 0.5, 0]} material={m.greenWall}>
        <boxGeometry args={[length, 1.0, 0.8]} />
      </mesh>
      <mesh position={[0, 1.03, 0.02]} material={m.creamGloss}>
        <boxGeometry args={[length + 0.15, 0.06, 0.92]} />
      </mesh>
      <WaveBand length={length} height={0.16} amplitude={0.04} waves={9} position={[0, 0.42, 0.401]} />
      <mesh position={[0, 0.06, 0.42]} material={m.brass}>
        <boxGeometry args={[length, 0.04, 0.04]} />
      </mesh>
    </group>
  );
}

/** Back wall with glowing arched niches (logo's arched frame). */
export function ArchWall({ width = 8, height = 4.4, niches = 3, ...props }: { width?: number; height?: number; niches?: number } & G) {
  const m = getMaterials();
  const trim = useArchTrim(1.3, 1.4, 0.07, 0.05);
  const glass = useMemo(() => new THREE.ShapeGeometry(archShape(1.3, 1.4), 24), []);
  return (
    <group {...props}>
      <mesh position={[0, height / 2, 0]} material={m.greenWall}>
        <boxGeometry args={[width, height, 0.2]} />
      </mesh>
      {Array.from({ length: niches }, (_, i) => {
        const x = (i - (niches - 1) / 2) * (width / niches);
        return (
          <group key={i} position={[x, 1.35, 0.101]}>
            <mesh geometry={glass}>
              <meshBasicMaterial map={getGlowTexture()} color="#E9B77A" transparent opacity={0.55} toneMapped={false} />
            </mesh>
            <mesh geometry={trim} material={m.cream} />
            <mesh position={[0, 0.9, 0.12]} material={m.cream}>
              <boxGeometry args={[1.1, 0.03, 0.22]} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

/** Mobile barista cart for the live station. */
export function BaristaCart(props: G) {
  const m = getMaterials();
  return (
    <group {...props}>
      <mesh position={[0, 0.48, 0]} material={m.greenDeep}>
        <boxGeometry args={[1.3, 0.86, 0.62]} />
      </mesh>
      <mesh position={[0, 0.93, 0]} material={m.creamGloss}>
        <boxGeometry args={[1.38, 0.05, 0.7]} />
      </mesh>
      <mesh position={[0, 0.7, 0.36]} rotation-z={Math.PI / 2} material={m.brass}>
        <cylinderGeometry args={[0.014, 0.014, 1.25, 8]} />
      </mesh>
      {[
        [-0.55, -0.24],
        [0.55, -0.24],
        [-0.55, 0.24],
        [0.55, 0.24],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.05, z]} rotation-x={Math.PI / 2} material={m.black}>
          <torusGeometry args={[0.04, 0.015, 8, 16]} />
        </mesh>
      ))}
      <EspressoMachine scale={0.7} position={[-0.15, 0.95, -0.05]} />
      <Grinder position={[0.48, 0.95, -0.05]} scale={0.9} />
    </group>
  );
}

/** Roll-up banner: copper tube frame (guide p.20) with brand-green panel and official logo. */
export function RollupBanner(props: G) {
  const m = getMaterials();
  const { cream } = useLogoTextures();
  const W = 1.0;
  const H = 2.1;
  const tube = 0.025;
  return (
    <group {...props}>
      <mesh position={[0, H / 2 + 0.1, 0]} material={m.greenDeep}>
        <planeGeometry args={[W - 0.08, H - 0.08]} />
      </mesh>
      <LogoPlane map={cream} height={1.05} position={[0, H / 2 + 0.1, 0.005]} />
      {[
        [0, 0.1, W, true],
        [0, H + 0.1, W, true],
      ].map(([x, y, len], i) => (
        <mesh key={i} position={[x as number, y as number, 0]} rotation-z={Math.PI / 2} material={m.copper}>
          <cylinderGeometry args={[tube, tube, len as number, 10]} />
        </mesh>
      ))}
      {[-W / 2, W / 2].map((x) => (
        <mesh key={x} position={[x, H / 2 + 0.1, 0]} material={m.copper}>
          <cylinderGeometry args={[tube, tube, H, 10]} />
        </mesh>
      ))}
      {[-0.3, 0.3].map((x) => (
        <mesh key={x} position={[x, 0.05, 0.08]} rotation-x={Math.PI / 2} material={m.copper}>
          <cylinderGeometry args={[0.015, 0.015, 0.3, 8]} />
        </mesh>
      ))}
    </group>
  );
}

/* ── Majlis ─────────────────────────────────────────────────────────────────────────────── */

/** Low floor seating run: seat cushion + back cushion + cream bolster ends. */
export function MajlisRun({ length = 4, ...props }: { length?: number } & G) {
  const m = getMaterials();
  return (
    <group {...props}>
      <RoundedBox args={[length, 0.26, 0.78]} radius={0.06} smoothness={3} position={[0, 0.13, 0]} material={m.greenFabric} />
      <RoundedBox args={[length, 0.56, 0.2]} radius={0.07} smoothness={3} position={[0, 0.5, -0.32]} material={m.greenFabric} />
      {[-length / 2 + 0.1, length / 2 - 0.1].map((x) => (
        <mesh key={x} position={[x, 0.38, 0]} rotation-x={Math.PI / 2} material={m.cream}>
          <cylinderGeometry args={[0.11, 0.11, 0.7, 20]} />
        </mesh>
      ))}
    </group>
  );
}

/** Procedural rug in brand colours: border lines, wave borders, central ray fan. */
let rugTex: THREE.CanvasTexture | null = null;
function getRugTexture() {
  if (rugTex) return rugTex;
  const c = document.createElement("canvas");
  c.width = 1024;
  c.height = 640;
  const g = c.getContext("2d")!;
  g.fillStyle = MATERIAL_TONES.greenLift;
  g.fillRect(0, 0, 1024, 640);
  g.strokeStyle = BRAND.cream;
  g.globalAlpha = 0.85;
  g.lineWidth = 10;
  g.strokeRect(34, 34, 956, 572);
  g.lineWidth = 3;
  g.strokeRect(62, 62, 900, 516);
  // wave borders
  g.globalAlpha = 0.55;
  g.lineWidth = 6;
  for (const y of [100, 540]) {
    g.beginPath();
    for (let x = 80; x <= 944; x += 4) g.lineTo(x, y + 12 * Math.sin((x / 864) * 12 * Math.PI));
    g.stroke();
  }
  // central ray fan
  g.globalAlpha = 0.6;
  g.fillStyle = BRAND.cream;
  const cx = 512;
  const cy = 400;
  for (let i = 0; i < 7; i++) {
    const a = Math.PI * (1.12 + (0.76 * i) / 6);
    g.save();
    g.translate(cx, cy);
    g.rotate(a + Math.PI / 2);
    g.fillRect(-9, 70, 18, 140);
    g.restore();
  }
  g.fillRect(cx - 230, cy - 14, 460, 18);
  g.globalAlpha = 1;
  rugTex = new THREE.CanvasTexture(c);
  rugTex.colorSpace = THREE.SRGBColorSpace;
  rugTex.anisotropy = 4;
  return rugTex;
}

export function Rug({ w = 5.2, d = 3.3, ...props }: { w?: number; d?: number } & G) {
  const tex = useMemo(() => getRugTexture(), []);
  return (
    <group {...props}>
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.012, 0]}>
        <planeGeometry args={[w, d]} />
        <meshStandardMaterial map={tex} roughness={0.95} />
      </mesh>
    </group>
  );
}

/** Brass dallah (Arabic coffee pot). */
export function Dallah({ scale = 1, ...props }: { scale?: number } & G) {
  const m = getMaterials();
  const body = useLathe(
    [
      [0, 0],
      [0.13, 0],
      [0.15, 0.03],
      [0.15, 0.1],
      [0.09, 0.2],
      [0.06, 0.26],
      [0.075, 0.3],
      [0.05, 0.36],
      [0.06, 0.38],
      [0.03, 0.42],
      [0.012, 0.47],
      [0, 0.48],
    ],
    32
  );
  const spout = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.1, 0.12, 0),
      new THREE.Vector3(0.18, 0.2, 0),
      new THREE.Vector3(0.22, 0.32, 0),
      new THREE.Vector3(0.3, 0.38, 0),
    ]);
    return new THREE.TubeGeometry(curve, 20, 0.018, 8, false);
  }, []);
  const handle = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.06, 0.34, 0),
      new THREE.Vector3(-0.17, 0.33, 0),
      new THREE.Vector3(-0.19, 0.18, 0),
      new THREE.Vector3(-0.13, 0.07, 0),
    ]);
    return new THREE.TubeGeometry(curve, 20, 0.014, 8, false);
  }, []);
  return (
    <group scale={scale} {...props}>
      <mesh geometry={body} material={m.brass} />
      <mesh geometry={spout} material={m.brass} />
      <mesh geometry={handle} material={m.brass} />
    </group>
  );
}

export function FinjanTray(props: G) {
  const m = getMaterials();
  const cup = useLathe(
    [
      [0, 0],
      [0.03, 0],
      [0.045, 0.045],
      [0.042, 0.045],
      [0.027, 0.006],
      [0, 0.006],
    ],
    20
  );
  return (
    <group {...props}>
      <mesh position={[0, 0.012, 0]} material={m.brass}>
        <cylinderGeometry args={[0.34, 0.32, 0.024, 36]} />
      </mesh>
      {Array.from({ length: 6 }, (_, i) => {
        const a = (i / 6) * Math.PI * 2;
        return <mesh key={i} geometry={cup} material={m.ceramic} position={[Math.cos(a) * 0.22, 0.024, Math.sin(a) * 0.22]} />;
      })}
      <Dallah scale={0.85} position={[0, 0.024, 0]} />
    </group>
  );
}

export function LowTable(props: G) {
  const m = getMaterials();
  return (
    <group {...props}>
      <mesh position={[0, 0.3, 0]} material={m.cream}>
        <cylinderGeometry args={[0.6, 0.6, 0.05, 40]} />
      </mesh>
      <mesh position={[0, 0.14, 0]} material={m.brass}>
        <cylinderGeometry args={[0.08, 0.16, 0.28, 20]} />
      </mesh>
    </group>
  );
}

export function CafeTable({ top = "green", ...props }: { top?: "green" | "cream" } & G) {
  const m = getMaterials();
  return (
    <group {...props}>
      <mesh position={[0, 0.76, 0]} material={top === "green" ? m.greenGlaze : m.cream}>
        <cylinderGeometry args={[0.42, 0.42, 0.04, 36]} />
      </mesh>
      <mesh position={[0, 0.38, 0]} material={m.brass}>
        <cylinderGeometry args={[0.03, 0.03, 0.74, 12]} />
      </mesh>
      <mesh position={[0, 0.015, 0]} material={m.brass}>
        <cylinderGeometry args={[0.24, 0.26, 0.03, 24]} />
      </mesh>
    </group>
  );
}

export function Chair(props: G) {
  const m = getMaterials();
  return (
    <group {...props}>
      <RoundedBox args={[0.46, 0.07, 0.46]} radius={0.03} position={[0, 0.46, 0]} material={m.greenFabric} />
      <RoundedBox args={[0.46, 0.46, 0.06]} radius={0.03} position={[0, 0.72, -0.21]} material={m.greenFabric} />
      {[
        [-0.19, -0.19],
        [0.19, -0.19],
        [-0.19, 0.19],
        [0.19, 0.19],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.22, z]} material={m.brass}>
          <cylinderGeometry args={[0.015, 0.015, 0.44, 8]} />
        </mesh>
      ))}
    </group>
  );
}

export function DeskLamp(props: G) {
  const m = getMaterials();
  return (
    <group {...props}>
      <mesh position={[0, 0.01, 0]} material={m.brass}>
        <cylinderGeometry args={[0.07, 0.08, 0.02, 16]} />
      </mesh>
      <mesh position={[0, 0.2, 0]} material={m.brass}>
        <cylinderGeometry args={[0.008, 0.008, 0.38, 8]} />
      </mesh>
      <mesh position={[0, 0.4, 0]} material={m.cream}>
        <cylinderGeometry args={[0.06, 0.11, 0.12, 20, 1, true]} />
      </mesh>
      <mesh position={[0, 0.37, 0]} material={m.warmLight}>
        <sphereGeometry args={[0.035, 12, 8]} />
      </mesh>
    </group>
  );
}

/* ── Doha hub ───────────────────────────────────────────────────────────────────────────── */

function cssFont(varName: string, fallback: string) {
  const v = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
  return v ? `${v}, ${fallback}` : fallback;
}

function wrap(g: CanvasRenderingContext2D, text: string, maxW: number) {
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    const t = line ? `${line} ${w}` : w;
    if (g.measureText(t).width > maxW && line) {
      lines.push(line);
      line = w;
    } else line = t;
  }
  if (line) lines.push(line);
  return lines;
}

/**
 * Table review standee (guide p.22; matches the site's existing "#reviews" standee block).
 * Card copy is the site's existing review text. The QR code is intentionally NOT reproduced:
 * the official logo is shown instead (no QR data was supplied).
 */
export function ReviewStandee(props: G) {
  const m = getMaterials();
  const { green } = useLogoTextures();
  const locale = useExperience((s) => s.locale);
  const tex = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 512;
    c.height = 768;
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 4;
    return t;
  }, []);

  useEffect(() => {
    let cancelled = false;
    const draw = () => {
      if (cancelled) return;
      const c = tex.image as HTMLCanvasElement;
      const g = c.getContext("2d")!;
      const ar = locale === "ar";
      g.fillStyle = "#FFFFFF";
      g.fillRect(0, 0, 512, 768);
      g.fillStyle = BRAND.green;
      g.textAlign = "center";
      g.direction = ar ? "rtl" : "ltr";
      const sans = cssFont(ar ? "--font-arabic-nf" : "--font-sans-nf", "sans-serif");
      g.font = `700 44px ${sans}`;
      const title = ar ? "هل أعجبتك قهوتنا وخدمتنا؟" : "Happy with our service?";
      wrap(g, title, 440).forEach((l, i) => g.fillText(l, 256, 110 + i * 54));
      g.font = `400 24px ${sans}`;
      g.fillStyle = "#3B5C59";
      const sub = ar
        ? "شاركنا رأيك وساعد الآخرين في اكتشاف قهوتنا. قيّمنا عبر منصة جوجل أو كلاوتلي."
        : "Help spread the word. Review us on Google or Cloutly as seen on our café table standees.";
      wrap(g, sub, 420).forEach((l, i) => g.fillText(l, 256, 250 + i * 34));
      g.fillStyle = "#E0B43A";
      g.font = `400 44px sans-serif`;
      g.direction = "ltr";
      g.fillText("★★★★★", 256, 430);
      const img = green.image as HTMLImageElement | undefined;
      if (img && img.width) {
        const h = 250;
        const w = (h * img.width) / img.height; // official aspect
        g.drawImage(img, 256 - w / 2, 470, w, h);
      }
      tex.needsUpdate = true;
    };
    draw();
    document.fonts?.ready.then(draw).catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [locale, tex, green]);

  const base = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-0.2, 0);
    s.quadraticCurveTo(0, 0.08, 0.2, 0);
    s.lineTo(0.2, 0.03);
    s.quadraticCurveTo(0, 0.11, -0.2, 0.03);
    s.closePath();
    return new THREE.ExtrudeGeometry(s, { depth: 0.12, bevelEnabled: false });
  }, []);

  return (
    <group {...props}>
      <mesh geometry={base} material={m.greenDeep} position={[0, 0, -0.06]} />
      <mesh position={[0, 0.3, 0]}>
        <planeGeometry args={[0.34, 0.51]} />
        <meshStandardMaterial map={tex} roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.3, 0.006]} material={m.glass}>
        <boxGeometry args={[0.36, 0.53, 0.008]} />
      </mesh>
    </group>
  );
}

/** Generic location pin (not the logo) that gently bobs. */
export function MapPin(props: G) {
  const m = getMaterials();
  const ref = useRef<THREE.Group>(null);
  const geo = useLathe(
    [
      [0, 0],
      [0.06, 0.12],
      [0.16, 0.34],
      [0.2, 0.46],
      [0.19, 0.55],
      [0.14, 0.62],
      [0.07, 0.655],
      [0, 0.66],
    ],
    32
  );
  useFrame(({ clock }) => {
    if (!ref.current || useExperience.getState().reducedMotion) return;
    ref.current.position.y = Math.sin(clock.elapsedTime * 1.4) * 0.06;
    ref.current.rotation.y = clock.elapsedTime * 0.5;
  });
  return (
    <group {...props} userData={{ noMerge: true }}>
      <group ref={ref}>
        <mesh geometry={geo} material={m.cream} />
        <mesh position={[0, 0.47, 0]} material={m.greenDeep}>
          <sphereGeometry args={[0.075, 20, 14]} />
        </mesh>
      </group>
      <mesh rotation-x={-Math.PI / 2} position={[0, -0.85, 0]}>
        <planeGeometry args={[1.2, 1.2]} />
        <meshBasicMaterial map={getGlowTexture()} color={BRAND.cream} transparent opacity={0.35} depthWrite={false} toneMapped={false} />
      </mesh>
    </group>
  );
}

/** Lit-window texture for skyline towers (generated). */
let winTex: THREE.CanvasTexture | null = null;
function getWindowTexture() {
  if (winTex) return winTex;
  const c = document.createElement("canvas");
  c.width = 64;
  c.height = 64;
  const g = c.getContext("2d")!;
  g.fillStyle = "#000";
  g.fillRect(0, 0, 64, 64);
  for (let y = 4; y < 64; y += 8)
    for (let x = 4; x < 64; x += 8) {
      const r = Math.random();
      g.fillStyle = r > 0.62 ? "#FFD9A0" : r > 0.5 ? "#7FA39B" : "#0a1513";
      g.fillRect(x, y, 4, 5);
    }
  winTex = new THREE.CanvasTexture(c);
  winTex.wrapS = winTex.wrapT = THREE.RepeatWrapping;
  winTex.colorSpace = THREE.SRGBColorSpace;
  winTex.magFilter = THREE.NearestFilter;
  return winTex;
}

/** Stylised night skyline across the bay (generic forms - not a literal map of Doha). */
export function Skyline(props: G) {
  const towers = useMemo(() => {
    let seed = 7;
    const rnd = () => {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    };
    return Array.from({ length: 17 }, (_, i) => {
      const x = -30 + i * 3.75 + (rnd() - 0.5) * 1.5;
      const centre = 1 - Math.min(1, Math.abs(x) / 30);
      const h = 6 + centre * 18 + rnd() * 6;
      const w = 1.4 + rnd() * 1.6;
      const kind = rnd() > 0.72 ? "cyl" : rnd() > 0.5 ? "taper" : "box";
      return { x, z: -rnd() * 8, h, w, kind };
    });
  }, []);
  const mat = useMemo(() => {
    const tex = getWindowTexture();
    return new THREE.MeshStandardMaterial({
      color: "#0B2826",
      roughness: 0.6,
      metalness: 0.2,
      emissive: new THREE.Color("#FFFFFF"),
      emissiveMap: tex,
      emissiveIntensity: 0.9,
    });
  }, []);
  return (
    <group {...props}>
      {towers.map((t, i) => {
        let geo: THREE.BufferGeometry;
        if (t.kind === "cyl") geo = new THREE.CylinderGeometry(t.w * 0.55, t.w * 0.6, t.h, 20);
        else if (t.kind === "taper") geo = new THREE.CylinderGeometry(t.w * 0.25, t.w * 0.7, t.h, 4);
        else geo = new THREE.BoxGeometry(t.w, t.h, t.w);
        // scale UVs so window density is constant regardless of tower size
        const uv = geo.attributes.uv as THREE.BufferAttribute;
        for (let k = 0; k < uv.count; k++) uv.setXY(k, uv.getX(k) * t.w * 1.6, uv.getY(k) * t.h * 0.8);
        return <mesh key={i} geometry={geo} material={mat} position={[t.x, t.h / 2, t.z]} />;
      })}
    </group>
  );
}
