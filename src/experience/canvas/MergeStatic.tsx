"use client";

import { useLayoutEffect, useRef, useState } from "react";
import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

const KEEP = ["position", "normal", "uv"] as const;

/**
 * Performance: after mount, merges every static mesh below it into ONE mesh per shared material
 * (hundreds of draw calls -> a few dozen). Originals are hidden but kept, so raycasting/picking on
 * them still works (three.js raycasts invisible meshes). Any subtree with `userData.noMerge` is left
 * untouched (animated parts: doors, steam, beans, logo layers, map pin…).
 */
export function MergeStatic({ children }: { children: React.ReactNode }) {
  const src = useRef<THREE.Group>(null);
  const [merged, setMerged] = useState<THREE.Mesh[]>([]);

  useLayoutEffect(() => {
    const root = src.current;
    if (!root) return;
    root.updateWorldMatrix(true, true);
    const inv = root.matrixWorld.clone().invert();
    const rel = new THREE.Matrix4();
    const buckets = new Map<THREE.Material, { geos: THREE.BufferGeometry[]; meshes: THREE.Mesh[]; order: number }>();

    const visit = (o: THREE.Object3D) => {
      if (o.userData.noMerge) return;
      const m = o as THREE.Mesh;
      if (m.isMesh && !(o as THREE.InstancedMesh).isInstancedMesh && !Array.isArray(m.material) && m.visible && m.geometry.attributes.position) {
        let g = m.geometry.index ? m.geometry.toNonIndexed() : m.geometry.clone();
        for (const name of Object.keys(g.attributes)) if (!KEEP.includes(name as (typeof KEEP)[number])) g.deleteAttribute(name);
        if (!g.attributes.normal) g.computeVertexNormals();
        if (!g.attributes.uv) g.setAttribute("uv", new THREE.BufferAttribute(new Float32Array(g.attributes.position.count * 2), 2));
        g.clearGroups();
        rel.multiplyMatrices(inv, m.matrixWorld);
        g = g.applyMatrix4(rel);
        const b = buckets.get(m.material) ?? { geos: [], meshes: [], order: m.renderOrder };
        b.geos.push(g);
        b.meshes.push(m);
        buckets.set(m.material, b);
      }
      o.children.forEach(visit);
    };
    root.children.forEach(visit);

    const out: THREE.Mesh[] = [];
    for (const [material, b] of buckets) {
      if (b.geos.length < 2) {
        b.geos.forEach((g) => g.dispose());
        continue; // nothing to gain
      }
      const geo = mergeGeometries(b.geos, false);
      b.geos.forEach((g) => g.dispose());
      if (!geo) continue;
      const mesh = new THREE.Mesh(geo, material);
      mesh.renderOrder = b.order;
      mesh.matrixAutoUpdate = false;
      mesh.raycast = () => undefined; // picking happens on the hidden originals
      b.meshes.forEach((m) => (m.visible = false));
      out.push(mesh);
    }
    setMerged(out);
    return () => {
      out.forEach((m) => m.geometry.dispose());
      buckets.forEach((b) => b.meshes.forEach((m) => (m.visible = true)));
    };
  }, []);

  return (
    <group>
      <group ref={src}>{children}</group>
      {merged.map((m, i) => (
        <primitive key={i} object={m} />
      ))}
    </group>
  );
}
