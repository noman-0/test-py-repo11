"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { BRAND } from "../../config/brand";
import { SET_Z } from "../../config/world";
import { MENU_ITEMS } from "@/data/menuData";
import { useExperience, rig, type Tier } from "../../store";
import { getGlowTexture, getMaterials } from "../materials";
import { LOGO_ASPECT, LAYER_NAMES, useLogoLayerTextures } from "../useBrandTextures";
import { HotspotAnchor, Pickable } from "../Hotspot";
import { archShape, useArchTrim } from "../parts/common";
import { Beans, RayFan, Steam, WaveBand } from "../parts/effects";
import { Bottle, Bun, CeramicCup, Chemex, CheesecakeSlice, CoffeeBag, ColdBrewGlass, CortadoGlass, PaperCup, V60 } from "../parts/vessels";
import { BottleCrate, BrewBox, CarryBag, CupCarrier, PastryPlatter, WaveCupStack } from "../parts/packaging";
import {
  BarCounter,
  BaristaCart,
  CafeTable,
  Chair,
  DeskLamp,
  EspressoMachine,
  FinjanTray,
  Grinder,
  LowTable,
  MajlisRun,
  MapPin,
  PendantLamp,
  ReviewStandee,
  RollupBanner,
  Rug,
  Skyline,
} from "../parts/fixtures";
import { Planter } from "../parts/nature";
import { RoomWall } from "../parts/RoomWall";
import type { LogoLayerName } from "../../config/assetManifest";

/** Soft contact shadow (cheap radial blob instead of a shadow-map pass). */
function Blob({ w, d, opacity = 0.45, ...props }: { w: number; d: number; opacity?: number } & JSX.IntrinsicElements["mesh"]) {
  return (
    <mesh rotation-x={-Math.PI / 2} position-y={0.008} {...props}>
      <planeGeometry args={[w, d]} />
      <meshBasicMaterial map={getGlowTexture()} color="#000000" transparent opacity={opacity} depthWrite={false} />
    </mesh>
  );
}

/* ══ 02 · Brand story: the official logo, exploded into its layers ══════════════════════════ */

const LOGO_H = 2.4;
const LAYER_DEPTH: Record<LogoLayerName, number> = {
  frame: -0.36,
  arch: -0.18,
  rays: 0.08,
  drop: 0.34,
  wordmark: 0.16,
  tagline: 0.16,
  arabic: 0.16,
};
const HIGHLIGHT: Record<string, LogoLayerName[]> = {
  "story-arch": ["frame", "arch"],
  "story-drop": ["drop"],
  "story-rays": ["rays"],
};

