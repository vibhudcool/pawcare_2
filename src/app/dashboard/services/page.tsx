import Link from "next/link";
import { Check, Clock } from "lucide-react";
import { GROOMING_PACKAGES, VETERINARY_SERVICE } from "@/lib/constants";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata = { title: "Grooming Services" };

export default function ServicesPage() {
  return (
    <div className="space-y-7">
      <PageHeader
        title="Grooming Services"
        description="Pick a package and choose a time that suits you — we'll take care of the rest."
      />

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {GROOMING_PACKAGES.map((pkg) => (
          <Card
            key={pkg.id}
            className="flex flex-col overflow-hidden transition-shadow hover:shadow-lift"
          >
            <div className="relative h-44">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={pkg.image}
                alt={pkg.name}
                className="h-full w-full object-cover"
              />
              {pkg.popular && (
                <div className="absolute left-3 top-3">
                  <Badge className="border-transparent bg-accent text-accent-foreground">
                    Most popular
                  </Badge>
                </div>
              )}
            </div>
            <CardHeader>
              <div className="flex items-center justify-between gap-2">
                <CardTitle>{pkg.name}</CardTitle>
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <pkg.icon className="h-5 w-5" />
                </span>
              </div>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
              <p className="text-sm leading-relaxed text-muted-foreground">
                {pkg.description}
              </p>
              <ul className="space-y-2">
                {pkg.services.map((service) => (
                  <li
                    key={service}
                    className="flex items-start gap-2 text-sm text-foreground"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {service}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="flex items-center justify-between border-t border-border pt-4">
              <div>
                <p className="font-display text-2xl font-extrabold text-foreground">
                  ₹{pkg.price}
                </p>
                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  {pkg.duration}
                </p>
              </div>
              <Button asChild>
                <Link href={`/dashboard/appointments/new?package=${pkg.id}`}>
                  Book Appointment
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Card className="flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <VETERINARY_SERVICE.icon className="h-6 w-6" />
          </span>
          <div>
            <h3 className="font-display text-lg font-bold text-foreground">
              {VETERINARY_SERVICE.name} — ₹{VETERINARY_SERVICE.price}
            </h3>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {VETERINARY_SERVICE.description}
            </p>
          </div>
        </div>
        <Button asChild variant="outline">
          <Link href="/dashboard/appointments/new?package=veterinary">
            Book a vet visit
          </Link>
        </Button>
      </Card>
    </div>
  );
}
