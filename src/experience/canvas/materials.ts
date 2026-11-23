import * as THREE from "three";
import { BRAND, MATERIAL_TONES as M } from "../config/brand";
import { TEXTURES } from "../config/assetManifest";

/**
 * Shared materials (one instance each, reused by every set) - keeps draw state changes and
 * shader programs to a minimum. Colours come only from the two brand colours plus the material
 * neutrals documented in config/brand.ts.
 */
let cache: ReturnType<typeof build> | null = null;

function std(color: string, roughness: number, metalness = 0, extra: THREE.MeshStandardMaterialParameters = {}) {
  return new THREE.MeshStandardMaterial({ color, roughness, metalness, ...extra });
}

/** Loads a CC0 detail map (non-blocking: materials render flat until it arrives). */
function detail(path: string, repeat: number, colorSpace: THREE.ColorSpace = THREE.NoColorSpace) {
  const t = new THREE.TextureLoader().load(path);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(repeat, repeat);
  t.colorSpace = colorSpace;
  t.anisotropy = 4;
  return t;
}

function build() {
  const paperN = detail(TEXTURES.paperNormal.path, 1.5);
  const paperR = detail(TEXTURES.paperRoughness.path, 1.5);
  const fabricN = detail(TEXTURES.fabricNormal.path, 3);
  const fabricR = detail(TEXTURES.fabricRoughness.path, 3);
  const kraftExtra = { normalMap: paperN, normalScale: new THREE.Vector2(0.55, 0.55), roughnessMap: paperR };
  const fabricExtra = { normalMap: fabricN, normalScale: new THREE.Vector2(0.45, 0.45), roughnessMap: fabricR };
  return {
    greenWall: std("#0B3532", 0.82),
    greenDeep: std(BRAND.green, 0.6),
    greenGlaze: std(BRAND.green, 0.22, 0.05),
    greenFabric: std("#0E3F3C", 0.95, 0, fabricExtra),
    cream: std(BRAND.cream, 0.85),
    creamGloss: std(BRAND.cream, 0.32),
    ceramic: std(M.ceramic, 0.24),
    kraft: std(M.kraft, 0.96, 0, kraftExtra),
    kraftDark: std(M.kraftDark, 0.95, 0, kraftExtra),
    brass: std(M.brass, 0.32, 0.85),
    copper: std(M.copper, 0.35, 0.8),
    steel: std("#B9BEBC", 0.28, 0.9),
    black: std("#121615", 0.5, 0.2),
    coffee: std(M.coffee, 0.12),
    crema: std(M.crema, 0.4),
    milk: std(M.milk, 0.5),
    pastry: std("#C98B4B", 0.75),
    pastryDark: std("#7A4523", 0.8),
    cheesecake: std("#E9D3A8", 0.7),
    wood: std("#5B3E28", 0.72),
    leaf: std("#2F5A3D", 0.8, 0, { side: THREE.DoubleSide }),
    trunk: std("#6B5A45", 0.95),
    glass: new THREE.MeshStandardMaterial({
      color: M.glass,
      roughness: 0.08,
      metalness: 0,
      transparent: true,
      opacity: 0.28,
      depthWrite: false,
    }),
    frosted: new THREE.MeshStandardMaterial({
      color: "#E7EFEC",
      roughness: 0.55,
      metalness: 0,
      transparent: true,
      opacity: 0.5,
      depthWrite: false,
    }),
    ice: new THREE.MeshStandardMaterial({ color: "#EAF4F2", roughness: 0.1, transparent: true, opacity: 0.55, depthWrite: false }),
    warmLight: new THREE.MeshBasicMaterial({ color: "#FFD9A6", toneMapped: false }),
    creamLight: new THREE.MeshBasicMaterial({ color: BRAND.cream, toneMapped: false }),
    windowLight: new THREE.MeshBasicMaterial({ color: "#F6C98A", toneMapped: false }),
  };
}

export type Materials = ReturnType<typeof build>;

export function getMaterials(): Materials {
  if (!cache) cache = build();
  return cache;
}

export function disposeMaterials() {
  if (!cache) return;
  Object.values(cache).forEach((m) => {
    const sm = m as THREE.MeshStandardMaterial;
    sm.normalMap?.dispose();
    sm.roughnessMap?.dispose();
    m.dispose();
  });
  cache = null;
}

/** Soft radial glow texture generated at runtime (no file). */
let glowTex: THREE.CanvasTexture | null = null;
export function getGlowTexture() {
  if (glowTex) return glowTex;
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, "rgba(255,255,255,1)");
  grad.addColorStop(0.35, "rgba(255,255,255,0.45)");
  grad.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 128, 128);
  glowTex = new THREE.CanvasTexture(c);
  glowTex.colorSpace = THREE.SRGBColorSpace;
  return glowTex;
}