export function StorySet({ tier }: { tier: Tier }) {
  const m = getMaterials();
  const tex = useLogoLayerTextures();
  const group = useRef<THREE.Group>(null);
  const meshes = useRef<Partial<Record<LogoLayerName, THREE.Mesh>>>({});
  const backTrim = useArchTrim(3.6, 2.1, 0.1, 0.08);
  const backGlow = useMemo(() => new THREE.ShapeGeometry(archShape(3.6, 2.1), 32), []);
  const sepRef = useRef(0);

  useFrame(({ clock }, dt) => {
    const st = useExperience.getState();
    const target = THREE.MathUtils.clamp(1 - Math.abs(rig.s - 1) * 0.9, 0, 1);
    sepRef.current += (target - sepRef.current) * Math.min(1, dt * 3);
    const sep = sepRef.current;
    const t = st.reducedMotion ? 0 : clock.elapsedTime;
    if (group.current) {
      group.current.rotation.y = Math.sin(t * 0.3) * 0.16 * sep + rig.pointer.x * 0.12 * sep;
      group.current.position.y = 2.55 + Math.sin(t * 0.6) * 0.04 * sep;
    }
    const hl = st.hotspot ? HIGHLIGHT[st.hotspot] : undefined;
    for (const n of LAYER_NAMES) {
      const mesh = meshes.current[n];
      if (!mesh) continue;
      mesh.position.z = LAYER_DEPTH[n] * sep;
      const on = !hl || hl.includes(n);
      const mat = mesh.material as THREE.MeshBasicMaterial;
      mat.opacity += ((on ? 1 : 0.28) - mat.opacity) * Math.min(1, dt * 6);
      const s = hl && on ? 1.035 : 1;
      mesh.scale.setScalar(mesh.scale.x + (s - mesh.scale.x) * Math.min(1, dt * 6));
    }
  });

  const w = LOGO_H * LOGO_ASPECT;
  return (
    <group position={[0, 0, SET_Z.story]}>
      <RayFan radius={3.4} width={0.24} opacity={0.12} rotation-x={-Math.PI / 2} position={[0, 0.02, 0.9]} />
      {/* full-width room wall (doorways where the camera travels on); centre kept for the emblem */}
      <RoomWall position={[0, 0, -2.3]} niches={[-9.6, 9.6, -12.8, 12.8]} />
      <group position={[0, 0, -1.7]}>
        <mesh geometry={backGlow} position={[0, 0.25, -0.02]}>
          <meshBasicMaterial map={getGlowTexture()} color="#2E6A61" transparent opacity={0.6} toneMapped={false} depthWrite={false} />
        </mesh>
        <mesh geometry={backTrim} material={m.cream} position={[0, 0.25, 0]} />
      </group>
      <group ref={group} userData={{ noMerge: true }} position={[0, 2.55, 0]}>
        {LAYER_NAMES.map((n, i) => (
          <mesh
            key={n}
            ref={(mm) => {
              if (mm) meshes.current[n] = mm;
            }}
            renderOrder={5 + i}
          >
            <planeGeometry args={[w, LOGO_H]} />
            <meshBasicMaterial map={tex[n]} transparent depthWrite={false} toneMapped={false} side={THREE.DoubleSide} />
          </mesh>
        ))}
        {/* invisible hit areas for each symbol (alpha-free picking) */}
        <Pickable id="story-arch">
          <mesh visible={false} position={[0, 0.3, -0.2]}>
            <planeGeometry args={[w * 0.75, LOGO_H * 0.48]} />
          </mesh>
        </Pickable>
        <Pickable id="story-rays">
          <mesh visible={false} position={[0, 0.66, 0.12]}>
            <circleGeometry args={[0.38, 16]} />
          </mesh>
        </Pickable>
        <Pickable id="story-drop">
          <mesh visible={false} position={[0, 0.2, 0.36]}>
            <circleGeometry args={[0.25, 16]} />
          </mesh>
        </Pickable>
        <HotspotAnchor id="story-arch" position={[-0.52, 0.36, -0.18]} />
        <HotspotAnchor id="story-rays" position={[0.38, 0.72, 0.1]} />
        <HotspotAnchor id="story-drop" position={[0, 0.2, 0.36]} />
      </group>
    </group>
  );
}

/* ══ 03 · Tasting bar: one object per existing menu item ═══════════════════════════════════ */

const ITEM_VISUAL: Record<string, { el: (p: { scale?: number }) => JSX.Element; top: number; steam?: boolean }> = {
  "esp-01": { el: (p) => <CortadoGlass {...p} />, top: 0.18, steam: true },
  "esp-02": { el: (p) => <CeramicCup {...p} />, top: 0.25, steam: true },
  "esp-03": { el: (p) => <CeramicCup scale={1.12} {...p} />, top: 0.28, steam: true },
  "po-01": { el: (p) => <V60 {...p} />, top: 0.46, steam: true },
  "po-02": { el: (p) => <Chemex {...p} />, top: 0.49, steam: true },
  "cb-01": { el: (p) => <ColdBrewGlass {...p} />, top: 0.35 },
  "cb-02": { el: (p) => <Bottle {...p} />, top: 0.4 },
  "pas-01": { el: (p) => <Bun {...p} />, top: 0.13 },
  "pas-02": { el: (p) => <CheesecakeSlice {...p} />, top: 0.13 },
  "bean-01": { el: (p) => <CoffeeBag {...p} />, top: 0.38 },
  "bean-02": { el: (p) => <CoffeeBag rotation-y={-0.18} {...p} />, top: 0.38 },
};
const ITEM_SCALE = 1.35;

