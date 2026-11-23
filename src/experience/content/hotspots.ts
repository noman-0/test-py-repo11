/**
 * Hotspot content for the 3D scenes.
 *
 * SOURCE RULE: every string is either read from the existing data files (MENU_ITEMS,
 * BULK_PACKAGE_OPTIONS, BRAND_INFO) or copied VERBATIM from the existing section components
 * (BrandStorySymbolism story cards, AtmosphereGrid amenities, DohaHub review standee, Hero, CTA
 * labels). No products, prices, reviews, QR codes or business details are invented here.
 */
import { MENU_ITEMS } from "@/data/menuData";
import { BULK_PACKAGE_OPTIONS } from "@/data/cateringPackages";
import { BRAND_INFO } from "@/data/brandInfo";
import type { AreaId } from "../config/world";

export type L = { en: string; ar: string };

export type HotspotAction =
  | { kind: "section"; area: AreaId; label: L }
  | { kind: "tasting"; itemId: string; label: L }
  | { kind: "link"; href: string; label: L; external: boolean };

export interface HotspotDef {
  id: string;
  area: AreaId;
  title: L;
  body?: L;
  meta?: L;
  actions: HotspotAction[];
}

const VIEW: L = { en: "View on the page", ar: "عرض في الصفحة" }; // UI label
const BOOK: L = { en: "Book Event Catering", ar: "طلب حجز ضيافة المناسبات" }; // existing Hero/Navbar CTA
const TASTING: L = { en: "Tasting Notes & Origin", ar: "تفاصيل التذوق والمصدر" }; // existing TastingMenu CTA
const QAR: L = { en: "QAR", ar: "ر.ق" };

const section = (area: AreaId, label: L = VIEW): HotspotAction => ({ kind: "section", area, label });
const link = (href: string, label: L): HotspotAction => ({ kind: "link", href, label, external: !href.startsWith("tel:") });

/* ── Brand story: verbatim from BrandStorySymbolism.tsx ─────────────────────────────────── */
const STORY: HotspotDef[] = [
  {
    id: "story-arch",
    area: "story",
    title: { en: "The Arched Frame", ar: "الإطار المقوس" },
    meta: { en: "Heritage & Craftsmanship", ar: "العراقة والأصالة والحرفية" },
    body: {
      en: "Inspired by classical architectural archways and timeless doorways, the frame represents heritage, meticulous craftsmanship, and enduring trust—symbolizing a refined, curated coffee experience.",
      ar: "مستوحى من الأقواس المعمارية وبوابات الضيافة العريقة. يجسد الإطار التراث الأصيل، الحرفية الدقيقة، والثقة الدائمة، رمزاً لتجربة قهوة راقية لا مثيل لها.",
    },
    actions: [section("story")],
  },
  {
    id: "story-drop",
    area: "story",
    title: { en: "The Drop & Bean", ar: "قطرة القهوة وحبة البن" },
    meta: { en: "Purity & Rare Origin", ar: "النقاء والندرة والمصدر الموثوق" },
    body: {
      en: "At the center, the pure coffee drop cradling a roasted bean signifies richness, botanical purity, and our relentless curation of rare specialty origins—honoring the true Excelsa heritage.",
      ar: "في قلب الشعار، تحتضن القطرة النقية حبة بن محمصة، دلالة على الغنى العطري، النقاء العضوي، والتزامنا بانتقاء سلالات البن النادرة بكل أمانة وشغف.",
    },
    actions: [section("story")],
  },
  {
    id: "story-rays",
    area: "story",
    title: { en: "The Rising Morning Rays", ar: "خيوط شمس الصباح" },
    meta: { en: "Freshness & Awakening", ar: "الانتعاش والعبق وإشراقة اليوم" },
    body: {
      en: "The ascending lines above evoke fresh steam, intoxicating aromas, and the first rays of morning sunlight—celebrating the invigorating start of a perfect day in Doha.",
      ar: "تعكس الخطوط الصاعدة في قمة الشعار عبق القهوة المتصاعد، الانتعاش الصباحي، وخيوط الشمس الأولى التي تحتفي ببدء يوم مثالي ملهم في الدوحة.",
    },
    actions: [section("story")],
  },
];

/* ── Storefront ─────────────────────────────────────────────────────────────────────────── */
const HERO: HotspotDef[] = [
  {
    id: "hero-sign",
    area: "hero",
    title: BRAND_INFO.name,
    body: BRAND_INFO.tagline,
    meta: BRAND_INFO.hours.displayHours,
    actions: [section("hub", { en: "Doha Hub", ar: "فرع الدوحة" }), link(BRAND_INFO.location.googleMapsUrl, { en: "Get Directions (Google / Apple Maps)", ar: "الحصول على الاتجاهات (الخرائط)" })],
  },
  {
    id: "hero-door",
    area: "hero",
    title: { en: "Discover Our Heritage", ar: "اكتشف أصالتنا" }, // existing Hero scroll cue
    body: {
      en: "An artisanal haven for single-origin brews, house-roasted beans, and bespoke 24/7 event catering tailored for Qatar's finest majlis and corporate gatherings.",
      ar: "ملاذ أصيل لعشاق القهوة المختصة، التحميص الحرفي، وضيافة الفعاليات الفاخرة المجهزة خصيصاً للمجالس القطرية والمناسبات الراقية.",
    },
    actions: [section("story", { en: "Our Heritage", ar: "قصتنا وأصالتنا" })],
  },
];

