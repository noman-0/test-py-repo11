"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { getMaterials } from "../materials";
import { useLogoTextures } from "../useBrandTextures";
import { LogoPlane, LogoWrap, useLathe } from "./common";

type G = JSX.IntrinsicElements["group"];

/* Display-scale props (larger than life so they read on the tasting bar). */

/** Brand ceramic cup & saucer - deep green glaze, cream official logo (guide p.19). */
export function CeramicCup({ surface = "milk", scale = 1, ...props }: { surface?: "milk" | "espresso"; scale?: number } & G) {
  const m = getMaterials();
  const { cream } = useLogoTextures();
  const outer = useLathe(
    [
      [0, 0.012],
      [0.085, 0.012],
      [0.1, 0.03],
      [0.145, 0.11],
      [0.163, 0.2],
      [0.165, 0.232],
    ],
    40
  );
  const inner = useLathe(
    [
      [0.158, 0.232],
      [0.156, 0.2],
      [0.138, 0.11],
      [0.096, 0.045],
      [0, 0.04],
    ],
    40
  );
  const saucer = useLathe(
    [
      [0, 0],
      [0.2, 0],
      [0.29, 0.018],
      [0.3, 0.03],
      [0.27, 0.026],
      [0.11, 0.012],
      [0, 0.012],
    ],
    48
  );
  const handle = useMemo(() => new THREE.TorusGeometry(0.055, 0.016, 10, 24, Math.PI * 1.25), []);
  return (
    <group scale={scale} {...props}>
      <mesh geometry={saucer} material={m.ceramic} />
      <group position={[0, 0.012, 0]}>
        <mesh geometry={outer} material={m.greenGlaze} />
        <mesh geometry={inner} material={m.ceramic} />
        <mesh position={[0, 0.2, 0]} rotation-x={-Math.PI / 2} material={surface === "milk" ? m.milk : m.crema}>
          <circleGeometry args={[0.153, 40]} />
        </mesh>
        {surface === "milk" && (
          <mesh position={[0, 0.2015, 0]} rotation-x={-Math.PI / 2} material={m.crema}>
            <ringGeometry args={[0.105, 0.153, 40]} />
          </mesh>
        )}
        <mesh geometry={handle} material={m.ceramic} position={[0.16, 0.13, 0]} rotation-z={-Math.PI * 0.62} />
        {/* cone fitted to the bowl between y=0.095..0.185 so the logo sits just proud of the glaze */}
        <LogoWrap map={cream} rTop={0.1735} rBottom={0.1147} height={0.22} y={0.14} logoHeight={0.09} />
      </group>
    </group>
  );
}

/** Small glass with espresso + milk layers (cortado). */
export function CortadoGlass(props: G) {
  const m = getMaterials();
  const glass = useLathe(
    [
      [0, 0],
      [0.075, 0],
      [0.085, 0.17],
      [0.082, 0.17],
      [0.072, 0.008],
      [0, 0.008],
    ],
    32
  );
  return (
    <group {...props}>
      <mesh geometry={glass} material={m.glass} />
      <mesh position={[0, 0.045, 0]} material={m.coffee}>
        <cylinderGeometry args={[0.073, 0.071, 0.075, 28]} />
      </mesh>
      <mesh position={[0, 0.11, 0]} material={m.milk}>
        <cylinderGeometry args={[0.077, 0.074, 0.055, 28]} />
      </mesh>
    </group>
  );
}

