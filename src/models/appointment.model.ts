import mongoose, { Schema, model, models } from "mongoose";

export const APPOINTMENT_STATUSES = [
  "pending",
  "confirmed",
  "completed",
  "cancelled",
] as const;

export type AppointmentStatus = (typeof APPOINTMENT_STATUSES)[number];

const appointmentSchema = new Schema(
  {
    ownerId: { type: String, required: true, index: true },
    petId: { type: String, required: true, index: true },
    serviceName: { type: String, required: true, trim: true, maxlength: 120 },
    appointmentType: {
      type: String,
      enum: ["grooming", "veterinary"],
      required: true,
    },
    // Stored as YYYY-MM-DD (local date) to avoid timezone surprises.
    appointmentDate: { type: String, required: true },
    timeSlot: { type: String, required: true },
    notes: { type: String, default: "", maxlength: 500 },
    status: {
      type: String,
      enum: APPOINTMENT_STATUSES,
      default: "pending",
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export interface AppointmentDoc {
  _id: mongoose.Types.ObjectId;
  ownerId: string;
  petId: string;
  serviceName: string;
  appointmentType: "grooming" | "veterinary";
  appointmentDate: string;
  timeSlot: string;
  notes: string;
  status: AppointmentStatus;
  createdAt: Date;
}

export const Appointment =
  models.Appointment ?? model("Appointment", appointmentSchema);