export function TastingBarSet() {
  const counterTop = 1.06;
  const items = MENU_ITEMS.filter((i) => ITEM_VISUAL[i.id]);
  const step = 5.9 / Math.max(1, items.length - 1);
  return (
    <group position={[0, 0, SET_Z.menu]}>
      <Blob w={8} d={2.4} opacity={0.5} position={[0, 0, 0]} />
      <BarCounter length={6.6} />
      {items.map((item, i) => {
        const v = ITEM_VISUAL[item.id];
        const x = -2.95 + i * step;
        return (
          <group key={item.id} position={[x, counterTop, 0.08]}>
            <Pickable id={`menu-${item.id}`}>{v.el({ scale: ITEM_SCALE })}</Pickable>
            {v.steam && <Steam position={[0, v.top * ITEM_SCALE, 0]} height={0.55} width={0.24} opacity={0.4} />}
            <HotspotAnchor id={`menu-${item.id}`} position={[0, v.top * ITEM_SCALE + 0.16, 0]} />
          </group>
        );
      })}
      {/* back bar */}
      <RoomWall position={[0, 0, -2.6]} />
      <group position={[0, 0, -1.55]}>
        <mesh position={[0, 0.45, 0]} material={getMaterials().greenWall}>
          <boxGeometry args={[6.2, 0.9, 0.55]} />
        </mesh>
        <mesh position={[0, 0.92, 0]} material={getMaterials().creamGloss}>
          <boxGeometry args={[6.3, 0.05, 0.62]} />
        </mesh>
        <EspressoMachine position={[-1.7, 0.945, 0]} />
        <Grinder position={[-0.75, 0.945, 0]} />
        <WaveCupStack position={[0.2, 0.945, 0.05]} scale={1.3} />
        <WaveCupStack position={[0.6, 0.945, -0.05]} scale={1.3} />
        <CoffeeBag position={[1.35, 0.945, 0]} scale={1.3} />
        <CoffeeBag position={[1.8, 0.945, 0.04]} scale={1.3} rotation-y={0.2} />
        <PaperCup position={[2.55, 0.945, 0]} scale={1.3} />
      </group>
      {[-2.1, 0, 2.1].map((x) => (
        <PendantLamp key={x} position={[x, 2.45, 0.05]} drop={2.6} />
      ))}
    </group>
  );
}

/* ══ 04 · Catering: one object per existing package ════════════════════════════════════════ */

export function CateringSet() {
  const m = getMaterials();
  const tableTop = 0.78;
  return (
    <group position={[0, 0, SET_Z.catering]}>
      <Blob w={6.5} d={2.6} opacity={0.45} position={[-0.6, 0, 0]} />
      {/* event table with tablecloth + wave band skirt */}
      <group position={[-0.95, 0, 0]}>
        <mesh position={[0, tableTop - 0.02, 0]} material={m.greenFabric}>
          <boxGeometry args={[4.5, 0.04, 1.1]} />
        </mesh>
        <mesh position={[0, tableTop / 2, 0.55]} material={m.greenFabric}>
          <boxGeometry args={[4.5, tableTop, 0.02]} />
        </mesh>
        <WaveBand length={4.5} height={0.14} amplitude={0.035} waves={7} position={[0, 0.2, 0.562]} />
      </group>
      <Pickable id="catering-box-3l">
        <BrewBox size={0.42} position={[-2.8, tableTop, 0]} />
      </Pickable>
      <HotspotAnchor id="catering-box-3l" position={[-2.8, tableTop + 0.55, 0]} />
      <Pickable id="catering-box-5l">
        <BrewBox size={0.52} position={[-2.15, tableTop, 0]} rotation-y={-0.12} />
      </Pickable>
      <HotspotAnchor id="catering-box-5l" position={[-2.15, tableTop + 0.62, 0]} />
      <Pickable id="catering-crate-12">
        <BottleCrate cols={4} rows={3} position={[-1.35, tableTop, 0]} />
      </Pickable>
      <HotspotAnchor id="catering-crate-12" position={[-1.35, tableTop + 0.5, 0]} />
      <Pickable id="catering-crate-24">
        <BottleCrate cols={6} rows={4} position={[-0.42, tableTop, 0]} />
      </Pickable>
      <HotspotAnchor id="catering-crate-24" position={[-0.42, tableTop + 0.5, 0]} />
      <Pickable id="catering-pastry-platter">
        <PastryPlatter count={18} position={[0.55, tableTop, 0.05]} />
      </Pickable>
      <HotspotAnchor id="catering-pastry-platter" position={[0.55, tableTop + 0.3, 0.05]} />
      <CupCarrier position={[1.08, tableTop, -0.1]} rotation-y={-0.3} scale={1.1} />

      {/* live barista station */}
      <Blob w={2.2} d={1.4} position={[2.45, 0, 0]} />
      <Pickable id="catering-live-bar">
        <BaristaCart position={[2.45, 0, 0.05]} rotation-y={-0.12} />
      </Pickable>
      <HotspotAnchor id="catering-live-bar" position={[2.45, 1.75, 0.05]} />
      <RollupBanner position={[2.75, 0, -1.0]} rotation-y={-0.25} />

      <CarryBag variant="kraft" position={[-3.05, 0, 0.95]} rotation-y={0.4} scale={1.3} />
      <CarryBag variant="green" position={[-2.55, 0, 1.15]} rotation-y={-0.2} scale={1.3} />
      <RoomWall position={[0, 0, -2.8]} />
    </group>
  );
}

