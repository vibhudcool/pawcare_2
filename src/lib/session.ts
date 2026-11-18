import { headers } from "next/headers";
import { getAuth } from "./auth";

/** Returns the current Better Auth session (or null) on the server. */
export async function getSession() {
  const auth = await getAuth();
  const requestHeaders = await headers();
  return auth.api.getSession({ headers: requestHeaders });
}

export async function requireUser() {
  const session = await getSession();
  return session?.user ?? null;
}
