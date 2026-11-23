# Excelsa Brand Reference

The **primary brand reference** for this project is the official guide
[`Excelsa.pdf`](../Excelsa.pdf), the *Brand Identity Style Guide*. It has 30 A4-landscape pages and was exported from Photoshop on 2026-01-27.

- SHA-256: `848d02c5902d44e45ce32fdbabb244579027108cfc8f1ec6f7c5785c3be67f1b`
- **Never edit or overwrite `Excelsa.pdf`.** Everything taken from it lives in [`brand-assets/excelsa-guide/`](../brand-assets/excelsa-guide/).

## How the PDF is built, and what that means

Each page is **one flattened 3508×2480 JPEG at 300 dpi**. The PDF contains no vector logo, no embedded fonts and no separate image layers. As a result:

- The logo can only be cropped as a raster image, about 730×1105 px at 300 dpi.
- The Regista Demo font can't be taken from the PDF.
- Mockups can only be cropped as photos of whole objects.

**Please ask the client or designer for the original vector logo (Adobe Illustrator, SVG or PDF) and the font licence.**

## Extracted assets

To regenerate them:
`pdfimages -j Excelsa.pdf <tmp>/p` then `python -I scripts/extract-brand-assets.py <tmp>`.
The script never overwrites existing files unless you pass `--force`. Crop coordinates and the PDF's hash are recorded in `manifest.json`.

| File(s) | Page | Status |
|---|---|---|
| `logo/excelsa-logo-official-green-on-white.jpg` and `logo/excelsa-logo-official-green-transparent.png` | 3 | **Approved for the website.** Official logo, green ink with a transparent background. |
| `logo/excelsa-logo-official-cream-on-green.jpg` and `logo/excelsa-logo-official-cream-transparent.png` | 4 | **Approved for the website.** Reverse version, cream ink with a transparent background. |
| `typography/regista-demo-specimen.jpg` | 7 | Reference only (type specimen) |
| `mockups/p11-paper-cup-with-lid.jpg` | 11 | Reference for the 3D model |
| `mockups/p12-paper-cup-wave-stack.jpg` | 12 | Reference for the 3D model and the wave-band pattern |
| `mockups/p13-cup-carrier.jpg` | 13 | Reference for the 3D model |
| `mockups/p14-apron-ray-motif.jpg` | 14 | Reference for the sun-ray graphic |
| `mockups/p17-kraft-carry-bag.jpg` | 17 | Reference for the 3D model |
| `mockups/p18-kraft-coffee-bag.jpg` | 18 | Reference for the 3D model |
| `mockups/p19-ceramic-cup-saucer.jpg` | 19 | Reference for the 3D model |
| `mockups/p20-rollup-banner.jpg` and `textures/p20-coffee-beans-photo.jpg` | 20 | Reference and mood only |
| `mockups/p21-kraft-carton-box.jpg` | 21 | Reference for the 3D model (catering box) |
| `mockups/p22-review-standee.jpg` | 22 | Reference for the 3D model (matches the `#reviews` section) |
| `mockups/p24-hoarding-iced-latte.jpg` | 24 | Mood only. **Not a menu photo.** |
| `mockups/p25-green-carry-bag.jpg` | 25 | Reference for the 3D model |
| `mockups/p26-round-sign-board.jpg` | 26 | Reference for the 3D model (storefront) |
| `mockups/p27-glass-sticker.jpg` | 27 | Reference for the storefront |
| `pages/p01-cover.jpg`, `pages/p05-logo-story.jpg`, `pages/p06-colour-code.jpg` | 1, 5, 6 | Page previews, documentation only |

**Usage rules**

- Mockups are visual references. **Don't present them as product photos**, and don't use full-page images as website assets.
- Mockup scenes may include third-party stock elements, such as hands, rooms and the iced-latte photo. That's another reason to keep them out of the website.

## Brand rules from the guide

- **Logo (pages 3–4):** a pill-shaped outline containing:
  - an arched window with a bold fan of 7 sun rays and a horizon bar;
  - a **solid** drop with a coffee bean cut out of it;
  - **EXCELSA** in Regista, with "SPECIALITY COFFEE" spaced out beneath it;
  - the Arabic wordmark **اكسالسا كافي**.

  Use it as supplied. Don't redraw, stretch or recolour it beyond the two brand colours.
- **Logo story (page 5):**
  - the arched frame stands for heritage, craftsmanship and trust;
  - the drop with the bean stands for purity, richness and carefully sourced coffee;
  - the rising lines stand for freshness, aroma and the first rays of morning;
  - the deep green stands for nature, sustainability and premium quality.
- **Colours (page 6):** `#072B29` green and `#FEFADD` cream. Both were checked against the swatches and the logo ink, and match exactly.
- **Typography (page 7):** Regista Demo Regular for Headings 1–4. ⚠️ "Demo" builds of fonts are usually licensed for personal use only, so a commercial web licence must be confirmed. Until then the site keeps its existing fallback, `--font-regista`, which maps to Playfair Display.
- **Materials across the mockups:** deep-green matte paper and fabric, kraft paper and corrugated card, white ceramic, copper/brass frames, frosted glass.
- **Recurring graphics:** the sun-ray fan used large (apron, page 14) and a cream wave band (paper cup, page 12).
- **Contact details on the mockups:** Doha, Qatar · +974 5106 1111 · founder "Ahamad". These match `src/data/brandInfo.ts`.

## Differences between the guide and the current website

| Item | Guide | Current website |
|---|---|---|
| Logo | Official artwork, solid drop, bold ray fan, pill outline, Arabic wordmark | `public/logos/*.svg` is a hand-drawn approximation: outline drop, thin rays, no pill outline, no Arabic. Keep the files; switch to the official logo through the asset config. |
| Colours | Two colours only | Adds gold `#C8A96A`, surface greens and muted tints. These are kept and not changed without approval. |
| Heading font | Regista Demo | Playfair Display, used as the stand-in for Regista |
| Product photos | **None** (mockups only) | `menuData.ts` points to 11 `/images/*.webp` files that don't exist yet |
