import { redirect } from "next/navigation";
import { Appointment } from "@/models/appointment.model";
import { Pet } from "@/models/pet.model";
import { requireAdminUser } from "@/lib/admin";
import { getDatabase } from "@/lib/db";
import { toAppointmentDTO } from "@/lib/mappers";
import { AdminAppointmentsClient } from "@/components/admin/admin-appointments-client";

export const dynamic = "force-dynamic";

export const metadata = { title: "Appointments · Admin" };

export default async function AdminAppointmentsPage() {
  const admin = await requireAdminUser();
  if (!admin) redirect("/dashboard");

  const db = await getDatabase();

  const [appointments, pets, users] = await Promise.all([
    Appointment.find().sort({ createdAt: -1 }),
    Pet.find(),
    db
      .collection("user")
      .find({}, { projection: { email: 1, name: 1 } })
      .toArray(),
  ]);

  const petNames = new Map(pets.map((p) => [String(p._id), p.name]));
  const userEmails = new Map(users.map((u) => [String(u._id), u.email]));

  const rows = appointments.map((a) => ({
    ...toAppointmentDTO(a, petNames.get(String(a.petId))),
    ownerEmail: userEmails.get(String(a.ownerId)) ?? "—",
  }));

  return <AdminAppointmentsClient rows={rows} />;
}