/* ══ 05 · Majlis & café atmosphere ═════════════════════════════════════════════════════════ */

export function MajlisSet() {
  const m = getMaterials();
  return (
    <group position={[0, 0, SET_Z.atmosphere]}>
      <Blob w={6.5} d={4.4} opacity={0.4} />
      <Rug w={5.2} d={3.3} position={[0, 0, -0.1]} />
      <Pickable id="atmo-majlis">
        <MajlisRun length={4.6} position={[0, 0, -1.45]} />
        <MajlisRun length={2.3} position={[-2.55, 0, -0.1]} rotation-y={Math.PI / 2} />
        <MajlisRun length={2.3} position={[2.55, 0, -0.1]} rotation-y={-Math.PI / 2} />
      </Pickable>
      <HotspotAnchor id="atmo-majlis" position={[0, 1.05, -1.4]} />
      <LowTable position={[0, 0, 0]} />
      <FinjanTray position={[0, 0.325, 0]} />
      <Steam position={[0.06, 0.78, 0]} height={0.5} width={0.22} opacity={0.35} />

      {/* back wall: arched niches + rising-rays supergraphic */}
      <RoomWall position={[0, 0, -2.5]} />
      <RayFan radius={1.9} width={0.14} opacity={0.22} position={[0, 3.35, -2.42]} />

      {/* roastery corner */}
      <group position={[2.85, 0, -1.75]} rotation-y={-0.6}>
        <mesh position={[0, 0.45, 0]} material={m.greenWall}>
          <boxGeometry args={[1.1, 0.9, 0.6]} />
        </mesh>
        <mesh position={[0, 0.92, 0]} material={m.creamGloss}>
          <boxGeometry args={[1.18, 0.05, 0.66]} />
        </mesh>
        <Pickable id="atmo-roastery">
          <EspressoMachine position={[-0.12, 0.945, 0]} scale={0.8} />
          <Grinder position={[0.42, 0.945, 0]} scale={0.8} />
        </Pickable>
        <HotspotAnchor id="atmo-roastery" position={[0, 1.65, 0]} />
      </group>

      {/* quiet workspace + Wi-Fi */}
      <group position={[-2.85, 0, 1.25]}>
        <Blob w={1.4} d={1.4} />
        <Pickable id="atmo-workspace">
          <CafeTable top="cream" />
          <Chair position={[0, 0, 0.62]} rotation-y={Math.PI} />
        </Pickable>
        <DeskLamp position={[0.15, 0.78, -0.12]} />
        <CeramicCup position={[-0.15, 0.78, 0.05]} scale={0.7} />
        <HotspotAnchor id="atmo-workspace" position={[0, 1.15, 0.1]} />
        <HotspotAnchor id="atmo-wifi" position={[0.2, 1.55, -0.2]} />
        <Pickable id="atmo-wifi">
          <mesh visible={false} position={[0.2, 1.4, -0.2]}>
            <sphereGeometry args={[0.2, 8, 6]} />
          </mesh>
        </Pickable>
      </group>

      {/* eco packaging shelf */}
      <group position={[2.9, 0, 1.05]} rotation-y={-0.5}>
        <mesh position={[0, 0.35, 0]} material={m.cream}>
          <boxGeometry args={[0.9, 0.7, 0.45]} />
        </mesh>
        <Pickable id="atmo-packaging">
          <CarryBag variant="kraft" position={[-0.2, 0.7, 0]} />
          <WaveCupStack position={[0.25, 0.7, 0]} scale={1.2} />
        </Pickable>
        <HotspotAnchor id="atmo-packaging" position={[0, 1.4, 0]} />
      </group>

      <Planter position={[-3.05, 0, -1.75]} palmHeight={2.2} />
    </group>
  );
}

