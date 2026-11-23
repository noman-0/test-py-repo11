/**
 * Brand tokens for the 3D experience.
 * Source of truth: Excelsa.pdf (see docs/BRAND_REFERENCE.md).
 * The guide defines exactly two brand colours. Everything else here is a *material* neutral taken
 * from the guide's own mockups (kraft paper, white ceramic, copper frame, frosted glass), not a new
 * brand colour.
 */
export const BRAND = {
  green: "#072B29", // official (guide p.6)
  cream: "#FEFADD", // official (guide p.6)
} as const;

export const MATERIAL_TONES = {
  greenDeep: "#041A19", // shadowed brand green (fog / floor)
  greenLift: "#0E3F3C", // lit brand green (existing site surface tone)
  kraft: "#C29F74", // kraft bags / carton (guide p.17, 18, 21)
  kraftDark: "#9C7B55",
  ceramic: "#F3F0E8", // saucer / cup interior (guide p.19)
  copper: "#B9784A", // roll-up banner frame (guide p.20)
  brass: "#C9A257", // sign board ring (guide p.26)
  glass: "#DDE8E4", // frosted glass (guide p.27)
  coffee: "#2B1A10",
  crema: "#B07A45",
  milk: "#EFE3CF",
} as const;
