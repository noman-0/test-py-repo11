"""
Extract brand assets from Excelsa.pdf (official Brand Identity Style Guide).

Read-only with respect to Excelsa.pdf. Writes only into brand-assets/excelsa-guide/.
Existing output files are skipped unless --force is passed.

The PDF is a Photoshop export: every page is ONE flattened 3508x2480 JPEG (300 dpi).
There are no vector logos, embedded fonts or separate image layers, so elements are
cropped from the page rasters at full resolution.

Usage (from repo root):
    pdfimages -j Excelsa.pdf <tmpdir>/p          # lossless page JPEG extraction (poppler)
    python -I scripts/extract-brand-assets.py <tmpdir> [--force]
"""
import hashlib
import json
import os
import sys

import numpy as np
from PIL import Image

GREEN = (0x07, 0x2B, 0x29)  # #072B29 - verified on page 6 swatch and page 3 logo ink
CREAM = (0xFE, 0xFA, 0xDD)  # #FEFADD - verified on page 6 swatch and page 4 logo ink

OUT = os.path.join("brand-assets", "excelsa-guide")

# Logo bounding boxes were measured automatically (ink vs background diff) on the
# full-resolution page rasters: (x0, y0, x1, y1) in pixels.
LOGOS = {
    3: ("logo/excelsa-logo-official-green-on-white", (1391, 687, 2116, 1792), (255, 255, 255), GREEN),
    4: ("logo/excelsa-logo-official-cream-on-green", (1389, 774, 2118, 1885), GREEN, CREAM),
}

# Reference crops: (page, output name, (fx0, fy0, fx1, fy1) as page fractions, purpose)
REFERENCES = [
    (1, "pages/p01-cover", (0, 0, 1, 1), "Cover - layout/tone reference"),
    (5, "pages/p05-logo-story", (0, 0, 1, 1), "Logo story text (transcribed in docs)"),
    (6, "pages/p06-colour-code", (0, 0, 1, 1), "Official palette #072B29 / #FEFADD"),
    (7, "typography/regista-demo-specimen", (0.08, 0.18, 0.95, 0.82), "Regista Demo specimen (H1-H4)"),
    (11, "mockups/p11-paper-cup-with-lid", (0.33, 0.06, 0.77, 1.0), "Takeaway paper cup + lid - 3D model reference"),
    (12, "mockups/p12-paper-cup-wave-stack", (0.30, 0.13, 0.85, 0.90), "Stacked paper cups, cream wave band - 3D/pattern reference"),
    (13, "mockups/p13-cup-carrier", (0.22, 0.12, 0.72, 0.95), "Arched cup carrier (paper holder) - 3D reference"),
    (14, "mockups/p14-apron-ray-motif", (0.34, 0.06, 0.65, 0.99), "Apron with sun-ray supergraphic - motif reference"),
    (17, "mockups/p17-kraft-carry-bag", (0.29, 0.05, 0.73, 1.0), "Kraft paper carry bag - 3D reference"),
    (18, "mockups/p18-kraft-coffee-bag", (0.31, 0.08, 0.69, 0.95), "Kraft coffee bean bag - 3D reference"),
    (19, "mockups/p19-ceramic-cup-saucer", (0.21, 0.25, 0.82, 0.83), "Green ceramic cup & saucer - 3D reference"),
    (20, "mockups/p20-rollup-banner", (0.33, 0.07, 0.75, 0.95), "Roll-up banner with copper frame - reference"),
    (20, "textures/p20-coffee-beans-photo", (0.39, 0.165, 0.62, 0.445), "Roasted bean photo (from banner) - texture/mood reference"),
    (21, "mockups/p21-kraft-carton-box", (0.26, 0.08, 0.80, 0.75), "Kraft carton box - catering box 3D reference"),
    (22, "mockups/p22-review-standee", (0.31, 0.04, 0.75, 0.91), "Google/Cloutly QR review standee - matches #reviews section"),
    (24, "mockups/p24-hoarding-iced-latte", (0.28, 0.23, 0.85, 0.77), "Billboard with iced-latte pour photo - mood reference only"),
    (25, "mockups/p25-green-carry-bag", (0.13, 0.04, 0.82, 0.78), "Green premium carry bag - 3D reference"),
    (26, "mockups/p26-round-sign-board", (0.23, 0.25, 0.86, 0.78), "Round projecting sign board - storefront 3D reference"),
    (27, "mockups/p27-glass-sticker", (0.38, 0.17, 0.66, 0.79), "Frosted glass-door logo sticker - storefront reference"),
]


