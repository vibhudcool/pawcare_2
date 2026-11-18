"use server";

import { revalidatePath } from "next/cache";
import { Vaccination } from "@/models/vaccination.model";
import { vaccinationFormSchema } from "@/lib/validations/vaccination";
import { requireUser } from "@/lib/session";
import { toVaccinationDTO } from "@/lib/mappers";
import type { ActionResult, VaccinationDTO } from "@/types";

export async function createVaccination(
  input: unknown
): Promise<ActionResult<VaccinationDTO>> {
  const user = await requireUser();
  if (!user) return { success: false, error: "You must be signed in." };

  const parsed = vaccinationFormSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid vaccination details.",
    };
  }

  try {
    const vaccination = await Vaccination.create({
      ...parsed.data,
      ownerId: user.id,
    });
    revalidatePath("/dashboard/reminders");
    return { success: true, data: toVaccinationDTO(vaccination) };
  } catch {
    return { success: false, error: "Could not save the record. Please try again." };
  }
}

export async function updateVaccination(
  id: string,
  input: unknown
): Promise<ActionResult<VaccinationDTO>> {
  const user = await requireUser();
  if (!user) return { success: false, error: "You must be signed in." };

  const parsed = vaccinationFormSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid vaccination details.",
    };
  }

  try {
    const vaccination = await Vaccination.findOneAndUpdate(
      { _id: id, ownerId: user.id },
      parsed.data,
      { new: true }
    );
    if (!vaccination) return { success: false, error: "Record not found." };
    revalidatePath("/dashboard/reminders");
    return { success: true, data: toVaccinationDTO(vaccination) };
  } catch {
    return { success: false, error: "Could not update the record. Please try again." };
  }
}

export async function deleteVaccination(id: string): Promise<ActionResult> {
  const user = await requireUser();
  if (!user) return { success: false, error: "You must be signed in." };

  try {
    const deleted = await Vaccination.findOneAndDelete({ _id: id, ownerId: user.id });
    if (!deleted) return { success: false, error: "Record not found." };
    revalidatePath("/dashboard/reminders");
    return { success: true };
  } catch {
    return { success: false, error: "Could not delete the record. Please try again." };
  }
}
