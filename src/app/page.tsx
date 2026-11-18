import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  CalendarCheck2,
  CalendarClock,
  CalendarDays,
  HeartHandshake,
  Leaf,
  PawPrint,
  Scissors,
  Sparkles,
  Star,
  Syringe,
  UserPlus,
} from "lucide-react";
import { SiteNavbar } from "@/components/layout/site-navbar";
import { SiteFooter } from "@/components/layout/site-footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GROOMING_PACKAGES } from "@/lib/constants";
import { Reveal } from "@/components/shared/reveal";
import { Counter } from "@/components/shared/counter";
import { cn } from "@/lib/utils";

const stats: {
  value: number;
  suffix: string;
  label: string;
  decimals?: number;
}[] = [
  { value: 2000, suffix: "+", label: "Pets groomed" },
  { value: 15, suffix: "+", label: "Expert groomers" },
  { value: 4.9, suffix: "/5", label: "Average rating", decimals: 1 },
  { value: 98, suffix: "%", label: "On-time arrivals" },
];

const marqueeItems = [
  "Bathing",
  "Hair trimming",
  "Nail clipping",
  "Ear cleaning",
  "De-shedding",
  "Spa care",
  "Vet check-ups",
  "Vaccination",
];

const steps = [
  {
    icon: UserPlus,
    title: "Create your pet profile",
    description:
      "Add your pet's name, breed, age and photo in under a minute.",
  },
  {
    icon: CalendarCheck2,
    title: "Pick a package & time",
    description:
      "Choose a grooming package or a vet visit, then reserve a slot that suits you.",
  },
  {
    icon: Sparkles,
    title: "We care, you relax",
    description:
      "Our certified groomers treat your pet like family while you track everything from your dashboard.",
  },
];

const features = [
  {
    icon: BadgeCheck,
    title: "Certified groomers",
    description: "Every groomer is trained, background-verified and pet-first.",
  },
  {
    icon: Leaf,
    title: "Gentle, pet-safe products",
    description: "Hypoallergenic shampoos and skin-friendly tools for every coat.",
  },
  {
    icon: CalendarClock,
    title: "Easy rescheduling",
    description: "Plans change — cancel or move a booking with a couple of taps.",
  },
  {
    icon: HeartHandshake,
    title: "Vet-backed care",
    description: "Routine health check-ups with certified veterinarians.",
  },
];

const testimonials = [
  {
    quote:
      "Rocky used to hate grooming, but the PawCare team made it a spa day. He comes home happy, fluffy and smelling amazing every single time.",
    name: "Priya Sharma",
    pet: "Golden Retriever · Rocky",
    initial: "P",
  },
  {
    quote:
      "Booking a vet visit used to mean phone calls and waiting. Now I pick a slot, get a reminder, and we're done. The vaccination reminders are a lifesaver.",
    name: "Arjun Mehta",
    pet: "Beagle · Cookie",
    initial: "A",
  },
  {
    quote:
      "The premium package is worth every rupee — haircut, nail trimming, ear cleaning, everything. The dashboard keeps all of Miso's records in one place.",
    name: "Simran Kaur",
    pet: "Persian Cat · Miso",
    initial: "S",
  },
];

function Stars() {
  return (
    <div className="flex gap-0.5 text-amber-400">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className="h-4 w-4 fill-current" />
      ))}
    </div>
  );
}

