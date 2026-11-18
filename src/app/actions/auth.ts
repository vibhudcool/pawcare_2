"use server";

import { getAuth } from "@/lib/auth";
import type { ActionResult } from "@/types";

/** Resends the Better Auth verification email (delivered via Resend). */
export async function resendVerificationEmail(email: string): Promise<ActionResult> {
  if (!email || !email.includes("@")) {
    return { success: false, error: "Please provide a valid email address." };
  }

  try {
    const auth = await getAuth();
    await auth.api.sendVerificationEmail({ body: { email } });
    return { success: true };
  } catch (error) {
    console.error("[PawCare] Failed to resend verification email:", error);
    return {
      success: false,
      error: "Could not send the verification email. Please try again later.",
    };
  }
}
