"use client";

import { useTexture } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useLayoutEffect } from "react";
import * as THREE from "three";
import { LOGO, LOGO_LAYERS, type LogoLayerName } from "../config/assetManifest";

export const LOGO_ASPECT = LOGO.width / LOGO.height; // never stretch the official logo

const LAYER_NAMES = Object.keys(LOGO_LAYERS) as LogoLayerName[];

function prep(tex: THREE.Texture, anisotropy: number) {
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = anisotropy;
  tex.generateMipmaps = true;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.needsUpdate = true;
}

/** Official logo (cream + green) textures. */
export function useLogoTextures() {
  const gl = useThree((s) => s.gl);
  const [cream, green] = useTexture([LOGO.cream.path, LOGO.green.path]) as THREE.Texture[];
  useLayoutEffect(() => {
    const a = Math.min(8, gl.capabilities.getMaxAnisotropy());
    prep(cream, a);
    prep(green, a);
  }, [cream, green, gl]);
  return { cream, green };
}

/** The seven official logo layers (masks of the official raster). */
export function useLogoLayerTextures(): Record<LogoLayerName, THREE.Texture> {
  const gl = useThree((s) => s.gl);
  const list = useTexture(LAYER_NAMES.map((n) => LOGO_LAYERS[n].path)) as THREE.Texture[];
  useLayoutEffect(() => {
    const a = Math.min(8, gl.capabilities.getMaxAnisotropy());
    list.forEach((t) => prep(t, a));
  }, [list, gl]);
  return Object.fromEntries(LAYER_NAMES.map((n, i) => [n, list[i]])) as Record<LogoLayerName, THREE.Texture>;
}

export { LAYER_NAMES };
