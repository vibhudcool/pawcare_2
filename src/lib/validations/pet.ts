import { z } from "zod";

export const petSchema = z.object({
  name: z
    .string()
    .min(1, "Pet name is required")
    .max(40, "Pet name is too long"),
  type: z.enum(["Dog", "Cat", "Other"], { message: "Please select a pet type" }),
  breed: z.string().min(1, "Breed is required").max(60, "Breed is too long"),
  age: z.string().min(1, "Age is required").max(20, "Age is too long"),
  gender: z.enum(["Male", "Female"], { message: "Please select a gender" }),
  weight: z.string().min(1, "Weight is required").max(20, "Weight is too long"),
  image: z
    .string()
    .url("Please enter a valid image URL")
    .or(z.literal(""))
    .optional()
    .default(""),
});

/** Input type (what the form fields hold) — note `image` is optional here. */
export type PetInput = z.input<typeof petSchema>;
