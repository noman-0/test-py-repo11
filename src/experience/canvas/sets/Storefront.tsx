"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { getGlowTexture, getMaterials } from "../materials";
import { useLogoTextures } from "../useBrandTextures";
import { LogoPlane, archShape, traceArch, useArchTrim } from "../parts/common";
import { Planter } from "../parts/nature";
import { useExperience, rig } from "../../store";
import { HotspotAnchor, Pickable } from "../Hotspot";
import { SET_Z } from "../../config/world";

const DOOR_W = 2.6;
const DOOR_STRAIGHT = 2.5;
const WIN_W = 2.0;
const WIN_STRAIGHT = 1.9;
const WIN_Y = 0.7;
const WALL_W = 13;
const WALL_H = 6.2;
const WALL_D = 0.35;

const smooth = (a: number, b: number, x: number) => {
  const t = THREE.MathUtils.clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};

function useFacadeGeometry() {
  return useMemo(() => {
    const r = DOOR_W / 2;
    const s = new THREE.Shape();
    s.moveTo(-WALL_W / 2, 0);
    s.lineTo(-r, 0);
    s.lineTo(-r, DOOR_STRAIGHT);
    s.absarc(0, DOOR_STRAIGHT, r, Math.PI, 0, true); // arched doorway (logo's arched frame)
    s.lineTo(r, 0);
    s.lineTo(WALL_W / 2, 0);
    s.lineTo(WALL_W / 2, WALL_H);
    s.lineTo(-WALL_W / 2, WALL_H);
    s.closePath();
    for (const cx of [-3.7, 3.7]) {
      const h = new THREE.Path();
      traceArch(h, cx, WIN_Y, WIN_W, WIN_STRAIGHT);
      s.holes.push(h);
    }
    return new THREE.ExtrudeGeometry(s, { depth: WALL_D, bevelEnabled: false, curveSegments: 28 });
  }, []);
}

/** Glass door leaf, hinged at its outer edge. */
function DoorLeaf({ side }: { side: -1 | 1 }) {
  const m = getMaterials();
  const ref = useRef<THREE.Group>(null);
  const w = DOOR_W / 2 - 0.03;
  const h = DOOR_STRAIGHT - 0.04;
  useFrame(() => {
    if (!ref.current) return;
    const open = smooth(0.08, 0.55, rig.s); // doors swing open as the camera walks in
    ref.current.rotation.y = -side * open * 1.45;
  });
  // hinge at x = side * DOOR_W/2 ; leaf extends toward the centre
  return (
    <group ref={ref} userData={{ noMerge: true }} position={[side * (DOOR_W / 2), 0.02, -WALL_D / 2]}>
      <group position={[-side * (w / 2), h / 2, 0]}>
        <mesh material={m.glass}>
          <boxGeometry args={[w, h, 0.02]} />
        </mesh>
        {/* slim brass frame */}
        <mesh material={m.brass} position={[0, h / 2, 0]}>
          <boxGeometry args={[w, 0.05, 0.05]} />
        </mesh>
        <mesh material={m.brass} position={[0, -h / 2, 0]}>
          <boxGeometry args={[w, 0.05, 0.05]} />
        </mesh>
        <mesh material={m.brass} position={[side * (w / 2), 0, 0]}>
          <boxGeometry args={[0.05, h, 0.05]} />
        </mesh>
        <mesh material={m.brass} position={[-side * (w / 2), 0, 0]}>
          <boxGeometry args={[0.05, h, 0.05]} />
        </mesh>
        {/* pull handle */}
        <mesh material={m.brass} position={[-side * (w / 2 - 0.14), 0, 0.06]}>
          <cylinderGeometry args={[0.018, 0.018, 0.7, 10]} />
        </mesh>
      </group>
    </group>
  );
}

/** Round projecting sign board (brand guide p.26): green disc, brass ring, official logo both faces. */
function SignBoard(props: JSX.IntrinsicElements["group"]) {
  const m = getMaterials();
  const { cream } = useLogoTextures();
  const R = 0.82;
  return (
    <group {...props}>
      {/* wall bracket */}
      {[0.38, -0.38].map((y) => (
        <mesh key={y} material={m.brass} position={[0, y, 0.45]} rotation-x={Math.PI / 2}>
          <cylinderGeometry args={[0.03, 0.03, 0.9, 10]} />
        </mesh>
      ))}
      <group position={[0, 0, 1.0]} rotation-y={0.62}>
        <mesh material={m.greenDeep} rotation-z={Math.PI / 2}>
          <cylinderGeometry args={[R, R, 0.12, 48]} />
        </mesh>
        <mesh material={m.brass} rotation-y={Math.PI / 2}>
          <torusGeometry args={[R, 0.05, 12, 64]} />
        </mesh>
        {/* official logo on both faces (back face rotated so it is never mirrored) */}
        <LogoPlane map={cream} height={1.22} position={[0.065, 0, 0]} rotation-y={Math.PI / 2} />
        <LogoPlane map={cream} height={1.22} position={[-0.065, 0, 0]} rotation-y={-Math.PI / 2} />
      </group>
    </group>
  );
}

