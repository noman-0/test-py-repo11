"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Billboard } from "@react-three/drei";
import * as THREE from "three";
import { BRAND } from "../../config/brand";
import { useExperience } from "../../store";

/* ── Steam ─────────────────────────────────────────────────────────────────────────────── */
const steamVert = /* glsl */ `
varying vec2 vUv;
void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`;
const steamFrag = /* glsl */ `
uniform float uTime; uniform vec3 uColor; uniform float uOpacity; uniform float uSeed;
varying vec2 vUv;
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
float noise(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f);
  return mix(mix(hash(i),hash(i+vec2(1.0,0.0)),f.x), mix(hash(i+vec2(0.0,1.0)),hash(i+vec2(1.0,1.0)),f.x), f.y); }
void main(){
  vec2 uv = vUv; float t = uTime * 0.35 + uSeed;
  float wob = (noise(vec2(uv.y*3.0 - t*2.0, t)) - 0.5) * 0.45 * uv.y;
  float x = uv.x - 0.5 - wob;
  float n = noise(vec2(x*5.0 + uSeed, uv.y*3.5 - t*2.6)) * noise(vec2(x*11.0 + 3.0, uv.y*7.0 - t*3.4));
  float band = smoothstep(0.3, 0.0, abs(x));
  float a = band * n * 2.2 * smoothstep(0.0, 0.18, uv.y) * (1.0 - smoothstep(0.45, 1.0, uv.y));
  gl_FragColor = vec4(uColor, a * uOpacity);
}`;

export function Steam({ height = 0.5, width = 0.22, opacity = 0.55, ...props }: { height?: number; width?: number; opacity?: number } & JSX.IntrinsicElements["group"]) {
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: steamVert,
        fragmentShader: steamFrag,
        uniforms: {
          uTime: { value: 0 },
          uColor: { value: new THREE.Color("#FFFFFF") },
          uOpacity: { value: opacity },
          uSeed: { value: Math.random() * 10 },
        },
        transparent: true,
        depthWrite: false,
      }),
    [opacity]
  );
  useFrame((_, dt) => {
    if (!useExperience.getState().reducedMotion) mat.uniforms.uTime.value += dt;
  });
  return (
    <group {...props} userData={{ noMerge: true }}>
      <Billboard lockX lockZ position={[0, height / 2, 0]}>
        <mesh material={mat}>
          <planeGeometry args={[width, height]} />
        </mesh>
      </Billboard>
    </group>
  );
}

/* ── Coffee beans (instanced) ──────────────────────────────────────────────────────────── */
export function useBeanGeometry() {
  return useMemo(() => {
    const g = new THREE.SphereGeometry(1, 14, 10);
    const p = g.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < p.count; i++) {
      let x = p.getX(i);
      let y = p.getY(i);
      const z = p.getZ(i);
      // centre crease on the flat side
      if (y > 0.1 && Math.abs(x) < 0.16) y -= 0.32 * (1 - Math.abs(x) / 0.16) * y;
      if (y > 0) y *= 0.62; // flatter top
      x *= 0.62;
      p.setXYZ(i, x, y * 0.7, z);
    }
    g.computeVertexNormals();
    g.scale(0.05, 0.05, 0.075);
    return g;
  }, []);
}

const beanMat = new THREE.MeshStandardMaterial({ color: "#3A2314", roughness: 0.42, metalness: 0.05 });