/** V60 dripper on a glass server (pour-over). */
export function V60({ ...props }: G) {
  const m = getMaterials();
  const server = useLathe(
    [
      [0, 0],
      [0.11, 0],
      [0.15, 0.06],
      [0.14, 0.16],
      [0.085, 0.22],
      [0.088, 0.25],
      [0.082, 0.25],
      [0.078, 0.22],
      [0.133, 0.16],
      [0.142, 0.06],
      [0.105, 0.008],
      [0, 0.008],
    ],
    36
  );
  const coffee = useLathe(
    [
      [0, 0.01],
      [0.104, 0.01],
      [0.138, 0.06],
      [0.137, 0.09],
      [0, 0.09],
    ],
    36
  );
  const cone = useLathe(
    [
      [0.04, 0],
      [0.115, 0],
      [0.115, 0.014],
      [0.06, 0.02],
      [0.18, 0.2],
      [0.19, 0.205],
      [0.175, 0.205],
      [0.052, 0.03],
      [0.04, 0.03],
    ],
    40
  );
  return (
    <group {...props}>
      <mesh geometry={server} material={m.glass} />
      <mesh geometry={coffee} material={m.coffee} />
      <group position={[0, 0.25, 0]}>
        <mesh geometry={cone} material={m.ceramic} />
        <mesh position={[0, 0.13, 0]} material={m.cream}>
          <cylinderGeometry args={[0.165, 0.07, 0.15, 32, 1, true]} />
        </mesh>
      </group>
    </group>
  );
}

/** Chemex-style hourglass brewer with wooden collar. */
export function Chemex(props: G) {
  const m = getMaterials();
  const body = useLathe(
    [
      [0, 0],
      [0.12, 0],
      [0.15, 0.02],
      [0.05, 0.24],
      [0.05, 0.27],
      [0.165, 0.48],
      [0.158, 0.48],
      [0.044, 0.27],
      [0.044, 0.24],
      [0.142, 0.022],
      [0.115, 0.008],
      [0, 0.008],
    ],
    36
  );
  const coffee = useLathe(
    [
      [0, 0.01],
      [0.113, 0.01],
      [0.14, 0.024],
      [0.098, 0.12],
      [0, 0.12],
    ],
    36
  );
  return (
    <group {...props}>
      <mesh geometry={body} material={m.glass} />
      <mesh geometry={coffee} material={m.coffee} />
      <mesh position={[0, 0.255, 0]} material={m.wood}>
        <cylinderGeometry args={[0.078, 0.062, 0.1, 24]} />
      </mesh>
      <mesh position={[0, 0.255, 0]} material={m.black}>
        <torusGeometry args={[0.075, 0.008, 6, 24]} />
      </mesh>
      <mesh position={[0, 0.39, 0]} material={m.cream}>
        <cylinderGeometry args={[0.15, 0.06, 0.18, 28, 1, true]} />
      </mesh>
    </group>
  );
}

/** Tall iced cold brew. */
export function ColdBrewGlass(props: G) {
  const m = getMaterials();
  const glass = useLathe(
    [
      [0, 0],
      [0.08, 0],
      [0.092, 0.34],
      [0.088, 0.34],
      [0.076, 0.01],
      [0, 0.01],
    ],
    32
  );
  const cubes = useMemo(
    () => [
      [0.02, 0.27, 0.01, 0.4],
      [-0.03, 0.22, -0.02, 1.1],
      [0.01, 0.31, -0.03, 2.2],
      [-0.02, 0.17, 0.03, 0.7],
    ],
    []
  );
  return (
    <group {...props}>
      <mesh geometry={glass} material={m.glass} />
      <mesh position={[0, 0.14, 0]} material={m.coffee}>
        <cylinderGeometry args={[0.083, 0.076, 0.26, 28]} />
      </mesh>
      {cubes.map(([x, y, z, r], i) => (
        <mesh key={i} position={[x, y, z]} rotation={[r, r * 0.7, 0]} material={m.ice}>
          <boxGeometry args={[0.06, 0.06, 0.06]} />
        </mesh>
      ))}
    </group>
  );
}

/** Branded bottle (cold brew) - kraft label carrying only the official logo. */
export function Bottle(props: G) {
  const m = getMaterials();
  const { green } = useLogoTextures();
  const body = useLathe(
    [
      [0, 0],
      [0.085, 0],
      [0.092, 0.02],
      [0.092, 0.24],
      [0.05, 0.32],
      [0.034, 0.34],
      [0.034, 0.37],
      [0, 0.37],
    ],
    32
  );
  return (
    <group {...props}>
      <mesh geometry={body} material={m.coffee} />
      <mesh position={[0, 0.385, 0]} material={m.cream}>
        <cylinderGeometry args={[0.038, 0.038, 0.035, 20]} />
      </mesh>
      <mesh position={[0, 0.13, 0]} material={m.kraft}>
        <cylinderGeometry args={[0.0935, 0.0935, 0.16, 32, 1, true]} />
      </mesh>
      <LogoWrap map={green} rTop={0.0936} rBottom={0.0936} height={0.26} y={0.13} logoHeight={0.13} />
    </group>
  );
}

