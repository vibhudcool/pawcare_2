import Link from "next/link";
import { redirect } from "next/navigation";
import { PawPrint } from "lucide-react";
import { Pet } from "@/models/pet.model";
import { requireUser } from "@/lib/session";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { BookingForm } from "@/components/dashboard/booking-form";

export const dynamic = "force-dynamic";

export const metadata = { title: "Book Appointment" };

export default async function NewAppointmentPage({
  searchParams,
}: {
  searchParams: Promise<{ package?: string }>;
}) {
  const user = await requireUser();
  if (!user) redirect("/login");
  const { package: preselect } = await searchParams;

  const pets = await Pet.find({ ownerId: user.id }).sort({ name: 1 });

  if (pets.length === 0) {
    return (
      <EmptyState
        icon={PawPrint}
        title="Add a pet first"
        description="You need at least one pet profile before you can book an appointment."
        action={
          <Button asChild>
            <Link href="/dashboard/pets">Go to My Pets</Link>
          </Button>
        }
      />
    );
  }

  return (
    <BookingForm
      pets={pets.map((p) => ({ id: String(p._id), name: p.name, type: p.type }))}
      initialPackage={preselect}
    />
  );
}
