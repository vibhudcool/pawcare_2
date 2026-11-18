import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { Resend } from "resend";
import type { Db } from "mongodb";
import { getDatabase } from "./db";
import { resetPasswordEmailHtml, verificationEmailHtml } from "./emails";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

/**
 * Fallback secret so the app still boots in a demo/evaluation setup.
 * ALWAYS set BETTER_AUTH_SECRET in .env.local for real use.
 */
const secret =
  process.env.BETTER_AUTH_SECRET ?? "pawcare-dev-secret-change-me-in-production";

// Resend is optional at boot: without an API key the app still runs,
// emails are just skipped (and logged) until RESEND_API_KEY is set.
const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const emailFrom = process.env.EMAIL_FROM ?? "PawCare <onboarding@resend.dev>";

async function sendEmail(
  to: string,
  subject: string,
  html: string,
  url?: string
) {
  if (!resend) {
    // Helpful in local development: print the link instead of sending it.
    console.warn(
      `[PawCare] RESEND_API_KEY not set — skipping email "${subject}" to ${to}` +
        (url ? `. Dev link: ${url}` : "")
    );
    return;
  }
  try {
    await resend.emails.send({ from: emailFrom, to, subject, html });
  } catch (error) {
    // Never break the auth flow because an email failed — just log it.
    console.error(`[PawCare] Failed to send email to ${to}:`, error);
  }
}

function buildAuth(db: Db) {
  return betterAuth({
    baseURL: appUrl,
    secret,
    database: mongodbAdapter(db),

    emailAndPassword: {
      enabled: true,
      // Sign-in stays open, but a verification email is sent on sign-up
      // (see emailVerification.sendOnSignUp) and the dashboard shows a
      // reminder banner until the address is verified.
      requireEmailVerification: false,
      sendResetPassword: async ({ user, url }) => {
        await sendEmail(
          user.email,
          "Reset your PawCare password",
          resetPasswordEmailHtml(user.name, url),
          url
        );
      },
    },

    emailVerification: {
      sendOnSignUp: true,
      // Sign the user in automatically after they click the email link.
      autoSignInAfterVerification: true,
      sendVerificationEmail: async ({ user, url }) => {
        await sendEmail(
          user.email,
          "Verify your PawCare email",
          verificationEmailHtml(user.name, url),
          url
        );
      },
    },

    socialProviders: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID ?? "",
        clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      },
    },
  });
}

let authInstance: ReturnType<typeof buildAuth> | null = null;

/**
 * Better Auth is created lazily so we can first establish the MongoDB
 * connection (the adapter needs the live Db handle).
 */
export async function getAuth() {
  if (!authInstance) {
    const db = await getDatabase();
    authInstance = buildAuth(db);
  }
  return authInstance;
}
