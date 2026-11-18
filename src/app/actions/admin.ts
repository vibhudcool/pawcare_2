"use server";

import { revalidatePath } from "next/cache";
import { Appointment } from "@/models/appointment.model";
import { requireAdminUser } from "@/lib/admin";
import type { ActionResult } from "@/types";
import type { AppointmentStatus } from "@/models/appointment.model";

/**
 * Admin-only: move an appointment through its lifecycle
 * (pending → confirmed → completed, or cancelled).
 */
export async function setAppointmentStatus(
  id: string,
  status: AppointmentStatus
): Promise<ActionResult> {
  const admin = await requireAdminUser();
  if (!admin) return { success: false, error: "Only the admin can do this." };

  try {
    const appointment = await Appointment.findOne({ _id: id });
    if (!appointment) return { success: false, error: "Appointment not found." };

    if (appointment.status === "completed" || appointment.status === "cancelled") {
      return {
        success: false,
        error: "Completed or cancelled appointments can't be changed.",
      };
    }

    appointment.status = status;
    await appointment.save();
    revalidatePath("/admin/appointments");
    revalidatePath("/admin");
    return { success: true };
  } catch {
    return { success: false, error: "Could not update the appointment." };
  }
}
