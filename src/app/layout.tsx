import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";

export const metadata: Metadata = {
  title: "Excelsa Speciality Coffee (اكسالسا كافي) | Doha, Qatar",
  description:
    "Excelsa Speciality Coffee in Doha, Qatar. Artisanal single-origin brews, house-roasted specialty beans, and bespoke 24/7 event and home majlis coffee catering.",
  keywords: [
    "Excelsa Coffee",
    "اكسالسا كافي",
    "Specialty Coffee Doha",
    "قهوة مختصة الدوحة",
    "Coffee Catering Qatar",
    "ضيافة قهوة قطر",
    "Majlis Coffee Catering",
    "V60 Doha",
  ],
  authors: [{ name: "Excelsa Speciality Coffee" }],
  openGraph: {
    title: "Excelsa Speciality Coffee | Doha, Qatar",
    description:
      "Journey of premium coffee from nature to cup. Specialty café and luxury 24/7 event catering in Doha.",
    url: "https://excelsacafe.qa",
    siteName: "Excelsa Speciality Coffee",
    locale: "en_QA",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr" className="scroll-smooth">
      <head>
        <link rel="icon" href="/logos/excelsa-logo-cream.svg" type="image/svg+xml" />
        {/* Schema.org CafeOrCoffeeShop JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "CafeOrCoffeeShop",
              name: "Excelsa Speciality Coffee",
              alternateName: "اكسالسا كافي",
              image: "https://excelsacafe.qa/logos/excelsa-logo-green.svg",
              telephone: "+97451061111",
              email: "hello@excelsacafe.qa",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Al Waab Street, Zone 55",
                addressLocality: "Doha",
                addressRegion: "Doha",
                addressCountry: "QA",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: "25.2650",
                longitude: "51.4600",
              },
              url: "https://excelsacafe.qa",
              priceRange: "QAR 20 - QAR 110",
              servesCuisine: "Specialty Coffee, Artisanal Pastries",
              openingHoursSpecification: [
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: [
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                    "Sunday",
                  ],
                  opens: "07:00",
                  closes: "23:00",
                },
              ],
            }),
          }}
        />
      </head>
      <body className="bg-brand-green text-brand-cream antialiased selection:bg-accent-gold selection:text-brand-green">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
