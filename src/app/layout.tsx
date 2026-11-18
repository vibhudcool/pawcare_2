import type { Metadata } from "next";
import { Inter, Nunito } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: {
    default: "PawCare – Pet Grooming & Care",
    template: "%s · PawCare",
  },
  description:
    "Book grooming sessions and veterinary visits, manage your pet's profile and never miss a vaccination — all in one place.",
};

/**
 * Applies the saved (or system) colour theme before first paint so the
 * page never flashes the wrong theme.
 */
const themeScript = `
try {
  var t = localStorage.getItem("pawcare-theme");
  if (t === "dark" || (!t && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
    document.documentElement.classList.add("dark");
  }
} catch (e) {}
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${nunito.variable}`}
      suppressHydrationWarning
    >
      <body className="flex min-h-screen flex-col">
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        {children}
        <Toaster richColors closeButton />
      </body>
    </html>
  );
}
