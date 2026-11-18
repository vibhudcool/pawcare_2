"use server";

import { revalidatePath } from "next/cache";
import { Pet } from "@/models/pet.model";
import { petSchema } from "@/lib/validations/pet";
import { requireUser } from "@/lib/session";
import { toPetDTO } from "@/lib/mappers";
import type { ActionResult, PetDTO } from "@/types";

export async function createPet(input: unknown): Promise<ActionResult<PetDTO>> {
  const user = await requireUser();
  if (!user) return { success: false, error: "You must be signed in." };

  const parsed = petSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid pet details." };
  }

  try {
    const pet = await Pet.create({ ...parsed.data, ownerId: user.id });
    revalidatePath("/dashboard/pets");
    return { success: true, data: toPetDTO(pet) };
  } catch {
    return { success: false, error: "Could not save the pet. Please try again." };
  }
}

export async function updatePet(
  id: string,
  input: unknown
): Promise<ActionResult<PetDTO>> {
  const user = await requireUser();
  if (!user) return { success: false, error: "You must be signed in." };

  const parsed = petSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid pet details." };
  }

  try {
    // Ownership check: the query only matches pets owned by the current user.
    const pet = await Pet.findOneAndUpdate(
      { _id: id, ownerId: user.id },
      parsed.data,
      { new: true }
    );
    if (!pet) return { success: false, error: "Pet not found." };
    revalidatePath("/dashboard/pets");
    return { success: true, data: toPetDTO(pet) };
  } catch {
    return { success: false, error: "Could not update the pet. Please try again." };
  }
}

export async function deletePet(id: string): Promise<ActionResult> {
  const user = await requireUser();
  if (!user) return { success: false, error: "You must be signed in." };

  try {
    const deleted = await Pet.findOneAndDelete({ _id: id, ownerId: user.id });
    if (!deleted) return { success: false, error: "Pet not found." };
    revalidatePath("/dashboard/pets");
    return { success: true };
  } catch {
    return { success: false, error: "Could not delete the pet. Please try again." };
  }
}