/* ══ 06 · Doha hub: review standee, location pin, night skyline across the bay ════════════ */

let skyTex: THREE.CanvasTexture | null = null;
function getSkyTexture() {
  if (skyTex) return skyTex;
  const c = document.createElement("canvas");
  c.width = 8;
  c.height = 256;
  const g = c.getContext("2d")!;
  const grad = g.createLinearGradient(0, 0, 0, 256);
  grad.addColorStop(0, BRAND.green);
  grad.addColorStop(0.62, "#0F4A44");
  grad.addColorStop(0.86, "#3C6B5B");
  grad.addColorStop(1, "#C9A97A");
  g.fillStyle = grad;
  g.fillRect(0, 0, 8, 256);
  skyTex = new THREE.CanvasTexture(c);
  skyTex.colorSpace = THREE.SRGBColorSpace;
  return skyTex;
}

export function HubSet() {
  const m = getMaterials();
  return (
    <group position={[0, 0, SET_Z.hub]}>
      {/* terrace */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.006, 0.2]} material={m.greenWall}>
        <planeGeometry args={[9, 6]} />
      </mesh>
      <mesh position={[0, 0.95, -2.6]} rotation-z={Math.PI / 2} material={m.brass}>
        <cylinderGeometry args={[0.025, 0.025, 9, 10]} />
      </mesh>
      {Array.from({ length: 10 }, (_, i) => (
        <mesh key={i} position={[-4.4 + i * 0.98, 0.475, -2.6]} material={m.brass}>
          <cylinderGeometry args={[0.018, 0.018, 0.95, 8]} />
        </mesh>
      ))}

      <group position={[0.6, 0, 0]}>
        <Blob w={1.6} d={1.6} />
        <CafeTable />
        <Pickable id="hub-standee">
          <ReviewStandee position={[0, 0.78, -0.05]} rotation-y={-0.2} scale={1.25} />
        </Pickable>
        <HotspotAnchor id="hub-standee" position={[0, 1.55, -0.05]} />
        <PaperCup position={[-0.22, 0.78, 0.18]} scale={0.85} />
        <CeramicCup position={[0.24, 0.78, 0.16]} scale={0.75} />
        <Chair position={[-0.72, 0, 0.1]} rotation-y={Math.PI / 2} />
        <Chair position={[0.72, 0, -0.1]} rotation-y={-Math.PI / 2} />
      </group>

      <Pickable id="hub-location">
        <MapPin position={[-1.7, 2.35, -1.1]} scale={1.2} />
      </Pickable>
      <HotspotAnchor id="hub-location" position={[-1.7, 3.35, -1.1]} />

      {/* bay + skyline + sunrise rays (fog-free backdrop) */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.01, -17]}>
        <planeGeometry args={[120, 28]} />
        <meshStandardMaterial color="#05302C" roughness={0.18} metalness={0.55} />
      </mesh>
      <Skyline position={[0, 0, -34]} />
      <RayFan radius={34} width={2.2} opacity={0.06} position={[0, -6, -60]} />
      <mesh position={[0, 20, -75]}>
        <planeGeometry args={[260, 70]} />
        <meshBasicMaterial map={getSkyTexture()} fog={false} toneMapped={false} />
      </mesh>
    </group>
  );
}
