# QA baseline (before the 3D experience)

Recorded 2026-11-23 on branch `feature/3d-experience`, before any 3D code was added. The base commit is `2945de4`.

## Build

- `npx tsc --noEmit`: passes
- `next build`: passes
  - `/` is 67.3 kB, with 155 kB of first-load JS
  - JS shared by all pages: 87.3 kB

## Snapshot check (`scripts/qa-snapshot.mjs`)

Checked at desktop (1440×900), tablet (834×1112) and mobile (390×844), each in English and Arabic.

| Viewport and language | `dir` | Page height (px) | Console errors | Horizontal overflow |
|---|---|---|---|---|
| desktop-en | ltr | 7545 | 0 | no |
| desktop-ar | rtl | 7186 | 0 | no |
| tablet-en | ltr | 9438 | 0 | no |
| tablet-ar | rtl | 8883 | 0 | no |
| mobile-en | ltr | 13013 | 0 | no |
| mobile-ar | rtl | 12471 | 0 | no |

## Lighthouse 12.2.1 (production build, local `next start`)

| Preset | Performance | Accessibility | Best practices | SEO | FCP | LCP | TBT | CLS |
|---|---|---|---|---|---|---|---|---|
| Mobile | 82 | 92 | 100 | 100 | 3.5 s | 3.7 s | 0 ms | 0 |
| Desktop | 90 | 92 | 100 | 100 | 1.4 s | 1.5 s | 0 ms | 0.005 |

The accessibility score of 92 comes entirely from existing **colour-contrast** failures on small `<span>` labels.

## Notes

- `next build` prints webpack cache warnings because the drive letter appears as both `e:` and `E:`. They come from the Windows path casing and don't affect the build.
- This machine's npm strips the `libc` fields from `package-lock.json`. Dependency changes are post-processed so those fields are kept.
