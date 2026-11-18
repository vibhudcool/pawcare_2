import { redirect } from "next/navigation";
import { Appointment } from "@/models/appointment.model";
import { Pet } from "@/models/pet.model";
import { requireUser } from "@/lib/session";
import { todayString } from "@/lib/serialize";
import { toAppointmentDTO } from "@/lib/mappers";
import { AppointmentsClient } from "@/components/dashboard/appointments-client";

export const dynamic = "force-dynamic";

export const metadata = { title: "Appointments" };

export default async function AppointmentsPage() {
  const user = await requireUser();
  if (!user) redirect("/login");

  const [appointments, pets] = await Promise.all([
    Appointment.find({ ownerId: user.id }).sort({ appointmentDate: -1 }),
    Pet.find({ ownerId: user.id }),
  ]);

  const petNames = new Map(pets.map((p) => [String(p._id), p.name]));
  const today = todayString();

  const all = appointments.map((a) =>
    toAppointmentDTO(a, petNames.get(String(a.petId)))
  );

  const upcoming = all
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

  const others = all.filter((a) => !upcoming.includes(a));

  return <AppointmentsClient upcoming={upcoming} others={others} />;
}
