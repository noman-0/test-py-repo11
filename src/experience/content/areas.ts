import type { AreaId } from "../config/world";
import { BRAND_INFO } from "@/data/brandInfo";

type L = { en: string; ar: string };

export interface AreaCopy {
  /** Short index label (also used in the header index). */
  label: L;
  /** Display title: first line + italic second line. */
  title: L;
  italic: L;
  /** One or two concise lines. Facts only from the existing site / BRAND_INFO. */
  body: L;
  /** Primary action label (opens the area's reading view). */
  cta: L;
  /** The 3D set's name for the chapter marker. */
  place: L;
}

/**
 * Concise, brand-focused copy for the single-screen experience. Rewritten from the site's own
 * longer texts - no new products, prices, claims or business details are introduced.
 */
export const AREA_TEXT: Record<AreaId, AreaCopy> = {
  hero: {
    label: { en: "Entrance", ar: "المدخل" },
    title: { en: "The journey of coffee,", ar: "رحلة البن الفاخر،" },
    italic: { en: "from nature to cup.", ar: "من الطبيعة إلى فنجانك." },
    body: {
      en: "Single-origin brews, house-roasted beans and 24/7 event catering for Qatar's majlis and corporate gatherings.",
      ar: "قهوة مختصة أحادية المصدر، تحميص منزلي، وضيافة مناسبات على مدار الساعة للمجالس والفعاليات في قطر.",
    },
    cta: { en: "Book event catering", ar: "احجز ضيافة مناسبة" },
    place: { en: "The storefront", ar: "الواجهة" },
  },
  story: {
    label: { en: "Our heritage", ar: "قصتنا وأصالتنا" },
    title: { en: "The emblem,", ar: "دلالات الشعار،" },
    italic: { en: "a symphony of origin.", ar: "ورمز الأصالة." },
    body: {
      en: "An arch for heritage, a drop cradling a bean for purity, and rising rays for the first light of morning.",
      ar: "قوس للتراث، وقطرة تحتضن حبة بن للنقاء، وخيوط صاعدة لأول ضوء الصباح.",
    },
    cta: { en: "Read our story", ar: "اقرأ قصتنا" },
    place: { en: "The emblem room", ar: "قاعة الشعار" },
  },
  menu: {
    label: { en: "Tasting guide", ar: "قائمة التذوق" },
    title: { en: "Tasting guide", ar: "قائمة التذوق" },
    italic: { en: "& discovery.", ar: "والاكتشاف." },
    body: {
      en: "Espresso, manual pour-overs, cold brews, fresh bakes and beans to take home — each with its tasting notes.",
      ar: "إسبريسو، تقطير يدوي، مشروبات باردة، مخبوزات طازجة وحبوب للمنزل — ولكل منها ملاحظات تذوقه.",
    },
    cta: { en: "Open the menu", ar: "افتح القائمة" },
    place: { en: "The tasting bar", ar: "بار التذوق" },
  },
  catering: {
    label: { en: "Event catering", ar: "ضيافة المناسبات" },
    title: { en: "Bespoke coffee", ar: "ضيافة قهوة" },
    italic: { en: "catering.", ar: "على مقاس مناسبتك." },
    body: {
      en: "Brew boxes, cold-brew crates, pastry platters and a live barista station — arranged directly with our Doha team, 24/7.",
      ar: "صناديق قهوة، صناديق كولد برو، أطباق مخبوزات ومحطة باريستا حية — تنسق مباشرة مع فريقنا في الدوحة على مدار الساعة.",
    },
    cta: { en: "Plan your event", ar: "خطط لمناسبتك" },
    place: { en: "The catering table", ar: "طاولة الضيافة" },
  },
  atmosphere: {
    label: { en: "Atmosphere", ar: "أجواء الكافيه" },
    title: { en: "The majlis", ar: "المجلس" },
    italic: { en: "& roastery.", ar: "والمحمصة." },
    body: {
      en: "A roastery bar, quiet workspaces and generous majlis seating, wrapped in Qatari warmth.",
      ar: "بار للتحميص، مساحات عمل هادئة وجلسات مجلس رحبة بدفء الضيافة القطرية.",
    },
    cta: { en: "Discover the space", ar: "اكتشف المكان" },
    place: { en: "The majlis", ar: "المجلس" },
  },
  hub: {
    label: { en: "Doha hub", ar: "فرع الدوحة" },
    title: { en: "Visit us", ar: "تفضل بزيارتنا" },
    italic: { en: "in Doha.", ar: "في الدوحة." },
    body: {
      en: `${BRAND_INFO.location.detailedAddress.en} · ${BRAND_INFO.hours.displayHours.en}`,
      ar: `${BRAND_INFO.location.detailedAddress.ar} · ${BRAND_INFO.hours.displayHours.ar}`,
    },
    cta: { en: "Directions & contact", ar: "الاتجاهات والتواصل" },
    place: { en: "The terrace", ar: "التراس" },
  },
};

/** Interface microcopy. */
export const UI = {
  loading: { en: "Preparing your experience", ar: "جارٍ تجهيز التجربة" },
  skipIntro: { en: "Skip intro", ar: "تخطي المقدمة" },
  back: { en: "Back to the scene", ar: "العودة إلى المشهد" },
  next: { en: "Next", ar: "التالي" },
  prev: { en: "Previous", ar: "السابق" },
  hint: { en: "Drag to look · Select a point", ar: "اسحب للنظر · اختر نقطة" },
  hintTouch: { en: "Drag to look · Tap a point", ar: "اسحب للنظر · المس نقطة" },
  areas: { en: "Areas", ar: "المناطق" },
  points: { en: "Points of interest", ar: "نقاط الاهتمام" },
  close: { en: "Close", ar: "إغلاق" },
  illustrative: { en: "Illustrative image", ar: "صورة توضيحية" },
  enter: { en: "Step inside", ar: "ادخل" },
  sceneOf: { en: "3D scene", ar: "مشهد ثلاثي الأبعاد" },
} as const;
