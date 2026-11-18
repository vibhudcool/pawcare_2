import { redirect } from "next/navigation";
import { Pet } from "@/models/pet.model";
import { Vaccination } from "@/models/vaccination.model";
import { requireUser } from "@/lib/session";
import { todayString } from "@/lib/serialize";
import { toVaccinationDTO } from "@/lib/mappers";
import { RemindersClient } from "@/components/dashboard/reminders-client";

export const dynamic = "force-dynamic";

export const metadata = { title: "Vaccination Reminders" };

export default async function RemindersPage() {
  const user = await requireUser();
  if (!user) redirect("/login");

  const [vaccinations, pets] = await Promise.all([
    Vaccination.find({ ownerId: user.id }),
    Pet.find({ ownerId: user.id }),
  ]);

  const petNames = new Map(pets.map((p) => [String(p._id), p.name]));
  const today = todayString();

  const all = vaccinations
    .map((v) => toVaccinationDTO(v, petNames.get(String(v.petId))))
    .sort((a, b) => a.nextDueDate.localeCompare(b.nextDueDate));

  const overdue = all.filter((v) => v.nextDueDate < today);
  const upcoming = all.filter((v) => v.nextDueDate >= today);

  return (
    <RemindersClient
      overdue={overdue}
      upcoming={upcoming}
      pets={pets.map((p) => ({ id: String(p._id), name: p.name }))}
    />
  );
}
