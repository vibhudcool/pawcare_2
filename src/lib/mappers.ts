import type { PetDoc } from "@/models/pet.model";
import type { AppointmentDoc } from "@/models/appointment.model";
import type { VaccinationDoc } from "@/models/vaccination.model";
import type { AppointmentDTO, PetDTO, VaccinationDTO } from "@/types";

function unwrap(doc: unknown): Record<string, unknown> {
  if (
    doc &&
    typeof doc === "object" &&
    "toObject" in doc &&
    typeof (doc as { toObject?: unknown }).toObject === "function"
  ) {
    return (doc as { toObject: () => Record<string, unknown> }).toObject();
  }
  return doc as Record<string, unknown>;
}

export function toPetDTO(pet: PetDoc): PetDTO {
  const obj = unwrap(pet);
  return {
    id: String(obj._id),
    ownerId: String(obj.ownerId),
    name: obj.name as string,
    type: obj.type as PetDTO["type"],
    breed: obj.breed as string,
    age: obj.age as string,
    gender: obj.gender as PetDTO["gender"],
    weight: obj.weight as string,
    image: (obj.image as string) ?? "",
    createdAt: new Date(obj.createdAt as string).toISOString(),
  };
}

export function toAppointmentDTO(
  appointment: AppointmentDoc,
  petName?: string
): AppointmentDTO {
  const obj = unwrap(appointment);
  return {
    id: String(obj._id),
    ownerId: String(obj.ownerId),
    petId: String(obj.petId),
    petName,
    serviceName: obj.serviceName as string,
    appointmentType: obj.appointmentType as AppointmentDTO["appointmentType"],
    appointmentDate: obj.appointmentDate as string,
    timeSlot: obj.timeSlot as string,
    notes: (obj.notes as string) ?? "",
    status: obj.status as AppointmentDTO["status"],
    createdAt: new Date(obj.createdAt as string).toISOString(),
  };
}

export function toVaccinationDTO(
  vaccination: VaccinationDoc,
  petName?: string
): VaccinationDTO {
  const obj = unwrap(vaccination);
  return {
    id: String(obj._id),
    ownerId: String(obj.ownerId),
    petId: String(obj.petId),
    petName,
    vaccineName: obj.vaccineName as string,
    vaccinationDate: obj.vaccinationDate as string,
    nextDueDate: obj.nextDueDate as string,
    notes: (obj.notes as string) ?? "",
    createdAt: new Date(obj.createdAt as string).toISOString(),
  };
}
