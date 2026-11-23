export interface BulkPackageOption {
  id: string;
  name: { en: string; ar: string };
  category: "batch-brew" | "cold-brew" | "live-station" | "pastry";
  capacity: { en: string; ar: string };
  cupsEstimate: number;
  priceQAR: number;
  description: { en: string; ar: string };
  includedItems: { en: string[]; ar: string[] };
}

export const BULK_PACKAGE_OPTIONS: BulkPackageOption[] = [
  {
    id: "box-3l",
    name: { en: "3L Specialty Batch Brew Box", ar: "صندوق قهوة مقطرة 3 لتر" },
    category: "batch-brew",
    capacity: { en: "3 Liters (~15 cups)", ar: "3 لتر (~15 كوب)" },
    cupsEstimate: 15,
    priceQAR: 190,
    description: {
      en: "Thermal insulated dispenser keeping single-origin batch brew piping hot for 4+ hours.",
      ar: "حافظة حرارية معزولة تحافظ على سخونة ونكهة القهوة المختصة لأكثر من 4 ساعات.",
    },
    includedItems: {
      en: ["15 Branded double-wall paper cups", "Sugar sticks & wooden stirrers", "Fresh organic milk"],
      ar: ["15 كوب ورقي فاخر بشعار اكسالسا", "أعواد تحريك خشبية ومغلفات سكر", "حليب عضوي طازج"],
    },
  },
  {
    id: "box-5l",
    name: { en: "5L Specialty Batch Brew Box", ar: "صندوق قهوة مقطرة 5 لتر" },
    category: "batch-brew",
    capacity: { en: "5 Liters (~25 cups)", ar: "5 لتر (~25 كوب)" },
    cupsEstimate: 25,
    priceQAR: 290,
    description: {
      en: "Generous insulated coffee dispenser ideal for family majlis, business meetings, and gatherings.",
      ar: "حافظة قهوة كبيرة مثالية للمجالس العائلية، اجتماعات العمل، والمناسبات الودية.",
    },
    includedItems: {
      en: ["25 Branded double-wall paper cups", "Sugar sticks & stirrers", "Dairy & Oat milk carafes"],
      ar: ["25 كوب ورقي بشعار اكسالسا", "سكر وأعواد تحريك", "عبوات حليب طازج وحليب الشوفان"],
    },
  },
  {
    id: "crate-12",
    name: { en: "Crate of 12 Bottled Cold Brews", ar: "صندوق 12 قارورة كولد برو" },
    category: "cold-brew",
    capacity: { en: "12 x 250ml Bottles", ar: "12 قارورة × 250 مل" },
    cupsEstimate: 12,
    priceQAR: 280,
    description: {
      en: "Ice-packed wooden crate containing an assortment of Cascara, Signature Cold Brew, and Spanish Latte.",
      ar: "صندوق خشبي مبرد بالثلج يضم تشكيلة مختارة من كولد برو كاسكارا، المشروب الكلاسيكي، والسبانيش لاتيه.",
    },
    includedItems: {
      en: ["12 Amber glass bottles (250ml)", "Thermal ice pack casing", "Biodegradable paper straws"],
      ar: ["12 قارورة زجاجية محكمة", "تغليف حافظ للبرودة بالثلج", "مصاصات ورقية صديقة للبيئة"],
    },
  },
  {
    id: "crate-24",
    name: { en: "Crate of 24 Bottled Cold Brews", ar: "صندوق 24 قارورة كولد برو" },
    category: "cold-brew",
    capacity: { en: "24 x 250ml Bottles", ar: "24 قارورة × 250 مل" },
    cupsEstimate: 24,
    priceQAR: 520,
    description: {
      en: "Double ice-packed crate designed for weddings, diwaniyas, and VIP office gatherings.",
      ar: "صندوق كبير مبرد بعناية ومناسب لحفلات الاستقبال، الديوانيات، ومناسبات كبار الشخصيات.",
    },
    includedItems: {
      en: ["24 Assorted signature bottles", "Custom event sticker sleeves", "Chilled presentation box"],
      ar: ["24 قارورة بتشكيلة متنوعة", "ملصقات خاصة بالمناسبة حسب الطلب", "صندوق تقديم أنيق مبرد"],
    },
  },
  {
    id: "live-bar",
    name: { en: "Live On-Site Barista Station", ar: "محطة باريستا حية في موقع الفعالية" },
    category: "live-station",
    capacity: { en: "3 to 4 Hours Service", ar: "خدمة من 3 إلى 4 ساعات" },
    cupsEstimate: 60,
    priceQAR: 950,
    description: {
      en: "Mobile commercial espresso bar with certified Excelsa baristas, grinder, and signature menu.",
      ar: "ركن إسبريسو متنقل متكامل مع طاقم باريستا معتمد من اكسالسا، ماكينة احترافية، وقائمة مشروبات كاملة.",
    },
    includedItems: {
      en: ["Two certified specialty baristas", "Commercial espresso machine & grinder", "Unlimited syrups & specialty milks"],
      ar: ["اثنان من باريستا اكسالسا المحترفين", "ماكينة إسبريسو ومطحنة تجارية", "نكهات وسيروب وحليب مختص غير محدود"],
    },
  },
  {
    id: "pastry-platter",
    name: { en: "Artisanal Pastry Platter (24 Pcs)", ar: "طبق المخبوزات الحرفية (24 قطعة)" },
    category: "pastry",
    capacity: { en: "24 Mini Pastries", ar: "24 قطعة ميني منوعة" },
    cupsEstimate: 24,
    priceQAR: 240,
    description: {
      en: "Freshly baked cardamom saffron buns, pistachio croissants, and mini Basque bites.",
      ar: "تشكيلة طازجة تضم لفائف الهيل والزعفران، كرواسون الفستق، وقطع تشيز كيك سان سيباستيان الصغيرة.",
    },
    includedItems: {
      en: ["8 Mini Cardamom Buns", "8 Pistachio Croissants", "8 San Sebastián Bites", "Gold display platter"],
      ar: ["8 لفائف هيل وزعفران", "8 كرواسون فستق", "8 قطع ميني سان سيباستيان", "صينية تقديم ذهبية فاخرة"],
    },
  },
];
