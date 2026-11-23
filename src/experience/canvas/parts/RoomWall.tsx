"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { getGlowTexture, getMaterials } from "../materials";
import { archShape, useArchTrim } from "./common";

const W = 30; // wide enough to fill the frame edge to edge
const H = 9; // tall enough that no "sky" shows above the room
const D = 0.3;
const DOOR_X = 5.8; // where the camera path passes through (both LTR and mirrored RTL)
const DOOR_W = 4.2;
const DOOR_STRAIGHT = 3.4;

/**
 * Full-width room wall in brand green so every interior area fills the screen (like the
 * storefront). Two arched doorways - the logo's arched frame - sit exactly where the camera
 * travels on to the next room, so journeys never clip through the wall.
 */
export function RoomWall({
  niches = [-2.67, 0, 2.67, -9.6, 9.6, -12.8, 12.8],
  ...props
}: { niches?: number[] } & JSX.IntrinsicElements["group"]) {
  const m = getMaterials();
  const wall = useMemo(() => {
    const r = DOOR_W / 2;
    const s = new THREE.Shape();
    s.moveTo(-W / 2, 0);
    for (const cx of [-DOOR_X, DOOR_X]) {
      s.lineTo(cx - r, 0);
      s.lineTo(cx - r, DOOR_STRAIGHT);
      s.absarc(cx, DOOR_STRAIGHT, r, Math.PI, 0, true);
      s.lineTo(cx + r, 0);
    }
    s.lineTo(W / 2, 0);
    s.lineTo(W / 2, H);
    s.lineTo(-W / 2, H);
    s.closePath();
    const g = new THREE.ExtrudeGeometry(s, { depth: D, bevelEnabled: false, curveSegments: 24 });
    g.translate(0, 0, -D);
    return g;
  }, []);
  const doorTrim = useArchTrim(DOOR_W, DOOR_STRAIGHT, 0.12, 0.06);
  const nicheTrim = useArchTrim(1.3, 1.4, 0.07, 0.05);
  const nicheGlass = useMemo(() => new THREE.ShapeGeometry(archShape(1.3, 1.4), 24), []);
  const glow = useMemo(
    () => new THREE.MeshBasicMaterial({ map: getGlowTexture(), color: "#E9B77A", transparent: true, opacity: 0.55, toneMapped: false }),
    []
  );

  return (
    <group {...props}>
      <mesh geometry={wall} material={m.greenWall} />
      {/* cornice */}
      <mesh material={m.cream} position={[0, H - 0.6, 0.06]}>
        <boxGeometry args={[W, 0.08, 0.12]} />
      </mesh>
      <mesh material={m.greenDeep} position={[0, 0.06, 0.04]}>
        <boxGeometry args={[W, 0.12, 0.08]} />
      </mesh>
      {/* doorways */}
      {[-DOOR_X, DOOR_X].map((x) => (
        <mesh key={x} geometry={doorTrim} material={m.cream} position={[x, 0, 0.001]} />
      ))}
      {/* glowing arched niches */}
      {niches.map((x) => (
        <group key={x} position={[x, 1.35, 0.01]}>
          <mesh geometry={nicheGlass} material={glow} />
          <mesh geometry={nicheTrim} material={m.cream} />
          <mesh material={m.cream} position={[0, 0.9, 0.12]}>
            <boxGeometry args={[1.1, 0.03, 0.22]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
