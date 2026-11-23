export type CategoryType = 'all' | 'espresso' | 'pour-over' | 'cold-brew' | 'pastries' | 'beans';

export interface MenuItem {
  id: string;
  name: {
    en: string;
    ar: string;
  };
  description: {
    en: string;
    ar: string;
  };
  category: 'espresso' | 'pour-over' | 'cold-brew' | 'pastries' | 'beans';
  priceQAR: number;
  tastingNotes?: {
    en: string[];
    ar: string[];
  };
  origin?: {
    en: string;
    ar: string;
  };
  altitude?: string;
  process?: {
    en: string;
    ar: string;
  };
  roastLevel?: {
    en: string;
    ar: string;
  };
  dietaryTags?: ('vegan' | 'oat-available' | 'almond-available' | 'gluten-free' | 'sugar-free')[];
  availableForCatering: boolean;
  isAvailable: boolean;
  image: string;
}

export interface CateringPackage {
  id: string;
  title: {
    en: string;
    ar: string;
  };
  type: 'box' | 'crate' | 'live-bar' | 'pastry-platter';
  capacity: {
    en: string;
    ar: string;
  };
  cupsEstimate: number;
  priceQAR: number;
  description: {
    en: string;
    ar: string;
  };
  includedItems: {
    en: string[];
    ar: string[];
  };
}

export interface CateringInquiry {
  fullName: string;
  phoneNumber: string;
  email?: string;
  eventType: 'home-majlis' | 'corporate' | 'live-barista-station';
  eventDate: string;
  eventTime: string;
  guestCount: number;
  selectedPackages: {
    packageId: string;
    packageName: string;
    quantity: number;
    unitPriceQAR: number;
  }[];
  dohaNeighborhood: string;
  specialRequests?: string;
}

export interface CafeSchedule {
  standardOpenHour: number;
  standardCloseHour: number;
  isRamadanOverride?: boolean;
  overrideNotice?: {
    en: string;
    ar: string;
  };
}
