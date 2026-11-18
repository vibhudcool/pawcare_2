import { z } from "zod";
import { todayString } from "../serialize";

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

export const appointmentSchema = z.object({
  petId: z.string().min(1, "Please select a pet"),
  serviceName: z.string().min(1, "Please select a service"),
  appointmentType: z.enum(["grooming", "veterinary"], {
    message: "Please select an appointment type",
  }),
  appointmentDate: z
    .string()
    .regex(dateRegex, "Please pick a valid date")
    .refine((date) => date >= todayString(), {
      message: "Appointment date cannot be in the past",
    }),
  timeSlot: z.string().min(1, "Please select a time slot"),
  notes: z.string().max(500, "Notes are too long").optional().default(""),
});

export type AppointmentInput = z.infer<typeof appointmentSchema>;

/**
 * Schema for the booking form (the UI sends a package id instead of the
 * final service name/type, which are derived on submit).
 */
export const bookingFormSchema = z.object({
  petId: z.string().min(1, "Please select a pet"),
  packageId: z.string().min(1, "Please select a service"),
  appointmentDate: z
    .string()
    .regex(dateRegex, "Please pick a valid date")
    .refine((date) => date >= todayString(), {
      message: "Appointment date cannot be in the past",
    }),
  timeSlot: z.string().min(1, "Please select a time slot"),
  notes: z.string().max(500, "Notes are too long").optional().default(""),
});

export type BookingFormInput = z.input<typeof bookingFormSchema>;
