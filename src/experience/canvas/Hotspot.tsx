"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { useExperience, rig } from "../store";
import { selectHotspot } from "../actions";
import { HOTSPOT_BY_ID } from "../content/hotspots";

/** World-space anchors for hotspots, keyed by hotspot id. */
export const hotspotRegistry = new Map<string, THREE.Object3D>();

/** Invisible anchor marking where a hotspot's pin sits in the scene. */
export function HotspotAnchor({ id, position }: { id: string; position: [number, number, number] }) {
  const ref = useRef<THREE.Object3D>(null);
  useEffect(() => {
    const o = ref.current;
    if (!o) return;
    hotspotRegistry.set(id, o);
    return () => {
      if (hotspotRegistry.get(id) === o) hotspotRegistry.delete(id);
    };
  }, [id]);
  return <object3D ref={ref} position={position} />;
}

// re-exported for canvas-side callers; lives in actions.ts so DOM code never imports three.js
export { selectHotspot } from "../actions";

/**
 * Makes children clickable/tappable (points of interest of the area you are in).
 * Keyboard users reach the same hotspots through the DOM pins in the immersive shell.
 */
export function Pickable({ id, children, ...props }: { id: string } & Omit<JSX.IntrinsicElements["group"], "id">) {
  const onOver = (e: ThreeEvent<PointerEvent>) => {
    if (!useExperience.getState().enabled) return;
    e.stopPropagation();
    document.body.style.cursor = "pointer";
  };
  const onOut = () => {
    document.body.style.cursor = "";
  };
  const onClick = (e: ThreeEvent<MouseEvent>) => {
    const st = useExperience.getState();
    if (!st.enabled || st.traveling) return;
    if (HOTSPOT_BY_ID.get(id)?.area !== st.area) return; // only the area you are in
    if (e.delta > 8) return; // it was a drag-to-look gesture, not a tap
    e.stopPropagation();
    selectHotspot(id);
  };
  return (
    <group {...props} onPointerOver={onOver} onPointerOut={onOut} onClick={onClick}>
      {children}
    </group>
  );
}

/** Projects anchors of the current area to screen pixels every frame (read by the DOM pins). */
export function HotspotProjector() {
  const v = useMemo(() => new THREE.Vector3(), []);
  const camDir = useMemo(() => new THREE.Vector3(), []);
  const toPoint = useMemo(() => new THREE.Vector3(), []);
  useFrame(({ camera, size }) => {
    const st = useExperience.getState();
    camera.getWorldDirection(camDir);
    for (const [id, obj] of hotspotRegistry) {
      const def = HOTSPOT_BY_ID.get(id);
      if (!def || def.area !== st.area || st.traveling) {
        rig.screen.set(id, { x: 0, y: 0, visible: false });
        continue;
      }
      obj.getWorldPosition(v);
      toPoint.copy(v).sub(camera.position);
      const inFront = toPoint.dot(camDir) > 0.1;
      v.project(camera);
      const x = (v.x * 0.5 + 0.5) * size.width;
      const y = (-v.y * 0.5 + 0.5) * size.height;
      const visible = inFront && x > 12 && x < size.width - 12 && y > 60 && y < size.height - 40;
      rig.screen.set(id, { x, y, visible });
    }
  });
  return null;
}
