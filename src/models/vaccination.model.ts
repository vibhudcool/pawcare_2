import mongoose, { Schema, model, models } from "mongoose";

const vaccinationSchema = new Schema(
  {
    ownerId: { type: String, required: true, index: true },
    petId: { type: String, required: true, index: true },
    vaccineName: { type: String, required: true, trim: true, maxlength: 80 },
    // Dates are stored as YYYY-MM-DD strings.
    vaccinationDate: { type: String, required: true },
    nextDueDate: { type: String, required: true },
    notes: { type: String, default: "", maxlength: 300 },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export interface VaccinationDoc {
  _id: mongoose.Types.ObjectId;
  ownerId: string;
  petId: string;
  vaccineName: string;
  vaccinationDate: string;
  nextDueDate: string;
  notes: string;
  createdAt: Date;
}

export const Vaccination =
  models.Vaccination ?? model("Vaccination", vaccinationSchema);
