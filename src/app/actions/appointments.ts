"use server";

import { revalidatePath } from "next/cache";
import { Appointment } from "@/models/appointment.model";
import { Pet } from "@/models/pet.model";
import { appointmentSchema } from "@/lib/validations/appointment";
import { requireUser } from "@/lib/session";
import { toAppointmentDTO } from "@/lib/mappers";
import type { ActionResult, AppointmentDTO } from "@/types";

export async function createAppointment(
  input: unknown
): Promise<ActionResult<AppointmentDTO>> {
  const user = await requireUser();
  if (!user) return { success: false, error: "You must be signed in." };

  const parsed = appointmentSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid appointment details.",
    };
  }

  // Make sure the selected pet belongs to the signed-in user.
  const pet = await Pet.findOne({ _id: parsed.data.petId, ownerId: user.id });
  if (!pet) return { success: false, error: "Please select one of your pets." };

  try {
    const appointment = await Appointment.create({
      ...parsed.data,
      ownerId: user.id,
      status: "pending",
    });
    revalidatePath("/dashboard/appointments");
    return {
      success: true,
      data: toAppointmentDTO(appointment, pet.name),
    };
  } catch {
    return { success: false, error: "Could not book the appointment. Please try again." };
  }
}

export async function cancelAppointment(id: string): Promise<ActionResult> {
  const user = await requireUser();
  if (!user) return { success: false, error: "You must be signed in." };

  try {
    const appointment = await Appointment.findOne({ _id: id, ownerId: user.id });
    if (!appointment) return { success: false, error: "Appointment not found." };

    if (appointment.status === "completed" || appointment.status === "cancelled") {
      return {
        success: false,
        error: "Only pending or confirmed appointments can be cancelled.",
      };
    }

    appointment.status = "cancelled";
    await appointment.save();
    revalidatePath("/dashboard/appointments");
    return { success: true };
  } catch {
    return { success: false, error: "Could not cancel the appointment. Please try again." };
  }
}
