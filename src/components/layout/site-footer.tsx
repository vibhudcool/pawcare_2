import Link from "next/link";
import {
  Camera,
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Users,
} from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { GROOMING_PACKAGES, SITE_NAV } from "@/lib/constants";

export function SiteFooter() {
  return (
    <footer id="contact" className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Logo />
            <p className="text-sm leading-relaxed text-muted-foreground">
              Gentle grooming and caring vet visits for your furry family
              members — booked in a couple of taps.
            </p>
            <div className="flex gap-2">
              {[
                { icon: Camera, label: "Instagram" },
                { icon: Users, label: "Facebook" },
                { icon: MessageCircle, label: "Twitter" },
              ].map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-foreground">
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-sm">
              {SITE_NAV.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-muted-foreground transition-colors hover:text-primary"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/dashboard"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-foreground">
              Our Services
            </h3>
            <ul className="space-y-2.5 text-sm">
              {GROOMING_PACKAGES.map((pkg) => (
                <li key={pkg.id}>
                  <Link
                    href="/dashboard/services"
                    className="text-muted-foreground transition-colors hover:text-primary"
                  >
                    {pkg.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/dashboard/services"
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  Veterinary Consultation
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-foreground">
              Contact Us
            </h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                123 Pet Street, Model Town, Phagwara, Punjab 144401
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 shrink-0 text-primary" />
                +91 9149366717
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-primary" />
                iamvaibhav1303@gmail.com
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="h-4 w-4 shrink-0 text-primary" />
                Mon – Sat, 9:00 AM – 6:00 PM
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} PawCare. All rights reserved.</p>
          <p>Made with care for happy pets and their humans.</p>
        </div>
      </div>
    </footer>
  );
}
