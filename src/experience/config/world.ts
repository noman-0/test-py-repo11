/**
 * World layout + camera choreography.
 *
 * The visitor walks from the street, through the arched doorway (the logo's arched frame),
 * into a continuous Excelsa space: story -> tasting bar -> catering -> majlis -> Doha hub.
 * Sets are spaced along -Z. All set content stays within |x| <= 3.3 so the camera path can swing
 * around it. RTL (Arabic) mirrors only the CAMERA (x -> -x) so subjects sit opposite the
 * start-aligned DOM captions; the objects themselves are never flipped (logo stays readable).
 */
export const AREA_IDS = ["hero", "story", "menu", "catering", "atmosphere", "hub"] as const;
export type AreaId = (typeof AREA_IDS)[number];

/** Section id that holds each area's existing website content. */
export const AREA_SECTION: Record<AreaId, string> = {
  hero: "top",
  story: "story",
  menu: "menu",
  catering: "catering",
  atmosphere: "atmosphere",
  hub: "hub",
};

/** Z origin of each set. */
export const SET_Z: Record<AreaId, number> = {
  hero: 0,
  story: -20,
  menu: -40,
  catering: -60,
  atmosphere: -80,
  hub: -100,
};

export type Vec3 = [number, number, number];
export interface Pose {
  /** Position on the DOM anchor axis (see ANCHORS). */
  at: number;
  pos: Vec3;
  target: Vec3;
  fov: number;
}

/** Where each area's pose sits on the journey PATH (`at` values). */
export const AREA_AT: Record<AreaId, number> = {
  hero: 0,
  story: 1,
  menu: 3,
  catering: 5,
  atmosphere: 7,
  hub: 9,
};

/**
 * Journey path (LTR). Area poses put the subject toward the END side; the area card and reading
 * view sit on the START side. Waypoints between areas swing the camera around each set.
 */
export const PATH: Pose[] = [
  { at: 0, pos: [-0.9, 1.75, 10.5], target: [-1.5, 2.25, 0], fov: 42 },
  { at: 0.7, pos: [0, 1.7, 0.6], target: [0, 1.8, -10], fov: 52 }, // through the arched door
  { at: 1, pos: [-1.15, 2.5, -14.3], target: [-1.45, 2.62, -20], fov: 42 },
  { at: 2, pos: [5.6, 3.1, -23.5], target: [0.5, 2.2, -31], fov: 46 },
  { at: 3, pos: [-1.0, 2.25, -31.2], target: [-1.3, 1.2, -40], fov: 40 },
  { at: 4, pos: [-6.0, 2.9, -44], target: [-0.5, 1.6, -52], fov: 46 },
  { at: 5, pos: [-1.0, 2.6, -51], target: [-1.3, 0.9, -60], fov: 42 },
  { at: 6, pos: [6.1, 3.1, -64], target: [0.5, 1.6, -72], fov: 46 },
  { at: 7, pos: [-1.2, 2.3, -71], target: [-1.4, 0.95, -80], fov: 44 },
  { at: 8, pos: [-6.0, 3.2, -84], target: [0, 2.2, -95], fov: 46 },
  { at: 9, pos: [-1.0, 1.95, -92], target: [-1.3, 1.55, -100], fov: 42 },
  { at: 10, pos: [-0.6, 2.4, -95], target: [-0.8, 3.6, -135], fov: 50 },
];

export const mirrorX = (v: Vec3, rtl: boolean): Vec3 => (rtl ? [-v[0], v[1], v[2]] : v);
