"use client"

import * as React from "react"
import DishOrbitCarousel, { type Dish } from "@/components/ui/dish-orbit-carousel"

const DISHES: Dish[] = [
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
]

export function DishOrbitCarouselDemo() {
  return (
    <div className="w-full bg-[#072B29]/5 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center">
        <span className="inline-block px-3 py-1 bg-[#C8A96A]/20 text-[#072B29] font-medium text-xs tracking-wider uppercase rounded-full mb-3">
          Curated Roastery Plates
        </span>
        <h2 className="text-3xl sm:text-4xl font-serif text-[#072B29]">
          The Artisanal Kitchen Showcase
        </h2>
        <p className="text-stone-600 max-w-xl mx-auto mt-2 text-sm sm:text-base">
          Scroll or swipe through our signature kitchen creations and morning bakery pairings crafted specifically to elevate Excelsa specialty coffees.
        </p>
      </div>

      <div className="w-full shadow-2xl rounded-2xl overflow-hidden border border-[#072B29]/10">
        <DishOrbitCarousel
          dishes={DISHES}
          height="650px"
          backdrop="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80"
          loop={true}
          onOrder={(dish) => {
            const text = encodeURIComponent(
              `Hello Excelsa Coffee, I would like to inquire about ordering the "${dish.title} ${dish.subtitle}" dish for an event or dining.`
            )
            window.open(`https://wa.me/97451061111?text=${text}`, "_blank")
          }}
        />
      </div>
    </div>
  )
}

export default DishOrbitCarouselDemo
