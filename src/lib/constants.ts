import {
  Bath,
  CalendarDays,
  LayoutDashboard,
  PawPrint,
  Scissors,
  Sparkles,
  Stethoscope,
  Syringe,
  UserRound,
  type LucideIcon,
} from "lucide-react";

export interface GroomingPackage {
  id: string;
  name: string;
  price: number;
  duration: string;
  description: string;
  services: string[];
  image: string;
  icon: LucideIcon;
  popular?: boolean;
}

export const GROOMING_PACKAGES: GroomingPackage[] = [
  {
    id: "basic",
    name: "Basic Grooming",
    price: 499,
    duration: "≈ 45 min",
    description:
      "A refreshing clean-up that keeps your pet fresh, tidy and smelling great.",
    image: "/images/service-basic.jpg",
    icon: Bath,
    services: [
      "Bathing with gentle pet shampoo",
      "Shampoo cleaning & thorough rinse",
      "Basic brushing & de-shedding",
    ],
  },
  {
    id: "premium",
    name: "Premium Grooming",
    price: 999,
    duration: "≈ 90 min",
    popular: true,
    description:
      "A full styling session for pets who love to look — and feel — their best.",
    image: "/images/service-premium.jpg",
    icon: Scissors,
    services: [
      "Everything in Basic Grooming",
      "Breed-specific hair trimming",
      "Nail clipping & filing",
      "Ear cleaning & plucking",
    ],
  },
  {
    id: "complete",
    name: "Complete Pet Care",
    price: 1799,
    duration: "≈ 2 hours",
    description:
      "Our most complete package — full grooming, hygiene care and extra TLC in one visit.",
    image: "/images/service-complete.jpg",
    icon: Sparkles,
    services: [
      "Everything in Premium Grooming",
      "Full grooming session",
      "Additional hygiene care (teeth & eyes)",
      "Relaxing spa finish",
    ],
  },
];

export const VETERINARY_SERVICE = {
  id: "veterinary",
  name: "Veterinary Consultation",
  price: 499,
  duration: "≈ 30 min",
  icon: Stethoscope,
  description:
    "A routine health check-up for your pet with a certified veterinarian.",
};

export const TIME_SLOTS = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
];

export const DASHBOARD_NAV: { href: string; label: string; icon: LucideIcon }[] =
  [
    { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/pets", label: "My Pets", icon: PawPrint },
    { href: "/dashboard/services", label: "Grooming Services", icon: Scissors },
    { href: "/dashboard/appointments", label: "Appointments", icon: CalendarDays },
    { href: "/dashboard/reminders", label: "Vaccination Reminders", icon: Syringe },
    { href: "/dashboard/profile", label: "Profile", icon: UserRound },
  ];

export const SITE_NAV: { href: string; label: string }[] = [
  { href: "/#home", label: "Home" },
  { href: "/#services", label: "Services" },
  { href: "/#about", label: "About Us" },
  { href: "/#contact", label: "Contact" },
];