export function Plate(props: G) {
  const m = getMaterials();
  const geo = useLathe(
    [
      [0, 0],
      [0.15, 0],
      [0.21, 0.022],
      [0.22, 0.03],
      [0.2, 0.027],
      [0.14, 0.012],
      [0, 0.012],
    ],
    44
  );
  return (
    <group {...props}>
      <mesh geometry={geo} material={m.ceramic} />
    </group>
  );
}

/** Cardamom & saffron bun (spiral). */
export function Bun(props: G) {
  const m = getMaterials();
  return (
    <group {...props}>
      <Plate />
      <group position={[0, 0.04, 0]}>
        {[
          [0.085, 0.032, 0],
          [0.052, 0.03, 0.03],
          [0.02, 0.026, 0.055],
        ].map(([r, tube, y], i) => (
          <mesh key={i} position={[0, y, 0]} rotation-x={Math.PI / 2} material={i === 1 ? m.pastryDark : m.pastry}>
            <torusGeometry args={[r, tube, 12, 28]} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/** Basque-style burnt cheesecake slice. */
export function CheesecakeSlice(props: G) {
  const m = getMaterials();
  return (
    <group {...props}>
      <Plate />
      <group position={[-0.06, 0.012, 0.03]} rotation-y={0.6}>
        <mesh position={[0, 0.055, 0]} material={m.cheesecake}>
          <cylinderGeometry args={[0.17, 0.17, 0.1, 24, 1, false, 0, Math.PI / 3.2]} />
        </mesh>
        <mesh position={[0, 0.108, 0]} material={m.pastryDark}>
          <cylinderGeometry args={[0.172, 0.172, 0.012, 24, 1, false, 0, Math.PI / 3.2]} />
        </mesh>
      </group>
    </group>
  );
}

/** Kraft coffee bag with stitched fold-over top (guide p.18) - official logo only. */
export function CoffeeBag({ scale = 1, ...props }: { scale?: number } & G) {
  const m = getMaterials();
  const { green } = useLogoTextures();
  return (
    <group scale={scale} {...props}>
      <mesh position={[0, 0.17, 0]} material={m.kraft}>
        <boxGeometry args={[0.22, 0.34, 0.12]} />
      </mesh>
      <mesh position={[0, 0.36, 0]} material={m.kraft}>
        <boxGeometry args={[0.22, 0.05, 0.035]} />
      </mesh>
      <mesh position={[0, 0.355, 0.019]} material={m.cream}>
        <boxGeometry args={[0.2, 0.004, 0.002]} />
      </mesh>
      <LogoPlane map={green} height={0.19} lit position={[0, 0.19, 0.0605]} />
    </group>
  );
}

/** Takeaway paper cup with lid (guide p.11). */
export function PaperCup({ lid = true, ...props }: { lid?: boolean } & G) {
  const m = getMaterials();
  const { cream } = useLogoTextures();
  const lidGeo = useLathe(
    [
      [0, 0.03],
      [0.06, 0.03],
      [0.075, 0.018],
      [0.118, 0.016],
      [0.124, 0.0],
      [0.112, -0.006],
    ],
    36
  );
  return (
    <group {...props}>
      <mesh position={[0, 0.13, 0]} material={m.greenDeep}>
        <cylinderGeometry args={[0.112, 0.08, 0.26, 32]} />
      </mesh>
      <LogoWrap map={cream} rTop={0.112} rBottom={0.08} height={0.26} y={0.13} logoHeight={0.12} />
      {lid && <mesh geometry={lidGeo} material={m.cream} position={[0, 0.262, 0]} />}
    </group>
  );
}
