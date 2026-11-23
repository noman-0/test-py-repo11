"use client";

import React, { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { CoffeePourMenu, type CoffeeItem } from "@/components/ui/coffee-pour-menu";
import DishOrbitCarousel, { type Dish } from "@/components/ui/dish-orbit-carousel";
import { Sparkles, Coffee, UtensilsCrossed } from "lucide-react";

const EXCELSA_CRAFT_DRINKS: CoffeeItem[] = [
  {
    id: "excelsa-espresso",
    name: "Excelsa Reserve Espresso",
    subtitle: "30 ml · Single-Origin Geisha",
    description: "An intense, aromatic shot with notes of bergamot, jasmine, and a thick golden crema.",
    vessel: "demitasse",
    layers: [{ type: "espresso", amount: 0.72 }],
    crema: true,
  },
  {
    id: "spanish-latte",
    name: "Doha Signature Spanish Latte",
    subtitle: "220 ml · Sweet & Velvety",
    description: "Rich espresso layered over condensed milk sweetness and warm microfoam.",
    vessel: "glass-mug",
    layers: [
      { type: "milk", amount: 0.52 },
      { type: "espresso", amount: 0.28 },
    ],
    foam: 0.12,
    blend: 0.6,
  },
  {
    id: "qatar-cappuccino",
    name: "Velvet Cardamom Cappuccino",
    subtitle: "180 ml · Spiced Microfoam",
    description: "Double ristretto paired with silk-textured milk infused with crushed Qatari cardamom.",
    vessel: "cup",
    layers: [
      { type: "espresso", amount: 0.32 },
      { type: "milk", amount: 0.45 },
    ],
    foam: 0.15,
    art: "heart",
  },
  {
    id: "americano-reserve",
    name: "V60 Style Long Black",
    subtitle: "240 ml · Clean & Floral",
    description: "Double extraction slowly layered over pristine 92°C mineral-balanced water.",
    vessel: "glass-mug",
    layers: [
      { type: "water", amount: 0.55 },
      { type: "espresso", amount: 0.25 },
    ],
    crema: true,
    blend: 0.85,
  },
  {
    id: "cascara-latte",
    name: "Cascara Honey Latte",
    subtitle: "300 ml · Sun-Dried Cherry",
    description: "Cascara tea reduction infused with steamed oat milk and espresso float.",
    vessel: "tall-glass",
    layers: [
      { type: "espresso", amount: 0.22 },
      { type: "milk", amount: 0.56 },
    ],
    foam: 0.12,
    blend: 0.25,
  },
];

const EXCELSA_ROASTERY_DISHES: Dish[] = [
  {
    title: "Signature Artisanal",
    subtitle: "Brioche French Toast",
    image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80",
    alt: "Artisanal Brioche French Toast with wild berries and espresso glaze",
    eyebrow: "#1 Doha Roastery Favorite",
    rating: 4.9,
    chef: "Executive Chef Ahamad",
    kitchen: "Excelsa Roastery & Kitchen · Doha",
    description: "Thick-cut golden French brioche soaked in rich vanilla bean custard, garnished with fresh berries, crushed Sicilian pistachios, and warm Excelsa espresso reduction.",
    likes: 1240,
    ingredients: ["Artisanal Brioche", "Vanilla Custard", "Wild Berries", "Pistachio", "Espresso Glaze"],
    accent: "#072B29",
  },
  {
    title: "House Specialty",
    subtitle: "Burrata & Fig Tartine",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
    alt: "Fresh Burrata and caramelized fig tartine",
    eyebrow: "#2 All-Day Breakfast Favorite",
    rating: 4.8,
    chef: "Fatima Al-Ansari",
    kitchen: "Excelsa Roastery & Kitchen · Doha",
    description: "Creamy whole burrata on warm artisanal sourdough with honeyed fresh figs, microgreens, aged pomegranate reduction, and roasted Mediterranean hazelnuts.",
    likes: 980,
    ingredients: ["Fresh Burrata", "Organic Figs", "Artisanal Sourdough", "Pomegranate Reduction", "Roasted Hazelnuts"],
    accent: "#C8A96A",
  },
  {
    title: "Artisanal Bakery",
    subtitle: "Cardamom Pistachio Babka",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80",
    alt: "Twisted cardamom and pistachio babka",
    eyebrow: "#3 Morning Pairing",
    rating: 5.0,
    chef: "Executive Chef Ahamad",
    kitchen: "Excelsa Roastery & Kitchen · Doha",
    description: "Twisted golden brioche folded with Qatari ground cardamom, rich emerald pistachio paste, and a delicate orange blossom honey glaze.",
    likes: 1650,
    ingredients: ["Cardamom Brioche", "Pistachio Cream", "Orange Blossom Honey", "Flaky Sea Salt"],
    accent: "#0E4A46",
  },
  {
    title: "Savoury Gourmet",
    subtitle: "Avocado & Poached Egg Bowl",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80",
    alt: "Organic avocado and poached eggs with zaatar",
    eyebrow: "#4 Chef's Selection",
    rating: 4.7,
    chef: "Omar Al-Kuwari",
    kitchen: "Excelsa Roastery & Kitchen · Doha",
    description: "Sliced Hass avocado, organic soft-poached farm eggs, blistered heirloom cherry tomatoes, Danish feta, and toasted sesame za'atar over organic quinoa.",
    likes: 890,
    ingredients: ["Organic Poached Eggs", "Hass Avocado", "Za'atar", "Blistered Tomatoes", "Danish Feta"],
    accent: "#2D584C",
  },
];

export function CraftInteractiveShowcase() {
  const { isAr } = useLanguage();
  const [activeTab, setActiveTab] = useState<"pour" | "orbit">("pour");

  return (
    <section className="py-24 bg-brand-cream text-brand-green relative overflow-hidden border-t border-brand-green/10">
      {/* Decorative Brand Accent Background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent-gold/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-green/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-green/10 text-brand-green text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5 text-accent-gold" />
            {isAr ? "تجربة تفاعلية حية" : "Interactive Roastery Experience"}
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-brand-green tracking-tight">
            {isAr
              ? "استكشف فيزياء الصب وأطباق المطبخ الحرفية"
              : "Experience Pour Physics & Artisanal Kitchen Plates"}
          </h2>

          <p className="mt-4 text-base sm:text-lg text-brand-green/80 font-sans leading-relaxed">
            {isAr
              ? "تفاعل مع محاكاة فيزياء الصب المباشرة لمشروباتنا المختارة، أو استعرض مدار أطباق المخبوزات المصممة لتتناغم مع نكهات القهوة."
              : "Interact with our live physics-driven pour simulation for bespoke brews, or orbit through signature artisanal plates crafted to pair with Excelsa coffees."}
          </p>

          {/* Interactive Switcher Tabs */}
          <div className="inline-flex p-1.5 rounded-2xl bg-brand-green/10 mt-8 border border-brand-green/15">
            <button
              type="button"
              onClick={() => setActiveTab("pour")}
              className={`flex items-center gap-2.5 px-6 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 ${
                activeTab === "pour"
                  ? "bg-brand-green text-brand-cream shadow-md"
                  : "text-brand-green/75 hover:text-brand-green"
              }`}
            >
              <Coffee className="w-4 h-4 text-accent-gold" />
              <span>{isAr ? "محاكاة صب القهوة (Physics Stage)" : "Coffee Pour Physics"}</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("orbit")}
              className={`flex items-center gap-2.5 px-6 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 ${
                activeTab === "orbit"
                  ? "bg-brand-green text-brand-cream shadow-md"
                  : "text-brand-green/75 hover:text-brand-green"
              }`}
            >
              <UtensilsCrossed className="w-4 h-4 text-accent-gold" />
              <span>{isAr ? "مدار الأطباق (Orbit Carousel)" : "Kitchen Orbit Carousel"}</span>
            </button>
          </div>
        </div>

        {/* Dynamic Display Stage */}
        <div className="transition-all duration-500">
          {activeTab === "pour" ? (
            <div className="w-full bg-[#f6eee3] rounded-3xl p-4 sm:p-8 md:p-10 shadow-xl border border-brand-green/15 overflow-hidden flex flex-col items-center">
              <div className="mb-4 text-center">
                <p className="text-xs font-semibold uppercase tracking-wider text-brand-green/60">
                  {isAr ? "اختر مشروباً لمشاهدة فيزياء التمازج والصب" : "Select a drink to spring vessel and simulate pour layers"}
                </p>
              </div>
              <CoffeePourMenu
                items={EXCELSA_CRAFT_DRINKS}
                defaultValue="spanish-latte"
                className="max-w-5xl w-full"
              />
            </div>
          ) : (
            <div className="w-full rounded-3xl overflow-hidden shadow-2xl border border-brand-green/20">
              <DishOrbitCarousel
                dishes={EXCELSA_ROASTERY_DISHES}
                height="650px"
                backdrop="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80"
                loop={true}
                onOrder={(dish) => {
                  const message = encodeURIComponent(
                    `Hello Excelsa Speciality Coffee, I am inquiring about the "${dish.title} - ${dish.subtitle}" dish for our upcoming Doha event gathering.`
                  );
                  window.open(`https://wa.me/97451061111?text=${message}`, "_blank");
                }}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
export default CraftInteractiveShowcase;
