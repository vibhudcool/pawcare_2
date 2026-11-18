"use server";

import { revalidatePath } from "next/cache";
import { profileSchema } from "@/lib/validations/auth";
import { requireUser } from "@/lib/session";
import { getDatabase } from "@/lib/db";
import type { ActionResult } from "@/types";

/**
 * Updates the signed-in user's profile in Better Auth's `user` collection.
 * We look the user up by email (unique) so we never have to trust an
 * id coming from the client.
 */
export async function updateProfile(input: unknown): Promise<ActionResult> {
  const user = await requireUser();
  if (!user) return { success: false, error: "You must be signed in." };

  const parsed = profileSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Invalid profile details.",
    };
  }

  try {
    const db = await getDatabase();
    await db.collection("user").updateOne(
      { email: user.email },
      {
        $set: {
          name: parsed.data.name,
          image: parsed.data.image ? parsed.data.image : null,
        },
      }
    );
    revalidatePath("/dashboard/profile");
    revalidatePath("/dashboard");
    return { success: true };
  } catch {
    return { success: false, error: "Could not update your profile. Please try again." };
  }
}
