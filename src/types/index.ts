export type PetType = "Dog" | "Cat" | "Other";
export type PetGender = "Male" | "Female";

export interface PetDTO {
  id: string;
  ownerId: string;
  name: string;
  type: PetType;
  breed: string;
  age: string;
  gender: PetGender;
  weight: string;
  image: string;
  createdAt: string;
}

export interface AppointmentDTO {
  id: string;
  ownerId: string;
  petId: string;
  petName?: string;
  serviceName: string;
  appointmentType: "grooming" | "veterinary";
  appointmentDate: string;
  timeSlot: string;
  notes: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  createdAt: string;
}

export interface VaccinationDTO {
  id: string;
  ownerId: string;
  petId: string;
  petName?: string;
  vaccineName: string;
  vaccinationDate: string;
  nextDueDate: string;
  notes: string;
  createdAt: string;
}

export interface SessionUserDTO {
  id: string;
  name: string;
  email: string;
  image: string;
  emailVerified: boolean;
  createdAt: string;
}

/** Standard result shape returned by server actions to client forms. */
export type ActionResult<T = unknown> =
  | { success: true; data?: T }
  | { success: false; error: string };
