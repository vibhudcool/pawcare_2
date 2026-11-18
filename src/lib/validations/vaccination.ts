import { z } from "zod";

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

export const vaccinationFormSchema = z
  .object({
    petId: z.string().min(1, "Please select a pet"),
    vaccineName: z
      .string()
      .min(1, "Vaccine name is required")
      .max(80, "Vaccine name is too long"),
    vaccinationDate: z
      .string()
      .regex(dateRegex, "Please pick a valid vaccination date"),
    nextDueDate: z.string().regex(dateRegex, "Please pick a valid next due date"),
    notes: z.string().max(300, "Notes are too long").optional().default(""),
  })
  .refine((data) => data.nextDueDate >= data.vaccinationDate, {
    path: ["nextDueDate"],
    message: "Next due date must be on or after the vaccination date",
  });

export type VaccinationInput = z.input<typeof vaccinationFormSchema>;