function Sconce(props: JSX.IntrinsicElements["group"]) {
  const m = getMaterials();
  return (
    <group {...props}>
      <mesh material={m.brass}>
        <cylinderGeometry args={[0.06, 0.09, 0.22, 16]} />
      </mesh>
      <mesh material={m.warmLight} position={[0, -0.13, 0]}>
        <sphereGeometry args={[0.06, 16, 12]} />
      </mesh>
    </group>
  );
}

export function Storefront() {
  const m = getMaterials();
  const { cream } = useLogoTextures();
  const wall = useFacadeGeometry();
  const doorTrim = useArchTrim(DOOR_W, DOOR_STRAIGHT, 0.14, 0.08);
  const winTrim = useArchTrim(WIN_W, WIN_STRAIGHT, 0.1, 0.06);
  const winGlass = useMemo(() => new THREE.ShapeGeometry(archShape(WIN_W, WIN_STRAIGHT), 24), []);
  const transom = useMemo(() => {
    const s = new THREE.Shape();
    s.absarc(0, 0, DOOR_W / 2, 0, Math.PI, false);
    s.closePath();
    return new THREE.ShapeGeometry(s, 24);
  }, []);
  const z = SET_Z.hero;

  return (
    <group position={[0, 0, z]}>
      {/* pavement */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.004, 3.6]} material={m.greenWall}>
        <planeGeometry args={[15, 7.2]} />
      </mesh>
      <mesh position={[0, 0.03, 7.25]} material={m.cream}>
        <boxGeometry args={[15, 0.06, 0.12]} />
      </mesh>

      {/* façade */}
      <mesh geometry={wall} material={m.greenWall} position={[0, 0, -WALL_D]} />
      <mesh material={m.cream} position={[0, WALL_H + 0.12, -WALL_D / 2]}>
        <boxGeometry args={[WALL_W + 0.4, 0.24, WALL_D + 0.35]} />
      </mesh>
      <mesh geometry={doorTrim} material={m.cream} position={[0, 0, 0]} />
      {[-3.7, 3.7].map((x) => (
        <group key={x} position={[x, WIN_Y, 0]}>
          <mesh geometry={winTrim} material={m.cream} />
          <mesh geometry={winGlass} material={m.frosted} position={[0, 0, -WALL_D / 2]} />
          <mesh material={m.cream} position={[0, -0.05, 0.08]}>
            <boxGeometry args={[WIN_W + 0.4, 0.1, 0.28]} />
          </mesh>
        </group>
      ))}
      {/* frosted glass-door sticker: official logo (brand guide p.27) */}
      <LogoPlane map={cream} height={1.55} position={[-3.7, WIN_Y + 1.42, -WALL_D / 2 + 0.012]} opacity={0.95} />
      {/* warm interior glow behind both windows (soft radial falloff, reads as a lit café) */}
      {[-3.7, 3.7].map((x) => (
        <mesh key={x} position={[x, WIN_Y + 1.3, -0.9]}>
          <planeGeometry args={[3.2, 3.6]} />
          <meshBasicMaterial map={getGlowTexture()} color="#F2B872" transparent opacity={x > 0 ? 0.85 : 0.55} toneMapped={false} depthWrite={false} />
        </mesh>
      ))}

      {/* doorway */}
      <mesh geometry={transom} material={m.frosted} position={[0, DOOR_STRAIGHT, -WALL_D / 2]} />
      <mesh material={m.brass} position={[0, DOOR_STRAIGHT, -WALL_D / 2]}>
        <boxGeometry args={[DOOR_W, 0.05, 0.06]} />
      </mesh>
      <Pickable id="hero-door">
        <DoorLeaf side={-1} />
        <DoorLeaf side={1} />
      </Pickable>
      <HotspotAnchor id="hero-door" position={[0, 2.0, 0.3]} />
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.006, -0.9]} material={m.greenDeep}>
        <planeGeometry args={[DOOR_W, 1.6]} />
      </mesh>

      <Sconce position={[-1.85, 2.95, 0.16]} />
      <Sconce position={[1.85, 2.95, 0.16]} />
      <Pickable id="hero-sign">
        <SignBoard position={[2.35, 4.25, 0]} />
      </Pickable>
      <HotspotAnchor id="hero-sign" position={[2.35, 4.25, 1.1]} />

      <Planter position={[-5.6, 0, 1.0]} palmHeight={2.3} />
      <Planter position={[5.6, 0, 1.0]} palmHeight={2.7} />
    </group>
  );
}
