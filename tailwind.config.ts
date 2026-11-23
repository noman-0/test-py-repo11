import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          green: "#072B29",
          cream: "#FEFADD",
        },
        surface: {
          green: "#0E3F3C",
          "green-hover": "#0B3D3A",
          cream: "#F6F0C8",
        },
        muted: {
          "on-green": "#A7C4BF",
          "on-cream": "#3B5C59",
        },
        accent: {
          gold: "#C8A96A",
        },
        status: {
          "error-cream": "#9E2A2B",
          "error-green": "#F4A29E",
          open: "#166534",
          closed: "#7F1D1D",
        },
      },
      fontFamily: {
        display: ["var(--font-regista)", "Playfair Display", "serif"],
        sans: ["var(--font-jakarta)", "Plus Jakarta Sans", "sans-serif"],
        arabic: ["var(--font-ibm-arabic)", "IBM Plex Sans Arabic", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
