import { getSession } from "./session";

/**
 * Admin portal access.
 *
 * The admin is identified by the `ADMIN_EMAIL` environment variable —
 * simple and easy to explain in a student project, and it means we never
 * have to trust a role flag sent from the client.
 */
export function isAdminEmail(email: string | null | undefined): boolean {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail || !email) return false;
  return email.trim().toLowerCase() === adminEmail.trim().toLowerCase();
}

export async function isAdminSession(): Promise<boolean> {
  const session = await getSession();
  return isAdminEmail(session?.user.email);
}

/** Returns the admin user, or null when the visitor is not the admin. */
export async function requireAdminUser() {
  const session = await getSession();
  if (!session?.user || !isAdminEmail(session.user.email)) return null;
  return session.user;
}
