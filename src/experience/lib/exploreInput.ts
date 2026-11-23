import { rig } from "../store";

const YAW_LIMIT = 1.15;
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

/**
 * Explore-mode look controls on the canvas container:
 *  - mouse / one finger drag  -> look around (yaw / pitch)
 *  - wheel / two-finger pinch -> zoom (FOV)
 * Returns a cleanup function.
 */
export function attachExploreInput(el: HTMLElement): () => void {
  const pointers = new Map<number, { x: number; y: number }>();
  let pinchStart = 0;
  let fovStart = 0;

  const onDown = (e: PointerEvent) => {
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    try {
      el.setPointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
    if (pointers.size === 2) {
      const [a, b] = [...pointers.values()];
      pinchStart = Math.hypot(a.x - b.x, a.y - b.y);
      fovStart = rig.look.fov;
    }
    el.style.cursor = "grabbing";
  };

  const onMove = (e: PointerEvent) => {
    const prev = pointers.get(e.pointerId);
    if (!prev) return;
    const cur = { x: e.clientX, y: e.clientY };
    pointers.set(e.pointerId, cur);
    if (pointers.size === 1) {
      const k = 2.4 / Math.max(320, Math.min(window.innerWidth, window.innerHeight));
      rig.look.yaw = clamp(rig.look.yaw + (cur.x - prev.x) * k, -YAW_LIMIT, YAW_LIMIT);
      rig.look.pitch = clamp(rig.look.pitch + (cur.y - prev.y) * k * 0.8, -0.45, 0.45);
    } else if (pointers.size === 2 && pinchStart > 0) {
      const [a, b] = [...pointers.values()];
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      rig.look.fov = clamp(fovStart - (d - pinchStart) * 0.06, -18, 14);
    }
  };

  const onUp = (e: PointerEvent) => {
    pointers.delete(e.pointerId);
    if (pointers.size < 2) pinchStart = 0;
    if (!pointers.size) el.style.cursor = "";
  };

  const onWheel = (e: WheelEvent) => {
    e.preventDefault();
    rig.look.fov = clamp(rig.look.fov + Math.sign(e.deltaY) * 2.2, -18, 14);
  };

  el.addEventListener("pointerdown", onDown);
  el.addEventListener("pointermove", onMove);
  el.addEventListener("pointerup", onUp);
  el.addEventListener("pointercancel", onUp);
  el.addEventListener("wheel", onWheel, { passive: false });
  return () => {
    el.removeEventListener("pointerdown", onDown);
    el.removeEventListener("pointermove", onMove);
    el.removeEventListener("pointerup", onUp);
    el.removeEventListener("pointercancel", onUp);
    el.removeEventListener("wheel", onWheel);
    el.style.cursor = "";
  };
}
