import mongoose, { Schema, model, models } from "mongoose";

/**
 * Pet model.
 *
 * `ownerId` stores the id of the Better Auth user that owns this pet.
 * We keep it as a string so it works with any id format Better Auth uses,
 * and every query is scoped by ownerId so users only see their own pets.
 */
const petSchema = new Schema(
  {
    ownerId: { type: String, required: true, index: true },
    name: { type: String, required: true, trim: true, maxlength: 40 },
    type: { type: String, enum: ["Dog", "Cat", "Other"], required: true },
    breed: { type: String, required: true, trim: true, maxlength: 60 },
    age: { type: String, required: true, trim: true, maxlength: 20 },
    gender: { type: String, enum: ["Male", "Female"], required: true },
    weight: { type: String, required: true, trim: true, maxlength: 20 },
    image: { type: String, default: "" },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export interface PetDoc {
  _id: mongoose.Types.ObjectId;
  ownerId: string;
  name: string;
  type: "Dog" | "Cat" | "Other";
  breed: string;
  age: string;
  gender: "Male" | "Female";
  weight: string;
  image: string;
  createdAt: Date;
}

export const Pet = models.Pet ?? model("Pet", petSchema);