def page_path(src, n):
    return os.path.join(src, f"p-{n - 1:03d}.jpg")


def should_write(path, force):
    if os.path.exists(path) and not force:
        print("skip (exists):", path)
        return False
    os.makedirs(os.path.dirname(path), exist_ok=True)
    return True


def keyed_logo(img, bg, ink, pad=24):
    """Turn a flat two-colour logo crop into an RGBA image of solid ink colour with
    alpha = projection of each pixel onto the bg->ink colour axis (keeps antialiasing)."""
    a = np.asarray(img).astype(np.float32)
    bgv, inkv = np.array(bg, np.float32), np.array(ink, np.float32)
    axis = inkv - bgv
    t = ((a - bgv) @ axis) / float(axis @ axis)
    alpha = (np.clip(t, 0, 1) * 255).astype(np.uint8)
    rgba = np.zeros((*alpha.shape, 4), np.uint8)
    rgba[..., :3] = ink
    rgba[..., 3] = alpha
    out = Image.fromarray(rgba, "RGBA")
    canvas = Image.new("RGBA", (out.width + 2 * pad, out.height + 2 * pad), (0, 0, 0, 0))
    canvas.paste(out, (pad, pad))
    return canvas


def main():
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    src, force = sys.argv[1], "--force" in sys.argv
    sha = None
    if os.path.exists("Excelsa.pdf"):
        h = hashlib.sha256()
        with open("Excelsa.pdf", "rb") as f:  # read-only
            for chunk in iter(lambda: f.read(1 << 20), b""):
                h.update(chunk)
        sha = h.hexdigest()
    manifest = {"source": "Excelsa.pdf", "sourceSha256": sha, "pageSizePx": [3508, 2480], "dpi": 300, "assets": []}

    for n, (name, box, bg, ink) in LOGOS.items():
        page = Image.open(page_path(src, n)).convert("RGB")
        x0, y0, x1, y1 = box
        m = 12
        crop = page.crop((x0 - m, y0 - m, x1 + m, y1 + m))
        p_jpg = os.path.join(OUT, name + ".jpg")
        if should_write(p_jpg, force):
            crop.save(p_jpg, quality=95, subsampling=0)
        p_png = os.path.join(OUT, name.replace("-on-white", "").replace("-on-green", "") + "-transparent.png")
        if should_write(p_png, force):
            keyed_logo(crop, bg, ink).save(p_png, optimize=True)
        manifest["assets"].append({"page": n, "files": [p_jpg, p_png], "bboxPx": box,
                                   "use": "Official logo (raster). Web-approved; replace with client vector when supplied."})

    for n, name, (fx0, fy0, fx1, fy1), purpose in REFERENCES:
        page = Image.open(page_path(src, n)).convert("RGB")
        W, H = page.size
        box = (int(W * fx0), int(H * fy0), int(W * fx1), int(H * fy1))
        crop = page.crop(box)
        if name.startswith("pages/"):
            crop.thumbnail((1600, 1600))  # whole pages: reference previews only, never web assets
        p = os.path.join(OUT, name + ".jpg")
        if should_write(p, force):
            crop.save(p, quality=90)
        manifest["assets"].append({"page": n, "files": [p], "bboxPx": box, "use": "REFERENCE ONLY - " + purpose})

    mp = os.path.join(OUT, "manifest.json")
    if should_write(mp, force):
        with open(mp, "w", encoding="utf-8") as f:
            json.dump(manifest, f, indent=2)
    print("done")


if __name__ == "__main__":
    main()
