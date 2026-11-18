import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  CalendarCheck2,
  CalendarDays,
  PawPrint,
  Syringe,
} from "lucide-react";
import { Appointment } from "@/models/appointment.model";
import { Pet } from "@/models/pet.model";
import { Vaccination } from "@/models/vaccination.model";
import { getSession } from "@/lib/session";
import { todayString } from "@/lib/serialize";
import { formatDate } from "@/lib/format";
import { StatCard } from "@/components/shared/stat-card";
import { PageHeader } from "@/components/shared/page-header";
import { AppointmentStatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export const metadata = { title: "Overview" };

export default async function DashboardPage() {
  const session = await getSession();
  if (!session?.user) redirect("/login");
  const userId = session.user.id;
  const userName = session.user.name ?? "there";

  const [pets, appointments, vaccinations] = await Promise.all([
    Pet.find({ ownerId: userId }),
    Appointment.find({ ownerId: userId }),
    Vaccination.find({ ownerId: userId }),
  ]);

  const today = todayString();
  const petNames = new Map(pets.map((p) => [String(p._id), p.name]));

  const upcomingAppointments = appointments
    .filter(
      (a) =>
        (a.status === "pending" || a.status === "confirmed") &&
        a.appointmentDate >= today
    )
    .sort((a, b) =>
      `${a.appointmentDate}T${a.timeSlot}`.localeCompare(
        `${b.appointmentDate}T${b.timeSlot}`
      )
    );

  const completedCount = appointments.filter(
    (a) => a.status === "completed"
  ).length;

  const upcomingVaccinations = vaccinations
    .filter((v) => v.nextDueDate >= today)
    .sort((a, b) => a.nextDueDate.localeCompare(b.nextDueDate));

  return (
    <div className="space-y-7">
      <PageHeader
        title="Overview"
        description="Here's what's happening with your pets."
      >
        <Button asChild>
          <Link href="/dashboard/appointments/new">
            <CalendarDays />
            Book Appointment
          </Link>
        </Button>
      </PageHeader>

      {/* Welcome banner */}
      <Card className="relative overflow-hidden border-0 bg-primary text-primary-foreground">
        <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-14 left-1/3 h-48 w-48 rounded-full bg-white/10" />
        <div className="relative flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-xl font-extrabold sm:text-2xl">
              Welcome back, {userName.split(" ")[0]}!
            </h2>
            <p className="mt-1 text-sm text-primary-foreground/85">
              Here&apos;s a quick snapshot of your pet family.
            </p>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/mascot.png"
            alt=""
            className="h-20 w-20 shrink-0 animate-float rounded-full border-4 border-primary-foreground/25 object-cover shadow-lift sm:h-24 sm:w-24"
          />
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={PawPrint} label="Registered pets" value={pets.length} tone="green" />
        <StatCard
          icon={CalendarDays}
          label="Upcoming appointments"
          value={upcomingAppointments.length}
          tone="orange"
        />
        <StatCard
          icon={CalendarCheck2}
          label="Completed appointments"
          value={completedCount}
          tone="blue"
        />
        <StatCard
          icon={Syringe}
          label="Upcoming vaccinations"
          value={upcomingVaccinations.length}
          tone="red"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle>Next appointments</CardTitle>
            <Button asChild variant="link" size="sm">
              <Link href="/dashboard/appointments">
                View all
                <ArrowRight />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingAppointments.length === 0 ? (
              <p className="rounded-xl bg-secondary/60 px-4 py-6 text-center text-sm text-muted-foreground">
                No upcoming appointments. Book one to keep your pet looking
                their best!
              </p>
            ) : (
              upcomingAppointments.slice(0, 3).map((a) => (
                <div
                  key={String(a._id)}
                  className="flex items-center justify-between gap-3 rounded-xl border border-border px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-foreground">
                      {a.serviceName}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {petNames.get(String(a.petId)) ?? "Pet"} ·{" "}
                      {formatDate(a.appointmentDate)} · {a.timeSlot}
                    </p>
                  </div>
                  <AppointmentStatusBadge status={a.status} />
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle>Vaccination reminders</CardTitle>
            <Button asChild variant="link" size="sm">
              <Link href="/dashboard/reminders">
                View all
                <ArrowRight />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingVaccinations.length === 0 ? (
              <p className="rounded-xl bg-secondary/60 px-4 py-6 text-center text-sm text-muted-foreground">
                No upcoming vaccinations. Add a record to stay on schedule.
              </p>
            ) : (
              upcomingVaccinations.slice(0, 3).map((v) => (
                <div
                  key={String(v._id)}
                  className="flex items-center justify-between gap-3 rounded-xl border border-border px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-foreground">
                      {v.vaccineName}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {petNames.get(String(v.petId)) ?? "Pet"} · due{" "}
                      {formatDate(v.nextDueDate)}
                    </p>
                  </div>
                  <Syringe className="h-4 w-4 shrink-0 text-primary" />
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
