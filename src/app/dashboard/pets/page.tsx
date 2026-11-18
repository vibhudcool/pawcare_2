import { redirect } from "next/navigation";
import { Pet } from "@/models/pet.model";
import { requireUser } from "@/lib/session";
import { toPetDTO } from "@/lib/mappers";
import { PetsClient } from "@/components/dashboard/pets-client";

export const dynamic = "force-dynamic";

export const metadata = { title: "My Pets" };

export default async function PetsPage() {
  const user = await requireUser();
  if (!user) redirect("/login");

  const pets = await Pet.find({ ownerId: user.id }).sort({ createdAt: -1 });

  return <PetsClient pets={pets.map(toPetDTO)} />;
}
