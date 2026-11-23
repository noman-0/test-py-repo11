import type * as THREE from "three";

/**
 * Compiles every material in the scene - including objects hidden by distance culling or merged
 * away - using the parallel-compile extension, so shader compilation never stalls a scroll.
 */
export function warmCompile(gl: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.Camera): Promise<void> {
  const hidden: THREE.Object3D[] = [];
  scene.traverse((o) => {
    if (!o.visible) {
      o.visible = true;
      hidden.push(o);
    }
  });
  const restore = () => hidden.forEach((o) => (o.visible = false));
  return gl.compileAsync(scene, camera).then(restore, restore);
}