/* ── Tasting bar: one hotspot per existing menu item ────────────────────────────────────── */
const MENU: HotspotDef[] = MENU_ITEMS.map((item) => ({
  id: `menu-${item.id}`,
  area: "menu" as AreaId,
  title: item.name,
  body: item.description,
  meta: {
    en: `${item.priceQAR} ${QAR.en}${item.origin ? ` · ${item.origin.en}` : ""}`,
    ar: `${item.priceQAR} ${QAR.ar}${item.origin ? ` · ${item.origin.ar}` : ""}`,
  },
  actions: [{ kind: "tasting", itemId: item.id, label: TASTING }, section("menu")],
}));

/* ── Catering: one hotspot per existing package ─────────────────────────────────────────── */
const CATERING: HotspotDef[] = BULK_PACKAGE_OPTIONS.map((pkg) => ({
  id: `catering-${pkg.id}`,
  area: "catering" as AreaId,
  title: pkg.name,
  body: pkg.description,
  meta: { en: `${pkg.capacity.en} · ${pkg.priceQAR} ${QAR.en}`, ar: `${pkg.capacity.ar} · ${pkg.priceQAR} ${QAR.ar}` },
  actions: [section("catering", BOOK)],
}));

/* ── Atmosphere: verbatim from AtmosphereGrid.tsx ───────────────────────────────────────── */
const ATMOSPHERE: HotspotDef[] = [
  {
    id: "atmo-roastery",
    title: { en: "Specialty Roastery Bar", ar: "بار التحميص والتقطير" },
    body: {
      en: "Watch master baristas dial in single-origin beans on custom La Marzocco and manual V60 stations.",
      ar: "استمتع بمشاهدة خبرائنا أثناء استخلاص سلالات البن المختص عبر محطات التقطير اليدوي والإسبريسو.",
    },
  },
  {
    id: "atmo-workspace",
    title: { en: "Quiet Workspace Seating", ar: "مساحات عمل هادئة" },
    body: {
      en: "Ergonomic seating with integrated power outlets designed for professionals, creatives, and meetings.",
      ar: "مقاعد مريحة ومزودة بمنافذ طاقة متكاملة تناسب أصحاب الأعمال والمبدعين لعقد اللقاءات وإنجاز المهام.",
    },
  },
  {
    id: "atmo-wifi",
    title: { en: "High-Speed Wi-Fi", ar: "إنترنت فائق السرعة" },
    body: {
      en: "Complimentary ultra-fast fiber connectivity across all indoor and outdoor lounge areas.",
      ar: "اتصال ألياف بصرية سريع ومجاني يغطي كافة الأركان والجلسات الداخلية والخارجية.",
    },
  },
  {
    id: "atmo-majlis",
    title: { en: "Majlis & Social Lounge", ar: "جلسات مجالس ومجموعات" },
    body: {
      en: "Generous communal seating celebrating Qatari warmth, perfect for family and group gatherings.",
      ar: "جلسات رحبة تحتفي ببهجة اللقاء ودفء الضيافة القطرية، مثالية للعائلات والاجتماعات الودية.",
    },
  },
  {
    id: "atmo-packaging",
    title: { en: "Eco-Friendly Craft Packaging", ar: "تغليف صديق للبيئة" },
    body: {
      en: "100% biodegradable kraft bags, recyclable double-walled cups, and sustainably sourced merchandise.",
      ar: "أكياس كرافت قابلة للتحلل العضوي، أكواب عازلة للحرارة ومعاد تدويرها، ومواد مستدامة بالكامل.",
    },
  },
].map((a) => ({ ...a, area: "atmosphere" as AreaId, actions: [section("atmosphere")] }));

/* ── Doha hub: existing DohaHub standee copy + BRAND_INFO links ─────────────────────────── */
const HUB: HotspotDef[] = [
  {
    id: "hub-standee",
    area: "hub",
    title: { en: "Happy with our service?", ar: "هل أعجبتك قهوتنا وخدمتنا؟" },
    body: {
      en: "Help spread the word. Review us on Google or Cloutly as seen on our café table standees.",
      ar: "شاركنا رأيك وساعد الآخرين في اكتشاف قهوتنا. قيّمنا عبر منصة جوجل أو كلاوتلي.",
    },
    actions: [
      link(BRAND_INFO.socials.googleReviews, { en: "Review on Google", ar: "تقييم عبر Google" }),
      link(BRAND_INFO.socials.cloutlyReviews, { en: "Review on Cloutly", ar: "تقييم عبر Cloutly" }),
    ],
  },
  {
    id: "hub-location",
    area: "hub",
    title: { en: BRAND_INFO.location.en, ar: BRAND_INFO.location.ar },
    body: BRAND_INFO.location.detailedAddress,
    meta: BRAND_INFO.hours.displayHours,
    actions: [
      link(BRAND_INFO.location.googleMapsUrl, { en: "Get Directions (Google / Apple Maps)", ar: "الحصول على الاتجاهات (الخرائط)" }),
      link(`tel:${BRAND_INFO.phone}`, { en: "Call Now", ar: "اتصال مباشر" }),
      link(BRAND_INFO.socials.whatsapp, { en: "WhatsApp Concierge", ar: "واتساب الإدارة" }),
    ],
  },
];

export const HOTSPOTS: HotspotDef[] = [...HERO, ...STORY, ...MENU, ...CATERING, ...ATMOSPHERE, ...HUB];
export const HOTSPOT_BY_ID = new Map(HOTSPOTS.map((h) => [h.id, h]));
export const hotspotsFor = (area: AreaId) => HOTSPOTS.filter((h) => h.area === area);
