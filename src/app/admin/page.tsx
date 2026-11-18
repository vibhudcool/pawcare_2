import { redirect } from "next/navigation";
import {
  CalendarCheck2,
  CalendarDays,
  PawPrint,
  Syringe,
  Users,
} from "lucide-react";
import { Appointment } from "@/models/appointment.model";
import { Pet } from "@/models/pet.model";
import { Vaccination } from "@/models/vaccination.model";
import { requireAdminUser } from "@/lib/admin";
import { getDatabase } from "@/lib/db";
import { formatDate } from "@/lib/format";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { AppointmentStatusBadge } from "@/components/shared/status-badge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export const metadata = { title: "Admin overview" };

export default async function AdminOverviewPage() {
  const admin = await requireAdminUser();
  if (!admin) redirect("/dashboard");

  const [userCount, pets, appointments, vaccinationCount] = await Promise.all([
    getDatabase().then((db) => db.collection("user").countDocuments()),
    Pet.find(),
    Appointment.find(),
    Vaccination.countDocuments(),
  ]);

  const petNames = new Map(pets.map((p) => [String(p._id), p.name]));

  const statusCount = (status: string) =>
    appointments.filter((a) => a.status === status).length;

  const recent = [...appointments]
    .sort((a, b) => {
      const aTime = `${a.appointmentDate}T${a.timeSlot}`;
      const bTime = `${b.appointmentDate}T${b.timeSlot}`;
      return bTime.localeCompare(aTime);
    })
    .slice(0, 5);

  return (
    <div className="space-y-7">
      <PageHeader
        title="Admin overview"
        description="Everything happening across PawCare at a glance."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Users} label="Registered users" value={userCount} tone="green" />
        <StatCard icon={PawPrint} label="Pet profiles" value={pets.length} tone="orange" />
        <StatCard
          icon={CalendarDays}
          label="Total appointments"
          value={appointments.length}
          tone="blue"
        />
        <StatCard
          icon={Syringe}
          label="Vaccination records"
          value={vaccinationCount}
          tone="red"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge variant="warning">Pending · {statusCount("pending")}</Badge>
        <Badge variant="default">Confirmed · {statusCount("confirmed")}</Badge>
        <Badge variant="success">Completed · {statusCount("completed")}</Badge>
        <Badge variant="destructive">Cancelled · {statusCount("cancelled")}</Badge>
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle>Latest appointments</CardTitle>
          <CalendarCheck2 className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent className="space-y-3">
          {recent.length === 0 ? (
            <p className="rounded-xl bg-secondary/60 px-4 py-6 text-center text-sm text-muted-foreground">
              No appointments have been booked yet.
            </p>
          ) : (
            recent.map((a) => (
              <div
                key={String(a._id)}
                className="flex items-center justify-between gap-3 rounded-xl border border-border px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-foreground">
                    {petNames.get(String(a.petId)) ?? "Pet"} · {a.serviceName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(a.appointmentDate)} · {a.timeSlot}
                  </p>
                </div>
                <AppointmentStatusBadge status={a.status} />
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