/** Hand-drawn style squiggle used under the hero headline. */
function Squiggle({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 220 14"
      fill="none"
      className={className}
      aria-hidden="true"
      preserveAspectRatio="none"
    >
      <path
        d="M3 10.5C30 4.5 55 3.5 82 6.5C109 9.5 132 11 158 7.5C181 4.5 200 4 217 6.5"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteNavbar />

      <main className="flex-1">
        {/* ------------------------------------------------ Hero */}
        <section id="home" className="relative overflow-hidden bg-dots">
          <div className="pointer-events-none absolute -left-32 top-8 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
          <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />

          <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-4 pb-20 pt-12 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:pb-28 lg:pt-20">
            <div className="space-y-8">
              <Reveal>
                <span className="inline-flex -rotate-1 items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary shadow-soft">
                  <PawPrint className="h-3.5 w-3.5" />
                  Now caring for 2,000+ happy pets
                </span>
              </Reveal>

              <Reveal delay={80}>
                <h1 className="text-balance font-display text-5xl font-extrabold leading-[1.02] text-foreground sm:text-6xl lg:text-[4.2rem]">
                  Because your pets deserve the{" "}
                  <span className="relative inline-block text-primary">
                    best care
                    <Squiggle className="absolute -bottom-2 left-0 w-full text-accent" />
                  </span>
                  .
                </h1>
              </Reveal>

              <Reveal delay={160}>
                <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
                  PawCare makes it easy to book grooming sessions and vet
                  visits, keep your pet&apos;s profile handy, and never miss a
                  vaccination — all from one friendly dashboard.
                </p>
              </Reveal>

              <Reveal delay={240}>
                <div className="flex flex-wrap items-center gap-3">
                  <Button asChild size="lg" className="px-7">
                    <Link href="/dashboard/appointments/new">
                      <CalendarDays />
                      Book an Appointment
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="px-7">
                    <Link href="#services">
                      Explore Services
                      <ArrowRight />
                    </Link>
                  </Button>
                </div>
              </Reveal>

              <Reveal delay={320}>
                <div className="flex flex-wrap items-center gap-4 pt-1">
                  <div className="flex -space-x-2.5">
                    {["P", "A", "S", "R"].map((initial, i) => (
                      <span
                        key={initial + i}
                        className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-background bg-secondary font-display text-xs font-extrabold text-secondary-foreground"
                      >
                        {initial}
                      </span>
                    ))}
                  </div>
                  <div>
                    <Stars />
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      <span className="font-bold text-foreground">4.9/5</span>{" "}
                      from 800+ happy reviews
                    </p>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Mascot artwork */}
            <Reveal delay={200} className="relative">
              <div className="relative mx-auto max-w-md">
                <div className="absolute -inset-3 rounded-t-full rounded-b-[3rem] bg-primary/10" />
                <div className="relative overflow-hidden rounded-t-full rounded-b-[3rem] border-2 border-foreground/10 bg-secondary shadow-lift">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/mascot.png"
                    alt="The PawCare mascot — a happy corgi"
                    className="w-full object-cover"
                  />
                </div>

                <div className="absolute -left-5 top-16 animate-float rounded-2xl border border-border bg-card p-3.5 shadow-lift sm:-left-8">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <CalendarDays className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-[11px] font-semibold text-muted-foreground">
                        Next slot
                      </p>
                      <p className="text-sm font-bold text-foreground">
                        Today, 4:00 PM
                      </p>
                    </div>
                  </div>
                </div>

                <div className="absolute -right-4 bottom-24 animate-float-delayed rounded-2xl border border-border bg-card p-3.5 shadow-lift sm:-right-8">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/10 text-accent">
                      <Syringe className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-[11px] font-semibold text-muted-foreground">
                        Vaccination
                      </p>
                      <p className="text-sm font-bold text-foreground">
                        Reminder saved
                      </p>
                    </div>
                  </div>
                </div>

                <div className="absolute -top-5 right-8 flex h-20 w-20 animate-spin-slow items-center justify-center rounded-full border-4 border-background bg-accent text-accent-foreground shadow-lift">
                  <PawPrint className="h-8 w-8" />
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ------------------------------------------------ Marquee */}
        <section className="overflow-hidden border-y border-border bg-accent py-3.5">
          <div className="flex w-max animate-marquee gap-10 whitespace-nowrap">
            {[...marqueeItems, ...marqueeItems].map((item, i) => (
              <span
                key={`${item}-${i}`}
                className="flex items-center gap-10 text-sm font-extrabold uppercase tracking-[0.22em] text-accent-foreground"
              >
                {item}
                <PawPrint className="h-4 w-4" />
              </span>
            ))}
          </div>
        </section>

        {/* ------------------------------------------------ Stats */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <Reveal>
            <div className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-border bg-border lg:grid-cols-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="bg-card p-7 text-center transition-colors hover:bg-secondary/50 sm:p-8"
                >
                  <p className="font-display text-3xl font-extrabold text-primary sm:text-4xl">
                    <Counter
                      value={stat.value}
                      suffix={stat.suffix}
                      decimals={stat.decimals ?? 0}
                    />
                  </p>
                  <p className="mt-1.5 text-sm font-semibold text-muted-foreground">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </section>

        {/* ------------------------------------------------ Services */}
        <section
          id="services"
          className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"
        >
          <Reveal>
            <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-2xl">
                <p className="mb-3 text-sm font-bold uppercase tracking-widest text-primary">
                  Our Services
                </p>
                <h2 className="font-display text-3xl font-extrabold text-foreground sm:text-4xl">
                  Popular grooming services
                </h2>
                <p className="mt-3 text-lg text-muted-foreground">
                  Transparent pricing, gentle products and certified groomers
                  for dogs, cats and everything in between.
                </p>
              </div>
              <Button asChild variant="outline" className="shrink-0">
                <Link href="/dashboard/services">
                  View all packages
                  <ArrowUpRight />
                </Link>
              </Button>
            </div>
          </Reveal>

          <div className="grid gap-6 md:grid-cols-3">
            {GROOMING_PACKAGES.map((pkg, i) => (
              <Reveal key={pkg.id} delay={i * 120}>
                <div className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:rotate-[-0.4deg] hover:shadow-lift">
                  {pkg.popular && (
                    <span className="absolute right-4 top-4 z-10 -rotate-3 rounded-full bg-accent px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-accent-foreground shadow-soft">
                      Most popular
                    </span>
                  )}
                  <div className="relative h-48 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={pkg.image}
                      alt={pkg.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <div className="mb-2 flex items-center justify-between">
                      <h3 className="font-display text-xl font-bold text-foreground">
                        {pkg.name}
                      </h3>
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                        <pkg.icon className="h-5 w-5" />
                      </span>
                    </div>
                    <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
                      {pkg.description}
                    </p>
                    <ul className="mt-4 space-y-2">
                      {pkg.services.map((service) => (
                        <li
                          key={service}
                          className="flex items-start gap-2 text-sm text-foreground"
                        >
                          <span className="mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <PawPrint className="h-2.5 w-2.5" />
                          </span>
                          {service}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                      <p className="font-display text-2xl font-extrabold text-foreground">
                        ₹{pkg.price}
                        <span className="ml-1 text-xs font-semibold text-muted-foreground">
                          {pkg.duration}
                        </span>
                      </p>
                      <Button asChild variant="outline" size="sm">
                        <Link href="/dashboard/services">
                          Book now
                          <ArrowUpRight />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ------------------------------------------------ How it works */}
        <section
          id="how"
          className="relative border-y border-border bg-card/50 py-20"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <div className="mb-14 text-center">
                <p className="mb-3 text-sm font-bold uppercase tracking-widest text-primary">
                  How PawCare Works
                </p>
                <h2 className="font-display text-3xl font-extrabold text-foreground sm:text-4xl">
                  Three simple steps to a happier pet
                </h2>
              </div>
            </Reveal>

            <div className="relative grid gap-10 md:grid-cols-3">
              <div className="absolute left-[16%] right-[16%] top-8 hidden border-t-2 border-dashed border-border md:block" />
              {steps.map((step, index) => (
                <Reveal key={step.title} delay={index * 140} className="relative text-center">
                  <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-soft ring-8 ring-card">
                    <step.icon className="h-7 w-7" />
                  </div>
                  <span className="mb-3 inline-block rounded-full bg-secondary px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-widest text-secondary-foreground">
                    Step {index + 1}
                  </span>
                  <h3 className="font-display text-lg font-bold text-foreground">
                    {step.title}
                  </h3>
                  <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ------------------------------------------------ Why choose us (bento) */}
        <section
          id="about"
          className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8"
        >
          <div className="grid gap-6 lg:grid-cols-3">
            <Reveal className="lg:row-span-2">
              <div className="flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-border bg-secondary/60 p-8 shadow-soft">
                <div>
                  <p className="mb-3 text-sm font-bold uppercase tracking-widest text-primary">
                    Why PawCare
                  </p>
                  <h2 className="font-display text-3xl font-extrabold text-foreground">
                    Grooming that feels like home
                  </h2>
                  <p className="mt-4 leading-relaxed text-muted-foreground">
                    We started PawCare because every pet deserves care that
                    feels like home. From the first bath to every vaccination
                    after, we keep things simple, gentle and transparent.
                  </p>
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/illustration-care.png"
                  alt="A dog and a cat enjoying a grooming session"
                  className="mt-8 w-full rounded-2xl border border-border bg-card object-cover shadow-soft transition-transform duration-500 hover:scale-[1.02]"
                />
              </div>
            </Reveal>

            {features.map((feature, i) => (
              <Reveal key={feature.title} delay={i * 110}>
                <div className="group h-full rounded-3xl border border-border bg-card p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lift">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <feature.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 font-display text-base font-bold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ------------------------------------------------ Testimonials */}
        <section
          id="testimonials"
          className="border-y border-border bg-card/50 py-20"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <div className="mb-12 text-center">
                <p className="mb-3 text-sm font-bold uppercase tracking-widest text-primary">
                  Testimonials
                </p>
                <h2 className="font-display text-3xl font-extrabold text-foreground sm:text-4xl">
                  Loved by pets & their humans
                </h2>
              </div>
            </Reveal>

            <div className="grid gap-6 md:grid-cols-3">
              {testimonials.map((t, i) => (
                <Reveal key={t.name} delay={i * 120}>
                  <figure
                    className={cn(
                      "flex h-full flex-col rounded-3xl border border-border bg-card p-6 shadow-soft transition-all duration-300 hover:rotate-0 hover:shadow-lift",
                      i % 2 === 0 ? "md:-rotate-1" : "md:rotate-1"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <Stars />
                      <span className="font-display text-4xl font-extrabold leading-none text-secondary">
                        &rdquo;
                      </span>
                    </div>
                    <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-foreground">
                      {t.quote}
                    </blockquote>
                    <figcaption className="mt-5 flex items-center gap-3 border-t border-border pt-4">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-display text-sm font-extrabold text-primary">
                        {t.initial}
                      </span>
                      <div>
                        <p className="text-sm font-bold text-foreground">
                          {t.name}
                        </p>
                        <p className="text-xs text-muted-foreground">{t.pet}</p>
                      </div>
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ------------------------------------------------ CTA */}
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <Reveal>
            <div className="relative overflow-hidden rounded-[2.5rem] bg-primary px-6 py-16 text-center shadow-lift sm:px-12">
              <div className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full bg-white/10" />
              <div className="pointer-events-none absolute -bottom-20 -right-10 h-64 w-64 rounded-full bg-white/10" />
              <div className="pointer-events-none absolute inset-0 bg-dots opacity-30" />
              <div className="relative mx-auto max-w-2xl space-y-6">
                <h2 className="text-balance font-display text-3xl font-extrabold text-primary-foreground sm:text-5xl">
                  Ready to pamper your pet?
                </h2>
                <p className="text-lg leading-relaxed text-primary-foreground/85">
                  Create your free account today and book your first grooming
                  session in minutes.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <Button asChild size="lg" variant="accent" className="px-7">
                    <Link href="/register">
                      Get Started Free
                      <ArrowRight />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    className="border border-primary-foreground/30 bg-transparent px-7 text-primary-foreground hover:bg-primary-foreground/10"
                  >
                    <Link href="/login">Sign in</Link>
                  </Button>
                </div>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/mascot.png"
                alt=""
                className="pointer-events-none absolute -bottom-6 right-8 hidden h-36 w-36 animate-float rounded-full border-4 border-primary-foreground/25 object-cover shadow-lift lg:block"
              />
            </div>
          </Reveal>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
