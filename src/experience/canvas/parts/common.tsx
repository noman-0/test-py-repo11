"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { LOGO_ASPECT } from "../useBrandTextures";

/** Adds an arch outline (rectangle with a semicircular top - the logo's arched frame) to a path. */
export function traceArch(p: THREE.Path, cx: number, y0: number, w: number, straight: number) {
  const r = w / 2;
  p.moveTo(cx - r, y0);
  p.lineTo(cx + r, y0);
  p.lineTo(cx + r, y0 + straight);
  p.absarc(cx, y0 + straight, r, 0, Math.PI, false);
  p.lineTo(cx - r, y0);
  return p;
}

export function archShape(w: number, straight: number) {
  return traceArch(new THREE.Shape(), 0, 0, w, straight) as THREE.Shape;
}

/** U-shaped arch trim (outer arch minus inner arch) as one simple polygon. */
export function archTrimShape(innerW: number, straight: number, thickness: number) {
  const r = innerW / 2;
  const R = r + thickness;
  const s = new THREE.Shape();
  s.moveTo(-R, 0);
  s.lineTo(-R, straight);
  s.absarc(0, straight, R, Math.PI, 0, true);
  s.lineTo(R, 0);
  s.lineTo(r, 0);
  s.lineTo(r, straight);
  s.absarc(0, straight, r, 0, Math.PI, false);
  s.lineTo(-r, 0);
  s.closePath();
  return s;
}

export function useArchTrim(innerW: number, straight: number, thickness: number, depth: number) {
  return useMemo(() => {
    const g = new THREE.ExtrudeGeometry(archTrimShape(innerW, straight, thickness), {
      depth,
      bevelEnabled: false,
      curveSegments: 24,
    });
    return g;
  }, [innerW, straight, thickness, depth]);
}

/**
 * Official logo on a plane. Width always derives from height x official aspect - never stretched.
 * `lit` = printed ink that receives scene lighting; otherwise unlit (signage / glass sticker).
 */
export function LogoPlane({
  map,
  height,
  lit = false,
  opacity = 1,
  roughness = 0.85,
  ...props
}: {
  map: THREE.Texture;
  height: number;
  lit?: boolean;
  opacity?: number;
  roughness?: number;
} & JSX.IntrinsicElements["mesh"]) {
  return (
    <mesh {...props}>
      <planeGeometry args={[height * LOGO_ASPECT, height]} />
      {lit ? (
        <meshStandardMaterial
          map={map}
          transparent
          opacity={opacity}
          roughness={roughness}
          depthWrite={false}
          polygonOffset
          polygonOffsetFactor={-2}
        />
      ) : (
        <meshBasicMaterial map={map} transparent opacity={opacity} toneMapped={false} depthWrite={false} />
      )}
    </mesh>
  );
}

/** Logo wrapped around part of a cone/cylinder (cups) with its true aspect preserved. */
export function LogoWrap({
  map,
  rTop,
  rBottom,
  height,
  y,
  logoHeight,
  lit = true,
}: {
  map: THREE.Texture;
  rTop: number;
  rBottom: number;
  height: number;
  y: number;
  logoHeight: number;
  lit?: boolean;
}) {
  const geo = useMemo(() => {
    // band of the cone that holds the logo
    const t0 = (y - logoHeight / 2) / height;
    const t1 = (y + logoHeight / 2) / height;
    const rAt = (t: number) => rBottom + (rTop - rBottom) * t;
    const r0 = rAt(t0) * 1.004;
    const r1 = rAt(t1) * 1.004;
    const rAvg = (r0 + r1) / 2;
    const arc = (logoHeight * LOGO_ASPECT) / rAvg; // radians so arc length = logo width
    // theta = 0 faces +Z in three.js; centre the band there (u grows with +X -> not mirrored)
    const g = new THREE.CylinderGeometry(r1, r0, logoHeight, 32, 1, true, -arc / 2, arc);
    g.translate(0, y, 0);
    return g;
  }, [rTop, rBottom, height, y, logoHeight]);
  return (
    <mesh geometry={geo}>
      {lit ? (
        <meshStandardMaterial map={map} transparent roughness={0.7} depthWrite={false} polygonOffset polygonOffsetFactor={-2} />
      ) : (
        <meshBasicMaterial map={map} transparent toneMapped={false} depthWrite={false} />
      )}
    </mesh>
  );
}

/** Lathe helper: profile points [radius, y]. */
export function useLathe(points: [number, number][], segments = 40) {
  return useMemo(() => new THREE.LatheGeometry(points.map(([x, y]) => new THREE.Vector2(x, y)), segments), [points, segments]);
}