/** Beans either drifting around a centre (aroma) or resting in a pile. */
export function Beans({
  count,
  mode = "float",
  radius = 1.6,
  height = 2.4,
  size = 1,
  ...props
}: { count: number; mode?: "float" | "pile"; radius?: number; height?: number; size?: number } & JSX.IntrinsicElements["group"]) {
  const geo = useBeanGeometry();
  const ref = useRef<THREE.InstancedMesh>(null);
  const seeds = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        a: (i / count) * Math.PI * 2 + Math.random(),
        r: radius * (0.55 + Math.random() * 0.45),
        y: Math.random() * height,
        sp: 0.08 + Math.random() * 0.12,
        rot: new THREE.Euler(Math.random() * 6, Math.random() * 6, Math.random() * 6),
        s: size * (0.8 + Math.random() * 0.45),
      })),
    [count, radius, height, size]
  );
  const m = useMemo(() => new THREE.Matrix4(), []);
  const q = useMemo(() => new THREE.Quaternion(), []);
  const pos = useMemo(() => new THREE.Vector3(), []);
  const scl = useMemo(() => new THREE.Vector3(), []);
  const eul = useMemo(() => new THREE.Euler(), []);
  const placed = useRef(false);

  useFrame(({ clock }) => {
    const mesh = ref.current;
    if (!mesh) return;
    const reduced = useExperience.getState().reducedMotion;
    if (mode === "pile" || reduced) {
      if (placed.current) return;
      placed.current = true;
    }
    const t = reduced ? 0 : clock.elapsedTime;
    seeds.forEach((s, i) => {
      if (mode === "pile") {
        const rr = Math.sqrt(Math.random()) * radius;
        const aa = Math.random() * Math.PI * 2;
        pos.set(Math.cos(aa) * rr, (1 - rr / radius) * height * Math.random(), Math.sin(aa) * rr);
      } else {
        const a = s.a + t * s.sp;
        pos.set(Math.cos(a) * s.r, ((s.y + t * 0.12 * s.sp * 4) % height), Math.sin(a) * s.r * 0.6);
      }
      q.setFromEuler(eul.set(s.rot.x + t * 0.3, s.rot.y + t * 0.2, s.rot.z));
      scl.setScalar(s.s);
      m.compose(pos, q, scl);
      mesh.setMatrixAt(i, m);
    });
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <group {...props}>
      <instancedMesh ref={ref} args={[geo, beanMat, count]} frustumCulled={false} />
    </group>
  );
}

/* ── Brand supergraphics ──────────────────────────────────────────────────────────────── */

/** Sun-ray fan (from the logo's rays, used large on the apron in guide p.14). */
export function RayFan({
  radius = 3,
  rays = 7,
  width = 0.22,
  color = BRAND.cream,
  opacity = 0.16,
  ...props
}: { radius?: number; rays?: number; width?: number; color?: string; opacity?: number } & JSX.IntrinsicElements["group"]) {
  const mat = useMemo(
    () => new THREE.MeshBasicMaterial({ color, transparent: true, opacity, depthWrite: false, toneMapped: false }),
    [color, opacity]
  );
  const inner = radius * 0.35;
  return (
    <group {...props}>
      {Array.from({ length: rays }, (_, i) => {
        const a = Math.PI * (0.12 + (0.76 * i) / (rays - 1)); // fan across the upper half
        const len = radius - inner;
        const mid = inner + len / 2;
        return (
          <mesh key={i} material={mat} position={[Math.cos(a) * mid, Math.sin(a) * mid, 0]} rotation-z={a - Math.PI / 2}>
            <planeGeometry args={[width, len]} />
          </mesh>
        );
      })}
      <mesh material={mat} position={[0, inner * 0.55, 0]}>
        <planeGeometry args={[radius * 1.7, width * 0.8]} />
      </mesh>
    </group>
  );
}

/** Cream wave band (paper cup graphic, guide p.12) as a flat strip. */
export function WaveBand({
  length = 6,
  height = 0.22,
  amplitude = 0.06,
  waves = 6,
  color = BRAND.cream,
  ...props
}: { length?: number; height?: number; amplitude?: number; waves?: number; color?: string } & JSX.IntrinsicElements["mesh"]) {
  const geo = useMemo(() => {
    const s = new THREE.Shape();
    const N = 120;
    const yTop = (x: number) => height / 2 + amplitude * Math.sin((x / length) * waves * Math.PI * 2);
    const yBot = (x: number) => -height / 2 + amplitude * Math.sin((x / length) * waves * Math.PI * 2 + 0.9);
    s.moveTo(-length / 2, yBot(-length / 2));
    for (let i = 0; i <= N; i++) {
      const x = -length / 2 + (i / N) * length;
      s.lineTo(x, yBot(x));
    }
    for (let i = N; i >= 0; i--) {
      const x = -length / 2 + (i / N) * length;
      s.lineTo(x, yTop(x));
    }
    s.closePath();
    return new THREE.ShapeGeometry(s);
  }, [length, height, amplitude, waves]);
  return (
    <mesh geometry={geo} {...props}>
      <meshStandardMaterial color={color} roughness={0.8} polygonOffset polygonOffsetFactor={-2} />
    </mesh>
  );
}
