"""
Build web-ready brand assets from the OFFICIAL extracted logo (brand-assets/excelsa-guide/logo).

Outputs (never overwrites existing files unless --force):
  public/brand/logo/excelsa-logo-official-{cream,green}.png   full official logo, transparent
  public/brand/logo-layers/{frame,arch,rays,drop,wordmark,tagline,arabic}.png
      Same canvas size as the official cream logo. Every pixel of the official logo belongs to
      exactly one layer, so stacking all layers reproduces the logo pixel-for-pixel (verified below).
      No redrawing - layers are masks of the official raster.
  public/brand/icons/{favicon-32.png,favicon-48.png,icon-192.png,icon-512.png,apple-touch-icon.png,favicon.ico}
      Cropped from the official logo's arch-window mark (arch + rays + drop), cream on #072B29.

Usage: python -I scripts/build-brand-web-assets.py [--force]
"""
import os
import sys

import numpy as np
from PIL import Image
from scipy import ndimage

SRC = os.path.join("brand-assets", "excelsa-guide", "logo")
OUT = os.path.join("public", "brand")
GREEN = (0x07, 0x2B, 0x29)
FORCE = "--force" in sys.argv

# Vertical bands (px, on the 801x1183 official cream canvas) used to classify text components.
BANDS = {"wordmark": (700, 835), "tagline": (835, 930), "arabic": (930, 1040)}


def write(img, rel):
    path = os.path.join(OUT, rel)
    if os.path.exists(path) and not FORCE:
        print("skip (exists):", path)
        return
    os.makedirs(os.path.dirname(path), exist_ok=True)
    img.save(path, optimize=True)
    print("wrote", path, img.size)


def main():
    cream = Image.open(os.path.join(SRC, "excelsa-logo-official-cream-transparent.png")).convert("RGBA")
    green = Image.open(os.path.join(SRC, "excelsa-logo-official-green-transparent.png")).convert("RGBA")
    write(cream, "logo/excelsa-logo-official-cream.png")
    write(green, "logo/excelsa-logo-official-green.png")

    rgba = np.asarray(cream)
    alpha = rgba[..., 3]
    solid = alpha > 40
    lab, n = ndimage.label(solid)
    objs = ndimage.find_objects(lab)
    areas = ndimage.sum(solid, lab, index=np.arange(1, n + 1))

    # Identify structural components by size/position (see docs/BRAND_REFERENCE.md).
    order = np.argsort(-areas)  # largest first
    frame_id = order[0] + 1  # outer pill ring - the largest stroke
    # remaining big components in the emblem area (y < 700)
    emblem = [i + 1 for i in range(n) if objs[i][0].stop < 700 and i + 1 != frame_id]
    # arch window line = component with the widest x-span among emblem parts
    arch_id = max(emblem, key=lambda k: objs[k - 1][1].stop - objs[k - 1][1].start)
    # rays+horizon = the emblem component with the highest top edge apart from the arch
    rest = [k for k in emblem if k != arch_id]
    rays_id = min(rest, key=lambda k: objs[k - 1][0].start)

    layer_of = {frame_id: "frame", arch_id: "arch", rays_id: "rays"}
    for k in rest:
        if k != rays_id:
            layer_of[k] = "drop"  # drop outline + both bean halves
    for i in range(n):
        k = i + 1
        if k in layer_of:
            continue
        cy = (objs[i][0].start + objs[i][0].stop) / 2
        for name, (y0, y1) in BANDS.items():
            if y0 <= cy < y1:
                layer_of[k] = name
        if k not in layer_of:
            layer_of[k] = "frame" if cy >= 1040 or cy < 100 else "drop"

    # Assign every non-transparent pixel (incl. soft antialias edges) to its nearest component.
    _, (iy, ix) = ndimage.distance_transform_edt(~solid, return_indices=True)
    nearest = lab[iy, ix]
    names = ["frame", "arch", "rays", "drop", "wordmark", "tagline", "arabic"]
    recomposed = np.zeros_like(rgba)
    for name in names:
        ids = [k for k, v in layer_of.items() if v == name]
        mask = np.isin(nearest, ids) & (alpha > 0)
        layer = np.zeros_like(rgba)
        layer[mask] = rgba[mask]
        recomposed[mask] = rgba[mask]
        print(f"layer {name}: components={len(ids)} pixels={int(mask.sum())}")
        write(Image.fromarray(layer, "RGBA"), f"logo-layers/{name}.png")
    # Compare what is visible: alpha everywhere, colour wherever alpha > 0.
    vis = alpha > 0
    diff = max(
        int(np.abs(recomposed[..., 3].astype(int) - alpha.astype(int)).max()),
        int(np.abs(recomposed[vis, :3].astype(int) - rgba[vis, :3].astype(int)).max()),
    )
    print("recomposition max abs diff vs official:", diff)
    assert diff == 0, "layers do not reproduce the official logo exactly"

    # Favicon / app icons: official arch-window mark (arch + rays + drop), cream on brand green.
    ys, xs = objs[arch_id - 1]
    mark_ids = [k for k, v in layer_of.items() if v in ("arch", "rays", "drop")]
    mmask = np.isin(nearest, mark_ids) & (alpha > 0)
    mark = np.zeros_like(rgba)
    mark[mmask] = rgba[mmask]
    pad = 6
    mark_img = Image.fromarray(mark, "RGBA").crop((xs.start - pad, ys.start - pad, xs.stop + pad, ys.stop + pad))
    for size, rel, inset in [
        (512, "icons/icon-512.png", 0.16),
        (192, "icons/icon-192.png", 0.16),
        (180, "icons/apple-touch-icon.png", 0.16),
        (48, "icons/favicon-48.png", 0.10),
        (32, "icons/favicon-32.png", 0.08),
    ]:
        canvas = Image.new("RGBA", (size, size), GREEN + (255,))
        box = int(size * (1 - 2 * inset))
        m = mark_img.copy()
        m.thumbnail((box, box), Image.LANCZOS)
        canvas.alpha_composite(m, ((size - m.width) // 2, (size - m.height) // 2))
        write(canvas, rel)
    # Social sharing image: official cream logo, unmodified, centred on brand green.
    og = Image.new("RGB", (1200, 630), GREEN)
    lg = cream.copy()
    lg.thumbnail((1000, 520), Image.LANCZOS)
    og.paste(lg, ((1200 - lg.width) // 2, (630 - lg.height) // 2), lg)
    og_path = os.path.join(OUT, "og", "excelsa-og.jpg")
    if not os.path.exists(og_path) or FORCE:
        os.makedirs(os.path.dirname(og_path), exist_ok=True)
        og.save(og_path, quality=90)
        print("wrote", og_path)

    ico_path = os.path.join(OUT, "icons", "favicon.ico")
    if not os.path.exists(ico_path) or FORCE:
        Image.open(os.path.join(OUT, "icons", "icon-512.png")).save(ico_path, sizes=[(16, 16), (32, 32), (48, 48)])
        print("wrote", ico_path)


if __name__ == "__main__":
    main()
