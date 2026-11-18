import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, Cake, PawPrint, Ruler, Syringe, Weight } from "lucide-react";
import { Appointment } from "@/models/appointment.model";
import { Pet } from "@/models/pet.model";
import { Vaccination } from "@/models/vaccination.model";
import { requireUser } from "@/lib/session";
import { formatDate, formatDateShort } from "@/lib/format";
import { GenderBadge } from "@/components/shared/status-badge";
import { AppointmentStatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export const metadata = { title: "Pet details" };

export default async function PetDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireUser();
  if (!user) redirect("/login");

  const pet = await Pet.findOne({ _id: id, ownerId: user.id });
  if (!pet) notFound();

  const [appointments, vaccinations] = await Promise.all([
    Appointment.find({ petId: pet._id, ownerId: user.id }).sort({
      appointmentDate: -1,
    }),
    Vaccination.find({ petId: pet._id, ownerId: user.id }).sort({
      nextDueDate: 1,
    }),
  ]);

  const details = [
    { icon: PawPrint, label: "Type", value: pet.type },
    { icon: Cake, label: "Age", value: pet.age },
    { icon: Weight, label: "Weight", value: pet.weight },
    { icon: Ruler, label: "Breed", value: pet.breed },
  ];

  return (
    <div className="space-y-7">
      <div>
        <Button asChild variant="ghost" size="sm" className="-ml-3 mb-3">
          <Link href="/dashboard/pets">
            <ArrowLeft />
            Back to My Pets
          </Link>
        </Button>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-3xl bg-secondary">
            {pet.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={pet.image}
                alt={pet.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="font-display text-4xl font-extrabold text-primary/40">
                {pet.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-display text-3xl font-extrabold tracking-tight text-foreground">
                {pet.name}
              </h1>
              <GenderBadge gender={pet.gender} />
              <Badge variant="outline">{pet.type}</Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {pet.breed} · added{" "}
              {formatDateShort(new Date(pet.createdAt).toISOString().slice(0, 10))}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {details.map((item) => (
          <Card key={item.label} className="p-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <item.icon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs font-semibold text-muted-foreground">
                  {item.label}
                </p>
                <p className="text-sm font-bold text-foreground">{item.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Appointments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {appointments.length === 0 ? (
              <p className="rounded-xl bg-secondary/60 px-4 py-6 text-center text-sm text-muted-foreground">
                No appointments for {pet.name} yet.
              </p>
            ) : (
              appointments.map((a) => (
                <div
                  key={String(a._id)}
                  className="flex items-center justify-between gap-3 rounded-xl border border-border px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-foreground">
                      {a.serviceName}
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

        <Card>
          <CardHeader>
            <CardTitle>Vaccination records</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {vaccinations.length === 0 ? (
              <p className="rounded-xl bg-secondary/60 px-4 py-6 text-center text-sm text-muted-foreground">
                No vaccination records for {pet.name} yet.
              </p>
            ) : (
              vaccinations.map((v) => (
                <div
                  key={String(v._id)}
                  className="flex items-center justify-between gap-3 rounded-xl border border-border px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-foreground">
                      {v.vaccineName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Given {formatDate(v.vaccinationDate)} · next due{" "}
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
