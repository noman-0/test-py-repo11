"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { getMaterials } from "../materials";
import { useLathe } from "./common";

/** Bent palm frond: leaf outline extruded flat, then curved downward along its length. */
function useFrondGeometry(length: number, width: number) {
  return useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 0);
    s.quadraticCurveTo(length * 0.35, width, length, 0);
    s.quadraticCurveTo(length * 0.35, -width, 0, 0);
    const g = new THREE.ShapeGeometry(s, 10);
    const pos = g.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const t = x / length;
      pos.setZ(i, -0.55 * length * t * t); // droop
      pos.setY(i, pos.getY(i) * (1 - 0.15 * t));
    }
    g.rotateX(-Math.PI / 2);
    g.computeVertexNormals();
    return g;
  }, [length, width]);
}

export function Palm({ height = 2.6, fronds = 9, ...props }: { height?: number; fronds?: number } & JSX.IntrinsicElements["group"]) {
  const m = getMaterials();
  const frond = useFrondGeometry(1.5, 0.26);
  const trunk = useMemo(() => new THREE.CylinderGeometry(0.075, 0.12, height, 10, 6), [height]);
  return (
    <group {...props}>
      <mesh geometry={trunk} material={m.trunk} position={[0, height / 2, 0]} />
      <group position={[0, height, 0]}>
        {Array.from({ length: fronds }, (_, i) => (
          <mesh
            key={i}
            geometry={frond}
            material={m.leaf}
            rotation={[0, (i / fronds) * Math.PI * 2 + (i % 2) * 0.2, 0.25 + (i % 3) * 0.12]}
          />
        ))}
      </group>
    </group>
  );
}

const PLANTER: [number, number][] = [
  [0, 0],
  [0.34, 0],
  [0.4, 0.06],
  [0.44, 0.7],
  [0.47, 0.74],
  [0.42, 0.76],
  [0, 0.72],
];

export function Planter({ palmHeight = 2.4, ...props }: { palmHeight?: number } & JSX.IntrinsicElements["group"]) {
  const m = getMaterials();
  const geo = useLathe(PLANTER, 32);
  return (
    <group {...props}>
      <mesh geometry={geo} material={m.cream} />
      <Palm height={palmHeight} position={[0, 0.7, 0]} />
    </group>
  );
}
