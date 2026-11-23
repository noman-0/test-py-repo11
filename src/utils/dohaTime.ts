import { BRAND_INFO } from "@/data/brandInfo";

export interface StatusResult {
  isOpen: boolean;
  badgeText: string;
  subText: string;
}

export function getDohaCafeStatus(locale: "en" | "ar"): StatusResult {
  const isAr = locale === "ar";
  const { hours } = BRAND_INFO;

  try {
    const now = new Date();
    // Convert to Asia/Qatar time
    const dohaTimeFormatter = new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Qatar",
      hour: "numeric",
      minute: "numeric",
      hour12: false,
    });
    
    const parts = dohaTimeFormatter.formatToParts(now);
    const hour = parseInt(parts.find(p => p.type === "hour")?.value || "0", 10);
    const minute = parseInt(parts.find(p => p.type === "minute")?.value || "0", 10);
    const currentDecimal = hour + minute / 60;

    if (hours.isRamadanSchedule) {
      return {
        isOpen: currentDecimal >= 19.5 || currentDecimal < 2.5,
        badgeText: isAr ? hours.ramadanNotice.ar : hours.ramadanNotice.en,
        subText: isAr ? "مواعيد استثنائية" : "Special Schedule",
      };
    }

    const isOpen = currentDecimal >= hours.standardOpenHour && currentDecimal < hours.standardCloseHour;

    if (isOpen) {
      return {
        isOpen: true,
        badgeText: isAr ? "مفتوح الآن • يغلق 11:00 م" : "Open Now • Closes at 11:00 PM",
        subText: isAr ? "الدوحة، قطر (توقيت الدوحة)" : "Doha, Qatar (AST)",
      };
    } else {
      return {
        isOpen: false,
        badgeText: isAr ? "مغلق الآن • يفتح 7:00 ص" : "Closed • Opens at 7:00 AM",
        subText: isAr ? "الدوحة، قطر (توقيت الدوحة)" : "Doha, Qatar (AST)",
      };
    }
  } catch (e) {
    // Fallback if Intl fails
    return {
      isOpen: true,
      badgeText: isAr ? "مفتوح يومياً • 7 ص - 11 م" : "Daily • 7:00 AM – 11:00 PM",
      subText: isAr ? "الدوحة، قطر" : "Doha, Qatar",
    };
  }
}
