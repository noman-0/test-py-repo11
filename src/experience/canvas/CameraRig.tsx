"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useExperience, rig } from "../store";
import { AREA_AT, PATH, mirrorX } from "../config/world";

const AREA_POSE_AT = new Set(Object.values(AREA_AT));
const damp = (lambda: number, dt: number) => 1 - Math.exp(-lambda * dt);

/**
 * Single-screen camera: flies along the journey PATH to the active area's pose (the path's
 * waypoints swing around each set, so travel never clips through scenery), then applies the
 * visitor's drag/keyboard look offsets, zoom and a little pointer parallax.
 */
export function CameraRig() {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const locale = useExperience((s) => s.locale);
  const rtl = locale === "ar";

  const curves = useMemo(() => {
    const pos = new THREE.CatmullRomCurve3(PATH.map((p) => new THREE.Vector3(...mirrorX(p.pos, rtl))), false, "centripetal");
    const tgt = new THREE.CatmullRomCurve3(PATH.map((p) => new THREE.Vector3(...mirrorX(p.target, rtl))), false, "centripetal");
    return { pos, tgt };
  }, [rtl]);

  const cur = useRef({ pos: new THREE.Vector3(), tgt: new THREE.Vector3(), fov: 42, init: false });
  const travel = useRef<number | null>(null);
  const tmp = useMemo(
    () => ({ pos: new THREE.Vector3(), tgt: new THREE.Vector3(), dir: new THREE.Vector3(), euler: new THREE.Euler(0, 0, 0, "YXZ") }),
    []
  );

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      rig.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      rig.pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((_, rawDt) => {
    const dt = Math.min(rawDt, 0.1);
    const st = useExperience.getState();
    const reduced = st.reducedMotion;

    // 1. travel along the path toward the active area
    const target = AREA_AT[st.area];
    if (travel.current === null || reduced) travel.current = target;
    else {
      const d = target - travel.current;
      const step = d * damp(1.9, dt);
      const minStep = Math.sign(d) * Math.min(Math.abs(d), 0.9 * dt); // never crawl at the end
      travel.current += Math.abs(step) > Math.abs(minStep) ? step : minStep;
      if (Math.abs(target - travel.current) < 0.001) travel.current = target;
    }
    const s = travel.current;
    rig.s = s;
    const moving = Math.abs(target - s) > 0.02;
    if (moving !== st.traveling) st.set({ traveling: moving });

    // 2. path pose at s (eased so the camera settles on each area pose)
    let k = 0;
    while (k < PATH.length - 2 && s > PATH[k + 1].at) k++;
    const a = PATH[k];
    const b = PATH[k + 1];
    let f = THREE.MathUtils.clamp((s - a.at) / (b.at - a.at), 0, 1);
    const sa = AREA_POSE_AT.has(a.at);
    const sb = AREA_POSE_AT.has(b.at);
    if (sa && sb) f = f * f * (3 - 2 * f);
    else if (sa) f = f * f;
    else if (sb) f = 1 - (1 - f) * (1 - f);
    const u = (k + f) / (PATH.length - 1);
    curves.pos.getPoint(u, tmp.pos);
    curves.tgt.getPoint(u, tmp.tgt);
    let fov = THREE.MathUtils.lerp(a.fov, b.fov, f);

    // 3. look around (drag / keys) + subtle pointer parallax
    tmp.dir.copy(tmp.tgt).sub(tmp.pos);
    const calm = reduced || moving;
    const yaw = rig.look.yaw + (calm ? 0 : rig.pointer.x * -0.035);
    const pitch = THREE.MathUtils.clamp(rig.look.pitch + (calm ? 0 : rig.pointer.y * -0.02), -0.45, 0.45);
    tmp.euler.set(pitch, yaw, 0);
    tmp.dir.applyEuler(tmp.euler);

    // 4. portrait phones: step back and widen so the set stays framed
    const aspect = camera.aspect || 1;
    const portrait = THREE.MathUtils.clamp((1 - aspect) / 0.55, 0, 1);
    if (portrait > 0) tmp.pos.addScaledVector(tmp.dir, -0.45 * portrait);
    tmp.tgt.copy(tmp.pos).add(tmp.dir);
    fov = THREE.MathUtils.clamp((fov + rig.look.fov) * (1 + 0.38 * portrait), 26, 80);

    const c = cur.current;
    if (!c.init || reduced) {
      c.pos.copy(tmp.pos);
      c.tgt.copy(tmp.tgt);
      c.fov = fov;
      c.init = true;
    } else {
      const kk = damp(7, dt);
      c.pos.lerp(tmp.pos, kk);
      c.tgt.lerp(tmp.tgt, kk);
      c.fov += (fov - c.fov) * kk;
    }
    camera.position.copy(c.pos);
    camera.lookAt(c.tgt);
    if (Math.abs(camera.fov - c.fov) > 0.01) {
      camera.fov = c.fov;
      camera.updateProjectionMatrix();
    }
  });

  return null;
}
